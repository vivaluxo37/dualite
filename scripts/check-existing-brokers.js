require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkExistingBrokers() {
  try {
    console.log('Fetching existing brokers from database...');
    
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('id, name, slug')
      .order('name');

    if (error) {
      console.error('Error fetching brokers:', error);
      return;
    }

    console.log(`\nFound ${brokers.length} brokers in database:\n`);
    
    brokers.forEach((broker, index) => {
      console.log(`${index + 1}. ${broker.name} (slug: ${broker.slug})`);
    });

    console.log(`\n=== SUMMARY ===`);
    console.log(`Total brokers: ${brokers.length}`);
    console.log(`Brokers with logos needed: ${brokers.length}`);
    
    return brokers;
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkExistingBrokers();