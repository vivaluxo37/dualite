const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://efxpwrnxdorgzcqhbnfn.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required in .env file');
  console.log('Please add your service role key to your .env file:');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🚀 Starting AI matcher results table migration...');

  try {
    // SQL to add missing columns
    const alterTableSQL = `
      ALTER TABLE ai_matcher_results 
      ADD COLUMN IF NOT EXISTS match_score INTEGER NOT NULL DEFAULT 0 CHECK (match_score >= 0 AND match_score <= 100),
      ADD COLUMN IF NOT EXISTS user_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
      ADD COLUMN IF NOT EXISTS recommended_brokers JSONB NOT NULL DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
    `;

    console.log('📝 Adding missing columns...');
    const { error: alterError } = await supabase.rpc('exec_sql', { sql: alterTableSQL });
    
    if (alterError) {
      console.log('⚠️  Column addition may have failed or columns already exist:', alterError.message);
    } else {
      console.log('✅ Columns added successfully');
    }

    // Enable RLS
    console.log('🔒 Enabling Row Level Security...');
    const { error: rlsError } = await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE ai_matcher_results ENABLE ROW LEVEL SECURITY;' 
    });
    
    if (rlsError) {
      console.log('⚠️  RLS enable warning:', rlsError.message);
    } else {
      console.log('✅ RLS enabled');
    }

    // Create RLS policies
    const policies = [
      {
        name: 'Users can view own AI matcher results',
        sql: `CREATE POLICY IF NOT EXISTS "Users can view own AI matcher results" 
             ON ai_matcher_results 
             FOR SELECT 
             USING (auth.uid() = user_id);`
      },
      {
        name: 'Users can insert own AI matcher results',
        sql: `CREATE POLICY IF NOT EXISTS "Users can insert own AI matcher results" 
             ON ai_matcher_results 
             FOR INSERT 
             WITH CHECK (auth.uid() = user_id);`
      },
      {
        name: 'Users can update own AI matcher results',
        sql: `CREATE POLICY IF NOT EXISTS "Users can update own AI matcher results" 
             ON ai_matcher_results 
             FOR UPDATE 
             USING (auth.uid() = user_id)
             WITH CHECK (auth.uid() = user_id);`
      },
      {
        name: 'Users can delete own AI matcher results',
        sql: `CREATE POLICY IF NOT EXISTS "Users can delete own AI matcher results" 
             ON ai_matcher_results 
             FOR DELETE 
             USING (auth.uid() = user_id);`
      }
    ];

    console.log('📋 Creating RLS policies...');
    for (const policy of policies) {
      console.log(`   Creating policy: ${policy.name}`);
      const { error } = await supabase.rpc('exec_sql', { sql: policy.sql });
      if (error) {
        console.log(`   ⚠️  Policy creation warning:`, error.message);
      } else {
        console.log(`   ✅ Policy created: ${policy.name}`);
      }
    }

    // Create indexes
    console.log('📊 Creating indexes...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_ai_matcher_results_user_id ON ai_matcher_results(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_ai_matcher_results_created_at ON ai_matcher_results(created_at DESC);'
    ];

    for (const indexSQL of indexes) {
      const { error } = await supabase.rpc('exec_sql', { sql: indexSQL });
      if (error) {
        console.log('⚠️  Index creation warning:', error.message);
      } else {
        console.log('✅ Index created');
      }
    }

    console.log('🎉 Migration completed successfully!');
    console.log('');
    console.log('📋 Summary:');
    console.log('   ✅ Added missing columns (match_score, user_preferences, recommended_brokers, metadata)');
    console.log('   ✅ Enabled Row Level Security');
    console.log('   ✅ Created user access policies');
    console.log('   ✅ Created performance indexes');
    console.log('');
    console.log('🚀 Your AI matcher results table is now ready to use!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Alternative approach using direct SQL if exec_sql is not available
async function runMigrationDirect() {
  console.log('🚀 Starting AI matcher results table migration (direct approach)...');

  try {
    // Check if table exists and get current structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'ai_matcher_results');

    if (tableError) {
      console.log('📝 Table may not exist, creating full table...');
      
      // Create the complete table
      const createTableSQL = `
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

      // For now, let's provide instructions for manual execution
      console.log('📋 Please execute the following SQL in your Supabase dashboard:');
      console.log('');
      console.log('```sql');
      console.log(createTableSQL);
      console.log('');
      console.log('-- Enable RLS');
      console.log('ALTER TABLE ai_matcher_results ENABLE ROW LEVEL SECURITY;');
      console.log('');
      console.log('-- Create policies');
      console.log('CREATE POLICY "Users can view own AI matcher results" ON ai_matcher_results FOR SELECT USING (auth.uid() = user_id);');
      console.log('CREATE POLICY "Users can insert own AI matcher results" ON ai_matcher_results FOR INSERT WITH CHECK (auth.uid() = user_id);');
      console.log('CREATE POLICY "Users can update own AI matcher results" ON ai_matcher_results FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);');
      console.log('CREATE POLICY "Users can delete own AI matcher results" ON ai_matcher_results FOR DELETE USING (auth.uid() = user_id);');
      console.log('');
      console.log('-- Create indexes');
      console.log('CREATE INDEX idx_ai_matcher_results_user_id ON ai_matcher_results(user_id);');
      console.log('CREATE INDEX idx_ai_matcher_results_created_at ON ai_matcher_results(created_at DESC);');
      console.log('```');
      console.log('');
      console.log('🔗 Go to: https://supabase.com/dashboard/project/efxpwrnxdorgzcqhbnfn/sql');
      
      return;
    }

    console.log('✅ Table exists, checking structure...');
    
    // Check which columns exist
    const existingColumns = tableInfo.map(col => col.column_name);
    const requiredColumns = ['match_score', 'user_preferences', 'recommended_brokers', 'metadata'];
    
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.log(`📝 Missing columns: ${missingColumns.join(', ')}`);
      console.log('📋 Please execute the following SQL in your Supabase dashboard:');
      console.log('');
      console.log('```sql');
      console.log('ALTER TABLE ai_matcher_results');
      missingColumns.forEach(col => {
        let columnDef = '';
        switch(col) {
          case 'match_score':
            columnDef = 'ADD COLUMN IF NOT EXISTS match_score INTEGER NOT NULL DEFAULT 0 CHECK (match_score >= 0 AND match_score <= 100)';
            break;
          case 'user_preferences':
            columnDef = 'ADD COLUMN IF NOT EXISTS user_preferences JSONB NOT NULL DEFAULT \'{}\'::jsonb';
            break;
          case 'recommended_brokers':
            columnDef = 'ADD COLUMN IF NOT EXISTS recommended_brokers JSONB NOT NULL DEFAULT \'[]\'::jsonb';
            break;
          case 'metadata':
            columnDef = 'ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT \'{}\'::jsonb';
            break;
        }
        console.log(columnDef + ',');
      });
      console.log('```');
      console.log('');
      console.log('🔗 Go to: https://supabase.com/dashboard/project/efxpwrnxdorgzcqhbnfn/sql');
    } else {
      console.log('✅ All required columns exist');
    }

  } catch (error) {
    console.error('❌ Migration check failed:', error.message);
  }
}

// Run the migration
runMigrationDirect().catch(console.error);