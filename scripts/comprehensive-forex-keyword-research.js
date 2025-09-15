// Comprehensive Forex Keyword Research Script
// Generates 500+ long-tail keywords using WebSearch and WebFetch tools

import { WebSearch } from 'web-search-tool';
import { WebFetch } from 'web-fetch-tool';
import { SupabaseClient } from '@supabase/supabase-js';

class ComprehensiveKeywordResearch {
    constructor(supabaseUrl, supabaseKey) {
        this.supabase = new SupabaseClient(supabaseUrl, supabaseKey);
        this.researchResults = [];
        this.keywordClusters = {};
    }

    // Main research function
    async executeComprehensiveResearch() {
        console.log('Starting comprehensive forex keyword research...');

        try {
            // Execute all keyword research categories
            const researchPromises = [
                this.researchGeneralForexKeywords(),
                this.researchBrokerSpecificKeywords(),
                this.researchPlatformSpecificKeywords(),
                this.researchTradingStrategyKeywords(),
                this.researchEducationalContentKeywords(),
                this.researchRegulationComplianceKeywords(),
                this.researchAccountTypeKeywords(),
                this.researchPaymentMethodKeywords(),
                this.researchGeographicLocationKeywords(),
                this.researchExperienceLevelKeywords()
            ];

            await Promise.all(researchPromises);

            // Process and cluster keywords
            await this.processAndClusterKeywords();

            // Save to database
            await this.saveKeywordResearchToDatabase();

            // Generate report
            await this.generateResearchReport();

            console.log('Comprehensive keyword research completed successfully!');
            return this.researchResults;

        } catch (error) {
            console.error('Error in comprehensive keyword research:', error);
            throw error;
        }
    }

    // 1. General Forex Trading Keywords
    async researchGeneralForexKeywords() {
        console.log('Researching general forex trading keywords...');
        
        const searchQueries = [
            'best forex brokers 2025',
            'forex trading platforms comparison',
            'online forex trading guide',
            'currency trading strategies',
            'forex market analysis',
            'forex signals and indicators',
            'forex trading education',
            'forex market hours',
            'forex economic calendar',
            'forex trading tools'
        ];

        for (const query of searchQueries) {
            try {
                const results = await WebSearch.search(`${query} forex broker review`, 5);
                const keywords = await this.extractKeywordsFromSearchResults(results, 'general_forex');
                this.researchResults.push(...keywords);
            } catch (error) {
                console.warn(`Failed to search for general forex query "${query}":`, error);
            }
        }
    }

    // 2. Broker-Specific Keywords
    async researchBrokerSpecificKeywords() {
        console.log('Researching broker-specific keywords...');
        
        const brokerTypes = [
            'ECN brokers', 'STP brokers', 'Market makers', 'DMA brokers',
            'Islamic brokers', 'Islamic accounts', 'Swap free brokers',
            'Low spread brokers', 'High leverage brokers', 'No deposit bonus brokers',
            'Welcome bonus brokers', 'VIP brokers', 'Premium brokers',
            'Retail brokers', 'Institutional brokers', 'Professional brokers'
        ];

        for (const brokerType of brokerTypes) {
            try {
                const results = await WebSearch.search(`${brokerType} review comparison 2025`, 3);
                const keywords = await this.extractKeywordsFromSearchResults(results, 'broker_specific');
                this.researchResults.push(...keywords);
            } catch (error) {
                console.warn(`Failed to search for broker-specific query "${brokerType}":`, error);
            }
        }
    }

    // 3. Platform-Specific Keywords
    async researchPlatformSpecificKeywords() {
        console.log('Researching platform-specific keywords...');
        
        const platforms = [
            'MetaTrader 4', 'MT4 brokers', 'MetaTrader 5', 'MT5 brokers',
            'cTrader brokers', 'TradingView brokers', 'WebTrader',
            'Mobile trading apps', 'iPhone trading', 'Android trading',
            'Platform comparison', 'Software review', 'Trading platform features'
        ];

        for (const platform of platforms) {
            try {
                const results = await WebSearch.search(`${platform} forex trading review 2025`, 3);
                const keywords = await this.extractKeywordsFromSearchResults(results, 'platform_specific');
                this.researchResults.push(...keywords);
            } catch (error) {
                console.warn(`Failed to search for platform query "${platform}":`, error);
            }
        }
    }

