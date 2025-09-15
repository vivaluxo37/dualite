#!/usr/bin/env node

/**
 * Simple SEO Workflow Execution Script
 * This script runs a simplified SEO workflow using existing broker data
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

console.log('🚀 SEO Workflow System - Simplified Execution');
console.log('=============================================');

// Configuration
const config = {
  supabaseUrl: process.env.VITE_SUPABASE_URL || 'https://efxpwrnxdorgzcqhbnfn.supabase.co',
  supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMzMyMzUsImV4cCI6MjA3MjYwOTIzNX0.q2qAWQgNE1lTCTA8MBdzeNCm5rtL5a_7o4E1Hf_tmzQ',
  qualityThreshold: 85,
  enableDeployment: true
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
    console.log(`   - Enable Deployment: ${this.config.enableDeployment}`);
    
    try {
      console.log('\n⚡ Starting SEO workflow execution...');
      
      const startTime = Date.now();
      
      // Step 1: Get existing brokers
      console.log('\n📊 Step 1: Fetching existing brokers...');
      const brokers = await this.getBrokers();
      console.log(`   ✅ Found ${brokers.length} brokers`);
      
      // Step 2: Generate SEO keywords for each broker
      console.log('\n🔑 Step 2: Generating SEO keywords...');
      const keywordResults = await this.generateKeywords(brokers);
      console.log(`   ✅ Generated keywords for ${keywordResults.length} brokers`);
      
      // Step 3: Optimize broker content
      console.log('\n⚡ Step 3: Optimizing broker content...');
      const optimizedContent = await this.optimizeContent(brokers, keywordResults);
      console.log(`   ✅ Optimized content for ${optimizedContent.length} brokers`);
      
      // Step 4: Generate structured data
      console.log('\n🏗️  Step 4: Generating structured data...');
      const structuredData = await this.generateStructuredData(brokers);
      console.log(`   ✅ Generated structured data for ${structuredData.length} brokers`);
      
      // Step 5: Update sitemap
      console.log('\n🗺️  Step 5: Updating sitemap...');
      await this.updateSitemap(brokers);
      console.log(`   ✅ Sitemap updated`);
      
      const endTime = Date.now();
      const totalTime = Math.round((endTime - startTime) / 1000);
      
      console.log('\n🎉 SEO Workflow Completed!');
      console.log('=============================');
      console.log(`⏱️  Total Time: ${totalTime} seconds`);
      console.log(`🏢 Brokers Processed: ${brokers.length}`);
      console.log(`🔑 Keywords Generated: ${keywordResults.length}`);
      console.log(`⚡ Content Optimized: ${optimizedContent.length}`);
      console.log(`🏗️  Structured Data: ${structuredData.length}`);
      
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

  async generateKeywords(brokers) {
    const results = [];
    
    for (const broker of brokers) {
      try {
        console.log(`   🔍 Processing keywords for ${broker.name}...`);
        
        // Generate primary keywords
        const primaryKeywords = [
          `${broker.name} review`,
          `${broker.name} forex broker`,
          `${broker.name} trading`,
          `best forex broker ${broker.name}`,
          `${broker.name} minimum deposit`,
          `${broker.name} spreads`,
          `${broker.name} leverage`,
          `${broker.name} regulation`,
          `${broker.name} account types`,
          `${broker.name} trading platforms`
        ];
        
        // Generate location-based keywords
        const locationKeywords = broker.country ? [
          `${broker.name} ${broker.country}`,
          `forex broker ${broker.country}`,
          `${broker.name} review ${broker.country}`
        ] : [];
        
        // Generate feature-based keywords
        const featureKeywords = [];
        if (broker.trading_platforms && broker.trading_platforms.length > 0) {
          broker.trading_platforms.forEach((platform) => {
            featureKeywords.push(`${broker.name} ${platform}`);
          });
        }
        
        // Generate comparison keywords
        const comparisonKeywords = [
          `${broker.name} vs other brokers`,
          `${broker.name} alternatives`,
          `brokers like ${broker.name}`,
          `${broker.name} competitor comparison`
        ];
        
        const keywords = [
          ...primaryKeywords,
          ...locationKeywords,
          ...featureKeywords,
          ...comparisonKeywords
        ];
        
        // Store keywords in database
        const { error } = await this.supabase
          .from('broker_keywords')
          .upsert({
            broker_id: broker.id,
            broker_name: broker.name,
            keywords: keywords,
            primary_keywords: primaryKeywords,
            location_keywords: locationKeywords,
            feature_keywords: featureKeywords,
            comparison_keywords: comparisonKeywords,
            generated_at: new Date().toISOString()
          });
        
        if (error) {
          console.warn(`   ⚠️  Failed to store keywords for ${broker.name}: ${error.message}`);
        } else {
          results.push({
            broker_id: broker.id,
            broker_name: broker.name,
            keywords_count: keywords.length
          });
        }
        
        console.log(`   ✅ Generated ${keywords.length} keywords for ${broker.name}`);
        
      } catch (error) {
        console.error(`   ❌ Error generating keywords for ${broker.name}: ${error.message}`);
      }
    }
    
    return results;
  }

  async optimizeContent(brokers, keywordResults) {
    const results = [];
    
    for (const broker of brokers) {
      try {
        console.log(`   ⚡ Optimizing content for ${broker.name}...`);
        
        // Generate SEO-optimized meta title
        const metaTitle = `${broker.name} Review 2025 | Best Forex Broker | ${broker.spreads_avg || 'Competitive'} Spreads`;
        
        // Generate SEO-optimized meta description
        const metaDescription = `Read our comprehensive ${broker.name} review for 2025. Learn about ${broker.name}'s trading platforms, spreads, leverage, regulation, and account types. ${broker.year_founded || 'Established'} forex broker with ${Array.isArray(broker.regulations) ? broker.regulations.join(', ') : (broker.regulations || 'multiple')} regulatory licenses.`;
        
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
        
        // Generate structured data
        const structuredData = {
          "@context": "https://schema.org",
          "@type": "Review",
          "itemReviewed": {
            "@type": "Organization",
            "name": broker.name,
            "url": broker.website_url || `https://${broker.name.toLowerCase().replace(/\s+/g, '')}.com`,
            "logo": broker.logo_url,
            "address": broker.headquarters_location || broker.country ? {
              "@type": "PostalAddress",
              "addressCountry": broker.country
            } : undefined
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": broker.avg_rating || 4.5,
            "bestRating": 5,
            "worstRating": 1
          },
          "author": {
            "@type": "Organization",
            "name": "BrokerAnalysis",
            "url": "https://brokeranalysis.com"
          },
          "datePublished": new Date().toISOString().split('T')[0]
        };
        
        // Update broker with SEO data
        const { error } = await this.supabase
          .from('brokers')
          .update({
            seo_title: metaTitle,
            seo_description: metaDescription,
            seo_keywords: metaKeywords,
            structured_data: structuredData,
            updated_at: new Date().toISOString()
          })
          .eq('id', broker.id);
        
        if (error) {
          console.warn(`   ⚠️  Failed to optimize content for ${broker.name}: ${error.message}`);
        } else {
          results.push({
            broker_id: broker.id,
            broker_name: broker.name,
            meta_title: metaTitle,
            meta_description: metaDescription
          });
        }
        
        console.log(`   ✅ Optimized content for ${broker.name}`);
        
      } catch (error) {
        console.error(`   ❌ Error optimizing content for ${broker.name}: ${error.message}`);
      }
    }
    
    return results;
  }

  async generateStructuredData(brokers) {
    const results = [];
    
    for (const broker of brokers) {
      try {
        console.log(`   🏗️  Generating structured data for ${broker.name}...`);
        
        // Generate FAQ structured data
        const faqStructuredData = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": `Is ${broker.name} a regulated forex broker?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `Yes, ${broker.name} is regulated by ${broker.regulations || 'multiple regulatory authorities'}. ${broker.name} maintains high regulatory standards to ensure trader safety and fund protection.`
              }
            },
            {
              "@type": "Question",
              "name": `What is the minimum deposit at ${broker.name}?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `The minimum deposit at ${broker.name} is ${broker.min_deposit || '$10'}. This makes ${broker.name} accessible to traders of all levels, from beginners to professionals.`
              }
            },
            {
              "@type": "Question",
              "name": `What trading platforms does ${broker.name} offer?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `${broker.name} offers ${broker.trading_platforms || 'MetaTrader 4, MetaTrader 5, and proprietary platforms'}. These platforms provide advanced charting, automated trading capabilities, and mobile trading options.`
              }
            },
            {
              "@type": "Question",
              "name": `What leverage does ${broker.name} offer?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `${broker.name} offers leverage up to ${broker.leverage_max || '1:500'}. Leverage varies by account type and regulatory jurisdiction, with professional accounts typically having higher leverage options.`
              }
            },
            {
              "@type": "Question",
              "name": `What account types are available at ${broker.name}?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `${broker.name} offers various account types including Standard, ECN, STP, and Islamic accounts. Each account type caters to different trading styles and experience levels.`
              }
            }
          ]
        };
        
        // Store structured data
        const { error } = await this.supabase
          .from('broker_structured_data')
          .upsert({
            broker_id: broker.id,
            broker_name: broker.name,
            review_structured_data: broker.structured_data,
            faq_structured_data: faqStructuredData,
            generated_at: new Date().toISOString()
          });
        
        if (error) {
          console.warn(`   ⚠️  Failed to store structured data for ${broker.name}: ${error.message}`);
        } else {
          results.push({
            broker_id: broker.id,
            broker_name: broker.name,
            structured_data_types: ['review', 'faq']
          });
        }
        
        console.log(`   ✅ Generated structured data for ${broker.name}`);
        
      } catch (error) {
        console.error(`   ❌ Error generating structured data for ${broker.name}: ${error.message}`);
      }
    }
    
    return results;
  }

  async updateSitemap(brokers) {
    try {
      // Generate sitemap entries
      const sitemapEntries = brokers.map(broker => ({
        loc: `https://brokeranalysis.com/brokers/${broker.slug}`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.8'
      }));
      
      // Generate sitemap XML
      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map(entry => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
      
      // Update sitemap in public directory
      const publicDir = path.join(process.cwd(), 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      
      // Write sitemap
      fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml);
      
      console.log(`   ✅ Generated sitemap with ${sitemapEntries.length} entries`);
      
    } catch (error) {
      console.error('Error updating sitemap:', error);
      throw error;
    }
  }
}

// Main execution function
async function main() {
  console.log('🔧 Environment Check:');
  
  if (!process.env.VITE_SUPABASE_URL) {
    console.log('   ❌ VITE_SUPABASE_URL not set');
  } else {
    console.log('   ✅ VITE_SUPABASE_URL set');
  }
  
  if (!process.env.VITE_SUPABASE_ANON_KEY) {
    console.log('   ❌ VITE_SUPABASE_ANON_KEY not set');
  } else {
    console.log('   ✅ VITE_SUPABASE_ANON_KEY set');
  }
  
  console.log('');
  
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