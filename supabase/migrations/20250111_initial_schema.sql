/*
# Forex Broker Review App - Initial Database Schema
This migration creates the core database structure for the forex broker review application including user management, broker profiles, reviews system, and learning modules.

## Query Description:
Creates a comprehensive database schema for a forex broker review platform. This includes tables for brokers, user reviews, learning modules, user progress tracking, and admin functionality. The schema implements Row Level Security (RLS) policies to ensure data privacy and proper access control.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "High"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- users: Extended user profiles with roles and preferences
- brokers: Comprehensive broker information and ratings
- reviews: User reviews with verification system
- learning_modules: Educational content structure
- quiz_questions: Interactive learning questions
- user_progress: Progress tracking for learning modules
- user_shortlists: Saved broker preferences

## Security Implications:
- RLS Status: Enabled on all public tables
- Policy Changes: Yes - comprehensive RLS policies
- Auth Requirements: Integration with Supabase Auth

## Performance Impact:
- Indexes: Added for performance optimization
- Triggers: Automatic profile creation on user signup
- Estimated Impact: Optimized for read-heavy workloads
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE broker_regulation_tier AS ENUM ('tier1', 'tier2', 'tier3', 'unregulated');
CREATE TYPE learning_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE quiz_difficulty AS ENUM ('easy', 'medium', 'hard');

-- Users table (extends auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    display_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    language_preference TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Brokers table
CREATE TABLE public.brokers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    country TEXT NOT NULL,
    established_year INTEGER,
    website_url TEXT,
    affiliate_url TEXT,
    
    -- Trading information
    min_deposit DECIMAL(10,2),
    spreads_avg DECIMAL(5,2),
    leverage_max TEXT,
    platforms TEXT[], -- Array of trading platforms
    instruments TEXT[], -- Array of tradable instruments
    
    -- Regulation and trust
    regulations TEXT[], -- Array of regulatory bodies
    regulation_tier broker_regulation_tier DEFAULT 'unregulated',
    trust_score INTEGER CHECK (trust_score >= 0 AND trust_score <= 100),
    
    -- Fees structure (stored as JSONB for flexibility)
    fees JSONB,
    
    -- Calculated fields
    avg_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    
    -- Metadata
    description TEXT,
    pros TEXT[],
    cons TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Reviews table
CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    broker_id UUID REFERENCES public.brokers(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title TEXT,
    review_text TEXT NOT NULL,
    
    -- Verification
    verified BOOLEAN DEFAULT false,
    verification_proof_url TEXT,
    
    -- Helpful votes
    helpful_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Ensure one review per user per broker
    UNIQUE(broker_id, user_id)
);

-- Learning modules table
CREATE TABLE public.learning_modules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    level learning_level NOT NULL,
    order_index INTEGER NOT NULL,
    duration_minutes INTEGER,
    
    -- Module metadata
    objectives TEXT[],
    prerequisites TEXT[],
    
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Quiz questions table
CREATE TABLE public.quiz_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    module_id UUID REFERENCES public.learning_modules(id) ON DELETE CASCADE NOT NULL,
    
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of options
    correct_answer INTEGER NOT NULL, -- Index of correct option
    explanation TEXT,
    difficulty quiz_difficulty DEFAULT 'medium',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User progress table
CREATE TABLE public.user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    module_id UUID REFERENCES public.learning_modules(id) ON DELETE CASCADE NOT NULL,
    
    completed BOOLEAN DEFAULT false,
    score INTEGER, -- Quiz score if applicable
    completion_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    UNIQUE(user_id, module_id)
);

-- User shortlists table (saved brokers)
CREATE TABLE public.user_shortlists (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    broker_id UUID REFERENCES public.brokers(id) ON DELETE CASCADE NOT NULL,
    
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    UNIQUE(user_id, broker_id)
);

-- Quiz results table
CREATE TABLE public.quiz_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Quiz responses
    experience_level TEXT NOT NULL,
    trading_style TEXT NOT NULL,
    preferred_instruments TEXT[] NOT NULL,
    deposit_size_range TEXT NOT NULL,
    regulation_importance INTEGER CHECK (regulation_importance >= 1 AND regulation_importance <= 5),
    platform_preference TEXT,
    
    -- Results
    recommended_brokers UUID[] NOT NULL,
    match_scores JSONB, -- Scores for each recommended broker
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_brokers_slug ON public.brokers(slug);
CREATE INDEX idx_brokers_country ON public.brokers(country);
CREATE INDEX idx_brokers_regulation_tier ON public.brokers(regulation_tier);
CREATE INDEX idx_brokers_trust_score ON public.brokers(trust_score DESC);
CREATE INDEX idx_brokers_avg_rating ON public.brokers(avg_rating DESC);

CREATE INDEX idx_reviews_broker_id ON public.reviews(broker_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);
CREATE INDEX idx_reviews_verified ON public.reviews(verified);

CREATE INDEX idx_learning_modules_level ON public.learning_modules(level);
CREATE INDEX idx_learning_modules_order ON public.learning_modules(order_index);

CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_completed ON public.user_progress(completed);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brokers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_shortlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Brokers policies (public read, admin write)
CREATE POLICY "Brokers are viewable by everyone" ON public.brokers
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage brokers" ON public.brokers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.reviews
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews" ON public.reviews
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Learning modules policies
CREATE POLICY "Published modules are viewable by everyone" ON public.learning_modules
    FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage learning modules" ON public.learning_modules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Quiz questions policies
CREATE POLICY "Quiz questions are viewable by authenticated users" ON public.quiz_questions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage quiz questions" ON public.quiz_questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- User progress policies
CREATE POLICY "Users can view their own progress" ON public.user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own progress" ON public.user_progress
    FOR ALL USING (auth.uid() = user_id);

-- User shortlists policies
CREATE POLICY "Users can manage their own shortlists" ON public.user_shortlists
    FOR ALL USING (auth.uid() = user_id);

-- Quiz results policies
CREATE POLICY "Users can view their own quiz results" ON public.quiz_results
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create quiz results" ON public.quiz_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions and triggers

-- Function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, display_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update broker average rating
CREATE OR REPLACE FUNCTION public.update_broker_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.brokers
    SET 
        avg_rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM public.reviews
            WHERE broker_id = COALESCE(NEW.broker_id, OLD.broker_id)
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM public.reviews
            WHERE broker_id = COALESCE(NEW.broker_id, OLD.broker_id)
        )
    WHERE id = COALESCE(NEW.broker_id, OLD.broker_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update broker rating when reviews change
CREATE OR REPLACE TRIGGER update_broker_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_broker_rating();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update timestamp triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brokers_updated_at BEFORE UPDATE ON public.brokers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_learning_modules_updated_at BEFORE UPDATE ON public.learning_modules
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
