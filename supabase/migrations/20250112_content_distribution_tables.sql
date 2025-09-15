-- Create comprehensive content distribution tables
-- This enables tracking of content distribution strategies, performance metrics, and optimizations

-- Content distribution strategies table
CREATE TABLE IF NOT EXISTS content_distribution_strategies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_id TEXT NOT NULL,
    content_type TEXT NOT NULL,
    strategy_data JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'failed')),
    execution_data JSONB,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content performance metrics table
CREATE TABLE IF NOT EXISTS content_performance_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    strategy_id UUID REFERENCES content_distribution_strategies(id) ON DELETE CASCADE,
    content_id TEXT NOT NULL,
    performance_data JSONB NOT NULL,
    timeframe TEXT NOT NULL DEFAULT '7d',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content optimizations table
CREATE TABLE IF NOT EXISTS content_optimizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    performance_id UUID REFERENCES content_performance_metrics(id) ON DELETE CASCADE,
    strategy_id UUID REFERENCES content_distribution_strategies(id) ON DELETE CASCADE,
    optimization_data JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'failed', 'skipped')),
    applied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Distribution campaign tracking table
CREATE TABLE IF NOT EXISTS distribution_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    strategy_id UUID REFERENCES content_distribution_strategies(id) ON DELETE CASCADE,
    campaign_name TEXT NOT NULL,
    platform TEXT NOT NULL,
    campaign_type TEXT NOT NULL,
    budget DECIMAL(10,2),
    target_audience JSONB,
    campaign_config JSONB,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'failed')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    performance_data JSONB
);

-- Social media posts tracking
CREATE TABLE IF NOT EXISTS social_media_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    strategy_id UUID REFERENCES content_distribution_strategies(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    post_id TEXT,
    content TEXT NOT NULL,
    post_url TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    posted_at TIMESTAMP WITH TIME ZONE,
    metrics JSONB,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'posted', 'failed', 'deleted'))
);

-- Email campaigns tracking
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    strategy_id UUID REFERENCES content_distribution_strategies(id) ON DELETE CASCADE,
    campaign_name TEXT NOT NULL,
    segment TEXT NOT NULL,
    subject_line TEXT NOT NULL,
    preview_text TEXT,
    content_html TEXT,
    recipient_count INTEGER DEFAULT 0,
    sent_at TIMESTAMP WITH TIME ZONE,
    metrics JSONB,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'failed'))
);

-- Content syndication tracking
CREATE TABLE IF NOT EXISTS content_syndication (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    strategy_id UUID REFERENCES content_distribution_strategies(id) ON DELETE CASCADE,
    partner_name TEXT NOT NULL,
    partner_type TEXT NOT NULL,
    content_format TEXT NOT NULL,
    submission_url TEXT,
    submission_date DATE,
    approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'published')),
    published_url TEXT,
    syndication_metrics JSONB,
    revenue_sharing DECIMAL(5,2)
);

-- Influencer collaboration tracking
CREATE TABLE IF NOT EXISTS influencer_collaborations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    strategy_id UUID REFERENCES content_distribution_strategies(id) ON DELETE CASCADE,
    influencer_name TEXT NOT NULL,
    platform TEXT NOT NULL,
    collaboration_type TEXT NOT NULL,
    contact_email TEXT,
    outreach_date DATE,
    response_status TEXT NOT NULL DEFAULT 'pending' CHECK (response_status IN ('pending', 'responded', 'accepted', 'declined')),
    content_requirements JSONB,
    compensation_model TEXT,
    compensation_amount DECIMAL(10,2),
    deliverables JSONB,
    performance_metrics JSONB
);

-- Workflow execution tracking
CREATE TABLE IF NOT EXISTS workflow_executions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workflow_type TEXT NOT NULL,
    execution_data JSONB NOT NULL,
    summary JSONB,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('running', 'completed', 'failed')),
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_ms INTEGER
);

-- Distribution channels configuration
CREATE TABLE IF NOT EXISTS distribution_channels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    channel_name TEXT NOT NULL UNIQUE,
    channel_type TEXT NOT NULL,
    capabilities TEXT[] NOT NULL,
    configuration JSONB,
    is_active BOOLEAN DEFAULT true,
    cost_efficiency TEXT NOT NULL,
    engagement_rate TEXT NOT NULL,
    best_for TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_distribution_strategies_content_id ON content_distribution_strategies(content_id);
