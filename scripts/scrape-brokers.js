#!/usr/bin/env node

import { brokerScrapingService } from '../src/lib/broker-scraping.js';
import { supabase } from './supabase-config.js';

async function main() {
  console.log('🚀 Starting broker data scraping...');
  
  try {
    // Test database connection
    const { data, error } = await supabase.from('brokers').select('count').single();
    
    if (error) {
      console.error('❌ Database connection failed:', error);
      process.exit(1);
    }
    
    console.log('✅ Database connection successful');
    
    // Start scraping
    console.log('🕷️  Starting to scrape broker data...');
    
    const results = await brokerScrapingService.scrapeAllBrokers();
    
    console.log(`\n📊 Scraping completed! Results:`);
    console.log(`Total brokers processed: ${results.length}`);
    console.log(`Successful scrapes: ${results.filter(r => r.success).length}`);
    console.log(`Failed scrapes: ${results.filter(r => !r.success).length}`);
    
    // Save successful results to database
    let savedCount = 0;
    for (const result of results) {
      if (result.success && result.broker) {
        const saved = await brokerScrapingService.saveBrokerData(result.broker);
        if (saved) {
          savedCount++;
          console.log(`✅ Saved: ${result.broker?.name}`);
        } else {
          console.log(`❌ Failed to save: ${result.broker?.name}`);
        }
      }
    }
    
    console.log(`\n💾 Database update completed!`);
    console.log(`Brokers saved to database: ${savedCount}`);
    
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    process.exit(1);
  }
}

main();