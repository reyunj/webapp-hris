-- Initialize leave balances for all existing employees
-- Run this in Supabase SQL Editor

-- Insert leave balances for all employees who don't have them yet
INSERT INTO leave_balances (employee_id, leave_type, total_days, used_days, year)
SELECT 
  e.id,
  leave_type,
  CASE 
    WHEN leave_type = 'vacation' THEN 15
    WHEN leave_type = 'sick' THEN 15
    WHEN leave_type = 'emergency' THEN 5
  END as total_days,
  0 as used_days,
  EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER as year
FROM 
  employees e
CROSS JOIN (
  VALUES ('vacation'), ('sick'), ('emergency')
) AS lt(leave_type)
WHERE NOT EXISTS (
  SELECT 1 
  FROM leave_balances lb 
  WHERE lb.employee_id = e.id 
  AND lb.leave_type = lt.leave_type 
  AND lb.year = EXTRACT(YEAR FROM CURRENT_DATE)
);

-- Verify the results
SELECT 
  e.first_name,
  e.last_name,
  lb.leave_type,
  lb.total_days,
  lb.used_days,
  lb.remaining_days
FROM employees e
LEFT JOIN leave_balances lb ON e.id = lb.employee_id
WHERE lb.year = EXTRACT(YEAR FROM CURRENT_DATE)
ORDER BY e.first_name, lb.leave_type;
