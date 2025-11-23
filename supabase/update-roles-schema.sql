-- Update roles to include all required roles
-- Run this in Supabase SQL Editor

-- Step 1: Drop the existing role check constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Step 2: Add new role constraint with all roles
ALTER TABLE profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('super_admin', 'admin', 'hr_manager', 'manager', 'supervisor', 'employee'));

-- Step 3: Update the default role
ALTER TABLE profiles 
ALTER COLUMN role SET DEFAULT 'employee';

-- Step 4: Create a roles reference table for better management
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  level INTEGER NOT NULL, -- Higher number = more privileges
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert role definitions
INSERT INTO roles (name, display_name, description, level) VALUES
  ('super_admin', 'Super Admin', 'Full system access, can manage everything including admins', 100),
  ('admin', 'Admin', 'System administrator, can manage all modules except super admin functions', 90),
  ('hr_manager', 'HR Manager', 'Manages HR operations, employees, payroll, and leave', 80),
  ('manager', 'Manager', 'Manages team members and approves requests', 70),
  ('supervisor', 'Supervisor', 'Supervises team and can view reports', 60),
  ('employee', 'Employee', 'Regular employee with basic access', 50)
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  level = EXCLUDED.level;

-- Step 5: Create role permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
  id SERIAL PRIMARY KEY,
  role_name TEXT REFERENCES roles(name) ON DELETE CASCADE,
  module TEXT NOT NULL, -- e.g., 'employees', 'payroll', 'leave'
  can_view BOOLEAN DEFAULT false,
  can_create BOOLEAN DEFAULT false,
  can_update BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  can_approve BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role_name, module)
);

-- Insert default permissions
-- Super Admin - Full access to everything
INSERT INTO role_permissions (role_name, module, can_view, can_create, can_update, can_delete, can_approve) VALUES
  ('super_admin', 'employees', true, true, true, true, true),
  ('super_admin', 'payroll', true, true, true, true, true),
  ('super_admin', 'leave', true, true, true, true, true),
  ('super_admin', 'performance', true, true, true, true, true),
  ('super_admin', 'settings', true, true, true, true, true),
  ('super_admin', 'users', true, true, true, true, true)
ON CONFLICT (role_name, module) DO UPDATE SET
  can_view = EXCLUDED.can_view,
  can_create = EXCLUDED.can_create,
  can_update = EXCLUDED.can_update,
  can_delete = EXCLUDED.can_delete,
  can_approve = EXCLUDED.can_approve;

-- Admin - Full access except user management
INSERT INTO role_permissions (role_name, module, can_view, can_create, can_update, can_delete, can_approve) VALUES
  ('admin', 'employees', true, true, true, true, true),
  ('admin', 'payroll', true, true, true, true, true),
  ('admin', 'leave', true, true, true, true, true),
  ('admin', 'performance', true, true, true, true, true),
  ('admin', 'settings', true, true, true, false, true)
ON CONFLICT (role_name, module) DO UPDATE SET
  can_view = EXCLUDED.can_view,
  can_create = EXCLUDED.can_create,
  can_update = EXCLUDED.can_update,
  can_delete = EXCLUDED.can_delete,
  can_approve = EXCLUDED.can_approve;

-- HR Manager - HR operations
INSERT INTO role_permissions (role_name, module, can_view, can_create, can_update, can_delete, can_approve) VALUES
  ('hr_manager', 'employees', true, true, true, true, true),
  ('hr_manager', 'payroll', true, true, true, false, true),
  ('hr_manager', 'leave', true, true, true, false, true),
  ('hr_manager', 'performance', true, true, true, false, true)
ON CONFLICT (role_name, module) DO UPDATE SET
  can_view = EXCLUDED.can_view,
  can_create = EXCLUDED.can_create,
  can_update = EXCLUDED.can_update,
  can_delete = EXCLUDED.can_delete,
  can_approve = EXCLUDED.can_approve;

-- Manager - Team management
INSERT INTO role_permissions (role_name, module, can_view, can_create, can_update, can_delete, can_approve) VALUES
  ('manager', 'employees', true, false, true, false, false),
  ('manager', 'payroll', true, false, false, false, false),
  ('manager', 'leave', true, true, true, false, true),
  ('manager', 'performance', true, true, true, false, true)
ON CONFLICT (role_name, module) DO UPDATE SET
  can_view = EXCLUDED.can_view,
  can_create = EXCLUDED.can_create,
  can_update = EXCLUDED.can_update,
  can_delete = EXCLUDED.can_delete,
  can_approve = EXCLUDED.can_approve;

-- Supervisor - View and limited updates
INSERT INTO role_permissions (role_name, module, can_view, can_create, can_update, can_delete, can_approve) VALUES
  ('supervisor', 'employees', true, false, false, false, false),
  ('supervisor', 'leave', true, false, false, false, false),
  ('supervisor', 'performance', true, false, true, false, false)
ON CONFLICT (role_name, module) DO UPDATE SET
  can_view = EXCLUDED.can_view,
  can_create = EXCLUDED.can_create,
  can_update = EXCLUDED.can_update,
  can_delete = EXCLUDED.can_delete,
  can_approve = EXCLUDED.can_approve;

-- Employee - Own data only
INSERT INTO role_permissions (role_name, module, can_view, can_create, can_update, can_delete, can_approve) VALUES
  ('employee', 'employees', true, false, false, false, false),
  ('employee', 'leave', true, true, false, false, false),
  ('employee', 'performance', true, false, false, false, false)
ON CONFLICT (role_name, module) DO UPDATE SET
  can_view = EXCLUDED.can_view,
  can_create = EXCLUDED.can_create,
  can_update = EXCLUDED.can_update,
  can_delete = EXCLUDED.can_delete,
  can_approve = EXCLUDED.can_approve;

-- Step 6: Enable RLS on new tables
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view roles and permissions (read-only)
CREATE POLICY "Anyone can view roles"
ON roles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Anyone can view role permissions"
ON role_permissions FOR SELECT
TO authenticated
USING (true);

-- Step 7: Fix profiles RLS to allow admin client to insert
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new policies
CREATE POLICY "profiles_select_policy"
ON profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "profiles_insert_policy"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "profiles_update_policy"
ON profiles FOR UPDATE
TO authenticated
USING (id = auth.uid() OR EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.role IN ('super_admin', 'admin', 'hr_manager')
))
WITH CHECK (id = auth.uid() OR EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.role IN ('super_admin', 'admin', 'hr_manager')
));

-- Verify the setup
SELECT * FROM roles ORDER BY level DESC;
SELECT role_name, module, can_view, can_create, can_update, can_delete, can_approve 
FROM role_permissions 
ORDER BY role_name, module;
