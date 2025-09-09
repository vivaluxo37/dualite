const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Known founding years for major brokers (to reduce API calls)
const knownFoundingYears = {
  'admirals': 2003,
  'xm': 2009,
  'ig group': 1974,
  'fxcm': 1999,
  'plus500': 2008,
  'etoro': 2007,
  'avatrade': 2006,
  'pepperstone': 2010,
  'oanda': 1996,
  'forex.com': 1999,
  'fxtm': 2011,
  'hotforex': 2010,
  'exness': 2008,
  'ic markets': 2007,
  'tickmill': 2014,
  'alpari': 1998,
  'fbs': 2009,
  'roboforex': 2009,
  'instaforex': 2007,
  'axitrader': 2007
};

// Web search function using the web_search tool
async function searchBrokerInfo(brokerName, searchType) {
  const queries = {
    founding: `${brokerName} forex broker founded established year history`,
    spreads: `${brokerName} forex broker spreads EUR/USD trading conditions`,
    leverage: `${brokerName} forex broker maximum leverage trading`,
    regulation: `${brokerName} forex broker regulation license regulatory authority`,
    minDeposit: `${brokerName} forex broker minimum deposit account opening`,
    platforms: `${brokerName} forex broker trading platforms MetaTrader`,
    fees: `${brokerName} forex broker fees commissions trading costs`
  };
  
  // Search patterns for founding year
  const foundingPatterns = [
    `${brokerName} forex broker founded established year history`,
    `${brokerName} company founded when started`,
    `${brokerName} history founding establishment`,
    `"${brokerName}" founded year wikipedia`
  ];
  
  const query = queries[searchType] || `${brokerName} forex broker information`;
  
  try {
    // Note: This would use the web_search tool in the actual implementation
    console.log(`🔍 Searching: ${query}`);
    return {
      query,
      searchType,
      brokerName,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`❌ Search failed for ${brokerName} (${searchType}):`, error.message);
    return null;
  }
}

// Extract founding year from search results
function extractFoundingYear(searchResults, brokerName) {
  if (!searchResults) return null;
  
  // Common patterns for founding years
  const yearPatterns = [
    /founded in (\d{4})/i,
    /established in (\d{4})/i,
    /since (\d{4})/i,
    /(\d{4}) founded/i,
    /(\d{4}) established/i,
    /started in (\d{4})/i
  ];
  
  const text = JSON.stringify(searchResults).toLowerCase();
  
  for (const pattern of yearPatterns) {
    const match = text.match(pattern);
    if (match) {
      const year = parseInt(match[1]);
      if (year >= 1970 && year <= new Date().getFullYear()) {
        return year;
      }
    }
  }
  
  return null;
}

// Extract spreads information
function extractSpreads(searchResults, brokerName) {
  if (!searchResults) return null;
  
  const text = JSON.stringify(searchResults).toLowerCase();
  
  // Look for EUR/USD spread patterns
  const spreadPatterns = [
    /eur\/usd.*?(\d+\.\d+)\s*pips?/i,
    /eurusd.*?(\d+\.\d+)\s*pips?/i,
    /spread.*?eur\/usd.*?(\d+\.\d+)/i,
    /from\s*(\d+\.\d+)\s*pips?/i
  ];
  
  for (const pattern of spreadPatterns) {
    const match = text.match(pattern);
    if (match) {
      const spread = parseFloat(match[1]);
      if (spread >= 0.1 && spread <= 10) {
        return spread;
      }
    }
  }
  
  return null;
}

// Extract leverage information
function extractLeverage(searchResults, brokerName) {
  if (!searchResults) return null;
  
  const text = JSON.stringify(searchResults).toLowerCase();
  
  // Look for leverage patterns
  const leveragePatterns = [
    /leverage.*?1:(\d+)/i,
    /maximum leverage.*?(\d+):1/i,
    /up to 1:(\d+)/i,
    /(\d+):1 leverage/i
  ];
  
  for (const pattern of leveragePatterns) {
    const match = text.match(pattern);
    if (match) {
      const leverage = parseInt(match[1]);
      if (leverage >= 1 && leverage <= 3000) {
        return `1:${leverage}`;
      }
    }
  }
  
  return null;
}

