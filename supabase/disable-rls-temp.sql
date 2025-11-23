-- TEMPORARY FIX: Disable RLS on employees table for testing
-- Run this in Supabase SQL Editor

-- Disable RLS on employees table
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;

-- This allows all operations without policy checks
-- WARNING: Only use this for development/testing
-- Re-enable RLS later with proper policies for production
