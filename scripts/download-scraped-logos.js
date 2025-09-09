const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Read the scraped logos report
const reportPath = 'scraped-logos-simple-report.json';
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

// Create logos directory if it doesn't exist
const logosDir = 'public/logos/scraped';
if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

// Function to download image from URL
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filename);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(filename);
        });
        
        fileStream.on('error', (err) => {
          fs.unlink(filename, () => {}); // Delete partial file
          reject(err);
        });
      } else {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to get file extension from URL
function getFileExtension(url) {
  const match = url.match(/\.(png|jpg|jpeg|svg|webp)(?:\?.*)?$/i);
  return match ? match[1].toLowerCase() : 'jpg';
}

// Function to sanitize filename
function sanitizeFilename(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Function to identify potential logo URLs (not screenshots)
function isLikelyLogo(url, brokerName) {
  const urlLower = url.toLowerCase();
  const brokerLower = brokerName.toLowerCase().replace(/\s+/g, '');
  
  // Skip obvious non-logos
  if (urlLower.includes('review') || 
      urlLower.includes('screenshot') || 
      urlLower.includes('homepage') || 
      urlLower.includes('landing') ||
      urlLower.includes('package') ||
      urlLower.includes('regulation') ||
      urlLower.includes('fee') ||
      urlLower.includes('account') ||
      urlLower.includes('safety') ||
      urlLower.includes('client') ||
      urlLower.includes('financing') ||
      urlLower.includes('sub-account') ||
      urlLower.includes('pricing') ||
      urlLower.includes('strength') ||
      urlLower.includes('foundation') ||
      urlLower.includes('environment') ||
      urlLower.includes('transparent') ||
      urlLower.includes('oversight')) {
    return false;
  }
  
  // Prefer URLs that contain broker name or are in logo directories
  if (urlLower.includes(brokerLower) || 
      urlLower.includes('logo') || 
      urlLower.includes('110x40') ||
      urlLower.includes('brand')) {
    return true;
  }
  
  // For short URLs that might be logos
  if (url.length < 100 && !urlLower.includes('review')) {
    return true;
  }
  
  return false;
}

// Main processing function
async function processLogos() {
  console.log('Processing scraped logos...');
  console.log(`Found ${report.results.length} brokers with potential logos`);
  
  const downloadResults = [];
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  
  for (const broker of report.results) {
    console.log(`\n--- Processing ${broker.brokerName} ---`);
    
    // Filter for likely logo URLs
    const logoUrls = broker.logoUrls.filter(url => isLikelyLogo(url, broker.brokerName));
    
    if (logoUrls.length === 0) {
      console.log(`  ❌ No suitable logo URLs found`);
      skipCount++;
      continue;
    }
    
    console.log(`  Found ${logoUrls.length} potential logo(s)`);
    
    // Try to download the first (most likely) logo
    const logoUrl = logoUrls[0];
    console.log(`  Downloading: ${logoUrl}`);
    
    // Handle relative URLs
    let fullUrl = logoUrl;
    if (logoUrl.startsWith('../files/')) {
      fullUrl = 'https://www.dailyforex.com/files/' + logoUrl.substring(9);
    } else if (logoUrl.startsWith('/files/')) {
      fullUrl = 'https://www.dailyforex.com' + logoUrl;
    }
    
    try {
      const extension = getFileExtension(fullUrl);
      const filename = `${sanitizeFilename(broker.brokerName)}.${extension}`;
      const filepath = path.join(logosDir, filename);
      
      await downloadImage(fullUrl, filepath);
      
      console.log(`  ✅ Downloaded: ${filename}`);
      
      downloadResults.push({
        brokerName: broker.brokerName,
        originalUrl: logoUrl,
        fullUrl: fullUrl,
        filename: filename,
        filepath: filepath,
        status: 'success'
      });
      
      successCount++;
      
      // Add small delay to be respectful
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.log(`  ❌ Failed: ${error.message}`);
      
      downloadResults.push({
        brokerName: broker.brokerName,
        originalUrl: logoUrl,
        fullUrl: fullUrl,
        filename: null,
        filepath: null,
        status: 'error',
        error: error.message
      });
      
      errorCount++;
    }
  }
  
  // Generate summary report
  console.log('\n=== DOWNLOAD SUMMARY ===');
  console.log(`Total brokers processed: ${report.results.length}`);
  console.log(`Successfully downloaded: ${successCount}`);
  console.log(`Skipped (no suitable URLs): ${skipCount}`);
  console.log(`Failed downloads: ${errorCount}`);
  
  // Save detailed download report
  const downloadReport = {
    timestamp: new Date().toISOString(),
    summary: {
      totalBrokers: report.results.length,
      successfulDownloads: successCount,
      skippedBrokers: skipCount,
      failedDownloads: errorCount
    },
    downloads: downloadResults
  };
  
  fs.writeFileSync('scraped-logos-download-report.json', JSON.stringify(downloadReport, null, 2));
  console.log('\nDetailed download report saved to scraped-logos-download-report.json');
  
  // Show successful downloads
  if (successCount > 0) {
    console.log('\n=== SUCCESSFUL DOWNLOADS ===');
    downloadResults
      .filter(r => r.status === 'success')
      .forEach(r => console.log(`✅ ${r.brokerName} -> ${r.filename}`));
  }
  
  console.log('\n=== NEXT STEPS ===');
  console.log('1. Review downloaded logos in public/logos/scraped/');
  console.log('2. Manually verify logo quality and accuracy');
  console.log('3. Rename/organize logos as needed');
  console.log('4. Update broker database with new logo paths');
  console.log('5. Run logo upload script to apply changes');
}

// Run the download process
processLogos().catch(console.error);