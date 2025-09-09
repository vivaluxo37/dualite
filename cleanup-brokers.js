import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// List of valid, well-known forex brokers
const validBrokers = [
  'Pepperstone',
  'IC Markets',
  'XM',
  'FXCM',
  'IG',
  'OANDA',
  'eToro',
  'Plus500',
  'AvaTrade',
  'FxPro',
  'Exness',
  'FBS',
  'XTB',
  'Admiral Markets',
  'ThinkMarkets',
  'Eightcap',
  'FP Markets',
  'Axi',
  'HFM',
  'FXGT',
  'Vantage FX',
  'BlackBull Markets',
  'Tickmill',
  'FXTM',
  'Dukascopy',
  'Saxo Bank',
  'Interactive Brokers',
  'CMC Markets',
  'City Index',
  'Capital.com',
  'Markets.com',
  'Trading 212',
  'Libertex',
  'IronFX',
  'FXPRIMUS',
  'Alpari',
  'InstaForex',
  'RoboForex',
  'LiteFinance',
  'FreshForex',
  'NordFX',
  'IFC Markets',
  'FXCC',
  'easyMarkets',
  'PrimeXBT',
  'BDSwiss',
  'EuropeFX',
  'Swissquote',
  'TradeStation',
  'TD Ameritrade',
  'E*TRADE',
  'Charles Schwab',
  'Fidelity'
];

async function cleanupBrokers() {
  try {
    console.log('Starting broker cleanup process...');
    
    // Get all brokers
    const { data: allBrokers, error } = await supabase
      .from('brokers')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching brokers:', error);
      return;
    }
    
    console.log(`\nAnalyzing ${allBrokers.length} brokers...`);
    
    const brokersToDelete = [];
    const brokersToKeep = [];
    
    allBrokers.forEach(broker => {
      const issues = [];
      
      // Check for HTML fragments in country field
      if (broker.country && broker.country.includes('<')) {
        issues.push('HTML in country field');
      }
      
      // Check for invalid names
      if (!broker.name || 
          broker.name.includes('<') || 
          broker.name.includes('div>') ||
          broker.name.includes('Page not found') ||
          broker.name.includes('Index of') ||
          broker.name.includes('Top ') ||
          broker.name.includes(' List') ||
          broker.name.includes('.com') ||
          broker.name.includes('Rating') ||
          broker.name.includes('Regulations') ||
          broker.name.length < 2 ||
          broker.name.length > 50) {
        issues.push('Invalid name');
      }
      
      // Check if it's a known valid broker (case insensitive)
      const isValidBroker = validBrokers.some(validName => 
        validName.toLowerCase() === broker.name.toLowerCase() ||
        broker.name.toLowerCase().includes(validName.toLowerCase())
      );
      
      if (issues.length > 0 || !isValidBroker) {
        brokersToDelete.push({
          ...broker,
          issues: issues.length > 0 ? issues : ['Not in valid brokers list']
        });
      } else {
        brokersToKeep.push(broker);
      }
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('CLEANUP ANALYSIS RESULTS:');
    console.log('='.repeat(80));
    console.log(`Total brokers: ${allBrokers.length}`);
    console.log(`Brokers to keep: ${brokersToKeep.length}`);
    console.log(`Brokers to delete: ${brokersToDelete.length}`);
    
    console.log('\n' + '='.repeat(80));
    console.log('BROKERS TO KEEP:');
    console.log('='.repeat(80));
    brokersToKeep.forEach((broker, index) => {
      console.log(`${index + 1}. ${broker.name} (${broker.slug})`);
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('BROKERS TO DELETE (showing first 20):');
    console.log('='.repeat(80));
    brokersToDelete.slice(0, 20).forEach((broker, index) => {
      console.log(`${index + 1}. ${broker.name} - Issues: ${broker.issues.join(', ')}`);
    });
    
    if (brokersToDelete.length > 20) {
      console.log(`... and ${brokersToDelete.length - 20} more`);
    }
    
    // Save the IDs to delete for the actual cleanup
    const idsToDelete = brokersToDelete.map(b => b.id);
    console.log('\n' + '='.repeat(80));
    console.log('BROKER IDS TO DELETE:');
    console.log('='.repeat(80));
    console.log(JSON.stringify(idsToDelete, null, 2));
    
  } catch (error) {
    console.error('Script error:', error);
  }
}

cleanupBrokers();