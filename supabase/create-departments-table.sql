-- Create departments table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS departments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  manager_id UUID REFERENCES employees(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view departments"
ON departments FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can insert departments"
ON departments FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admins can update departments"
ON departments FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admins can delete departments"
ON departments FOR DELETE
TO authenticated
USING (true);

-- Insert default departments
INSERT INTO departments (name, description) VALUES
  ('Engineering', 'Software development and technical teams'),
  ('Human Resources', 'HR and people operations'),
  ('Sales', 'Sales and business development'),
  ('Marketing', 'Marketing and communications'),
  ('Finance', 'Finance and accounting'),
  ('Operations', 'Operations and logistics'),
  ('Customer Support', 'Customer service and support'),
  ('Product', 'Product management and design'),
  ('Legal', 'Legal and compliance'),
  ('Administration', 'General administration')
ON CONFLICT (name) DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
