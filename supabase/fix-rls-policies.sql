-- Fix infinite recursion in RLS policies for employees table
-- Run this in your Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view employees based on role" ON employees;
DROP POLICY IF EXISTS "Users can insert employees based on role" ON employees;
DROP POLICY IF EXISTS "Users can update employees based on role" ON employees;
DROP POLICY IF EXISTS "Users can delete employees based on role" ON employees;

-- Recreate policies without recursion
-- Allow authenticated users to view all employees
CREATE POLICY "Authenticated users can view employees"
ON employees FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert employees
CREATE POLICY "Authenticated users can insert employees"
ON employees FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update employees
CREATE POLICY "Authenticated users can update employees"
ON employees FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete employees
CREATE POLICY "Authenticated users can delete employees"
ON employees FOR DELETE
TO authenticated
USING (true);

-- Note: For production, you should implement proper role-based policies
-- This simplified version allows all authenticated users to manage employees
-- You can add role checks later using the profiles table
