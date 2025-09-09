const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: __dirname + '/../.env' });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function refreshSchema() {
    try {
        console.log('🔍 Checking current schema...');
        
        // Force a schema refresh by making a simple query
        const { data, error } = await supabase
            .from('brokers')
            .select('*')
            .limit(1);
            
        if (error) {
            console.error('❌ Schema check failed:', error.message);
            
            // Try to refresh by querying information_schema
            console.log('🔄 Attempting schema refresh...');
            const { data: columns, error: colError } = await supabase
                .from('information_schema.columns')
                .select('column_name')
                .eq('table_name', 'brokers')
                .eq('table_schema', 'public');
                
            if (colError) {
                console.error('❌ Could not query columns:', colError.message);
            } else {
                console.log('📊 Available columns:', columns.map(c => c.column_name));
                
                if (columns.some(c => c.column_name === 'founded_year')) {
                    console.log('✅ founded_year column exists in schema');
                } else {
                    console.log('❌ founded_year column missing from schema');
                }
            }
        } else {
            console.log('✅ Schema query successful');
            if (data && data.length > 0) {
                console.log('📋 Sample broker keys:', Object.keys(data[0]));
            }
        }
        
        // Try a different approach - query with specific column
        const { data: testData, error: testError } = await supabase
            .from('brokers')
            .select('founded_year')
            .limit(1);
            
        if (testError) {
            console.error('❌ Column-specific query failed:', testError.message);
        } else {
            console.log('✅ Column-specific query successful');
        }
        
    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
    }
}

refreshSchema();