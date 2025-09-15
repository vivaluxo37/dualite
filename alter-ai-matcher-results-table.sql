-- Add missing columns to ai_matcher_results table
-- Run this in your Supabase dashboard SQL editor if the table exists but is missing columns

-- Add match_score column
ALTER TABLE ai_matcher_results 
ADD COLUMN IF NOT EXISTS match_score INTEGER NOT NULL DEFAULT 0;

-- Add check constraint for match_score
ALTER TABLE ai_matcher_results 
ADD CONSTRAINT IF NOT EXISTS ai_matcher_results_match_score_check 
CHECK (match_score >= 0 AND match_score <= 100);

-- Add user_preferences column
ALTER TABLE ai_matcher_results 
ADD COLUMN IF NOT EXISTS user_preferences JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Add recommended_brokers column
ALTER TABLE ai_matcher_results 
ADD COLUMN IF NOT EXISTS recommended_brokers JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Add metadata column
ALTER TABLE ai_matcher_results 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_matcher_results_match_score ON ai_matcher_results(match_score);
CREATE INDEX IF NOT EXISTS idx_ai_matcher_results_user_preferences ON ai_matcher_results USING GIN(user_preferences);

-- Verify the table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'ai_matcher_results'
AND table_schema = 'public'
ORDER BY ordinal_position;