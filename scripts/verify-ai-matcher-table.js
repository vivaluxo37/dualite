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

async function verifyTableCreation() {
  try {
    console.log('Verifying ai_matcher_results table creation...');
    
    // Check if the table exists by trying to select from it
    const { data, error } = await supabase
      .from('ai_matcher_results')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        console.error('Table ai_matcher_results does not exist yet.');
        console.log('Please run the migration SQL in your Supabase dashboard SQL editor.');
      } else {
        console.error('Error accessing ai_matcher_results table:', error.message);
      }
      return false;
    }
    
    console.log('✅ ai_matcher_results table exists and is accessible!');
    
    // Check table structure
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'ai_matcher_results')
      .eq('table_schema', 'public');
    
    if (columnsError) {
      console.error('Error checking table structure:', columnsError.message);
    } else {
      console.log('\n📋 Table structure:');
      columns?.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
      });
    }
    
    // Test RLS policies by trying to insert a test record (this should fail without proper auth)
    const testRecord = {
      user_id: '00000000-0000-0000-0000-000000000000', // Invalid UUID for testing
      match_score: 85,
      user_preferences: { risk_level: 'moderate', experience: 'intermediate' },
      recommended_brokers: [{ id: 1, name: 'Test Broker', score: 90 }],
      metadata: { test: true }
    };
    
    const { error: insertError } = await supabase
      .from('ai_matcher_results')
      .insert([testRecord]);
    
    if (insertError) {
      console.log('\n🔒 RLS policies appear to be working (insert failed as expected for invalid user):');
      console.log(`  Error: ${insertError.message}`);
    } else {
      console.log('\n⚠️  Warning: Insert succeeded - verify RLS policies are properly configured');
    }
    
    return true;
    
  } catch (error) {
    console.error('Unexpected error during verification:', error);
    return false;
  }
}

// Execute verification
verifyTableCreation().then(success => {
  if (success) {
    console.log('\n🎉 Migration verification completed successfully!');
  } else {
    console.log('\n❌ Migration verification failed. Please check the migration SQL.');
  }
});