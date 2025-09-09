const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const supabaseUrl = 'https://efxpwrnxdorgzcqhbnfn.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAzMzIzNSwiZXhwIjoyMDcyNjA5MjM1fQ.BKmSaW8dSc6soQZOh7zZGXMNO-evJZkSbLVJzxoYSYA';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample broker data that matches the existing schema
const sampleBrokers = [
  {
    name: 'IG Markets',
    slug: 'ig-markets',
    logo_url: 'https://example.com/ig-logo.png',
    country: 'United Kingdom',
    established_year: 1974,
    website_url: 'https://www.ig.com',
    affiliate_url: 'https://www.ig.com/affiliate',
    min_deposit: 250,
    spreads_avg: 0.6,
    leverage_max: '1:30',
    platforms: ['MetaTrader 4', 'IG Trading Platform', 'ProRealTime'],
    instruments: ['Forex', 'CFDs', 'Indices', 'Commodities', 'Cryptocurrencies'],
    regulations: ['FCA', 'ASIC', 'MAS'],
    regulation_tier: 'tier1',
    trust_score: 95,
    fees: {
      commission: 'Variable spreads',
      deposit_fee: 0,
      withdrawal_fee: 0,
      inactivity_fee: 12
    },
    is_active: true,
    featured: true,
    description: 'IG is a leading global provider of CFDs and spread betting, with over 45 years of experience in the financial markets.',
    pros: ['Highly regulated', 'Wide range of instruments', 'Advanced trading platforms', 'Educational resources'],
    cons: ['Higher minimum deposit', 'Complex fee structure for beginners']
  },
  {
    name: 'XM Group',
    slug: 'xm-group',
    logo_url: 'https://example.com/xm-logo.png',
    country: 'Cyprus',
    established_year: 2009,
    website_url: 'https://www.xm.com',
    affiliate_url: 'https://www.xm.com/partners',
    min_deposit: 5,
    spreads_avg: 1.0,
    leverage_max: '1:888',
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'XM WebTrader'],
    instruments: ['Forex', 'CFDs', 'Indices', 'Commodities', 'Energies'],
    regulations: ['CySEC', 'ASIC', 'IFSC'],
    regulation_tier: 'tier2',
    trust_score: 85,
    fees: {
      commission: 'No commission on standard accounts',
      deposit_fee: 0,
      withdrawal_fee: 0,
      inactivity_fee: 5
    },
    is_active: true,
    featured: true,
    description: 'XM Group is a well-established broker offering competitive trading conditions and excellent customer support.',
    pros: ['Low minimum deposit', 'No deposit/withdrawal fees', 'Multiple account types', '24/7 customer support'],
    cons: ['Higher spreads on standard accounts', 'Limited educational content']
  },
  {
    name: 'FXTM',
    slug: 'fxtm',
    logo_url: 'https://example.com/fxtm-logo.png',
    country: 'Cyprus',
    established_year: 2011,
    website_url: 'https://www.fxtm.com',
    affiliate_url: 'https://www.fxtm.com/partners',
    min_deposit: 10,
    spreads_avg: 1.3,
    leverage_max: '1:1000',
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'FXTM Trader'],
    instruments: ['Forex', 'CFDs', 'Indices', 'Commodities', 'Cryptocurrencies'],
    regulations: ['CySEC', 'FCA'],
    regulation_tier: 'tier2',
    trust_score: 80,
    fees: {
      commission: 'Variable based on account type',
      deposit_fee: 0,
      withdrawal_fee: 'Varies by method',
      inactivity_fee: 5
    },
    is_active: true,
    featured: false,
    description: 'FXTM (ForexTime) is a global forex broker known for its innovative trading solutions and award-winning customer service.',
    pros: ['Multiple account types', 'Copy trading available', 'Strong regulation', 'Educational resources'],
    cons: ['Withdrawal fees on some methods', 'Limited cryptocurrency offerings']
  },
  {
    name: 'Pepperstone',
    slug: 'pepperstone',
    logo_url: 'https://example.com/pepperstone-logo.png',
    country: 'Australia',
    established_year: 2010,
    website_url: 'https://pepperstone.com',
    affiliate_url: 'https://pepperstone.com/partners',
    min_deposit: 200,
    spreads_avg: 0.16,
    leverage_max: '1:500',
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'TradingView'],
    instruments: ['Forex', 'CFDs', 'Indices', 'Commodities', 'Cryptocurrencies'],
    regulations: ['ASIC', 'FCA', 'CySEC', 'DFSA'],
    regulation_tier: 'tier1',
    trust_score: 90,
    fees: {
      commission: 'Raw spreads + commission model available',
      deposit_fee: 0,
      withdrawal_fee: 0,
      inactivity_fee: 0
    },
    is_active: true,
    featured: true,
    description: 'Pepperstone is an Australian-based forex and CFD broker known for its tight spreads and fast execution.',
    pros: ['Very tight spreads', 'Fast execution', 'Multiple platforms', 'No inactivity fees'],
    cons: ['Higher minimum deposit', 'Limited educational content']
  },
  {
    name: 'Exness',
    slug: 'exness',
    logo_url: 'https://example.com/exness-logo.png',
    country: 'Cyprus',
    established_year: 2008,
    website_url: 'https://www.exness.com',
    affiliate_url: 'https://www.exness.com/partners',
    min_deposit: 1,
    spreads_avg: 0.3,
    leverage_max: '1:2000',
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'Exness Terminal'],
    instruments: ['Forex', 'CFDs', 'Indices', 'Commodities', 'Cryptocurrencies'],
    regulations: ['CySEC', 'FCA', 'FSA'],
    regulation_tier: 'tier2',
    trust_score: 88,
    fees: {
      commission: 'No commission on most accounts',
      deposit_fee: 0,
      withdrawal_fee: 0,
      inactivity_fee: 0
    },
    is_active: true,
    featured: true,
    description: 'Exness is a multi-asset broker offering competitive trading conditions with unlimited leverage options.',
    pros: ['Very low minimum deposit', 'High leverage available', 'Fast withdrawals', 'No fees'],
    cons: ['Complex account structure', 'Limited regulation in some regions']
  }
];

