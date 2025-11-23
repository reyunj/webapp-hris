-- COMPLETE FIX for employees table RLS
-- This will remove ALL existing policies and create fresh ones
-- Run this ENTIRE script in Supabase SQL Editor

-- Step 1: Disable RLS temporarily
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies (including any from the original schema)
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'employees'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON employees', pol.policyname);
    END LOOP;
END $$;

-- Step 3: Re-enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Step 4: Create NEW simple policies (no recursion)

-- SELECT policy
CREATE POLICY "employees_select_policy"
ON employees FOR SELECT
TO authenticated
USING (true);

-- INSERT policy
CREATE POLICY "employees_insert_policy"
ON employees FOR INSERT
TO authenticated
WITH CHECK (true);

-- UPDATE policy
CREATE POLICY "employees_update_policy"
ON employees FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- DELETE policy
CREATE POLICY "employees_delete_policy"
ON employees FOR DELETE
TO authenticated
USING (true);

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'employees';
