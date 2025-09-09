const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://efxpwrnxdorgzcqhbnfn.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAzMzIzNSwiZXhwIjoyMDcyNjA5MjM1fQ.BKmSaW8dSc6soQZOh7zZGXMNO-evJZkSbLVJzxoYSYA';

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeDirectSQL() {
  try {
    console.log('Testing direct SQL execution...');
    
    // Test 1: Simple column addition
    console.log('\n1. Adding founded_year column to brokers table...');
    const { data: result1, error: error1 } = await supabase
      .from('brokers')
      .select('*')
      .limit(0);
    
    if (error1) {
      console.log('Error accessing brokers table:', error1.message);
    } else {
      console.log('✓ Brokers table accessible');
    }
    
    // Test 2: Try using raw SQL through REST API
    console.log('\n2. Testing REST API SQL execution...');
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
        sql: 'SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\';'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✓ REST API response:', data);
    } else {
      const errorText = await response.text();
      console.log('REST API error:', errorText);
    }
    
    // Test 3: Try creating a simple table using .sql() method
    console.log('\n3. Testing .sql() method...');
    try {
      const { data: sqlResult, error: sqlError } = await supabase
        .sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
      
      if (sqlError) {
        console.log('SQL method error:', sqlError.message);
      } else {
        console.log('✓ SQL method works:', sqlResult);
      }
    } catch (sqlErr) {
      console.log('SQL method not available:', sqlErr.message);
    }
    
    // Test 4: Try using the database URL directly
    console.log('\n4. Testing database connection info...');
    console.log('Supabase URL:', supabaseUrl);
    console.log('Service key length:', supabaseServiceKey.length);
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
executeDirectSQL();