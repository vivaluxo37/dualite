const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const supabaseUrl = 'https://efxpwrnxdorgzcqhbnfn.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAzMzIzNSwiZXhwIjoyMDcyNjA5MjM1fQ.BKmSaW8dSc6soQZOh7zZGXMNO-evJZkSbLVJzxoYSYA';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Logo mapping from broker names to actual logo files
const logoMapping = {
  'IG Markets': '/logos/scraped/ig.webp',
  'IG': '/logos/scraped/ig.webp',
  'XM Group': '/logos/scraped/forex.jpeg', // Using generic forex logo for XM
  'XM': '/logos/scraped/forex.jpeg',
  'FXTM': '/logos/scraped/forex.jpeg', // Using generic forex logo for FXTM
  'Pepperstone': '/logos/scraped/pepperstone.webp',
  'Exness': '/logos/scraped/exness.webp',
  'eToro': '/logos/scraped/etoro.jpg',
  'Plus500': '/logos/scraped/plus500.jpeg',
  'AvaTrade': '/logos/scraped/avatrade.jpg',
  'AxiTrader': '/logos/scraped/axitrader.webp',
  'EasyMarkets': '/logos/scraped/easymarkets.png',
  'EuropeFX': '/logos/scraped/europefx.jpg',
  'FP Markets': '/logos/scraped/fp-markets.webp',
  'FXCC': '/logos/scraped/fxcc.jpg',
  'IFC Markets': '/logos/scraped/ifc-markets.webp',
  'InstaForex': '/logos/scraped/instaforex.png',
  'MTrading': '/logos/scraped/mtrading.jpg',
  'PrimeXBT': '/logos/scraped/primexbt.webp',
  'RoboForex': '/logos/scraped/roboforex.webp',
  'Saxo Bank': '/logos/scraped/saxo-bank.png',
  'Tickmill': '/logos/scraped/tickmill.png',
  'Trading 212': '/logos/scraped/trading-212.png',
  'ZuluTrade': '/logos/scraped/zulutrade.png'
};

async function fixLogoUrls() {
  try {
    console.log('🔍 Fetching brokers with placeholder logo URLs...');
    
    // Get all brokers with example.com logo URLs
    const { data: brokers, error: fetchError } = await supabase
      .from('brokers')
      .select('id, name, slug, logo_url')
      .like('logo_url', '%example.com%');
    
    if (fetchError) {
      throw fetchError;
    }
    
    console.log(`📊 Found ${brokers.length} brokers with placeholder logos`);
    
    let updatedCount = 0;
    let notFoundCount = 0;
    
    for (const broker of brokers) {
      console.log(`\n🔧 Processing: ${broker.name}`);
      
      // Try to find a matching logo
      let newLogoUrl = null;
      
      // Direct name match
      if (logoMapping[broker.name]) {
        newLogoUrl = logoMapping[broker.name];
      } else {
        // Try partial matches
        const brokerNameLower = broker.name.toLowerCase();
        for (const [mappedName, logoPath] of Object.entries(logoMapping)) {
          if (brokerNameLower.includes(mappedName.toLowerCase()) || 
              mappedName.toLowerCase().includes(brokerNameLower)) {
            newLogoUrl = logoPath;
            break;
          }
        }
      }
      
      if (newLogoUrl) {
        // Update the broker with the new logo URL
        const { error: updateError } = await supabase
          .from('brokers')
          .update({ logo_url: newLogoUrl })
          .eq('id', broker.id);
        
        if (updateError) {
          console.error(`❌ Failed to update ${broker.name}:`, updateError.message);
        } else {
          console.log(`✅ Updated ${broker.name}: ${broker.logo_url} → ${newLogoUrl}`);
          updatedCount++;
        }
      } else {
        console.log(`⚠️  No logo found for ${broker.name}`);
        notFoundCount++;
        
        // Set to null to remove the broken placeholder
        const { error: updateError } = await supabase
          .from('brokers')
          .update({ logo_url: null })
          .eq('id', broker.id);
        
        if (updateError) {
          console.error(`❌ Failed to clear logo for ${broker.name}:`, updateError.message);
        } else {
          console.log(`🗑️  Cleared placeholder logo for ${broker.name}`);
        }
      }
    }
    
    console.log('\n📈 Summary:');
    console.log(`✅ Updated: ${updatedCount} brokers`);
    console.log(`⚠️  Not found: ${notFoundCount} brokers`);
    console.log(`📊 Total processed: ${brokers.length} brokers`);
    
  } catch (error) {
    console.error('❌ Error fixing logo URLs:', error.message);
    process.exit(1);
  }
}

// Run the script
fixLogoUrls().then(() => {
  console.log('\n🎉 Logo URL fix completed!');
  process.exit(0);
});