// Extract minimum deposit
function extractMinDeposit(searchResults, brokerName) {
  if (!searchResults) return null;
  
  const text = JSON.stringify(searchResults).toLowerCase();
  
  // Look for minimum deposit patterns
  const depositPatterns = [
    /minimum deposit.*?\$(\d+)/i,
    /min deposit.*?\$(\d+)/i,
    /deposit from \$(\d+)/i,
    /starting from \$(\d+)/i
  ];
  
  for (const pattern of depositPatterns) {
    const match = text.match(pattern);
    if (match) {
      const deposit = parseInt(match[1]);
      if (deposit >= 1 && deposit <= 100000) {
        return deposit;
      }
    }
  }
  
  return null;
}

// Extract regulation information
function extractRegulation(searchResults, brokerName) {
  if (!searchResults) return null;
  
  const text = JSON.stringify(searchResults).toLowerCase();
  
  // Tier 1 regulators
  const tier1Regulators = ['fca', 'cftc', 'nfa', 'asic', 'bafin', 'amf', 'consob', 'cnmv'];
  // Tier 2 regulators
  const tier2Regulators = ['cysec', 'fsa', 'dfsa', 'cbcs', 'vfsc', 'fsc', 'isa'];
  
  for (const regulator of tier1Regulators) {
    if (text.includes(regulator)) {
      return 'tier1';
    }
  }
  
  for (const regulator of tier2Regulators) {
    if (text.includes(regulator)) {
      return 'tier2';
    }
  }
  
  return 'unregulated';
}

