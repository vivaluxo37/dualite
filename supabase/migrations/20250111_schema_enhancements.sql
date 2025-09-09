-- Schema enhancements for Dualite platform features
-- This migration adds new tables and columns for admin dashboard, AI matcher, and content management

-- Add new columns to existing brokers table for SEO and enhanced features
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255);
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS seo_keywords TEXT[];
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS featured_image_url VARCHAR(255);
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS social_media JSONB;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS trading_instruments TEXT[];
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS account_types JSONB;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_brokers_seo_keywords ON brokers USING GIN(seo_keywords);
CREATE INDEX IF NOT EXISTS idx_brokers_featured ON brokers(is_active, trust_score DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_brokers_country ON brokers(country) WHERE is_active = true;

-- Create admin activity tracking table
CREATE TABLE IF NOT EXISTS admin_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    target_table VARCHAR(50),
    target_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for admin activity log
CREATE INDEX IF NOT EXISTS idx_admin_activity_user_id ON admin_activity_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at ON admin_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_activity_action_type ON admin_activity_log(action_type);

-- Enable RLS and create policy for admin activity log
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can view all activity logs" ON admin_activity_log
    FOR SELECT USING (auth.uid() IN (
        SELECT id FROM users WHERE role = 'admin'
    ));

-- Create content management table
CREATE TABLE IF NOT EXISTS content_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content_type VARCHAR(50) NOT NULL, -- 'article', 'image', 'video', 'document'
    content_data JSONB NOT NULL,
    file_url VARCHAR(255),
    file_size BIGINT,
    mime_type VARCHAR(100),
    tags TEXT[],
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for content items
CREATE INDEX IF NOT EXISTS idx_content_items_type ON content_items(content_type);
CREATE INDEX IF NOT EXISTS idx_content_items_published ON content_items(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_items_tags ON content_items USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_content_items_created_by ON content_items(created_by);

-- Enable RLS and create policies for content items
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published content" ON content_items
    FOR SELECT USING (is_published = true);
CREATE POLICY "Admin can manage all content" ON content_items
    FOR ALL USING (auth.uid() IN (
        SELECT id FROM users WHERE role = 'admin'
    ));

-- Create AI matcher results tracking table
CREATE TABLE IF NOT EXISTS ai_matcher_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    quiz_responses JSONB NOT NULL,
    matched_brokers JSONB NOT NULL, -- Array of broker IDs with scores
    algorithm_version VARCHAR(20) DEFAULT '1.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for AI matcher results
CREATE INDEX IF NOT EXISTS idx_ai_matcher_user_id ON ai_matcher_results(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_matcher_created_at ON ai_matcher_results(created_at DESC);

-- Enable RLS and create policies for AI matcher results
ALTER TABLE ai_matcher_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own matcher results" ON ai_matcher_results
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own matcher results" ON ai_matcher_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to update broker SEO metrics
CREATE OR REPLACE FUNCTION update_broker_seo_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-generate SEO title if not provided
    IF NEW.seo_title IS NULL OR NEW.seo_title = '' THEN
        NEW.seo_title := NEW.name || ' Review - Detailed Analysis & Rating';
    END IF;
    
    -- Auto-generate SEO description if not provided
    IF NEW.seo_description IS NULL OR NEW.seo_description = '' THEN
        NEW.seo_description := 'Comprehensive review of ' || NEW.name || 
            '. Trust score: ' || NEW.trust_score || '/100. ' ||
            'Min deposit: $' || NEW.min_deposit || '. Read detailed analysis.';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for broker SEO updates
DROP TRIGGER IF EXISTS broker_seo_update_trigger ON brokers;
CREATE TRIGGER broker_seo_update_trigger
    BEFORE INSERT OR UPDATE ON brokers
    FOR EACH ROW
    EXECUTE FUNCTION update_broker_seo_metrics();

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON admin_activity_log TO anon, authenticated;
GRANT SELECT ON content_items TO anon, authenticated;
GRANT ALL PRIVILEGES ON ai_matcher_results TO authenticated;
GRANT SELECT, UPDATE ON brokers TO authenticated;
GRANT INSERT ON admin_activity_log TO authenticated;
GRANT INSERT, UPDATE ON content_items TO authenticated;