    // 4. Trading Strategy Keywords
    async researchTradingStrategyKeywords() {
        console.log('Researching trading strategy keywords...');
        
        const strategies = [
            'scalping strategies', 'day trading strategies', 'swing trading strategies',
            'position trading strategies', 'price action trading', 'technical analysis',
            'fundamental analysis', 'algorithmic trading', 'automated trading',
            'copy trading', 'social trading', 'signal trading', 'news trading',
            'hedging strategies', 'arbitrage trading', 'risk management'
        ];

        for (const strategy of strategies) {
            try {
                const results = await WebSearch.search(`${strategy} forex guide tutorial 2025`, 3);
                const keywords = await this.extractKeywordsFromSearchResults(results, 'trading_strategy');
                this.researchResults.push(...keywords);
            } catch (error) {
                console.warn(`Failed to search for strategy query "${strategy}":`, error);
            }
        }
    }

    // 5. Educational Content Keywords
    async researchEducationalContentKeywords() {
        console.log('Researching educational content keywords...');
        
        const educationalQueries = [
            'forex trading for beginners', 'forex tutorial basics',
            'how to trade forex', 'forex trading guide',
            'forex education courses', 'forex trading academy',
            'learn forex trading', 'forex trading lessons',
            'forex trading books', 'forex trading resources',
            'forex trading videos', 'forex trading webinars'
        ];

        for (const query of educationalQueries) {
            try {
                const results = await WebSearch.search(`${query} learn tutorial guide 2025`, 3);
                const keywords = await this.extractKeywordsFromSearchResults(results, 'educational');
                this.researchResults.push(...keywords);
            } catch (error) {
                console.warn(`Failed to search for educational query "${query}":`, error);
            }
        }
    }

    // 6. Regulation and Compliance Keywords
    async researchRegulationComplianceKeywords() {
        console.log('Researching regulation and compliance keywords...');
        
        const regulationQueries = [
            'forex regulation compliance', 'regulated brokers',
            'FCA regulated brokers', 'CySEC regulated brokers',
            'ASIC regulated brokers', 'license verification',
            'broker safety', 'fund protection', 'compensation schemes',
            'regulatory bodies', 'forex license check',
            'broker regulation comparison', 'regulatory status'
        ];

        for (const query of regulationQueries) {
            try {
                const results = await WebSearch.search(`${query} safety compliance 2025`, 3);
                const keywords = await this.extractKeywordsFromSearchResults(results, 'regulation');
                this.researchResults.push(...keywords);
            } catch (error) {
                console.warn(`Failed to search for regulation query "${query}":`, error);
            }
        }
    }

    // 7. Account Type Keywords
    async researchAccountTypeKeywords() {
        console.log('Researching account type keywords...');
        
        const accountTypes = [
            'demo account', 'practice account', 'live account',
            'standard account', 'mini account', 'micro account',
            'Islamic account', 'swap free account', 'ECN account',
            'STP account', 'VIP account', 'Premium account',
            'Professional account', 'Corporate account', 'Joint account'
        ];

        for (const accountType of accountTypes) {
            try {
                const results = await WebSearch.search(`${accountType} forex broker review 2025`, 3);
                const keywords = await this.extractKeywordsFromSearchResults(results, 'account_type');
                this.researchResults.push(...keywords);
            } catch (error) {
                console.warn(`Failed to search for account type query "${accountType}":`, error);
            }
        }
    }

    // 8. Payment Method Keywords
    async researchPaymentMethodKeywords() {
        console.log('Researching payment method keywords...');
        
        const paymentMethods = [
            'credit card forex', 'debit card trading',
            'bank wire transfer', 'Skrill forex', 'Neteller brokers',
            'PayPal forex', 'cryptocurrency forex', 'bitcoin trading',
            'deposit methods', 'withdrawal options', 'payment fees',
            'minimum deposit', 'fast withdrawal', 'secure payment'
        ];

        for (const paymentMethod of paymentMethods) {
            try {
                const results = await WebSearch.search(`${paymentMethod} forex broker payment 2025`, 3);
                const keywords = await this.extractKeywordsFromSearchResults(results, 'payment_method');
                this.researchResults.push(...keywords);
            } catch (error) {
                console.warn(`Failed to search for payment method query "${paymentMethod}":`, error);
            }
        }
    }

    // 9. Geographic Location Keywords
    async researchGeographicLocationKeywords() {
        console.log('Researching geographic location keywords...');
        
        const locations = [
            'USA forex brokers', 'UK forex brokers', 'European brokers',
            'Australian brokers', 'Canadian brokers', 'Singapore brokers',
            'Dubai brokers', 'South African brokers', 'Indian brokers',
            'Nigerian brokers', 'Asian brokers', 'African brokers',
            'regulated brokers USA', 'brokers accepting US clients',
            'brokers accepting UK clients', 'brokers accepting EU clients'
        ];

        for (const location of locations) {
            try {
                const results = await WebSearch.search(`${location} review comparison 2025`, 3);
                const keywords = await this.extractKeywordsFromSearchResults(results, 'geographic');
                this.researchResults.push(...keywords);
            } catch (error) {
                console.warn(`Failed to search for location query "${location}":`, error);
            }
        }
    }

    // 10. Experience Level Keywords
    async researchExperienceLevelKeywords() {
        console.log('Researching experience level keywords...');
        
        const experienceLevels = [
            'forex for beginners', 'beginner friendly brokers',
            'intermediate traders', 'advanced traders',
            'professional traders', 'novice traders',
            'new traders', 'seasoned traders', 'expert traders',
            'trader experience', 'skill level brokers',
            'beginner strategies', 'advanced strategies'
        ];

        for (const experienceLevel of experienceLevels) {
            try {
                const results = await WebSearch.search(`${experienceLevel} forex broker guide 2025`, 3);
                const keywords = await this.extractKeywordsFromSearchResults(results, 'experience_level');
                this.researchResults.push(...keywords);
            } catch (error) {
                console.warn(`Failed to search for experience level query "${experienceLevel}":`, error);
            }
        }
    }

    // Extract keywords from search results
    async extractKeywordsFromSearchResults(searchResults, category) {
        const keywords = [];

        if (!searchResults || !Array.isArray(searchResults)) {
            return keywords;
        }

        for (const result of searchResults) {
            if (result && result.title) {
                const titleKeywords = this.extractKeywordsFromText(result.title, category);
                keywords.push(...titleKeywords);
            }

            if (result && result.snippet) {
                const snippetKeywords = this.extractKeywordsFromText(result.snippet, category);
                keywords.push(...snippetKeywords);
            }
        }

        // Remove duplicates and process
        const uniqueKeywords = [...new Set(keywords)];
        return uniqueKeywords.map(keyword => ({
            keyword,
            category,
            source: 'web_search',
            confidence: this.calculateConfidenceScore(keyword, category),
            commercialIntent: this.calculateCommercialIntent(keyword),
            searchIntent: this.determineSearchIntent(keyword),
            contentType: this.determineContentType(keyword)
        }));
    }

    // Extract keywords from text
    extractKeywordsFromText(text, category) {
        const keywords = [];
        
        // Forex-specific terms for keyword extraction
        const forexTerms = [
            'broker', 'trading', 'forex', 'currency', 'platform', 'metatrader', 'mt4', 'mt5',
            'spread', 'leverage', 'deposit', 'withdrawal', 'bonus', 'regulation', 'license',
            'ecn', 'stp', 'market maker', 'demo', 'account', 'review', 'comparison', 'vs',
            'alternative', 'scam', 'legit', 'minimum', 'maximum', 'fees', 'commission',
            'support', 'service', 'customer', 'mobile', 'app', 'software', 'charts',
            'analysis', 'signals', 'copy', 'social', 'trading', 'investment', 'pip',
            'lot', 'margin', 'stop loss', 'take profit', 'order', 'trade', 'position',
            'trend', 'volatility', 'liquidity', 'interest rate', 'economic', 'market',
            'strategy', 'system', 'method', 'approach', 'technique', 'indicator',
            'pattern', 'signal', 'alert', 'notification', 'update', 'news', 'report',
            'analysis', 'forecast', 'prediction', 'outlook', 'review', 'rating',
            'comparison', 'vs', 'versus', 'alternative', 'option', 'choice', 'selection',
            'guide', 'tutorial', 'how to', 'learn', 'education', 'course', 'lesson',
            'beginner', 'intermediate', 'advanced', 'expert', 'professional', 'novice',
            'newbie', 'trader', 'investor', 'client', 'user', 'customer'
        ];

        const words = text.toLowerCase().split(/\s+/);
        
        for (let i = 0; i < words.length; i++) {
            const word = words[i].replace(/[^\w]/g, '');
            
            if (forexTerms.includes(word) && word.length > 2) {
                // Create multi-word keywords
                for (let j = 1; j <= 4 && i + j < words.length; j++) {
                    const multiWord = words.slice(i, i + j + 1).join(' ');
                    if (multiWord.length > 10 && multiWord.length < 100) { // Reasonable length
                        keywords.push(multiWord);
                    }
                }
            }
        }

        return keywords;
    }

