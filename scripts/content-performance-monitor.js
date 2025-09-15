// Content Performance Monitoring and Optimization System
// This script demonstrates continuous monitoring and optimization of content performance

require('dotenv').config();

class ContentPerformanceMonitor {
  constructor() {
    this.metricsHistory = [];
    this.optimizationSuggestions = [];
    this.performanceThresholds = {
      quality_score: 85,
      seo_score: 80,
      engagement_rate: 3.5,
      bounce_rate: 65,
      page_views: 100
    };
  }

  async monitorContentPerformance() {
    console.log('📊 Starting Content Performance Monitoring');
    console.log('=' .repeat(50));

    try {
      // Step 1: Collect production results
      console.log('📈 Collecting production data...');
      const productionData = await this.collectProductionData();
      
      // Step 2: Analyze performance trends
      console.log('🔍 Analyzing performance trends...');
      const trends = await this.analyzePerformanceTrends(productionData);
      
      // Step 3: Generate optimization recommendations
      console.log('💡 Generating optimization recommendations...');
      const recommendations = await this.generateOptimizationRecommendations(trends);
      
      // Step 4: Identify underperforming content
      console.log('🎯 Identifying underperforming content...');
      const underperforming = await this.identifyUnderperformingContent(productionData);
      
      // Step 5: Generate improvement plan
      console.log('📋 Creating improvement plan...');
      const improvementPlan = await this.createImprovementPlan(underperforming, recommendations);
      
      // Step 6: Display comprehensive monitoring report
      console.log('\n📊 Content Performance Monitoring Report');
      console.log('=' .repeat(50));
      this.displayMonitoringReport(productionData, trends, recommendations, underperforming, improvementPlan);
      
      // Step 7: Save monitoring results
      await this.saveMonitoringResults({
        timestamp: new Date().toISOString(),
        production_data: productionData,
        trends: trends,
        recommendations: recommendations,
        underperforming_content: underperforming,
        improvement_plan: improvementPlan
      });
      
      console.log('\n✅ Performance monitoring completed successfully!');
      
      return {
        success: true,
        production_summary: productionData.summary,
        trends: trends,
        recommendations_count: recommendations.length,
        underperforming_count: underperforming.length,
        improvement_actions: improvementPlan.actions.length
      };

    } catch (error) {
      console.error('💥 Performance monitoring failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async collectProductionData() {
    const fs = require('fs');
    const path = require('path');
    
    const resultsDir = path.join(__dirname, '..', 'production-results');
    const productionData = {
      days_analyzed: 0,
      total_content: 0,
      total_words: 0,
      content_items: [],
      quality_scores: [],
      seo_scores: [],
      content_types: {},
      keywords: {},
      summary: null
    };

    try {
      if (fs.existsSync(resultsDir)) {
        const files = fs.readdirSync(resultsDir)
          .filter(file => file.startsWith('production-results-') && file.endsWith('.json'));

        productionData.days_analyzed = files.length;

        files.forEach(file => {
          try {
            const data = JSON.parse(fs.readFileSync(path.join(resultsDir, file), 'utf8'));
            
            if (data.content && data.content.length > 0) {
              productionData.total_content += data.content.length;
              productionData.total_words += data.total_words;
              
              // Collect individual content items
              data.content.forEach(item => {
                productionData.content_items.push({
                  ...item,
                  date: data.date,
                  file: file
                });
                
                // Collect metrics
                productionData.quality_scores.push(item.quality_score);
                productionData.seo_scores.push(item.seo_score);
                
                // Track content types
                const contentType = item.content_type || 'unknown';
                productionData.content_types[contentType] = (productionData.content_types[contentType] || 0) + 1;
                
                // Track keywords
                const keyword = item.focus_keyword || 'unknown';
                productionData.keywords[keyword] = (productionData.keywords[keyword] || 0) + 1;
              });
            }
          } catch (error) {
            console.warn(`⚠️  Could not read ${file}: ${error.message}`);
          }
        });
      }

      // Generate summary
      productionData.summary = {
        total_content: productionData.total_content,
        total_words: productionData.total_words,
        average_quality: productionData.quality_scores.length > 0 
          ? productionData.quality_scores.reduce((a, b) => a + b, 0) / productionData.quality_scores.length 
          : 0,
        average_seo: productionData.seo_scores.length > 0 
          ? productionData.seo_scores.reduce((a, b) => a + b, 0) / productionData.seo_scores.length 
          : 0,
        days_analyzed: productionData.days_analyzed,
        content_per_day: productionData.days_analyzed > 0 
          ? productionData.total_content / productionData.days_analyzed 
          : 0,
        words_per_day: productionData.days_analyzed > 0 
          ? productionData.total_words / productionData.days_analyzed 
          : 0
      };

      return productionData;

    } catch (error) {
      console.error('Error collecting production data:', error);
      return productionData;
    }
  }

  async analyzePerformanceTrends(productionData) {
    const trends = {
      quality_trend: this.calculateTrend(productionData.quality_scores),
      seo_trend: this.calculateTrend(productionData.seo_scores),
      content_volume_trend: productionData.days_analyzed > 1 
        ? this.calculateVolumeTrend(productionData.content_items) 
        : 'stable',
      quality_consistency: this.calculateConsistency(productionData.quality_scores),
      seo_consistency: this.calculateConsistency(productionData.seo_scores),
      top_performing_content_types: this.getTopPerformingContentTypes(productionData.content_types),
      top_keywords: this.getTopKeywords(productionData.keywords),
      performance_trajectory: this.calculatePerformanceTrajectory(productionData)
    };

    return trends;
  }

  async generateOptimizationRecommendations(trends) {
    const recommendations = [];

    // Quality-based recommendations
    if (trends.quality_trend === 'declining') {
      recommendations.push({
        type: 'quality_improvement',
        priority: 'high',
        title: 'Address Declining Content Quality',
        description: 'Content quality scores are trending downward. Review quality assurance processes.',
        action_items: [
          'Increase editorial review time',
          'Enhance content guidelines',
          'Provide additional training for content creators'
        ],
        expected_impact: 'Increase average quality score by 5-8 points'
      });
    }

    // SEO-based recommendations
    if (trends.seo_trend === 'declining') {
      recommendations.push({
        type: 'seo_optimization',
        priority: 'high',
        title: 'Improve SEO Performance',
        description: 'SEO scores are declining, affecting search visibility.',
        action_items: [
          'Update keyword research strategy',
          'Improve on-page SEO optimization',
          'Enhance meta descriptions and titles'
        ],
        expected_impact: 'Improve average SEO score by 6-10 points'
      });
    }

    // Content volume recommendations
    if (trends.content_volume_trend === 'declining') {
      recommendations.push({
        type: 'volume_optimization',
        priority: 'medium',
        title: 'Maintain Content Production Volume',
        description: 'Content production volume is decreasing.',
        action_items: [
          'Streamline content creation workflow',
          'Address production bottlenecks',
          'Consider outsourcing or automation'
        ],
        expected_impact: 'Maintain consistent 3 articles per day'
      });
    }

    // Consistency recommendations
    if (trends.quality_consistency < 80) {
      recommendations.push({
        type: 'consistency_improvement',
        priority: 'medium',
        title: 'Improve Content Consistency',
        description: 'Content quality consistency is below target.',
        action_items: [
          'Standardize content creation process',
          'Implement better quality control',
          'Create style guides and templates'
        ],
        expected_impact: 'Improve consistency to 90%+'
      });
    }

    // Content type optimization
    const underperformingTypes = this.identifyUnderperformingContentTypes(trends.top_performing_content_types);
    if (underperformingTypes.length > 0) {
      recommendations.push({
        type: 'content_type_optimization',
        priority: 'medium',
        title: 'Optimize Underperforming Content Types',
        description: `Focus on improving performance of: ${underperformingTypes.join(', ')}`,
        action_items: underperformingTypes.map(type => 
          `Enhance ${type} content structure and quality`
        ),
        expected_impact: 'Improve performance of underperforming content types'
      });
    }

    return recommendations;
  }

  async identifyUnderperformingContent(productionData) {
    const underperforming = productionData.content_items.filter(item => 
      item.quality_score < this.performanceThresholds.quality_score ||
      item.seo_score < this.performanceThresholds.seo_score
    );

    return underperforming.map(item => ({
      id: item.slug || item.title,
      title: item.title,
      content_type: item.content_type,
      quality_score: item.quality_score,
      seo_score: item.seo_score,
      issues: [],
      recommendations: []
    })).map(item => {
      // Identify specific issues
      if (item.quality_score < this.performanceThresholds.quality_score) {
        item.issues.push('Low quality score');
        item.recommendations.push('Review and enhance content quality');
      }
      
      if (item.seo_score < this.performanceThresholds.seo_score) {
        item.issues.push('Low SEO score');
        item.recommendations.push('Optimize SEO elements and keywords');
      }
      
      return item;
    });
  }

  async createImprovementPlan(underperformingContent, recommendations) {
    const plan = {
      priority_actions: [],
      content_improvements: [],
      process_optimizations: [],
      timeline: '30 days',
      expected_outcomes: [],
      monitoring_metrics: [],
      actions: []
    };

    // Add high-priority recommendations
    const highPriorityRecs = recommendations.filter(r => r.priority === 'high');
    highPriorityRecs.forEach(rec => {
      plan.actions.push({
        type: rec.type,
        priority: 'high',
        description: rec.title,
        timeline: '7-14 days',
        responsible: 'content_team'
      });
    });

    // Add content improvements for underperforming content
    underperformingContent.slice(0, 5).forEach(content => {
      plan.actions.push({
        type: 'content_improvement',
        priority: content.quality_score < 80 ? 'high' : 'medium',
        description: `Improve "${content.title}"`,
        timeline: '3-5 days',
        responsible: 'content_creator',
        target_quality: Math.max(this.performanceThresholds.quality_score, content.quality_score + 10),
        target_seo: Math.max(this.performanceThresholds.seo_score, content.seo_score + 10)
      });
    });

    // Add process optimizations
    plan.actions.push({
      type: 'process_optimization',
      priority: 'medium',
      description: 'Implement continuous monitoring system',
      timeline: '14 days',
      responsible: 'development_team'
    });

    // Set expected outcomes
    plan.expected_outcomes = [
      'Increase average quality score to 90+',
      'Increase average SEO score to 85+',
      'Reduce underperforming content by 50%',
      'Improve content consistency to 90%+'
    ];

    // Set monitoring metrics
    plan.monitoring_metrics = [
      'Daily content quality scores',
      'SEO performance trends',
      'Content engagement metrics',
      'User feedback and satisfaction'
    ];

    return plan;
  }

  displayMonitoringReport(productionData, trends, recommendations, underperforming, improvementPlan) {
    // Production Summary
    console.log('\n📈 Production Summary:');
    console.log(`• Days Analyzed: ${productionData.days_analyzed}`);
    console.log(`• Total Content: ${productionData.total_content} articles`);
    console.log(`• Total Words: ${productionData.total_words.toLocaleString()}`);
    console.log(`• Daily Average: ${productionData.summary.content_per_day.toFixed(1)} articles`);
    console.log(`• Words/Day: ${productionData.summary.words_per_day.toLocaleString()}`);
    console.log(`• Avg Quality: ${productionData.summary.average_quality.toFixed(1)}`);
    console.log(`• Avg SEO: ${productionData.summary.average_seo.toFixed(1)}`);

    // Performance Trends
    console.log('\n📊 Performance Trends:');
    console.log(`• Quality Trend: ${trends.quality_trend.toUpperCase()}`);
    console.log(`• SEO Trend: ${trends.seo_trend.toUpperCase()}`);
    console.log(`• Volume Trend: ${trends.content_volume_trend.toUpperCase()}`);
    console.log(`• Quality Consistency: ${trends.quality_consistency.toFixed(1)}%`);
    console.log(`• SEO Consistency: ${trends.seo_consistency.toFixed(1)}%`);
    console.log(`• Performance Trajectory: ${trends.performance_trajectory}`);

    // Top Content Types
    console.log('\n🏷️  Top Content Types:');
    Object.entries(trends.top_performing_content_types)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .forEach(([type, count]) => {
        console.log(`• ${type}: ${count} articles`);
      });

    // Top Keywords
    console.log('\n🔑 Top Keywords:');
    Object.entries(trends.top_keywords)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([keyword, count]) => {
        console.log(`• ${keyword}: ${count} articles`);
      });

    // Recommendations
    console.log('\n💡 Optimization Recommendations:');
    recommendations.forEach((rec, index) => {
      const priorityIcon = rec.priority === 'high' ? '🔴' : '🟡';
      console.log(`${index + 1}. ${priorityIcon} ${rec.title}`);
      console.log(`   ${rec.description}`);
      console.log(`   Expected Impact: ${rec.expected_impact}`);
    });

    // Underperforming Content
    if (underperforming.length > 0) {
      console.log('\n⚠️  Underperforming Content:');
      underperforming.slice(0, 3).forEach(content => {
        console.log(`• ${content.title}`);
        console.log(`  Quality: ${content.quality_score.toFixed(1)} | SEO: ${content.seo_score.toFixed(1)}`);
        console.log(`  Issues: ${content.issues.join(', ')}`);
      });
      if (underperforming.length > 3) {
        console.log(`  ... and ${underperforming.length - 3} more`);
      }
    }

    // Improvement Plan
    console.log('\n📋 Improvement Plan:');
    console.log(`• Timeline: ${improvementPlan.timeline}`);
    console.log(`• Total Actions: ${improvementPlan.actions.length}`);
    console.log('\nPriority Actions:');
    improvementPlan.actions.slice(0, 3).forEach(action => {
      const priorityIcon = action.priority === 'high' ? '🔴' : '🟡';
      console.log(`• ${priorityIcon} ${action.description} (${action.timeline})`);
    });

    // Expected Outcomes
    console.log('\n🎯 Expected Outcomes:');
    improvementPlan.expected_outcomes.forEach(outcome => {
      console.log(`• ${outcome}`);
    });
  }

  async saveMonitoringResults(data) {
    const fs = require('fs');
    const path = require('path');
    
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `monitoring-results-${timestamp}.json`;
    const filepath = path.join(__dirname, '..', 'monitoring-results', filename);
    
    // Ensure directory exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    console.log(`\n💾 Monitoring results saved to: ${filename}`);
  }

  // Helper methods
  calculateTrend(scores) {
    if (scores.length < 3) return 'stable';
    
    const recent = scores.slice(-3);
    const earlier = scores.slice(0, Math.max(1, scores.length - 3));
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
    
    if (recentAvg > earlierAvg + 3) return 'improving';
    if (recentAvg < earlierAvg - 3) return 'declining';
    return 'stable';
  }

  calculateVolumeTrend(contentItems) {
    if (contentItems.length < 10) return 'stable';
    
    // Group by date and calculate trend
    const dailyVolume = {};
    contentItems.forEach(item => {
      const date = item.date;
      dailyVolume[date] = (dailyVolume[date] || 0) + 1;
    });
    
    const volumes = Object.values(dailyVolume);
    if (volumes.length < 2) return 'stable';
    
    const recent = volumes.slice(-3);
    const earlier = volumes.slice(0, Math.max(1, volumes.length - 3));
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
    
    if (recentAvg > earlierAvg + 0.5) return 'increasing';
    if (recentAvg < earlierAvg - 0.5) return 'declining';
    return 'stable';
  }

  calculateConsistency(scores) {
    if (scores.length === 0) return 0;
    
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);
    
    return Math.max(0, 100 - (standardDeviation / mean) * 100);
  }

