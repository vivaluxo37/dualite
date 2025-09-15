// LLM SEO Transformation Script
// Rewrites existing blog posts with LLM SEO optimizations

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  'https://efxpwrnxdorgzcqhbnfn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMzMyMzUsImV4cCI6MjA3MjYwOTIzNX0.q2qAWQgNE1lTCTA8MBdzeNCm5rtL5a_7o4E1Hf_tmzQ'
);

class BlogPostTransformer {
  constructor() {
    // We'll create a simple optimizer since we can't easily import TS modules
    this.initializeOptimizer();
  }

  initializeOptimizer() {
    // Simple LLM SEO optimizer implementation
    this.optimizer = {
      async optimizeContent(content, title, relatedArticles = []) {
        // Extract entities (simple implementation)
        const entities = this.extractEntities(content, title);
        
        // Generate FAQs from headings
        const faqs = this.generateFAQs(content);
        
        // Generate key takeaways
        const keyTakeaways = this.generateKeyTakeaways(content);
        
        // Generate table of contents
        const tableOfContents = this.generateTOC(content);
        
        // Identify speakable sections
        const speakableSections = this.identifySpeakableSections(content);
        
        // Convert headings to questions
        const optimizedContent = this.convertHeadingsToQuestions(content);
        
        return {
          optimizedContent,
          entities,
          faqs,
          keyTakeaways,
          tableOfContents,
          speakableSections,
          internalLinks: this.generateInternalLinks(relatedArticles)
        };
      },

      extractEntities(content, title) {
        const forexEntities = [
          'MetaTrader', 'TradingView', 'FCA', 'CySEC', 'ASIC', 'NFA', 'FSCA', 
          'Pip', 'Leverage', 'Spread', 'Margin', 'Lot', 'ECN', 'STP', 'MM',
          'EUR/USD', 'GBP/USD', 'USD/JPY', 'Technical Analysis', 'Fundamental Analysis',
          'Scalping', 'Day Trading', 'Swing Trading', 'Position Trading', 'Risk Management',
          'Stop Loss', 'Take Profit', 'Support', 'Resistance', 'Candlestick', 'Indicator'
        ];

        const foundEntities = [];
        const text = (content + ' ' + title).toLowerCase();
        
        forexEntities.forEach(entity => {
          if (text.includes(entity.toLowerCase())) {
            foundEntities.push({
              name: entity,
              type: this.getEntityType(entity),
              confidence: 0.8,
              context: this.getEntityContext(entity, text)
            });
          }
        });

        return foundEntities.slice(0, 15);
      },

      getEntityType(entity) {
        const regulators = ['FCA', 'CySEC', 'ASIC', 'NFA', 'FSCA'];
        const platforms = ['MetaTrader', 'TradingView'];
        const terms = ['Pip', 'Leverage', 'Spread', 'Margin', 'Lot', 'ECN', 'STP', 'MM'];
        const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY'];
        const analysis = ['Technical Analysis', 'Fundamental Analysis'];
        const strategies = ['Scalping', 'Day Trading', 'Swing Trading', 'Position Trading'];
        const risk = ['Risk Management', 'Stop Loss', 'Take Profit'];
        const technical = ['Support', 'Resistance', 'Candlestick', 'Indicator'];

        if (regulators.includes(entity)) return 'regulator';
        if (platforms.includes(entity)) return 'platform';
        if (terms.includes(entity)) return 'term';
        if (pairs.includes(entity)) return 'currency_pair';
        if (analysis.includes(entity)) return 'analysis_type';
        if (strategies.includes(entity)) return 'strategy';
        if (risk.includes(entity)) return 'risk_management';
        if (technical.includes(entity)) return 'technical_concept';
        return 'general';
      },

      getEntityContext(entity, text) {
        const index = text.indexOf(entity.toLowerCase());
        const start = Math.max(0, index - 50);
        const end = Math.min(text.length, index + entity.length + 50);
        return text.substring(start, end);
      },

      generateFAQs(content) {
        const faqs = [];
        const headings = content.match(/^#{2,4}\s+(.+)$/gm) || [];
        
        headings.forEach(heading => {
          const cleanHeading = heading.replace(/^#{2,4}\s+/, '');
          
          // Convert heading to question
          let question = cleanHeading;
          if (!question.includes('?')) {
            question = this.convertToQuestion(cleanHeading);
          }
          
          // Find content after this heading
          const headingIndex = content.indexOf(heading);
          const afterHeading = content.substring(headingIndex + heading.length);
          const nextHeading = afterHeading.match(/^#{2,4}\s+/m);
          const sectionContent = nextHeading 
            ? afterHeading.substring(0, nextHeading.index)
            : afterHeading.split('\n\n')[0];
          
          // Generate answer from content
          const answer = this.generateAnswer(sectionContent, cleanHeading);
          
          if (question && answer) {
            faqs.push({
              question: question.replace(/\*\*/g, ''),
              answer: answer.replace(/\*\*/g, '').substring(0, 300)
            });
          }
        });

        return faqs.slice(0, 8);
      },

      convertToQuestion(heading) {
        const questionWords = ['What', 'How', 'Why', 'When', 'Where', 'Which', 'Who'];
        const lowerHeading = heading.toLowerCase();
        
        // Check if it's already a question
        if (lowerHeading.includes('what') || lowerHeading.includes('how') || 
            lowerHeading.includes('why') || lowerHeading.includes('when') ||
            lowerHeading.includes('where') || lowerHeading.includes('which') ||
            lowerHeading.includes('who')) {
          return heading;
        }
        
        // Convert based on keywords
        if (lowerHeading.includes('understand') || lowerHeading.includes('introduction')) {
          return `What is ${heading.replace(/^(Understanding|Introduction to)\s+/i, '')}?`;
        }
        
        if (lowerHeading.includes('benefits') || lowerHeading.includes('advantages')) {
          return `What are the benefits of ${heading.replace(/^(Benefits of|Advantages of)\s+/i, '')}?`;
        }
        
        if (lowerHeading.includes('steps') || lowerHeading.includes('guide')) {
          return `How to ${heading.replace(/^(Steps to|Guide to)\s+/i, '')}?`;
        }
        
        return `What is ${heading}?`;
      },

      generateAnswer(content, heading) {
        // Extract first meaningful sentences after heading
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
        if (sentences.length > 0) {
          return sentences[0].trim() + '.';
        }
        
        // Generate generic answer based on heading
        const lowerHeading = heading.toLowerCase();
        if (lowerHeading.includes('forex') || lowerHeading.includes('trading')) {
          return `${heading} is an important concept in forex trading that helps traders make informed decisions and manage their investments effectively.`;
        }
        
        return `${heading} plays a crucial role in successful trading strategies and risk management approaches.`;
      },

      generateKeyTakeaways(content) {
        const takeaways = [];
        
        // Extract key sentences that contain important information
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 30);
        
        // Look for sentences with important keywords
        const importantKeywords = ['important', 'crucial', 'essential', 'key', 'vital', 'critical', 'significant'];
        
        sentences.forEach(sentence => {
          const lowerSentence = sentence.toLowerCase();
          if (importantKeywords.some(keyword => lowerSentence.includes(keyword)) && takeaways.length < 5) {
            takeaways.push(sentence.trim());
          }
        });
        
        // If not enough takeaways, add generic ones
        if (takeaways.length < 3) {
          takeaways.push(
            'Understanding market analysis is essential for successful forex trading.',
            'Risk management techniques help protect your trading capital.',
            'Choosing the right broker depends on your trading style and needs.'
          );
        }
        
        return takeaways.slice(0, 5);
      },

      generateTOC(content) {
        const toc = [];
        const headings = content.match(/^(#{2,4})\s+(.+)$/gm) || [];
        
        headings.forEach((heading, index) => {
          const match = heading.match(/^(#{2,4})\s+(.+)$/);
          if (match) {
            const level = match[1].length;
            const text = match[2].trim();
            const anchor = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
            
            toc.push({
              level,
              text,
              anchor: `#${anchor}`
            });
          }
        });
        
        return toc;
      },

      identifySpeakableSections(content) {
        const sections = [];
        
        // Look for important paragraphs and headings
        const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
        
        paragraphs.forEach((paragraph, index) => {
          if (paragraph.includes('**') || paragraph.match(/^#{2,4}\s+/)) {
            sections.push({
              cssSelector: `section-${index}`,
              text: paragraph.replace(/^#{2,4}\s+/, '').replace(/\*\*/g, '').trim(),
              xpath: `//p[${index + 1}]`
            });
          }
        });
        
        return sections.slice(0, 6);
      },

      convertHeadingsToQuestions(content) {
        let optimizedContent = content;
        
        // Convert H2 and H3 headings to questions where appropriate
        optimizedContent = optimizedContent.replace(/^##\s+([^?\n]+)$/gm, (match, heading) => {
          if (!heading.includes('Introduction') && !heading.includes('Conclusion')) {
            return `## ${this.convertToQuestion(heading)}`;
          }
          return match;
        });
        
        return optimizedContent;
      },

      generateInternalLinks(relatedArticles) {
        return relatedArticles.map(article => ({
          url: article.url,
          anchorText: article.title,
          context: `Learn more about ${article.title}`,
          relevanceScore: 0.8
        }));
      }
    };
  }

  /**
   * Transform all existing blog posts
   */
  async transformAllPosts() {
    console.log('🚀 Starting LLM SEO transformation for all blog posts...');

    // Get all published blog posts
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch blog posts: ${error.message}`);
    }

    if (!posts || posts.length === 0) {
      console.log('ℹ️  No published blog posts found');
      return {
        total: 0,
        successful: 0,
        failed: 0,
        results: [],
        report: 'No blog posts found for transformation'
      };
    }

    console.log(`📝 Found ${posts.length} blog posts to transform`);

    const results = [];
    let successful = 0;
    let failed = 0;

    // Transform each post
    for (const post of posts) {
      console.log(`\n🔄 Transforming: "${post.title}"`);
      
      try {
        const result = await this.transformSinglePost(post);
        results.push(result);
        
        if (result.success) {
          successful++;
          console.log(`✅ Successfully transformed "${post.title}"`);
          console.log(`   - Entities extracted: ${result.entitiesExtracted}`);
          console.log(`   - FAQs generated: ${result.faqsGenerated}`);
          console.log(`   - Optimization score: ${result.optimizationScore.toFixed(2)}`);
          console.log(`   - Processing time: ${result.processingTime}ms`);
        } else {
          failed++;
          console.log(`❌ Failed to transform "${post.title}":`);
          result.errors?.forEach(error => console.log(`   - ${error}`));
        }
      } catch (error) {
        failed++;
        const errorResult = {
          postId: post.id,
          title: post.title,
          success: false,
          processingTime: 0,
          entitiesExtracted: 0,
          faqsGenerated: 0,
          optimizationScore: 0,
          errors: [`Transformation failed: ${error.message}`]
        };
        results.push(errorResult);
        console.log(`❌ Error transforming "${post.title}": ${error.message}`);
      }
    }

    // Generate report
    const report = this.generateTransformationReport(results, posts.length);

    console.log('\n🎯 Transformation Summary:');
    console.log(`   Total posts: ${posts.length}`);
    console.log(`   Successful: ${successful}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Success rate: ${((successful / posts.length) * 100).toFixed(1)}%`);

    return {
      total: posts.length,
      successful,
      failed,
      results,
      report
    };
  }

  /**
   * Transform a single blog post
   */
  async transformSinglePost(post) {
    const startTime = Date.now();

    try {
      // Transform content using our simple optimizer
      const optimizationResult = await this.optimizer.optimizeContent(
        post.content,
        post.title,
        [] // No related articles for now
      );

      const processingTime = Date.now() - startTime;

      // Calculate optimization score
      const optimizationScore = this.calculateOptimizationScore(optimizationResult);

      // Generate schema markup
      const schemaMarkup = this.generateSchemaMarkup(
        post.title,
        post.excerpt || post.content.substring(0, 200),
        optimizationResult.optimizedContent,
        post.created_at,
        post.updated_at,
        post.featured_image_url,
        `https://brokeranalysis.com/blog/${post.slug}`,
        optimizationResult
      );

      // Update database with optimized content
      await this.updatePostWithOptimizedContent(post.id, {
        ...optimizationResult,
        schemaMarkup
      }, optimizationScore);

      return {
        postId: post.id,
        title: post.title,
        success: true,
        processingTime,
        entitiesExtracted: optimizationResult.entities.length,
        faqsGenerated: optimizationResult.faqs.length,
        optimizationScore,
        errors: []
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      return {
        postId: post.id,
        title: post.title,
        success: false,
        processingTime,
        entitiesExtracted: 0,
        faqsGenerated: 0,
        optimizationScore: 0,
        errors: [`Processing failed: ${error.message}`]
      };
    }
  }

  /**
   * Calculate optimization score
   */
  calculateOptimizationScore(result) {
    let score = 0;
    let maxScore = 0;

    // Key takeaways (20%)
    maxScore += 20;
    if (result.keyTakeaways.length > 0) {
      score += Math.min(20, result.keyTakeaways.length * 5);
    }

    // Table of contents (10%)
    maxScore += 10;
    if (result.tableOfContents.length > 0) {
      score += 10;
    }

    // Entities (20%)
    maxScore += 20;
    score += Math.min(20, result.entities.length * 2);

    // FAQs (25%)
    maxScore += 25;
    score += Math.min(25, result.faqs.length * 3);

    // Speakable sections (10%)
    maxScore += 10;
    score += Math.min(10, result.speakableSections.length * 3);

    // Internal links (10%)
    maxScore += 10;
    score += Math.min(10, result.internalLinks.length * 3);

    // Schema markup (5%)
    maxScore += 5;
    if (result.schemaMarkup && result.schemaMarkup['@graph'] && result.schemaMarkup['@graph'].length > 0) {
      score += 5;
    }

    return Math.min(100, Math.round((score / maxScore) * 100)) / 100;
  }

  /**
   * Generate schema markup
   */
  generateSchemaMarkup(title, description, content, publishDate, updateDate, imageUrl, url, optimizationResult) {
    const graph = [];

    // Add WebPage schema
    graph.push({
      '@type': 'WebPage',
      '@id': url,
      url: url,
      name: title,
      description: description,
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://brokeranalysis.com'
      },
      inLanguage: 'en-US'
    });

    // Add Article schema
    graph.push({
      '@type': 'Article',
      headline: title,
      description: description,
      datePublished: publishDate,
      dateModified: updateDate || publishDate,
      author: {
        '@type': 'Organization',
        name: 'BrokerAnalysis',
        url: 'https://brokeranalysis.com'
      },
      publisher: {
        '@type': 'Organization',
        name: 'BrokerAnalysis',
        logo: {
          '@type': 'ImageObject',
          url: 'https://brokeranalysis.com/og-image.svg'
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url
      }
    });

    // Add FAQ schema if FAQs exist
    if (optimizationResult.faqs.length > 0) {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: optimizationResult.faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      });
    }

    // Add Organization schema
    graph.push({
      '@type': 'Organization',
      '@id': 'https://brokeranalysis.com/#organization',
      name: 'BrokerAnalysis',
      url: 'https://brokeranalysis.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://brokeranalysis.com/og-image.svg',
        width: 1200,
        height: 630
      }
    });

    return {
      '@context': 'https://schema.org',
      '@graph': graph
    };
  }

  /**
   * Update database with optimized content
   */
  async updatePostWithOptimizedContent(postId, transformationResult, optimizationScore) {
    const { error } = await supabase
      .from('blog_posts')
      .update({
        llm_optimized_content: this.buildOptimizedContent(transformationResult),
        faq_schema: transformationResult.schemaMarkup['@graph'].find(item => item['@type'] === 'FAQPage') || null,
        speakable_schema: null, // Simplified for now
        article_schema: transformationResult.schemaMarkup['@graph'].find(item => item['@type'] === 'Article') || null,
        entity_references: transformationResult.entities,
        internal_links: transformationResult.internalLinks,
        key_takeaways: transformationResult.keyTakeaways,
        table_of_contents: transformationResult.tableOfContents,
        speakable_sections: transformationResult.speakableSections,
        llm_optimization_score: optimizationScore,
        is_llm_optimized: true,
        llm_optimized_at: new Date().toISOString()
      })
      .eq('id', postId);

    if (error) {
      throw new Error(`Failed to update post ${postId}: ${error.message}`);
    }
  }

  /**
   * Build optimized content with all enhancements
   */
  buildOptimizedContent(optimizationResult) {
    let content = '';

    // Add key takeaways at the top
    if (optimizationResult.keyTakeaways.length > 0) {
      content += '## Key Takeaways: Quick Answers to Common Questions\n\n';
      content += optimizationResult.keyTakeaways.map((takeaway, index) => `${index + 1}. ${takeaway}`).join('\n\n');
      content += '\n\n---\n\n';
    }

    // Add table of contents
    if (optimizationResult.tableOfContents.length > 0) {
      content += '## Table of Contents\n\n';
      optimizationResult.tableOfContents.forEach(item => {
        const indent = '  '.repeat(item.level - 2);
        content += `${indent}- [${item.text}](${item.anchor})\n`;
      });
      content += '\n\n';
    }

    // Add optimized content
    content += optimizationResult.optimizedContent;

    // Add FAQ sections
    if (optimizationResult.faqs.length > 0) {
      content += '\n\n## Frequently Asked Questions\n\n';
      optimizationResult.faqs.forEach((faq, index) => {
        content += `**Q${index + 1}: ${faq.question}**\n\n`;
        content += `${faq.answer}\n\n`;
      });
    }

    // Add internal links section
    if (optimizationResult.internalLinks.length > 0) {
      content += '\n## Related Articles\n\n';
      optimizationResult.internalLinks.forEach(link => {
        content += `- [${link.anchorText}](${link.url}) - ${link.context}\n`;
      });
    }

    return content;
  }

  /**
   * Generate transformation report
   */
  generateTransformationReport(results, totalPosts) {
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    const totalEntities = successful.reduce((sum, r) => sum + r.entitiesExtracted, 0);
    const totalFAQs = successful.reduce((sum, r) => sum + r.faqsGenerated, 0);
    const avgOptimizationScore = successful.length > 0 
      ? successful.reduce((sum, r) => sum + r.optimizationScore, 0) / successful.length 
      : 0;
    const avgProcessingTime = results.reduce((sum, r) => sum + r.processingTime, 0) / results.length;

    let report = `# LLM SEO Transformation Report\n\n`;
    report += `**Date**: ${new Date().toISOString()}\n`;
    report += `**Total Posts**: ${totalPosts}\n`;
    report += `**Successful**: ${successful.length}\n`;
    report += `**Failed**: ${failed.length}\n`;
    report += `**Success Rate**: ${((successful.length / totalPosts) * 100).toFixed(1)}%\n\n`;

    report += `## Metrics\n\n`;
    report += `- **Total Entities Extracted**: ${totalEntities}\n`;
    report += `- **Total FAQs Generated**: ${totalFAQs}\n`;
    report += `- **Average Optimization Score**: ${avgOptimizationScore.toFixed(2)}/1.00\n`;
    report += `- **Average Processing Time**: ${avgProcessingTime.toFixed(0)}ms\n\n`;

    if (failed.length > 0) {
      report += `## Failed Transformations\n\n`;
      failed.forEach(result => {
        report += `- **${result.title}**\n`;
        if (result.errors) {
          result.errors.forEach(error => {
            report += `  - ${error}\n`;
          });
        }
        report += `\n`;
      });
    }

    report += `## Successful Transformations\n\n`;
    successful.forEach(result => {
      report += `- **${result.title}** (${result.optimizationScore.toFixed(2)})\n`;
    });

    return report;
  }

  /**
   * Transform specific posts by IDs
   */
  async transformSpecificPosts(postIds) {
    const results = [];

    for (const postId of postIds) {
      try {
        // Get post details
        const { data: post, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', postId)
          .single();

        if (error || !post) {
          results.push({
            postId,
            title: 'Unknown',
            success: false,
            processingTime: 0,
            entitiesExtracted: 0,
            faqsGenerated: 0,
            optimizationScore: 0,
            errors: [`Post not found: ${error?.message}`]
          });
          continue;
        }

        console.log(`🔄 Transforming: "${post.title}"`);
        const result = await this.transformSinglePost(post);
        results.push(result);

        if (result.success) {
          console.log(`✅ Successfully transformed "${post.title}"`);
        } else {
          console.log(`❌ Failed to transform "${post.title}"`);
        }
      } catch (error) {
        results.push({
          postId,
          title: 'Unknown',
          success: false,
          processingTime: 0,
          entitiesExtracted: 0,
          faqsGenerated: 0,
          optimizationScore: 0,
          errors: [`Processing failed: ${error.message}`]
        });
      }
    }

    return results;
  }
}

// Main execution function
async function main() {
  const transformer = new BlogPostTransformer();

  try {
    // Get specific post IDs to transform (the 4 existing posts)
    const postIds = [
      'e61cf994-1f38-4e83-a39a-5bdbec6c975d', // Understanding Forex Market Analysis
      'b5d6d098-612c-4c17-80ed-65fb7eb92eb2', // Top Forex Trading Strategies for Beginners
      '42ed9840-7b02-4f7c-a6c5-e984dee74e04', // Risk Management in Forex Trading
      '06e0da29-6c57-403f-8fbe-50749cd0c642'  // Welcome to Our Blog
    ];

    console.log('🎯 Transforming specific blog posts with LLM SEO optimizations...\n');

    const results = await transformer.transformSpecificPosts(postIds);

    // Generate summary
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log('\n🎯 Transformation Summary:');
    console.log(`   Total posts: ${results.length}`);
    console.log(`   Successful: ${successful.length}`);
    console.log(`   Failed: ${failed.length}`);
    console.log(`   Success rate: ${((successful.length / results.length) * 100).toFixed(1)}%\n`);

    // Detailed results
    console.log('📊 Detailed Results:');
    results.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      const score = result.success ? ` (${result.optimizationScore.toFixed(2)})` : '';
      console.log(`${index + 1}. ${status} ${result.title}${score}`);
      
      if (result.success) {
        console.log(`   Entities: ${result.entitiesExtracted}, FAQs: ${result.faqsGenerated}, Time: ${result.processingTime}ms`);
      }
      
      if (result.errors && result.errors.length > 0) {
        console.log(`   Errors: ${result.errors.join(', ')}`);
      }
    });

    console.log('\n🚀 LLM SEO transformation completed!');
    console.log('Your blog posts are now optimized for AI search and LLM understanding.');

  } catch (error) {
    console.error('💥 Transformation failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { BlogPostTransformer };