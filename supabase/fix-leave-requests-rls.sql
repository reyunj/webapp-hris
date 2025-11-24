-- Fix RLS policies for leave_requests table
-- Run this in Supabase SQL Editor

-- Ensure RLS is enabled
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Employees can create leave requests" ON leave_requests;
DROP POLICY IF EXISTS "Employees can view their own leave requests" ON leave_requests;
DROP POLICY IF EXISTS "HR and Managers can view all leave requests" ON leave_requests;

-- Policy 1: Allow all authenticated users to insert (we check employee_id in API)
CREATE POLICY "Employees can create leave requests"
ON leave_requests FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 2: Allow users to view their own leave requests
CREATE POLICY "Employees can view their own leave requests"
ON leave_requests FOR SELECT
TO authenticated
USING (
  employee_id IN (
    SELECT id FROM employees WHERE user_id = auth.uid()
  )
);

-- Policy 3: Allow HR managers and admins to view all leave requests
CREATE POLICY "HR and Managers can view all leave requests"
ON leave_requests FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('super_admin', 'admin', 'hr_manager', 'manager')
  )
);

-- Policy 4: Allow HR and managers to update leave requests (for approval/rejection)
CREATE POLICY "HR and Managers can update leave requests"
ON leave_requests FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('super_admin', 'admin', 'hr_manager', 'manager')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('super_admin', 'admin', 'hr_manager', 'manager')
  )
);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'leave_requests'
ORDER BY policyname;
