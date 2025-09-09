const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://efxpwrnxdorgzcqhbnfn.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAzMzIzNSwiZXhwIjoyMDcyNjA5MjM1fQ.BKmSaW8dSc6soQZOh7zZGXMNO-evJZkSbLVJzxoYSYA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateTDAmeritrade() {
  try {
    console.log('Updating TD Ameritrade established_year from 19 to 1975...');
    
    // Update TD Ameritrade's established_year
    const { data, error } = await supabase
      .from('brokers')
      .update({ established_year: 1975 })
      .eq('name', 'TD Ameritrade')
      .select();
    
    if (error) {
      console.error('Error updating TD Ameritrade:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('✅ Successfully updated TD Ameritrade:');
      console.log(`   Name: ${data[0].name}`);
      console.log(`   Established Year: ${data[0].established_year}`);
    } else {
      console.log('❌ No TD Ameritrade broker found to update');
    }
    
    // Verify the update
    const { data: verification, error: verifyError } = await supabase
      .from('brokers')
      .select('name, established_year')
      .eq('name', 'TD Ameritrade')
      .single();
    
    if (verifyError) {
      console.error('Error verifying update:', verifyError);
      return;
    }
    
    console.log('\n🔍 Verification:');
    console.log(`   TD Ameritrade established_year: ${verification.established_year}`);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

updateTDAmeritrade();