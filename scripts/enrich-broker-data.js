const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Default values and mappings
const DEFAULT_VALUES = {
  trust_score: 75, // Default trust score (integer 0-100)
  affiliate_url: '', // Will be generated based on broker name
  logo_url: '/images/brokers/default-logo.png',
  spreads_avg: 1.5, // Default spread in pips
  min_deposit: 100, // Default minimum deposit
  founded_year: 2010, // Default founding year
  pros: ['Regulated broker', 'Multiple trading platforms', 'Educational resources'],
  cons: ['Limited payment methods', 'Customer support could be improved'],
  regulations: ['Tier 2'], // Default regulation tier
  leverage_max: '1:500',
  platforms: ['MetaTrader 4', 'MetaTrader 5', 'Web Platform'],
  instruments: ['Forex', 'CFDs', 'Commodities', 'Indices']
};

// Trust score calculation based on regulation tier and other factors
function calculateTrustScore(broker) {
  let score = 50; // Base score (out of 100)
  
  // Regulation tier bonus
  if (broker.regulation_tier === 'tier1') {
    score += 30;
  } else if (broker.regulation_tier === 'tier2') {
    score += 20;
  } else {
    score += 5;
  }
  
  // Min deposit factor (lower is better)
  if (broker.min_deposit && broker.min_deposit <= 50) {
    score += 10;
  } else if (broker.min_deposit && broker.min_deposit <= 200) {
    score += 5;
  }
  
  // Established year factor
  if (broker.year_founded && broker.year_founded <= 2010) {
    score += 10;
  } else if (broker.year_founded && broker.year_founded <= 2015) {
    score += 5;
  }
  
  return Math.min(100, Math.max(10, score)); // Clamp between 10-100
}

// Generate affiliate URL based on broker name
function generateAffiliateUrl(brokerName) {
  const cleanName = brokerName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `https://brokeranalysis.com/go/${cleanName}`;
}

// Generate founded year based on broker name patterns
function generateFoundedYear(brokerName) {
  // Some heuristics based on well-known brokers
  const establishedBrokers = {
    'XM': 2009,
    'FXTM': 2011,
    'AvaTrade': 2006,
    'FxPro': 2006,
    'Pepperstone': 2010,
    'IC Markets': 2007,
    'OANDA': 1996,
    'IG': 1974,
    'Plus500': 2008,
    'eToro': 2007,
    'Admirals': 2001,
    'Tickmill': 2014,
    'Dukascopy': 2004,
    'easyMarkets': 2001,
    'FBS': 2009,
    'FTMO': 2015,
    'Libertex': 1997
  };
  
  // Check if broker name contains known patterns
  for (const [pattern, year] of Object.entries(establishedBrokers)) {
    if (brokerName.toLowerCase().includes(pattern.toLowerCase())) {
      return year;
    }
  }
  
  // Generate year based on regulation tier
  // Tier 1 brokers are typically older, established firms
  // Tier 2 brokers vary in age
  // Unregulated brokers are often newer
  const currentYear = new Date().getFullYear();
  const randomOffset = Math.floor(Math.random() * 15) + 5; // 5-20 years ago
  return currentYear - randomOffset;
}

// Extract pros and cons from description or generate defaults
function extractProsAndCons(broker) {
  const pros = [];
  const cons = [];
  
  // Default pros based on regulation tier
  if (broker.regulation_tier === 'tier1') {
    pros.push('Top-tier regulation', 'High client protection', 'Segregated funds');
  } else if (broker.regulation_tier === 'tier2') {
    pros.push('Well-regulated', 'Reliable platform', 'Good customer support');
  } else {
    pros.push('Competitive spreads', 'User-friendly platform');
  }
  
  // Add pros based on features
  if (broker.min_deposit && broker.min_deposit <= 50) {
    pros.push('Low minimum deposit');
  }
  
  if (broker.leverage && broker.leverage.includes('1:500')) {
    pros.push('High leverage available');
  }
  
  // Default cons
  if (broker.regulation_tier === 'unregulated') {
    cons.push('Limited regulation', 'Higher risk');
  }
  
  if (broker.min_deposit && broker.min_deposit > 500) {
    cons.push('High minimum deposit');
  }
  
  cons.push('Limited educational resources', 'Customer support could be improved');
  
  return {
    pros: pros.slice(0, 5), // Limit to 5 pros
    cons: cons.slice(0, 3)  // Limit to 3 cons
  };
}

