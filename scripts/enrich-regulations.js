const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://efxpwrnxdorgzcqhbnfn.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAzMzIzNSwiZXhwIjoyMDcyNjA5MjM1fQ.BKmSaW8dSc6soQZOh7zZGXMNO-evJZkSbLVJzxoYSYA';

const supabase = createClient(supabaseUrl, supabaseKey);

// Enhanced regulation mappings
const regulationEnhancements = {
  'FCA': 'Financial Conduct Authority (UK)',
  'CySEC': 'Cyprus Securities and Exchange Commission',
  'ASIC': 'Australian Securities and Investments Commission',
  'FSA': 'Financial Services Authority',
  'CFTC': 'Commodity Futures Trading Commission (US)',
  'NFA': 'National Futures Association (US)',
  'FINRA': 'Financial Industry Regulatory Authority (US)',
  'SEC': 'Securities and Exchange Commission (US)',
  'ESMA': 'European Securities and Markets Authority',
  'BaFin': 'Federal Financial Supervisory Authority (Germany)',
  'AMF': 'Autorité des Marchés Financiers (France)',
  'CONSOB': 'Commissione Nazionale per le Società e la Borsa (Italy)',
  'CNMV': 'Comisión Nacional del Mercado de Valores (Spain)',
  'AFM': 'Netherlands Authority for the Financial Markets',
  'DFSA': 'Dubai Financial Services Authority',
  'FSC': 'Financial Services Commission',
  'JFSA': 'Japan Financial Services Agency',
  'MAS': 'Monetary Authority of Singapore',
  'HKMA': 'Hong Kong Monetary Authority',
  'SFC': 'Securities and Futures Commission (Hong Kong)',
  'tier2': 'Tier 2 Regulated (Lower regulatory oversight)',
  'unregulated': 'Unregulated (No regulatory oversight)'
};

// Known comprehensive regulations for major brokers
const comprehensiveRegulations = {
  'IG Markets': 'Financial Conduct Authority (UK), Australian Securities and Investments Commission, Cyprus Securities and Exchange Commission, Financial Services Authority',
  'Exness': 'Cyprus Securities and Exchange Commission, Financial Services Commission (Mauritius), Financial Services Authority (Seychelles)',
  'Pepperstone': 'Australian Securities and Investments Commission, Financial Conduct Authority (UK), Cyprus Securities and Exchange Commission, Dubai Financial Services Authority',
  'FXTM': 'Cyprus Securities and Exchange Commission, Financial Services Commission (Mauritius), Financial Services Authority (South Africa)',
  'XM Group': 'Cyprus Securities and Exchange Commission, Australian Securities and Investments Commission, Financial Services Commission (Mauritius)',
  'Plus500': 'Financial Conduct Authority (UK), Cyprus Securities and Exchange Commission, Australian Securities and Investments Commission, Monetary Authority of Singapore',
  'eToro': 'Cyprus Securities and Exchange Commission, Financial Conduct Authority (UK), Australian Securities and Investments Commission',
  'OANDA': 'Commodity Futures Trading Commission (US), National Futures Association (US), Financial Conduct Authority (UK), Australian Securities and Investments Commission',
  'Interactive Brokers': 'Securities and Exchange Commission (US), Financial Industry Regulatory Authority (US), Commodity Futures Trading Commission (US), Financial Conduct Authority (UK)',
  'Charles Schwab': 'Securities and Exchange Commission (US), Financial Industry Regulatory Authority (US), Commodity Futures Trading Commission (US)',
  'TD Ameritrade': 'Securities and Exchange Commission (US), Financial Industry Regulatory Authority (US), Commodity Futures Trading Commission (US)',
  'E*TRADE': 'Securities and Exchange Commission (US), Financial Industry Regulatory Authority (US)',
  'Fidelity': 'Securities and Exchange Commission (US), Financial Industry Regulatory Authority (US)',
  'Robinhood': 'Securities and Exchange Commission (US), Financial Industry Regulatory Authority (US)',
  'Saxo Bank': 'Danish Financial Supervisory Authority, Financial Conduct Authority (UK), Cyprus Securities and Exchange Commission',
  'Swissquote': 'Swiss Financial Market Supervisory Authority (FINMA), Financial Conduct Authority (UK)',
  'CMC Markets': 'Financial Conduct Authority (UK), Australian Securities and Investments Commission, Cyprus Securities and Exchange Commission',
  'City Index': 'Financial Conduct Authority (UK), Australian Securities and Investments Commission',
  'AvaTrade': 'Central Bank of Ireland, Australian Securities and Investments Commission, Financial Services Authority (South Africa)',
  'XTB': 'Polish Financial Supervision Authority, Cyprus Securities and Exchange Commission, Financial Conduct Authority (UK)',
  'ThinkMarkets': 'Financial Conduct Authority (UK), Australian Securities and Investments Commission, Cyprus Securities and Exchange Commission',
  'IC Markets': 'Australian Securities and Investments Commission, Cyprus Securities and Exchange Commission',
  'FP Markets': 'Australian Securities and Investments Commission, Cyprus Securities and Exchange Commission',
  'Tickmill': 'Financial Conduct Authority (UK), Cyprus Securities and Exchange Commission, Financial Services Commission (Mauritius)',
  'FXCM': 'Financial Conduct Authority (UK), Australian Securities and Investments Commission, Cyprus Securities and Exchange Commission',
  'Forex.com': 'Commodity Futures Trading Commission (US), National Futures Association (US), Financial Conduct Authority (UK)',
  'Dukascopy': 'Swiss Financial Market Supervisory Authority (FINMA), Financial Services Commission (Mauritius)',
  'FxPro': 'Cyprus Securities and Exchange Commission, Financial Conduct Authority (UK), Financial Services Commission (Mauritius)'
};

