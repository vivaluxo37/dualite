import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBrokers() {
  try {
    console.log('Checking brokers in database...');
    
    // Get all brokers
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('id, name, slug, country, is_active, trust_score, avg_rating, total_reviews')
      .order('name');
    
    if (error) {
      console.error('Error fetching brokers:', error);
      return;
    }
    
    console.log(`\nFound ${brokers.length} brokers in database:`);
    console.log('=' .repeat(80));
    
    brokers.forEach((broker, index) => {
      console.log(`${index + 1}. ${broker.name}`);
      console.log(`   Slug: ${broker.slug}`);
      console.log(`   Country: ${broker.country}`);
      console.log(`   Active: ${broker.is_active}`);
      console.log(`   Trust Score: ${broker.trust_score}`);
      console.log(`   Avg Rating: ${broker.avg_rating}`);
      console.log(`   Total Reviews: ${broker.total_reviews}`);
      console.log('   ' + '-'.repeat(50));
    });
    
    // Check for potential issues
    const inactiveBrokers = brokers.filter(b => !b.is_active);
    const lowTrustBrokers = brokers.filter(b => b.trust_score < 30);
    const noReviewsBrokers = brokers.filter(b => b.total_reviews === 0);
    
    console.log('\n' + '='.repeat(80));
    console.log('POTENTIAL ISSUES:');
    console.log('='.repeat(80));
    
    if (inactiveBrokers.length > 0) {
      console.log(`\nInactive brokers (${inactiveBrokers.length}):`);
      inactiveBrokers.forEach(b => console.log(`- ${b.name} (${b.slug})`));
    }
    
    if (lowTrustBrokers.length > 0) {
      console.log(`\nLow trust score brokers (${lowTrustBrokers.length}):`);
      lowTrustBrokers.forEach(b => console.log(`- ${b.name}: ${b.trust_score}`));
    }
    
    if (noReviewsBrokers.length > 0) {
      console.log(`\nBrokers with no reviews (${noReviewsBrokers.length}):`);
      noReviewsBrokers.forEach(b => console.log(`- ${b.name}`));
    }
    
  } catch (error) {
    console.error('Script error:', error);
  }
}

checkBrokers();