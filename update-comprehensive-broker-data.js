import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

// Comprehensive broker data with detailed information from research
const comprehensiveBrokerData = {
  'exness': {
    established_year: 2008,
    min_deposit: 1,
    spreads_avg: 0.0,
    leverage_max: '1:2000',
    platforms: ['MT4', 'MT5', 'Exness Terminal'],
    instruments: ['Forex', 'Cryptocurrencies', 'Metals', 'Energies', 'Stocks'],
    regulations: ['FCA', 'CySEC', 'FSCA', 'FSA'],
    regulation_tier: 'tier1',
    trust_score: 85,
    fees: 'No deposit/withdrawal fees, competitive spreads',
    description: 'Exness is a global multi-asset broker established in 2008, offering trading services in forex, cryptocurrencies, metals, energies, and stocks. Known for competitive spreads starting from 0.0 pips and high leverage up to 1:2000.',
    pros: ['Competitive spreads from 0.0 pips', 'High leverage up to 1:2000', 'Multiple account types', 'Fast execution', 'No deposit/withdrawal fees'],
    cons: ['Limited educational resources', 'Complex fee structure for some accounts']
  },
  'fxtm': {
    established_year: 2011,
    min_deposit: 10,
    spreads_avg: 0.0,
    leverage_max: '1:2000',
    platforms: ['MT4', 'MT5', 'FXTM Trader'],
    instruments: ['Forex', 'Cryptocurrencies', 'Metals', 'Energies', 'Indices', 'Stocks'],
    regulations: ['FCA', 'CySEC', 'ASIC', 'FSCA'],
    regulation_tier: 'tier1',
    trust_score: 83,
    fees: 'No deposit fees, competitive spreads, inactivity fee after 90 days',
    description: 'FXTM (ForexTime) is a leading global forex broker established in 2011, offering comprehensive trading services across multiple asset classes with competitive spreads and advanced trading platforms.',
    pros: ['Competitive spreads from 0.0 pips on ECN accounts', 'Multiple account types', 'Strong regulation', 'Educational resources', 'Copy trading available'],
    cons: ['Inactivity fee after 90 days', 'Higher spreads on standard accounts', 'Limited cryptocurrency selection']
  },
  'ig-markets': {
    established_year: 1974,
    min_deposit: 250,
    spreads_avg: 0.6,
    leverage_max: '1:30',
    platforms: ['IG Platform', 'MT4', 'ProRealTime', 'L2 Dealer'],
    instruments: ['Forex', 'Indices', 'Commodities', 'Shares', 'Cryptocurrencies', 'Options', 'Bonds'],
    regulations: ['FCA', 'BaFin', 'ASIC', 'MAS', 'JFSA'],
    regulation_tier: 'tier1',
    trust_score: 92,
    fees: 'No deposit/withdrawal fees, 0.5% currency conversion, £12 monthly inactivity fee after 24 months',
    description: 'IG Markets is a leading global provider of CFDs and spread betting, established in 1974. Listed on the London Stock Exchange with a market cap of £3.4 billion, serving over 346,200 active clients worldwide.',
    pros: ['Highly regulated and established', 'Wide range of markets (17,000+ instruments)', 'Advanced trading platforms', 'Strong research and analysis', 'Competitive fees'],
    cons: ['Higher minimum deposit', 'Inactivity fees', 'Complex fee structure', 'High equity trading fees']
  },
  'pepperstone': {
    established_year: 2010,
    min_deposit: 0,
    spreads_avg: 0.0,
    leverage_max: '1:500',
    platforms: ['MT4', 'MT5', 'cTrader', 'TradingView'],
    instruments: ['Forex', 'Indices', 'Commodities', 'Cryptocurrencies', 'Stocks', 'ETFs'],
    regulations: ['ASIC', 'FCA', 'CySEC', 'DFSA', 'CMA', 'SCB', 'BaFin'],
    regulation_tier: 'tier1',
    trust_score: 90,
    fees: 'No deposit/withdrawal fees, commission-based Razor account, spread-based Standard account',
    description: 'Pepperstone is an award-winning global forex and CFD broker established in 2010, known for competitive pricing, advanced trading platforms, and institutional-grade execution with deep liquidity.',
    pros: ['Ultra-competitive spreads from 0.0 pips', 'No minimum deposit', 'Multiple top-tier regulations', 'Advanced platforms including TradingView', 'Fast execution speeds', 'No deposit/withdrawal fees'],
    cons: ['Limited educational resources', 'Commission charges on Razor account', 'Complex pricing structure']
  },
  'xm-group': {
    established_year: 2009,
    min_deposit: 5,
    spreads_avg: 0.6,
    leverage_max: '1:888',
    platforms: ['MT4', 'MT5', 'XM WebTrader'],
    instruments: ['Forex', 'Indices', 'Commodities', 'Cryptocurrencies', 'Stocks', 'Energies', 'Precious Metals'],
    regulations: ['CySEC', 'ASIC', 'IFSC', 'DFSA'],
    regulation_tier: 'tier1',
    trust_score: 87,
    fees: 'No deposit/withdrawal fees, competitive spreads, no commission on standard accounts',
    description: 'XM Group is a global multi-asset broker established in 2009, serving over 3.5 million clients from 196 countries. Known for excellent customer service, educational resources, and competitive trading conditions.',
    pros: ['Excellent customer support 24/5', 'Comprehensive educational resources', 'Low minimum deposit', 'Multiple account types', 'No deposit/withdrawal fees', 'Strong regulation'],
    cons: ['Higher spreads on standard accounts', 'Limited advanced trading tools', 'Inactivity fees on some accounts']
  }
};

