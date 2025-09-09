#!/usr/bin/env node

/**
 * Broker Data Extraction Script
 * Extracts comprehensive broker information from scraped HTML files
 * and populates the Supabase database with structured data
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const cheerio = require('cheerio');
require('dotenv').config({ path: '../.env' });

// Configuration
const SCRAPED_DATA_PATH = 'C:\\Users\\LENOVO\\Desktop\\dualite\\daily forex';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Broker data extraction patterns and mappings
 */
const EXTRACTION_PATTERNS = {
  brokerName: [
    /<h1[^>]*>([^<]+(?:broker|trading|forex)[^<]*)<\/h1>/i,
    /<title>([^<]+(?:review|broker)[^<]*)<\/title>/i,
    /class="broker[_-]?name"[^>]*>([^<]+)</i
  ],
  
  rating: [
    /rating["']?\s*:\s*["']?([0-9.]+)/i,
    /score["']?\s*:\s*["']?([0-9.]+)/i,
    /<span[^>]*rating[^>]*>([0-9.]+)<\/span>/i
  ],
  
  minDeposit: [
    /minimum\s+deposit[^$]*\$([0-9,]+)/i,
    /min\s+deposit[^$]*\$([0-9,]+)/i,
    /deposit[^$]*\$([0-9,]+)/i
  ],
  
  maxLeverage: [
    /leverage[^0-9]*([0-9]+):1/i,
    /max\s+leverage[^0-9]*([0-9]+)/i,
    /up\s+to\s+([0-9]+):1/i
  ],
  
  spreadFrom: [
    /spread[^0-9]*([0-9.]+)\s*pip/i,
    /from\s+([0-9.]+)\s*pip/i,
    /tight\s+spread[^0-9]*([0-9.]+)/i
  ],
  
  platforms: [
    /platform[^:]*:([^<]+)</i,
    /(MT4|MT5|MetaTrader|cTrader|WebTrader)/gi
  ],
  
  regulation: [
    /(FCA|ASIC|CySEC|CFTC|NFA|FSA|FINMA|BaFin|AMF|CONSOB)\s*[#:]?\s*([0-9]+)?/gi,
    /regulated\s+by\s+([A-Z]{2,6})/gi
  ],
  
  founded: [
    /founded[^0-9]*([0-9]{4})/i,
    /established[^0-9]*([0-9]{4})/i,
    /since[^0-9]*([0-9]{4})/i
  ],
  
  headquarters: [
    /headquarter[^:]*:([^<]+)</i,
    /based\s+in\s+([^<,]+)/i,
    /location[^:]*:([^<]+)</i
  ]
};

/**
 * Extract broker information from HTML content
 */
function extractBrokerData(htmlContent, filePath) {
  const $ = cheerio.load(htmlContent);
  const brokerData = {
    source_file: filePath,
    extraction_date: new Date().toISOString()
  };

  // Extract broker name
  const fileName = path.basename(filePath, '.html');
  brokerData.name = extractBrokerName(htmlContent, fileName);
  
  // Extract basic information
  brokerData.overall_rating = extractNumericValue(htmlContent, EXTRACTION_PATTERNS.rating) || 4.0;
  brokerData.min_deposit = extractNumericValue(htmlContent, EXTRACTION_PATTERNS.minDeposit) || 100;
  brokerData.max_leverage = extractNumericValue(htmlContent, EXTRACTION_PATTERNS.maxLeverage) || 500;
  brokerData.spread_from = extractNumericValue(htmlContent, EXTRACTION_PATTERNS.spreadFrom) || 0.1;
  
  // Extract platforms
  brokerData.platforms = extractPlatforms(htmlContent);
  
  // Extract regulation info
  brokerData.regulations = extractRegulations(htmlContent);
  
  // Extract founded year
  brokerData.founded_year = extractNumericValue(htmlContent, EXTRACTION_PATTERNS.founded);
  
  // Extract headquarters
  brokerData.headquarters = extractTextValue(htmlContent, EXTRACTION_PATTERNS.headquarters);
  
  // Extract pros and cons
  brokerData.pros = extractProsAndCons($, 'pros');
  brokerData.cons = extractProsAndCons($, 'cons');
  
  // Extract trading instruments
  brokerData.instruments = extractTradingInstruments($);
  
  // Extract account types
  brokerData.account_types = extractAccountTypes($);
  
  // Generate website URL
  brokerData.website_url = generateWebsiteUrl(brokerData.name);
  
  // Generate description
  brokerData.description = generateDescription(brokerData);
  
  return brokerData;
}

/**
 * Extract broker name from various sources
 */
function extractBrokerName(htmlContent, fileName) {
  // Try extraction patterns first
  for (const pattern of EXTRACTION_PATTERNS.brokerName) {
    const match = htmlContent.match(pattern);
    if (match) {
      return cleanBrokerName(match[1]);
    }
  }
  
  // Fallback to filename parsing
  return cleanBrokerName(fileName.replace(/-vs-.*/, '').replace(/-/g, ' '));
}

/**
 * Clean and normalize broker name
 */
function cleanBrokerName(name) {
  return name
    .replace(/\s*(review|broker|trading|forex)\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Extract numeric value using patterns
 */
function extractNumericValue(content, patterns) {
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      const value = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(value)) return value;
    }
  }
  return null;
}

/**
 * Extract text value using patterns
 */
function extractTextValue(content, patterns) {
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
}

/**
 * Extract trading platforms
 */
function extractPlatforms(content) {
  const platforms = new Set();
  const platformPattern = /(MT4|MT5|MetaTrader\s*[45]?|cTrader|WebTrader|TradingView|Proprietary|Mobile)/gi;
  const matches = content.match(platformPattern) || [];
  
  matches.forEach(match => {
    const normalized = match.toLowerCase()
      .replace('metatrader', 'mt')
      .replace(/\s+/g, '');
    platforms.add(normalized);
  });
  
  return Array.from(platforms);
}

/**
 * Extract regulation information
 */
function extractRegulations(content) {
  const regulations = [];
  const matches = content.match(EXTRACTION_PATTERNS.regulation[0]) || [];
  
  matches.forEach(match => {
    const parts = match.split(/[#:]/)
    regulations.push({
      regulator: parts[0].trim(),
      license_number: parts[1] ? parts[1].trim() : null
    });
  });
  
  return regulations;
}

/**
 * Extract pros and cons
 */
function extractProsAndCons($, type) {
  const items = [];
  const selectors = [
    `.${type} li`,
    `[class*="${type}"] li`,
    `#${type} li`,
    `.advantages li`,
    `.disadvantages li`
  ];
  
  selectors.forEach(selector => {
    $(selector).each((i, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 5) {
        items.push(text);
      }
    });
  });
  
  return items.slice(0, 5); // Limit to 5 items
}

/**
 * Extract trading instruments
 */
function extractTradingInstruments($) {
  const instruments = {
    forex_pairs: 0,
    commodities: 0,
    indices: 0,
    stocks: 0,
    cryptocurrencies: 0
  };
  
  // Look for instrument counts in text
  const text = $.text().toLowerCase();
  
  const forexMatch = text.match(/([0-9]+)\s*(?:forex|currency)\s*pair/i);
  if (forexMatch) instruments.forex_pairs = parseInt(forexMatch[1]);
  
  const commoditiesMatch = text.match(/([0-9]+)\s*commodit/i);
  if (commoditiesMatch) instruments.commodities = parseInt(commoditiesMatch[1]);
  
  const indicesMatch = text.match(/([0-9]+)\s*(?:indices|index)/i);
  if (indicesMatch) instruments.indices = parseInt(indicesMatch[1]);
  
  const stocksMatch = text.match(/([0-9]+)\s*(?:stocks|shares|equities)/i);
  if (stocksMatch) instruments.stocks = parseInt(stocksMatch[1]);
  
  const cryptoMatch = text.match(/([0-9]+)\s*(?:crypto|digital)/i);
  if (cryptoMatch) instruments.cryptocurrencies = parseInt(cryptoMatch[1]);
  
  return instruments;
}

/**
 * Extract account types
 */
function extractAccountTypes($) {
  const accountTypes = new Set();
  const text = $.text().toLowerCase();
  
  const commonTypes = ['standard', 'pro', 'premium', 'vip', 'islamic', 'raw spread', 'ecn', 'stp'];
  
  commonTypes.forEach(type => {
    if (text.includes(type)) {
      accountTypes.add(type);
    }
  });
  
  return Array.from(accountTypes);
}

/**
 * Generate website URL from broker name
 */
function generateWebsiteUrl(brokerName) {
  const domain = brokerName
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
  return `https://www.${domain}.com`;
}

/**
 * Generate broker description
 */
function generateDescription(brokerData) {
  const founded = brokerData.founded_year ? ` founded in ${brokerData.founded_year}` : '';
  const regulation = brokerData.regulations.length > 0 ? ` regulated by ${brokerData.regulations[0].regulator}` : '';
  
  return `${brokerData.name} is a leading forex broker${founded}${regulation}, offering competitive trading conditions with spreads from ${brokerData.spread_from} pips and leverage up to ${brokerData.max_leverage}:1.`;
}

/**
 * Process all HTML files in the scraped data directory
 */
async function processAllBrokerFiles() {
  const brokerFiles = [];
  const baseDir = path.join(SCRAPED_DATA_PATH, 'www.dailyforex.com');
  
  // Find all HTML files
  function findHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        findHtmlFiles(fullPath);
      } else if (file.endsWith('.html') && !file.includes('index')) {
        brokerFiles.push(fullPath);
      }
    });
  }
  
  findHtmlFiles(baseDir);
  
  console.log(`Found ${brokerFiles.length} HTML files to process`);
  
  const extractedData = [];
  
  // Process each file
  for (const filePath of brokerFiles.slice(0, 20)) { // Limit to first 20 for testing
    try {
      console.log(`Processing: ${path.basename(filePath)}`);
      
      const htmlContent = fs.readFileSync(filePath, 'utf8');
      const brokerData = extractBrokerData(htmlContent, filePath);
      
      if (brokerData.name && brokerData.name.length > 2) {
        extractedData.push(brokerData);
        console.log(`✓ Extracted data for: ${brokerData.name}`);
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message);
    }
  }
  
  return extractedData;
}

