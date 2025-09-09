const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

async function verifyLogoUploads() {
  console.log('🔍 Verifying logo upload results...');
  
  try {
    // Get all brokers
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('id, name, slug, logo_url')
      .order('name');

    if (error) {
      console.error('❌ Error fetching brokers:', error);
      return;
    }

    console.log(`\n📊 Total brokers: ${brokers.length}`);
    
    // Categorize brokers by logo status
    const withRealLogos = brokers.filter(b => b.logo_url && !b.logo_url.includes('default-logo.png'));
    const withDefaultLogos = brokers.filter(b => b.logo_url && b.logo_url.includes('default-logo.png'));
    const withoutLogos = brokers.filter(b => !b.logo_url || b.logo_url.trim() === '');
    
    console.log(`\n✅ Brokers with real logos: ${withRealLogos.length}`);
    console.log(`🔄 Brokers with default logos: ${withDefaultLogos.length}`);
    console.log(`❌ Brokers without logos: ${withoutLogos.length}`);
    
    // Show some examples of brokers with real logos
    if (withRealLogos.length > 0) {
      console.log('\n📋 Sample brokers with real logos:');
      withRealLogos.slice(0, 10).forEach(broker => {
        console.log(`  • ${broker.name}: ${broker.logo_url}`);
      });
    }
    
    // Show brokers still needing logos
    if (withDefaultLogos.length > 0) {
      console.log('\n⚠️  Brokers still with default logos:');
      withDefaultLogos.slice(0, 10).forEach(broker => {
        console.log(`  • ${broker.name}`);
      });
      if (withDefaultLogos.length > 10) {
        console.log(`  ... and ${withDefaultLogos.length - 10} more`);
      }
    }
    
    console.log('\n=== VERIFICATION COMPLETE ===');
    console.log(`Logo upload success rate: ${((withRealLogos.length / brokers.length) * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

verifyLogoUploads();