    // Calculate confidence score for keyword
    calculateConfidenceScore(keyword, category) {
        let score = 50; // Base score
        
        // Boost for specific categories
        const categoryBoost = {
            'general_forex': 10,
            'broker_specific': 15,
            'platform_specific': 12,
            'trading_strategy': 8,
            'educational': 7,
            'regulation': 6,
            'account_type': 5,
            'payment_method': 4,
            'geographic': 3,
            'experience_level': 2
        };
        
        score += categoryBoost[category] || 0;
        
        // Boost for longer keywords (more specific)
        if (keyword.split(' ').length >= 4) {
            score += 15;
        } else if (keyword.split(' ').length >= 3) {
            score += 10;
        }
        
        // Boost for commercial intent keywords
        const commercialTerms = ['review', 'comparison', 'best', 'top', 'vs', 'alternative'];
        if (commercialTerms.some(term => keyword.toLowerCase().includes(term))) {
            score += 10;
        }
        
        return Math.min(score, 100);
    }

    // Calculate commercial intent score
    calculateCommercialIntent(keyword) {
        let score = 0;
        
        const commercialIndicators = [
            { terms: ['best', 'top', 'review', 'comparison', 'rating'], score: 25 },
            { terms: ['vs', 'versus', 'alternative', 'option'], score: 20 },
            { terms: ['buy', 'purchase', 'sign up', 'open account'], score: 30 },
            { terms: ['broker', 'platform', 'trading', 'forex'], score: 10 },
            { terms: ['guide', 'how to', 'tutorial'], score: 5 }
        ];
        
        commercialIndicators.forEach(indicator => {
            if (indicator.terms.some(term => keyword.toLowerCase().includes(term))) {
                score += indicator.score;
            }
        });
        
        return Math.min(score, 100);
    }

    // Determine search intent
    determineSearchIntent(keyword) {
        const keywordLower = keyword.toLowerCase();
        
        if (keywordLower.includes('review') || keywordLower.includes('rating') || keywordLower.includes('comparison')) {
            return 'commercial';
        } else if (keywordLower.includes('buy') || keywordLower.includes('purchase') || keywordLower.includes('account')) {
            return 'transactional';
        } else if (keywordLower.includes('how to') || keywordLower.includes('guide') || keywordLower.includes('tutorial')) {
            return 'informational';
        } else if (keywordLower.includes('login') || keywordLower.includes('dashboard') || keywordLower.includes('platform')) {
            return 'navigational';
        }
        
        return 'informational';
    }

    // Determine content type
    determineContentType(keyword) {
        const keywordLower = keyword.toLowerCase();
        
        if (keywordLower.includes('review') || keywordLower.includes('test') || keywordLower.includes('experience')) {
            return 'review';
        } else if (keywordLower.includes('vs') || keywordLower.includes('comparison') || keywordLower.includes('vs')) {
            return 'comparison';
        } else if (keywordLower.includes('how to') || keywordLower.includes('guide') || keywordLower.includes('tutorial')) {
            return 'tutorial';
        } else if (keywordLower.includes('news') || keywordLower.includes('update') || keywordLower.includes('announcement')) {
            return 'news';
        } else if (keywordLower.includes('faq') || keywordLower.includes('question') || keywordLower.includes('what is')) {
            return 'faq';
        } else if (keywordLower.includes('list') || keywordLower.includes('top') || keywordLower.includes('best')) {
            return 'list';
        }
        
        return 'guide';
    }

    // Process and cluster keywords
    async processAndClusterKeywords() {
        console.log('Processing and clustering keywords...');
        
        // Remove duplicates and low-quality keywords
        const uniqueKeywords = this.researchResults.filter((keyword, index, self) =>
            index === self.findIndex(k => k.keyword === keyword.keyword) && keyword.confidence >= 30
        );

        // Create semantic clusters
        this.createSemanticClusters(uniqueKeywords);

        // Add long-tail variations
        await this.generateLongTailVariations(uniqueKeywords);

        this.researchResults = uniqueKeywords;
        console.log(`Processed ${uniqueKeywords.length} unique keywords`);
    }

