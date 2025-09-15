-- Deployment tracking tables for automated React page deployment

-- Table for storing deployed React components
CREATE TABLE IF NOT EXISTS deployed_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  component TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  dependencies TEXT[] DEFAULT '{}',
  deployed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(path)
);

-- Table for storing generated route configurations
CREATE TABLE IF NOT EXISTS deployed_routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  routes TEXT NOT NULL,
  pages TEXT[] DEFAULT '{}',
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing generated sitemaps
CREATE TABLE IF NOT EXISTS deployed_sitemaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sitemap TEXT NOT NULL,
  pages TEXT[] DEFAULT '{}',
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for tracking deployment status
CREATE TABLE IF NOT EXISTS deployment_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  broker_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  deployed BOOLEAN DEFAULT false,
  deployed_at TIMESTAMP WITH TIME ZONE,
  deployment_errors TEXT[] DEFAULT '{}',
  rolled_back_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deployed_pages_name ON deployed_pages(name);
CREATE INDEX IF NOT EXISTS idx_deployed_pages_path ON deployed_pages(path);
CREATE INDEX IF NOT EXISTS idx_deployed_pages_deployed_at ON deployed_pages(deployed_at);

CREATE INDEX IF NOT EXISTS idx_deployed_routes_generated_at ON deployed_routes(generated_at);

CREATE INDEX IF NOT EXISTS idx_deployed_sitemaps_generated_at ON deployed_sitemaps(generated_at);

CREATE INDEX IF NOT EXISTS idx_deployment_status_broker_id ON deployment_status(broker_id);
CREATE INDEX IF NOT EXISTS idx_deployment_status_deployed_at ON deployment_status(deployed_at);
CREATE INDEX IF NOT EXISTS idx_deployment_status_deployed ON deployment_status(deployed);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_deployment_status_updated_at 
    BEFORE UPDATE ON deployment_status 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE deployed_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployed_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployed_sitemaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployment_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Enable read access for all users" ON deployed_pages
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON deployed_pages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON deployed_pages
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON deployed_pages
    FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON deployed_routes
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON deployed_routes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON deployed_routes
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON deployed_routes
    FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON deployed_sitemaps
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON deployed_sitemaps
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON deployed_sitemaps
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON deployed_sitemaps
    FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON deployment_status
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON deployment_status
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON deployment_status
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON deployment_status
    FOR DELETE USING (true);