CREATE INDEX IF NOT EXISTS idx_content_distribution_strategies_status ON content_distribution_strategies(status);
CREATE INDEX IF NOT EXISTS idx_content_distribution_strategies_created_at ON content_distribution_strategies(created_at);

CREATE INDEX IF NOT EXISTS idx_content_performance_metrics_strategy_id ON content_performance_metrics(strategy_id);
CREATE INDEX IF NOT EXISTS idx_content_performance_metrics_content_id ON content_performance_metrics(content_id);
CREATE INDEX IF NOT EXISTS idx_content_performance_metrics_recorded_at ON content_performance_metrics(recorded_at);

CREATE INDEX IF NOT EXISTS idx_content_optimizations_strategy_id ON content_optimizations(strategy_id);
CREATE INDEX IF NOT EXISTS idx_content_optimizations_status ON content_optimizations(status);

CREATE INDEX IF NOT EXISTS idx_distribution_campaigns_strategy_id ON distribution_campaigns(strategy_id);
CREATE INDEX IF NOT EXISTS idx_distribution_campaigns_platform ON distribution_campaigns(platform);
CREATE INDEX IF NOT EXISTS idx_distribution_campaigns_status ON distribution_campaigns(status);

CREATE INDEX IF NOT EXISTS idx_social_media_posts_strategy_id ON social_media_posts(strategy_id);
CREATE INDEX IF NOT EXISTS idx_social_media_posts_platform ON social_media_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_media_posts_status ON social_media_posts(status);

CREATE INDEX IF NOT EXISTS idx_email_campaigns_strategy_id ON email_campaigns(strategy_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_segment ON email_campaigns(segment);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);

CREATE INDEX IF NOT EXISTS idx_content_syndication_strategy_id ON content_syndication(strategy_id);
CREATE INDEX IF NOT EXISTS idx_content_syndication_partner_name ON content_syndication(partner_name);
CREATE INDEX IF NOT EXISTS idx_content_syndication_approval_status ON content_syndication(approval_status);

CREATE INDEX IF NOT EXISTS idx_influencer_collaborations_strategy_id ON influencer_collaborations(strategy_id);
CREATE INDEX IF NOT EXISTS idx_influencer_collaborations_response_status ON influencer_collaborations(response_status);

CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_type ON workflow_executions(workflow_type);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_executed_at ON workflow_executions(executed_at);

-- Create RLS (Row Level Security) policies
ALTER TABLE content_distribution_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE distribution_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_syndication ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE distribution_channels ENABLE ROW LEVEL SECURITY;

-- RLS policies for content_distribution_strategies
CREATE POLICY "Enable read access for all users" ON content_distribution_strategies
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON content_distribution_strategies
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON content_distribution_strategies
    FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS policies for content_performance_metrics
CREATE POLICY "Enable read access for all users" ON content_performance_metrics
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON content_performance_metrics
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS policies for content_optimizations
CREATE POLICY "Enable read access for all users" ON content_optimizations
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON content_optimizations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS policies for distribution_campaigns
CREATE POLICY "Enable read access for all users" ON distribution_campaigns
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON distribution_campaigns
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON distribution_campaigns
    FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS policies for social_media_posts
CREATE POLICY "Enable read access for all users" ON social_media_posts
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON social_media_posts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON social_media_posts
    FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS policies for email_campaigns
CREATE POLICY "Enable read access for all users" ON email_campaigns
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON email_campaigns
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON email_campaigns
    FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS policies for content_syndication
CREATE POLICY "Enable read access for all users" ON content_syndication
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON content_syndication
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS policies for influencer_collaborations
CREATE POLICY "Enable read access for all users" ON influencer_collaborations
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON influencer_collaborations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON influencer_collaborations
    FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS policies for workflow_executions
