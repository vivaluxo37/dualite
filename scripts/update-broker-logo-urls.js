const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://efxpwrnxdorgzcqhbnfn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMzMyMzUsImV4cCI6MjA3MjYwOTIzNX0.q2qAWQgNE1lTCTA8MBdzeNCm5rtL5a_7o4E1Hf_tmzQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Logo URL mapping for local files
const logoUrlMapping = {
  'FXTM': '/broker-logos/fxtm.webp',
  'IG Group': '/broker-logos/ig-group.webp',
  'OANDA': '/broker-logos/oanda.png',
  'Pepperstone': '/broker-logos/pepperstone.webp',
  'IC Markets': '/broker-logos/ic-markets.png',
  'Plus500': '/broker-logos/plus500.webp',
  'FP Markets': '/broker-logos/fp-markets.png',
  'Admirals': '/broker-logos/admirals.png',
  'AvaTrade': '/broker-logos/avatrade.webp',
  'Exness': '/broker-logos/exness.webp',
  'XM Group': '/broker-logos/xm-group.webp',
  'Forex.com': '/broker-logos/forex.com.png',
  'Saxo Bank': '/broker-logos/saxo-bank.png',
  'Tickmill': '/broker-logos/tickmill.png',
  'XM': '/broker-logos/xm.webp',
  'IG Markets': '/broker-logos/ig-markets.webp',
  'HotForex': '/broker-logos/hotforex.png',
  'CMC Markets': '/broker-logos/cmc-markets.png'
};

async function updateBrokerLogos() {
  console.log('🚀 Updating broker logo URLs in database...');
  console.log('========================================');
  
  try {
    // Fetch all brokers
    const { data: brokers, error: fetchError } = await supabase
      .from('brokers')
      .select('id, name, logo_url');
    
    if (fetchError) {
      console.error('❌ Error fetching brokers:', fetchError);
      return;
    }
    
    console.log(`📊 Found ${brokers.length} brokers in database`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    // Update each broker with their logo URL
    for (const broker of brokers) {
      const logoUrl = logoUrlMapping[broker.name];
      
      if (logoUrl) {
        try {
          const { error: updateError } = await supabase
            .from('brokers')
            .update({ 
              logo_url: logoUrl,
              updated_at: new Date().toISOString()
            })
            .eq('id', broker.id);
          
          if (updateError) {
            console.error(`❌ Error updating ${broker.name}:`, updateError.message);
          } else {
            console.log(`✅ Updated ${broker.name}: ${broker.logo_url} → ${logoUrl}`);
            updatedCount++;
          }
        } catch (error) {
          console.error(`❌ Error updating ${broker.name}:`, error.message);
        }
      } else {
        console.log(`⚠️  No logo mapping found for ${broker.name}`);
        skippedCount++;
      }
    }
    
    console.log('\n📋 Summary:');
    console.log('==========');
    console.log(`✅ Successfully updated: ${updatedCount} brokers`);
    console.log(`⚠️  Skipped: ${skippedCount} brokers`);
    console.log(`📊 Total brokers: ${brokers.length}`);
    
    // Verify the updates
    console.log('\n🔍 Verifying updates...');
    const { data: updatedBrokers, error: verifyError } = await supabase
      .from('brokers')
      .select('name, logo_url')
      .in('name', Object.keys(logoUrlMapping));
    
    if (verifyError) {
      console.error('❌ Error verifying updates:', verifyError);
    } else {
      console.log('✅ Updated broker logo URLs:');
      updatedBrokers.forEach(broker => {
        console.log(`   ${broker.name}: ${broker.logo_url}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

// Run the update
updateBrokerLogos().catch(console.error);