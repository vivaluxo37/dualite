import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// Enhanced broker data matching the actual schema
const enhancedBrokerData = {
  'exness': {
    name: 'Exness',
    description: 'Exness is a global multi-asset broker offering forex, commodities, cryptocurrencies, stocks, and indices trading with competitive spreads and fast execution.',
    established_year: 2008,
    website_url: 'https://www.exness.com',
    affiliate_url: 'https://www.exness.com/partners',
    min_deposit: 1,
    spreads_avg: 0.3,
    leverage_max: '1:2000',
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'Exness Terminal'],
    instruments: ['Forex', 'CFDs', 'Commodities', 'Cryptocurrencies', 'Stocks', 'Indices'],
    regulations: ['Cyprus Securities and Exchange Commission', 'Financial Conduct Authority', 'Financial Services Commission'],
    regulation_tier: 'tier1', // Top tier regulation
    trust_score: 88,
    fees: {
      commission: 'Zero commission on Standard accounts',
      deposit_fee: 0,
      inactivity_fee: 0,
      withdrawal_fee: 'Free'
    },
    pros: ['Ultra-low spreads', 'High leverage up to 1:2000', 'Fast execution', 'No minimum deposit', 'Multiple account types'],
    cons: ['Limited educational resources', 'No social trading', 'Withdrawal restrictions in some regions']
  },
  'fxtm': {
    name: 'FXTM',
    description: 'ForexTime (FXTM) is a leading global broker offering forex, commodities, and CFD trading with award-winning platforms and comprehensive educational resources.',
    established_year: 2011,
    website_url: 'https://www.fxtm.com',
    affiliate_url: 'https://www.fxtm.com/partners',
    min_deposit: 10,
    spreads_avg: 1.3,
    leverage_max: '1:1000',
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'FXTM Trader'],
    instruments: ['Forex', 'CFDs', 'Indices', 'Commodities', 'Cryptocurrencies'],
    regulations: ['Cyprus Securities and Exchange Commission', 'Financial Services Commission (Mauritius)', 'Financial Services Authority (South Africa)'],
    regulation_tier: 'tier1',
    trust_score: 80,
    fees: {
      commission: 'Variable based on account type',
      deposit_fee: 0,
      inactivity_fee: 5,
      withdrawal_fee: 'Varies by method'
    },
    pros: ['Multiple account types', 'Copy trading available', 'Strong regulation', 'Educational resources', 'Competitive spreads'],
    cons: ['Withdrawal fees on some methods', 'Limited cryptocurrency offerings', 'Inactivity fees apply']
  },
  'ig-markets': {
    name: 'IG Markets',
    description: 'IG is a leading global provider of CFDs, forex, and spread betting with over 50 years of experience, offering access to 19,000+ markets.',
    established_year: 1974,
    website_url: 'https://www.ig.com',
    affiliate_url: 'https://www.ig.com/partners',
    min_deposit: 250,
    spreads_avg: 0.6,
    leverage_max: '1:30',
    platforms: ['IG Platform', 'MetaTrader 4', 'ProRealTime'],
    instruments: ['Forex', 'CFDs', 'Indices', 'Commodities', 'Shares', 'Options', 'Bonds'],
    regulations: ['Financial Conduct Authority', 'Australian Securities and Investments Commission', 'Monetary Authority of Singapore'],
      regulation_tier: 'tier1',
    trust_score: 95,
    fees: {
      commission: 'Zero commission on forex',
      deposit_fee: 0,
      inactivity_fee: 12,
      withdrawal_fee: 'Free'
    },
    pros: ['Highly regulated', 'Extensive market access', 'Advanced platforms', 'Strong research tools', 'Excellent customer service'],
    cons: ['High minimum deposit', 'Limited leverage for retail clients', 'Inactivity fees apply']
  },
  'pepperstone': {
    name: 'Pepperstone',
    description: 'Pepperstone is an award-winning Australian forex and CFD broker known for ultra-fast execution, tight spreads, and cutting-edge technology.',
    established_year: 2010,
    website_url: 'https://pepperstone.com',
    affiliate_url: 'https://pepperstone.com/partners',
    min_deposit: 200,
    spreads_avg: 0.0,
    leverage_max: '1:500',
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'TradingView'],
    instruments: ['Forex', 'CFDs', 'Indices', 'Commodities', 'Cryptocurrencies', 'Shares'],
    regulations: ['Australian Securities and Investments Commission', 'Financial Conduct Authority', 'Cyprus Securities and Exchange Commission'],
      regulation_tier: 'tier1',
    trust_score: 90,
    fees: {
      commission: '$3.50 per lot on Razor accounts',
      deposit_fee: 0,
      inactivity_fee: 0,
      withdrawal_fee: 'Free'
    },
    pros: ['Ultra-fast execution', 'Tight spreads from 0.0 pips', 'Multiple platforms', 'Strong regulation', 'No inactivity fees'],
    cons: ['Commission on Razor accounts', 'Limited educational resources', 'Higher minimum deposit']
  },
  'xm-group': {
    name: 'XM Group',
    description: 'XM is a global forex and CFD broker offering over 1000 instruments with competitive spreads, fast execution, and comprehensive educational resources.',
    established_year: 2009,
    website_url: 'https://www.xm.com',
    affiliate_url: 'https://www.xm.com/partners',
    min_deposit: 5,
    spreads_avg: 1.0,
    leverage_max: '1:1000',
    platforms: ['MetaTrader 4', 'MetaTrader 5'],
    instruments: ['Forex', 'CFDs', 'Indices', 'Commodities', 'Cryptocurrencies', 'Stocks'],
    regulations: ['Cyprus Securities and Exchange Commission', 'Australian Securities and Investments Commission', 'International Financial Services Commission'],
      regulation_tier: 'tier1',
    trust_score: 85,
    fees: {
      commission: 'Zero commission on Standard accounts',
      deposit_fee: 0,
      inactivity_fee: 5,
      withdrawal_fee: 'Free'
    },
    pros: ['Low minimum deposit', 'Extensive educational resources', 'Multiple account types', 'Strong regulation', 'Bonus programs'],
    cons: ['Higher spreads on some pairs', 'Inactivity fees apply', 'Limited platform options']
  }
}

