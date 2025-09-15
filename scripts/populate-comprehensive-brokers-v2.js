const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const comprehensiveBrokerData = require('./comprehensive-broker-data.js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Transform comprehensive data to match database schema
function transformBrokerData(broker) {
  return {
    name: broker.name,
    slug: broker.slug,
    country: broker.headquarters?.split(',')[0]?.trim() || 'Unknown',
    established_year: broker.year_founded,
    headquarters_location: broker.headquarters,
    website_url: broker.website,
    affiliate_url: broker.affiliate_url,
    company_description: broker.company_description,
    regulations: broker.regulations || [],
    min_deposit: broker.min_deposit,
    spreads_avg: broker.spreads_avg,
    leverage_max: broker.leverage_max,
    trading_platforms: broker.platforms || [],
    trust_score: broker.trust_score,
    avg_rating: broker.avg_rating,
    total_reviews: broker.total_reviews,
    is_active: broker.is_active,
    data_sources: broker.data_sources || [],
    created_at: broker.created_at,
    updated_at: broker.updated_at,
    // Store additional data in JSONB columns
    account_fees: broker.additional_data?.account_fees || {},
    trading_conditions_score: broker.additional_data?.trading_conditions ? 
      Math.round((broker.spreads_avg ? (5 - broker.spreads_avg) * 20 : 75)) : 75,
    instruments_available: broker.additional_data?.instruments || {},
    account_types: broker.additional_data?.account_types || [],
    customer_support: broker.additional_data?.customer_support || {},
    payment_methods: broker.additional_data?.payment_methods || [],
    educational_resources: broker.additional_data?.educational_resources || {},
    pros: broker.additional_data?.pros || [],
    cons: broker.additional_data?.cons || [],
    featured: broker.trust_score > 90,
    data_confidence_score: 85
  };
}

async function populateBrokers() {
  console.log('Starting to populate comprehensive broker data...');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const broker of comprehensiveBrokerData) {
    try {
      console.log(`Processing ${broker.name}...`);
      
      const transformedBroker = transformBrokerData(broker);
      
      // Check if broker already exists
      const { data: existingBroker, error: checkError } = await supabase
        .from('brokers')
        .select('id')
        .eq('slug', broker.slug)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error(`Error checking existing broker ${broker.name}:`, checkError);
        errorCount++;
        continue;
      }
      
      if (existingBroker) {
        console.log(`Broker ${broker.name} already exists, updating...`);
        
        // Update existing broker
        const { error: updateError } = await supabase
          .from('brokers')
          .update({
            ...transformedBroker,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingBroker.id);
        
        if (updateError) {
          console.error(`Error updating broker ${broker.name}:`, updateError);
          errorCount++;
        } else {
          console.log(`Successfully updated ${broker.name}`);
          successCount++;
        }
      } else {
        console.log(`Inserting new broker ${broker.name}...`);
        
        // Insert new broker
        const { error: insertError } = await supabase
          .from('brokers')
          .insert([transformedBroker]);
        
        if (insertError) {
          console.error(`Error inserting broker ${broker.name}:`, insertError);
          errorCount++;
        } else {
          console.log(`Successfully inserted ${broker.name}`);
          successCount++;
        }
      }
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Error processing broker ${broker.name}:`, error);
      errorCount++;
    }
  }
  
  console.log('\n=== Population Summary ===');
  console.log(`Successfully processed: ${successCount} brokers`);
  console.log(`Errors encountered: ${errorCount} brokers`);
  console.log(`Total brokers attempted: ${comprehensiveBrokerData.length}`);
}

// Main execution
async function main() {
  try {
    // Test database connection
    const { data, error } = await supabase.from('brokers').select('count').single();
    
    if (error) {
      console.error('Database connection failed:', error);
      process.exit(1);
    }
    
    console.log('Database connection successful');
    
    await populateBrokers();
    
    console.log('\nComprehensive broker data population completed!');
    
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { populateBrokers };