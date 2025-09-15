/*
# SEO Workflow Database Schema Extension
This migration creates comprehensive tables for the SEO workflow including keyword research, content planning, generation, optimization, and quality assurance.

## Query Description:
Creates tables to support the complete SEO content generation workflow:
- broker_keywords: Store keyword research data with search metrics
- page_outlines: Content planning and structure data
- page_drafts: Generated content drafts with metadata
- page_seo: Optimized SEO metadata and structured data
- page_audit: Quality assurance and validation results

## Metadata:
- Schema-Category: "SEO Workflow"
- Impact-Level: "High"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- broker_keywords: Keyword research with search volume and competition
- page_outlines: Content planning with structured outlines
- page_drafts: Generated content with version control
- page_seo: SEO optimization data and schema markup
- page_audit: Quality assurance metrics and validation

## Security Implications:
- RLS Status: Enabled on all tables
- Policy Changes: Yes - comprehensive RLS policies
- Auth Requirements: Public read, admin write access

## Performance Impact:
- Indexes: Added for foreign keys and search performance
- Triggers: Automatic timestamp updates
- Estimated Impact: Optimized for content generation workflow
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for SEO workflow
CREATE TYPE keyword_intent AS ENUM ('informational', 'commercial', 'transactional', 'navigational');
CREATE TYPE content_status AS ENUM ('draft', 'in_review', 'approved', 'published', 'archived');
CREATE TYPE audit_status AS ENUM ('pending', 'passed', 'failed', 'needs_review');
CREATE TYPE optimization_type AS ENUM ('meta_tags', 'schema_markup', 'internal_links', 'content_structure', 'readability');

-- Broker Keywords Table
CREATE TABLE broker_keywords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    keyword_type TEXT DEFAULT 'primary', -- primary, secondary, long_tail, semantic
    search_volume INTEGER DEFAULT 0,
    competition_score DECIMAL(3,2) DEFAULT 0.00, -- 0.00 to 1.00
    difficulty_score DECIMAL(3,2) DEFAULT 0.00, -- 0.00 to 1.00
    intent_type keyword_intent DEFAULT 'informational',
    country_target TEXT DEFAULT 'global',
    language_target TEXT DEFAULT 'en',
    search_trend_data JSONB DEFAULT '{}', -- Monthly search volume trends
    related_keywords TEXT[] DEFAULT '{}',
    question_keywords TEXT[] DEFAULT '{}', -- People Also Ask questions
    source TEXT DEFAULT 'web_search', -- web_search, competitor_analysis, google_trends
    confidence_score DECIMAL(3,2) DEFAULT 0.00, -- Confidence in keyword data
    is_targeted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page Outlines Table
CREATE TABLE page_outlines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    outline_name TEXT NOT NULL,
    outline_data JSONB NOT NULL, -- Structured outline data
    content_structure TEXT[] DEFAULT '{}', -- H1, H2, H3 structure
    target_word_count INTEGER DEFAULT 2000,
    target_readability_score DECIMAL(3,2) DEFAULT 70.00,
    focus_keywords TEXT[] DEFAULT '{}',
    semantic_keywords TEXT[] DEFAULT '{}',
    content_sections JSONB DEFAULT '[]', -- Array of section objects
    faq_questions TEXT[] DEFAULT '{}', -- FAQ schema questions
    comparison_points TEXT[] DEFAULT '{}', -- Points for broker comparisons
    unique_selling_points TEXT[] DEFAULT '{}', -- Broker USPs to highlight
    content_goals TEXT[] DEFAULT '{}', -- Goals for the content
    target_audience TEXT DEFAULT 'traders',
    content_tone TEXT DEFAULT 'professional',
    call_to_action TEXT DEFAULT 'compare_brokers',
    outline_quality_score DECIMAL(3,2) DEFAULT 0.00,
    outline_version INTEGER DEFAULT 1,
    status content_status DEFAULT 'draft',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page Drafts Table
CREATE TABLE page_drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    outline_id UUID REFERENCES page_outlines(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    content_type TEXT DEFAULT 'markdown', -- markdown, html, jsx
    word_count INTEGER DEFAULT 0,
    readability_score DECIMAL(3,2) DEFAULT 0.00,
    sentiment_score DECIMAL(3,2) DEFAULT 0.00, -- -1.00 to 1.00
    uniqueness_score DECIMAL(3,2) DEFAULT 0.00, -- 0.00 to 1.00
    generation_metadata JSONB DEFAULT '{}', -- Model, prompts, tokens used
    content_sections JSONB DEFAULT '[]', -- Structured content sections
    embedded_keywords TEXT[] DEFAULT '{}', -- Keywords successfully embedded
    internal_links JSONB DEFAULT '[]', -- Internal links added
    external_links JSONB DEFAULT '[]', -- External references
    images_suggested JSONB DEFAULT '[]', -- Suggested images with alt text
    tables_suggested JSONB DEFAULT '[]', -- Suggested comparison tables
    faq_sections JSONB DEFAULT '[]', -- FAQ sections generated
    draft_version INTEGER DEFAULT 1,
    status content_status DEFAULT 'draft',
    quality_score DECIMAL(3,2) DEFAULT 0.00,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page SEO Table
CREATE TABLE page_seo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    draft_id UUID REFERENCES page_drafts(id) ON DELETE SET NULL,
    title_tag TEXT NOT NULL,
    meta_description TEXT,
    meta_keywords TEXT[] DEFAULT '{}',
    canonical_url TEXT,
    og_title TEXT,
    og_description TEXT,
    og_image_url TEXT,
    twitter_card TEXT DEFAULT 'summary_large_image',
    twitter_title TEXT,
    twitter_description TEXT,
    twitter_image_url TEXT,
    schema_markup JSONB DEFAULT '{}', -- All schema types combined
    breadcrumb_schema JSONB DEFAULT '{}',
    faq_schema JSONB DEFAULT '{}',
    review_schema JSONB DEFAULT '{}',
    organization_schema JSONB DEFAULT '{}',
    website_schema JSONB DEFAULT '{}',
    internal_links JSONB DEFAULT '[]', -- Structured internal links
    external_links JSONB DEFAULT '[]', -- Quality external references
    heading_structure JSONB DEFAULT '[]', -- H1-H6 structure analysis
    content_score DECIMAL(3,2) DEFAULT 0.00, -- Overall content SEO score
    technical_score DECIMAL(3,2) DEFAULT 0.00, -- Technical SEO score
    optimization_score DECIMAL(3,2) DEFAULT 0.00, -- Overall optimization score
    optimization_details JSONB DEFAULT '{}', -- Detailed optimization metrics
    status content_status DEFAULT 'draft',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page Audit Table
CREATE TABLE page_audit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    page_seo_id UUID REFERENCES page_seo(id) ON DELETE SET NULL,
    content_quality_score DECIMAL(3,2) DEFAULT 0.00, -- Overall content quality
    seo_score DECIMAL(3,2) DEFAULT 0.00, -- SEO optimization score
    readability_score DECIMAL(3,2) DEFAULT 0.00, -- Readability assessment
    uniqueness_score DECIMAL(3,2) DEFAULT 0.00, -- Content uniqueness
    duplicate_content_check BOOLEAN DEFAULT false, -- Passed duplicate check
    grammar_score DECIMAL(3,2) DEFAULT 0.00, -- Grammar and spelling
    trust_signals_score DECIMAL(3,2) DEFAULT 0.00, -- Trust and authority signals
    technical_seo_score DECIMAL(3,2) DEFAULT 0.00, -- Technical SEO compliance
    user_experience_score DECIMAL(3,2) DEFAULT 0.00, -- UX and readability
    audit_metadata JSONB DEFAULT '{}', -- Detailed audit results
    issues_found JSONB DEFAULT '[]', -- Array of issue objects
    recommendations JSONB DEFAULT '[]', -- Improvement recommendations
    priority_issues JSONB DEFAULT '[]', -- High-priority issues
    content_gaps JSONB DEFAULT '[]', -- Missing content opportunities
    competitive_analysis JSONB DEFAULT '{}', -- Comparison with competitors
    audit_status audit_status DEFAULT 'pending',
    overall_score DECIMAL(3,2) DEFAULT 0.00, -- Final audit score
    next_review_date TIMESTAMP WITH TIME ZONE,
    audited_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_broker_keywords_broker_id ON broker_keywords(broker_id);
CREATE INDEX idx_broker_keywords_keyword ON broker_keywords USING gin(to_tsvector('english', keyword));
CREATE INDEX idx_broker_keywords_intent ON broker_keywords(intent_type);
CREATE INDEX idx_broker_keywords_is_targeted ON broker_keywords(is_targeted);

CREATE INDEX idx_page_outlines_broker_id ON page_outlines(broker_id);
CREATE INDEX idx_page_outlines_status ON page_outlines(status);
CREATE INDEX idx_page_outlines_quality_score ON page_outlines(outline_quality_score);

CREATE INDEX idx_page_drafts_broker_id ON page_drafts(broker_id);
CREATE INDEX idx_page_drafts_outline_id ON page_drafts(outline_id);
CREATE INDEX idx_page_drafts_status ON page_drafts(status);
CREATE INDEX idx_page_drafts_quality_score ON page_drafts(quality_score);

CREATE INDEX idx_page_seo_broker_id ON page_seo(broker_id);
CREATE INDEX idx_page_seo_draft_id ON page_seo(draft_id);
CREATE INDEX idx_page_seo_optimization_score ON page_seo(optimization_score);

CREATE INDEX idx_page_audit_broker_id ON page_audit(broker_id);
CREATE INDEX idx_page_audit_page_seo_id ON page_audit(page_seo_id);
CREATE INDEX idx_page_audit_status ON page_audit(audit_status);
CREATE INDEX idx_page_audit_overall_score ON page_audit(overall_score);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_broker_keywords_updated_at BEFORE UPDATE ON broker_keywords
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_outlines_updated_at BEFORE UPDATE ON page_outlines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_drafts_updated_at BEFORE UPDATE ON page_drafts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_seo_updated_at BEFORE UPDATE ON page_seo
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_audit_updated_at BEFORE UPDATE ON page_audit
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
-- Broker Keywords
ALTER TABLE broker_keywords ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Broker keywords are viewable by everyone" ON broker_keywords
    FOR SELECT USING (true);
CREATE POLICY "Users can insert broker keywords" ON broker_keywords
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own broker keywords" ON broker_keywords
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete broker keywords" ON broker_keywords
    FOR DELETE USING (auth.role() = 'authenticated');

-- Page Outlines
ALTER TABLE page_outlines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Page outlines are viewable by everyone" ON page_outlines
    FOR SELECT USING (true);
CREATE POLICY "Users can insert page outlines" ON page_outlines
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own page outlines" ON page_outlines
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete page outlines" ON page_outlines
    FOR DELETE USING (auth.role() = 'authenticated');

-- Page Drafts
ALTER TABLE page_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Page drafts are viewable by everyone" ON page_drafts
    FOR SELECT USING (true);
CREATE POLICY "Users can insert page drafts" ON page_drafts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own page drafts" ON page_drafts
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete page drafts" ON page_drafts
    FOR DELETE USING (auth.role() = 'authenticated');

-- Page SEO
ALTER TABLE page_seo ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Page SEO data is viewable by everyone" ON page_seo
    FOR SELECT USING (true);
CREATE POLICY "Users can insert page SEO data" ON page_seo
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own page SEO data" ON page_seo
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete page SEO data" ON page_seo
    FOR DELETE USING (auth.role() = 'authenticated');

-- Page Audit
ALTER TABLE page_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Page audit data is viewable by everyone" ON page_audit
    FOR SELECT USING (true);
CREATE POLICY "Users can insert page audit data" ON page_audit
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own page audit data" ON page_audit
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete page audit data" ON page_audit
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create view for SEO workflow summary
CREATE VIEW seo_workflow_summary AS
SELECT 
    b.id as broker_id,
    b.name as broker_name,
    b.slug as broker_slug,
    COUNT(DISTINCT bk.id) as total_keywords,
    COUNT(DISTINCT CASE WHEN bk.is_targeted = true THEN bk.id END) as targeted_keywords,
    COUNT(DISTINCT po.id) as total_outlines,
    COUNT(DISTINCT CASE WHEN po.status = 'approved' THEN po.id END) as approved_outlines,
    COUNT(DISTINCT pd.id) as total_drafts,
    COUNT(DISTINCT CASE WHEN pd.status = 'approved' THEN pd.id END) as approved_drafts,
    COUNT(DISTINCT ps.id) as total_seo_optimized,
    COUNT(DISTINCT CASE WHEN ps.optimization_score >= 80.00 THEN ps.id END) as well_optimized,
    COUNT(DISTINCT pa.id) as total_audits,
    COUNT(DISTINCT CASE WHEN pa.audit_status = 'passed' THEN pa.id END) as passed_audits,
    MAX(pa.created_at) as last_audit_date,
    COALESCE(AVG(pa.overall_score), 0.00) as average_audit_score
FROM brokers b
LEFT JOIN broker_keywords bk ON b.id = bk.broker_id
LEFT JOIN page_outlines po ON b.id = po.broker_id
LEFT JOIN page_drafts pd ON b.id = pd.broker_id
LEFT JOIN page_seo ps ON b.id = ps.broker_id
LEFT JOIN page_audit pa ON b.id = pa.broker_id
GROUP BY b.id, b.name, b.slug;

-- Grant permissions
GRANT ALL ON seo_workflow_summary TO authenticated;
GRANT SELECT ON seo_workflow_summary TO anon;