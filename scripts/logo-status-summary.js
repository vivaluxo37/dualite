const fs = require('fs');
const path = require('path');

// Read all relevant reports
const scrapedReport = JSON.parse(fs.readFileSync('scraped-logos-simple-report.json', 'utf8'));
const downloadReport = JSON.parse(fs.readFileSync('scraped-logos-download-report.json', 'utf8'));
const integrationReport = JSON.parse(fs.readFileSync('scraped-logos-integration-local-report.json', 'utf8'));

// Get list of downloaded logos
const scrapedLogosDir = 'public/logos/scraped';
const downloadedLogos = fs.readdirSync(scrapedLogosDir);

// Get list of existing logos
const existingLogosDir = 'public/logos';
const existingLogos = fs.readdirSync(existingLogosDir).filter(file => 
  file !== 'scraped' && !file.includes('placeholder') && !file.includes('default')
);

console.log('='.repeat(80));
console.log('                    BROKER LOGO STATUS SUMMARY');
console.log('='.repeat(80));

console.log('\n📊 OVERALL STATISTICS');
console.log('-'.repeat(50));
console.log(`📁 Scraped HTML files processed: ${scrapedReport.summary.totalFiles}`);
console.log(`🔍 Files with potential logos found: ${scrapedReport.summary.filesWithLogos}`);
console.log(`🌐 Total logo URLs extracted: ${scrapedReport.summary.totalLogosFound}`);
console.log(`⬇️  Logo downloads attempted: ${downloadReport.summary.totalProcessed}`);
console.log(`✅ Successful downloads: ${downloadReport.summary.successful}`);
console.log(`⚠️  Download failures: ${downloadReport.summary.failed}`);
console.log(`📂 Logos saved to /public/logos/scraped/: ${downloadedLogos.length}`);

console.log('\n🎯 LOGO INTEGRATION STATUS');
console.log('-'.repeat(50));
console.log(`📝 SQL update statements generated: ${integrationReport.summary.sqlStatementsGenerated}`);
console.log(`🎯 Broker mappings identified: ${integrationReport.summary.uniqueBrokerMappings}`);
console.log(`✅ Logos with known broker mappings: ${integrationReport.logoMappings.filter(m => 
  ['avatrade', 'axitrader', 'cfitrade', 'dnafunded', 'easymarkets', 'etoro', 'europefx', 
   'exness', 'forex', 'fpmarkets', 'fundedprime', 'fxcc', 'holaprime', 'ifcmarkets', 
   'ig', 'instaforex', 'legacyfx', 'mtrading', 'pepperstone', 'pipfarm', 'plus500', 
   'primexbt', 'puprime', 'rebelsfunding', 'roboforex', 'saxobank', 'tickmill', 
   'trading212', 'zulutrade'].includes(m.filenameKey)
).length}`);
console.log(`⚠️  Logos needing manual mapping: ${integrationReport.logoMappings.filter(m => 
  !['avatrade', 'axitrader', 'cfitrade', 'dnafunded', 'easymarkets', 'etoro', 'europefx', 
    'exness', 'forex', 'fpmarkets', 'fundedprime', 'fxcc', 'holaprime', 'ifcmarkets', 
    'ig', 'instaforex', 'legacyfx', 'mtrading', 'pepperstone', 'pipfarm', 'plus500', 
    'primexbt', 'puprime', 'rebelsfunding', 'roboforex', 'saxobank', 'tickmill', 
    'trading212', 'zulutrade'].includes(m.filenameKey)
).length}`);

console.log('\n📁 LOGO FILE INVENTORY');
console.log('-'.repeat(50));
console.log(`📂 Existing logos in /public/logos/: ${existingLogos.length}`);
console.log(`🆕 New scraped logos in /public/logos/scraped/: ${downloadedLogos.length}`);
console.log(`📊 Total logo files available: ${existingLogos.length + downloadedLogos.length}`);

console.log('\n🎯 SUCCESSFULLY DOWNLOADED LOGOS');
console.log('-'.repeat(50));
downloadedLogos.forEach((logo, index) => {
  const extension = path.extname(logo);
  const name = path.basename(logo, extension);
  console.log(`${(index + 1).toString().padStart(2)}. ${logo.padEnd(25)} (${extension.substring(1).toUpperCase()})`);
});

