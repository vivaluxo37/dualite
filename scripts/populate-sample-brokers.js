import { supabase } from './supabase-config.js';

// Sample broker data for testing
const sampleBrokers = [
  {
    name: 'IG Group',
    slug: 'ig-group',
    country: 'United Kingdom',
    established_year: 1974,
    headquarters_location: 'London, UK',
    parent_company: 'IG Group Holdings PLC',
    business_model: 'Market Maker',
    website_url: 'https://www.ig.com',
    affiliate_url: 'https://www.ig.com/affiliates',
    company_description: 'IG Group is a leading online trading provider, offering access to over 17,000 financial markets.',
    regulations: ['FCA', 'ASIC', 'CFTC', 'FINMA', 'MAS', 'FSCA'],
    regulation_tier: 'tier1',
    trading_conditions: {
      min_deposit: 0,
      spreads_avg: 0.8,
      spread_type: 'variable',
      leverage_max: '1:30',
      commission_structure: {
        type: 'none',
        details: 'No commission on forex trades'
      },
      margin_requirements: {
        initial_margin: 3.33,
        maintenance_margin: 1.5,
        margin_call_level: 100,
        stop_out_level: 50
      },
      execution_type: 'Market Maker',
      execution_speed_ms: 40,
      slippage_rate: 0.1,
      order_types: ['Market', 'Limit', 'Stop', 'Trailing Stop', 'OCO'],
      minimum_lot_size: 0.01,
      maximum_lot_size: 1000,
      hedging_allowed: true,
      scalping_allowed: true,
      expert_advisors_allowed: false
    },
    trading_platforms: [
      {
        name: 'IG Trading Platform',
        type: 'web',
        available: true,
        features: ['Advanced charting', 'Real-time news', 'Economic calendar', 'Risk management tools'],
        minimum_deposit: 0,
        instruments_available: ['Forex', 'Indices', 'Commodities', 'Shares', 'Cryptocurrencies'],
        order_types: ['Market', 'Limit', 'Stop', 'Trailing Stop'],
        charting_tools: ['Technical indicators', 'Drawing tools', 'Multiple timeframes'],
        technical_indicators: ['Moving averages', 'RSI', 'MACD', 'Bollinger Bands'],
        automated_trading: false,
        vps_compatible: false
      }
    ],
    mobile_trading_apps: [
      {
        name: 'IG Trading',
        platform: 'ios',
        features: ['Full trading functionality', 'Real-time quotes', 'Charting', 'News']
      },
      {
        name: 'IG Trading',
        platform: 'android',
        features: ['Full trading functionality', 'Real-time quotes', 'Charting', 'News']
      }
    ],
    account_types: {
      standard_account: {
        minimum_deposit: 0,
        base_currencies: ['USD', 'EUR', 'GBP', 'AUD'],
        spread_type: 'variable',
        average_spread: 0.8,
        commission: 0,
        leverage_max: '1:30',
        hedging_allowed: true,
        scalping_allowed: true,
        expert_advisors_allowed: false
      },
      demo_account: {
        available: true,
        duration: 'unlimited',
        virtual_funds: 20000,
        features: ['Real-time pricing', 'Full platform access', 'Risk management tools']
      }
    },
    deposit_methods: [
      {
        method: 'Bank Transfer',
        type: 'both',
        currencies: ['USD', 'EUR', 'GBP', 'AUD'],
        minimum_amount: 0,
        maximum_amount: 1000000,
        processing_time: '1-3 days',
        fees: []
      },
      {
        method: 'Credit Card',
        type: 'both',
        currencies: ['USD', 'EUR', 'GBP'],
        minimum_amount: 0,
        maximum_amount: 50000,
        processing_time: 'Instant',
        fees: []
      }
    ],
    withdrawal_methods: [
      {
        method: 'Bank Transfer',
        type: 'withdrawal',
        currencies: ['USD', 'EUR', 'GBP', 'AUD'],
        minimum_amount: 0,
        maximum_amount: 1000000,
        processing_time: '1-3 days',
        fees: []
      }
    ],
    support_channels: [
      {
        channel: 'phone',
        available: true,
        hours: '24/5',
        languages: ['English', 'German', 'Spanish', 'French'],
        response_time: '1-2 minutes'
      },
      {
        channel: 'email',
        available: true,
        hours: '24/5',
        languages: ['English', 'German', 'Spanish', 'French'],
        response_time: '4-6 hours'
      },
      {
        channel: 'live_chat',
        available: true,
        hours: '24/5',
        languages: ['English'],
        response_time: '2-3 minutes'
      }
    ],
    support_languages: ['English', 'German', 'Spanish', 'French', 'Italian', 'Chinese'],
    support_availability: '24/5',
    support_quality_rating: 4.5,
    educational_materials: [
      {
        type: 'article',
        title: 'Forex Trading Guide',
        description: 'Comprehensive guide to forex trading',
        duration_minutes: 15,
        difficulty_level: 'beginner',
        language: 'English',
        is_free: true
      },
      {
        type: 'webinar',
        title: 'Technical Analysis Basics',
        description: 'Learn technical analysis fundamentals',
        duration_minutes: 60,
        difficulty_level: 'intermediate',
        language: 'English',
        is_free: true
      }
    ],
    market_analysis: {
      daily_analysis: true,
      economic_calendar: true,
      research_reports: true,
      trading_signals: true,
      technical_analysis: true,
      fundamental_analysis: true
    },
    trading_tools: {
      calculators: ['Pip Calculator', 'Margin Calculator', 'Profit Calculator'],
      signals: true,
      vps_hosting: false,
      economic_calendar: true,
      sentiment_indicators: true,
      correlation_matrix: true
    },
    webinar_count: 50,
    article_count: 1000,
    pros: [
      'Well-regulated broker',
      'Competitive spreads',
      'Excellent trading platform',
      'Strong reputation',
      'Wide range of instruments'
    ],
    cons: [
      'No MT4/MT5 support',
      'Limited leverage due to regulations',
      'No automated trading',
      'Higher minimum deposit for some account types'
    ],
    overall_score: 92,
    trading_conditions_score: 88,
    platforms_score: 85,
    customer_support_score: 95,
    education_score: 90,
    trust_and_safety_score: 98,
    value_for_money_score: 85,
    trust_score: 95,
    avg_rating: 4.3,
    total_reviews: 2500,
    data_confidence_score: 95,
    featured: true,
    is_active: true,
    data_sources: [
      {
        source_name: 'Manual Entry',
        source_url: 'https://www.ig.com',
        last_scraped: new Date().toISOString(),
        confidence_score: 95,
        data_points: ['regulation', 'trading_conditions', 'platforms', 'support']
      }
    ],
    last_data_update: new Date().toISOString(),
    is_verified: true,
    verification_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    name: 'OANDA',
    slug: 'oanda',
    country: 'United States',
    established_year: 1996,
    headquarters_location: 'New York, USA',
    parent_company: 'OANDA Corporation',
    business_model: 'Market Maker',
    website_url: 'https://www.oanda.com',
    affiliate_url: 'https://www.oanda.com/partners',
    company_description: 'OANDA is a leading forex and CFD broker, known for its innovative trading technology and transparent pricing.',
    regulations: ['CFTC', 'NFA', 'FCA', 'ASIC', 'MAS', 'IIROC'],
    regulation_tier: 'tier1',
    trading_conditions: {
      min_deposit: 0,
      spreads_avg: 1.2,
      spread_type: 'variable',
      leverage_max: '1:50',
      commission_structure: {
        type: 'none',
        details: 'No commission on standard accounts'
      },
      margin_requirements: {
        initial_margin: 2.0,
        maintenance_margin: 1.0,
        margin_call_level: 100,
        stop_out_level: 20
      },
      execution_type: 'Market Maker',
      execution_speed_ms: 35,
      slippage_rate: 0.15,
      order_types: ['Market', 'Limit', 'Stop', 'Trailing Stop', 'OCO', 'IFD'],
      minimum_lot_size: 1,
      maximum_lot_size: 1000000,
      hedging_allowed: true,
      scalping_allowed: true,
      expert_advisors_allowed: true
    },
    trading_platforms: [
      {
        name: 'OANDA Trade Platform',
        type: 'web',
        available: true,
        features: ['Advanced charting', 'Real-time news', 'Economic calendar', 'AutoChartist'],
        minimum_deposit: 0,
        instruments_available: ['Forex', 'CFDs', 'Commodities', 'Precious Metals', 'Bonds'],
        order_types: ['Market', 'Limit', 'Stop', 'Trailing Stop', 'OCO'],
        charting_tools: ['Technical indicators', 'Drawing tools', 'Multiple timeframes'],
        technical_indicators: ['Moving averages', 'RSI', 'MACD', 'Bollinger Bands', 'Stochastic'],
        automated_trading: true,
        vps_compatible: true
      },
      {
        name: 'MetaTrader 4',
        type: 'desktop',
        available: true,
        features: ['Expert Advisors', 'Custom indicators', 'Algorithmic trading'],
        minimum_deposit: 0,
        instruments_available: ['Forex', 'CFDs', 'Commodities'],
        order_types: ['Market', 'Limit', 'Stop', 'Trailing Stop'],
        charting_tools: ['Technical indicators', 'Drawing tools', 'Multiple timeframes'],
        technical_indicators: ['Moving averages', 'RSI', 'MACD', 'Bollinger Bands'],
        automated_trading: true,
        vps_compatible: true
      }
    ],
    mobile_trading_apps: [
      {
        name: 'OANDA Trade',
        platform: 'ios',
        features: ['Full trading functionality', 'Real-time quotes', 'Charting', 'News', 'Push notifications']
      },
      {
        name: 'OANDA Trade',
        platform: 'android',
        features: ['Full trading functionality', 'Real-time quotes', 'Charting', 'News', 'Push notifications']
      }
    ],
    account_types: {
      standard_account: {
        minimum_deposit: 0,
        base_currencies: ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'CHF', 'JPY'],
        spread_type: 'variable',
        average_spread: 1.2,
        commission: 0,
        leverage_max: '1:50',
        hedging_allowed: true,
        scalping_allowed: true,
        expert_advisors_allowed: true
      },
      demo_account: {
        available: true,
        duration: 'unlimited',
        virtual_funds: 100000,
        features: ['Real-time pricing', 'Full platform access', 'Risk management tools']
      }
    },
    deposit_methods: [
      {
        method: 'Bank Transfer',
        type: 'both',
        currencies: ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'CHF', 'JPY'],
        minimum_amount: 0,
        maximum_amount: 1000000,
        processing_time: '1-3 days',
        fees: []
      },
      {
        method: 'Credit Card',
        type: 'both',
        currencies: ['USD', 'EUR', 'GBP'],
        minimum_amount: 0,
        maximum_amount: 50000,
        processing_time: 'Instant',
        fees: []
      },
      {
        method: 'PayPal',
        type: 'both',
        currencies: ['USD', 'EUR', 'GBP'],
        minimum_amount: 0,
        maximum_amount: 10000,
        processing_time: 'Instant',
        fees: []
      }
    ],
    withdrawal_methods: [
      {
        method: 'Bank Transfer',
        type: 'withdrawal',
        currencies: ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'CHF', 'JPY'],
        minimum_amount: 0,
        maximum_amount: 1000000,
        processing_time: '1-3 days',
        fees: []
      }
    ],
    support_channels: [
      {
        channel: 'phone',
        available: true,
        hours: '24/5',
        languages: ['English', 'Spanish', 'French', 'German', 'Chinese'],
        response_time: '1-3 minutes'
      },
      {
        channel: 'email',
        available: true,
        hours: '24/5',
        languages: ['English', 'Spanish', 'French', 'German', 'Chinese'],
        response_time: '2-4 hours'
      },
      {
        channel: 'live_chat',
        available: true,
        hours: '24/5',
        languages: ['English'],
        response_time: '1-2 minutes'
      }
    ],
    support_languages: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic'],
    support_availability: '24/5',
    support_quality_rating: 4.4,
    educational_materials: [
      {
        type: 'article',
        title: 'Forex Market Overview',
        description: 'Understanding the forex market structure',
        duration_minutes: 20,
        difficulty_level: 'beginner',
        language: 'English',
        is_free: true
      },
      {
        type: 'video',
        title: 'Trading Platform Tutorial',
        description: 'Learn how to use OANDA trading platform',
        duration_minutes: 45,
        difficulty_level: 'beginner',
        language: 'English',
        is_free: true
      }
    ],
    market_analysis: {
      daily_analysis: true,
      economic_calendar: true,
      research_reports: true,
      trading_signals: true,
      technical_analysis: true,
      fundamental_analysis: true
    },
    trading_tools: {
      calculators: ['Pip Calculator', 'Margin Calculator', 'Profit Calculator', 'Currency Converter'],
      signals: true,
      vps_hosting: true,
      economic_calendar: true,
      sentiment_indicators: true,
      correlation_matrix: true
    },
    webinar_count: 75,
    article_count: 1500,
    pros: [
      'Excellent regulatory coverage',
      'Competitive spreads',
      'Multiple trading platforms',
      'Good for algorithmic trading',
      'Strong technical analysis tools'
    ],
    cons: [
      'Limited product range compared to competitors',
      'Higher spreads on some instruments',
      'No cryptocurrency trading in US',
      'Limited account types'
    ],
    overall_score: 90,
    trading_conditions_score: 85,
    platforms_score: 90,
    customer_support_score: 92,
    education_score: 88,
    trust_and_safety_score: 96,
    value_for_money_score: 82,
    trust_score: 94,
    avg_rating: 4.2,
    total_reviews: 3200,
    data_confidence_score: 92,
    featured: true,
    is_active: true,
    data_sources: [
      {
        source_name: 'Manual Entry',
        source_url: 'https://www.oanda.com',
        last_scraped: new Date().toISOString(),
        confidence_score: 92,
        data_points: ['regulation', 'trading_conditions', 'platforms', 'support']
      }
    ],
    last_data_update: new Date().toISOString(),
    is_verified: true,
    verification_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

