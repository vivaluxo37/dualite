const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

async function generateLogoSummary() {
  console.log('📋 Generating comprehensive logo upload summary...');
  
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

    // Categorize brokers
    const withRealLogos = brokers.filter(b => b.logo_url && !b.logo_url.includes('default-logo.png'));
    const withDefaultLogos = brokers.filter(b => b.logo_url && b.logo_url.includes('default-logo.png'));
    const withoutLogos = brokers.filter(b => !b.logo_url || b.logo_url.trim() === '');
    
    // Get available logo files
    const logoDir = 'c:/Users/LENOVO/Desktop/dualite/Broker reviews │ BrokerChooser';
    const logoFiles = fs.readdirSync(logoDir).filter(file => 
      file.toLowerCase().match(/\.(png|jpg|jpeg|webp|gif)$/)
    );
    
    console.log('\n=== LOGO UPLOAD SUMMARY ===');
    console.log(`📊 Total brokers: ${brokers.length}`);
    console.log(`✅ Brokers with real logos: ${withRealLogos.length} (${((withRealLogos.length / brokers.length) * 100).toFixed(1)}%)`);
    console.log(`🔄 Brokers with default logos: ${withDefaultLogos.length} (${((withDefaultLogos.length / brokers.length) * 100).toFixed(1)}%)`);
    console.log(`❌ Brokers without logos: ${withoutLogos.length}`);
    console.log(`📁 Available logo files: ${logoFiles.length}`);
    
    // Create detailed report
    const report = {
      summary: {
        totalBrokers: brokers.length,
        brokersWithRealLogos: withRealLogos.length,
        brokersWithDefaultLogos: withDefaultLogos.length,
        brokersWithoutLogos: withoutLogos.length,
        successRate: `${((withRealLogos.length / brokers.length) * 100).toFixed(1)}%`,
        availableLogoFiles: logoFiles.length
      },
      brokersWithRealLogos: withRealLogos.map(b => ({
        name: b.name,
        slug: b.slug,
        logoUrl: b.logo_url
      })),
      brokersNeedingLogos: withDefaultLogos.map(b => ({
        name: b.name,
        slug: b.slug,
        currentLogo: b.logo_url
      }))
    };
    
    // Save report to file
    fs.writeFileSync(
      'logo-upload-report.json', 
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n📄 Detailed report saved to: logo-upload-report.json');
    
    // Show top successful matches
    console.log('\n🎯 Successfully matched brokers:');
    withRealLogos.slice(0, 15).forEach((broker, index) => {
      console.log(`${(index + 1).toString().padStart(2)}. ${broker.name}`);
    });
    
    if (withRealLogos.length > 15) {
      console.log(`    ... and ${withRealLogos.length - 15} more`);
    }
    
    // Show brokers still needing logos
    console.log('\n⚠️  Brokers still needing logos (first 20):');
    withDefaultLogos.slice(0, 20).forEach((broker, index) => {
      console.log(`${(index + 1).toString().padStart(2)}. ${broker.name}`);
    });
    
    if (withDefaultLogos.length > 20) {
      console.log(`    ... and ${withDefaultLogos.length - 20} more`);
    }
    
    console.log('\n=== NEXT STEPS ===');
    console.log('1. Review logo-upload-report.json for detailed analysis');
    console.log('2. Manually match remaining brokers with available logo files');
    console.log('3. Consider adding more logo files for unmatched brokers');
    console.log('4. Update manual mappings in upload script for better matching');
    
  } catch (error) {
    console.error('❌ Summary generation failed:', error);
  }
}

generateLogoSummary();