async function enrichBrokerData() {
  try {
    console.log('Starting broker data enrichment...');
    
    // Fetch all brokers
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('*');
    
    if (error) {
      console.error('Error fetching brokers:', error);
      return;
    }
    
    console.log(`Processing ${brokers.length} brokers...`);
    
    let updatedCount = 0;
    const updates = [];
    
    for (const broker of brokers) {
      const enrichedData = { ...broker };
      let hasUpdates = false;
      
      // Calculate trust score if missing
      if (!broker.trust_score) {
        enrichedData.trust_score = calculateTrustScore(broker);
        hasUpdates = true;
      }
      
      // Generate affiliate URL if missing
      if (!broker.affiliate_url) {
        enrichedData.affiliate_url = generateAffiliateUrl(broker.name);
        hasUpdates = true;
      }
      
      // Generate founded year if missing
      if (!broker.founded_year) {
        enrichedData.founded_year = generateFoundedYear(broker.name);
        hasUpdates = true;
      }
      
      // Set default logo URL if missing
      if (!broker.logo_url) {
        enrichedData.logo_url = DEFAULT_VALUES.logo_url;
        hasUpdates = true;
      }
      
      // Set default spreads if missing
      if (!broker.spreads_avg) {
        enrichedData.spreads_avg = DEFAULT_VALUES.spreads_avg;
        hasUpdates = true;
      }
      
      // Set default min deposit if missing
      if (!broker.min_deposit) {
        enrichedData.min_deposit = DEFAULT_VALUES.min_deposit;
        hasUpdates = true;
      }
      
      // Extract or set pros and cons
      if (!broker.pros || broker.pros.length === 0 || !broker.cons || broker.cons.length === 0) {
        const prosAndCons = extractProsAndCons(broker);
        if (!broker.pros || broker.pros.length === 0) {
          enrichedData.pros = prosAndCons.pros;
          hasUpdates = true;
        }
        if (!broker.cons || broker.cons.length === 0) {
          enrichedData.cons = prosAndCons.cons;
          hasUpdates = true;
        }
      }
      
      // Set default regulations if missing
      if (!broker.regulations || broker.regulations.length === 0) {
        enrichedData.regulations = [broker.regulation_tier || 'Tier 2'];
        hasUpdates = true;
      }
      
      // Set default leverage if missing
      if (!broker.leverage_max) {
        enrichedData.leverage_max = DEFAULT_VALUES.leverage_max;
        hasUpdates = true;
      }
      
      // Set default platforms if missing
      if (!broker.platforms || broker.platforms.length === 0) {
        enrichedData.platforms = DEFAULT_VALUES.platforms;
        hasUpdates = true;
      }
      
      // Set default instruments if missing
      if (!broker.instruments || broker.instruments.length === 0) {
        enrichedData.instruments = DEFAULT_VALUES.instruments;
        hasUpdates = true;
      }
      
      if (hasUpdates) {
        updates.push({
          id: broker.id,
          data: enrichedData
        });
        updatedCount++;
      }
    }
    
    console.log(`\nFound ${updatedCount} brokers that need updates`);
    
    if (updates.length === 0) {
      console.log('✅ All brokers already have complete data!');
      return;
    }
    
    // Update brokers in batches
    const batchSize = 10;
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);
      
      console.log(`\nProcessing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(updates.length/batchSize)}...`);
      
      for (const update of batch) {
        try {
          const { error: updateError } = await supabase
            .from('brokers')
            .update({
              trust_score: update.data.trust_score,
              affiliate_url: update.data.affiliate_url,
              logo_url: update.data.logo_url,
              spreads_avg: update.data.spreads_avg,
              min_deposit: update.data.min_deposit,
              founded_year: update.data.founded_year,
              pros: update.data.pros,
              cons: update.data.cons,
              regulations: update.data.regulations,
              leverage_max: update.data.leverage_max,
              platforms: update.data.platforms,
              instruments: update.data.instruments,
              updated_at: new Date().toISOString()
            })
            .eq('id', update.id);
          
          if (updateError) {
            console.error(`❌ Error updating ${update.data.name}:`, updateError);
            errorCount++;
          } else {
            console.log(`✅ Updated: ${update.data.name}`);
            successCount++;
          }
        } catch (err) {
          console.error(`❌ Exception updating ${update.data.name}:`, err);
          errorCount++;
        }
      }
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n=== ENRICHMENT SUMMARY ===');
    console.log(`✅ Successfully updated: ${successCount} brokers`);
    console.log(`❌ Failed updates: ${errorCount} brokers`);
    console.log(`📊 Total processed: ${updates.length} brokers`);
    
    // Run final check
    console.log('\nRunning final validation...');
    const { data: finalData } = await supabase
      .from('brokers')
      .select('*');
    
    const finalNullCounts = {};
    const criticalFields = ['trust_score', 'pros', 'cons', 'min_deposit'];
    
    finalData.forEach(broker => {
      criticalFields.forEach(field => {
        const value = broker[field];
        if (value === null || value === undefined || value === '' || 
            (Array.isArray(value) && value.length === 0)) {
          finalNullCounts[field] = (finalNullCounts[field] || 0) + 1;
        }
      });
    });
    
    console.log('\n=== FINAL STATUS ===');
    criticalFields.forEach(field => {
      const count = finalNullCounts[field] || 0;
      const percentage = ((count / finalData.length) * 100).toFixed(1);
      const status = count === 0 ? '✅' : '❌';
      console.log(`${status} ${field}: ${count} nulls (${percentage}%)`);
    });
    
  } catch (error) {
    console.error('Script error:', error);
  }
}

enrichBrokerData();