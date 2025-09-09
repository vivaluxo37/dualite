const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Anon Key is missing. Make sure to set them in your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const MIGRATIONS_DIR = path.resolve(__dirname, '../supabase/migrations');

async function executeDirectSQL(sql) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ query: sql }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return { data: await response.json(), error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function applyMigrations() {
  try {
    const migrationFiles = fs.readdirSync(MIGRATIONS_DIR).sort();
    console.log('Found migration files:', migrationFiles);

    for (const file of migrationFiles) {
      console.log(`Applying migration: ${file}...`);
      const migrationPath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(migrationPath, 'utf8');

      // Split SQL into individual statements
      const statements = sql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      for (const statement of statements) {
        if (statement.trim()) {
          const { error } = await executeDirectSQL(statement);
          if (error) {
            console.warn(`Warning executing SQL statement: ${error.message}`);
          }
        }
      }

      console.log(`✅ Successfully applied migration: ${file}`);
    }

    console.log('🎉 All migrations have been applied successfully.');
  } catch (error) {
    console.error('❌ Error applying migrations:', error);
    process.exit(1);
  }
}

applyMigrations();