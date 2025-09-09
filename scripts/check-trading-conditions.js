const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://efxpwrnxdorgzcqhbnfn.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAzMzIzNSwiZXhwIjoyMDcyNjA5MjM1fQ.BKmSaW8dSc6soQZOh7zZGXMNO-evJZkSbLVJzxoYSYA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeTradingConditions() {
  try {
    console.log('🔍 Analyzing broker trading conditions...');
    
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('id, name, platforms, instruments, min_deposit, spreads_avg, leverage_max, fees')
      .order('name');
    
    if (error) {
      console.error('❌ Error fetching brokers:', error);
      return;
    }
    
    console.log(`📊 Total brokers: ${brokers.length}`);
    
    // Analyze platforms
    let emptyPlatforms = 0;
    let shortPlatforms = 0;
    let platformPatterns = {};
    
    // Analyze instruments
    let emptyInstruments = 0;
    let shortInstruments = 0;
    let instrumentPatterns = {};
    
    // Analyze deposits
    let emptyDeposits = 0;
    let zeroDeposits = 0;
    
    // Analyze spreads
    let emptySpreads = 0;
    let zeroSpreads = 0;
    
    // Analyze leverage
    let emptyLeverage = 0;
    let shortLeverage = 0;
    let leveragePatterns = {};
    
    // Analyze fees
    let emptyFees = 0;
    let simpleFees = 0;
    
    const platformIssues = [];
    const instrumentIssues = [];
    const depositIssues = [];
    const spreadIssues = [];
    const leverageIssues = [];
    const feeIssues = [];
    
    brokers.forEach(broker => {
      // Platforms analysis
      const platforms = broker.platforms || [];
      if (platforms.length === 0) {
        emptyPlatforms++;
        platformIssues.push(broker.name);
      } else if (platforms.length <= 2) {
        shortPlatforms++;
      }
      
      platforms.forEach(platform => {
        const key = platform.substring(0, 20);
        platformPatterns[key] = (platformPatterns[key] || 0) + 1;
      });
      
      // Instruments analysis
      const instruments = broker.instruments || [];
      if (instruments.length === 0) {
        emptyInstruments++;
        instrumentIssues.push(broker.name);
      } else if (instruments.length <= 3) {
        shortInstruments++;
      }
      
      instruments.forEach(instrument => {
        const key = instrument.substring(0, 15);
        instrumentPatterns[key] = (instrumentPatterns[key] || 0) + 1;
      });
      
      // Deposit analysis
      if (!broker.min_deposit) {
        emptyDeposits++;
        depositIssues.push(broker.name);
      } else if (broker.min_deposit === 0) {
        zeroDeposits++;
      }
      
      // Spreads analysis
      if (!broker.spreads_avg) {
        emptySpreads++;
        spreadIssues.push(broker.name);
      } else if (broker.spreads_avg === 0) {
        zeroSpreads++;
      }
      
      // Leverage analysis
      const leverage = String(broker.leverage_max || '').trim();
      if (leverage.length === 0) {
        emptyLeverage++;
        leverageIssues.push(broker.name);
      } else if (leverage.length < 5) {
        shortLeverage++;
      }
      
      if (leverage) {
        const key = leverage.substring(0, 10);
        leveragePatterns[key] = (leveragePatterns[key] || 0) + 1;
      }
      
      // Fees analysis
      if (!broker.fees) {
        emptyFees++;
        feeIssues.push(broker.name);
      } else {
        const feeKeys = Object.keys(broker.fees);
        if (feeKeys.length <= 2) {
          simpleFees++;
        }
      }
    });
    
    console.log('\n📈 Trading Conditions Analysis:');
    
    console.log('\n🖥️ Trading Platforms:');
    console.log(`   ❌ Empty platforms: ${emptyPlatforms}`);
    console.log(`   ⚠️ Limited platforms (≤2): ${shortPlatforms}`);
    
    console.log('\n📊 Trading Instruments:');
    console.log(`   ❌ Empty instruments: ${emptyInstruments}`);
    console.log(`   ⚠️ Limited instruments (≤3): ${shortInstruments}`);
    
    console.log('\n💰 Minimum Deposits:');
    console.log(`   ❌ Empty deposits: ${emptyDeposits}`);
    console.log(`   ⚠️ Zero deposits: ${zeroDeposits}`);
    
    console.log('\n📉 Spreads:');
    console.log(`   ❌ Empty spreads: ${emptySpreads}`);
    console.log(`   ⚠️ Zero spreads: ${zeroSpreads}`);
    
    console.log('\n⚡ Leverage:');
    console.log(`   ❌ Empty leverage: ${emptyLeverage}`);
    console.log(`   ⚠️ Short leverage (≤5 chars): ${shortLeverage}`);
    
    console.log('\n💳 Fees:');
    console.log(`   ❌ Empty fees: ${emptyFees}`);
    console.log(`   ⚠️ Simple fees (≤2 types): ${simpleFees}`);
    
    // Show top patterns
    console.log('\n📋 Most common platforms:');
    Object.entries(platformPatterns)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([pattern, count]) => {
        console.log(`   ${count}x: "${pattern}"`);
      });
    
    console.log('\n📋 Most common instruments:');
    Object.entries(instrumentPatterns)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([pattern, count]) => {
        console.log(`   ${count}x: "${pattern}"`);
      });
    
    console.log('\n📋 Most common leverage patterns:');
    Object.entries(leveragePatterns)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([pattern, count]) => {
        console.log(`   ${count}x: "${pattern}"`);
      });
    
    // Show sample issues
    if (platformIssues.length > 0) {
      console.log('\n⚠️ Brokers with empty platforms:');
      platformIssues.slice(0, 10).forEach(name => {
        console.log(`   - ${name}`);
      });
      if (platformIssues.length > 10) {
        console.log(`   ... and ${platformIssues.length - 10} more`);
      }
    }
    
    if (instrumentIssues.length > 0) {
      console.log('\n⚠️ Brokers with empty instruments:');
      instrumentIssues.slice(0, 10).forEach(name => {
        console.log(`   - ${name}`);
      });
      if (instrumentIssues.length > 10) {
        console.log(`   ... and ${instrumentIssues.length - 10} more`);
      }
    }
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

analyzeTradingConditions();