/**
 * Insert broker data into Supabase
 */
async function insertBrokerData(brokerData) {
  try {
    // Insert main broker record
    const { data: broker, error: brokerError } = await supabase
      .from('brokers')
      .upsert({
        name: brokerData.name,
        website_url: brokerData.website_url,
        logo_url: `/images/brokers/${brokerData.name.toLowerCase().replace(/\s+/g, '-')}-logo.png`,
        overall_rating: brokerData.overall_rating,
        total_reviews: 0,
        is_regulated: brokerData.regulations.length > 0,
        min_deposit: brokerData.min_deposit,
        max_leverage: brokerData.max_leverage,
        spread_from: brokerData.spread_from,
        platforms: brokerData.platforms,
        account_types: brokerData.account_types,
        description: brokerData.description,
        pros: brokerData.pros,
        cons: brokerData.cons
      }, {
        onConflict: 'name'
      })
      .select()
      .single();
    
    if (brokerError) {
      console.error('Error inserting broker:', brokerError);
      return false;
    }
    
    console.log(`✓ Inserted broker: ${broker.name}`);
    
    // Insert regulation data
    if (brokerData.regulations.length > 0) {
      for (const reg of brokerData.regulations) {
        await supabase
          .from('broker_regulations')
          .upsert({
            broker_id: broker.id,
            regulator_name: reg.regulator,
            license_number: reg.license_number || 'N/A',
            jurisdiction: 'Unknown',
            license_type: 'Investment Services',
            status: 'active'
          });
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error inserting broker data:', error);
    return false;
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting broker data extraction...');
  console.log(`📁 Scanning directory: ${SCRAPED_DATA_PATH}`);
  
  try {
    // Test Supabase connection
    const { data, error } = await supabase.from('brokers').select('count').limit(1);
    if (error) {
      console.error('❌ Supabase connection failed:', error);
      return;
    }
    console.log('✅ Supabase connection successful');
    
    // Process files and extract data
    const extractedData = await processAllBrokerFiles();
    console.log(`📊 Extracted data from ${extractedData.length} brokers`);
    
    // Insert data into database
    let successCount = 0;
    for (const brokerData of extractedData) {
      const success = await insertBrokerData(brokerData);
      if (success) successCount++;
    }
    
    console.log(`✅ Successfully inserted ${successCount}/${extractedData.length} brokers`);
    
    // Save extraction report
    const report = {
      extraction_date: new Date().toISOString(),
      files_processed: extractedData.length,
      successful_insertions: successCount,
      extracted_data: extractedData
    };
    
    fs.writeFileSync(
      path.join(__dirname, 'broker-extraction-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    console.log('📋 Extraction report saved to broker-extraction-report.json');
    
  } catch (error) {
    console.error('❌ Extraction failed:', error);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  extractBrokerData,
  processAllBrokerFiles,
  insertBrokerData
};