-- Create leave_balances table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS leave_balances (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  leave_type TEXT NOT NULL,
  total_days NUMERIC NOT NULL DEFAULT 0,
  used_days NUMERIC NOT NULL DEFAULT 0,
  remaining_days NUMERIC GENERATED ALWAYS AS (total_days - used_days) STORED,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT leave_balances_employee_type_year_unique UNIQUE (employee_id, leave_type, year),
  CONSTRAINT leave_balances_leave_type_check CHECK (
    leave_type IN ('vacation', 'sick', 'emergency', 'personal', 'maternity', 'paternity')
  )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_leave_balances_employee_id ON leave_balances(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_balances_year ON leave_balances(year);

-- Enable RLS
ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;

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

-- Create updated_at trigger
CREATE TRIGGER update_leave_balances_updated_at 
BEFORE UPDATE ON leave_balances
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

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
