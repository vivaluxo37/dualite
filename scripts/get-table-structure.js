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

async function getActualTableStructure() {
  try {
    console.log('Getting actual ai_matcher_results table structure...');
    
    // Use a raw SQL query to get column information
    const { data, error } = await supabase
      .rpc('exec_sql', { 
        sql: `
          SELECT 
            column_name,
            data_type,
            is_nullable,
            column_default,
            character_maximum_length,
            numeric_precision,
            numeric_scale
          FROM information_schema.columns 
          WHERE table_name = 'ai_matcher_results' 
          AND table_schema = 'public'
          ORDER BY ordinal_position;
        `
      });
    
    if (error) {
      console.log('Cannot use exec_sql. Trying alternative approach...');
      
      // Try to get sample data to infer structure
      const { data: sampleData, error: sampleError } = await supabase
        .from('ai_matcher_results')
        .select('*')
        .limit(1);
      
      if (sampleError) {
        console.log('Sample data error:', sampleError.message);
      } else {
        console.log('Sample data structure:', sampleData);
        if (sampleData && sampleData.length > 0) {
          console.log('Available columns:', Object.keys(sampleData[0]));
        }
      }
      
      // Try different column combinations to see what exists
      const possibleColumns = [
        'id', 'user_id', 'created_at', 'updated_at', 'score', 'match_score',
        'preferences', 'user_preferences', 'brokers', 'recommended_brokers',
        'data', 'metadata', 'results', 'analysis'
      ];
      
      console.log('\nChecking which columns exist:');
      for (const column of possibleColumns) {
        try {
          const { data: colData, error: colError } = await supabase
            .from('ai_matcher_results')
            .select(column)
            .limit(1);
          
          if (colError) {
            console.log(`  ❌ ${column}: ${colError.message}`);
          } else {
            console.log(`  ✅ ${column}: exists`);
          }
        } catch (e) {
          console.log(`  ❌ ${column}: error checking`);
        }
      }
    } else {
      console.log('Table structure from information_schema:');
      console.table(data);
    }
    
  } catch (error) {
    console.error('Error getting table structure:', error);
  }
}

getActualTableStructure();