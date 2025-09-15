-- Enhanced SEO Content Workflow Tables
-- Adds support for AI agent integration and content pipeline management

-- Content pipeline schedules table
CREATE TABLE IF NOT EXISTS content_pipeline_schedules (
    id TEXT PRIMARY KEY,
    topic TEXT NOT NULL,
    category_id TEXT REFERENCES blog_categories(id),
    tags TEXT[] DEFAULT '{}',
    target_date TIMESTAMP WITH TIME ZONE NOT NULL,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    status TEXT CHECK (status IN ('scheduled', 'in_progress', 'completed', 'failed')) DEFAULT 'scheduled',
    estimated_words INTEGER DEFAULT 1000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content suggestions table for future content ideas
CREATE TABLE IF NOT EXISTS content_suggestions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id TEXT REFERENCES blog_posts(id) ON DELETE CASCADE,
    suggestions JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO performance metrics table
CREATE TABLE IF NOT EXISTS seo_performance_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id TEXT REFERENCES blog_posts(id) ON DELETE CASCADE,
    seo_score INTEGER DEFAULT 0,
    readability_score INTEGER DEFAULT 0,
    keyword_density REAL DEFAULT 0.0,
    content_depth_score INTEGER DEFAULT 0,
    engagement_rate REAL DEFAULT 0.0,
    view_count INTEGER DEFAULT 0,
    social_shares INTEGER DEFAULT 0,
    backlink_count INTEGER DEFAULT 0,
    keyword_rankings JSONB DEFAULT '{}',
    page_load_time REAL DEFAULT 0.0,
    mobile_friendly_score INTEGER DEFAULT 0,
    core_web_vitals JSONB DEFAULT '{}',
    measured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI agent workflow logs table
CREATE TABLE IF NOT EXISTS ai_agent_workflow_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workflow_id TEXT NOT NULL,
    agent_name TEXT NOT NULL,
    agent_type TEXT NOT NULL,
    input_data JSONB,
    output_data JSONB,
    execution_time INTEGER, -- in milliseconds
    status TEXT CHECK (status IN ('success', 'failed', 'timeout')) NOT NULL,
    error_message TEXT,
    tokens_used INTEGER DEFAULT 0,
    cost REAL DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content optimization tasks table
CREATE TABLE IF NOT EXISTS content_optimization_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id TEXT REFERENCES blog_posts(id) ON DELETE CASCADE,
    task_type TEXT CHECK (task_type IN ('refresh', 'meta_optimization', 'structure_optimization', 'keyword_optimization', 'readability_improvement')) NOT NULL,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')) DEFAULT 'pending',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    result_data JSONB,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitor analysis results table
CREATE TABLE IF NOT EXISTS competitor_analysis_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    competitor_domain TEXT NOT NULL,
    analysis_type TEXT CHECK (analysis_type IN ('content_gap', 'keyword_analysis', 'backlink_profile', 'content_strategy', 'technical_seo')) NOT NULL,
    analysis_data JSONB NOT NULL,
    insights JSONB DEFAULT '{}',
    opportunities JSONB DEFAULT '{}',
    threats JSONB DEFAULT '{}',
    analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trend analysis results table
CREATE TABLE IF NOT EXISTS trend_analysis_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trend_name TEXT NOT NULL,
    trend_category TEXT CHECK (trend_category IN ('market_trend', 'search_trend', 'content_trend', 'technology_trend')) NOT NULL,
    trend_data JSONB NOT NULL,
    impact_level TEXT CHECK (impact_level IN ('low', 'medium', 'high')) DEFAULT 'medium',
    content_opportunities JSONB DEFAULT '{}',
    target_keywords TEXT[] DEFAULT '{}',
    timeline_notes TEXT,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content publishing queue table
CREATE TABLE IF NOT EXISTS content_publishing_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id TEXT REFERENCES blog_posts(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT CHECK (status IN ('scheduled', 'publishing', 'published', 'failed')) DEFAULT 'scheduled',
    publish_to_channels TEXT[] DEFAULT ARRAY['web'],
    social_media_promotion BOOLEAN DEFAULT false,
    email_notification BOOLEAN DEFAULT false,
    sitemap_update BOOLEAN DEFAULT true,
    published_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_pipeline_schedules_target_date ON content_pipeline_schedules(target_date);
CREATE INDEX IF NOT EXISTS idx_content_pipeline_schedules_status ON content_pipeline_schedules(status);
CREATE INDEX IF NOT EXISTS idx_content_pipeline_schedules_priority ON content_pipeline_schedules(priority);

CREATE INDEX IF NOT EXISTS idx_seo_performance_metrics_post_id ON seo_performance_metrics(post_id);
CREATE INDEX IF NOT EXISTS idx_seo_performance_metrics_seo_score ON seo_performance_metrics(seo_score DESC);
CREATE INDEX IF NOT EXISTS idx_seo_performance_metrics_measured_at ON seo_performance_metrics(measured_at);

CREATE INDEX IF NOT EXISTS idx_ai_agent_workflow_logs_workflow_id ON ai_agent_workflow_logs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_workflow_logs_agent_name ON ai_agent_workflow_logs(agent_name);
CREATE INDEX IF NOT EXISTS idx_ai_agent_workflow_logs_created_at ON ai_agent_workflow_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_content_optimization_tasks_post_id ON content_optimization_tasks(post_id);
CREATE INDEX IF NOT EXISTS idx_content_optimization_tasks_status ON content_optimization_tasks(status);
CREATE INDEX IF NOT EXISTS idx_content_optimization_tasks_task_type ON content_optimization_tasks(task_type);

CREATE INDEX IF NOT EXISTS idx_competitor_analysis_results_domain ON competitor_analysis_results(competitor_domain);
CREATE INDEX IF NOT EXISTS idx_competitor_analysis_results_type ON competitor_analysis_results(analysis_type);

CREATE INDEX IF NOT EXISTS idx_trend_analysis_results_category ON trend_analysis_results(trend_category);
CREATE INDEX IF NOT EXISTS idx_trend_analysis_results_impact ON trend_analysis_results(impact_level);
CREATE INDEX IF NOT EXISTS idx_trend_analysis_results_detected_at ON trend_analysis_results(detected_at);

CREATE INDEX IF NOT EXISTS idx_content_publishing_queue_scheduled_time ON content_publishing_queue(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_content_publishing_queue_status ON content_publishing_queue(status);

-- Enable Row Level Security (RLS)
ALTER TABLE content_pipeline_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_workflow_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_optimization_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE trend_analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_publishing_queue ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for content pipeline schedules
CREATE POLICY "Enable read access for all users" ON content_pipeline_schedules FOR SELECT USING (true);
CREATE POLICY "Enable insert access for authenticated users" ON content_pipeline_schedules FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON content_pipeline_schedules FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete access for authenticated users" ON content_pipeline_schedules FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for content suggestions
CREATE POLICY "Enable read access for all users" ON content_suggestions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for authenticated users" ON content_suggestions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create RLS policies for SEO performance metrics
CREATE POLICY "Enable read access for all users" ON seo_performance_metrics FOR SELECT USING (true);
CREATE POLICY "Enable insert access for authenticated users" ON seo_performance_metrics FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON seo_performance_metrics FOR UPDATE USING (auth.role() = 'authenticated');

-- Create RLS policies for AI agent workflow logs
CREATE POLICY "Enable read access for all users" ON ai_agent_workflow_logs FOR SELECT USING (true);
CREATE POLICY "Enable insert access for authenticated users" ON ai_agent_workflow_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create RLS policies for content optimization tasks
CREATE POLICY "Enable read access for all users" ON content_optimization_tasks FOR SELECT USING (true);
CREATE POLICY "Enable insert access for authenticated users" ON content_optimization_tasks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON content_optimization_tasks FOR UPDATE USING (auth.role() = 'authenticated');

-- Create RLS policies for competitor analysis results
CREATE POLICY "Enable read access for all users" ON competitor_analysis_results FOR SELECT USING (true);
CREATE POLICY "Enable insert access for authenticated users" ON competitor_analysis_results FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create RLS policies for trend analysis results
CREATE POLICY "Enable read access for all users" ON trend_analysis_results FOR SELECT USING (true);
CREATE POLICY "Enable insert access for authenticated users" ON trend_analysis_results FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create RLS policies for content publishing queue
CREATE POLICY "Enable read access for all users" ON content_publishing_queue FOR SELECT USING (true);
CREATE POLICY "Enable insert access for authenticated users" ON content_publishing_queue FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON content_publishing_queue FOR UPDATE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_content_pipeline_schedules_updated_at
    BEFORE UPDATE ON content_pipeline_schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_suggestions_updated_at
    BEFORE UPDATE ON content_suggestions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments to tables
COMMENT ON TABLE content_pipeline_schedules IS 'Content pipeline scheduling and management';
COMMENT ON TABLE content_suggestions IS 'AI-generated content suggestions and recommendations';
COMMENT ON TABLE seo_performance_metrics IS 'SEO performance tracking and analytics';
COMMENT ON TABLE ai_agent_workflow_logs IS 'AI agent execution logs and monitoring';
COMMENT ON TABLE content_optimization_tasks IS 'Content optimization and improvement tasks';
COMMENT ON TABLE competitor_analysis_results IS 'Competitor analysis and benchmarking results';
COMMENT ON TABLE trend_analysis_results IS 'Market and content trend analysis results';
COMMENT ON TABLE content_publishing_queue IS 'Content publishing queue and scheduling';