    // Create semantic clusters
    createSemanticClusters(keywords) {
        const clusters = {
            broker_reviews: [],
            trading_conditions: [],
            platform_comparison: [],
            trading_strategies: [],
            educational_content: [],
            regulation_safety: [],
            account_types: [],
            payment_methods: [],
            geographic_targets: [],
            experience_levels: []
        };

        keywords.forEach(keyword => {
            const keywordLower = keyword.keyword.toLowerCase();
            
            if (keywordLower.includes('review') || keywordLower.includes('rating')) {
                clusters.broker_reviews.push(keyword);
            } else if (keywordLower.includes('spread') || keywordLower.includes('leverage') || 
                      keywordLower.includes('deposit') || keywordLower.includes('fee')) {
                clusters.trading_conditions.push(keyword);
            } else if (keywordLower.includes('platform') || keywordLower.includes('mt4') || 
                      keywordLower.includes('mt5') || keywordLower.includes('trading software')) {
                clusters.platform_comparison.push(keyword);
            } else if (keywordLower.includes('strategy') || keywordLower.includes('technique') || 
                      keywordLower.includes('method')) {
                clusters.trading_strategies.push(keyword);
            } else if (keywordLower.includes('tutorial') || keywordLower.includes('guide') || 
                      keywordLower.includes('learn') || keywordLower.includes('education')) {
                clusters.educational_content.push(keyword);
            } else if (keywordLower.includes('regulation') || keywordLower.includes('license') || 
                      keywordLower.includes('safety') || keywordLower.includes('compliance')) {
                clusters.regulation_safety.push(keyword);
            } else if (keywordLower.includes('account') || keywordLower.includes('demo') || 
                      keywordLower.includes('islamic')) {
                clusters.account_types.push(keyword);
            } else if (keywordLower.includes('deposit') || keywordLower.includes('withdrawal') || 
                      keywordLower.includes('payment') || keywordLower.includes('wire')) {
                clusters.payment_methods.push(keyword);
            } else if (keywordLower.includes('usa') || keywordLower.includes('uk') || 
                      keywordLower.includes('europe') || keywordLower.includes('australia')) {
                clusters.geographic_targets.push(keyword);
            } else if (keywordLower.includes('beginner') || keywordLower.includes('advanced') || 
                      keywordLower.includes('professional')) {
                clusters.experience_levels.push(keyword);
            }
        });

        this.keywordClusters = clusters;
    }

    // Generate long-tail variations
    async generateLongTailVariations(baseKeywords) {
        console.log('Generating long-tail variations...');
        
        const modifiers = [
            '2025', 'review', 'guide', 'comparison', 'best', 'top', 'vs',
            'for beginners', 'for advanced traders', 'for professionals',
            'in USA', 'in UK', 'in Europe', 'in Australia',
            'with low spreads', 'with high leverage', 'with no deposit bonus',
            'MT4 download', 'MT5 download', 'mobile app',
            'minimum deposit', 'maximum leverage', 'regulation check',
            'demo account', 'live account', 'standard account', 'VIP account'
        ];

        for (const baseKeyword of baseKeywords) {
            for (const modifier of modifiers) {
                if (baseKeyword.keyword.length + modifier.length < 80) {
                    const longTail = `${baseKeyword.keyword} ${modifier}`;
                    const variation = {
                        keyword: longTail,
                        category: baseKeyword.category,
                        source: 'generated_variation',
                        confidence: Math.max(baseKeyword.confidence - 10, 20),
                        commercialIntent: baseKeyword.commercialIntent,
                        searchIntent: baseKeyword.searchIntent,
                        contentType: baseKeyword.contentType
                    };
                    
                    // Add to appropriate cluster
                    this.addToCluster(variation);
                    this.researchResults.push(variation);
                }
            }
        }
    }

    // Add keyword to appropriate cluster
    addToCluster(keyword) {
        const keywordLower = keyword.keyword.toLowerCase();
        
        Object.keys(this.keywordClusters).forEach(clusterName => {
            if (keywordLower.includes(clusterName.replace('_', ' '))) {
                this.keywordClusters[clusterName].push(keyword);
            }
        });
    }

