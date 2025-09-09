require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateCryptoComYear() {
  try {
    console.log('Updating Crypto.com founding year...');
    
    // Update Crypto.com with correct founding year
    const { data, error } = await supabase
      .from('brokers')
      .update({ established_year: 2016 })
      .eq('name', 'Crypto.com')
      .select();
    
    if (error) {
      console.error('Error updating Crypto.com:', error);
      return;
    }
    
    console.log('Successfully updated Crypto.com:');
    console.log(data);
    
    // Verify the update
    const { data: verification, error: verifyError } = await supabase
      .from('brokers')
      .select('name, established_year')
      .eq('name', 'Crypto.com');
    
    if (verifyError) {
      console.error('Error verifying update:', verifyError);
      return;
    }
    
    console.log('\nVerification - Crypto.com data:');
    console.log(verification);
    
  } catch (error) {
    console.error('Script error:', error);
  }
}

updateCryptoComYear();