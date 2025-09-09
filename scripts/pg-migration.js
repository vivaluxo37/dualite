const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Extract database connection details from Supabase URL
const supabaseUrl = 'https://efxpwrnxdorgzcqhbnfn.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAzMzIzNSwiZXhwIjoyMDcyNjA5MjM1fQ.BKmSaW8dSc6soQZOh7zZGXMNO-evJZkSbLVJzxoYSYA';

// Supabase PostgreSQL connection details
const client = new Client({
  host: 'db.efxpwrnxdorgzcqhbnfn.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'BrokerAnalysis2025!', // Default password - may need to be updated
  ssl: {
    rejectUnauthorized: false
  }
});

async function executeMigration() {
  try {
    console.log('Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✓ Connected to database');
    
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
      
      try {
        await client.query(statement);
        console.log(`✓ Statement ${i + 1}/${statements.length} executed successfully`);
        successCount++;
      } catch (error) {
        console.log(`✗ Statement ${i + 1}/${statements.length} failed:`, error.message);
        errorCount++;
        
        // Continue with other statements even if one fails
      }
    }
    
    console.log(`\n=== Migration Summary ===`);
    console.log(`Successful statements: ${successCount}`);
    console.log(`Failed statements: ${errorCount}`);
    console.log(`Total statements: ${statements.length}`);
    
    // Verify tables were created
    console.log('\n=== Verifying Tables ===');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('Current tables in database:');
    tablesResult.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
  } catch (error) {
    console.error('Migration failed:', error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.log('\n❌ Database password is incorrect.');
      console.log('Please update the password in this script with the correct database password.');
      console.log('You can find it in your Supabase dashboard under Settings > Database.');
    }
    
  } finally {
    await client.end();
    console.log('\n✓ Database connection closed');
  }
}

// Run the migration
executeMigration();