const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkBrokers() {
  try {
    const { data, error } = await supabase
      .from('brokers')
      .select('*');
    
    if (error) {
      console.error('Error fetching brokers:', error);
      return;
    }
    
    console.log('Total brokers:', data.length);
    console.log('Broker names:', data.map(b => b.name).join(', '));
    
    // Check structure of first broker
    if (data.length > 0) {
      console.log('\nFirst broker structure:');
      console.log(Object.keys(data[0]));
      console.log('\nFirst broker sample:', {
        id: data[0].id,
        name: data[0].name,
        slug: data[0].slug,
        rating: data[0].rating,
        year_founded: data[0].year_founded,
        regulation: data[0].regulation
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkBrokers();