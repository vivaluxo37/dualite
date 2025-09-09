const fs = require('fs');
const path = require('path');

// Supabase configuration
const supabaseUrl = 'https://efxpwrnxdorgzcqhbnfn.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAzMzIzNSwiZXhwIjoyMDcyNjA5MjM1fQ.BKmSaW8dSc6soQZOh7zZGXMNO-evJZkSbLVJzxoYSYA';

// Execute individual SQL statements through Supabase REST API
async function executeSQL(sql) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey
      },
      body: JSON.stringify({ query: sql })
    });
    
    if (response.ok) {
      const result = await response.json();
      return { success: true, result };
    } else {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Create a custom SQL execution function in the database
async function createSQLExecutor() {
  const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(query text)
    RETURNS text
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE query;
      RETURN 'SUCCESS';
    EXCEPTION
      WHEN OTHERS THEN
        RETURN 'ERROR: ' || SQLERRM;
    END;
    $$;
  `;
  
  console.log('Creating SQL executor function...');
  const result = await executeSQL(createFunctionSQL);
  
  if (result.success) {
    console.log('✓ SQL executor function created');
    return true;
  } else {
    console.log('✗ Failed to create SQL executor:', result.error);
    return false;
  }
}

// Execute migration using the custom function
async function executeMigrationWithRPC() {
  try {
    console.log('Starting Supabase RPC migration...');
    
    // First, try to create the SQL executor function
    const executorCreated = await createSQLExecutor();
    
    if (!executorCreated) {
      console.log('\nTrying alternative approach - manual SQL execution...');
      return await executeManualMigration();
    }
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20250115_comprehensive_broker_schema.sql');
    
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${migrationPath}`);
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log('✓ Migration file loaded');
    
    // Split SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`\nExecuting ${statements.length} SQL statements...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      const result = await executeSQL(`SELECT exec_sql($1)`, [statement]);
      
      if (result.success && result.result && result.result[0]?.exec_sql === 'SUCCESS') {
        console.log(`✓ Statement ${i + 1}/${statements.length} executed successfully`);
        successCount++;
      } else {
        console.log(`✗ Statement ${i + 1}/${statements.length} failed:`, result.error || result.result);
        errorCount++;
      }
    }
    
    console.log(`\n=== Migration Summary ===`);
    console.log(`Successful statements: ${successCount}`);
    console.log(`Failed statements: ${errorCount}`);
    console.log(`Total statements: ${statements.length}`);
    
  } catch (error) {
    console.error('Migration failed:', error.message);
  }
}

// Manual migration approach - execute key statements individually
async function executeManualMigration() {
  console.log('\n=== Manual Migration Approach ===');
  
  const keyStatements = [
    // Create enum types
    "CREATE TYPE execution_type AS ENUM ('market', 'instant', 'request');",
    "CREATE TYPE payment_method AS ENUM ('credit_card', 'bank_transfer', 'e_wallet', 'crypto', 'other');",
    "CREATE TYPE support_channel AS ENUM ('live_chat', 'email', 'phone', 'ticket_system', 'social_media');",
    "CREATE TYPE security_feature AS ENUM ('two_factor_auth', 'ssl_encryption', 'segregated_accounts', 'negative_balance_protection', 'regulatory_compliance');",
    
    // Add columns to brokers table
    "ALTER TABLE brokers ADD COLUMN IF NOT EXISTS founded_year INTEGER;",
    "ALTER TABLE brokers ADD COLUMN IF NOT EXISTS dailyforex_rating DECIMAL(3,2);",
    "ALTER TABLE brokers ADD COLUMN IF NOT EXISTS headquarters TEXT;",
    "ALTER TABLE brokers ADD COLUMN IF NOT EXISTS website_url TEXT;",
    "ALTER TABLE brokers ADD COLUMN IF NOT EXISTS phone TEXT;",
    "ALTER TABLE brokers ADD COLUMN IF NOT EXISTS email TEXT;",
    "ALTER TABLE brokers ADD COLUMN IF NOT EXISTS min_deposit DECIMAL(10,2);",
    "ALTER TABLE brokers ADD COLUMN IF NOT EXISTS max_leverage TEXT;",
    "ALTER TABLE brokers ADD COLUMN IF NOT EXISTS spread_type TEXT;",
    "ALTER TABLE brokers ADD COLUMN IF NOT EXISTS commission_structure TEXT;",
    "ALTER TABLE brokers ADD COLUMN IF NOT EXISTS trading_platforms TEXT[];",
    "ALTER TABLE brokers ADD COLUMN IF NOT EXISTS account_types TEXT[];",
    "ALTER TABLE brokers ADD COLUMN IF NOT EXISTS regulatory_bodies TEXT[];",
    "ALTER TABLE brokers ADD COLUMN IF NOT EXISTS license_numbers TEXT[];",
    
    // Create broker_trading_conditions table
    `CREATE TABLE IF NOT EXISTS broker_trading_conditions (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
      execution_type execution_type,
      average_spread_eurusd DECIMAL(4,2),
      average_spread_gbpusd DECIMAL(4,2),
      average_spread_usdjpy DECIMAL(4,2),
      commission_per_lot DECIMAL(8,2),
      swap_rates JSONB,
      margin_requirements JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
    
    // Create broker_instruments table
    `CREATE TABLE IF NOT EXISTS broker_instruments (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
      instrument_category TEXT NOT NULL,
      instrument_name TEXT NOT NULL,
      symbol TEXT,
      min_lot_size DECIMAL(10,4),
      max_lot_size DECIMAL(10,4),
      leverage TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`
  ];
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < keyStatements.length; i++) {
    const statement = keyStatements[i];
    
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceKey}`,
          'apikey': serviceKey
        },
        body: JSON.stringify({ sql: statement })
      });
      
      if (response.ok) {
        console.log(`✓ Statement ${i + 1}/${keyStatements.length} executed successfully`);
        successCount++;
      } else {
        const errorText = await response.text();
        console.log(`✗ Statement ${i + 1}/${keyStatements.length} failed:`, errorText);
        errorCount++;
      }
    } catch (error) {
      console.log(`✗ Statement ${i + 1}/${keyStatements.length} failed:`, error.message);
      errorCount++;
    }
  }
  
  console.log(`\n=== Manual Migration Summary ===`);
  console.log(`Successful statements: ${successCount}`);
  console.log(`Failed statements: ${errorCount}`);
  console.log(`Total statements: ${keyStatements.length}`);
}

// Run the migration
executeMigrationWithRPC();