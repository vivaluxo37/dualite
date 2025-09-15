import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://efxpwrnxdorgzcqhbnfn.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMzMyMzUsImV4cCI6MjA3MjYwOTIzNX0.q2qAWQgNE1lTCTA8MBdzeNCm5rtL5a_7o4E1Hf_tmzQ';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// SQL commands to execute
const sqlCommands = `
-- Comprehensive AI Matcher Results Table Setup
-- This script handles both table creation and updates

-- Check if table exists and create if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ai_matcher_results') THEN
        -- Create the table with full structure
        CREATE TABLE ai_matcher_results (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
            match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
            user_preferences JSONB NOT NULL,
            recommended_brokers JSONB NOT NULL,
            metadata JSONB DEFAULT '{}'::jsonb
        );
        
        RAISE NOTICE 'Created ai_matcher_results table';
    ELSE
        RAISE NOTICE 'ai_matcher_results table already exists, checking structure...';
        
        -- Add missing columns if they don't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_matcher_results' AND column_name = 'match_score') THEN
            ALTER TABLE ai_matcher_results ADD COLUMN match_score INTEGER NOT NULL DEFAULT 0;
            RAISE NOTICE 'Added match_score column';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_matcher_results' AND column_name = 'user_preferences') THEN
            ALTER TABLE ai_matcher_results ADD COLUMN user_preferences JSONB NOT NULL DEFAULT '{}'::jsonb;
            RAISE NOTICE 'Added user_preferences column';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_matcher_results' AND column_name = 'recommended_brokers') THEN
            ALTER TABLE ai_matcher_results ADD COLUMN recommended_brokers JSONB NOT NULL DEFAULT '[]'::jsonb;
            RAISE NOTICE 'Added recommended_brokers column';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_matcher_results' AND column_name = 'metadata') THEN
            ALTER TABLE ai_matcher_results ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
            RAISE NOTICE 'Added metadata column';
        END IF;
        
        -- Add check constraint for match_score if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'ai_matcher_results' AND constraint_name = 'ai_matcher_results_match_score_check') THEN
            ALTER TABLE ai_matcher_results ADD CONSTRAINT ai_matcher_results_match_score_check CHECK (match_score >= 0 AND match_score <= 100);
            RAISE NOTICE 'Added match_score check constraint';
        END IF;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_matcher_results_user_id ON ai_matcher_results(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_matcher_results_created_at ON ai_matcher_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_matcher_results_match_score ON ai_matcher_results(match_score);
CREATE INDEX IF NOT EXISTS idx_ai_matcher_results_user_preferences ON ai_matcher_results USING GIN(user_preferences);

-- Enable Row Level Security
ALTER TABLE ai_matcher_results ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own AI matcher results" ON ai_matcher_results;
DROP POLICY IF EXISTS "Users can insert own AI matcher results" ON ai_matcher_results;
DROP POLICY IF EXISTS "Users can update own AI matcher results" ON ai_matcher_results;
DROP POLICY IF EXISTS "Users can delete own AI matcher results" ON ai_matcher_results;

-- Create RLS policies
CREATE POLICY "Users can view own AI matcher results" 
ON ai_matcher_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI matcher results" 
ON ai_matcher_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI matcher results" 
ON ai_matcher_results 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own AI matcher results" 
ON ai_matcher_results 
FOR DELETE 
USING (auth.uid() = user_id);

-- Show final table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'ai_matcher_results'
AND table_schema = 'public'
ORDER BY ordinal_position;
`;

async function executeSQL() {
    try {
        console.log('Executing AI matcher results table setup...');
        
        // Execute the SQL using RPC
        const { data, error } = await supabase.rpc('exec_sql', {
            sql: sqlCommands
        });

        if (error) {
            console.error('Error executing SQL:', error);
            
            // Try alternative approach using direct SQL execution
            console.log('Trying alternative approach...');
            const { data: data2, error: error2 } = await supabase
                .from('pg_tables')
                .select('*')
                .eq('schemaname', 'public')
                .eq('tablename', 'ai_matcher_results');

            if (error2) {
                console.error('Alternative approach also failed:', error2);
                console.log('Please execute the SQL manually in the Supabase dashboard.');
                console.log('SQL file location: C:\\Users\\LENOVO\\Desktop\\dualite\\setup-ai-matcher-results-comprehensive.sql');
            } else {
                console.log('Table check result:', data2);
            }
        } else {
            console.log('SQL executed successfully:', data);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
        console.log('Please execute the SQL manually in the Supabase dashboard.');
        console.log('SQL file location: C:\\Users\\LENOVO\\Desktop\\dualite\\setup-ai-matcher-results-comprehensive.sql');
    }
}

// Execute the function
executeSQL();