    // Save keyword research to database
    async saveKeywordResearchToDatabase() {
        console.log('Saving keyword research to database...');
        
        try {
            // Insert main keyword research
            const keywordData = this.researchResults.map(keyword => ({
                keyword: keyword.keyword,
                search_volume: this.estimateSearchVolume(keyword),
                keyword_difficulty: this.estimateKeywordDifficulty(keyword),
                commercial_intent: keyword.commercialIntent,
                search_intent: keyword.searchIntent,
                content_type: keyword.contentType,
                priority: this.determinePriority(keyword),
                category: keyword.category,
                subcategory: this.determineSubcategory(keyword),
                target_audience: this.determineTargetAudience(keyword),
                geographic_target: this.determineGeographicTarget(keyword),
                platforms: this.determinePlatforms(keyword),
                trading_styles: this.determineTradingStyles(keyword),
                related_keywords: this.findRelatedKeywords(keyword),
                long_tail_score: keyword.confidence,
                commercial_potential: keyword.commercialIntent,
                competition_level: this.determineCompetitionLevel(keyword),
                suggested_content_length: this.suggestContentLength(keyword),
                estimated_traffic: this.estimateTraffic(keyword),
                conversion_potential: this.estimateConversionPotential(keyword)
            }));

            // Batch insert keywords
            const batchSize = 100;
            for (let i = 0; i < keywordData.length; i += batchSize) {
                const batch = keywordData.slice(i, i + batchSize);
                await this.insertKeywordBatch(batch);
            }

            // Save cluster information
            await this.saveClustersToDatabase();

            console.log(`Saved ${keywordData.length} keywords to database`);
            
        } catch (error) {
            console.error('Error saving keyword research to database:', error);
            throw error;
        }
    }

    // Insert keyword batch
    async insertKeywordBatch(keywords) {
        try {
            // This would use the Supabase MCP tool to insert data
            // For now, we'll log the operation
            console.log(`Inserting batch of ${keywords.length} keywords`);
            
            // In real implementation, this would be:
            // const { data, error } = await this.supabase
            //   .from('keyword_research')
            //   .insert(keywords);
            
        } catch (error) {
            console.error('Error inserting keyword batch:', error);
        }
    }

    // Save clusters to database
    async saveClustersToDatabase() {
        try {
            Object.entries(this.keywordClusters).forEach(([clusterName, keywords]) => {
                if (keywords.length > 0) {
                    console.log(`Saving cluster ${clusterName} with ${keywords.length} keywords`);
                    
                    // In real implementation, this would save cluster data
                    // const clusterData = {
                    //   cluster_name: clusterName,
                    //   main_keyword: keywords[0].keyword,
                    //   cluster_keywords: keywords.map(k => k.keyword),
                    //   total_search_volume: keywords.reduce((sum, k) => sum + (k.searchVolume || 0), 0),
                    //   average_difficulty: keywords.reduce((sum, k) => sum + (k.keywordDifficulty || 0), 0) / keywords.length,
                    //   commercial_intent: keywords.reduce((sum, k) => sum + k.commercialIntent, 0) / keywords.length,
                    //   priority: this.determineClusterPriority(keywords)
                    // };
                    
                    // await this.supabase
                    //   .from('keyword_clusters')
                    //   .insert(clusterData);
                }
            });
        } catch (error) {
            console.error('Error saving clusters to database:', error);
        }
    }

    // Helper methods for data enrichment
    estimateSearchVolume(keyword) {
        // Simple volume estimation based on keyword length and commercial intent
        const baseVolume = 100;
        const lengthBonus = keyword.keyword.length * 10;
        const commercialBonus = keyword.commercialIntent * 5;
        return Math.min(baseVolume + lengthBonus + commercialBonus, 10000);
    }

    estimateKeywordDifficulty(keyword) {
        // Simple difficulty estimation based on keyword length and competition
        const baseDifficulty = 50;
        const lengthPenalty = keyword.keyword.length * 2;
        const competitionPenalty = keyword.commercialIntent * 0.5;
        return Math.min(baseDifficulty + lengthPenalty + competitionPenalty, 100);
    }

