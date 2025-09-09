require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkSpreadsLeverage() {
  console.log('📊 Checking spreads and leverage data...');
  
  try {
    const { data, error } = await supabase
      .from('brokers')
      .select('name, spreads_avg, leverage_max')
      .limit(20);
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('\n📈 Sample spreads and leverage data:');
    data.forEach(broker => {
      console.log(`${broker.name}: AvgSpreads=${broker.spreads_avg || 'null'}, MaxLeverage=${broker.leverage_max || 'null'}`);
    });
    
    // Count null values
    const nullAvgSpreads = data.filter(b => !b.spreads_avg).length;
    const nullMaxLeverage = data.filter(b => !b.leverage_max).length;
    
    console.log(`\n📊 Summary (first 20 brokers):`);
    console.log(`   - Missing avg spreads: ${nullAvgSpreads}/20`);
    console.log(`   - Missing max leverage: ${nullMaxLeverage}/20`);
    
  } catch (error) {
    console.error('Check failed:', error);
  }
}

checkSpreadsLeverage();