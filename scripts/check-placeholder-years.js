const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://efxpwrnxdorgzcqhbnfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAzMzIzNSwiZXhwIjoyMDcyNjA5MjM1fQ.BKmSaW8dSc6soQZOh7zZGXMNO-evJZkSbLVJzxoYSYA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPlaceholderYears() {
  try {
    console.log('Checking for brokers with placeholder years...');
    
    // Get brokers with years less than 100 (likely placeholders)
    const { data, error } = await supabase
      .from('brokers')
      .select('name, established_year')
      .lt('established_year', 100)
      .order('established_year');
    
    if (error) {
      console.error('Error fetching brokers:', error);
      return;
    }
    
    console.log(`Found ${data.length} brokers with placeholder years:`);
    data.slice(0, 15).forEach(broker => {
      console.log(`- ${broker.name}: ${broker.established_year}`);
    });
    
    if (data.length > 15) {
      console.log(`... and ${data.length - 15} more`);
    }
    
  } catch (error) {
    console.error('Script error:', error);
  }
}

checkPlaceholderYears();