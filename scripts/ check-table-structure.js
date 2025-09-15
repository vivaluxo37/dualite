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

async function checkTableStructure() {
  try {
    console.log('Checking ai_matcher_results table structure...');
    
    // Try to describe the table by attempting to insert and see what columns are expected
    const testRecord = {
      // Try with minimal required fields
      user_id: '00000000-0000-0000-0000-000000000000',
      match_score: 85,
      user_preferences: { risk_level: 'moderate' },
      recommended_brokers: [{ id: 1, name: 'Test Broker' }]
    };
    
    const { error: insertError } = await supabase
      .from('ai_matcher_results')
      .insert([testRecord]);
    
    if (insertError) {
      console.log('Insert error details:', insertError.message);
      
      // Try to select all columns to see what exists
      const { data: selectData, error: selectError } = await supabase
        .from('ai_matcher_results')
        .select('*')
        .limit(1);
      
      if (selectError) {
        console.log('Select error:', selectError.message);
      } else {
        console.log('✅ Table is accessible for SELECT operations');
        console.log('Sample data structure:', selectData);
      }
    }
    
    // Check what columns exist by trying to select specific ones
    const columnsToCheck = ['id', 'user_id', 'created_at', 'match_score', 'user_preferences', 'recommended_brokers', 'metadata'];
    
    for (const column of columnsToCheck) {
      const { data, error } = await supabase
        .from('ai_matcher_results')
        .select(column)
        .limit(1);
      
      if (error) {
        console.log(`❌ Column '${column}': ${error.message}`);
      } else {
        console.log(`✅ Column '${column}': exists`);
      }
    }
    
  } catch (error) {
    console.error('Error checking table structure:', error);
  }
}

checkTableStructure();