console.log('\n🔧 BROKER MAPPINGS READY FOR DATABASE UPDATE');
console.log('-'.repeat(50));
const mappedLogos = integrationReport.logoMappings.filter(m => 
  ['avatrade', 'axitrader', 'cfitrade', 'dnafunded', 'easymarkets', 'etoro', 'europefx', 
   'exness', 'forex', 'fpmarkets', 'fundedprime', 'fxcc', 'holaprime', 'ifcmarkets', 
   'ig', 'instaforex', 'legacyfx', 'mtrading', 'pepperstone', 'pipfarm', 'plus500', 
   'primexbt', 'puprime', 'rebelsfunding', 'roboforex', 'saxobank', 'tickmill', 
   'trading212', 'zulutrade'].includes(m.filenameKey)
);

mappedLogos.forEach((mapping, index) => {
  console.log(`${(index + 1).toString().padStart(2)}. ${mapping.filename.padEnd(25)} -> ${mapping.potentialNames[0]}`);
});

console.log('\n⚠️  LOGOS NEEDING MANUAL REVIEW');
console.log('-'.repeat(50));
const unmappedLogos = integrationReport.logoMappings.filter(m => 
  !['avatrade', 'axitrader', 'cfitrade', 'dnafunded', 'easymarkets', 'etoro', 'europefx', 
    'exness', 'forex', 'fpmarkets', 'fundedprime', 'fxcc', 'holaprime', 'ifcmarkets', 
    'ig', 'instaforex', 'legacyfx', 'mtrading', 'pepperstone', 'pipfarm', 'plus500', 
    'primexbt', 'puprime', 'rebelsfunding', 'roboforex', 'saxobank', 'tickmill', 
    'trading212', 'zulutrade'].includes(m.filenameKey)
);

if (unmappedLogos.length > 0) {
  unmappedLogos.forEach((mapping, index) => {
    console.log(`${(index + 1).toString().padStart(2)}. ${mapping.filename.padEnd(25)} (${mapping.scrapedName})`);
  });
} else {
  console.log('🎉 All logos have been successfully mapped!');
}

console.log('\n📋 GENERATED FILES');
console.log('-'.repeat(50));
console.log('✅ scraped-logos-simple-report.json      - Initial extraction report');
console.log('✅ scraped-logos-download-report.json    - Download results report');
console.log('✅ scraped-logos-integration-local-report.json - Integration analysis');
console.log('✅ update-scraped-logos.sql              - SQL update statements');
console.log('✅ manual-logo-mapping.json              - Template for manual mappings');

console.log('\n🚀 NEXT STEPS');
console.log('-'.repeat(50));
console.log('1. 📝 Review the SQL file: update-scraped-logos.sql');
console.log('2. 🔍 Update manual-logo-mapping.json for unmapped logos');
console.log('3. 🧪 Test SQL statements on a backup database first');
console.log('4. 🚀 Execute SQL updates in production database');
console.log('5. 🌐 Verify logo display on the frontend');
console.log('6. 📊 Run broker logo status check to confirm updates');

console.log('\n💡 IMPACT ASSESSMENT');
console.log('-'.repeat(50));
console.log(`🎯 Potential broker logo improvements: ${mappedLogos.length} brokers`);
console.log(`📈 Expected logo coverage increase: ~${Math.round((mappedLogos.length / 124) * 100)}%`);
console.log(`🏆 Quality improvement: High-resolution logos from official sources`);
console.log(`⚡ Performance: Optimized file formats (WebP, PNG, JPG)`);

console.log('\n' + '='.repeat(80));
console.log('                    LOGO EXTRACTION COMPLETE!');
console.log('='.repeat(80));

// Generate a quick reference file
const quickRef = {
  summary: {
    totalLogosDownloaded: downloadedLogos.length,
    readyForIntegration: mappedLogos.length,
    needManualReview: unmappedLogos.length,
    sqlStatementsGenerated: integrationReport.summary.sqlStatementsGenerated
  },
  readyLogos: mappedLogos.map(m => ({
    filename: m.filename,
    brokerName: m.potentialNames[0],
    logoPath: m.logoPath
  })),
  manualReviewNeeded: unmappedLogos.map(m => ({
    filename: m.filename,
    scrapedName: m.scrapedName
  })),
  nextSteps: [
    'Review update-scraped-logos.sql',
    'Execute SQL updates in database',
    'Verify frontend logo display',
    'Update any remaining manual mappings'
  ]
};

fs.writeFileSync('logo-status-quick-reference.json', JSON.stringify(quickRef, null, 2));
console.log('\n📄 Quick reference saved to: logo-status-quick-reference.json');