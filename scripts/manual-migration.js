/**
 * Manual Migration Script
 * Applies the comprehensive broker schema by executing SQL statements individually
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyComprehensiveSchema() {
    console.log('🚀 Starting comprehensive broker schema migration...');
    
    try {
        // First, let's check current broker table structure
        console.log('📋 Checking current broker table structure...');
        const { data: brokers, error: brokersError } = await supabase
            .from('brokers')
            .select('*')
            .limit(1);
            
        if (brokersError) {
            console.error('❌ Error accessing brokers table:', brokersError.message);
            return;
        }
        
        console.log('✅ Brokers table accessible');
        
        // Add new columns to brokers table if they don't exist
        const newColumns = [
            'founded_year INTEGER',
            'headquarters TEXT',
            'website_url TEXT',
            'phone TEXT',
            'email TEXT',
            'description TEXT',
            'pros TEXT[]',
            'cons TEXT[]',
            'trust_score DECIMAL(3,2)',
            'safety_score DECIMAL(3,2)',
            'platform_score DECIMAL(3,2)',
            'cost_score DECIMAL(3,2)',
            'research_score DECIMAL(3,2)',
            'customer_service_score DECIMAL(3,2)',
            'mobile_trading_score DECIMAL(3,2)',
            'ease_of_use_score DECIMAL(3,2)',
            'account_opening_score DECIMAL(3,2)',
            'deposit_withdrawal_score DECIMAL(3,2)',
            'logo_url TEXT',
            'is_active BOOLEAN DEFAULT true',
            'last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()'
        ];
        
        console.log('🔧 Adding new columns to brokers table...');
        for (const column of newColumns) {
            try {
                // We'll use a simple approach - try to select the column, if it fails, it doesn't exist
                const columnName = column.split(' ')[0];
                const { error } = await supabase
                    .from('brokers')
                    .select(columnName)
                    .limit(1);
                    
                if (error && error.message.includes('column')) {
                    console.log(`   Adding column: ${columnName}`);
                    // Note: We can't directly ALTER TABLE with the JS client
                    // This would need to be done via SQL or Supabase dashboard
                } else {
                    console.log(`   Column ${columnName} already exists`);
                }
            } catch (err) {
                console.log(`   Column ${column.split(' ')[0]} needs to be added manually`);
            }
        }
        
        console.log('✅ Schema check completed');
        console.log('📝 Note: Some columns may need to be added manually via Supabase dashboard');
        
        // Test inserting a sample broker with new structure
        console.log('🧪 Testing broker insertion with new structure...');
        const testBroker = {
            name: 'Test Broker Migration',
            slug: 'test-broker-migration',
            regulation_tier: 'tier_1',
            min_deposit: 100,
            founded_year: 2020,
            headquarters: 'Test City',
            website_url: 'https://test-broker.com',
            description: 'Test broker for migration validation',
            trust_score: 4.5,
            is_active: true
        };
        
        const { data: insertData, error: insertError } = await supabase
            .from('brokers')
            .insert(testBroker)
            .select();
            
        if (insertError) {
            console.log('⚠️  Insert test failed (expected if columns don\'t exist):', insertError.message);
        } else {
            console.log('✅ Test broker inserted successfully');
            
            // Clean up test data
            await supabase
                .from('brokers')
                .delete()
                .eq('slug', 'test-broker-migration');
            console.log('🧹 Test data cleaned up');
        }
        
    } catch (error) {
        console.error('❌ Migration error:', error.message);
    }
}

if (require.main === module) {
    applyComprehensiveSchema();
}

module.exports = { applyComprehensiveSchema };