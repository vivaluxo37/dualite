-- Comprehensive Keyword Research Tables
-- Enhanced structure for storing detailed keyword research data

-- Main keyword research table with detailed metadata
CREATE TABLE IF NOT EXISTS keyword_research (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    keyword TEXT NOT NULL,
    search_volume INTEGER DEFAULT 0,
    keyword_difficulty INTEGER DEFAULT 0,
    commercial_intent INTEGER DEFAULT 0, -- 0-100 scale
    search_intent TEXT CHECK (search_intent IN ('informational', 'commercial', 'transactional', 'navigational')) DEFAULT 'informational',
    content_type TEXT CHECK (content_type IN ('guide', 'review', 'comparison', 'tutorial', 'news', 'faq', 'list')) DEFAULT 'guide',
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    category TEXT NOT NULL,
    subcategory TEXT,
    target_audience TEXT[] DEFAULT '{}',
    geographic_target TEXT[] DEFAULT '{}',
    platforms TEXT[] DEFAULT '{}',
    trading_styles TEXT[] DEFAULT '{}',
    related_keywords TEXT[] DEFAULT '{}',
    long_tail_score INTEGER DEFAULT 0, -- 0-100 scale
    commercial_potential INTEGER DEFAULT 0, -- 0-100 scale
    competition_level TEXT CHECK (competition_level IN ('low', 'medium', 'high')) DEFAULT 'medium',
    suggested_content_length INTEGER DEFAULT 1000,
    estimated_traffic INTEGER DEFAULT 0,
    conversion_potential REAL DEFAULT 0.0, -- 0-1 scale
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Keyword source tracking table
CREATE TABLE IF NOT EXISTS keyword_sources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    keyword_id UUID REFERENCES keyword_research(id) ON DELETE CASCADE,
    source_type TEXT CHECK (source_type IN ('web_search', 'competitor_analysis', 'trending', 'tool_data', 'manual')) NOT NULL,
    source_url TEXT,
    search_query TEXT,
    confidence_score INTEGER DEFAULT 0, -- 0-100 scale
    relevance_score INTEGER DEFAULT 0, -- 0-100 scale
    extracted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Keyword performance tracking table
CREATE TABLE IF NOT EXISTS keyword_performance_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    keyword_id UUID REFERENCES keyword_research(id) ON DELETE CASCADE,
    tracking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    rank_position INTEGER,
    estimated_traffic INTEGER,
    click_through_rate REAL DEFAULT 0.0,
    conversion_rate REAL DEFAULT 0.0,
    search_volume INTEGER,
    competitor_rankings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Keyword clusters table for semantic grouping
CREATE TABLE IF NOT EXISTS keyword_clusters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cluster_name TEXT NOT NULL,
    main_keyword TEXT NOT NULL,
    cluster_keywords TEXT[] DEFAULT '{}',
    semantic_theme TEXT,
    content_pillar TEXT,
    total_search_volume INTEGER DEFAULT 0,
    average_difficulty INTEGER DEFAULT 0,
    commercial_intent INTEGER DEFAULT 0,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cluster membership table
CREATE TABLE IF NOT EXISTS keyword_cluster_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cluster_id UUID REFERENCES keyword_clusters(id) ON DELETE CASCADE,
    keyword_id UUID REFERENCES keyword_research(id) ON DELETE CASCADE,
    role_in_cluster TEXT CHECK (role_in_cluster IN ('primary', 'secondary', 'long_tail')) DEFAULT 'secondary',
    relevance_score INTEGER DEFAULT 0, -- 0-100 scale
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content recommendations based on keywords
CREATE TABLE IF NOT EXISTS keyword_content_recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    keyword_id UUID REFERENCES keyword_research(id) ON DELETE CASCADE,
    content_title TEXT,
    content_outline TEXT,
    target_content_type TEXT CHECK (target_content_type IN ('blog_post', 'guide', 'review', 'comparison', 'tutorial', 'video')) NOT NULL,
    suggested_word_count INTEGER,
    key_points TEXT[] DEFAULT '{}',
    call_to_action TEXT,
    estimated_read_time INTEGER, -- in minutes
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'intermediate',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitor keyword analysis
CREATE TABLE IF NOT EXISTS competitor_keyword_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    keyword_id UUID REFERENCES keyword_research(id) ON DELETE CASCADE,
    competitor_domain TEXT NOT NULL,
    competitor_rank INTEGER,
    competitor_content_type TEXT,
    competitor_strength_score INTEGER DEFAULT 0, -- 0-100 scale
    gap_opportunity INTEGER DEFAULT 0, -- 0-100 scale
    content_gap BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Search trend analysis for keywords
CREATE TABLE IF NOT EXISTS keyword_trend_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    keyword_id UUID REFERENCES keyword_research(id) ON DELETE CASCADE,
    trend_direction TEXT CHECK (trend_direction IN ('rising', 'stable', 'declining', 'seasonal')) DEFAULT 'stable',
    trend_strength INTEGER DEFAULT 0, -- 0-100 scale
    seasonal_pattern TEXT,
    peak_months TEXT[] DEFAULT '{}',
    growth_rate REAL DEFAULT 0.0,
    predicted_volume INTEGER DEFAULT 0,
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_keyword_research_keyword ON keyword_research(keyword);
CREATE INDEX IF NOT EXISTS idx_keyword_research_category ON keyword_research(category);
CREATE INDEX IF NOT EXISTS idx_keyword_research_search_intent ON keyword_research(search_intent);
CREATE INDEX IF NOT EXISTS idx_keyword_research_priority ON keyword_research(priority);
CREATE INDEX IF NOT EXISTS idx_keyword_research_commercial_potential ON keyword_research(commercial_potential DESC);
CREATE INDEX IF NOT EXISTS idx_keyword_research_search_volume ON keyword_research(search_volume DESC);

CREATE INDEX IF NOT EXISTS idx_keyword_sources_keyword_id ON keyword_sources(keyword_id);
CREATE INDEX IF NOT EXISTS idx_keyword_sources_source_type ON keyword_sources(source_type);
CREATE INDEX IF NOT EXISTS idx_keyword_sources_extracted_at ON keyword_sources(extracted_at);

CREATE INDEX IF NOT EXISTS idx_keyword_performance_tracking_keyword_id ON keyword_performance_tracking(keyword_id);
CREATE INDEX IF NOT EXISTS idx_keyword_performance_tracking_tracking_date ON keyword_performance_tracking(tracking_date);
CREATE INDEX IF NOT EXISTS idx_keyword_performance_tracking_rank_position ON keyword_performance_tracking(rank_position);

CREATE INDEX IF NOT EXISTS idx_keyword_clusters_cluster_name ON keyword_clusters(cluster_name);
CREATE INDEX IF NOT EXISTS idx_keyword_clusters_main_keyword ON keyword_clusters(main_keyword);
CREATE INDEX IF NOT EXISTS idx_keyword_clusters_priority ON keyword_clusters(priority);

CREATE INDEX IF NOT EXISTS idx_keyword_cluster_members_cluster_id ON keyword_cluster_members(cluster_id);
CREATE INDEX IF NOT EXISTS idx_keyword_cluster_members_keyword_id ON keyword_cluster_members(keyword_id);

CREATE INDEX IF NOT EXISTS idx_keyword_content_recommendations_keyword_id ON keyword_content_recommendations(keyword_id);
CREATE INDEX IF NOT EXISTS idx_keyword_content_recommendations_content_type ON keyword_content_recommendations(target_content_type);

CREATE INDEX IF NOT EXISTS idx_competitor_keyword_analysis_keyword_id ON competitor_keyword_analysis(keyword_id);
CREATE INDEX IF NOT EXISTS idx_competitor_keyword_analysis_competitor_domain ON competitor_keyword_analysis(competitor_domain);

CREATE INDEX IF NOT EXISTS idx_keyword_trend_analysis_keyword_id ON keyword_trend_analysis(keyword_id);
CREATE INDEX IF NOT EXISTS idx_keyword_trend_analysis_trend_direction ON keyword_trend_analysis(trend_direction);

-- Enable Row Level Security (RLS)
ALTER TABLE keyword_research ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_performance_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_cluster_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_content_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_keyword_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_trend_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public can view keyword research" ON keyword_research
    FOR SELECT USING (true);

CREATE POLICY "Public can view keyword sources" ON keyword_sources
    FOR SELECT USING (true);

CREATE POLICY "Public can view keyword performance tracking" ON keyword_performance_tracking
    FOR SELECT USING (true);

CREATE POLICY "Public can view keyword clusters" ON keyword_clusters
    FOR SELECT USING (true);

CREATE POLICY "Public can view keyword cluster members" ON keyword_cluster_members
    FOR SELECT USING (true);

CREATE POLICY "Public can view keyword content recommendations" ON keyword_content_recommendations
    FOR SELECT USING (true);

CREATE POLICY "Public can view competitor keyword analysis" ON competitor_keyword_analysis
    FOR SELECT USING (true);

CREATE POLICY "Public can view keyword trend analysis" ON keyword_trend_analysis
    FOR SELECT USING (true);

-- Allow authenticated users to insert/update
CREATE POLICY "Authenticated users can insert keyword research" ON keyword_research
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update keyword research" ON keyword_research
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert keyword sources" ON keyword_sources
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert keyword performance tracking" ON keyword_performance_tracking
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert keyword clusters" ON keyword_clusters
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert keyword cluster members" ON keyword_cluster_members
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert keyword content recommendations" ON keyword_content_recommendations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert competitor keyword analysis" ON competitor_keyword_analysis
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert keyword trend analysis" ON keyword_trend_analysis
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_keyword_research_updated_at
    BEFORE UPDATE ON keyword_research
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_keyword_clusters_updated_at
    BEFORE UPDATE ON keyword_clusters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments to tables
COMMENT ON TABLE keyword_research IS 'Main table for storing comprehensive keyword research data';
COMMENT ON TABLE keyword_sources IS 'Tracking sources for each keyword discovery';
COMMENT ON TABLE keyword_performance_tracking IS 'Performance tracking for keywords over time';
COMMENT ON TABLE keyword_clusters IS 'Semantic grouping of related keywords';
COMMENT ON TABLE keyword_cluster_members IS 'Membership relationship between keywords and clusters';
COMMENT ON TABLE keyword_content_recommendations IS 'Content recommendations based on keyword analysis';
COMMENT ON TABLE competitor_keyword_analysis IS 'Competitor analysis for specific keywords';
COMMENT ON TABLE keyword_trend_analysis IS 'Trend analysis for keyword performance over time';

-- Create view for easy keyword management
CREATE OR REPLACE VIEW comprehensive_keyword_view AS
SELECT 
    k.id,
    k.keyword,
    k.search_volume,
    k.keyword_difficulty,
    k.commercial_intent,
    k.search_intent,
    k.content_type,
    k.priority,
    k.category,
    k.subcategory,
    k.target_audience,
    k.geographic_target,
    k.platforms,
    k.trading_styles,
    k.related_keywords,
    k.long_tail_score,
    k.commercial_potential,
    k.competition_level,
    k.suggested_content_length,
    k.estimated_traffic,
    k.conversion_potential,
    c.cluster_name,
    c.main_keyword as cluster_main_keyword,
    c.content_pillar,
    c.total_search_volume as cluster_volume,
    c.average_difficulty as cluster_difficulty,
    c.commercial_intent as cluster_commercial_intent,
    c.priority as cluster_priority
FROM keyword_research k
LEFT JOIN keyword_cluster_members km ON k.id = km.keyword_id
LEFT JOIN keyword_clusters c ON km.cluster_id = c.id
GROUP BY k.id, c.id, c.cluster_name, c.main_keyword, c.content_pillar,
       c.total_search_volume, c.average_difficulty, c.commercial_intent, c.priority;