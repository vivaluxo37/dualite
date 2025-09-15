-- AI Matcher Results Table Migration
-- Copy and paste this entire script into your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/efxpwrnxdorgzcqhbnfn/sql

-- Step 1: Add missing columns to existing table
ALTER TABLE ai_matcher_results 
ADD COLUMN IF NOT EXISTS match_score INTEGER NOT NULL DEFAULT 0 CHECK (match_score >= 0 AND match_score <= 100),
ADD COLUMN IF NOT EXISTS user_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS recommended_brokers JSONB NOT NULL DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Step 2: Enable Row Level Security (if not already enabled)
ALTER TABLE ai_matcher_results ENABLE ROW LEVEL SECURITY;

-- Step 3: Create user access policies
CREATE POLICY IF NOT EXISTS "Users can view own AI matcher results" 
ON ai_matcher_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own AI matcher results" 
ON ai_matcher_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own AI matcher results" 
ON ai_matcher_results 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own AI matcher results" 
ON ai_matcher_results 
FOR DELETE 
USING (auth.uid() = user_id);

-- Step 4: Create performance indexes
CREATE INDEX IF NOT EXISTS idx_ai_matcher_results_user_id ON ai_matcher_results(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_matcher_results_created_at ON ai_matcher_results(created_at DESC);

-- Step 5: Verify the table structure
-- You can run this SELECT after the migration to verify:
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'ai_matcher_results' 
ORDER BY ordinal_position;

/*
Expected output should show:
- id (uuid)
- user_id (uuid)
- created_at (timestamp with time zone)
- match_score (integer)
- user_preferences (jsonb)
- recommended_brokers (jsonb)
- metadata (jsonb)
*/

-- Migration complete! 🎉
-- Your AI matcher results table is now ready to use!