const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://efxpwrnxdorgzcqhbnfn.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAzMzIzNSwiZXhwIjoyMDcyNjA5MjM1fQ.BKmSaW8dSc6soQZOh7zZGXMNO-evJZkSbLVJzxoYSYA';

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, serviceKey);

async function executeSchemaChanges() {
  try {
    console.log('Starting schema migration using Supabase client...');
    
    // Step 1: Add columns to brokers table using ALTER TABLE
    console.log('\n=== Step 1: Adding columns to brokers table ===');
    
    const brokerColumns = [
      'founded_year INTEGER',
      'dailyforex_rating DECIMAL(3,2)',
      'headquarters TEXT',
      'website_url TEXT',
      'phone TEXT',
      'email TEXT',
      'min_deposit DECIMAL(10,2)',
      'max_leverage TEXT',
      'spread_type TEXT',
      'commission_structure TEXT',
      'trading_platforms TEXT[]',
      'account_types TEXT[]',
      'regulatory_bodies TEXT[]',
      'license_numbers TEXT[]'
    ];
    
    for (const column of brokerColumns) {
      try {
        // Use raw SQL through the REST API
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceKey}`,
            'apikey': serviceKey,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            query: `ALTER TABLE brokers ADD COLUMN IF NOT EXISTS ${column};`
          })
        });
        
        if (response.ok || response.status === 409) {
          console.log(`✓ Added column: ${column.split(' ')[0]}`);
        } else {
          console.log(`✗ Failed to add column: ${column.split(' ')[0]}`);
        }
      } catch (error) {
        console.log(`✗ Error adding column ${column.split(' ')[0]}:`, error.message);
      }
    }
    
    // Step 2: Try to create enum types using direct table inserts
    console.log('\n=== Step 2: Creating lookup tables instead of enums ===');
    
    // Create execution_types lookup table
    try {
      const { error: execError } = await supabase
        .from('execution_types')
        .insert([
          { name: 'market' },
          { name: 'instant' },
          { name: 'request' }
        ]);
      
      if (!execError || execError.code === '23505') { // 23505 is unique violation
        console.log('✓ Execution types data ready');
      } else {
        console.log('✗ Failed to create execution types:', execError.message);
      }
    } catch (error) {
      console.log('Note: execution_types table may not exist yet');
    }
    
    // Step 3: Create simple tables using Supabase client
    console.log('\n=== Step 3: Creating additional tables ===');
    
    // Try to insert test data to verify broker table structure
    console.log('\n=== Step 4: Testing broker table structure ===');
    try {
      const { data: brokers, error: brokersError } = await supabase
        .from('brokers')
        .select('id, name, founded_year, dailyforex_rating')
        .limit(1);
      
      if (!brokersError) {
        console.log('✓ Broker table structure verified');
        console.log('Sample broker data:', brokers);
      } else {
        console.log('✗ Broker table verification failed:', brokersError.message);
      }
    } catch (error) {
      console.log('✗ Error verifying broker table:', error.message);
    }
    
    // Step 5: Check current table structure
    console.log('\n=== Step 5: Checking current database schema ===');
    try {
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (!tablesError) {
        console.log('Current tables:');
        tables.forEach(table => console.log(`- ${table.table_name}`));
      } else {
        console.log('Could not fetch table list:', tablesError.message);
      }
    } catch (error) {
      console.log('Note: Cannot access information_schema directly');
    }
    
    console.log('\n=== Migration Attempt Complete ===');
    console.log('Note: Some operations may have failed due to Supabase client limitations.');
    console.log('The database schema may need to be updated through the Supabase dashboard.');
    
  } catch (error) {
    console.error('Migration failed:', error.message);
  }
}

// Run the migration
executeSchemaChanges();