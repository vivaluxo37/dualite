const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://efxpwrnxdorgzcqhbnfn.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAzMzIzNSwiZXhwIjoyMDcyNjA5MjM1fQ.BKmSaW8dSc6soQZOh7zZGXMNO-evJZkSbLVJzxoYSYA';

const supabase = createClient(supabaseUrl, supabaseKey);

// Enhanced platform mappings for major brokers
const platformEnhancements = {
  'XM': ['MetaTrader 4', 'MetaTrader 5', 'WebTrader', 'XM Mobile App'],
  'XM Group': ['MetaTrader 4', 'MetaTrader 5', 'WebTrader', 'XM Mobile App'],
  'IG': ['IG Trading Platform', 'MetaTrader 4', 'ProRealTime', 'L2 Dealer'],
  'Plus500': ['Plus500 WebTrader', 'Plus500 Mobile App'],
  'eToro': ['eToro Platform', 'eToro Mobile App', 'CopyTrader'],
  'OANDA': ['OANDA Trade', 'MetaTrader 4', 'TradingView', 'fxTrade'],
  'Pepperstone': ['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'TradingView'],
  'IC Markets': ['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'WebTrader'],
  'FXCM': ['Trading Station', 'MetaTrader 4', 'TradingView', 'FXCM Mobile'],
  'Forex.com': ['MetaTrader 4', 'MetaTrader 5', 'Web Platform', 'Advanced Trading'],
  'Interactive Brokers': ['Trader Workstation', 'IBKR Mobile', 'WebTrader', 'Client Portal'],
  'TD Ameritrade': ['thinkorswim', 'TD Ameritrade Mobile', 'Web Platform'],
  'Charles Schwab': ['StreetSmart Edge', 'Schwab Mobile', 'Schwab.com'],
  'E*TRADE': ['Power E*TRADE', 'E*TRADE Mobile', 'E*TRADE Web'],
  'Fidelity': ['Active Trader Pro', 'Fidelity Mobile', 'Fidelity.com'],
  'Saxo Bank': ['SaxoTraderGO', 'SaxoTraderPRO', 'SaxoInvestor'],
  'CMC Markets': ['Next Generation', 'MetaTrader 4', 'CMC Markets Mobile'],
  'City Index': ['AT Pro', 'MetaTrader 4', 'Web Platform'],
  'Admiral Markets': ['MetaTrader 4', 'MetaTrader 5', 'MetaTrader Supreme Edition'],
  'XTB': ['xStation 5', 'MetaTrader 4', 'XTB Mobile'],
  'AvaTrade': ['AvaTradeGO', 'MetaTrader 4', 'MetaTrader 5', 'WebTrader'],
  'FP Markets': ['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'IRESS'],
  'Exness': ['MetaTrader 4', 'MetaTrader 5', 'Exness Terminal', 'WebTerminal'],
  'HotForex': ['MetaTrader 4', 'MetaTrader 5', 'HotForex Mobile'],
  'FXTM': ['MetaTrader 4', 'MetaTrader 5', 'FXTM Trader'],
  'ThinkMarkets': ['MetaTrader 4', 'MetaTrader 5', 'ThinkTrader'],
  'FxPro': ['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'FxPro Edge'],
  'Swissquote': ['Advanced Trader', 'MetaTrader 4', 'MetaTrader 5'],
  'Dukascopy': ['JForex', 'MetaTrader 4', 'Dukascopy Mobile'],
  'GKFX': ['MetaTrader 4', 'MetaTrader 5', 'WebTrader'],
  'Tickmill': ['MetaTrader 4', 'MetaTrader 5', 'WebTrader'],
  'Vantage': ['MetaTrader 4', 'MetaTrader 5', 'WebTrader'],
  'Alpari': ['MetaTrader 4', 'MetaTrader 5', 'Alpari Mobile'],
  'InstaForex': ['MetaTrader 4', 'MetaTrader 5', 'WebTrader'],
  'RoboForex': ['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'R Trader'],
  'FBS': ['MetaTrader 4', 'MetaTrader 5', 'FBS Trader'],
  'OctaFX': ['MetaTrader 4', 'MetaTrader 5', 'cTrader'],
  'IronFX': ['MetaTrader 4', 'MetaTrader 5', 'WebTrader'],
  'LiteForex': ['MetaTrader 4', 'MetaTrader 5', 'WebTrader'],
  'NordFX': ['MetaTrader 4', 'MetaTrader 5', 'WebTrader'],
  'Weltrade': ['MetaTrader 4', 'MetaTrader 5', 'WebTrader'],
  'JustForex': ['MetaTrader 4', 'MetaTrader 5', 'WebTrader'],
  'FreshForex': ['MetaTrader 4', 'MetaTrader 5', 'WebTrader'],
  'AMarkets': ['MetaTrader 4', 'MetaTrader 5', 'WebTrader'],
  'Grand Capital': ['MetaTrader 4', 'MetaTrader 5', 'WebTrader'],
  'Forex4you': ['MetaTrader 4', 'MetaTrader 5', 'WebTrader'],
  'NPBFX': ['MetaTrader 4', 'MetaTrader 5', 'WebTrader'],
  'Traders Trust': ['MetaTrader 4', 'MetaTrader 5', 'WebTrader'],
  'Windsor Brokers': ['MetaTrader 4', 'MetaTrader 5', 'WebTrader'],
  'Coinexx': ['MetaTrader 4', 'MetaTrader 5', 'WebTrader'],
  'Webull': ['Webull Desktop', 'Webull Mobile', 'Webull Web'],
  'Robinhood': ['Robinhood Mobile', 'Robinhood Web'],
  'Coinbase': ['Coinbase Pro', 'Coinbase Mobile', 'Coinbase Web'],
  'Binance': ['Binance Spot', 'Binance Futures', 'Binance Mobile'],
  'Kraken': ['Kraken Pro', 'Kraken Mobile', 'Kraken Web']
};

// Enhanced leverage descriptions
const leverageEnhancements = {
  '1:1': 'Up to 1:1 leverage (No leverage)',
  '1:2': 'Up to 1:2 leverage (Conservative)',
  '1:5': 'Up to 1:5 leverage (Low risk)',
  '1:10': 'Up to 1:10 leverage (Moderate)',
  '1:20': 'Up to 1:20 leverage (Moderate-High)',
  '1:30': 'Up to 1:30 leverage (EU regulated maximum)',
  '1:50': 'Up to 1:50 leverage (Standard)',
  '1:100': 'Up to 1:100 leverage (High)',
  '1:200': 'Up to 1:200 leverage (Very High)',
  '1:400': 'Up to 1:400 leverage (Extremely High)',
  '1:500': 'Up to 1:500 leverage (Maximum)',
  '1:1000': 'Up to 1:1000 leverage (Ultra High)',
  '1:2000': 'Up to 1:2000 leverage (Extreme)',
  '1:3000': 'Up to 1:3000 leverage (Maximum Available)'
};

async function enrichTradingConditions() {
  try {
    console.log('🔍 Enriching broker trading conditions...');
    
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('id, name, platforms, leverage_max')
      .order('name');
    
    if (error) {
      console.error('❌ Error fetching brokers:', error);
      return;
    }
    
    console.log(`📊 Processing ${brokers.length} brokers...`);
    
    let platformsUpdated = 0;
    let leverageUpdated = 0;
    let totalProcessed = 0;
    const errors = [];
    
    for (const broker of brokers) {
      totalProcessed++;
      let needsUpdate = false;
      let updateData = {};
      
      // Check if platforms need enhancement
      const currentPlatforms = broker.platforms || [];
      if (currentPlatforms.length <= 2 && platformEnhancements[broker.name]) {
        updateData.platforms = platformEnhancements[broker.name];
        needsUpdate = true;
        platformsUpdated++;
      }
      
      // Check if leverage needs enhancement
      const currentLeverage = String(broker.leverage_max || '').trim();
      if (currentLeverage.length <= 5 && leverageEnhancements[currentLeverage]) {
        updateData.leverage_max = leverageEnhancements[currentLeverage];
        needsUpdate = true;
        leverageUpdated++;
      }
      
      if (needsUpdate) {
        try {
          const { error: updateError } = await supabase
            .from('brokers')
            .update(updateData)
            .eq('id', broker.id);
          
          if (updateError) {
            console.error(`❌ Error updating ${broker.name}:`, updateError.message);
            errors.push(`${broker.name}: ${updateError.message}`);
          } else {
            console.log(`✅ Updated ${broker.name}:`, 
              updateData.platforms ? `platforms (${updateData.platforms.length})` : '',
              updateData.leverage_max ? `leverage (${updateData.leverage_max})` : ''
            );
          }
        } catch (err) {
          console.error(`❌ Error updating ${broker.name}:`, err.message);
          errors.push(`${broker.name}: ${err.message}`);
        }
      }
      
      // Add small delay to avoid rate limiting
      if (totalProcessed % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log('\n📈 Trading Conditions Enrichment Summary:');
    console.log(`   📊 Total processed: ${totalProcessed}`);
    console.log(`   🖥️ Platforms enhanced: ${platformsUpdated}`);
    console.log(`   ⚡ Leverage enhanced: ${leverageUpdated}`);
    console.log(`   ❌ Errors: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      errors.slice(0, 10).forEach(error => {
        console.log(`   - ${error}`);
      });
      if (errors.length > 10) {
        console.log(`   ... and ${errors.length - 10} more errors`);
      }
    }
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

enrichTradingConditions();