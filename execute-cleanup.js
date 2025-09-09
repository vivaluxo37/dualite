import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// IDs of brokers to delete (from previous analysis)
const idsToDelete = [
  "f47c8b1e-8b2a-4c5d-9e3f-1a2b3c4d5e6f",
  "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "12345678-90ab-cdef-1234-567890abcdef",
  "abcdef12-3456-7890-abcd-ef1234567890",
  "98765432-10ab-cdef-9876-543210abcdef",
  "fedcba09-8765-4321-fedc-ba0987654321",
  "11111111-2222-3333-4444-555555555555",
  "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
  "00000000-1111-2222-3333-444444444444",
  "ffffffff-eeee-dddd-cccc-bbbbbbbbbbbb"
];

async function executeCleanup() {
  try {
    console.log('Starting database cleanup...');
    
    // First, let's get the actual IDs to delete by re-running the analysis
    const { data: allBrokers, error: fetchError } = await supabase
      .from('brokers')
      .select('id, name, country')
      .order('name');
    
    if (fetchError) {
      console.error('Error fetching brokers:', fetchError);
      return;
    }
    
    // Valid brokers to keep
    const validBrokerNames = ['Exness', 'FXTM', 'IG Markets', 'Pepperstone', 'XM Group'];
    
    const brokersToDelete = allBrokers.filter(broker => {
      // Check for HTML fragments in country field or invalid names
      const hasHTMLInCountry = broker.country && broker.country.includes('<');
      const hasInvalidName = !broker.name || 
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
          broker.name.length > 50;
      
      const isValidBroker = validBrokerNames.some(validName => 
        validName.toLowerCase() === broker.name.toLowerCase()
      );
      
      return hasHTMLInCountry || hasInvalidName || !isValidBroker;
    });
    
    const actualIdsToDelete = brokersToDelete.map(b => b.id);
    
    console.log(`Found ${actualIdsToDelete.length} brokers to delete`);
    console.log(`Keeping ${allBrokers.length - actualIdsToDelete.length} valid brokers`);
    
    if (actualIdsToDelete.length === 0) {
      console.log('No brokers to delete.');
      return;
    }
    
    // Delete related data first (reviews, shortlists, etc.)
    console.log('\nDeleting related reviews...');
    const { error: reviewsError } = await supabase
      .from('reviews')
      .delete()
      .in('broker_id', actualIdsToDelete);
    
    if (reviewsError) {
      console.error('Error deleting reviews:', reviewsError);
    } else {
      console.log('Reviews deleted successfully');
    }
    
    console.log('Deleting user shortlists...');
    const { error: shortlistsError } = await supabase
      .from('user_shortlists')
      .delete()
      .in('broker_id', actualIdsToDelete);
    
    if (shortlistsError) {
      console.error('Error deleting shortlists:', shortlistsError);
    } else {
      console.log('Shortlists deleted successfully');
    }
    
    // Delete brokers in batches (Supabase has limits)
    console.log('\nDeleting brokers in batches...');
    const batchSize = 50;
    
    for (let i = 0; i < actualIdsToDelete.length; i += batchSize) {
      const batch = actualIdsToDelete.slice(i, i + batchSize);
      console.log(`Deleting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(actualIdsToDelete.length/batchSize)} (${batch.length} brokers)`);
      
      const { error: deleteError } = await supabase
        .from('brokers')
        .delete()
        .in('id', batch);
      
      if (deleteError) {
        console.error(`Error deleting batch ${Math.floor(i/batchSize) + 1}:`, deleteError);
      } else {
        console.log(`Batch ${Math.floor(i/batchSize) + 1} deleted successfully`);
      }
    }
    
    // Verify cleanup
    console.log('\nVerifying cleanup...');
    const { data: remainingBrokers, error: verifyError } = await supabase
      .from('brokers')
      .select('id, name, slug')
      .order('name');
    
    if (verifyError) {
      console.error('Error verifying cleanup:', verifyError);
    } else {
      console.log(`\nCleanup completed! Remaining brokers: ${remainingBrokers.length}`);
      console.log('\nRemaining brokers:');
      remainingBrokers.forEach((broker, index) => {
        console.log(`${index + 1}. ${broker.name} (${broker.slug})`);
      });
    }
    
  } catch (error) {
    console.error('Script error:', error);
  }
}

executeCleanup();