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
    commission_structure: { standard: 0, raw: 3.5 },
    trading_instruments: ['Forex', 'CFDs', 'stocks', 'ETFs', 'futures', 'bonds', 'cryptocurrencies'],
    demo_account_details: { available: true },
    islamic_account: { available: true },
    educational_materials: { webinars: true, courses: true, market_analysis: true },
    support_channels: { live_chat: true, phone: true, email: true, available_24_5: true },
    deposit_methods: ['Bank transfers', 'credit/debit cards', 'Skrill', 'Neteller', 'PayPal'],
    trust_score: 93,
    pros: ['Regulated by multiple authorities', 'competitive spreads', 'diverse platforms', 'strong education'],
    cons: ['Limited cryptocurrency offerings', 'some account types require higher minimum deposit']
  },
  'avatrade': {
    established_year: 2006,
    headquarters_location: 'Ireland',
    regulations: ['Central Bank of Ireland', 'ASIC', 'CySEC', 'FSCA', 'JFSA', 'FCA'],
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'AvaTradeGO', 'AvaOptions', 'WebTrader'],
    min_deposit: 100,
    leverage_max: '1:400',
    spreads_avg: 0.9,
    commission_structure: { standard: 0, options: 0 },
    trading_instruments: ['Forex', 'CFDs', 'stocks', 'ETFs', 'options', 'bonds', 'cryptocurrencies'],
    demo_account_details: { available: true },
    islamic_account: { available: true },
    educational_materials: { webinars: true, courses: true, market_analysis: true, trading_signals: true },
    support_channels: { live_chat: true, phone: true, email: true, available_24_5: true },
    deposit_methods: ['Bank transfers', 'credit/debit cards', 'Skrill', 'Neteller', 'PayPal', 'WebMoney'],
    trust_score: 94,
    pros: ['Strong regulatory framework', 'excellent educational content', 'diverse trading platforms'],
    cons: ['Inactivity fees', 'limited leverage compared to some competitors']
  },
  'cmc-markets': {
    established_year: 1989,
    headquarters_location: 'London, UK',
    regulations: ['FCA', 'ASIC', 'MAS', 'IIROC', 'FMA'],
    platforms: ['Next Generation Platform', 'MetaTrader 4', 'Mobile App'],
    min_deposit: 0,
    leverage_max: '1:30 (retail), 1:500 (professional)',
    spreads_avg: 0.7,
    commission_structure: { standard: 0, professional: 0 },
    trading_instruments: ['Forex', 'CFDs', 'stocks', 'indices', 'commodities', 'treasuries', 'cryptocurrencies'],
    demo_account_details: { available: true },
    islamic_account: { available: false },
    educational_materials: { webinars: true, courses: true, market_analysis: true, trading_guides: true },
    support_channels: { live_chat: true, phone: true, email: true, available_24_5: true },
    deposit_methods: ['Bank transfers', 'credit/debit cards', 'PayPal'],
    trust_score: 95,
    pros: ['Long-established broker', 'excellent platform', 'competitive spreads', 'strong regulation'],
    cons: ['No Islamic accounts', 'limited cryptocurrency offerings']
  },
  'exness': {
    established_year: 2008,
    headquarters_location: 'Cyprus',
    regulations: ['CySEC', 'FCA', 'FSA', 'FSCA', 'CBCS'],
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'Exness Terminal', 'Web Platform'],
    min_deposit: 10,
    leverage_max: '1:2000',
    spreads_avg: 0.0,
    commission_structure: { standard: 0, ecn: 3.5 },
    trading_instruments: ['Forex', 'CFDs', 'cryptocurrencies', 'metals', 'energies', 'stocks', 'indices'],
    demo_account_details: { available: true },
    islamic_account: { available: true },
    educational_materials: { webinars: true, tutorials: true, market_analysis: true, economic_calendar: true },
    support_channels: { live_chat: true, phone: true, email: true, available_24_7: true },
    deposit_methods: ['Bank transfers', 'credit/debit cards', 'Skrill', 'Neteller', 'WebMoney', 'Perfect Money'],
    trust_score: 81,
    pros: ['Very low minimum deposit', 'high leverage', 'competitive spreads', 'fast withdrawals'],
    cons: ['Regulatory concerns in some jurisdictions', 'limited educational resources']
  },
  'forex-com': {
    established_year: 2001,
    headquarters_location: 'New Jersey, USA',
    regulations: ['NFA', 'CFTC', 'FCA', 'ASIC', 'IIROC'],
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'ForexTrader Pro', 'Mobile App'],
    min_deposit: 50,
    leverage_max: '1:50 (US), 1:500 (international)',
    spreads_avg: 1.4,
    commission_structure: { forex: 0, futures: 1 },
    trading_instruments: ['Forex', 'futures', 'stocks', 'indices', 'commodities', 'cryptocurrencies'],
    demo_account_details: { available: true },
    islamic_account: { available: false },
    educational_materials: { webinars: true, courses: true, market_analysis: true, trading_signals: true },
    support_channels: { live_chat: true, phone: true, email: true, available_24_7: true },
    deposit_methods: ['Bank transfers', 'credit/debit cards', 'PayPal', 'ACH', 'wire transfer'],
    trust_score: 87,
    pros: ['Strong US regulation', 'diverse platforms', 'good educational content'],
    cons: ['Higher spreads on some pairs', 'no Islamic accounts']
  },
  'fp-markets': {
    established_year: 2005,
    headquarters_location: 'Australia',
    regulations: ['ASIC', 'CySEC', 'FSA'],
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'IRESS Trader', 'WebTrader'],
    min_deposit: 100,
    leverage_max: '1:500',
    spreads_avg: 0.0,
    commission_structure: { standard: 0, raw: 3 },
    trading_instruments: ['Forex', 'CFDs', 'stocks', 'indices', 'commodities', 'cryptocurrencies'],
    demo_account_details: { available: true },
    islamic_account: { available: true },
    educational_materials: { webinars: true, tutorials: true, market_analysis: true, trading_guides: true },
    support_channels: { live_chat: true, phone: true, email: true, available_24_7: true },
    deposit_methods: ['Bank transfers', 'credit/debit cards', 'Skrill', 'Neteller', 'PayPal'],
    trust_score: 90,
    pros: ['Raw spreads', 'multiple platforms', 'strong regulation', 'good customer support'],
    cons: ['Limited product range compared to larger brokers']
  },
  'fxtm': {
    established_year: 2011,
    headquarters_location: 'Cyprus',
    regulations: ['FCA', 'CySEC', 'FSCA', 'FSCA Mauritius'],
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'FXTM Trader'],
    min_deposit: 10,
    leverage_max: '1:2000',
    spreads_avg: 1.5,
    commission_structure: { standard: 0, ecn: 'variable' },
    trading_instruments: ['Forex', 'CFDs', 'stocks', 'indices', 'commodities', 'cryptocurrencies'],
    demo_account_details: { available: true },
    islamic_account: { available: true },
    educational_materials: { webinars: true, courses: true, market_analysis: true, trading_signals: true },
    support_channels: { live_chat: true, phone: true, email: true, available_24_5: true },
    deposit_methods: ['Bank transfers', 'credit/debit cards', 'Skrill', 'Neteller', 'WebMoney'],
    trust_score: 88,
    pros: ['Low minimum deposit', 'high leverage', 'strong educational content'],
    cons: ['Spreads wider than ECN brokers', 'limited research tools']
  },
  'hotforex': {
    established_year: 2010,
    headquarters_location: 'Cyprus',
    regulations: ['CySEC', 'FCA', 'FSCA', 'DFSA', 'FSA'],
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'HotForex App', 'WebTrader'],
    min_deposit: 5,
    leverage_max: '1:1000',
    spreads_avg: 1.0,
    commission_structure: { standard: 0, zero: 3 },
    trading_instruments: ['Forex', 'CFDs', 'stocks', 'indices', 'commodities', 'cryptocurrencies'],
    demo_account_details: { available: true },
    islamic_account: { available: true },
    educational_materials: { webinars: true, courses: true, market_analysis: true, trading_signals: true },
    support_channels: { live_chat: true, phone: true, email: true, available_24_5: true },
    deposit_methods: ['Bank transfers', 'credit/debit cards', 'Skrill', 'Neteller', 'WebMoney'],
    trust_score: 85,
    pros: ['Low minimum deposit', 'multiple account types', 'good educational content'],
    cons: ['Wide spreads on standard accounts', 'limited research tools']
  },
  'ic-markets': {
    established_year: 2007,
    headquarters_location: 'Australia',
    regulations: ['ASIC', 'CySEC', 'FSA'],
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'WebTrader'],
    min_deposit: 200,
    leverage_max: '1:500',
    spreads_avg: 0.0,
    commission_structure: { standard: 0, raw: 3.5 },
    trading_instruments: ['Forex', 'CFDs', 'stocks', 'indices', 'commodities', 'cryptocurrencies'],
    demo_account_details: { available: true },
    islamic_account: { available: true },
    educational_materials: { webinars: true, tutorials: true, market_analysis: true, trading_guides: true },
    support_channels: { live_chat: true, phone: true, email: true, available_24_7: true },
    deposit_methods: ['Bank transfers', 'credit/debit cards', 'Skrill', 'Neteller', 'PayPal'],
    trust_score: 92,
    pros: ['Raw spreads', 'multiple platforms', 'strong regulation', 'fast execution'],
    cons: ['Higher minimum deposit for some account types', 'limited product range']
  },
  'ig-group': {
    established_year: 1974,
    headquarters_location: 'London, UK',
    regulations: ['FCA', 'ASIC', 'MAS', 'FSCA', 'FINMA'],
    platforms: ['IG Trading Platform', 'MetaTrader 4', 'ProRealTime', 'L2 Dealer'],
    min_deposit: 0,
    leverage_max: '1:30 (retail), 1:200 (professional)',
    spreads_avg: 0.6,
    commission_structure: { standard: 0, professional: 0 },
    trading_instruments: ['Forex', 'CFDs', 'stocks', 'indices', 'commodities', 'bonds', 'options', 'cryptocurrencies'],
    demo_account_details: { available: true },
    islamic_account: { available: true },
    educational_materials: { webinars: true, courses: true, market_analysis: true, trading_signals: true },
    support_channels: { live_chat: true, phone: true, email: true, available_24_5: true },
    deposit_methods: ['Bank transfers', 'credit/debit cards', 'PayPal'],
    trust_score: 96,
    pros: ['Long-established', 'excellent platform', 'strong regulation', 'diverse instruments'],
    cons: ['Limited leverage for retail traders', 'no cryptocurrency CFDs in UK']
  },
  'ig-markets': {
    established_year: 1974,
    headquarters_location: 'London, UK',
    regulations: ['FCA', 'ASIC', 'MAS', 'FSCA', 'FINMA'],
    platforms: ['IG Trading Platform', 'MetaTrader 4', 'ProRealTime', 'L2 Dealer'],
    min_deposit: 0,
    leverage_max: '1:30 (retail), 1:200 (professional)',
    spreads_avg: 0.6,
    commission_structure: { standard: 0, professional: 0 },
    trading_instruments: ['Forex', 'CFDs', 'stocks', 'indices', 'commodities', 'bonds', 'options', 'cryptocurrencies'],
    demo_account_details: { available: true },
    islamic_account: { available: true },
    educational_materials: { webinars: true, courses: true, market_analysis: true, trading_signals: true },
    support_channels: { live_chat: true, phone: true, email: true, available_24_5: true },
    deposit_methods: ['Bank transfers', 'credit/debit cards', 'PayPal'],
    trust_score: 96,
    pros: ['Long-established', 'excellent platform', 'strong regulation', 'diverse instruments'],
    cons: ['Limited leverage for retail traders', 'no cryptocurrency CFDs in UK']
  },
  'oanda': {
    established_year: 1996,
    headquarters_location: 'New York, USA',
    regulations: ['NFA', 'CFTC', 'FCA', 'ASIC', 'IIROC', 'MAS'],
    platforms: ['MetaTrader 4', 'fxTrade', 'TradingView', 'Mobile App'],
    min_deposit: 0,
    leverage_max: '1:50 (US), 1:100 (international)',
    spreads_avg: 1.2,
    commission_structure: { forex: 0, cfds: 1 },
    trading_instruments: ['Forex', 'CFDs', 'stocks', 'indices', 'commodities', 'bonds', 'cryptocurrencies'],
    demo_account_details: { available: true },
    islamic_account: { available: true },
    educational_materials: { webinars: true, courses: true, market_analysis: true, trading_signals: true },
    support_channels: { live_chat: true, phone: true, email: true, available_24_5: true },
    deposit_methods: ['Bank transfers', 'credit/debit cards', 'PayPal', 'ACH', 'wire transfer'],
    trust_score: 93,
    pros: ['Strong US regulation', 'no minimum deposit', 'reliable platform'],
    cons: ['Limited leverage', 'higher spreads on some instruments']
  },
  'pepperstone': {
    established_year: 2010,
    headquarters_location: 'Australia',
    regulations: ['ASIC', 'FCA', 'CySEC', 'DFSA', 'SCB', 'BaFin', 'CMA'],
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'TradingView', 'Pepperstone Mobile App'],
    min_deposit: 0,
    leverage_max: '1:500',
    spreads_avg: 0.0,
    commission_structure: { standard: 0, razor: 3.5 },
    trading_instruments: ['Forex', 'CFDs', 'stocks', 'indices', 'commodities', 'cryptocurrencies'],
    demo_account_details: { available: true },
    islamic_account: { available: true },
    educational_materials: { market_analysis: true, economic_calendar: true, trading_guides: true, webinars: true },
    support_channels: { live_chat: true, phone: true, email: true, available_24_5: true },
    deposit_methods: ['Bank transfers', 'credit/debit cards', 'Skrill', 'Neteller', 'PayPal', 'UnionPay'],
    trust_score: 94,
    pros: ['Raw spreads', 'multiple platforms', 'strong regulation', 'no deposit/withdrawal fees'],
    cons: ['Limited product range compared to larger brokers', 'no binary options']
  },
  'plus500': {
    established_year: 2008,
    headquarters_location: 'Israel',
    regulations: ['FCA', 'ASIC', 'CySEC', 'FMA', 'FSCA', 'MAS'],
    platforms: ['Plus500 WebTrader', 'Mobile App', 'Windows App'],
    min_deposit: 100,
    leverage_max: '1:300',
    spreads_avg: 0.8,
    commission_structure: { standard: 0, options: 0 },
    trading_instruments: ['Forex', 'CFDs', 'stocks', 'indices', 'commodities', 'cryptocurrencies', 'options', 'ETFs'],
    demo_account_details: { available: true },
    islamic_account: { available: true },
    educational_materials: { tutorials: true, market_analysis: true, economic_calendar: true },
    support_channels: { email: true, live_chat: true, available_24_7: true },
    deposit_methods: ['Bank transfers', 'credit/debit cards', 'PayPal', 'Skrill'],
    trust_score: 86,
    pros: ['Simple platform', 'no commissions', 'wide range of instruments'],
    cons: ['Limited advanced features', 'basic educational content']
  },
  'saxo-bank': {
    established_year: 1992,
    headquarters_location: 'Denmark',
    regulations: ['FCA', 'ASIC', 'FINMA', 'DFSA', 'JFSA', 'FSA'],
    platforms: ['SaxoTraderGO', 'SaxoTraderPRO', 'Saxo Bank Mobile App'],
    min_deposit: 500,
    leverage_max: '1:30 (retail), 1:200 (professional)',
    spreads_avg: 0.4,
    commission_structure: { variable: true, standard: 'variable' },
    trading_instruments: ['Forex', 'CFDs', 'stocks', 'bonds', 'ETFs', 'options', 'futures', 'mutual funds'],
    demo_account_details: { available: true },
    islamic_account: { available: true },
    educational_materials: { research: true, market_analysis: true, trading_strategies: true, webinars: true },
    support_channels: { phone: true, email: true, available_24_5: true },
    deposit_methods: ['Bank transfers', 'credit/debit cards'],
    trust_score: 95,
    pros: ['Extensive product range', 'strong regulation', 'excellent research'],
    cons: ['High minimum deposit', 'complex platform', 'high commissions']
  },
  'tickmill': {
    established_year: 2014,
    headquarters_location: 'UK',
    regulations: ['FCA', 'FSA', 'CySEC', 'FSCA'],
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'WebTrader', 'Mobile App'],
    min_deposit: 100,
    leverage_max: '1:500',
    spreads_avg: 0.0,
    commission_structure: { standard: 0, pro: 2 },
    trading_instruments: ['Forex', 'CFDs', 'stocks', 'indices', 'commodities', 'bonds'],
    demo_account_details: { available: true },
    islamic_account: { available: true },
    educational_materials: { webinars: true, tutorials: true, market_analysis: true, trading_guides: true },
    support_channels: { live_chat: true, phone: true, email: true, available_24_5: true },
    deposit_methods: ['Bank transfers', 'credit/debit cards', 'Skrill', 'Neteller', 'WebMoney'],
    trust_score: 89,
    pros: ['Raw spreads', 'fast execution', 'strong regulation', 'good customer support'],
    cons: ['Limited product range', 'limited educational content']
  },
  'xm': {
    established_year: 2009,
    headquarters_location: 'Cyprus',
    regulations: ['CySEC', 'FCA', 'ASIC', 'FSCA'],
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'XM App', 'WebTrader'],
    min_deposit: 5,
    leverage_max: '1:888',
    spreads_avg: 1.0,
    commission_structure: { standard: 0, ultralow: 0 },
    trading_instruments: ['Forex', 'CFDs', 'stocks', 'indices', 'commodities', 'cryptocurrencies'],
    demo_account_details: { available: true },
    islamic_account: { available: true },
    educational_materials: { webinars: true, seminars: true, trading_courses: true, market_analysis: true },
    support_channels: { live_chat: true, phone: true, email: true, available_24_5: true },
    deposit_methods: ['Bank transfers', 'credit/debit cards', 'Skrill', 'Neteller', 'WebMoney'],
    trust_score: 90,
    pros: ['Low minimum deposit', 'no commissions', 'strong regulation', 'good bonuses'],
    cons: ['Wider spreads than ECN brokers', 'limited research tools']
  },
  'xm-group': {
    established_year: 2009,
    headquarters_location: 'Cyprus',
    regulations: ['CySEC', 'FCA', 'ASIC', 'FSCA'],
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'XM App', 'WebTrader'],
    min_deposit: 5,
    leverage_max: '1:888',
    spreads_avg: 1.0,
    commission_structure: { standard: 0, ultralow: 0 },
    trading_instruments: ['Forex', 'CFDs', 'stocks', 'indices', 'commodities', 'cryptocurrencies'],
    demo_account_details: { available: true },
    islamic_account: { available: true },
    educational_materials: { webinars: true, seminars: true, trading_courses: true, market_analysis: true },
    support_channels: { live_chat: true, phone: true, email: true, available_24_5: true },
    deposit_methods: ['Bank transfers', 'credit/debit cards', 'Skrill', 'Neteller', 'WebMoney'],
    trust_score: 90,
    pros: ['Low minimum deposit', 'no commissions', 'strong regulation', 'good bonuses'],
    cons: ['Wider spreads than ECN brokers', 'limited research tools']
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
      
      // Update broker
      const { error: updateError } = await supabase
        .from('brokers')
        .update({
          ...data,
          last_data_update: new Date().toISOString(),
          data_confidence_score: 95,
          is_verified: true,
          verification_date: new Date().toISOString()
        })
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
      .select('name, slug, established_year, regulations, min_deposit, trust_score')
      .in('slug', Object.keys(comprehensiveBrokerData).slice(0, 5))
    
    if (verifyError) {
      console.error('❌ Error verifying updates:', verifyError)
    } else {
      console.log('📋 Sample updated brokers:')
      sampleBrokers.forEach(broker => {
        console.log(`  - ${broker.name} (${broker.slug}): Founded ${broker.established_year}, Trust Score: ${broker.trust_score}`)
      })
    }
    
    console.log('\n🎉 Database update completed!')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

updateBrokerData()