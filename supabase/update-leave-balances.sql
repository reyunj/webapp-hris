-- Update leave_balances table and add auto-initialization trigger
-- Run this in Supabase SQL Editor

-- Add 'emergency' to the leave_type check constraint if not already there
DO $$ 
BEGIN
  ALTER TABLE leave_balances DROP CONSTRAINT IF EXISTS leave_balances_leave_type_check;
  ALTER TABLE leave_balances ADD CONSTRAINT leave_balances_leave_type_check 
  CHECK (leave_type IN ('vacation', 'sick', 'emergency', 'personal', 'maternity', 'paternity', 'unpaid'));
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Update remaining_days to be a generated column if it isn't already
DO $$
BEGIN
  ALTER TABLE leave_balances 
  DROP COLUMN IF EXISTS remaining_days CASCADE;
  
  ALTER TABLE leave_balances 
  ADD COLUMN remaining_days NUMERIC GENERATED ALWAYS AS (total_days - used_days) STORED;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate them
DROP POLICY IF EXISTS "Employees can view their own leave balances" ON leave_balances;
DROP POLICY IF EXISTS "HR and Managers can view all leave balances" ON leave_balances;
DROP POLICY IF EXISTS "System can insert leave balances" ON leave_balances;
DROP POLICY IF EXISTS "HR can update leave balances" ON leave_balances;

-- RLS Policies
CREATE POLICY "Employees can view their own leave balances"
ON leave_balances FOR SELECT
TO authenticated
USING (
  employee_id IN (
    SELECT id FROM employees WHERE user_id = auth.uid()
  )
);

CREATE POLICY "HR and Managers can view all leave balances"
ON leave_balances FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('super_admin', 'admin', 'hr_manager', 'manager')
  )
);

CREATE POLICY "System can insert leave balances"
ON leave_balances FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "HR can update leave balances"
ON leave_balances FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('super_admin', 'admin', 'hr_manager')
  )
);

-- Function to initialize leave balances for new employees
CREATE OR REPLACE FUNCTION initialize_employee_leave_balances()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert default leave balances for the new employee
  INSERT INTO leave_balances (employee_id, leave_type, total_days, used_days, year)
  VALUES
    (NEW.id, 'vacation', 15, 0, EXTRACT(YEAR FROM CURRENT_DATE)),
    (NEW.id, 'sick', 15, 0, EXTRACT(YEAR FROM CURRENT_DATE)),
    (NEW.id, 'emergency', 5, 0, EXTRACT(YEAR FROM CURRENT_DATE))
  ON CONFLICT (employee_id, leave_type, year) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-create leave balances when employee is created
DROP TRIGGER IF EXISTS trigger_initialize_leave_balances ON employees;
CREATE TRIGGER trigger_initialize_leave_balances
AFTER INSERT ON employees
FOR EACH ROW
EXECUTE FUNCTION initialize_employee_leave_balances();

-- Verify the trigger was created
SELECT tgname, tgrelid::regclass, tgenabled 
FROM pg_trigger 
WHERE tgname = 'trigger_initialize_leave_balances';