  getTopPerformingContentTypes(contentTypes) {
    return Object.entries(contentTypes)
      .sort((a, b) => b[1] - a[1])
      .reduce((obj, [type, count]) => {
        obj[type] = count;
        return obj;
      }, {});
  }

  getTopKeywords(keywords) {
    return Object.entries(keywords)
      .sort((a, b) => b[1] - a[1])
      .reduce((obj, [keyword, count]) => {
        obj[keyword] = count;
        return obj;
      }, {});
  }

  calculatePerformanceTrajectory(productionData) {
    const quality = productionData.summary.average_quality;
    const seo = productionData.summary.average_seo;
    const volume = productionData.summary.content_per_day;
    
    if (quality >= 90 && seo >= 85 && volume >= 3) {
      return 'excellent';
    } else if (quality >= 85 && seo >= 80 && volume >= 2.5) {
      return 'good';
    } else if (quality >= 80 && seo >= 75 && volume >= 2) {
      return 'fair';
    } else {
      return 'needs_improvement';
    }
  }

  identifyUnderperformingContentTypes(topPerformingTypes) {
    const allTypes = ['blog_post', 'broker_review', 'market_analysis'];
    const threshold = Math.max(...Object.values(topPerformingTypes)) * 0.7; // 70% of top performer
    
    return allTypes.filter(type => 
      !topPerformingTypes[type] || topPerformingTypes[type] < threshold
    );
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const monitor = new ContentPerformanceMonitor();
  
  try {
    if (args.includes('monitor')) {
      const result = await monitor.monitorContentPerformance();
      console.log('\n✅ Performance monitoring completed successfully!');
    } else {
      console.log('Usage:');
      console.log('  node content-performance-monitor.js monitor    # Execute performance monitoring');
    }
  } catch (error) {
    console.error('💥 Execution failed:', error);
    process.exit(1);
  }
}

// Export for external use
module.exports = {
  ContentPerformanceMonitor,
  main
};

// Run if executed directly
if (require.main === module) {
  main();
}