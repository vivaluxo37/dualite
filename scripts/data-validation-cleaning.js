/**
 * Data Validation and Cleaning Script
 * Validates and cleans broker data in Supabase
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Known regulated brokers mapping
const REGULATION_MAPPING = {
    'admirals': 'tier1',
    'avatrade': 'tier1', 
    'axi': 'tier1',
    'capital.com': 'tier1',
    'cmc-markets': 'tier1',
    'dukascopy': 'tier1',
    'etoro': 'tier1',
    'exness': 'tier1',
    'fbs': 'tier1',
    'fp-markets': 'tier1',
    'fxcm': 'tier1',
    'alpari': 'tier2',
    'bdswiss': 'tier2',
    'eightcap': 'tier2',
    'easymarkets': 'tier2',
    'blackbull-markets': 'tier2'
};

// Clean broker names (remove [year] placeholders)
function cleanBrokerName(name) {
    return name
        .replace(/\[year\]/gi, '')
        .replace(/\s+/g, ' ')
        .replace(/\s+-\s+Pros\s+&\s+Cons\s+Revealed/gi, '')
        .trim();
}

// Determine regulation tier based on broker name
function determineRegulationTier(slug, name) {
    const lowerSlug = slug.toLowerCase();
    
    // Check direct mapping
    for (const [key, tier] of Object.entries(REGULATION_MAPPING)) {
        if (lowerSlug.includes(key)) {
            return tier;
        }
    }
    
    // Check for funding/prop trading companies (usually unregulated)
    const fundingKeywords = ['funding', 'funded', 'ftmo', 'prop', 'challenge'];
    if (fundingKeywords.some(keyword => lowerSlug.includes(keyword))) {
        return 'unregulated';
    }
    
    // Check for crypto exchanges
    const cryptoKeywords = ['binance', 'coinbase', 'crypto.com'];
    if (cryptoKeywords.some(keyword => lowerSlug.includes(keyword))) {
        return 'tier2'; // Most crypto exchanges are regulated but tier 2
    }
    
    // Default to tier2 for unknown brokers
    return 'tier2';
}

async function validateAndCleanData() {
    console.log('🧹 Starting data validation and cleaning...');
    
    try {
        // Get all brokers
        const { data: brokers, error: fetchError } = await supabase
            .from('brokers')
            .select('id, name, slug, regulation_tier, min_deposit');
            
        if (fetchError) {
            console.error('❌ Error fetching brokers:', fetchError.message);
            return;
        }
        
        console.log(`📊 Processing ${brokers.length} brokers...`);
        
        let updatedCount = 0;
        let cleanedNames = 0;
        let fixedRegulation = 0;
        
        for (const broker of brokers) {
            const updates = {};
            let needsUpdate = false;
            
            // Clean broker name
            const cleanedName = cleanBrokerName(broker.name);
            if (cleanedName !== broker.name) {
                updates.name = cleanedName;
                needsUpdate = true;
                cleanedNames++;
            }
            
            // Fix regulation tier
            const correctTier = determineRegulationTier(broker.slug, broker.name);
            if (correctTier !== broker.regulation_tier) {
                updates.regulation_tier = correctTier;
                needsUpdate = true;
                fixedRegulation++;
            }
            
            // Update if needed
            if (needsUpdate) {
                const { error: updateError } = await supabase
                    .from('brokers')
                    .update(updates)
                    .eq('id', broker.id);
                    
                if (updateError) {
                    console.error(`❌ Error updating ${broker.name}:`, updateError.message);
                } else {
                    updatedCount++;
                    console.log(`✓ Updated: ${broker.name}`);
                }
            }
        }
        
        console.log('\n📈 Cleaning Summary:');
        console.log(`- Total brokers processed: ${brokers.length}`);
        console.log(`- Brokers updated: ${updatedCount}`);
        console.log(`- Names cleaned: ${cleanedNames}`);
        console.log(`- Regulation tiers fixed: ${fixedRegulation}`);
        
        // Generate validation report
        await generateValidationReport();
        
    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
    }
}

async function generateValidationReport() {
    console.log('\n📋 Generating validation report...');
    
    try {
        // Get updated data
        const { data: brokers, error } = await supabase
            .from('brokers')
            .select('name, slug, regulation_tier, min_deposit');
            
        if (error) {
            console.error('❌ Error generating report:', error.message);
            return;
        }
        
        // Count by regulation tier
        const tierCounts = brokers.reduce((acc, broker) => {
            acc[broker.regulation_tier] = (acc[broker.regulation_tier] || 0) + 1;
            return acc;
        }, {});
        
        // Count brokers with min deposit
        const withMinDeposit = brokers.filter(b => b.min_deposit !== null).length;
        
        // Find potential issues
        const issues = [];
        brokers.forEach(broker => {
            if (!broker.name || broker.name.trim() === '') {
                issues.push(`Missing name: ${broker.slug}`);
            }
            if (broker.name && broker.name.includes('[year]')) {
                issues.push(`Uncleaned name: ${broker.name}`);
            }
        });
        
        const report = {
            timestamp: new Date().toISOString(),
            total_brokers: brokers.length,
            regulation_tiers: tierCounts,
            brokers_with_min_deposit: withMinDeposit,
            data_quality_issues: issues,
            sample_brokers: brokers.slice(0, 5).map(b => ({
                name: b.name,
                slug: b.slug,
                tier: b.regulation_tier,
                min_deposit: b.min_deposit
            }))
        };
        
        // Save report
        const fs = require('fs');
        const reportPath = 'scripts/data-validation-report.json';
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log('\n📊 Validation Report:');
        console.log(`- Total brokers: ${report.total_brokers}`);
        console.log('- Regulation tiers:');
        Object.entries(report.regulation_tiers).forEach(([tier, count]) => {
            console.log(`  * ${tier}: ${count}`);
        });
        console.log(`- Brokers with min deposit: ${report.brokers_with_min_deposit}`);
        console.log(`- Data quality issues: ${report.data_quality_issues.length}`);
        
        if (report.data_quality_issues.length > 0) {
            console.log('\n⚠️  Issues found:');
            report.data_quality_issues.forEach(issue => console.log(`  - ${issue}`));
        }
        
        console.log(`\n📄 Full report saved: ${reportPath}`);
        
    } catch (error) {
        console.error('❌ Error generating report:', error.message);
    }
}

if (require.main === module) {
    validateAndCleanData();
}

module.exports = { validateAndCleanData, generateValidationReport };