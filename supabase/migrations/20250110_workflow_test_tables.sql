-- Test results tracking tables for workflow testing

-- Table for storing workflow test results
CREATE TABLE IF NOT EXISTS workflow_test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_type TEXT NOT NULL, -- 'full_workflow', 'component_tests', 'integration_tests'
  verification_results JSONB NOT NULL,
  workflow_results JSONB,
  test_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing workflow test reports
CREATE TABLE IF NOT EXISTS workflow_test_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  test_type TEXT NOT NULL,
  components JSONB NOT NULL,
  summary JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing workflow test failures
CREATE TABLE IF NOT EXISTS workflow_test_failures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  test_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing workflow performance metrics
CREATE TABLE IF NOT EXISTS workflow_performance_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id TEXT NOT NULL,
  component_name TEXT NOT NULL,
  execution_time INTEGER NOT NULL, -- in milliseconds
  memory_usage INTEGER, -- in MB
  success BOOLEAN NOT NULL,
  error_message TEXT,
  metrics_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workflow_test_results_type ON workflow_test_results(test_type);
CREATE INDEX IF NOT EXISTS idx_workflow_test_results_timestamp ON workflow_test_results(test_timestamp);

CREATE INDEX IF NOT EXISTS idx_workflow_test_reports_type ON workflow_test_reports(test_type);
CREATE INDEX IF NOT EXISTS idx_workflow_test_reports_timestamp ON workflow_test_reports(test_timestamp);

CREATE INDEX IF NOT EXISTS idx_workflow_test_failures_timestamp ON workflow_test_failures(test_timestamp);

CREATE INDEX IF NOT EXISTS idx_workflow_performance_metrics_workflow ON workflow_performance_metrics(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_performance_metrics_component ON workflow_performance_metrics(component_name);
CREATE INDEX IF NOT EXISTS idx_workflow_performance_metrics_timestamp ON workflow_performance_metrics(metrics_timestamp);

-- Enable RLS
ALTER TABLE workflow_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_test_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_test_failures ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_performance_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Enable read access for all users" ON workflow_test_results
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON workflow_test_results
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON workflow_test_reports
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON workflow_test_reports
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON workflow_test_failures
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON workflow_test_failures
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON workflow_performance_metrics
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON workflow_performance_metrics
    FOR INSERT WITH CHECK (true);