async function enhanceBrokerData() {
  console.log('Enhancing broker data in database...')
  
  try {
    for (const [slug, data] of Object.entries(enhancedBrokerData)) {
      console.log(`\nUpdating ${data.name}...`)
      
      const { error } = await supabase
        .from('brokers')
        .update({
          name: data.name,
          description: data.description,
          established_year: data.established_year,
          website_url: data.website_url,
          affiliate_url: data.affiliate_url,
          min_deposit: data.min_deposit,
          spreads_avg: data.spreads_avg,
          leverage_max: data.leverage_max,
          platforms: data.platforms,
          instruments: data.instruments,
          regulations: data.regulations,
          regulation_tier: data.regulation_tier,
          trust_score: data.trust_score,
          fees: data.fees,
          pros: data.pros,
          cons: data.cons,
          updated_at: new Date().toISOString()
        })
        .eq('slug', slug)
      
      if (error) {
        console.error(`Error updating ${data.name}:`, error)
      } else {
        console.log(`✅ Successfully updated ${data.name}`)
      }
    }
    
    console.log('\n🎉 Broker data enhancement completed!')
    
    // Verify the updates
    console.log('\nVerifying updates...')
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('name, slug, description, min_deposit, leverage_max, trust_score')
      .order('name')
    
    if (error) {
      console.error('Error verifying updates:', error)
    } else {
      console.log('\nUpdated brokers:')
      brokers.forEach(broker => {
        console.log(`- ${broker.name} (${broker.slug}): Min Deposit $${broker.min_deposit}, Max Leverage ${broker.leverage_max}, Trust Score: ${broker.trust_score}`)
      })
    }
    
  } catch (error) {
    console.error('Error enhancing broker data:', error)
  }
}

enhanceBrokerData()