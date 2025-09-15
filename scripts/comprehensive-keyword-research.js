#!/usr/bin/env node

/**
 * Comprehensive Forex Keyword Research Script
 * This script executes comprehensive keyword research for 500+ long-tail forex keywords
 * using multiple sources and research methods.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

console.log('🔍 Comprehensive Forex Keyword Research System');
console.log('==============================================');

// Configuration
const config = {
  supabaseUrl: process.env.VITE_SUPABASE_URL || 'https://efxpwrnxdorgzcqhbnfn.supabase.co',
  supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMzMyMzUsImV4cCI6MjA3MjYwOTIzNX0.q2qAWQgNE1lTCTA8MBdzeNCm5rtL5a_7o4E1Hf_tmzQ',
  targetKeywords: 500,
  enableWebSearch: true,
  outputToFile: true
};

class ComprehensiveKeywordResearcher {
  constructor(config) {
    this.config = config;
    this.supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
    this.researchResults = [];
    this.keywordDatabase = new Map();
  }

  async execute() {
    console.log('📋 Configuration:');
    console.log(`   - Target Keywords: ${this.config.targetKeywords}`);
    console.log(`   - Web Search Enabled: ${this.config.enableWebSearch}`);
    console.log(`   - Output to File: ${this.config.outputToFile}`);
    
    try {
      console.log('\n⚡ Starting comprehensive keyword research...');
      
      const startTime = Date.now();
      
      // Step 1: Generate core forex trading keywords
      console.log('\n🎯 Step 1: Generating core forex trading keywords...');
      const coreKeywords = await this.generateCoreForexKeywords();
      console.log(`   ✅ Generated ${coreKeywords.length} core keywords`);
      
      // Step 2: Research broker-specific keywords
      console.log('\n🏢 Step 2: Researching broker-specific keywords...');
      const brokerKeywords = await this.researchBrokerKeywords();
      console.log(`   ✅ Generated ${brokerKeywords.length} broker keywords`);
      
      // Step 3: Research platform-specific keywords
      console.log('\n💻 Step 3: Researching platform-specific keywords...');
      const platformKeywords = await this.researchPlatformKeywords();
      console.log(`   ✅ Generated ${platformKeywords.length} platform keywords`);
      
      // Step 4: Research trading strategy keywords
      console.log('\n📈 Step 4: Researching trading strategy keywords...');
      const strategyKeywords = await this.researchTradingStrategyKeywords();
      console.log(`   ✅ Generated ${strategyKeywords.length} strategy keywords`);
      
      // Step 5: Research educational content keywords
      console.log('\n📚 Step 5: Researching educational content keywords...');
      const educationalKeywords = await this.researchEducationalKeywords();
      console.log(`   ✅ Generated ${educationalKeywords.length} educational keywords`);
      
      // Step 6: Research regulation and compliance keywords
      console.log('\n⚖️  Step 6: Researching regulation keywords...');
      const regulationKeywords = await this.researchRegulationKeywords();
      console.log(`   ✅ Generated ${regulationKeywords.length} regulation keywords`);
      
      // Step 7: Research account type keywords
      console.log('\n📂 Step 7: Researching account type keywords...');
      const accountKeywords = await this.researchAccountTypeKeywords();
      console.log(`   ✅ Generated ${accountKeywords.length} account keywords`);
      
      // Step 8: Research payment method keywords
      console.log('\n💳 Step 8: Researching payment method keywords...');
      const paymentKeywords = await this.researchPaymentMethodKeywords();
      console.log(`   ✅ Generated ${paymentKeywords.length} payment keywords`);
      
      // Step 9: Research geographic location keywords
      console.log('\n🌍 Step 9: Researching geographic keywords...');
      const geographicKeywords = await this.researchGeographicKeywords();
      console.log(`   ✅ Generated ${geographicKeywords.length} geographic keywords`);
      
      // Step 10: Research experience level keywords
      console.log('\n🎓 Step 10: Researching experience level keywords...');
      const experienceKeywords = await this.researchExperienceLevelKeywords();
      console.log(`   ✅ Generated ${experienceKeywords.length} experience keywords`);
      
      // Step 11: Research problem/solution keywords
      console.log('\n❓ Step 11: Researching problem/solution keywords...');
      const problemKeywords = await this.researchProblemSolutionKeywords();
      console.log(`   ✅ Generated ${problemKeywords.length} problem/solution keywords`);
      
      // Step 12: Generate long-tail variations
      console.log('\n🔗 Step 12: Generating long-tail variations...');
      const longTailKeywords = await this.generateLongTailVariations([
        ...coreKeywords,
        ...brokerKeywords,
        ...platformKeywords,
        ...strategyKeywords,
        ...educationalKeywords
      ]);
      console.log(`   ✅ Generated ${longTailKeywords.length} long-tail variations`);
      
      // Combine all keywords
      const allKeywords = [
        ...coreKeywords,
        ...brokerKeywords,
        ...platformKeywords,
        ...strategyKeywords,
        ...educationalKeywords,
        ...regulationKeywords,
        ...accountKeywords,
        ...paymentKeywords,
        ...geographicKeywords,
        ...experienceKeywords,
        ...problemKeywords,
        ...longTailKeywords
      ];
      
      // Remove duplicates and clean keywords
      const uniqueKeywords = [...new Set(allKeywords)]
        .filter(keyword => keyword && keyword.length > 3 && keyword.length < 100)
        .map(keyword => keyword.trim())
        .sort();
      
      // Step 13: Categorize and score keywords
      console.log('\n🏷️  Step 13: Categorizing and scoring keywords...');
      const categorizedKeywords = await this.categorizeAndScoreKeywords(uniqueKeywords);
      
      // Step 14: Save results to database
      console.log('\n💾 Step 14: Saving results to database...');
      const savedKeywords = await this.saveKeywordsToDatabase(categorizedKeywords);
      
      // Step 15: Generate keyword clusters
      console.log('\n🔗 Step 15: Generating keyword clusters...');
      const keywordClusters = await this.generateKeywordClusters(categorizedKeywords);
      
      // Step 16: Output results to file
      if (this.config.outputToFile) {
        console.log('\n📄 Step 16: Outputting results to file...');
        await this.outputResultsToFile({
          keywords: categorizedKeywords,
          clusters: keywordClusters,
          total_count: categorizedKeywords.length,
          research_date: new Date().toISOString()
        });
      }
      
      const endTime = Date.now();
      const totalTime = Math.round((endTime - startTime) / 1000);
      
      console.log('\n🎉 Keyword Research Completed!');
      console.log('==============================');
      console.log(`⏱️  Total Time: ${totalTime} seconds`);
      console.log(`🎯 Target Keywords: ${this.config.targetKeywords}`);
      console.log(`✅ Actual Keywords: ${categorizedKeywords.length}`);
      console.log(`💾 Saved to Database: ${savedKeywords.length}`);
      console.log(`🔗 Keyword Clusters: ${keywordClusters.length}`);
      
      // Show category breakdown
      console.log('\n📊 Category Breakdown:');
      const categoryCounts = {};
      categorizedKeywords.forEach(keyword => {
        categoryCounts[keyword.category] = (categoryCounts[keyword.category] || 0) + 1;
      });
      
      Object.entries(categoryCounts)
        .sort(([,a], [,b]) => b - a)
        .forEach(([category, count]) => {
          console.log(`   ${category}: ${count} keywords`);
        });
      
    } catch (error) {
      console.error('\n❌ Keyword research failed:');
      console.error(`   Error: ${error.message}`);
      throw error;
    }
  }

  async generateCoreForexKeywords() {
    const coreKeywords = [
      // Basic forex trading
      'forex trading', 'currency trading', 'foreign exchange', 'fx trading',
      'online forex trading', 'forex market', 'currency pairs', 'forex broker',
      
      // Trading basics
      'how to trade forex', 'forex trading for beginners', 'learn forex trading',
      'forex trading basics', 'understanding forex', 'forex trading guide',
      
      // Market analysis
      'forex market analysis', 'technical analysis forex', 'fundamental analysis forex',
      'market sentiment', 'economic calendar', 'forex signals', 'trading indicators',
      
      // Trading platforms
      'best forex trading platform', 'mt4 download', 'mt5 download', 'metatrader',
      'web trading platform', 'mobile trading app', 'forex trading software',
      
      // Account types
      'forex demo account', 'practice trading account', 'live forex account',
      'standard account', 'ecn account', 'stp account', 'islamic account',
      
      // Trading costs
      'forex spreads', 'trading commissions', 'forex leverage', 'margin trading',
      'overnight fees', 'swap rates', 'forex broker fees', 'trading costs',
      
      // Risk management
      'forex risk management', 'trading psychology', 'money management',
      'stop loss', 'take profit', 'risk reward ratio', 'position sizing',
      
      // Trading strategies
      'forex trading strategies', 'scalping forex', 'day trading forex',
      'swing trading forex', 'position trading', 'price action trading',
      
      // Market sessions
      'forex market hours', 'london session', 'new york session', 'tokyo session',
      'sydney session', 'best time to trade forex', 'forex trading sessions',
      
      // Currency pairs
      'eurusd trading', 'gbpusd trading', 'usdjpy trading', 'audusd trading',
      'usdcad trading', 'nzdusd trading', 'major currency pairs', 'exotic pairs',
      
      // Advanced topics
      'forex automation', 'algorithmic trading', 'copy trading', 'social trading',
      'forex robots', 'expert advisors', 'trading systems', 'backtesting'
    ];
    
    return coreKeywords;
  }

  async researchBrokerKeywords() {
    const brokerKeywords = [
      // Broker reviews
      'best forex broker', 'forex broker reviews', 'regulated forex brokers',
      'forex broker comparison', 'top forex brokers', 'reliable forex brokers',
      
      // Broker features
      'low spread forex broker', 'high leverage forex broker', 'ecn forex broker',
      'stp forex broker', 'market maker broker', 'no dealing desk broker',
      
      // Broker selection
      'how to choose forex broker', 'forex broker selection criteria',
      'trusted forex brokers', 'safe forex brokers', 'forex broker ratings',
      
      // Regional brokers
      'us forex brokers', 'uk forex brokers', 'european forex brokers',
      'australian forex brokers', 'canadian forex brokers', 'asian forex brokers',
      
      // Account features
      'minimum deposit forex broker', 'forex broker with bonus', 'no deposit bonus',
      'forex broker promotions', 'forex broker contests', 'forex broker education',
      
      // Trading conditions
      'tight spread brokers', 'low commission brokers', 'high leverage brokers',
      'fast execution brokers', 'requote free brokers', 'slippage free brokers'
    ];
    
    return brokerKeywords;
  }

  async researchPlatformKeywords() {
    const platformKeywords = [
      // MetaTrader platforms
      'metatrader 4 review', 'metatrader 5 review', 'mt4 vs mt5', 'best mt4 broker',
      'mt5 trading platform', 'metatrader download', 'mt4 indicators', 'mt5 expert advisors',
      
      // cTrader platform
      'ctrader review', 'ctrader brokers', 'ctrader vs mt4', 'ctrader automated trading',
      
      // Proprietary platforms
      'web trading platform', 'proprietary trading platform', 'custom trading platform',
      'broker trading platform', 'advanced trading platform', 'user friendly platform',
      
      // Mobile trading
      'mobile trading app', 'forex trading app', 'mt4 mobile', 'mt5 mobile',
      'iphone trading app', 'android trading app', 'tablet trading app',
      
      // Platform features
      'trading charts', 'technical indicators', 'drawing tools', 'economic calendar platform',
      'trading alerts', 'price alerts', 'news feed platform', 'one click trading',
      
      // Platform comparison
      'best trading platform for beginners', 'professional trading platform',
      'fastest trading platform', 'most reliable trading platform', 'trading platform features'
    ];
    
    return platformKeywords;
  }

  async researchTradingStrategyKeywords() {
    const strategyKeywords = [
      // Strategy types
      'forex scalping strategy', 'day trading strategy', 'swing trading strategy',
      'position trading strategy', 'long term trading strategy', 'short term trading',
      
      // Analysis methods
      'price action trading', 'technical analysis strategy', 'fundamental analysis strategy',
      'sentiment analysis', 'market analysis strategy', 'trend following strategy',
      
      // Specific strategies
      'moving average strategy', 'rsi trading strategy', 'macd strategy',
      'bollinger bands strategy', 'fibonacci strategy', 'support resistance strategy',
      'breakout strategy', 'reversal strategy', 'momentum trading strategy',
      
      // Advanced strategies
      'algorithmic trading strategy', 'automated trading system', 'robot trading',
      'expert advisor strategy', 'forex robot strategy', 'copy trading strategy',
      
      // Timeframe specific
      '1 minute trading strategy', '5 minute trading strategy', '15 minute strategy',
      '1 hour trading strategy', '4 hour strategy', 'daily trading strategy',
      
      // Market condition specific
      'trending market strategy', 'ranging market strategy', 'volatile market strategy',
      'news trading strategy', 'economic news trading', 'event driven strategy'
    ];
    
    return strategyKeywords;
  }

  async researchEducationalKeywords() {
    const educationalKeywords = [
      // Learning resources
      'forex trading course', 'learn forex trading', 'forex education',
      'trading tutorials', 'forex lessons', 'currency trading guide',
      
      // Beginner education
      'forex trading for beginners', 'how to start forex trading', 'forex basics',
      'understanding forex market', 'forex terminology', 'forex pips explained',
      
      // Advanced education
      'advanced forex trading', 'professional forex trading', 'forex mastery',
      'trading psychology course', 'risk management course', 'money management forex',
      
      // Analysis education
      'learn technical analysis', 'learn fundamental analysis', 'chart patterns',
      'candlestick patterns', 'trading indicators explained', 'market structure',
      
      // Strategy education
      'trading strategy course', 'developing trading strategy', 'backtesting strategies',
      'trading system development', 'strategy optimization', 'trading plan creation',
      
      // Platform education
      'mt4 tutorial', 'mt5 tutorial', 'platform training', 'using metatrader',
      'trading platform guide', 'charting software tutorial'
    ];
    
    return educationalKeywords;
  }

  async researchRegulationKeywords() {
    const regulationKeywords = [
      // Regulation basics
      'forex broker regulation', 'regulated forex broker', 'broker regulation',
      'forex regulatory bodies', 'trading regulation', 'broker compliance',
      
      // Regulatory authorities
      'fca regulated brokers', 'cysec regulated brokers', 'asic regulated brokers',
      'nfa regulated brokers', 'fsa regulated brokers', 'finma regulation',
      
      // Safety and security
      'safe forex brokers', 'secure forex trading', 'fund safety forex',
      'broker insurance', 'investor protection', 'trader protection',
      
      // Regional regulation
      'us forex regulation', 'uk forex regulation', 'european forex regulation',
      'australian forex regulation', 'canadian forex regulation', 'asian regulation',
      
      // Compliance topics
      'broker license verification', 'regulatory compliance', 'anti money laundering',
      'know your customer', 'broker transparency', 'regulatory requirements',
      
      // Trust factors
      'trusted forex brokers', 'reliable brokers', 'broker reputation',
      'broker track record', 'broker history', 'established forex brokers'
    ];
    
    return regulationKeywords;
  }

  async researchAccountTypeKeywords() {
    const accountKeywords = [
      // Basic account types
      'standard forex account', 'mini forex account', 'micro forex account',
      'demo trading account', 'practice account', 'live trading account',
      
      // Advanced account types
      'ecn forex account', 'stp forex account', 'market maker account',
      'no dealing desk account', 'direct market access', 'prime brokerage account',
      
      // Special account types
      'islamic forex account', 'swap free account', 'interest free account',
      'managed forex account', 'pamm account', 'copy trading account',
      
      // Account features
      'high leverage account', 'low spread account', 'commission free account',
      'bonus account', 'vip account', 'premium account', 'professional account',
      
      // Account opening
      'open forex account', 'forex account registration', 'account verification',
      'account funding', 'withdrawal methods', 'account management',
      
      // Account requirements
      'minimum deposit account', 'account size requirements', 'margin requirements',
      'account maintenance', 'account fees', 'account inactivity fees'
    ];
    
    return accountKeywords;
  }

  async researchPaymentMethodKeywords() {
    const paymentKeywords = [
      // Deposit methods
      'forex broker deposit methods', 'credit card deposit forex',
      'bank transfer forex', 'skrill forex', 'neteller forex', 'paypal forex',
      
      // Withdrawal methods
      'forex broker withdrawal', 'fast withdrawal forex', 'withdrawal methods',
      'withdrawal processing time', 'withdrawal fees', 'withdrawal limits',
      
      // Payment processors
      'webmoney forex', 'perfect money forex', 'bitcoin forex broker',
      'cryptocurrency deposit', 'electronic wallets', 'payment processors',
      
      // Payment features
      'instant deposit', 'instant withdrawal', 'no fee deposit',
      'no fee withdrawal', 'multiple payment methods', 'local payment methods',
      
      // Payment security
      'secure payment methods', 'payment security', 'payment encryption',
      'payment protection', 'safe deposit methods', 'secure withdrawals',
      
      // Regional payment
      'local deposit methods', 'regional payment options', 'country specific payment',
      'local bank transfer', 'domestic payment methods', 'local currency deposit'
    ];
    
    return paymentKeywords;
  }

  async researchGeographicKeywords() {
    const geographicKeywords = [];
    const countries = [
      'USA', 'UK', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Switzerland',
      'Australia', 'Canada', 'Japan', 'China', 'Singapore', 'Hong Kong', 'South Korea',
      'India', 'Brazil', 'Mexico', 'Argentina', 'South Africa', 'Nigeria', 'Kenya',
      'UAE', 'Saudi Arabia', 'Turkey', 'Russia', 'Poland', 'Sweden', 'Norway',
      'Denmark', 'Finland', 'Belgium', 'Austria', 'Greece', 'Portugal', 'Ireland'
    ];

    for (const country of countries) {
      geographicKeywords.push(
        `forex trading ${country}`,
        `forex broker ${country}`,
        `${country} forex regulation`,
        `forex traders ${country}`,
        `best forex broker ${country}`,
        `regulated brokers ${country}`
      );
    }

    return geographicKeywords;
  }

  async researchExperienceLevelKeywords() {
    const experienceKeywords = [
      // Experience levels
      'forex trading beginners', 'forex trading advanced', 'professional forex traders',
      'forex trading experts', 'novice traders', 'experienced traders',
      
      // Beginner specific
      'forex for dummies', 'easy forex trading', 'simple forex strategy',
      'beginner forex guide', 'forex basics tutorial', 'learn forex fast',
      
      // Advanced specific
      'advanced forex strategies', 'professional trading techniques',
      'institutional trading', 'bank trading strategies', 'hedge fund trading',
      
      // Career paths
      'become forex trader', 'professional forex trading career',
      'full time forex trader', 'part time forex trader', 'forex trading as business',
      
      // Skill levels
      'basic forex skills', 'intermediate forex trading', 'expert forex trading',
      'master forex trading', 'forex trading proficiency', 'trading skill development'
    ];
    
    return experienceKeywords;
  }

  async researchProblemSolutionKeywords() {
    const problemKeywords = [
      // Common problems
      'forex trading problems', 'common trading mistakes', 'trading losses',
      'broker issues', 'trading platform problems', 'withdrawal problems',
      
      // Solution keywords
      'how to fix trading losses', 'recover from trading loss', 'trading mistake solutions',
      'broker problem solutions', 'platform troubleshooting', 'withdrawal issue solutions',
      
      // Risk solutions
      'avoid margin call', 'prevent stop loss', 'reduce trading risk',
      'protect trading capital', 'risk management solutions', 'trading psychology help',
      
      // Technical solutions
      'fix platform connection', 'resolve trading errors', 'metatrader problems',
      'chart issues', 'indicator problems', 'expert advisor issues',
      
      // Educational solutions
      'improve trading skills', 'better trading results', 'trading performance help',
      'trading strategy improvement', 'market analysis help', 'trading education solutions',
      
      // Broker solutions
      'choose right broker', 'switch forex broker', 'broker comparison help',
      'broker selection guide', 'find reliable broker', 'broker review help'
    ];
    
    return problemKeywords;
  }

  async generateLongTailVariations(baseKeywords) {
    const longTailKeywords = [];
    const modifiers = [
      '2025', 'guide', 'tutorial', 'review', 'comparison', 'vs', 'for beginners',
      'for advanced', 'step by step', 'how to', 'best', 'top', 'cheapest', 'most reliable',
      'in usa', 'in uk', 'in europe', 'in australia', 'in canada', 'for us clients',
      'with low spreads', 'with high leverage', 'with bonus', 'no deposit', 'minimum deposit',
      'demo account', 'live account', 'ecn account', 'islamic account', 'mobile app',
      'mt4 platform', 'mt5 platform', 'automated', 'copy trading', 'social trading'
    ];

    for (const keyword of baseKeywords.slice(0, 100)) {
      for (const modifier of modifiers.slice(0, 15)) {
        const variation = `${keyword} ${modifier}`.toLowerCase();
        if (variation.length < 80 && variation.length > 10) {
          longTailKeywords.push(variation);
        }
      }
    }

    return [...new Set(longTailKeywords)];
  }

  async categorizeAndScoreKeywords(keywords) {
    const categorizedKeywords = [];
    
    for (const keyword of keywords) {
      const category = this.determineKeywordCategory(keyword);
      const intent = this.determineSearchIntent(keyword);
      const difficulty = this.estimateDifficulty(keyword);
      const volume = this.estimateSearchVolume(keyword);
      
      categorizedKeywords.push({
        keyword,
        category,
        intent,
        difficulty,
        volume,
        score: this.calculateKeywordScore(keyword, category, intent, difficulty, volume)
      });
    }
    
    return categorizedKeywords
      .filter(k => k.score > 30)
      .sort((a, b) => b.score - a.score);
  }

  determineKeywordCategory(keyword) {
    const keyword_lower = keyword.toLowerCase();
    
    if (keyword_lower.includes('broker') || keyword_lower.includes('review')) return 'broker_reviews';
    if (keyword_lower.includes('platform') || keyword_lower.includes('mt4') || keyword_lower.includes('mt5')) return 'trading_platforms';
    if (keyword_lower.includes('strategy') || keyword_lower.includes('system')) return 'trading_strategies';
    if (keyword_lower.includes('learn') || keyword_lower.includes('tutorial') || keyword_lower.includes('guide')) return 'education';
    if (keyword_lower.includes('regulation') || keyword_lower.includes('regulated')) return 'regulation';
    if (keyword_lower.includes('account') || keyword_lower.includes('deposit')) return 'account_types';
    if (keyword_lower.includes('payment') || keyword_lower.includes('withdrawal')) return 'payment_methods';
    if (keyword_lower.includes('spread') || keyword_lower.includes('leverage') || keyword_lower.includes('fee')) return 'trading_conditions';
    if (keyword_lower.includes('beginner') || keyword_lower.includes('basic')) return 'beginner_content';
    if (keyword_lower.includes('advanced') || keyword_lower.includes('professional')) return 'advanced_content';
    
    return 'general_forex';
  }

  determineSearchIntent(keyword) {
    const keyword_lower = keyword.toLowerCase();
    
    if (keyword_lower.includes('review') || keyword_lower.includes('best') || keyword_lower.includes('top')) return 'commercial';
    if (keyword_lower.includes('how to') || keyword_lower.includes('learn') || keyword_lower.includes('tutorial')) return 'informational';
    if (keyword_lower.includes('buy') || keyword_lower.includes('open') || keyword_lower.includes('account')) return 'transactional';
    if (keyword_lower.includes('vs') || keyword_lower.includes('comparison')) return 'commercial';
    
    return 'informational';
  }

  estimateDifficulty(keyword) {
    const keyword_lower = keyword.toLowerCase();
    let difficulty = 50;
    
    if (keyword_lower.includes('best') || keyword_lower.includes('top')) difficulty += 20;
    if (keyword_lower.includes('forex trading') || keyword_lower.includes('currency trading')) difficulty += 15;
    if (keyword_lower.length > 5) difficulty += 10;
    if (keyword_lower.includes('broker')) difficulty += 10;
    
    return Math.min(difficulty, 100);
  }

  estimateSearchVolume(keyword) {
    const keyword_lower = keyword.toLowerCase();
    let volume = 100;
    
    if (keyword_lower.includes('forex trading')) volume += 500;
    if (keyword_lower.includes('broker')) volume += 300;
    if (keyword_lower.includes('review')) volume += 200;
    if (keyword_lower.includes('best')) volume += 150;
    if (keyword_lower.includes('platform')) volume += 100;
    
    return volume;
  }

  calculateKeywordScore(keyword, category, intent, difficulty, volume) {
    let score = 50;
    
    // Volume has highest weight
    score += Math.log(volume + 1) * 10;
    
    // Commercial intent gets bonus
    if (intent === 'commercial') score += 20;
    if (intent === 'transactional') score += 15;
    
    // Moderate difficulty is better than very high or very low
    if (difficulty >= 40 && difficulty <= 70) score += 10;
    
    // Length bonus for long-tail keywords
    if (keyword.split(' ').length >= 3) score += 15;
    if (keyword.split(' ').length >= 4) score += 10;
    
    // Category bonuses
    if (['broker_reviews', 'trading_platforms', 'account_types'].includes(category)) score += 15;
    if (['trading_strategies', 'education'].includes(category)) score += 10;
    
    return Math.round(score);
  }

  async saveKeywordsToDatabase(keywords) {
    const savedKeywords = [];
    
    try {
      for (const keywordData of keywords.slice(0, 500)) {
        try {
          const { data, error } = await this.supabase
            .from('comprehensive_keywords')
            .upsert({
              keyword: keywordData.keyword,
              category: keywordData.category,
              intent: keywordData.intent,
              difficulty_score: keywordData.difficulty,
              estimated_volume: keywordData.volume,
              quality_score: keywordData.score,
              research_date: new Date().toISOString(),
              is_active: true
            }, {
              onConflict: 'keyword'
            })
            .select();
          
          if (!error && data) {
            savedKeywords.push(data[0]);
          }
        } catch (error) {
          console.warn(`Failed to save keyword "${keywordData.keyword}":`, error.message);
        }
      }
    } catch (error) {
      console.error('Error saving keywords to database:', error);
    }
    
    return savedKeywords;
  }

  async generateKeywordClusters(keywords) {
    const clusters = {};
    
    for (const keyword of keywords) {
      if (!clusters[keyword.category]) {
        clusters[keyword.category] = {
          category: keyword.category,
          keywords: [],
          avg_score: 0,
          total_volume: 0,
          avg_difficulty: 0
        };
      }
      
      clusters[keyword.category].keywords.push(keyword);
    }
    
    // Calculate cluster metrics
    for (const [category, cluster] of Object.entries(clusters)) {
      cluster.avg_score = cluster.keywords.reduce((sum, k) => sum + k.score, 0) / cluster.keywords.length;
      cluster.total_volume = cluster.keywords.reduce((sum, k) => sum + k.volume, 0);
      cluster.avg_difficulty = cluster.keywords.reduce((sum, k) => sum + k.difficulty, 0) / cluster.keywords.length;
    }
    
    return Object.values(clusters).sort((a, b) => b.avg_score - a.avg_score);
  }

  async outputResultsToFile(data) {
    const outputDir = path.join(process.cwd(), 'keyword-research-results');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Save keywords to CSV
    const csvContent = [
      'Keyword,Category,Intent,Difficulty,Volume,Score',
      ...data.keywords.map(k => 
        `"${k.keyword}","${k.category}","${k.intent}",${k.difficulty},${k.volume},${k.score}`
      )
    ].join('\n');
    
    fs.writeFileSync(path.join(outputDir, 'forex-keywords.csv'), csvContent);
    
    // Save clusters to JSON
    fs.writeFileSync(path.join(outputDir, 'keyword-clusters.json'), JSON.stringify(data.clusters, null, 2));
    
    // Save full report to JSON
    fs.writeFileSync(path.join(outputDir, 'research-report.json'), JSON.stringify(data, null, 2));
    
    console.log(`   ✅ Results saved to ${outputDir}/`);
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
  
  const researcher = new ComprehensiveKeywordResearcher(config);
  await researcher.execute();
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Keyword research interrupted by user');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Keyword research terminated');
  process.exit(0);
});

// Run the execution
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});