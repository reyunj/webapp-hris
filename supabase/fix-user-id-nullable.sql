-- Make user_id nullable in employees table
-- Run this in Supabase SQL Editor

ALTER TABLE employees 
ALTER COLUMN user_id DROP NOT NULL;

-- This allows employees to be created without linking to an auth user
-- You can link them later if needed
