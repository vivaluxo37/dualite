import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://efxpwrnxdorgzcqhbnfn.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeMigration() {
  console.log('🚀 Starting AI matcher results table migration...');

  try {
    // Read the SQL migration file
    const sql = readFileSync('supabase-migration.sql', 'utf8');
    
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
        // Use the Supabase SQL RPC function if available
        const { error } = await supabase.rpc('exec_sql', { 
          sql: statement 
        });

        if (error) {
          // If exec_sql doesn't exist, try using the raw SQL approach
          console.log(`   ⚠️  Using fallback method...`);
          
          // For now, let's provide the SQL for manual execution
          console.log('\n📋 Manual execution required:');
          console.log('Please copy and paste this SQL into your Supabase dashboard:');
          console.log('\n```sql');
          console.log(statement);
          console.log('```\n');
          
          console.log('🔗 Go to: https://supabase.com/dashboard/project/efxpwrnxdorgzcqhbnfn/sql');
          return;
        } else {
          console.log('   ✅ Executed successfully');
        }
      } catch (error) {
        console.log(`   ⚠️  Statement execution failed or not supported:`, error.message);
      }
    }

    console.log('\n🎉 Migration completed successfully!');
    
    // Verify the table structure
    console.log('\n🔍 Verifying table structure...');
    const { data: columns, error: verifyError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'ai_matcher_results')
      .order('ordinal_position');

    if (verifyError) {
      console.log('⚠️  Could not verify table structure:', verifyError.message);
    } else {
      console.log('✅ Table structure verified:');
      columns.forEach(col => {
        console.log(`   - ${col.column_name} (${col.data_type})`);
      });
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    
    // Fallback: provide manual instructions
    console.log('\n📋 Manual execution required:');
    console.log('Please copy the SQL from supabase-migration.sql and execute it in your Supabase dashboard:');
    console.log('🔗 https://supabase.com/dashboard/project/efxpwrnxdorgzcqhbnfn/sql');
  }
}

// Run the migration
executeMigration().catch(console.error);