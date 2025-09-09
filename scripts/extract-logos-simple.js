const fs = require('fs');
const path = require('path');

const scrapedDataPath = 'c:/Users/LENOVO/Desktop/dualite/broker-analysis-html/www.dailyforex.com/forex-brokers';

// Common broker names to search for
const brokerNames = [
  'Alpari', 'BDSwiss', 'Binance', 'Capital.com', 'CMC Markets', 'Deriv', 'Exness', 'FTMO',
  'FxPro', 'HotForex', 'IG', 'Interactive Brokers', 'OANDA', 'Plus500', 'Pepperstone',
  'XTB', 'eToro', 'Admirals', 'AvaTrade', 'FXTM', 'IC Markets', 'Swissquote', 'Saxo Bank',
  'Trading 212', 'Questrade', 'Moomoo', 'CFI', 'Fidelity', 'TD Ameritrade', 'E*TRADE',
  'Charles Schwab', 'Robinhood', 'Webull', 'Vanguard', 'Degiro', 'Revolut', 'Freetrade'
];

// Function to extract logo URLs from HTML content
function extractLogoUrls(htmlContent, fileName) {
  const logoUrls = [];
  
  // More comprehensive patterns for finding logos
  const patterns = [
    // Standard img tags with logo-related attributes
    /<img[^>]*(?:class|id)=["'][^"']*(?:logo|brand|header-logo)[^"']*["'][^>]*src=["']([^"']*\.(png|jpg|jpeg|svg|webp))["'][^>]*>/gi,
    // Img tags with src containing logo
    /<img[^>]*src=["']([^"']*logo[^"']*\.(png|jpg|jpeg|svg|webp))["'][^>]*>/gi,
    // Img tags with src containing brand
    /<img[^>]*src=["']([^"']*brand[^"']*\.(png|jpg|jpeg|svg|webp))["'][^>]*>/gi,
    // Img tags in header/nav sections
    /<(?:header|nav)[^>]*>[\s\S]*?<img[^>]*src=["']([^"']*\.(png|jpg|jpeg|svg|webp))["'][^>]*>[\s\S]*?<\/(?:header|nav)>/gi,
    // Any img tag (we'll filter later)
    /<img[^>]*src=["']([^"']*\.(png|jpg|jpeg|svg|webp))["'][^>]*>/gi
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(htmlContent)) !== null) {
      const url = match[1];
      if (url && 
          !url.includes('placeholder') && 
          !url.includes('default') &&
          !url.includes('sprite') &&
          !url.includes('icon') &&
          !url.includes('arrow') &&
          !url.includes('star') &&
          !url.includes('widget') &&
          !url.includes('background') &&
          !url.includes('banner') &&
          !url.includes('ad') &&
          url.length > 10) {
        logoUrls.push(url);
      }
    }
  });
  
  return [...new Set(logoUrls)]; // Remove duplicates
}

// Function to process HTML files
function processHtmlFiles() {
  try {
    console.log('Extracting logos from scraped HTML files...');
    
    // Read HTML files directory
    const files = fs.readdirSync(scrapedDataPath)
      .filter(file => file.endsWith('.html') && file.includes('review'));
    
    console.log(`Found ${files.length} review HTML files`);
    
    const results = [];
    
    for (const file of files) {
      const htmlPath = path.join(scrapedDataPath, file);
      
      try {
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        const logoUrls = extractLogoUrls(htmlContent, file);
        
        if (logoUrls.length > 0) {
          // Extract broker name from filename
          const brokerName = file
            .replace('-review.html', '')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
          
          results.push({
            file,
            brokerName,
            logoUrls: logoUrls.slice(0, 5) // Limit to first 5 URLs
          });
          
          console.log(`\n✓ ${brokerName}:`);
          logoUrls.slice(0, 3).forEach(url => console.log(`  - ${url}`));
          if (logoUrls.length > 3) {
            console.log(`  ... and ${logoUrls.length - 3} more`);
          }
        }
      } catch (err) {
        console.error(`Error reading ${file}:`, err.message);
      }
    }
    
    // Generate summary report
    console.log('\n=== LOGO EXTRACTION SUMMARY ===');
    console.log(`Total HTML files processed: ${files.length}`);
    console.log(`Files with potential logos: ${results.length}`);
    
    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFiles: files.length,
        filesWithLogos: results.length,
        totalLogosFound: results.reduce((sum, r) => sum + r.logoUrls.length, 0)
      },
      results: results
    };
    
    fs.writeFileSync('scraped-logos-simple-report.json', JSON.stringify(report, null, 2));
    console.log('\nDetailed report saved to scraped-logos-simple-report.json');
    
    // Show top results
    if (results.length > 0) {
      console.log('\n=== TOP RESULTS ===');
      results.slice(0, 10).forEach(item => {
        console.log(`\n${item.brokerName} (${item.file}):`);
        item.logoUrls.slice(0, 2).forEach(url => console.log(`  ${url}`));
      });
    }
    
    console.log('\n=== NEXT STEPS ===');
    console.log('1. Review scraped-logos-simple-report.json');
    console.log('2. Manually verify logo URLs');
    console.log('3. Download and process promising logos');
    console.log('4. Update broker database with new logos');
    
  } catch (error) {
    console.error('Error processing HTML files:', error);
  }
}

// Run the extraction
processHtmlFiles();