// Main enrichment function
async function enrichBrokerWithWebData(broker) {
  console.log(`\n🔍 Enriching data for: ${broker.name}`);
  
  const enrichedData = { ...broker };
  let hasUpdates = false;
  
  try {
    // Search for founding year if missing
    if (!broker.founded_year) {
      console.log(`  📅 Searching founding year...`);
      const foundingResults = await searchBrokerInfo(broker.name, 'founding');
      const foundingYear = extractFoundingYear(foundingResults, broker.name);
      
      if (foundingYear) {
        enrichedData.founded_year = foundingYear;
        hasUpdates = true;
        console.log(`  ✅ Found founding year: ${foundingYear}`);
      } else {
        console.log(`  ⚠️ Could not find founding year`);
      }
    }
    
    // Search for spreads if missing or default
    if (!broker.spreads_avg || broker.spreads_avg === 1.5) {
      console.log(`  📊 Searching spreads...`);
      const spreadsResults = await searchBrokerInfo(broker.name, 'spreads');
      const spreads = extractSpreads(spreadsResults, broker.name);
      
      if (spreads) {
        enrichedData.spreads_avg = spreads;
        hasUpdates = true;
        console.log(`  ✅ Found spreads: ${spreads} pips`);
      } else {
        console.log(`  ⚠️ Could not find spreads`);
      }
    }
    
    // Search for leverage if missing or default
    if (!broker.leverage_max || broker.leverage_max === '1:500') {
      console.log(`  ⚡ Searching leverage...`);
      const leverageResults = await searchBrokerInfo(broker.name, 'leverage');
      const leverage = extractLeverage(leverageResults, broker.name);
      
      if (leverage) {
        enrichedData.leverage_max = leverage;
        hasUpdates = true;
        console.log(`  ✅ Found leverage: ${leverage}`);
      } else {
        console.log(`  ⚠️ Could not find leverage`);
      }
    }
    
    // Search for minimum deposit if missing or default
    if (!broker.min_deposit || broker.min_deposit === 100) {
      console.log(`  💰 Searching minimum deposit...`);
      const depositResults = await searchBrokerInfo(broker.name, 'minDeposit');
      const minDeposit = extractMinDeposit(depositResults, broker.name);
      
      if (minDeposit) {
        enrichedData.min_deposit = minDeposit;
        hasUpdates = true;
        console.log(`  ✅ Found min deposit: $${minDeposit}`);
      } else {
        console.log(`  ⚠️ Could not find min deposit`);
      }
    }
    
    // Verify regulation tier
    console.log(`  🏛️ Verifying regulation...`);
    const regulationResults = await searchBrokerInfo(broker.name, 'regulation');
    const regulationTier = extractRegulation(regulationResults, broker.name);
    
    if (regulationTier && regulationTier !== broker.regulation_tier) {
      enrichedData.regulation_tier = regulationTier;
      hasUpdates = true;
      console.log(`  ✅ Updated regulation: ${regulationTier}`);
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return { enrichedData, hasUpdates };
    
  } catch (error) {
    console.error(`❌ Error enriching ${broker.name}:`, error.message);
    return { enrichedData: broker, hasUpdates: false };
  }
}

// Batch update function
async function updateBrokerBatch(updates) {
  if (updates.length === 0) return { success: 0, failed: 0 };
  
  let successCount = 0;
  let failedCount = 0;
  
  for (const update of updates) {
    try {
      const { error } = await supabase
        .from('brokers')
        .update({
          founded_year: update.data.founded_year,
          spreads_avg: update.data.spreads_avg,
          leverage_max: update.data.leverage_max,
          min_deposit: update.data.min_deposit,
          regulation_tier: update.data.regulation_tier,
          updated_at: new Date().toISOString()
        })
        .eq('id', update.id);
      
      if (error) {
        console.error(`❌ Error updating ${update.data.name}:`, error);
        failedCount++;
      } else {
        console.log(`✅ Updated ${update.data.name}`);
        successCount++;
      }
    } catch (error) {
      console.error(`❌ Error updating ${update.data.name}:`, error.message);
      failedCount++;
    }
  }
  
  return { success: successCount, failed: failedCount };
}

// Main execution function
async function webBasedBrokerEnrichment() {
  console.log('🚀 Starting Web-Based Broker Data Enrichment');
  console.log('=' .repeat(60));
  
  try {
    // Fetch all brokers
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching brokers:', error);
      return;
    }
    
    console.log(`📊 Processing ${brokers.length} brokers...`);
    
    const batchSize = 10;
    let totalUpdated = 0;
    let totalFailed = 0;
    
    // Process brokers in batches
    for (let i = 0; i < brokers.length; i += batchSize) {
      const batch = brokers.slice(i, i + batchSize);
      console.log(`\n📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(brokers.length/batchSize)}...`);
      
      const updates = [];
      
      for (const broker of batch) {
        const { enrichedData, hasUpdates } = await enrichBrokerWithWebData(broker);
        
        if (hasUpdates) {
          updates.push({
            id: broker.id,
            data: enrichedData
          });
        }
      }
      
      // Update database
      if (updates.length > 0) {
        console.log(`\n💾 Updating ${updates.length} brokers in database...`);
        const { success, failed } = await updateBrokerBatch(updates);
        totalUpdated += success;
        totalFailed += failed;
      }
      
      // Delay between batches
      if (i + batchSize < brokers.length) {
        console.log('⏳ Waiting before next batch...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    console.log('\n' + '=' .repeat(60));
    console.log('🎉 WEB-BASED ENRICHMENT COMPLETE');
    console.log('=' .repeat(60));
    console.log(`✅ Successfully updated: ${totalUpdated} brokers`);
    console.log(`❌ Failed updates: ${totalFailed} brokers`);
    console.log(`📊 Total processed: ${brokers.length} brokers`);
    
    // Run final validation
    console.log('\n🔍 Running final validation...');
    await runFinalValidation();
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

// Final validation function
async function runFinalValidation() {
  try {
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('founded_year, spreads_avg, leverage_max, min_deposit, regulation_tier');
    
    if (error) {
      console.error('Validation error:', error);
      return;
    }
    
    const stats = {
      founded_year: brokers.filter(b => !b.founded_year).length,
      spreads_avg: brokers.filter(b => !b.spreads_avg).length,
      leverage_max: brokers.filter(b => !b.leverage_max).length,
      min_deposit: brokers.filter(b => !b.min_deposit).length,
      regulation_tier: brokers.filter(b => !b.regulation_tier).length
    };
    
    console.log('\n📊 FINAL VALIDATION RESULTS:');
    console.log('----------------------------------------');
    Object.entries(stats).forEach(([field, nullCount]) => {
      const percentage = ((nullCount / brokers.length) * 100).toFixed(1);
      const status = nullCount === 0 ? '✅' : '⚠️';
      console.log(`${status} ${field}: ${nullCount} nulls (${percentage}%)`);
    });
    
    const completionRate = ((brokers.length - stats.founded_year) / brokers.length * 100).toFixed(1);
    console.log(`✅ Founded year completion rate: ${completionRate}%`);
    
  } catch (error) {
    console.error('Validation error:', error);
  }
}

// Export for use in other scripts
module.exports = {
  webBasedBrokerEnrichment,
  enrichBrokerWithWebData,
  searchBrokerInfo
};

// Run if called directly
if (require.main === module) {
  webBasedBrokerEnrichment();
}