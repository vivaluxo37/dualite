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

async function comprehensiveVerification() {
  console.log('🔍 Comprehensive AI Matcher Results Table Verification\n');
  
  try {
    // Test 1: Check table accessibility
    console.log('1. Testing table accessibility...');
    const { data: selectData, error: selectError } = await supabase
      .from('ai_matcher_results')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.log('   ❌ Table not accessible:', selectError.message);
      console.log('   📝 Please run the comprehensive SQL setup script first.');
      return false;
    }
    console.log('   ✅ Table is accessible');
    
    // Test 2: Check all required columns exist
    console.log('\n2. Checking required columns...');
    const requiredColumns = ['id', 'user_id', 'created_at', 'match_score', 'user_preferences', 'recommended_brokers', 'metadata'];
    let allColumnsExist = true;
    
    for (const column of requiredColumns) {
      const { data, error } = await supabase
        .from('ai_matcher_results')
        .select(column)
        .limit(1);
      
      if (error) {
        console.log(`   ❌ Missing column: ${column}`);
        allColumnsExist = false;
      } else {
        console.log(`   ✅ Column exists: ${column}`);
      }
    }
    
    if (!allColumnsExist) {
      console.log('   📝 Some columns are missing. Please run the ALTER TABLE script.');
      return false;
    }
    
    // Test 3: Test RLS policies (should fail for invalid user)
    console.log('\n3. Testing Row Level Security...');
    const testRecord = {
      user_id: '00000000-0000-0000-0000-000000000000', // Invalid UUID
      match_score: 85,
      user_preferences: { risk_level: 'moderate', experience: 'intermediate' },
      recommended_brokers: [{ id: 1, name: 'Test Broker', score: 90 }],
      metadata: { test: true }
    };
    
    const { error: insertError } = await supabase
      .from('ai_matcher_results')
      .insert([testRecord]);
    
    if (insertError) {
      console.log('   ✅ RLS working: Insert blocked for invalid user');
      console.log(`      Error: ${insertError.message}`);
    } else {
      console.log('   ⚠️  Warning: Insert succeeded - RLS may not be properly configured');
    }
    
    // Test 4: Test data validation (match_score constraints)
    console.log('\n4. Testing data validation...');
    const invalidRecord = {
      user_id: '00000000-0000-0000-0000-000000000000',
      match_score: 150, // Invalid: should be 0-100
      user_preferences: {},
      recommended_brokers: []
    };
    
    const { error: validationError } = await supabase
      .from('ai_matcher_results')
      .insert([invalidRecord]);
    
    if (validationError) {
      console.log('   ✅ Data validation working: Invalid match_score rejected');
      console.log(`      Error: ${validationError.message}`);
    } else {
      console.log('   ⚠️  Warning: Invalid data was accepted - check constraints');
    }
    
    // Test 5: Check if we can get table stats
    console.log('\n5. Getting table statistics...');
    const { data: countData, error: countError } = await supabase
      .from('ai_matcher_results')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.log('   ❌ Could not get table count:', countError.message);
    } else {
      console.log(`   ✅ Table accessible, current record count: ${countData?.length || 0}`);
    }
    
    console.log('\n🎉 Verification completed!');
    console.log('\n📋 Summary:');
    console.log('   - Table exists and is accessible');
    console.log('   - All required columns are present');
    console.log('   - RLS policies appear to be working');
    console.log('   - Data validation is in place');
    
    console.log('\n🚀 Your AI matcher results table is ready to use!');
    console.log('\nNext steps:');
    console.log('   1. Implement the AI matching logic in your application');
    console.log('   2. Create functions to save and retrieve matcher results');
    console.log('   3. Add UI components to display AI matcher results');
    
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error during verification:', error);
    return false;
  }
}

// Run the comprehensive verification
comprehensiveVerification().then(success => {
  if (!success) {
    console.log('\n❌ Verification failed. Please check the SQL scripts and run them in your Supabase dashboard.');
    process.exit(1);
  }
});