async function enrichRegulations() {
  try {
    console.log('🔍 Fetching brokers with short regulations...');
    
    // Get brokers with short regulations (less than 20 characters)
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('id, name, regulations')
      .order('name');
    
    if (error) {
      console.error('❌ Error fetching brokers:', error);
      return;
    }
    
    const shortRegulations = brokers.filter(broker => {
      const reg = String(broker.regulations || '').trim();
      return reg.length < 20;
    });
    
    console.log(`📊 Found ${shortRegulations.length} brokers with short regulations`);
    
    let updatedCount = 0;
    let enhancedCount = 0;
    
    for (const broker of shortRegulations) {
      const currentReg = String(broker.regulations || '').trim();
      let newRegulation = null;
      
      // Check if we have comprehensive regulation data
      if (comprehensiveRegulations[broker.name]) {
        const regArray = comprehensiveRegulations[broker.name].split(', ');
        newRegulation = regArray;
        console.log(`🔄 Comprehensive update for ${broker.name}`);
      } else {
        // Try to enhance existing abbreviations
        const parts = currentReg.split(',').map(part => part.trim());
        const enhancedParts = parts.map(part => {
          return regulationEnhancements[part] || part;
        });
        
        if (enhancedParts.some(part => part !== parts[parts.indexOf(part)])) {
          newRegulation = enhancedParts;
          console.log(`📝 Enhanced ${broker.name}: ${currentReg} → ${enhancedParts.join(', ').substring(0, 60)}...`);
          enhancedCount++;
        }
      }
      
      if (newRegulation && JSON.stringify(newRegulation) !== JSON.stringify(currentReg.split(',').map(s => s.trim()))) {
        const { error: updateError } = await supabase
          .from('brokers')
          .update({ regulations: newRegulation })
          .eq('id', broker.id);
        
        if (updateError) {
          console.error(`❌ Error updating ${broker.name}:`, updateError);
        } else {
          updatedCount++;
        }
      }
    }
    
    console.log('\n📈 Enhancement Summary:');
    console.log(`   ✅ Updated: ${updatedCount} brokers`);
    console.log(`   📝 Enhanced abbreviations: ${enhancedCount} brokers`);
    console.log(`   📊 Total processed: ${shortRegulations.length} brokers`);
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

enrichRegulations();