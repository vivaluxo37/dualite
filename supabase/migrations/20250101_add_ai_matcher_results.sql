-- Create ai_matcher_results table
CREATE TABLE IF NOT EXISTS ai_matcher_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  user_preferences JSONB NOT NULL,
  recommended_brokers JSONB NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_ai_matcher_results_user_id ON ai_matcher_results(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_matcher_results_created_at ON ai_matcher_results(created_at DESC);

-- Add comments
COMMENT ON TABLE ai_matcher_results IS 'Stores AI matcher results for user broker recommendations';
COMMENT ON COLUMN ai_matcher_results.match_score IS 'Overall match score (0-100)';
COMMENT ON COLUMN ai_matcher_results.user_preferences IS 'User preferences used for matching';
COMMENT ON COLUMN ai_matcher_results.recommended_brokers IS 'AI-recommended brokers with match details';
COMMENT ON COLUMN ai_matcher_results.metadata IS 'Additional metadata about the matching process';

-- Set up Row Level Security
ALTER TABLE ai_matcher_results ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own results
CREATE POLICY "Users can view own AI matcher results" 
ON ai_matcher_results 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy for users to insert their own results
CREATE POLICY "Users can insert own AI matcher results" 
ON ai_matcher_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own results
CREATE POLICY "Users can update own AI matcher results" 
ON ai_matcher_results 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy for users to delete their own results
CREATE POLICY "Users can delete own AI matcher results" 
ON ai_matcher_results 
FOR DELETE 
USING (auth.uid() = user_id);