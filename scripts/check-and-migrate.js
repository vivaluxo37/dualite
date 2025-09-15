import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://efxpwrnxdorgzcqhbnfn.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🚀 Starting AI matcher results table migration...');

  try {
    // First, let's check if the table exists and what columns it has
    console.log('🔍 Checking existing table structure...');
    
    const { data: existingTable, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'ai_matcher_results')
      .single();

    if (checkError || !existingTable) {
      console.log('📝 Table does not exist, creating it...');
      
      // Create the table using direct SQL
      const createSQL = `
        CREATE TABLE IF NOT EXISTS ai_matcher_results (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          match_score INTEGER NOT NULL DEFAULT 0 CHECK (match_score >= 0 AND match_score <= 100),
          user_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
          recommended_brokers JSONB NOT NULL DEFAULT '[]'::jsonb,
          metadata JSONB DEFAULT '{}'::jsonb
        );
      `;

      console.log('📋 Please execute this SQL in your Supabase dashboard:');
      console.log('\n```sql');
      console.log(createSQL);
      console.log('```\n');
      
      console.log('Then execute these additional statements:');
      console.log('\n```sql');
      console.log('ALTER TABLE ai_matcher_results ENABLE ROW LEVEL SECURITY;');
      console.log('CREATE POLICY "Users can view own AI matcher results" ON ai_matcher_results FOR SELECT USING (auth.uid() = user_id);');
      console.log('CREATE POLICY "Users can insert own AI matcher results" ON ai_matcher_results FOR INSERT WITH CHECK (auth.uid() = user_id);');
      console.log('CREATE POLICY "Users can update own AI matcher results" ON ai_matcher_results FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);');
      console.log('CREATE POLICY "Users can delete own AI matcher results" ON ai_matcher_results FOR DELETE USING (auth.uid() = user_id);');
      console.log('CREATE INDEX idx_ai_matcher_results_user_id ON ai_matcher_results(user_id);');
      console.log('CREATE INDEX idx_ai_matcher_results_created_at ON ai_matcher_results(created_at DESC);');
      console.log('```\n');
      
      console.log('🔗 Go to: https://supabase.com/dashboard/project/efxpwrnxdorgzcqhbnfn/sql');
      return;
    }

    // Check existing columns
    const { data: columns, error: columnError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'ai_matcher_results');

    if (columnError) {
      console.log('⚠️  Could not check columns:', columnError.message);
      return;
    }

    const existingColumns = columns.map(col => col.column_name);
    const requiredColumns = ['match_score', 'user_preferences', 'recommended_brokers', 'metadata'];
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));

    if (missingColumns.length === 0) {
      console.log('✅ All required columns already exist!');
      console.log('📋 Existing columns:', existingColumns.join(', '));
      
      // Check if RLS is enabled
      console.log('\n🔍 Checking RLS status...');
      const { data: rlsStatus, error: rlsError } = await supabase
        .from('information_schema.tables')
        .select('row_security')
        .eq('table_name', 'ai_matcher_results')
        .single();

      if (rlsError) {
        console.log('⚠️  Could not check RLS status:', rlsError.message);
      } else {
        console.log(`📋 RLS enabled: ${rlsStatus?.row_security === 'ENABLED' ? 'Yes' : 'No'}`);
      }

      console.log('\n🎉 Your AI matcher results table is ready to use!');
      return;
    }

    console.log('📝 Missing columns:', missingColumns.join(', '));
    console.log('📋 Please execute this SQL in your Supabase dashboard:');
    console.log('\n```sql');
    
    if (missingColumns.includes('match_score')) {
      console.log('ALTER TABLE ai_matcher_results ADD COLUMN IF NOT EXISTS match_score INTEGER NOT NULL DEFAULT 0 CHECK (match_score >= 0 AND match_score <= 100);');
    }
    if (missingColumns.includes('user_preferences')) {
      console.log('ALTER TABLE ai_matcher_results ADD COLUMN IF NOT EXISTS user_preferences JSONB NOT NULL DEFAULT \'{}\'::jsonb;');
    }
    if (missingColumns.includes('recommended_brokers')) {
      console.log('ALTER TABLE ai_matcher_results ADD COLUMN IF NOT EXISTS recommended_brokers JSONB NOT NULL DEFAULT \'[]\'::jsonb;');
    }
    if (missingColumns.includes('metadata')) {
      console.log('ALTER TABLE ai_matcher_results ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT \'{}\'::jsonb;');
    }
    
    console.log('ALTER TABLE ai_matcher_results ENABLE ROW LEVEL SECURITY;');
    console.log('CREATE POLICY "Users can view own AI matcher results" ON ai_matcher_results FOR SELECT USING (auth.uid() = user_id);');
    console.log('CREATE POLICY "Users can insert own AI matcher results" ON ai_matcher_results FOR INSERT WITH CHECK (auth.uid() = user_id);');
    console.log('CREATE POLICY "Users can update own AI matcher results" ON ai_matcher_results FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);');
    console.log('CREATE POLICY "Users can delete own AI matcher results" ON ai_matcher_results FOR DELETE USING (auth.uid() = user_id);');
    console.log('CREATE INDEX idx_ai_matcher_results_user_id ON ai_matcher_results(user_id);');
    console.log('CREATE INDEX idx_ai_matcher_results_created_at ON ai_matcher_results(created_at DESC);');
    console.log('```\n');
    
    console.log('🔗 Go to: https://supabase.com/dashboard/project/efxpwrnxdorgzcqhbnfn/sql');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  }
}

// Run the migration
runMigration().catch(console.error);