async function insertBrokerData() {
  console.log('Starting broker data insertion...');
  
  try {
    // First, check if any brokers already exist
    const { data: existingBrokers, error: checkError } = await supabase
      .from('brokers')
      .select('slug')
      .limit(1);
    
    if (checkError) {
      console.error('Error checking existing brokers:', checkError);
      return;
    }
    
    if (existingBrokers && existingBrokers.length > 0) {
      console.log('Brokers already exist in database. Skipping insertion.');
      return;
    }
    
    // Insert sample brokers
    const { data, error } = await supabase
      .from('brokers')
      .insert(sampleBrokers)
      .select();
    
    if (error) {
      console.error('Error inserting broker data:', error);
      return;
    }
    
    console.log(`Successfully inserted ${data.length} brokers:`);
    data.forEach(broker => {
      console.log(`- ${broker.name} (${broker.slug})`);
    });
    
    // Verify the insertion
    const { data: verifyData, error: verifyError } = await supabase
      .from('brokers')
      .select('name, slug, country, trust_score, regulation_tier')
      .order('trust_score', { ascending: false });
    
    if (verifyError) {
      console.error('Error verifying data:', verifyError);
      return;
    }
    
    console.log('\nVerification - Brokers in database:');
    verifyData.forEach(broker => {
      console.log(`${broker.name}: Trust Score ${broker.trust_score}, Tier ${broker.regulation_tier}`);
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

async function testDatabaseConnection() {
  console.log('Testing database connection...');
  
  try {
    const { data, error } = await supabase
      .from('brokers')
      .select('count')
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Database connection failed:', error);
      return false;
    }
    
    console.log('Database connection successful!');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

async function main() {
  console.log('=== Broker Data Population Script ===\n');
  
  // Test connection first
  const connectionOk = await testDatabaseConnection();
  if (!connectionOk) {
    console.log('Exiting due to connection issues.');
    return;
  }
  
  // Insert broker data
  await insertBrokerData();
  
  console.log('\n=== Script completed ===');
}

if (require.main === module) {
  main();
}

module.exports = { insertBrokerData, testDatabaseConnection };