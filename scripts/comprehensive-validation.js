const { createClient } = require('@supabase/supabase-js');

// Use actual environment variables
const supabase = createClient(
  'https://efxpwrnxdorgzcqhbnfn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAzMzIzNSwiZXhwIjoyMDcyNjA5MjM1fQ.BKmSaW8dSc6soQZOh7zZGXMNO-evJZkSbLVJzxoYSYA'
);

async function comprehensiveValidation() {
  console.log('🔍 Running comprehensive broker data validation...');
  
  try {
    // Get total count
    const { count: totalCount, error: countError } = await supabase
      .from('brokers')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Count Error:', countError);
      return;
    }
    
    console.log(`\n📊 Total brokers: ${totalCount}`);
    
    // Critical fields to validate
    const criticalFields = [
      'established_year',
      'trust_score', 
      'pros',
      'cons',
      'min_deposit',
      'spreads_avg',
      'leverage_max',
      'regulations',
      'platforms',
      'instruments'
    ];
    
    console.log('\n📈 Field Completion Status:');
    
    for (const field of criticalFields) {
      const { count: nullCount, error } = await supabase
        .from('brokers')
        .select('*', { count: 'exact', head: true })
        .is(field, null);
      
      if (error) {
        console.log(`   ❌ ${field}: Error checking - ${error.message}`);
        continue;
      }
      
      const completionRate = ((totalCount - nullCount) / totalCount * 100).toFixed(1);
      const status = completionRate == 100 ? '✅' : completionRate >= 90 ? '⚠️' : '❌';
      
      console.log(`   ${status} ${field}: ${totalCount - nullCount}/${totalCount} (${completionRate}% complete)`);
    }
    
    // Check for placeholder data
    console.log('\n🔍 Checking for placeholder data:');
    
    // Check for placeholder years (like 20, 19, etc.)
    const { data: placeholderYears } = await supabase
      .from('brokers')
      .select('name, established_year')
      .in('established_year', [20, 19, 18, 17, 16, 15]);
    
    if (placeholderYears && placeholderYears.length > 0) {
      console.log(`   ⚠️ Found ${placeholderYears.length} brokers with placeholder years:`);
      placeholderYears.slice(0, 5).forEach(broker => {
        console.log(`      - ${broker.name}: ${broker.established_year}`);
      });
      if (placeholderYears.length > 5) {
        console.log(`      ... and ${placeholderYears.length - 5} more`);
      }
    } else {
      console.log('   ✅ No placeholder years found');
    }
    
    // Check for default trust scores
    const { data: defaultTrustScores } = await supabase
      .from('brokers')
      .select('name, trust_score')
      .eq('trust_score', 7.5);
    
    if (defaultTrustScores && defaultTrustScores.length > 0) {
      console.log(`   ⚠️ Found ${defaultTrustScores.length} brokers with default trust score (7.5)`);
    } else {
      console.log('   ✅ No default trust scores found');
    }
    
    // Sample of well-enriched brokers
    console.log('\n🌟 Sample of well-enriched brokers:');
    const { data: sampleBrokers } = await supabase
      .from('brokers')
      .select('name, established_year, trust_score, spreads_avg, leverage_max')
      .not('established_year', 'is', null)
      .not('trust_score', 'is', null)
      .not('spreads_avg', 'is', null)
      .not('leverage_max', 'is', null)
      .limit(5);
    
    sampleBrokers?.forEach(broker => {
      console.log(`   📈 ${broker.name}: Est.${broker.established_year}, Trust:${broker.trust_score}, Spreads:${broker.spreads_avg}, Leverage:${broker.leverage_max}`);
    });
    
  } catch (error) {
    console.error('Validation failed:', error);
  }
}

comprehensiveValidation();