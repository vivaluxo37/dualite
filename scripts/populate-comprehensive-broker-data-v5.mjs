import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const comprehensiveBrokerData = {
  'admirals': {
    established_year: 2001,
    headquarters_location: 'Estonia',
    regulations: ['FCA', 'ASIC', 'CySEC', 'FSCA', 'JSC'],
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'Admiral Markets App', 'WebTrader'],
    min_deposit: 100,
    leverage_max: '1:500',
    spreads_avg: 0.1,
    commission_structure: {
      standard: 0,
      raw: 3.5
    },
    account_types: {
      standard: true,
      ecn: true,
      islamic: true,
      professional: true
    },
    trading_instruments: ['Forex', 'CFDs', 'stocks', 'ETFs', 'futures', 'bonds', 'cryptocurrencies'],
    demo_account_details: { available: true },
    islamic_account: { available: true },
    educational_materials: {
      webinars: true,
      courses: true,
      market_analysis: true,
      trading_guides: true
    },
    support_channels: {
      live_chat: true,
      phone: true,
      email: true,
      available_24_5: true
    },
    deposit_methods: ['Bank transfers', 'credit/debit cards', 'Skrill', 'Neteller', 'PayPal'],
    trust_score: 93,
    pros: ['Regulated by multiple authorities', 'competitive spreads', 'diverse platforms', 'strong education'],
    cons: ['Limited cryptocurrency offerings', 'some account types require higher minimum deposit']
  },
  'avatrade': {
    founded: 2006,
    headquarters: 'Ireland',
    regulation: 'Central Bank of Ireland, ASIC, CySEC, FSCA, JFSA, FCA',
    platforms: 'MetaTrader 4, MetaTrader 5, AvaTradeGO, AvaOptions, WebTrader',
    minimum_deposit: 100,
    maximum_leverage: '1:400',
    spreads: 'Variable, EUR/USD: 0.9 pips',
    commissions: 'Zero commission on forex and CFDs',
    account_types: 'Standard, AvaSelect, Islamic, Professional',
    trading_instruments: 'Forex, CFDs, stocks, ETFs, options, bonds, cryptocurrencies',
    demo_account: true,
    islamic_account: true,
    educational_resources: 'SharpTrader academy, webinars, video tutorials, market analysis',
    customer_support: '24/5 multilingual support, live chat, phone, email',
    payment_methods: 'Bank transfers, credit/debit cards, Skrill, Neteller, PayPal, WebMoney',
    trust_score: 94,
    pros: 'Strong regulatory framework, excellent educational content, diverse trading platforms',
    cons: 'Inactivity fees, limited leverage compared to some competitors'
  },
  'cmc-markets': {
    founded: 1989,
    headquarters: 'London, UK',
    regulation: 'FCA, ASIC, MAS, IIROC, FMA',
    platforms: 'Next Generation Platform, MetaTrader 4, Mobile App',
    minimum_deposit: 0,
    maximum_leverage: '1:30 (retail), 1:500 (professional)',
    spreads: 'Variable, EUR/USD: 0.7 pips',
    commissions: 'Zero commission on most instruments',
    account_types: 'Standard, Professional, Corporate',
    trading_instruments: 'Forex, CFDs, stocks, indices, commodities, treasuries, cryptocurrencies',
    demo_account: true,
    islamic_account: false,
    educational_resources: 'Webinars, courses, market analysis, trading guides',
    customer_support: '24/5 support, live chat, phone, email',
    payment_methods: 'Bank transfers, credit/debit cards, PayPal',
    trust_score: 95,
    pros: 'Long-established broker, excellent platform, competitive spreads, strong regulation',
    cons: 'No Islamic accounts, limited cryptocurrency offerings'
  },
  'exness': {
    founded: 2008,
    headquarters: 'Cyprus',
    regulation: 'CySEC, FCA, FSA, FSCA, CBCS',
    platforms: 'MetaTrader 4, MetaTrader 5, Exness Terminal, Web Platform',
    minimum_deposit: 10,
    maximum_leverage: '1:2000',
    spreads: 'Variable, EUR/USD: 0.0 pips (standard account)',
    commissions: 'Zero commission on standard accounts, $3.5 per lot (ECN accounts)',
    account_types: 'Standard, Standard Cent, Pro, Raw Spread, Zero',
    trading_instruments: 'Forex, CFDs, cryptocurrencies, metals, energies, stocks, indices',
    demo_account: true,
    islamic_account: true,
    educational_resources: 'Webinars, tutorials, market analysis, economic calendar',
    customer_support: '24/7 multilingual support, live chat, phone, email',
    payment_methods: 'Bank transfers, credit/debit cards, Skrill, Neteller, WebMoney, Perfect Money',
    trust_score: 81,
    pros: 'Very low minimum deposit, high leverage, competitive spreads, fast withdrawals',
    cons: 'Regulatory concerns in some jurisdictions, limited educational resources'
  },
  'forex-com': {
    founded: 2001,
    headquarters: 'New Jersey, USA',
    regulation: 'NFA, CFTC, FCA, ASIC, IIROC',
    platforms: 'MetaTrader 4, MetaTrader 5, ForexTrader Pro, Mobile App',
    minimum_deposit: 50,
    maximum_leverage: '1:50 (US), 1:500 (international)',
    spreads: 'Variable, EUR/USD: 1.4 pips',
    commissions: 'Zero commission on forex, $1 per lot (futures)',
    account_types: 'Standard, Commission, Premium, STP Professional',
    trading_instruments: 'Forex, futures, stocks, indices, commodities, cryptocurrencies',
    demo_account: true,
    islamic_account: false,
    educational_resources: 'Webinars, courses, market analysis, trading signals',
    customer_support: '24/7 support, live chat, phone, email',
    payment_methods: 'Bank transfers, credit/debit cards, PayPal, ACH, wire transfer',
    trust_score: 87,
    pros: 'Strong US regulation, diverse platforms, good educational content',
    cons: 'Higher spreads on some pairs, no Islamic accounts'
  },
  'fp-markets': {
    founded: 2005,
    headquarters: 'Australia',
    regulation: 'ASIC, CySEC, FSA',
    platforms: 'MetaTrader 4, MetaTrader 5, IRESS Trader, WebTrader',
    minimum_deposit: 100,
    maximum_leverage: '1:500',
    spreads: 'EUR/USD: 0.0 pips (Raw account)',
    commissions: '$3 per lot per side (Raw account)',
    account_types: 'Standard, Raw, Islamic, Professional',
    trading_instruments: 'Forex, CFDs, stocks, indices, commodities, cryptocurrencies',
    demo_account: true,
    islamic_account: true,
    educational_resources: 'Webinars, tutorials, market analysis, trading guides',
    customer_support: '24/7 multilingual support, live chat, phone, email',
    payment_methods: 'Bank transfers, credit/debit cards, Skrill, Neteller, PayPal',
    trust_score: 90,
    pros: 'Raw spreads, multiple platforms, strong regulation, good customer support',
    cons: 'Limited product range compared to larger brokers'
  },
  'fxtm': {
    founded: 2011,
    headquarters: 'Cyprus',
    regulation: 'FCA, CySEC, FSCA, FSCA Mauritius',
    platforms: 'MetaTrader 4, MetaTrader 5, FXTM Trader',
    minimum_deposit: 10,
    maximum_leverage: '1:2000',
    spreads: 'EUR/USD: 1.5 pips (standard account)',
    commissions: 'Zero commission on standard accounts, variable on ECN accounts',
    account_types: 'Cent, Standard, Shares, ECN Zero, ECN, Pro',
    trading_instruments: 'Forex, CFDs, stocks, indices, commodities, cryptocurrencies',
    demo_account: true,
    islamic_account: true,
    educational_resources: 'Extensive webinars, courses, market analysis, trading signals',
    customer_support: '24/5 multilingual support, live chat, phone, email',
    payment_methods: 'Bank transfers, credit/debit cards, Skrill, Neteller, WebMoney',
    trust_score: 88,
    pros: 'Low minimum deposit, high leverage, strong educational content',
    cons: 'Spreads wider than ECN brokers, limited research tools'
  },
  'hotforex': {
    founded: 2010,
    headquarters: 'Cyprus',
    regulation: 'CySEC, FCA, FSCA, DFSA, FSA',
    platforms: 'MetaTrader 4, MetaTrader 5, HotForex App, WebTrader',
    minimum_deposit: 5,
    maximum_leverage: '1:1000',
    spreads: 'EUR/USD: 1.0 pips (Micro account)',
    commissions: 'Zero commission on standard accounts, $3 per lot (Zero account)',
    account_types: 'Micro, Premium, Zero, Auto, PAMM, Copy Trading',
    trading_instruments: 'Forex, CFDs, stocks, indices, commodities, cryptocurrencies',
    demo_account: true,
    islamic_account: true,
    educational_resources: 'Webinars, courses, market analysis, trading signals',
    customer_support: '24/5 multilingual support, live chat, phone, email',
    payment_methods: 'Bank transfers, credit/debit cards, Skrill, Neteller, WebMoney',
    trust_score: 85,
    pros: 'Low minimum deposit, multiple account types, good educational content',
    cons: 'Wide spreads on standard accounts, limited research tools'
  },
  'ic-markets': {
    founded: 2007,
    headquarters: 'Australia',
    regulation: 'ASIC, CySEC, FSA',
    platforms: 'MetaTrader 4, MetaTrader 5, cTrader, WebTrader',
    minimum_deposit: 200,
    maximum_leverage: '1:500',
    spreads: 'EUR/USD: 0.0 pips (Raw Spread account)',
    commissions: '$3.5 per lot per side (Raw Spread account)',
    account_types: 'Standard, Raw Spread, cTrader, Islamic, Professional',
    trading_instruments: 'Forex, CFDs, stocks, indices, commodities, cryptocurrencies',
    demo_account: true,
    islamic_account: true,
    educational_resources: 'Webinars, tutorials, market analysis, trading guides',
    customer_support: '24/7 multilingual support, live chat, phone, email',
    payment_methods: 'Bank transfers, credit/debit cards, Skrill, Neteller, PayPal',
    trust_score: 92,
    pros: 'Raw spreads, multiple platforms, strong regulation, fast execution',
    cons: 'Higher minimum deposit for some account types, limited product range'
  },
  'ig-group': {
    founded: 1974,
    headquarters: 'London, UK',
    regulation: 'FCA, ASIC, MAS, FSCA, FINMA',
    platforms: 'IG Trading Platform, MetaTrader 4, ProRealTime, L2 Dealer',
    minimum_deposit: 0,
    maximum_leverage: '1:30 (retail), 1:200 (professional)',
    spreads: 'EUR/USD: 0.6 pips',
    commissions: 'Zero commission on most instruments',
    account_types: 'Standard, Professional, Corporate, Islamic',
    trading_instruments: 'Forex, CFDs, stocks, indices, commodities, bonds, options, cryptocurrencies',
    demo_account: true,
    islamic_account: true,
    educational_resources: 'Extensive webinars, courses, market analysis, trading signals',
    customer_support: '24/5 support, live chat, phone, email',
    payment_methods: 'Bank transfers, credit/debit cards, PayPal',
    trust_score: 96,
    pros: 'Long-established, excellent platform, strong regulation, diverse instruments',
    cons: 'Limited leverage for retail traders, no cryptocurrency CFDs in UK'
  },
  'ig-markets': {
    founded: 1974,
    headquarters: 'London, UK',
    regulation: 'FCA, ASIC, MAS, FSCA, FINMA',
    platforms: 'IG Trading Platform, MetaTrader 4, ProRealTime, L2 Dealer',
    minimum_deposit: 0,
    maximum_leverage: '1:30 (retail), 1:200 (professional)',
    spreads: 'EUR/USD: 0.6 pips',
    commissions: 'Zero commission on most instruments',
    account_types: 'Standard, Professional, Corporate, Islamic',
    trading_instruments: 'Forex, CFDs, stocks, indices, commodities, bonds, options, cryptocurrencies',
    demo_account: true,
    islamic_account: true,
    educational_resources: 'Extensive webinars, courses, market analysis, trading signals',
    customer_support: '24/5 support, live chat, phone, email',
    payment_methods: 'Bank transfers, credit/debit cards, PayPal',
    trust_score: 96,
    pros: 'Long-established, excellent platform, strong regulation, diverse instruments',
    cons: 'Limited leverage for retail traders, no cryptocurrency CFDs in UK'
  },
  'oanda': {
    founded: 1996,
    headquarters: 'New York, USA',
    regulation: 'NFA, CFTC, FCA, ASIC, IIROC, MAS',
    platforms: 'MetaTrader 4, fxTrade, TradingView, Mobile App',
    minimum_deposit: 0,
    maximum_leverage: '1:50 (US), 1:100 (international)',
    spreads: 'Variable, EUR/USD: 1.2 pips',
    commissions: 'Zero commission on forex, $1 per lot (CFDs)',
    account_types: 'Standard, Premium, Islamic, Professional',
    trading_instruments: 'Forex, CFDs, stocks, indices, commodities, bonds, cryptocurrencies',
    demo_account: true,
    islamic_account: true,
    educational_resources: 'Webinars, courses, market analysis, trading signals',
    customer_support: '24/5 support, live chat, phone, email',
    payment_methods: 'Bank transfers, credit/debit cards, PayPal, ACH, wire transfer',
    trust_score: 93,
    pros: 'Strong US regulation, no minimum deposit, reliable platform',
    cons: 'Limited leverage, higher spreads on some instruments'
  },
  'pepperstone': {
    founded: 2010,
    headquarters: 'Australia',
    regulation: 'ASIC, FCA, CySEC, DFSA, SCB, BaFin, CMA',
    platforms: 'MetaTrader 4, MetaTrader 5, cTrader, TradingView, Pepperstone Mobile App',
    minimum_deposit: 0,
    maximum_leverage: '1:500',
    spreads: 'EUR/USD: 0.0 pips (Razor account)',
    commissions: '$3.5 per lot per side (Razor account)',
    account_types: 'Standard, Razor, Swap-Free, Islamic, Professional',
    trading_instruments: 'Forex, CFDs, stocks, indices, commodities, cryptocurrencies',
    demo_account: true,
    islamic_account: true,
    educational_resources: 'Market analysis, economic calendar, trading guides, webinars',
    customer_support: '24/5 multilingual support, live chat, phone, email',
    payment_methods: 'Bank transfers, credit/debit cards, Skrill, Neteller, PayPal, UnionPay',
    trust_score: 94,
    pros: 'Raw spreads, multiple platforms, strong regulation, no deposit/withdrawal fees',
    cons: 'Limited product range compared to larger brokers, no binary options'
  },
  'plus500': {
    founded: 2008,
    headquarters: 'Israel',
    regulation: 'FCA, ASIC, CySEC, FMA, FSCA, MAS',
    platforms: 'Plus500 WebTrader, Mobile App, Windows App',
    minimum_deposit: 100,
    maximum_leverage: '1:300',
    spreads: 'Variable, EUR/USD: 0.8 pips',
    commissions: 'Zero commission on all instruments',
    account_types: 'Standard, Professional, Islamic',
    trading_instruments: 'Forex, CFDs, stocks, indices, commodities, cryptocurrencies, options, ETFs',
    demo_account: true,
    islamic_account: true,
    educational_resources: 'Basic tutorials, market analysis, economic calendar',
    customer_support: '24/7 support, email, live chat',
    payment_methods: 'Bank transfers, credit/debit cards, PayPal, Skrill',
    trust_score: 86,
    pros: 'Simple platform, no commissions, wide range of instruments',
    cons: 'Limited advanced features, basic educational content'
  },
  'saxo-bank': {
    founded: 1992,
    headquarters: 'Denmark',
    regulation: 'FCA, ASIC, FINMA, DFSA, JFSA, FSA',
    platforms: 'SaxoTraderGO, SaxoTraderPRO, Saxo Bank Mobile App',
    minimum_deposit: 500,
    maximum_leverage: '1:30 (retail), 1:200 (professional)',
    spreads: 'Variable, EUR/USD: 0.4 pips',
    commissions: 'Variable commission structure',
    account_types: 'Classic, Platinum, VIP, Professional, Islamic',
    trading_instruments: 'Forex, CFDs, stocks, bonds, ETFs, options, futures, mutual funds',
    demo_account: true,
    islamic_account: true,
    educational_resources: 'Extensive research, market analysis, trading strategies, webinars',
    customer_support: '24/5 multilingual support, phone, email',
    payment_methods: 'Bank transfers, credit/debit cards',
    trust_score: 95,
    pros: 'Extensive product range, strong regulation, excellent research',
    cons: 'High minimum deposit, complex platform, high commissions'
  },
  'tickmill': {
    founded: 2014,
    headquarters: 'UK',
    regulation: 'FCA, FSA, CySEC, FSCA',
    platforms: 'MetaTrader 4, MetaTrader 5, WebTrader, Mobile App',
    minimum_deposit: 100,
    maximum_leverage: '1:500',
    spreads: 'EUR/USD: 0.0 pips (Pro account)',
    commissions: '$2 per lot per side (Pro account)',
    account_types: 'Classic, Pro, VIP, Islamic',
    trading_instruments: 'Forex, CFDs, stocks, indices, commodities, bonds',
    demo_account: true,
    islamic_account: true,
    educational_resources: 'Webinars, tutorials, market analysis, trading guides',
    customer_support: '24/5 multilingual support, live chat, phone, email',
    payment_methods: 'Bank transfers, credit/debit cards, Skrill, Neteller, WebMoney',
    trust_score: 89,
    pros: 'Raw spreads, fast execution, strong regulation, good customer support',
    cons: 'Limited product range, limited educational content'
  },
  'xm': {
    founded: 2009,
    headquarters: 'Cyprus',
    regulation: 'CySEC, FCA, ASIC, FSCA',
    platforms: 'MetaTrader 4, MetaTrader 5, XM App, WebTrader',
    minimum_deposit: 5,
    maximum_leverage: '1:888',
    spreads: 'EUR/USD: 1.0 pips (Micro account)',
    commissions: 'Zero commission on standard accounts',
    account_types: 'Micro, Standard, Ultra Low, Shares, Islamic',
    trading_instruments: 'Forex, CFDs, stocks, indices, commodities, cryptocurrencies',
    demo_account: true,
    islamic_account: true,
    educational_resources: 'Webinars, seminars, trading courses, market analysis',
    customer_support: '24/5 multilingual support, live chat, phone, email',
    payment_methods: 'Bank transfers, credit/debit cards, Skrill, Neteller, WebMoney',
    trust_score: 90,
    pros: 'Low minimum deposit, no commissions, strong regulation, good bonuses',
    cons: 'Wider spreads than ECN brokers, limited research tools'
  },
  'xm-group': {
    founded: 2009,
    headquarters: 'Cyprus',
    regulation: 'CySEC, FCA, ASIC, FSCA',
    platforms: 'MetaTrader 4, MetaTrader 5, XM App, WebTrader',
    minimum_deposit: 5,
    maximum_leverage: '1:888',
    spreads: 'EUR/USD: 1.0 pips (Micro account)',
    commissions: 'Zero commission on standard accounts',
    account_types: 'Micro, Standard, Ultra Low, Shares, Islamic',
    trading_instruments: 'Forex, CFDs, stocks, indices, commodities, cryptocurrencies',
    demo_account: true,
    islamic_account: true,
    educational_resources: 'Webinars, seminars, trading courses, market analysis',
    customer_support: '24/5 multilingual support, live chat, phone, email',
    payment_methods: 'Bank transfers, credit/debit cards, Skrill, Neteller, WebMoney',
    trust_score: 90,
    pros: 'Low minimum deposit, no commissions, strong regulation, good bonuses',
    cons: 'Wider spreads than ECN brokers, limited research tools'
  }
}

