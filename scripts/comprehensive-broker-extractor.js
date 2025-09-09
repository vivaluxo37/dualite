const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const BROKERS_DIR = process.env.BROKERS_DIR || path.join(__dirname, '../broker-analysis-html/www.dailyforex.com/forex-brokers');

class ComprehensiveBrokerExtractor {
    constructor() {
        this.extractedBrokers = [];
        this.errors = [];
    }

    // Extract comprehensive broker data from HTML content
    extractBrokerData(html, filename) {
        try {
            const $ = cheerio.load(html);
            const brokerData = {
                filename: filename,
                broker_name: this.extractBrokerName($),
                slug: null,
                website_url: this.extractWebsite($),
                logo_url: this.extractLogo($),
                description: this.extractDescription($),
                founded_year: this.extractFoundedYear($),
                headquarters: this.extractHeadquarters($),
                
                // Regulation
                regulation_tier: this.extractRegulationTier($),
                regulatory_bodies: this.extractRegulatoryBodies($),
                license_numbers: this.extractLicenseNumbers($),
                
                // Trading
                trading_platforms: this.extractTradingPlatforms($),
                account_types: this.extractAccountTypes($),
                min_deposit: this.extractMinDeposit($),
                max_leverage: this.extractMaxLeverage($),
                spread_type: this.extractSpreadType($),
                spread_from: this.extractSpreadFrom($),
                commission_structure: this.extractCommissionStructure($),
                
                // Instruments
                forex_pairs: this.extractForexPairs($),
                cfds_available: this.extractCFDsAvailable($),
                commodities_available: this.extractCommoditiesAvailable($),
                indices_available: this.extractIndicesAvailable($),
                crypto_available: this.extractCryptoAvailable($),
                stocks_available: this.extractStocksAvailable($),
                
                // Features
                mobile_trading: this.extractMobileTrading($),
                demo_account: this.extractDemoAccount($),
                social_trading: this.extractSocialTrading($),
                copy_trading: this.extractCopyTrading($),
                automated_trading: this.extractAutomatedTrading($),
                
                // Support
                customer_support_languages: this.extractSupportLanguages($),
                support_channels: this.extractSupportChannels($),
                support_hours: this.extractSupportHours($),
                
                // Payment
                deposit_methods: this.extractDepositMethods($),
                withdrawal_methods: this.extractWithdrawalMethods($),
                deposit_fees: this.extractDepositFees($),
                withdrawal_fees: this.extractWithdrawalFees($),
                
                // Education
                educational_resources: this.extractEducationalResources($),
                webinars_available: this.extractWebinarsAvailable($),
                market_analysis: this.extractMarketAnalysis($),
                
                // Ratings
                overall_rating: this.extractOverallRating($),
                trust_score: this.extractTrustScore($),
                ease_of_use: this.extractEaseOfUse($),
                customer_service: this.extractCustomerService($),
                fees_rating: this.extractFeesRating($),
                platform_rating: this.extractPlatformRating($),
                
                // Additional
                pros: this.extractPros($),
                cons: this.extractCons($),
                bonuses: this.extractBonuses($),
                
                // Availability
                countries_available: this.extractCountriesAvailable($),
                countries_restricted: this.extractCountriesRestricted($),
                us_clients_accepted: this.extractUSClientsAccepted($),
                
                // Metadata
                last_updated: new Date().toISOString(),
                data_source: 'dailyforex_migration',
                verification_status: 'pending'
            };

            // Generate slug from broker name
            if (brokerData.broker_name) {
                brokerData.slug = this.generateSlug(brokerData.broker_name);
            }

            return brokerData;
        } catch (error) {
            this.errors.push({
                filename: filename,
                error: error.message
            });
            return null;
        }
    }

    // Extract broker name from various possible locations
    extractBrokerName($) {
        const selectors = [
            'h1',
            '.broker-name',
            '.review-title',
            'title',
            '.page-title',
            '.main-title'
        ];

        for (const selector of selectors) {
            const element = $(selector).first();
            if (element.length) {
                let name = element.text().trim();
                name = name.replace(/review|Review|REVIEW/gi, '').trim();
                name = name.replace(/forex|Forex|FOREX/gi, '').trim();
                name = name.replace(/broker|Broker|BROKER/gi, '').trim();
                name = name.replace(/\s+/g, ' ').trim();
                if (name && name.length > 2) {
                    return name;
                }
            }
        }
        return null;
    }

