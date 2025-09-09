/**
 * Check Broker Data Script
 * Validates the current broker data in Supabase
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

async function checkBrokerData() {
    console.log('🔍 Checking broker data in Supabase...');
    
    try {
        // Get total count
        const { count, error: countError } = await supabase
            .from('brokers')
            .select('*', { count: 'exact', head: true });
            
        if (countError) {
            console.error('❌ Error getting count:', countError.message);
            return;
        }
        
        console.log(`📊 Total brokers in database: ${count}`);
        
        // Get recent brokers
        const { data: recentBrokers, error: recentError } = await supabase
            .from('brokers')
            .select('name, slug, regulation_tier, min_deposit, created_at')
            .order('created_at', { ascending: false })
            .limit(10);
            
        if (recentError) {
            console.error('❌ Error getting recent brokers:', recentError.message);
            return;
        }
        
        console.log('\n📋 Recent brokers:');
        recentBrokers.forEach((broker, index) => {
            console.log(`${index + 1}. ${broker.name}`);
            console.log(`   Slug: ${broker.slug}`);
            console.log(`   Tier: ${broker.regulation_tier}`);
            console.log(`   Min Deposit: ${broker.min_deposit || 'N/A'}`);
            console.log(`   Created: ${new Date(broker.created_at).toLocaleString()}`);
            console.log('');
        });
        
        // Check for duplicates
        const { data: duplicates, error: dupError } = await supabase
            .from('brokers')
            .select('slug, count(*)')
            .group('slug')
            .having('count(*) > 1');
            
        if (dupError) {
            console.log('⚠️  Could not check for duplicates:', dupError.message);
        } else if (duplicates && duplicates.length > 0) {
            console.log('⚠️  Found duplicate slugs:', duplicates);
        } else {
            console.log('✅ No duplicate slugs found');
        }
        
        // Data quality check
        const { data: qualityCheck, error: qualityError } = await supabase
            .from('brokers')
            .select('name, slug, regulation_tier, min_deposit')
            .limit(5);
            
        if (qualityError) {
            console.error('❌ Error in quality check:', qualityError.message);
        } else {
            console.log('\n🔍 Data Quality Sample:');
            qualityCheck.forEach(broker => {
                const issues = [];
                if (!broker.name || broker.name.trim() === '') issues.push('Missing name');
                if (!broker.slug || broker.slug.trim() === '') issues.push('Missing slug');
                if (!broker.regulation_tier) issues.push('Missing regulation tier');
                
                console.log(`- ${broker.name}: ${issues.length === 0 ? '✅ Good' : '⚠️  ' + issues.join(', ')}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
    }
}

if (require.main === module) {
    checkBrokerData();
}

module.exports = { checkBrokerData };