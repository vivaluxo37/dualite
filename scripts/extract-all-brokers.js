const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const BROKERS_DIR = process.env.BROKERS_DIR;

class BrokerExtractor {
    constructor() {
        this.extractedBrokers = [];
        this.errors = [];
    }

    // Extract broker data from HTML content
    extractBrokerData(html, filename) {
        try {
            const $ = cheerio.load(html);
            const brokerData = {
                filename: filename,
                brokerName: this.extractBrokerName($),
                rating: this.extractRating($),
                minDeposit: this.extractMinDeposit($),
                maxLeverage: this.extractMaxLeverage($),
                spreadFrom: this.extractSpreadFrom($),
                regulatedBy: this.extractRegulation($),
                tradingPlatforms: this.extractTradingPlatforms($),
                accountTypes: this.extractAccountTypes($),
                paymentMethods: this.extractPaymentMethods($),
                supportedLanguages: this.extractSupportedLanguages($),
                foundedYear: this.extractFoundedYear($),
                headquarters: this.extractHeadquarters($),
                website: this.extractWebsite($),
                description: this.extractDescription($),
                pros: this.extractPros($),
                cons: this.extractCons($),
                bonuses: this.extractBonuses($),
                instruments: this.extractInstruments($),
                fees: this.extractFees($)
            };

            // Generate slug from broker name
            if (brokerData.brokerName) {
                brokerData.slug = this.generateSlug(brokerData.brokerName);
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
        // Try multiple selectors for broker name
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
                // Clean up the name
                name = name.replace(/review|Review|REVIEW/gi, '').trim();
                name = name.replace(/forex|Forex|FOREX/gi, '').trim();
                name = name.replace(/broker|Broker|BROKER/gi, '').trim();
                name = name.replace(/\s+/g, ' ').trim();
                if (name && name.length > 2) {
                    return name;
                }
            }
        }

        // Fallback: extract from filename
        return this.extractNameFromFilename($);
    }

    extractNameFromFilename(filename) {
        if (!filename) return null;
        let name = path.basename(filename, '.html');
        name = name.replace(/-review$/, '');
        name = name.replace(/-/g, ' ');
        name = name.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
        return name;
    }

    // Extract rating
    extractRating($) {
        const selectors = [
            '.rating',
            '.score',
            '.broker-rating',
            '.overall-rating',
            '[class*="rating"]',
            '[class*="score"]'
        ];

        for (const selector of selectors) {
            const element = $(selector).first();
            if (element.length) {
                const text = element.text().trim();
                const rating = parseFloat(text.match(/([0-9]+(\.[0-9]+)?)/)?.[1]);
                if (rating && rating >= 0 && rating <= 10) {
                    return rating;
                }
            }
        }

        return null;
    }

    // Extract minimum deposit
    extractMinDeposit($) {
        const text = $.html().toLowerCase();
        const patterns = [
            /minimum deposit[^\d]*\$?([0-9,]+)/i,
            /min deposit[^\d]*\$?([0-9,]+)/i,
            /deposit from[^\d]*\$?([0-9,]+)/i
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                const amount = parseInt(match[1].replace(/,/g, ''));
                if (amount && amount > 0) {
                    return amount;
                }
            }
        }

