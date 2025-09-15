const https = require('https');
const http = require('http');

// User agents to rotate
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
];

// Forex broker data structure
class BrokerScraper {
  constructor() {
    this.brokers = [];
    this.userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
  }

  async scrapeWebsite(url) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      
      const options = {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        timeout: 30000
      };

      const req = protocol.get(url, options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  extractBrokerData(html, brokerName) {
    // Basic broker data extraction
    const brokerData = {
      name: brokerName,
      slug: brokerName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      regulations: [],
      min_deposit: null,
      spreads_avg: null,
      leverage_max: null,
      platforms: [],
      year_founded: null,
      headquarters: '',
      company_description: '',
      trust_score: 75,
      avg_rating: 4.0,
      total_reviews: 0,
      website: '',
      affiliate_url: '',
      is_active: true,
      data_sources: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Extract basic information from HTML (simplified)
    try {
      // Look for regulation information
      const regulationRegex = /FCA|CySEC|ASIC|FSCA|FINMA|BaFin|DFSA|ADGM|FMA/i;
      const regulationMatches = html.match(regulationRegex);
      if (regulationMatches) {
        brokerData.regulations = [...new Set(regulationMatches)];
      }

      // Look for minimum deposit
      const depositRegex = /\$(\d+)\s*(minimum deposit|min deposit)/i;
      const depositMatch = html.match(depositRegex);
      if (depositMatch) {
        brokerData.min_deposit = parseInt(depositMatch[1]);
      }

      // Look for spread information
      const spreadRegex = /(\d+\.?\d*)\s*(pips|points)/i;
      const spreadMatch = html.match(spreadRegex);
      if (spreadMatch) {
        brokerData.spreads_avg = parseFloat(spreadMatch[1]);
      }

      // Look for leverage
      const leverageRegex = /1:(\d+)/i;
      const leverageMatch = html.match(leverageRegex);
      if (leverageMatch) {
        brokerData.leverage_max = parseInt(leverageMatch[1]);
      }

      // Look for platforms
      const platforms = ['MT4', 'MT5', 'cTrader', 'WebTrader', 'Mobile App'];
      platforms.forEach(platform => {
        if (html.includes(platform)) {
          brokerData.platforms.push(platform);
        }
      });

      // Look for founding year
      const yearRegex = /(19|20)\d{2}/g;
      const yearMatches = html.match(yearRegex);
      if (yearMatches && yearMatches.length > 0) {
        brokerData.year_founded = parseInt(yearMatches[0]);
      }

    } catch (error) {
      console.error('Error extracting broker data:', error);
    }

    return brokerData;
  }

  async scrapeBrokerReviews() {
    const topBrokers = [
      'IG Group',
      'OANDA',
      'Forex.com',
      'CMC Markets',
      'Pepperstone',
      'AvaTrade',
      'Plus500',
      'XM',
      'Admirals',
      'IC Markets'
    ];

    const reviewSites = [
      'https://www.forexpeacearmy.com',
      'https://www.dailyforex.com',
      'https://www.brokerchooser.com',
      'https://www.investopedia.com'
    ];

    console.log('Starting broker data scraping...');

    for (const broker of topBrokers) {
      console.log(`Scraping data for ${broker}...`);
      
      // Try different review sites
      for (const site of reviewSites) {
        try {
          const searchUrl = `${site}/review/${broker.toLowerCase().replace(/\s+/g, '-')}`;
          console.log(`Trying: ${searchUrl}`);
          
          const html = await this.scrapeWebsite(searchUrl);
          const brokerData = this.extractBrokerData(html, broker);
          
          if (brokerData.regulations.length > 0 || brokerData.min_deposit) {
            brokerData.data_sources.push(site);
            this.brokers.push(brokerData);
            console.log(`Successfully scraped data for ${broker}`);
            break;
          }
        } catch (error) {
          console.log(`Failed to scrape ${site} for ${broker}:`, error.message);
        }
      }
    }

    return this.brokers;
  }
}

// Main execution
async function main() {
  const scraper = new BrokerScraper();
  
  try {
    const brokers = await scraper.scrapeBrokerReviews();
    
    console.log('\n=== Scraped Broker Data ===');
    console.log(JSON.stringify(brokers, null, 2));
    
    // Save to file
    const fs = require('fs');
    fs.writeFileSync('scraped-brokers.json', JSON.stringify(brokers, null, 2));
    console.log('\nData saved to scraped-brokers.json');
    
  } catch (error) {
    console.error('Scraping failed:', error);
  }
}

if (require.main === module) {
  main();
}

module.exports = BrokerScraper;