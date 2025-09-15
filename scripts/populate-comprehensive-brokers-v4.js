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
  const additional = broker.additional_data || {};
  
  // Convert instruments object to array
  const instrumentsArray = additional.instruments ? 
    Object.keys(additional.instruments).filter(key => additional.instruments[key]) : 
    ['forex', 'indices', 'commodities'];
  
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
    platforms: broker.platforms || [],
    instruments: instrumentsArray,
    trust_score: broker.trust_score,
    avg_rating: broker.avg_rating,
    total_reviews: broker.total_reviews,
    is_active: broker.is_active,
    featured: broker.trust_score > 90,
    description: broker.company_description,
    pros: additional.pros || [],
    cons: additional.cons || [],
    created_at: broker.created_at,
    updated_at: broker.updated_at,
    // Account fees
    account_fees: additional.account_fees || {},
    // Trading conditions
    trading_conditions_score: additional.trading_conditions ? 
      Math.round((broker.spreads_avg ? (5 - broker.spreads_avg) * 20 : 75)) : 75,
    spread_type: 'variable',
    execution_type: 'ECN',
    // Account types
    account_types: additional.account_types || [],
    demo_account_details: additional.demo_account || { available: true },
    swap_free: additional.account_types?.includes('Islamic') || false,
    negative_balance_protection: true,
    // Payment methods
    deposit_methods: additional.payment_methods?.map(method => ({ method, type: 'deposit' })) || [],
    withdrawal_methods: additional.payment_methods?.map(method => ({ method, type: 'withdrawal' })) || [],
    inactivity_fees: additional.account_fees?.inactivity_fee ? { amount: additional.account_fees.inactivity_fee, period: 'monthly' } : null,
    // Support
    support_channels: additional.customer_support?.phone ? [{ channel: 'phone', available: true }] : [],
    support_languages: additional.customer_support?.languages || [],
    support_availability: additional.customer_support?.availability || '24/5',
    support_quality_rating: 4.0,
    // Education
    educational_materials: additional.educational_resources?.webinars ? [{ type: 'webinar', title: 'Trading Webinars' }] : [],
    market_analysis: { daily_analysis: true, economic_calendar: true },
    trading_tools: { calculators: ['Profit Calculator', 'Pip Calculator'] },
    educational_videos_count: additional.educational_resources?.video_tutorials ? 50 : 0,
    webinar_count: additional.educational_resources?.webinars ? 20 : 0,
    // Scores
    overall_score: broker.trust_score,
    platforms_score: broker.platforms?.length > 0 ? 85 : 70,
    customer_support_score: additional.customer_support?.languages?.length > 0 ? 85 : 70,
    education_score: additional.educational_resources?.webinars ? 85 : 70,
    trust_and_safety_score: broker.trust_score,
    value_for_money_score: broker.min_deposit < 100 ? 85 : 75,
    // SEO
    seo_title: `${broker.name} Review 2025 - Is ${broker.name} a Scam or Legit?`,
    seo_description: `Comprehensive ${broker.name} review for 2025. Read our expert analysis on spreads, regulations, platforms, and trading conditions. Is ${broker.name} the right broker for you?`,
    seo_keywords: [`${broker.name} review`, 'forex broker', 'online trading', 'CFD trading', broker.name.toLowerCase()],
    meta_description: broker.company_description?.substring(0, 160) || `Read our comprehensive ${broker.name} review for 2025. Learn about spreads, regulations, platforms, and trading conditions.`,
    meta_keywords: [`${broker.name} review`, 'forex broker', 'online trading', 'CFD trading'],
    // Social media
    social_media: {
      facebook: `https://facebook.com/${broker.slug}`,
      twitter: `https://twitter.com/${broker.slug}`,
      linkedin: `https://linkedin.com/company/${broker.slug}`
    }
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