async function updateBrokerData() {
  console.log('🔄 Updating broker database with comprehensive information...')
  console.log('==========================================================')
  
  try {
    // Get current broker count before update
    const { data: currentBrokers, error: checkError } = await supabase
      .from('brokers')
      .select('id, name, slug')
    
    if (checkError) {
      console.error('❌ Error checking current brokers:', checkError)
      return
    }
    
    console.log(`📊 Found ${currentBrokers.length} brokers in database`)
    
    let updateCount = 0
    let notFoundCount = 0
    
    // Update each broker with comprehensive data
    for (const [slug, data] of Object.entries(comprehensiveBrokerData)) {
      console.log(`\n🔧 Updating: ${slug}`)
      
      // Check if broker exists
      const { data: existingBroker, error: findError } = await supabase
        .from('brokers')
        .select('id, name')
        .eq('slug', slug)
        .single()
      
      if (findError || !existingBroker) {
        console.log(`❌ Broker ${slug} not found in database`)
        notFoundCount++
        continue
      }
      
      // Prepare update data
      const updateData = {
        ...data,
        pros: data.pros || null,
        cons: data.cons || null,
        trust_score: data.trust_score || null,
        updated_at: new Date().toISOString()
      }
      
      // Update broker
      const { error: updateError } = await supabase
        .from('brokers')
        .update(updateData)
        .eq('id', existingBroker.id)
      
      if (updateError) {
        console.error(`❌ Error updating ${slug}:`, updateError)
      } else {
        console.log(`✅ Successfully updated ${existingBroker.name} (${slug})`)
        updateCount++
      }
    }
    
    console.log('\n📊 Update Summary:')
    console.log(`✅ Successfully updated: ${updateCount} brokers`)
    console.log(`❌ Not found in database: ${notFoundCount} brokers`)
    console.log(`📊 Total brokers processed: ${Object.keys(comprehensiveBrokerData).length}`)
    
    // Verify updates
    console.log('\n🔍 Verifying updates...')
    const { data: sampleBrokers, error: verifyError } = await supabase
      .from('brokers')
      .select('name, slug, founded, regulation, minimum_deposit, trust_score')
      .in('slug', Object.keys(comprehensiveBrokerData).slice(0, 5))
    
    if (verifyError) {
      console.error('❌ Error verifying updates:', verifyError)
    } else {
      console.log('📋 Sample updated brokers:')
      sampleBrokers.forEach(broker => {
        console.log(`  - ${broker.name} (${broker.slug}): Founded ${broker.founded}, Trust Score: ${broker.trust_score}`)
      })
    }
    
    console.log('\n🎉 Database update completed!')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

updateBrokerData()