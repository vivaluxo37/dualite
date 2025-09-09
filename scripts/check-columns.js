const { createClient } = require('@supabase/supabase-js');

// Use actual environment variables
const supabase = createClient(
  'https://efxpwrnxdorgzcqhbnfn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAzMzIzNSwiZXhwIjoyMDcyNjA5MjM1fQ.BKmSaW8dSc6soQZOh7zZGXMNO-evJZkSbLVJzxoYSYA'
);

async function checkColumns() {
  console.log('🔍 Checking available columns in brokers table...');
  
  try {
    const { data, error } = await supabase
      .from('brokers')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('\n📋 Available columns:');
      const columns = Object.keys(data[0]);
      columns.forEach(col => console.log(`   - ${col}`));
      
      console.log('\n🔍 Spread/Leverage related columns:');
      const spreadLeverageColumns = columns.filter(col => 
        col.toLowerCase().includes('spread') || 
        col.toLowerCase().includes('leverage') ||
        col.toLowerCase().includes('pip')
      );
      
      if (spreadLeverageColumns.length > 0) {
        spreadLeverageColumns.forEach(col => console.log(`   - ${col}`));
      } else {
        console.log('   - No spread/leverage columns found');
      }
    } else {
      console.log('No data found in brokers table');
    }
    
  } catch (error) {
    console.error('Check failed:', error);
  }
}

checkColumns();