async function updateComprehensiveBrokerData() {
  console.log('Starting comprehensive broker data update...');
  
  for (const [slug, data] of Object.entries(comprehensiveBrokerData)) {
    try {
      console.log(`\nUpdating ${slug}...`);
      
      const { data: updateResult, error } = await supabase
        .from('brokers')
        .update({
          established_year: data.established_year,
          min_deposit: data.min_deposit,
          spreads_avg: data.spreads_avg,
          leverage_max: data.leverage_max,
          platforms: data.platforms,
          instruments: data.instruments,
          regulations: data.regulations,
          regulation_tier: data.regulation_tier,
          trust_score: data.trust_score,
          fees: data.fees,
          description: data.description,
          pros: data.pros,
          cons: data.cons,
          updated_at: new Date().toISOString()
        })
        .eq('slug', slug)
        .select();
      
      if (error) {
        console.error(`Error updating ${slug}:`, error);
        continue;
      }
      
      if (updateResult && updateResult.length > 0) {
        console.log(`✅ Successfully updated ${slug}`);
        console.log(`   - Established: ${data.established_year}`);
        console.log(`   - Min Deposit: $${data.min_deposit}`);
        console.log(`   - Spreads: ${data.spreads_avg}`);
        console.log(`   - Max Leverage: ${data.leverage_max}`);
        console.log(`   - Trust Score: ${data.trust_score}`);
        console.log(`   - Platforms: ${data.platforms}`);
      } else {
        console.log(`⚠️  No broker found with slug: ${slug}`);
      }
      
    } catch (error) {
      console.error(`Exception updating ${slug}:`, error);
    }
  }
  
  // Verify all updates
  console.log('\n=== Verification ===');
  for (const slug of Object.keys(comprehensiveBrokerData)) {
    try {
      const { data: broker, error } = await supabase
        .from('brokers')
        .select('name, slug, established_year, min_deposit, trust_score, leverage_max, platforms')
        .eq('slug', slug)
        .single();
      
      if (error) {
        console.error(`Error verifying ${slug}:`, error);
        continue;
      }
      
      if (broker) {
        console.log(`\n${broker.name} (${broker.slug}):`);
        console.log(`  Established: ${broker.established_year}`);
        console.log(`  Min Deposit: $${broker.min_deposit}`);
        console.log(`  Trust Score: ${broker.trust_score}`);
        console.log(`  Max Leverage: ${broker.leverage_max}`);
        console.log(`  Platforms: ${broker.platforms}`);
      }
    } catch (error) {
      console.error(`Exception verifying ${slug}:`, error);
    }
  }
  
  console.log('\n✅ Comprehensive broker data update completed!');
}

updateComprehensiveBrokerData().catch(console.error);