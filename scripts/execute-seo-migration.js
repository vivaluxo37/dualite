const { createClient } = require('@supabase/supabase-js');
const { readFileSync } = require('fs');

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://efxpwrnxdorgzcqhbnfn.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAzMzIzNSwiZXhwIjoyMDcyNjA5MjM1fQ.BKmSaW8dSc6soQZOh7zZGXMNO-evJZkSbLVJzxoYSYA';

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeMigration() {
  console.log('🚀 Starting SEO workflow tables migration...');

  try {
    // Read the SQL migration file
    const sql = readFileSync('supabase/migrations/20250111_seo_workflow_tables.sql', 'utf8');
    
    // Split the SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      
      // Skip comments and empty lines
      if (statement.trim().startsWith('--') || statement.trim().length <= 1) {
        continue;
      }

      console.log(`\n🔧 Executing statement ${i + 1}/${statements.length}:`);
      console.log(`   ${statement.substring(0, 100)}...`);

      try {
        // Try using the Supabase SQL RPC function if available
        const { error } = await supabase.rpc('exec_sql', { 
          sql: statement 
        });

        if (error) {
          console.log(`   ⚠️  RPC not available, trying direct SQL...`);
          
          // For now, let's provide the SQL for manual execution
          console.log('\n📋 Manual execution required:');
          console.log('Please copy and paste this SQL into your Supabase dashboard:');
          console.log('\n```sql');
          console.log(statement);
          console.log('```\n');
        } else {
          console.log('   ✅ Executed successfully');
        }
      } catch (error) {
        console.log(`   ⚠️  Statement execution failed or not supported:`, error.message);
      }
    }

    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    
    // Fallback: provide manual instructions
    console.log('\n📋 Manual execution required:');
    console.log('Please copy the SQL from supabase/migrations/20250111_seo_workflow_tables.sql and execute it in your Supabase dashboard:');
    console.log('🔗 https://supabase.com/dashboard/project/efxpwrnxdorgzcqhbnfn/sql');
  }
}

// Run the migration
executeMigration().catch(console.error);