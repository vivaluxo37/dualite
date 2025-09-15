-- Create blog system tables
-- Main blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image_url TEXT,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT[],
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    reading_time INTEGER DEFAULT 0,
    is_comment_enabled BOOLEAN DEFAULT TRUE,
    
    -- Indexes
    CONSTRAINT slug_length CHECK (LENGTH(slug) >= 3),
    CONSTRAINT title_length CHECK (LENGTH(title) >= 3)
);

-- Blog categories table
CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#3B82F6',
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes
    CONSTRAINT slug_length CHECK (LENGTH(slug) >= 3),
    CONSTRAINT name_length CHECK (LENGTH(name) >= 3)
);

-- Blog tags table
CREATE TABLE IF NOT EXISTS blog_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes
    CONSTRAINT slug_length CHECK (LENGTH(slug) >= 3),
    CONSTRAINT name_length CHECK (LENGTH(name) >= 3)
);

-- Blog post categories relationship (many-to-many)
CREATE TABLE IF NOT EXISTS blog_post_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES blog_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes
    UNIQUE(post_id, category_id)
);

-- Blog post tags relationship (many-to-many)
CREATE TABLE IF NOT EXISTS blog_post_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES blog_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes
    UNIQUE(post_id, tag_id)
);

-- Blog comments table
CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT,
    author_email TEXT,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes
    CONSTRAINT parent_id_check CHECK (parent_id IS NULL OR parent_id != id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published_at ON blog_posts(status, published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_featured ON blog_posts(is_featured) WHERE is_featured = TRUE;

CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_name ON blog_categories(name);

CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);
CREATE INDEX IF NOT EXISTS idx_blog_tags_name ON blog_tags(name);

CREATE INDEX IF NOT EXISTS idx_blog_post_categories_post_id ON blog_post_categories(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_categories_category_id ON blog_post_categories(category_id);

CREATE INDEX IF NOT EXISTS idx_blog_post_tags_post_id ON blog_post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_tag_id ON blog_post_tags(tag_id);

CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_author_id ON blog_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments(status);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created_at ON blog_comments(created_at DESC);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON blog_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_comments_updated_at BEFORE UPDATE ON blog_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update post counts for categories
CREATE OR REPLACE FUNCTION update_category_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE blog_categories SET post_count = post_count + 1 WHERE id = NEW.category_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE blog_categories SET post_count = post_count - 1 WHERE id = OLD.category_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_category_post_count
    AFTER INSERT OR DELETE ON blog_post_categories
    FOR EACH ROW EXECUTE FUNCTION update_category_post_count();

-- Create function to update post counts for tags
CREATE OR REPLACE FUNCTION update_tag_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE blog_tags SET post_count = post_count + 1 WHERE id = NEW.tag_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE blog_tags SET post_count = post_count - 1 WHERE id = OLD.tag_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_tag_post_count
    AFTER INSERT OR DELETE ON blog_post_tags
    FOR EACH ROW EXECUTE FUNCTION update_tag_post_count();

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_blog_view_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status != 'published') THEN
        -- This will be called when a post is first published
        -- Actual view counting will be done in the application
        RETURN NEW;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create Row Level Security (RLS) policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Policy for blog_posts: everyone can read published posts, authenticated users can create drafts
CREATE POLICY "Public view access for published posts" ON blog_posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Users can create posts" ON blog_posts
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own posts" ON blog_posts
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts" ON blog_posts
    FOR DELETE USING (auth.uid() = author_id);

-- Policy for blog_comments: everyone can read approved comments, authenticated users can create comments
CREATE POLICY "Public view access for approved comments" ON blog_comments
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can create comments" ON blog_comments
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL OR (author_name IS NOT NULL AND author_email IS NOT NULL));

CREATE POLICY "Users can update their own comments" ON blog_comments
    FOR UPDATE USING (auth.uid() = author_id);

-- Enable public access for blog categories and tags
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for categories" ON blog_categories
    FOR SELECT USING (true);

CREATE POLICY "Public read access for tags" ON blog_tags
    FOR SELECT USING (true);

CREATE POLICY "Public read access for post categories" ON blog_post_categories
    FOR SELECT USING (true);

CREATE POLICY "Public read access for post tags" ON blog_post_tags
    FOR SELECT USING (true);

-- Create default categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
('Forex Trading', 'forex-trading', 'Articles about forex trading strategies, analysis, and tips', '#3B82F6'),
('Broker Reviews', 'broker-reviews', 'In-depth reviews and analysis of forex brokers', '#10B981'),
('Trading Strategies', 'trading-strategies', 'Different trading strategies and approaches', '#F59E0B'),
('Market Analysis', 'market-analysis', 'Technical and fundamental market analysis', '#EF4444'),
('Trading Education', 'trading-education', 'Educational content for traders of all levels', '#8B5CF6'),
('Risk Management', 'risk-management', 'Risk management techniques and best practices', '#06B6D4'),
('Trading Psychology', 'trading-psychology', 'Understanding the psychological aspects of trading', '#F97316'),
('Market News', 'market-news', 'Latest news and updates from the forex market', '#84CC16')
ON CONFLICT (slug) DO NOTHING;

-- Create default tags
INSERT INTO blog_tags (name, slug, description) VALUES
('forex', 'forex', 'Foreign exchange market content'),
('trading', 'trading', 'General trading topics'),
('brokers', 'brokers', 'Broker-related content'),
('strategies', 'strategies', 'Trading strategies'),
('analysis', 'analysis', 'Market analysis'),
('beginners', 'beginners', 'Content for beginner traders'),
('advanced', 'advanced', 'Advanced trading concepts'),
('technical-analysis', 'technical-analysis', 'Technical analysis methods'),
('fundamental-analysis', 'fundamental-analysis', 'Fundamental analysis methods'),
('risk-management', 'risk-management', 'Risk management topics'),
('psychology', 'psychology', 'Trading psychology'),
('education', 'education', 'Educational content'),
('news', 'news', 'Market news'),
('reviews', 'reviews', 'Broker and service reviews'),
('tips', 'tips', 'Trading tips and advice')
ON CONFLICT (slug) DO NOTHING;