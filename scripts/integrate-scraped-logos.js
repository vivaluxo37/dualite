const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

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

// Function to find best broker match
function findBrokerMatch(scrapedName, brokers) {
  const normalizedScraped = normalizeName(scrapedName);
  
  // Try exact match first
  let match = brokers.find(broker => 
    normalizeName(broker.name) === normalizedScraped
  );
  
  if (match) return match;
  
  // Try partial matches
  match = brokers.find(broker => {
    const normalizedBroker = normalizeName(broker.name);
    return normalizedBroker.includes(normalizedScraped) || 
           normalizedScraped.includes(normalizedBroker);
  });
  
  if (match) return match;
  
  // Try common name variations
  const variations = {
    'avatrade': ['ava trade', 'ava capital'],
    'etoro': ['e toro'],
    'forex': ['forex.com'],
    'ig': ['ig group', 'ig markets'],
    'plus500': ['plus 500'],
    'saxobank': ['saxo bank', 'saxo'],
    'trading212': ['trading 212'],
    'instaforex': ['insta forex'],
    'roboforex': ['robo forex'],
    'exness': ['exness group'],
    'pepperstone': ['pepper stone'],
    'tickmill': ['tick mill'],
    'fxcc': ['fx cc', 'fxcentral clearing'],
    'primexbt': ['prime xbt'],
    'europefx': ['europe fx'],
    'easymarkets': ['easy markets'],
    'mtrading': ['m trading'],
    'axitrader': ['axi trader'],
    'fpmarkets': ['fp markets', 'first prudential markets'],
    'puprime': ['pu prime'],
    'ifcmarkets': ['ifc markets'],
    'cfitrade': ['cfi trade'],
    'zulutrade': ['zulu trade'],
    'legacyfx': ['legacy fx'],
    'holaprime': ['hola prime'],
    'dnafunded': ['dna funded'],
    'fundedprime': ['funded prime'],
    'rebelsfunding': ['rebels funding'],
    'pipfarm': ['pip farm']
  };
  
  for (const [key, variants] of Object.entries(variations)) {
    if (normalizedScraped.includes(key) || key.includes(normalizedScraped)) {
      match = brokers.find(broker => {
        const normalizedBroker = normalizeName(broker.name);
        return variants.some(variant => 
          normalizedBroker.includes(normalizeName(variant)) ||
          normalizeName(variant).includes(normalizedBroker)
        );
      });
      if (match) return match;
    }
  }
  
  return null;
}

// Main integration function
async function integrateScrapedLogos() {
  try {
    console.log('Integrating scraped logos into broker database...');
    
    // Fetch all brokers from database
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('id, name, logo_url');
    
    if (error) {
      throw new Error(`Error fetching brokers: ${error.message}`);
    }
    
    console.log(`Found ${brokers.length} brokers in database`);
    
    const results = [];
    let updateCount = 0;
    let skipCount = 0;
    let noMatchCount = 0;
    
    // Process successful downloads from report
    const successfulDownloads = report.downloads.filter(d => d.status === 'success');
    
    for (const download of successfulDownloads) {
      const scrapedName = download.brokerName;
      const filename = download.filename;
      const logoPath = `/logos/scraped/${filename}`;
      
      console.log(`\n--- Processing ${scrapedName} ---`);
      
      // Find matching broker in database
      const matchedBroker = findBrokerMatch(scrapedName, brokers);
      
      if (!matchedBroker) {
        console.log(`  ❌ No matching broker found in database`);
        results.push({
          scrapedName,
          filename,
          status: 'no_match',
          reason: 'No matching broker in database'
        });
        noMatchCount++;
        continue;
      }
      
      console.log(`  ✅ Matched with: ${matchedBroker.name} (ID: ${matchedBroker.id})`);
      
      // Check if broker already has a real logo (not default)
      if (matchedBroker.logo_url && 
          !matchedBroker.logo_url.includes('placeholder') &&
          !matchedBroker.logo_url.includes('default')) {
        console.log(`  ⚠️  Broker already has logo: ${matchedBroker.logo_url}`);
        results.push({
          scrapedName,
          filename,
          matchedBroker: matchedBroker.name,
          brokerId: matchedBroker.id,
          status: 'skipped',
          reason: 'Broker already has real logo',
          existingLogo: matchedBroker.logo_url
        });
        skipCount++;
        continue;
      }
      
      // Update broker with new logo
      const { error: updateError } = await supabase
        .from('brokers')
        .update({ logo_url: logoPath })
        .eq('id', matchedBroker.id);
      
      if (updateError) {
        console.log(`  ❌ Failed to update: ${updateError.message}`);
        results.push({
          scrapedName,
          filename,
          matchedBroker: matchedBroker.name,
          brokerId: matchedBroker.id,
          status: 'error',
          reason: updateError.message
        });
      } else {
        console.log(`  ✅ Updated logo: ${logoPath}`);
        results.push({
          scrapedName,
          filename,
          matchedBroker: matchedBroker.name,
          brokerId: matchedBroker.id,
          status: 'updated',
          newLogoPath: logoPath,
          previousLogo: matchedBroker.logo_url
        });
        updateCount++;
      }
      
      // Small delay to be respectful to database
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Generate summary report
    console.log('\n=== INTEGRATION SUMMARY ===');
    console.log(`Total scraped logos processed: ${successfulDownloads.length}`);
    console.log(`Successfully updated: ${updateCount}`);
    console.log(`Skipped (already have logos): ${skipCount}`);
    console.log(`No database match found: ${noMatchCount}`);
    
    // Save detailed integration report
    const integrationReport = {
      timestamp: new Date().toISOString(),
      summary: {
        totalProcessed: successfulDownloads.length,
        successfulUpdates: updateCount,
        skippedExisting: skipCount,
        noMatches: noMatchCount
      },
      results: results
    };
    
    fs.writeFileSync('scraped-logos-integration-report.json', JSON.stringify(integrationReport, null, 2));
    console.log('\nDetailed integration report saved to scraped-logos-integration-report.json');
    
    // Show successful updates
    if (updateCount > 0) {
      console.log('\n=== SUCCESSFUL UPDATES ===');
      results
        .filter(r => r.status === 'updated')
        .forEach(r => console.log(`✅ ${r.matchedBroker} -> ${r.newLogoPath}`));
    }
    
    // Show no matches for manual review
    if (noMatchCount > 0) {
      console.log('\n=== NO MATCHES (Manual Review Needed) ===');
      results
        .filter(r => r.status === 'no_match')
        .forEach(r => console.log(`❌ ${r.scrapedName} (${r.filename})`));
    }
    
    console.log('\n=== NEXT STEPS ===');
    console.log('1. Review integration report');
    console.log('2. Manually match unmatched logos');
    console.log('3. Run logo upload summary to see updated stats');
    console.log('4. Verify logo display on frontend');
    
  } catch (error) {
    console.error('Error integrating scraped logos:', error);
  }
}

// Run the integration
integrateScrapedLogos();