const fs = require('fs');
const path = require('path');

// Read the download report
const reportPath = 'scraped-logos-download-report.json';
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

// Get list of downloaded logos
const scrapedLogosDir = 'public/logos/scraped';
const downloadedLogos = fs.readdirSync(scrapedLogosDir);

console.log(`Found ${downloadedLogos.length} downloaded logos`);

// Function to normalize broker names for matching
function normalizeName(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/ltd|limited|inc|corp|group|markets|trading|forex|fx/g, '')
    .trim();
}

// Common broker name mappings
const brokerMappings = {
  'avatrade': ['AvaTrade', 'Ava Trade', 'Ava Capital'],
  'etoro': ['eToro', 'E Toro'],
  'forex': ['Forex.com', 'FOREX.com'],
  'ig': ['IG', 'IG Group', 'IG Markets'],
  'plus500': ['Plus500', 'Plus 500'],
  'saxobank': ['Saxo Bank', 'Saxo'],
  'trading212': ['Trading 212', 'Trading212'],
  'instaforex': ['InstaForex', 'Insta Forex'],
  'roboforex': ['RoboForex', 'Robo Forex'],
  'exness': ['Exness', 'Exness Group'],
  'pepperstone': ['Pepperstone', 'Pepper Stone'],
  'tickmill': ['Tickmill', 'Tick Mill'],
  'fxcc': ['FXCC', 'FX CC', 'FXCentral Clearing'],
  'primexbt': ['PrimeXBT', 'Prime XBT'],
  'europefx': ['EuropeFX', 'Europe FX'],
  'easymarkets': ['EasyMarkets', 'Easy Markets'],
  'mtrading': ['MTrading', 'M Trading'],
  'axitrader': ['AxiTrader', 'Axi Trader'],
  'fpmarkets': ['FP Markets', 'First Prudential Markets'],
  'puprime': ['PU Prime'],
  'ifcmarkets': ['IFC Markets'],
  'cfitrade': ['CFI Trade'],
  'zulutrade': ['ZuluTrade', 'Zulu Trade'],
  'legacyfx': ['Legacy FX'],
  'holaprime': ['Hola Prime'],
  'dnafunded': ['DNA Funded'],
  'fundedprime': ['Funded Prime'],
  'rebelsfunding': ['Rebels Funding'],
  'pipfarm': ['PipFarm', 'Pip Farm']
};