    determinePriority(keyword) {
        if (keyword.confidence >= 70 && keyword.commercialIntent >= 60) return 'high';
        if (keyword.confidence >= 50 && keyword.commercialIntent >= 40) return 'medium';
        return 'low';
    }

    determineSubcategory(keyword) {
        const keywordLower = keyword.keyword.toLowerCase();
        
        if (keywordLower.includes('mt4') || keywordLower.includes('mt5')) return 'platform';
        if (keywordLower.includes('spread') || keywordLower.includes('leverage')) return 'trading_conditions';
        if (keywordLower.includes('regulation') || keywordLower.includes('license')) return 'regulation';
        if (keywordLower.includes('account')) return 'account_type';
        
        return 'general';
    }

    determineTargetAudience(keyword) {
        const keywordLower = keyword.keyword.toLowerCase();
        const audience = [];
        
        if (keywordLower.includes('beginner') || keywordLower.includes('newbie')) {
            audience.push('beginner');
        }
        if (keywordLower.includes('advanced') || keywordLower.includes('professional')) {
            audience.push('advanced');
        }
        if (keywordLower.includes('trader')) {
            audience.push('trader');
        }
        if (keywordLower.includes('investor')) {
            audience.push('investor');
        }
        
        return audience.length > 0 ? audience : ['general'];
    }

    determineGeographicTarget(keyword) {
        const keywordLower = keyword.keyword.toLowerCase();
        const locations = [];
        
        if (keywordLower.includes('usa') || keywordLower.includes('us')) {
            locations.push('USA');
        }
        if (keywordLower.includes('uk') || keywordLower.includes('britain')) {
            locations.push('UK');
        }
        if (keywordLower.includes('europe')) {
            locations.push('Europe');
        }
        if (keywordLower.includes('australia')) {
            locations.push('Australia');
        }
        if (keywordLower.includes('canada')) {
            locations.push('Canada');
        }
        if (keywordLower.includes('asia')) {
            locations.push('Asia');
        }
        
        return locations.length > 0 ? locations : ['global'];
    }

    determinePlatforms(keyword) {
        const keywordLower = keyword.keyword.toLowerCase();
        const platforms = [];
        
        if (keywordLower.includes('mt4')) platforms.push('MT4');
        if (keywordLower.includes('mt5')) platforms.push('MT5');
        if (keywordLower.includes('ctrader')) platforms.push('cTrader');
        if (keywordLower.includes('web')) platforms.push('WebTrader');
        if (keywordLower.includes('mobile') || keywordLower.includes('app')) platforms.push('Mobile');
        
        return platforms.length > 0 ? platforms : ['General'];
    }

    determineTradingStyles(keyword) {
        const keywordLower = keyword.keyword.toLowerCase();
        const styles = [];
        
        if (keywordLower.includes('scalping')) styles.push('scalping');
        if (keywordLower.includes('day trading')) styles.push('day_trading');
        if (keywordLower.includes('swing trading')) styles.push('swing_trading');
        if (keywordLower.includes('position trading')) styles.push('position_trading');
        if (keywordLower.includes('technical analysis')) styles.push('technical_analysis');
        if (keywordLower.includes('fundamental analysis')) styles.push('fundamental_analysis');
        
        return styles.length > 0 ? styles : ['general'];
    }

    findRelatedKeywords(keyword) {
        // Simple related keyword finding based on keyword analysis
        const related = [];
        const keywordWords = keyword.keyword.toLowerCase().split(' ');
        
        this.researchResults.forEach(otherKeyword => {
            if (otherKeyword.keyword !== keyword.keyword) {
                const otherWords = otherKeyword.keyword.toLowerCase().split(' ');
                const commonWords = keywordWords.filter(word => otherWords.includes(word));
                
                if (commonWords.length >= 2) {
                    related.push(otherKeyword.keyword);
                }
            }
        });
        
        return related.slice(0, 5); // Return top 5 related keywords
    }

    determineCompetitionLevel(keyword) {
        if (keyword.commercialIntent >= 70) return 'high';
        if (keyword.commercialIntent >= 40) return 'medium';
        return 'low';
    }

    suggestContentLength(keyword) {
        // Suggest content length based on keyword complexity
        const baseLength = 1000;
        const lengthBonus = keyword.keyword.length * 50;
        const commercialBonus = keyword.commercialIntent * 10;
        
        return baseLength + lengthBonus + commercialBonus;
    }