async function populateSampleBrokers() {
  console.log('🚀 Populating sample broker data...');
  
  try {
    let successCount = 0;
    
    for (const broker of sampleBrokers) {
      console.log(`Processing: ${broker.name}`);
      
      // Check if broker already exists
      const { data: existingBroker } = await supabase
        .from('brokers')
        .select('id')
        .eq('slug', broker.slug)
        .single();

      if (existingBroker) {
        console.log(`⚠️  Broker ${broker.name} already exists, updating...`);
        
        const { error } = await supabase
          .from('brokers')
          .update({
            ...broker,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingBroker.id);

        if (error) {
          console.error(`❌ Error updating ${broker.name}:`, error);
        } else {
          console.log(`✅ Updated ${broker.name}`);
          successCount++;
        }
      } else {
        console.log(`📝 Inserting new broker: ${broker.name}`);
        
        const { error } = await supabase
          .from('brokers')
          .insert([broker]);

        if (error) {
          console.error(`❌ Error inserting ${broker.name}:`, error);
        } else {
          console.log(`✅ Inserted ${broker.name}`);
          successCount++;
        }
      }
    }
    
    console.log(`\n🎉 Sample data population completed!`);
    console.log(`Successfully processed: ${successCount}/${sampleBrokers.length} brokers`);
    
  } catch (error) {
    console.error('❌ Error populating sample data:', error);
    process.exit(1);
  }
}

// Run the function
populateSampleBrokers();