// Function to get filename without extension
function getFilenameKey(filename) {
  return path.parse(filename).name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Main integration function
function generateLogoUpdates() {
  console.log('Generating logo update statements from scraped data...');
  
  const results = [];
  const sqlStatements = [];
  
  // Process successful downloads from report
  const successfulDownloads = report.downloads.filter(d => d.status === 'success');
  
  console.log(`\nProcessing ${successfulDownloads.length} successful downloads...\n`);
  
  for (const download of successfulDownloads) {
    const scrapedName = download.brokerName;
    const filename = download.filename;
    const logoPath = `/logos/scraped/${filename}`;
    const filenameKey = getFilenameKey(filename);
    
    console.log(`--- Processing ${scrapedName} (${filename}) ---`);
    
    // Find potential broker names from mappings
    let potentialNames = [];
    
    if (brokerMappings[filenameKey]) {
      potentialNames = brokerMappings[filenameKey];
      console.log(`  ✅ Found mapping: ${potentialNames.join(', ')}`);
    } else {
      // Generate potential names from scraped name
      potentialNames = [
        scrapedName,
        scrapedName.replace(/[-_]/g, ' '),
        scrapedName.replace(/[-_]/g, ''),
        scrapedName.split(/[-_]/).map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        scrapedName.split(/[-_]/).map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join('')
      ];
      console.log(`  ⚠️  No mapping found, generated: ${potentialNames.join(', ')}`);
    }
    
    // Generate SQL update statements for each potential name
    for (const brokerName of potentialNames) {
      const sqlStatement = `UPDATE brokers SET logo_url = '${logoPath}' WHERE LOWER(name) LIKE '%${brokerName.toLowerCase()}%' AND (logo_url IS NULL OR logo_url LIKE '%placeholder%' OR logo_url LIKE '%default%');`;
      sqlStatements.push({
        brokerName,
        filename,
        sql: sqlStatement
      });
    }
    
    results.push({
      scrapedName,
      filename,
      logoPath,
      potentialNames,
      filenameKey
    });
  }
  
  // Generate comprehensive SQL file
  const sqlContent = `-- Logo Update Statements Generated from Scraped Data
-- Generated on: ${new Date().toISOString()}
-- Total logos processed: ${successfulDownloads.length}

-- Instructions:
-- 1. Review each UPDATE statement carefully
-- 2. Test on a backup database first
-- 3. Execute statements one by one or in batches
-- 4. Verify results after execution

${sqlStatements.map((stmt, index) => 
  `-- ${index + 1}. ${stmt.brokerName} (${stmt.filename})\n${stmt.sql}\n`
).join('\n')}

-- Verification queries:
-- Check updated logos:
SELECT name, logo_url FROM brokers WHERE logo_url LIKE '/logos/scraped/%' ORDER BY name;

-- Check remaining placeholders:
SELECT name, logo_url FROM brokers WHERE (logo_url IS NULL OR logo_url LIKE '%placeholder%' OR logo_url LIKE '%default%') ORDER BY name;

-- Count logos by type:
SELECT 
  CASE 
    WHEN logo_url LIKE '/logos/scraped/%' THEN 'Scraped Logo'
    WHEN logo_url LIKE '/logos/%' AND logo_url NOT LIKE '%placeholder%' AND logo_url NOT LIKE '%default%' THEN 'Existing Logo'
    ELSE 'Placeholder/Default'
  END as logo_type,
  COUNT(*) as count
FROM brokers 
GROUP BY logo_type;
`;
  
  fs.writeFileSync('update-scraped-logos.sql', sqlContent);
  
  // Generate integration report
  const integrationReport = {
    timestamp: new Date().toISOString(),
    summary: {
      totalLogosProcessed: successfulDownloads.length,
      sqlStatementsGenerated: sqlStatements.length,
      uniqueBrokerMappings: results.length
    },
    logoMappings: results,
    sqlStatements: sqlStatements
  };
  
  fs.writeFileSync('scraped-logos-integration-local-report.json', JSON.stringify(integrationReport, null, 2));
  
  // Generate manual mapping file for unmatched logos
  const manualMappingTemplate = {
    instructions: "Update the 'correctBrokerName' field for each logo with the exact broker name from your database",
    unmappedLogos: results.filter(r => !brokerMappings[r.filenameKey]).map(r => ({
      filename: r.filename,
      scrapedName: r.scrapedName,
      correctBrokerName: "UPDATE_THIS_FIELD",
      logoPath: r.logoPath
    }))
  };
  
  fs.writeFileSync('manual-logo-mapping.json', JSON.stringify(manualMappingTemplate, null, 2));
  
  console.log('\n=== GENERATION COMPLETE ===');
  console.log(`✅ Generated SQL file: update-scraped-logos.sql`);
  console.log(`✅ Generated report: scraped-logos-integration-local-report.json`);
  console.log(`✅ Generated manual mapping template: manual-logo-mapping.json`);
  
  console.log('\n=== BROKER MAPPINGS FOUND ===');
  results.forEach(r => {
    if (brokerMappings[r.filenameKey]) {
      console.log(`✅ ${r.filename} -> ${brokerMappings[r.filenameKey].join(', ')}`);
    }
  });
  
  console.log('\n=== UNMAPPED LOGOS (Need Manual Review) ===');
  results.forEach(r => {
    if (!brokerMappings[r.filenameKey]) {
      console.log(`⚠️  ${r.filename} (${r.scrapedName})`);
    }
  });
  
  console.log('\n=== NEXT STEPS ===');
  console.log('1. Review update-scraped-logos.sql file');
  console.log('2. Update manual-logo-mapping.json for unmapped logos');
  console.log('3. Test SQL statements on backup database');
  console.log('4. Execute SQL updates in production');
  console.log('5. Verify logo display on frontend');
  
  return integrationReport;
}

// Run the generation
generateLogoUpdates();