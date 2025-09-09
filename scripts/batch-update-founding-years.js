const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://efxpwrnxdorgzcqhbnfn.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAzMzIzNSwiZXhwIjoyMDcyNjA5MjM1fQ.BKmSaW8dSc6soQZOh7zZGXMNO-evJZkSbLVJzxoYSYA';

const supabase = createClient(supabaseUrl, supabaseKey);

// Known founding years for major brokers
const knownFoundingYears = {
  'Webull': 2017,
  'Admirals': 2001,
  'Axi': 2007,
  'OANDA': 1996,
  'Interactive Brokers': 1978,
  'Charles Schwab': 1971,
  'E*TRADE': 1991,
  'Fidelity': 1946,
  'Robinhood': 2013,
  'Plus500': 2008,
  'eToro': 2007,
  'XM': 2009,
  'FBS': 2009,
  'HotForex': 2010,
  'InstaForex': 2007,
  'Alpari': 1998,
  'FXCM': 1999,
  'Forex.com': 1999,
  'CMC Markets': 1989,
  'City Index': 1983,
  'AvaTrade': 2006,
  'XTB': 2002,
  'ThinkMarkets': 2010,
  'Vantage': 2009,
  'IC Markets': 2007,
  'FP Markets': 2005,
  'Tickmill': 2014,
  'TMGM': 2013,
  'Eightcap': 2009,
  'BlackBull Markets': 2014,
  'Blueberry Markets': 2016,
  'GO Markets': 2006,
  'Fusion Markets': 2017,
  'Darwinex': 2012,
  'NAGA': 2015,
  'ZuluTrade': 2007,
  'cTrader': 2010,
  'MetaTrader': 2000,
  'TradingView': 2011,
  'MultiBank Group': 2005,
  'FxPro': 2006,
  'LCG': 1996,
  'Saxo Bank': 1992,
  'IG Group': 1974,
  'GAIN Capital': 1999,
  'Dukascopy': 2004,
  'Swissquote': 1996,
  'Admiral Markets': 2001
};

async function updateFoundingYears() {
  try {
    console.log('🔍 Fetching brokers with placeholder years...');
    
    // Get brokers with placeholder years (less than 100)
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('id, name, established_year')
      .lt('established_year', 100);
    
    if (error) {
      console.error('❌ Error fetching brokers:', error);
      return;
    }
    
    console.log(`📊 Found ${brokers.length} brokers with placeholder years`);
    
    let updatedCount = 0;
    let notFoundCount = 0;
    
    for (const broker of brokers) {
      const foundingYear = knownFoundingYears[broker.name];
      
      if (foundingYear) {
        console.log(`🔄 Updating ${broker.name}: ${broker.established_year} → ${foundingYear}`);
        
        const { error: updateError } = await supabase
          .from('brokers')
          .update({ established_year: foundingYear })
          .eq('id', broker.id);
        
        if (updateError) {
          console.error(`❌ Error updating ${broker.name}:`, updateError);
        } else {
          updatedCount++;
        }
      } else {
        console.log(`⚠️ No founding year data for: ${broker.name}`);
        notFoundCount++;
      }
    }
    
    console.log('\n📈 Update Summary:');
    console.log(`   ✅ Updated: ${updatedCount} brokers`);
    console.log(`   ⚠️ Not found: ${notFoundCount} brokers`);
    console.log(`   📊 Total processed: ${brokers.length} brokers`);
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

updateFoundingYears();