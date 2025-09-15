-- Create SEO workflow tables
-- These tables store SEO-related data for brokers

-- Table for storing broker keywords
CREATE TABLE IF NOT EXISTS broker_keywords (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    broker_name TEXT NOT NULL,
    keywords TEXT[] DEFAULT '{}',
    primary_keywords TEXT[] DEFAULT '{}',
    location_keywords TEXT[] DEFAULT '{}',
    feature_keywords TEXT[] DEFAULT '{}',
    comparison_keywords TEXT[] DEFAULT '{}',
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing structured data
CREATE TABLE IF NOT EXISTS broker_structured_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    broker_name TEXT NOT NULL,
    review_structured_data JSONB,
    faq_structured_data JSONB,
    howto_structured_data JSONB,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_broker_keywords_broker_id ON broker_keywords(broker_id);
CREATE INDEX IF NOT EXISTS idx_broker_keywords_broker_name ON broker_keywords(broker_name);
CREATE INDEX IF NOT EXISTS idx_broker_structured_data_broker_id ON broker_structured_data(broker_id);
CREATE INDEX IF NOT EXISTS idx_broker_structured_data_broker_name ON broker_structured_data(broker_name);

-- Add RLS policies
ALTER TABLE broker_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_structured_data ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can view broker keywords" ON broker_keywords
    FOR SELECT USING (true);

CREATE POLICY "Public can view broker structured data" ON broker_structured_data
    FOR SELECT USING (true);

-- Allow authenticated users to insert/update
CREATE POLICY "Authenticated users can insert broker keywords" ON broker_keywords
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update broker keywords" ON broker_keywords
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert broker structured data" ON broker_structured_data
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update broker structured data" ON broker_structured_data
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER handle_broker_keywords_updated_at
    BEFORE UPDATE ON broker_keywords
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_broker_structured_data_updated_at
    BEFORE UPDATE ON broker_structured_data
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();