CREATE POLICY "Enable read access for all users" ON workflow_executions
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON workflow_executions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS policies for distribution_channels
CREATE POLICY "Enable read access for all users" ON distribution_channels
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON distribution_channels
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON distribution_channels
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert default distribution channels
INSERT INTO distribution_channels (channel_name, channel_type, capabilities, configuration, cost_efficiency, engagement_rate, best_for) VALUES
('twitter', 'social_media', ARRAY['posts', 'threads', 'images', 'videos', 'links'], '{"api_endpoint": "https://api.twitter.com", "character_limit": 280}', 'very_high', 'medium', ARRAY['breaking_news', 'quick_updates', 'community_engagement']),
('linkedin', 'social_media', ARRAY['articles', 'posts', 'images', 'videos', 'links'], '{"api_endpoint": "https://api.linkedin.com", "article_length_limit": 125000}', 'medium', 'low', ARRAY['professional_content', 'industry_analysis', 'thought_leadership']),
('facebook', 'social_media', ARRAY['posts', 'images', 'videos', 'links', 'events'], '{"api_endpoint": "https://graph.facebook.com", "post_types": ["link", "photo", "video"]}', 'medium', 'medium', ARRAY['community_building', 'visual_content', 'group_engagement']),
('instagram', 'social_media', ARRAY['images', 'videos', 'stories', 'reels'], '{"api_endpoint": "https://graph.instagram.com", "media_types": ["image", "video", "carousel"]}', 'medium', 'high', ARRAY['visual_content', 'lifestyle_content', 'storytelling']),
('email_newsletter', 'email', ARRAY['html_emails', 'personalization', 'segmentation', 'automation'], '{"smtp_server": "smtp.brokeranalysis.com", "max_recipients": 10000}', 'very_high', 'high', ARRAY['curated_content', 'exclusive_insights', 'lead_nurturing']),
('medium', 'content_syndication', ARRAY['articles', 'publications', 'responses'], '{"api_endpoint": "https://api.medium.com", "article_format": "markdown"}', 'high', 'medium', ARRAY['thought_leadership', 'in_depth_analysis', 'repurposed_content']),
('reddit', 'community', ARRAY['posts', 'comments', 'subreddits'], '{"api_endpoint": "https://oauth.reddit.com", "subreddits": ["forex", "Trading", "investing"]}', 'very_high', 'high', ARRAY['community_discussion', 'ama_sessions', 'niche_expertise']),
('google_ads', 'paid', ARRAY['search_ads', 'display_ads', 'video_ads', 'shopping_ads'], '{"api_endpoint": "https://googleads.googleapis.com", "campaign_types": ["search", "display"]}', 'low', 'medium', ARRAY['targeted_traffic', 'conversions', 'brand_awareness']),
('facebook_ads', 'paid', ARRAY['feed_ads', 'story_ads', 'video_ads', 'collection_ads'], '{"api_endpoint": "https://graph.facebook.com", "ad_formats": ["image", "video", "carousel"]}', 'medium', 'medium', ARRAY['brand_awareness', 'lead_generation', 'conversions'])
ON CONFLICT (channel_name) DO UPDATE SET
    channel_type = EXCLUDED.channel_type,
    capabilities = EXCLUDED.capabilities,
    configuration = EXCLUDED.configuration,
    cost_efficiency = EXCLUDED.cost_efficiency,
    engagement_rate = EXCLUDED.engagement_rate,
    best_for = EXCLUDED.best_for,
    updated_at = NOW();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_content_distribution_strategies_updated_at
    BEFORE UPDATE ON content_distribution_strategies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_distribution_channels_updated_at
    BEFORE UPDATE ON distribution_channels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for better documentation
COMMENT ON TABLE content_distribution_strategies IS 'Stores content distribution strategies with configuration and execution data';
COMMENT ON TABLE content_performance_metrics IS 'Tracks performance metrics for distributed content across channels';
COMMENT ON TABLE content_optimizations IS 'Stores optimization recommendations and implementations for content distribution';
COMMENT ON TABLE distribution_campaigns IS 'Tracks paid and organic distribution campaigns';
COMMENT ON TABLE social_media_posts IS 'Tracks social media posts and their performance';
COMMENT ON TABLE email_campaigns IS 'Tracks email marketing campaigns and metrics';
COMMENT ON TABLE content_syndication IS 'Tracks content syndication to partner websites';
COMMENT ON TABLE influencer_collaborations IS 'Tracks influencer partnerships and collaborations';
COMMENT ON TABLE workflow_executions IS 'Logs workflow execution data and results';
COMMENT ON TABLE distribution_channels IS 'Configuration for available distribution channels';