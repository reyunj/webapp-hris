-- Setup Admin User for junrey1296@gmail.com
-- Run this SQL in Supabase SQL Editor after creating your account

-- Step 1: First, sign up with your email at http://localhost:3000/login
-- Step 2: After signup, find your user UUID in Supabase Dashboard > Authentication > Users
-- Step 3: Replace 'YOUR_USER_UUID_HERE' below with your actual UUID
-- Step 4: Run this SQL in Supabase SQL Editor

-- Create admin profile
INSERT INTO profiles (id, email, full_name, role, department)
VALUES (
  'YOUR_USER_UUID_HERE',  -- Replace with your actual UUID from Supabase Auth
  'junrey1296@gmail.com',
  'Admin User',
  'admin',
  'Administration'
)
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  email = 'junrey1296@gmail.com',
  updated_at = NOW();

-- Create employee record for the admin
INSERT INTO employees (
  user_id,
  employee_number,
  first_name,
  last_name,
  email,
  hire_date,
  department,
  position,
  employment_type,
  status
)
VALUES (
  'YOUR_USER_UUID_HERE',  -- Replace with your actual UUID
  'EMP001',
  'Junrey',
  'Admin',
  'junrey1296@gmail.com',
  CURRENT_DATE,
  'Administration',
  'System Administrator',
  'full_time',
  'active'
)
ON CONFLICT (user_id)
DO UPDATE SET
  email = 'junrey1296@gmail.com',
  status = 'active',
  updated_at = NOW();

-- Create initial leave balances for the admin user
INSERT INTO leave_balances (employee_id, leave_type, total_days, used_days, remaining_days, year)
SELECT 
  e.id,
  leave_type,
  total_days,
  0,
  total_days,
  EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER
FROM employees e
CROSS JOIN (
  VALUES 
    ('vacation', 20),
    ('sick', 10),
    ('personal', 5)
) AS leave_types(leave_type, total_days)
WHERE e.user_id = 'YOUR_USER_UUID_HERE'  -- Replace with your actual UUID
ON CONFLICT (employee_id, leave_type, year) 
DO NOTHING;

-- Verify the setup
SELECT 
  p.id,
  p.email,
  p.role,
  e.employee_number,
  e.first_name,
  e.last_name,
  e.position,
  e.status
FROM profiles p
LEFT JOIN employees e ON e.user_id = p.id
WHERE p.email = 'junrey1296@gmail.com';
