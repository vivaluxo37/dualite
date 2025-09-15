import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// SQL migration to create ai_matcher_results table
const migrationSQL = `
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
`;

async function executeMigration() {
  try {
    console.log('Executing AI matcher results table migration...');
    
    // Execute the SQL migration
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('Error executing migration:', error);
      
      // Try using direct SQL execution
      try {
        const { data: migrationData, error: migrationError } = await supabase
          .from('pg_catalog')
          .select('version()')
          .single();
        
        if (migrationError) {
          console.log('Cannot execute SQL directly. Creating migration file instead...');
          
          // Create a migration file
          const fs = require('fs');
          const path = require('path');
          
          const migrationFileName = `create_ai_matcher_results_table_${Date.now()}.sql`;
          const migrationPath = path.join(__dirname, 'supabase', 'migrations', migrationFileName);
          
          // Ensure migrations directory exists
          const migrationsDir = path.dirname(migrationPath);
          if (!fs.existsSync(migrationsDir)) {
            fs.mkdirSync(migrationsDir, { recursive: true });
          }
          
          fs.writeFileSync(migrationPath, migrationSQL);
          console.log(`Migration file created at: ${migrationPath}`);
          console.log('Please run this migration manually in your Supabase dashboard SQL editor.');
        } else {
          console.log('Database connection successful, but cannot execute SQL directly.');
          console.log('Please run the following SQL in your Supabase dashboard SQL editor:');
          console.log('\n' + migrationSQL);
        }
      } catch (fallbackError) {
        console.error('Fallback approach failed:', fallbackError);
        console.log('Please run the following SQL in your Supabase dashboard SQL editor:');
        console.log('\n' + migrationSQL);
      }
    } else {
      console.log('Migration executed successfully!');
      console.log('AI matcher results table created with proper RLS policies.');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
    console.log('Please run the following SQL in your Supabase dashboard SQL editor:');
    console.log('\n' + migrationSQL);
  }
}

// Execute the migration
executeMigration();