    extractWebsite($) {
        const text = $.html();
        const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
        const matches = text.match(urlPattern);
        return matches ? matches[0] : null;
    }

    extractLogo($) {
        const logoSelectors = ['img[alt*="logo"]', '.logo img', '.broker-logo'];
        for (const selector of logoSelectors) {
            const img = $(selector).first();
            if (img.length) {
                return img.attr('src');
            }
        }
        return null;
    }

    extractDescription($) {
        const selectors = ['.description', '.broker-description', '.overview', 'meta[name="description"]'];
        for (const selector of selectors) {
            const element = $(selector).first();
            if (element.length) {
                return element.text().trim() || element.attr('content');
            }
        }
        return null;
    }

    extractFoundedYear($) {
        const text = $.html();
        const yearPattern = /founded[^\d]*(19|20)\d{2}/i;
        const match = text.match(yearPattern);
        return match ? parseInt(match[1] + match[2]) : null;
    }

    extractHeadquarters($) {
        const text = $.html();
        const patterns = [
            /headquarters[^\w]*([^\n\.]{10,50})/i,
            /based in[^\w]*([^\n\.]{10,50})/i
        ];
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) return match[1].trim();
        }
        return null;
    }

    extractRegulationTier($) {
        const text = $.html().toLowerCase();
        if (text.includes('tier 1') || text.includes('fca') || text.includes('cftc')) return 'tier_1';
        if (text.includes('tier 2') || text.includes('cysec') || text.includes('asic')) return 'tier_2';
        if (text.includes('tier 3') || text.includes('offshore')) return 'tier_3';
        return 'unregulated';
    }

    extractRegulatoryBodies($) {
        const text = $.html();
        const regulators = ['FCA', 'CySEC', 'ASIC', 'FSA', 'CFTC', 'NFA', 'FINRA', 'MiFID', 'ESMA'];
        const found = [];
        regulators.forEach(reg => {
            if (text.includes(reg)) found.push(reg);
        });
        return found.length > 0 ? found : null;
    }

    extractLicenseNumbers($) {
        const text = $.html();
        const licensePattern = /license[^\d]*(\d{4,})/gi;
        const matches = [];
        let match;
        while ((match = licensePattern.exec(text)) !== null) {
            matches.push(match[1]);
        }
        return matches.length > 0 ? matches : null;
    }

    extractTradingPlatforms($) {
        const text = $.html();
        const platforms = ['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'TradingView', 'WebTrader'];
        const found = [];
        platforms.forEach(platform => {
            if (text.toLowerCase().includes(platform.toLowerCase())) {
                found.push(platform);
            }
        });
        return found.length > 0 ? found : null;
    }

    extractAccountTypes($) {
        const text = $.html();
        const types = ['Standard', 'Premium', 'VIP', 'ECN', 'STP', 'Demo'];
        const found = [];
        types.forEach(type => {
            if (text.toLowerCase().includes(type.toLowerCase())) {
                found.push(type);
            }
        });
        return found.length > 0 ? found : null;
    }

    extractMinDeposit($) {
        const text = $.html().toLowerCase();
        const patterns = [
            /minimum deposit[^\d]*\$?([0-9,]+)/i,
            /min deposit[^\d]*\$?([0-9,]+)/i
        ];
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                return parseInt(match[1].replace(/,/g, ''));
            }
        }
        return null;
    }

    extractMaxLeverage($) {
        const text = $.html().toLowerCase();
        const patterns = [
            /leverage[^\d]*([0-9]+):1/i,
            /leverage[^\d]*1:([0-9]+)/i
        ];
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                return `1:${match[1]}`;
            }
        }
        return null;
    }

    extractSpreadType($) {
        const text = $.html().toLowerCase();
        if (text.includes('variable spread')) return 'variable';
        if (text.includes('fixed spread')) return 'fixed';
        if (text.includes('floating spread')) return 'variable';
        return null;
    }

    extractSpreadFrom($) {
        const text = $.html().toLowerCase();
        const patterns = [
            /spread from[^\d]*([0-9]+(?:\.[0-9]+)?)/i,
            /spreads from[^\d]*([0-9]+(?:\.[0-9]+)?)/i
        ];
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                return parseFloat(match[1]);
            }
        }
        return null;
    }

    extractCommissionStructure($) {
        const text = $.html().toLowerCase();
        if (text.includes('commission free') || text.includes('no commission')) return 'commission_free';
        if (text.includes('per trade')) return 'per_trade';
        if (text.includes('per lot')) return 'per_lot';
        return null;
    }

    // Simple extraction methods for boolean/numeric fields
    extractForexPairs($) {
        const text = $.html();
        const match = text.match(/(\d+)\s*(?:forex|currency)\s*pairs/i);
        return match ? parseInt(match[1]) : null;
    }

    extractCFDsAvailable($) {
        return $.html().toLowerCase().includes('cfd');
    }

    extractCommoditiesAvailable($) {
        return $.html().toLowerCase().includes('commodities');
    }

    extractIndicesAvailable($) {
        return $.html().toLowerCase().includes('indices');
    }

    extractCryptoAvailable($) {
        const text = $.html().toLowerCase();
        return text.includes('crypto') || text.includes('bitcoin');
    }

    extractStocksAvailable($) {
        return $.html().toLowerCase().includes('stocks');
    }

    extractMobileTrading($) {
        const text = $.html().toLowerCase();
        return text.includes('mobile') && text.includes('trading');
    }

    extractDemoAccount($) {
        return $.html().toLowerCase().includes('demo account');
    }

    extractSocialTrading($) {
        return $.html().toLowerCase().includes('social trading');
    }

    extractCopyTrading($) {
        return $.html().toLowerCase().includes('copy trading');
    }

    extractAutomatedTrading($) {
        const text = $.html().toLowerCase();
        return text.includes('automated trading') || text.includes('expert advisor');
    }

    extractSupportLanguages($) {
        const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Arabic'];
        const text = $.html();
        const found = [];
        languages.forEach(lang => {
            if (text.includes(lang)) found.push(lang);
        });
        return found.length > 0 ? found : null;
    }

    extractSupportChannels($) {
        const channels = ['Live Chat', 'Email', 'Phone', 'Ticket System'];
        const text = $.html().toLowerCase();
        const found = [];
        channels.forEach(channel => {
            if (text.includes(channel.toLowerCase())) found.push(channel);
        });
        return found.length > 0 ? found : null;
    }

    extractSupportHours($) {
        const text = $.html();
        const patterns = [
            /24\/7/i,
            /24 hours/i,
            /business hours/i
        ];
        for (const pattern of patterns) {
            if (pattern.test(text)) {
                return text.match(pattern)[0];
            }
        }
        return null;
    }

    extractDepositMethods($) {
        const methods = ['Credit Card', 'Bank Transfer', 'PayPal', 'Skrill', 'Neteller', 'WebMoney', 'Bitcoin'];
        const text = $.html();
        const found = [];
        methods.forEach(method => {
            if (text.toLowerCase().includes(method.toLowerCase())) found.push(method);
        });
        return found.length > 0 ? found : null;
    }

    extractWithdrawalMethods($) {
        return this.extractDepositMethods($); // Usually same as deposit methods
    }

    extractDepositFees($) {
        const text = $.html().toLowerCase();
        if (text.includes('no deposit fee') || text.includes('free deposit')) return 'free';
        const match = text.match(/deposit fee[^\d]*([0-9.]+)%/i);
        return match ? `${match[1]}%` : null;
    }

    extractWithdrawalFees($) {
        const text = $.html().toLowerCase();
        if (text.includes('no withdrawal fee') || text.includes('free withdrawal')) return 'free';
        const match = text.match(/withdrawal fee[^\d]*\$?([0-9.]+)/i);
        return match ? `$${match[1]}` : null;
    }

    extractEducationalResources($) {
        return $.html().toLowerCase().includes('education');
    }

    extractWebinarsAvailable($) {
        return $.html().toLowerCase().includes('webinar');
    }

    extractMarketAnalysis($) {
        const text = $.html().toLowerCase();
        return text.includes('market analysis') || text.includes('research');
    }

    extractOverallRating($) {
        const selectors = ['.rating', '.score', '.overall-rating'];
        for (const selector of selectors) {
            const element = $(selector).first();
            if (element.length) {
                const rating = parseFloat(element.text().match(/([0-9]+(?:\.[0-9]+)?)/)?.[1]);
                if (rating && rating >= 0 && rating <= 10) {
                    return rating;
                }
            }
        }
        return null;
    }

    extractTrustScore($) {
        return this.extractOverallRating($); // Use same logic as overall rating
    }

    extractEaseOfUse($) {
        return Math.floor(Math.random() * 5) + 1; // Placeholder
    }

    extractCustomerService($) {
        return Math.floor(Math.random() * 5) + 1; // Placeholder
    }

    extractFeesRating($) {
        return Math.floor(Math.random() * 5) + 1; // Placeholder
    }

    extractPlatformRating($) {
        return Math.floor(Math.random() * 5) + 1; // Placeholder
    }

    extractPros($) {
        const prosSection = $('.pros, .advantages, .benefits').text();
        if (prosSection) {
            return prosSection.split('\n').filter(item => item.trim().length > 0);
        }
        return null;
    }

    extractCons($) {
        const consSection = $('.cons, .disadvantages, .drawbacks').text();
        if (consSection) {
            return consSection.split('\n').filter(item => item.trim().length > 0);
        }
        return null;
    }

    extractBonuses($) {
        const text = $.html();
        const bonusPattern = /bonus[^\d]*\$?([0-9,]+)/i;
        const match = text.match(bonusPattern);
        return match ? match[0] : null;
    }

    extractCountriesAvailable($) {
        const text = $.html();
        const countries = ['United States', 'United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Australia', 'Canada'];
        const found = [];
        countries.forEach(country => {
            if (text.includes(country)) found.push(country);
        });
        return found.length > 0 ? found : null;
    }

    extractCountriesRestricted($) {
        const text = $.html().toLowerCase();
        if (text.includes('us clients not accepted') || text.includes('restricted in us')) {
            return ['United States'];
        }
        return null;
    }

    extractUSClientsAccepted($) {
        const text = $.html().toLowerCase();
        if (text.includes('us clients accepted') || text.includes('accepts us')) return true;
        if (text.includes('us clients not accepted') || text.includes('no us')) return false;
        return null;
    }

    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // Process all broker files
    async processAllBrokers() {
        try {
            console.log(`Processing brokers from: ${BROKERS_DIR}`);
            
            if (!fs.existsSync(BROKERS_DIR)) {
                console.error(`Directory not found: ${BROKERS_DIR}`);
                return;
            }

            const files = fs.readdirSync(BROKERS_DIR)
                .filter(file => file.endsWith('.html') && !file.includes('index.html') && !file.includes('best-forex-brokers.html'));
                // Process all available broker files

            console.log(`Found ${files.length} HTML files to process`);

            for (const file of files) {
                const filePath = path.join(BROKERS_DIR, file);
                const html = fs.readFileSync(filePath, 'utf8');
                
                console.log(`Processing: ${file}`);
                const brokerData = this.extractBrokerData(html, file);
                
                if (brokerData && brokerData.broker_name) {
                    this.extractedBrokers.push(brokerData);
                    console.log(`✓ Extracted: ${brokerData.broker_name}`);
                } else {
                    console.log(`✗ Failed to extract: ${file}`);
                }
            }

            await this.saveBrokersToSupabase();
            this.generateReport();

        } catch (error) {
            console.error('Error processing brokers:', error);
        }
    }

    // Save extracted brokers to Supabase
    async saveBrokersToSupabase() {
        if (this.extractedBrokers.length === 0) {
            console.log('No brokers to save');
            return;
        }

        try {
            console.log(`\nSaving ${this.extractedBrokers.length} brokers to Supabase...`);
        
        // Map comprehensive data to existing brokers table schema
        const mappedData = this.extractedBrokers.map(broker => {
                // Convert regulation tier to match enum
                let regulationTier = 'unregulated';
                if (broker.regulation_tier) {
                    const tier = broker.regulation_tier.toLowerCase();
                    if (['tier1', 'tier2', 'tier3'].includes(tier)) {
                        regulationTier = tier;
                    }
                }

                // Prepare platforms array
                const platforms = broker.trading_platforms ? 
                    (Array.isArray(broker.trading_platforms) ? broker.trading_platforms : [broker.trading_platforms]) : [];

                // Prepare instruments array
                const instruments = [];
                if (broker.forex_pairs) instruments.push('Forex');
                if (broker.cfds_available) instruments.push('CFDs');
                if (broker.commodities_available) instruments.push('Commodities');
                if (broker.indices_available) instruments.push('Indices');
                if (broker.crypto_available) instruments.push('Crypto');
                if (broker.stocks_available) instruments.push('Stocks');

                // Prepare regulations array
                const regulations = broker.regulatory_bodies ? 
                    (Array.isArray(broker.regulatory_bodies) ? broker.regulatory_bodies : [broker.regulatory_bodies]) : [];

                // Store additional data in fees JSONB field
                const fees = {
                    deposit_methods: broker.deposit_methods,
                    withdrawal_methods: broker.withdrawal_methods,
                    deposit_fees: broker.deposit_fees,
                    withdrawal_fees: broker.withdrawal_fees,
                    commission_structure: broker.commission_structure,
                    spread_type: broker.spread_type,
                    spread_from: broker.spread_from
                };

                return {
                    name: broker.broker_name || 'Unknown Broker',
                    slug: broker.slug || this.generateSlug(broker.broker_name || 'unknown'),
                    logo_url: broker.logo_url,
                    country: broker.headquarters || 'Unknown',
                    established_year: broker.founded_year ? parseInt(broker.founded_year) : null,
                    website_url: broker.website_url,
                    min_deposit: broker.min_deposit ? parseFloat(broker.min_deposit.toString().replace(/[^0-9.]/g, '')) : null,
                    spreads_avg: broker.spread_from ? parseFloat(broker.spread_from.toString().replace(/[^0-9.]/g, '')) : null,
                    leverage_max: broker.max_leverage,
                    platforms: platforms,
                    instruments: instruments,
                    regulations: regulations,
                    regulation_tier: regulationTier,
                    trust_score: broker.trust_score ? parseInt(broker.trust_score) : null,
                    fees: fees,
                    avg_rating: broker.overall_rating ? parseFloat(broker.overall_rating) : 0,
                    description: broker.description,
                    pros: broker.pros ? (Array.isArray(broker.pros) ? broker.pros : [broker.pros]) : [],
                    cons: broker.cons ? (Array.isArray(broker.cons) ? broker.cons : [broker.cons]) : [],
                    is_active: true,
                    featured: false
                };
            });
            
            for (const broker of mappedData) {
                const { error } = await supabase
                    .from('brokers')
                    .upsert(broker, { 
                        onConflict: 'slug',
                        ignoreDuplicates: false 
                    });

                if (error) {
                    console.error(`Error saving ${broker.name}:`, error.message);
                    this.errors.push({
                        broker: broker.name,
                        error: error.message
                    });
                } else {
                    console.log(`✓ Saved: ${broker.name}`);
                }
            }

        } catch (error) {
            console.error('Error saving to Supabase:', error);
        }
    }

    // Generate extraction report
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            total_processed: this.extractedBrokers.length,
            successful_extractions: this.extractedBrokers.filter(b => b.broker_name).length,
            errors: this.errors,
            brokers: this.extractedBrokers.map(b => ({
                name: b.broker_name,
                slug: b.slug,
                regulation_tier: b.regulation_tier,
                min_deposit: b.min_deposit,
                overall_rating: b.overall_rating
            }))
        };

        const reportPath = path.join(__dirname, 'comprehensive-extraction-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log('\n=== EXTRACTION REPORT ===');
        console.log(`Total processed: ${report.total_processed}`);
        console.log(`Successful: ${report.successful_extractions}`);
        console.log(`Errors: ${report.errors.length}`);
        console.log(`Report saved: ${reportPath}`);
        
        if (report.errors.length > 0) {
            console.log('\nErrors:');
            report.errors.forEach(err => {
                console.log(`- ${err.filename || err.broker}: ${err.error}`);
            });
        }
    }
}

// Run the extractor
if (require.main === module) {
    const extractor = new ComprehensiveBrokerExtractor();
    extractor.processAllBrokers()
        .then(() => {
            console.log('\nExtraction completed!');
            process.exit(0);
        })
        .catch(error => {
            console.error('Extraction failed:', error);
            process.exit(1);
        });
}

module.exports = ComprehensiveBrokerExtractor;