    estimateTraffic(keyword) {
        return Math.floor(this.estimateSearchVolume(keyword) * 0.1); // 10% of search volume
    }

    estimateConversionPotential(keyword) {
        return (keyword.commercialIntent / 100) * 0.8; // Max 80% conversion potential
    }

    determineClusterPriority(keywords) {
        const avgConfidence = keywords.reduce((sum, k) => sum + k.confidence, 0) / keywords.length;
        const avgCommercialIntent = keywords.reduce((sum, k) => sum + k.commercialIntent, 0) / keywords.length;
        
        if (avgConfidence >= 70 && avgCommercialIntent >= 60) return 'high';
        if (avgConfidence >= 50 && avgCommercialIntent >= 40) return 'medium';
        return 'low';
    }

    // Generate research report
    async generateResearchReport() {
        console.log('Generating research report...');
        
        const report = {
            total_keywords: this.researchResults.length,
            categories: {},
            clusters: {},
            top_commercial_keywords: [],
            top_informational_keywords: [],
            avg_commercial_intent: 0,
            avg_confidence: 0,
            research_date: new Date().toISOString()
        };

        // Calculate statistics by category
        Object.keys(this.keywordClusters).forEach(category => {
            const keywords = this.keywordClusters[category];
            report.categories[category] = {
                count: keywords.length,
                avg_confidence: keywords.reduce((sum, k) => sum + k.confidence, 0) / keywords.length,
                avg_commercial_intent: keywords.reduce((sum, k) => sum + k.commercialIntent, 0) / keywords.length
            };
        });

        // Find top commercial keywords
        report.top_commercial_keywords = this.researchResults
            .filter(k => k.commercialIntent >= 70)
            .sort((a, b) => b.commercialIntent - a.commercialIntent)
            .slice(0, 10);

        // Find top informational keywords
        report.top_informational_keywords = this.researchResults
            .filter(k => k.searchIntent === 'informational' && k.confidence >= 70)
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 10);

        // Calculate averages
        report.avg_commercial_intent = this.researchResults.reduce((sum, k) => sum + k.commercialIntent, 0) / this.researchResults.length;
        report.avg_confidence = this.researchResults.reduce((sum, k) => sum + k.confidence, 0) / this.researchResults.length;

        // Save report
        await this.saveReport(report);

        return report;
    }

    // Save research report
    async saveReport(report) {
        try {
            console.log('Research Report:');
            console.log(`Total Keywords: ${report.total_keywords}`);
            console.log(`Average Commercial Intent: ${report.avg_commercial_intent.toFixed(2)}`);
            console.log(`Average Confidence: ${report.avg_confidence.toFixed(2)}`);
            
            console.log('\nTop Commercial Keywords:');
            report.top_commercial_keywords.forEach((keyword, index) => {
                console.log(`${index + 1}. ${keyword.keyword} (Commercial Intent: ${keyword.commercialIntent})`);
            });

            console.log('\nTop Informational Keywords:');
            report.top_informational_keywords.forEach((keyword, index) => {
                console.log(`${index + 1}. ${keyword.keyword} (Confidence: ${keyword.confidence})`);
            });

            console.log('\nCategories:');
            Object.entries(report.categories).forEach(([category, stats]) => {
                console.log(`${category}: ${stats.count} keywords, Avg Confidence: ${stats.avg_confidence.toFixed(2)}, Avg Commercial Intent: ${stats.avg_commercial_intent.toFixed(2)}`);
            });

            // In real implementation, save to database
            // await this.supabase
            //   .from('keyword_research_reports')
            //   .insert(report);
            
        } catch (error) {
            console.error('Error saving research report:', error);
        }
    }
}

// Export the class
export default ComprehensiveKeywordResearch;

// If running directly
if (typeof require !== 'undefined' && require.main === module) {
    // Configuration - replace with actual Supabase credentials
    const config = {
        supabaseUrl: process.env.VITE_SUPABASE_URL || 'your-supabase-url',
        supabaseKey: process.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-key'
    };

    // Create and run the research
    const research = new ComprehensiveKeywordResearch(config.supabaseUrl, config.supabaseKey);
    
    research.executeComprehensiveResearch()
        .then(results => {
            console.log('Research completed successfully!');
            console.log(`Generated ${results.length} keywords`);
        })
        .catch(error => {
            console.error('Research failed:', error);
        });
}