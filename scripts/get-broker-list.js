const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function getBrokerList() {
  try {
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('id, name, established_year')
      .order('name');
    
    if (error) {
      console.error('Error fetching brokers:', error);
      return;
    }
    
    console.log('📊 BROKER DATABASE ANALYSIS');
    console.log('=' .repeat(50));
    console.log(`Total brokers: ${brokers.length}`);
    
    const withoutFoundingYear = brokers.filter(b => !b.established_year);
    console.log(`Brokers without founding year: ${withoutFoundingYear.length}`);
    console.log(`Completion rate: ${((brokers.length - withoutFoundingYear.length) / brokers.length * 100).toFixed(1)}%`);
    
    console.log('\n📋 FIRST 20 BROKERS:');
    console.log('-' .repeat(50));
    brokers.slice(0, 20).forEach((broker, index) => {
      const status = broker.established_year ? `✅ ${broker.established_year}` : '❌ missing';
      console.log(`${(index + 1).toString().padStart(2)}. ${broker.name.padEnd(25)} ${status}`);
    });
    
    if (withoutFoundingYear.length > 0) {
      console.log('\n🔍 BROKERS NEEDING FOUNDING YEAR DATA:');
      console.log('-' .repeat(50));
      withoutFoundingYear.slice(0, 10).forEach((broker, index) => {
        console.log(`${(index + 1).toString().padStart(2)}. ${broker.name}`);
      });
      
      if (withoutFoundingYear.length > 10) {
        console.log(`... and ${withoutFoundingYear.length - 10} more`);
      }
    }
    
  } catch (error) {
    console.error('Fatal error:', error);
  }
}

getBrokerList();