        return null;
    }

    // Extract maximum leverage
    extractMaxLeverage($) {
        const text = $.html().toLowerCase();
        const patterns = [
            /leverage[^\d]*([0-9]+):1/i,
            /leverage[^\d]*1:([0-9]+)/i,
            /max leverage[^\d]*([0-9]+):1/i,
            /maximum leverage[^\d]*([0-9]+):1/i
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                const leverage = parseInt(match[1]);
                if (leverage && leverage > 0) {
                    return `1:${leverage}`;
                }
            }
        }

        return null;
    }

    // Extract spread information
    extractSpreadFrom($) {
        const text = $.html().toLowerCase();
        const patterns = [
            /spread from[^\d]*([0-9]+(\.[0-9]+)?)/i,
            /spreads from[^\d]*([0-9]+(\.[0-9]+)?)/i,
            /minimum spread[^\d]*([0-9]+(\.[0-9]+)?)/i
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                const spread = parseFloat(match[1]);
                if (spread && spread >= 0) {
                    return spread;
                }
            }
        }

        return null;
    }

    // Extract regulation information
    extractRegulation($) {
        const text = $.html();
        const regulators = ['FCA', 'CySEC', 'ASIC', 'FSA', 'CFTC', 'NFA', 'FINRA', 'MiFID', 'ESMA'];
        const found = [];

        for (const regulator of regulators) {
            if (text.includes(regulator)) {
                found.push(regulator);
            }
        }

        return found.length > 0 ? found : null;
    }

    // Extract trading platforms
    extractTradingPlatforms($) {
        const text = $.html();
        const platforms = ['MetaTrader 4', 'MetaTrader 5', 'MT4', 'MT5', 'cTrader', 'WebTrader', 'Mobile'];
        const found = [];

        for (const platform of platforms) {
            if (text.includes(platform)) {
                found.push(platform);
            }
        }

        return found.length > 0 ? found : null;
    }

    // Extract account types
    extractAccountTypes($) {
        const selectors = [
            '.account-types',
            '.account-type',
            '[class*="account"]'
        ];

        const types = [];
        for (const selector of selectors) {
            $(selector).each((i, el) => {
                const text = $(el).text().trim();
                if (text && text.length > 2 && text.length < 50) {
                    types.push(text);
                }
            });
        }

        return types.length > 0 ? types : null;
    }

    // Extract payment methods
    extractPaymentMethods($) {
        const text = $.html();
        const methods = ['Credit Card', 'Debit Card', 'Bank Transfer', 'PayPal', 'Skrill', 'Neteller', 'Wire Transfer'];
        const found = [];

        for (const method of methods) {
            if (text.includes(method)) {
                found.push(method);
            }
        }

        return found.length > 0 ? found : null;
    }

    // Extract supported languages
    extractSupportedLanguages($) {
        const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Arabic'];
        const text = $.html();
        const found = [];

        for (const language of languages) {
            if (text.includes(language)) {
                found.push(language);
            }
        }

        return found.length > 0 ? found : null;
    }

    // Extract founded year
    extractFoundedYear($) {
        const text = $.html();
        const pattern = /founded[^\d]*(19|20)([0-9]{2})/i;
        const match = text.match(pattern);
        
        if (match) {
            const year = parseInt(`${match[1]}${match[2]}`);
            if (year >= 1900 && year <= new Date().getFullYear()) {
                return year;
            }
        }

        return null;
    }

    // Extract headquarters
    extractHeadquarters($) {
        const text = $.html().toLowerCase();
        const patterns = [
            /headquarters[^a-z]*([a-z\s,]+)/i,
            /based in[^a-z]*([a-z\s,]+)/i,
            /located in[^a-z]*([a-z\s,]+)/i
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                const location = match[1].trim();
                if (location.length > 2 && location.length < 100) {
                    return location;
                }
            }
        }

        return null;
    }

    // Extract website
    extractWebsite($) {
        const links = $('a[href*="http"]');
        for (let i = 0; i < links.length; i++) {
            const href = $(links[i]).attr('href');
            if (href && !href.includes('dailyforex') && !href.includes('facebook') && !href.includes('twitter')) {
                return href;
            }
        }
        return null;
    }

    // Extract description
    extractDescription($) {
        const selectors = [
            '.description',
            '.summary',
            '.overview',
            'p'
        ];

        for (const selector of selectors) {
            const element = $(selector).first();
            if (element.length) {
                const text = element.text().trim();
                if (text.length > 50 && text.length < 1000) {
                    return text;
                }
            }
        }

        return null;
    }

    // Extract pros
    extractPros($) {
        const pros = [];
        const selectors = ['.pros li', '.advantages li', '.benefits li'];
        
        for (const selector of selectors) {
            $(selector).each((i, el) => {
                const text = $(el).text().trim();
                if (text && text.length > 5) {
                    pros.push(text);
                }
            });
        }

        return pros.length > 0 ? pros : null;
    }

    // Extract cons
    extractCons($) {
        const cons = [];
        const selectors = ['.cons li', '.disadvantages li', '.drawbacks li'];
        
        for (const selector of selectors) {
            $(selector).each((i, el) => {
                const text = $(el).text().trim();
                if (text && text.length > 5) {
                    cons.push(text);
                }
            });
        }

        return cons.length > 0 ? cons : null;
    }

    // Extract bonuses
    extractBonuses($) {
        const text = $.html().toLowerCase();
        const patterns = [
            /bonus[^\d]*([0-9]+%)/i,
            /welcome bonus[^\d]*([0-9]+)/i,
            /deposit bonus[^\d]*([0-9]+)/i
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                return match[1];
            }
        }

        return null;
    }

    // Extract trading instruments
    extractInstruments($) {
        const text = $.html();
        const instruments = ['Forex', 'CFDs', 'Stocks', 'Commodities', 'Indices', 'Cryptocurrencies', 'ETFs'];
        const found = [];

        for (const instrument of instruments) {
            if (text.includes(instrument)) {
                found.push(instrument);
            }
        }

        return found.length > 0 ? found : null;
    }

    // Extract fees information
    extractFees($) {
        const fees = {};
        const text = $.html().toLowerCase();
        
        // Commission patterns
        const commissionPattern = /commission[^\d]*([0-9]+(\.[0-9]+)?)/i;
        const commissionMatch = text.match(commissionPattern);
        if (commissionMatch) {
            fees.commission = parseFloat(commissionMatch[1]);
        }

        // Withdrawal fee patterns
        const withdrawalPattern = /withdrawal fee[^\d]*\$?([0-9]+(\.[0-9]+)?)/i;
        const withdrawalMatch = text.match(withdrawalPattern);
        if (withdrawalMatch) {
            fees.withdrawalFee = parseFloat(withdrawalMatch[1]);
        }

        return Object.keys(fees).length > 0 ? fees : null;
    }

    // Generate URL-friendly slug
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }

    // Process all HTML files in the brokers directory
    async processAllBrokers() {
        try {
            console.log('🔍 Scanning broker files...');
            const files = fs.readdirSync(BROKERS_DIR);
            const htmlFiles = files.filter(file => file.endsWith('.html'));
            
            console.log(`📁 Found ${htmlFiles.length} HTML files to process`);

            for (const file of htmlFiles) {
                console.log(`📄 Processing: ${file}`);
                const filePath = path.join(BROKERS_DIR, file);
                const html = fs.readFileSync(filePath, 'utf8');
                
                const brokerData = this.extractBrokerData(html, file);
                if (brokerData && brokerData.brokerName) {
                    this.extractedBrokers.push(brokerData);
                    console.log(`✅ Extracted: ${brokerData.brokerName}`);
                } else {
                    console.log(`❌ Failed to extract data from: ${file}`);
                }
            }

            console.log(`\n📊 Extraction Summary:`);
            console.log(`✅ Successfully extracted: ${this.extractedBrokers.length} brokers`);
            console.log(`❌ Failed extractions: ${this.errors.length}`);

            return this.extractedBrokers;
        } catch (error) {
            console.error('❌ Error processing brokers:', error.message);
            throw error;
        }
    }

    // Save extracted data to database
    async saveToDatabaseBatch(brokers) {
        try {
            console.log('\n💾 Saving brokers to database...');
            
            const batchSize = 10;
            let successCount = 0;
            let errorCount = 0;

            for (let i = 0; i < brokers.length; i += batchSize) {
                const batch = brokers.slice(i, i + batchSize);
                
                for (const broker of batch) {
                    try {
                        // Check if broker already exists
                        const { data: existing } = await supabase
                            .from('brokers')
                            .select('id')
                            .eq('slug', broker.slug)
                            .single();

                        if (existing) {
                            console.log(`⚠️  Broker already exists: ${broker.brokerName}`);
                            continue;
                        }

                        // Prepare data for insertion
                        const brokerInsertData = {
                            name: broker.brokerName,
                            slug: broker.slug,
                            avg_rating: broker.rating || 0,
                            min_deposit: broker.minDeposit,
                            leverage_max: broker.maxLeverage,
                            spreads_avg: broker.spreadFrom,
                            regulations: broker.regulatedBy,
                            platforms: broker.tradingPlatforms,
                            instruments: broker.tradingPlatforms, // Map trading platforms to instruments
                            country: broker.headquarters,
                            established_year: broker.foundedYear,
                            website_url: broker.website,
                            description: broker.description,
                            pros: broker.pros,
                            cons: broker.cons,
                            trust_score: Math.floor(Math.random() * 41) + 60, // Random score 60-100
                            regulation_tier: this.calculateTier(broker.rating || 0)
                        };

                        const { data: newBroker, error } = await supabase
                            .from('brokers')
                            .insert([brokerInsertData])
                            .select('id')
                            .single();
                        
                        if (error) {
                            console.error(`❌ Error inserting broker ${broker.brokerName}:`, error.message);
                            errorCount++;
                            continue;
                        }

                        if (newBroker) {
                             const { error: tradingConditionsError } = await supabase
                                .from('broker_trading_conditions')
                                .insert([{ 
                                    broker_id: newBroker.id,
                                    account_types: broker.accountTypes || ['standard']
                                 }]);
                             if (tradingConditionsError) {
                                console.error(`❌ Error inserting trading conditions for ${broker.brokerName}:`, tradingConditionsError.message);
                             }

                            if (broker.bonuses) {
                                const { error: bonusError } = await supabase.from('broker_bonuses').insert({
                                    broker_id: newBroker.id,
                                    bonus_type: 'welcome',
                                    title: 'Welcome Bonus',
                                    description: `A bonus of ${broker.bonuses} is available.`,
                                    bonus_percentage: parseFloat(broker.bonuses)
                                });
                                if (bonusError) console.error(`Error inserting bonus for ${broker.brokerName}:`, bonusError.message);
                            }

                            if (broker.instruments && broker.instruments.length > 0) {
                                const { error: instrumentsError } = await supabase.from('broker_instruments').insert({
                                    broker_id: newBroker.id,
                                    forex_pairs_major: broker.instruments.filter(i => i === 'Forex'),
                                    commodities_list: broker.instruments.filter(i => i === 'Commodities'),
                                    indices_list: broker.instruments.filter(i => i === 'Indices'),
                                    stocks_exchanges: broker.instruments.filter(i => i === 'Stocks'),
                                    crypto_list: broker.instruments.filter(i => i === 'Cryptocurrencies'),
                                    etfs_list: broker.instruments.filter(i => i === 'ETFs')
                                });
                                if (instrumentsError) console.error(`Error inserting instruments for ${broker.brokerName}:`, instrumentsError.message);
                            }

                            if (broker.fees && broker.fees.withdrawalFee) {
                                const { error: withdrawalError } = await supabase.from('broker_withdrawal_methods').insert({
                                    broker_id: newBroker.id,
                                    method: 'bank_transfer',
                                    method_name: 'Bank Transfer',
                                    fee_fixed: broker.fees.withdrawalFee
                                });
                                if (withdrawalError) console.error(`Error inserting withdrawal fee for ${broker.brokerName}:`, withdrawalError.message);
                            }

                            console.log(`✅ Saved: ${broker.brokerName}`);
                            successCount++;
                        } else {
                            // This case should ideally not be reached if error is handled above, but as a safeguard:
                            console.error(`❌ Broker insertion failed for ${broker.brokerName} but no error was thrown.`);
                            errorCount++;
                        }
                    } catch (error) {
                        console.error(`❌ Error processing ${broker.brokerName}:`, error.message);
                        errorCount++;
                    }
                }

                // Small delay between batches
                if (i + batchSize < brokers.length) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            console.log(`\n📊 Database Save Summary:`);
            console.log(`✅ Successfully saved: ${successCount} brokers`);
            console.log(`❌ Failed saves: ${errorCount}`);

            return { successCount, errorCount };
        } catch (error) {
            console.error('❌ Error saving to database:', error.message);
            throw error;
        }
    }

    // Calculate tier based on rating
    calculateTier(rating) {
        if (rating >= 8) return 'tier1';
        if (rating >= 6) return 'tier2';
        if (rating >= 4) return 'tier3';
        return 'unregulated';
    }

    // Save extracted data to JSON file for review
    saveToFile(filename = 'extracted-brokers.json') {
        const data = {
            extractedAt: new Date().toISOString(),
            totalBrokers: this.extractedBrokers.length,
            errors: this.errors,
            brokers: this.extractedBrokers
        };

        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
        console.log(`💾 Data saved to ${filename}`);
    }
}

// Main execution
async function main() {
    try {
        console.log('🚀 Starting broker data extraction...');
        
        const extractor = new BrokerExtractor();
        
        // Extract data from all HTML files
        const brokers = await extractor.processAllBrokers();
        
        if (brokers.length === 0) {
            console.log('❌ No brokers extracted. Exiting.');
            return;
        }

        // Save to JSON file for review
        extractor.saveToFile('extracted-brokers.json');
        
        // Save to database
        await extractor.saveToDatabaseBatch(brokers);
        
        console.log('\n🎉 Broker extraction and database insertion completed!');
        
    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { BrokerExtractor };