const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

const scrapedDataPath = 'c:/Users/LENOVO/Desktop/dualite/broker-analysis-html/www.dailyforex.com/forex-brokers';

// Function to extract logo URLs from HTML content
function extractLogoUrls(htmlContent, brokerName) {
  const logoUrls = [];
  
  // Common patterns for broker logos
  const patterns = [
    // Direct img tags with broker name
    new RegExp(`<img[^>]*src=["']([^"']*${brokerName.toLowerCase().replace(/\s+/g, '[-_]?')}[^"']*\.(png|jpg|jpeg|svg|webp))["'][^>]*>`, 'gi'),
    // Logo class or id patterns
    /<img[^>]*(?:class|id)=["'][^"']*logo[^"']*["'][^>]*src=["']([^"']*\.(png|jpg|jpeg|svg|webp))["'][^>]*>/gi,
    // Broker specific patterns
    /<img[^>]*src=["']([^"']*broker[^"']*\.(png|jpg|jpeg|svg|webp))["'][^>]*>/gi,
    // General image patterns in header/nav areas
    /<(?:header|nav)[^>]*>[\s\S]*?<img[^>]*src=["']([^"']*\.(png|jpg|jpeg|svg|webp))["'][^>]*>[\s\S]*?<\/(?:header|nav)>/gi
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(htmlContent)) !== null) {
      const url = match[1];
      if (url && !url.includes('placeholder') && !url.includes('default')) {
        logoUrls.push(url);
      }
    }
  });
  
  return [...new Set(logoUrls)]; // Remove duplicates
}

// Function to process HTML files
async function processHtmlFiles() {
  try {
    // Get all brokers from database
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('id, name, slug, logo_url')
      .order('name');
    
    if (error) {
      console.error('Error fetching brokers:', error);
      return;
    }
    
    console.log(`Processing ${brokers.length} brokers...`);
    
    const results = {
      foundLogos: [],
      notFound: [],
      alreadyHasLogo: []
    };
    
    // Read HTML files directory
    const files = fs.readdirSync(scrapedDataPath)
      .filter(file => file.endsWith('.html') && file.includes('review'));
    
    console.log(`Found ${files.length} review HTML files`);
    
    for (const broker of brokers) {
      // Skip if already has a real logo
      if (broker.logo_url && !broker.logo_url.includes('default-logo.png')) {
        results.alreadyHasLogo.push(broker);
        continue;
      }
      
      // Find matching HTML file
      const brokerSlug = broker.slug || broker.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const possibleFiles = files.filter(file => {
        const fileName = file.toLowerCase();
        return fileName.includes(brokerSlug) || 
               fileName.includes(broker.name.toLowerCase().replace(/[^a-z0-9]/g, '-')) ||
               fileName.includes(broker.name.toLowerCase().replace(/\s+/g, '-'));
      });
      
      if (possibleFiles.length === 0) {
        results.notFound.push({ broker, reason: 'No matching HTML file' });
        continue;
      }
      
      // Process the first matching file
      const htmlFile = possibleFiles[0];
      const htmlPath = path.join(scrapedDataPath, htmlFile);
      
      try {
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        const logoUrls = extractLogoUrls(htmlContent, broker.name);
        
        if (logoUrls.length > 0) {
          results.foundLogos.push({
            broker,
            htmlFile,
            logoUrls
          });
          console.log(`✓ Found ${logoUrls.length} logo(s) for ${broker.name}:`);
          logoUrls.forEach(url => console.log(`  - ${url}`));
        } else {
          results.notFound.push({ broker, reason: 'No logos found in HTML', htmlFile });
        }
      } catch (err) {
        console.error(`Error reading ${htmlFile}:`, err.message);
        results.notFound.push({ broker, reason: `File read error: ${err.message}`, htmlFile });
      }
    }
    
    // Generate summary report
    console.log('\n=== LOGO EXTRACTION SUMMARY ===');
    console.log(`Total brokers: ${brokers.length}`);
    console.log(`Already have logos: ${results.alreadyHasLogo.length}`);
    console.log(`Found new logos: ${results.foundLogos.length}`);
    console.log(`Not found: ${results.notFound.length}`);
    
    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalBrokers: brokers.length,
        alreadyHaveLogos: results.alreadyHasLogo.length,
        foundNewLogos: results.foundLogos.length,
        notFound: results.notFound.length
      },
      foundLogos: results.foundLogos,
      notFound: results.notFound,
      alreadyHasLogo: results.alreadyHasLogo.map(b => ({ id: b.id, name: b.name, logo_url: b.logo_url }))
    };
    
    fs.writeFileSync('scraped-logos-report.json', JSON.stringify(report, null, 2));
    console.log('\nDetailed report saved to scraped-logos-report.json');
    
    // Show some examples of found logos
    if (results.foundLogos.length > 0) {
      console.log('\n=== SAMPLE FOUND LOGOS ===');
      results.foundLogos.slice(0, 5).forEach(item => {
        console.log(`${item.broker.name}:`);
        item.logoUrls.forEach(url => console.log(`  ${url}`));
      });
    }
    
    // Show brokers that need manual attention
    if (results.notFound.length > 0) {
      console.log('\n=== BROKERS NEEDING MANUAL ATTENTION ===');
      results.notFound.slice(0, 10).forEach(item => {
        console.log(`${item.broker.name}: ${item.reason}`);
      });
    }
    
  } catch (error) {
    console.error('Error processing HTML files:', error);
  }
}

// Run the extraction
processHtmlFiles();