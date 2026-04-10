-- Create assessments table for storing all assessment responses
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  org_name TEXT NOT NULL,
  path TEXT NOT NULL CHECK (path IN ('quick', 'detailed')),
  quick_answers JSONB,
  dimension_scores JSONB,
  completed_dimension INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_assessments_email ON assessments(email);
CREATE INDEX IF NOT EXISTS idx_assessments_org_name ON assessments(org_name);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_path ON assessments(path);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts/reads (for public assessments)
CREATE POLICY "Allow anonymous access" ON assessments
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create custom_measures table for storing organization-specific scoring guidance
CREATE TABLE IF NOT EXISTS custom_measures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_name TEXT NOT NULL,
  dims_config JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT
);

-- Create unique index to ensure one config per org
CREATE UNIQUE INDEX IF NOT EXISTS idx_custom_measures_org_name ON custom_measures(org_name);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_custom_measures_created_at ON custom_measures(created_at DESC);

-- Enable Row Level Security for custom_measures
ALTER TABLE custom_measures ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous access to custom_measures
CREATE POLICY "Allow anonymous access to measures" ON custom_measures
  FOR ALL
  USING (true)
  WITH CHECK (true);
