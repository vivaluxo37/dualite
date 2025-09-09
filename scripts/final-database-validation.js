const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function validateDatabase() {
  console.log('🔍 Final Database Validation Report');
  console.log('=' .repeat(50));
  
  try {
    // Get total broker count
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('*');
    
    if (error) throw error;
    
    console.log(`📊 Total Brokers: ${brokers.length}`);
    console.log('');
    
    // Critical fields validation
    const criticalFields = [
      'founded_year',
      'min_deposit', 
      'trust_score',
      'fees',
      'pros',
      'cons'
    ];
    
    console.log('🎯 CRITICAL FIELDS VALIDATION:');
    console.log('-'.repeat(40));
    
    for (const field of criticalFields) {
      const nullCount = brokers.filter(broker => 
        broker[field] === null || 
        broker[field] === undefined || 
        broker[field] === '' ||
        (Array.isArray(broker[field]) && broker[field].length === 0)
      ).length;
      
      const percentage = ((nullCount / brokers.length) * 100).toFixed(1);
      const status = nullCount === 0 ? '✅' : '❌';
      
      console.log(`${status} ${field}: ${nullCount} nulls (${percentage}%)`);
    }
    
    // Check trading conditions separately
    const { data: tradingConditions } = await supabase
      .from('broker_trading_conditions')
      .select('*');
    
    console.log('');
    console.log('📊 TRADING CONDITIONS DATA:');
    console.log('-'.repeat(40));
    console.log(`Brokers with trading conditions: ${tradingConditions?.length || 0}`);
    
    if (tradingConditions && tradingConditions.length > 0) {
      const spreadsCount = tradingConditions.filter(tc => 
        tc.spread_eur_usd_min !== null || 
        tc.spread_gbp_usd_min !== null || 
        tc.spread_usd_jpy_min !== null
      ).length;
      
      const leverageCount = tradingConditions.filter(tc => 
        tc.leverage_forex_max !== null ||
        tc.leverage_crypto_max !== null ||
        tc.leverage_indices_max !== null
      ).length;
      
      console.log(`✅ Brokers with spreads data: ${spreadsCount}`);
      console.log(`✅ Brokers with leverage data: ${leverageCount}`);
    }
    
    console.log('');
    
    // Trust score distribution
    const trustScores = brokers.map(b => b.trust_score).filter(s => s !== null);
    const avgTrustScore = (trustScores.reduce((a, b) => a + b, 0) / trustScores.length).toFixed(1);
    const minTrustScore = Math.min(...trustScores);
    const maxTrustScore = Math.max(...trustScores);
    
    console.log('📈 TRUST SCORE ANALYSIS:');
    console.log('-'.repeat(40));
    console.log(`Average: ${avgTrustScore}`);
    console.log(`Range: ${minTrustScore} - ${maxTrustScore}`);
    console.log('');
    
    // Regulation tier distribution
    const tierCounts = {};
    brokers.forEach(broker => {
      const tier = broker.regulation_tier || 'unknown';
      tierCounts[tier] = (tierCounts[tier] || 0) + 1;
    });
    
    console.log('🏛️ REGULATION TIER DISTRIBUTION:');
    console.log('-'.repeat(40));
    Object.entries(tierCounts).forEach(([tier, count]) => {
      const percentage = ((count / brokers.length) * 100).toFixed(1);
      console.log(`${tier}: ${count} brokers (${percentage}%)`);
    });
    console.log('');
    
    // Min deposit analysis
    const deposits = brokers.map(b => b.min_deposit).filter(d => d !== null && d > 0);
    const avgDeposit = (deposits.reduce((a, b) => a + b, 0) / deposits.length).toFixed(0);
    const minDeposit = Math.min(...deposits);
    const maxDeposit = Math.max(...deposits);
    
    console.log('💰 MIN DEPOSIT ANALYSIS:');
    console.log('-'.repeat(40));
    console.log(`Average: $${avgDeposit}`);
    console.log(`Range: $${minDeposit} - $${maxDeposit}`);
    console.log('');
    
    // Sample broker data
    console.log('📋 SAMPLE BROKER DATA:');
    console.log('-'.repeat(40));
    const sampleBrokers = brokers.slice(0, 3);
    sampleBrokers.forEach((broker, index) => {
      console.log(`${index + 1}. ${broker.name}`);
      console.log(`   Trust Score: ${broker.trust_score}`);
      console.log(`   Min Deposit: $${broker.min_deposit}`);
      console.log(`   Regulation: ${broker.regulation_tier}`);
      console.log(`   Founded: ${broker.founded_year}`);
      console.log(`   Pros: ${broker.pros?.length || 0} items`);
      console.log(`   Cons: ${broker.cons?.length || 0} items`);
      console.log('');
    });
    
    // Final validation summary
    const allCriticalFieldsValid = criticalFields.every(field => {
      const nullCount = brokers.filter(broker => 
        broker[field] === null || 
        broker[field] === undefined || 
        broker[field] === '' ||
        (Array.isArray(broker[field]) && broker[field].length === 0)
      ).length;
      return nullCount === 0;
    });
    
    console.log('🎉 FINAL VALIDATION RESULT:');
    console.log('=' .repeat(50));
    if (allCriticalFieldsValid) {
      console.log('✅ SUCCESS: All critical fields have non-NULL values!');
      console.log('✅ Database is ready for production use');
      console.log(`✅ Total of ${brokers.length} brokers successfully processed`);
    } else {
      console.log('❌ FAILURE: Some critical fields still have NULL values');
      console.log('❌ Additional data enrichment required');
    }
    
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
  }
}

validateDatabase();