-- Re-enable RLS on employees table with proper policies
-- Run this in Supabase SQL Editor

-- Step 1: Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Authenticated users can view employees" ON employees;
DROP POLICY IF EXISTS "Authenticated users can insert employees" ON employees;
DROP POLICY IF EXISTS "Authenticated users can update employees" ON employees;
DROP POLICY IF EXISTS "Authenticated users can delete employees" ON employees;

-- Step 3: Create simple, non-recursive policies

-- Allow all authenticated users to view employees
CREATE POLICY "Authenticated users can view employees"
ON employees FOR SELECT
TO authenticated
USING (true);

-- Allow all authenticated users to insert employees
CREATE POLICY "Authenticated users can insert employees"
ON employees FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow all authenticated users to update employees
CREATE POLICY "Authenticated users can update employees"
ON employees FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow all authenticated users to delete employees
CREATE POLICY "Authenticated users can delete employees"
ON employees FOR DELETE
TO authenticated
USING (true);

-- Note: These policies allow all authenticated users to manage employees
-- For production, you can add role-based restrictions like:
-- 
-- USING (
--   EXISTS (
--     SELECT 1 FROM profiles
--     WHERE profiles.id = auth.uid()
--     AND profiles.role IN ('admin', 'hr_manager')
--   )
-- )
--
-- But only after ensuring the profiles table doesn't reference employees
-- to avoid circular dependencies
