const { createClient } = require('@supabase/supabase-js');

// Use actual environment variables
const supabase = createClient(
  'https://efxpwrnxdorgzcqhbnfn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAzMzIzNSwiZXhwIjoyMDcyNjA5MjM1fQ.BKmSaW8dSc6soQZOh7zZGXMNO-evJZkSbLVJzxoYSYA'
);

async function checkAllSpreadsLeverage() {
  console.log('📊 Checking spreads and leverage completion for all brokers...');
  
  try {
    // Get total count
    const { count: totalCount, error: countError } = await supabase
      .from('brokers')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Count Error:', countError);
      return;
    }
    
    // Get null counts
    const { count: nullSpreads, error: spreadsError } = await supabase
      .from('brokers')
      .select('*', { count: 'exact', head: true })
      .is('spreads_avg', null);
    
    const { count: nullLeverage, error: leverageError } = await supabase
      .from('brokers')
      .select('*', { count: 'exact', head: true })
      .is('leverage_max', null);
    
    if (spreadsError || leverageError) {
      console.error('Error:', spreadsError || leverageError);
      return;
    }
    
    console.log(`\n📈 Spreads & Leverage Completion Status:`);
    console.log(`   Total brokers: ${totalCount}`);
    console.log(`   Missing spreads: ${nullSpreads}/${totalCount} (${((totalCount - nullSpreads) / totalCount * 100).toFixed(1)}% complete)`);
    console.log(`   Missing leverage: ${nullLeverage}/${totalCount} (${((totalCount - nullLeverage) / totalCount * 100).toFixed(1)}% complete)`);
    
    // Show some examples of missing data
    if (nullSpreads > 0) {
      const { data: missingSpreads } = await supabase
        .from('brokers')
        .select('name')
        .is('spreads_avg', null)
        .limit(5);
      
      console.log(`\n🔍 Brokers missing spreads (first 5):`);
      missingSpreads?.forEach(broker => console.log(`   - ${broker.name}`));
    }
    
    if (nullLeverage > 0) {
      const { data: missingLeverage } = await supabase
        .from('brokers')
        .select('name')
        .is('leverage_max', null)
        .limit(5);
      
      console.log(`\n🔍 Brokers missing leverage (first 5):`);
      missingLeverage?.forEach(broker => console.log(`   - ${broker.name}`));
    }
    
  } catch (error) {
    console.error('Check failed:', error);
  }
}

checkAllSpreadsLeverage();