#!/usr/bin/env node

/**
 * Simplified SEO Workflow - Direct Broker Updates Only
 * This script updates broker records with SEO data directly
 */

const { createClient } = require('@supabase/supabase-js');

console.log('🚀 SEO Workflow System - Direct Broker Updates');
console.log('===============================================');

// Configuration
const config = {
  supabaseUrl: 'https://efxpwrnxdorgzcqhbnfn.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMzMyMzUsImV4cCI6MjA3MjYwOTIzNX0.q2qAWQgNE1lTCTA8MBdzeNCm5rtL5a_7o4E1Hf_tmzQ',
  qualityThreshold: 85
};

class SimpleSEOExecutor {
  constructor(config) {
    this.config = config;
    this.supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
  }

  async execute() {
    console.log('📋 Configuration:');
    console.log(`   - Supabase URL: ${this.config.supabaseUrl}`);
    console.log(`   - Quality Threshold: ${this.config.qualityThreshold}`);
    
    try {
      console.log('\n⚡ Starting SEO workflow execution...');
      
      const startTime = Date.now();
      
      // Step 1: Get existing brokers
      console.log('\n📊 Step 1: Fetching existing brokers...');
      const brokers = await this.getBrokers();
      console.log(`   ✅ Found ${brokers.length} brokers`);
      
      // Step 2: Update broker records with SEO data
      console.log('\n⚡ Step 2: Updating broker SEO data...');
      const updatedBrokers = await this.updateBrokerSEO(brokers);
      console.log(`   ✅ Updated SEO data for ${updatedBrokers.length} brokers`);
      
      const endTime = Date.now();
      const totalTime = Math.round((endTime - startTime) / 1000);
      
      console.log('\n🎉 SEO Workflow Completed!');
      console.log('=============================');
      console.log(`⏱️  Total Time: ${totalTime} seconds`);
      console.log(`🏢 Brokers Processed: ${brokers.length}`);
      console.log(`⚡ SEO Data Updated: ${updatedBrokers.length}`);
      
    } catch (error) {
      console.error('\n❌ SEO workflow execution failed:');
      console.error(`   Error: ${error.message}`);
      throw error;
    }
  }

  async getBrokers() {
    try {
      const { data, error } = await this.supabase
        .from('brokers')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching brokers:', error);
      throw error;
    }
  }

  async updateBrokerSEO(brokers) {
    const results = [];
    
    for (const broker of brokers) {
      try {
        console.log(`   ⚡ Updating SEO for ${broker.name}...`);
        
        // Generate SEO-optimized meta title
        const metaTitle = `${broker.name} Review 2025 | Best Forex Broker | ${broker.spreads_avg || 'Competitive'} Spreads`;
        
        // Generate SEO-optimized meta description
        const metaDescription = `Read our comprehensive ${broker.name} review for 2025. Learn about ${broker.name}'s trading platforms, spreads, leverage, regulation, and account types. ${broker.established_year || 'Established'} forex broker with ${Array.isArray(broker.regulations) ? broker.regulations.join(', ') : (broker.regulations || 'multiple')} regulatory licenses.`;
        
        // Generate SEO keywords
        const metaKeywords = [
          broker.name.toLowerCase(),
          'forex broker',
          'trading',
          'CFD trading',
          'forex trading',
          broker.name.toLowerCase() + ' review',
          broker.name.toLowerCase() + ' forex broker',
          'best forex broker',
          'online trading',
          Array.isArray(broker.regulations) ? broker.regulations.join(', ').toLowerCase() : (broker.regulations || 'regulated broker')
        ].join(', ');
        
        // Update broker with SEO data
        const { error } = await this.supabase
          .from('brokers')
          .update({
            seo_title: metaTitle,
            seo_description: metaDescription,
            updated_at: new Date().toISOString()
          })
          .eq('id', broker.id);
        
        if (error) {
          console.warn(`   ⚠️  Failed to update SEO for ${broker.name}: ${error.message}`);
        } else {
          results.push({
            broker_id: broker.id,
            broker_name: broker.name,
            meta_title: metaTitle,
            meta_description: metaDescription
          });
        }
        
        console.log(`   ✅ Updated SEO for ${broker.name}`);
        
      } catch (error) {
        console.error(`   ❌ Error updating SEO for ${broker.name}: ${error.message}`);
      }
    }
    
    return results;
  }
}

// Main execution function
async function main() {
  const executor = new SimpleSEOExecutor(config);
  await executor.execute();
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 SEO workflow interrupted by user');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 SEO workflow terminated');
  process.exit(0);
});

// Run the execution
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});