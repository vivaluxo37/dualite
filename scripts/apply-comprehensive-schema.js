const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '../.env' });

// Supabase configuration
const supabaseUrl = 'https://efxpwrnxdorgzcqhbnfn.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAzMzIzNSwiZXhwIjoyMDcyNjA5MjM1fQ.BKmSaW8dSc6soQZOh7zZGXMNO-evJZkSbLVJzxoYSYA';

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQL(sql) {
  try {
    const { data, error } = await supabase.rpc('exec', { sql });
    if (error) {
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function applySchemaMigration() {
  try {
    console.log('Applying comprehensive broker schema migration...');
    
    // First, let's add the missing columns to the brokers table
    const brokerTableUpdates = [
      "ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS founded_year INTEGER;",
      "ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS dailyforex_rating DECIMAL(3,2);",
      "ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS overall_rating DECIMAL(3,2);",
      "ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS account_types TEXT[];",
      "ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS commission_structure TEXT;",
      "ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS deposit_methods TEXT[];",
      "ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS withdrawal_methods TEXT[];",
      "ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS customer_support_rating DECIMAL(3,2);",
      "ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS execution_speed_ms DECIMAL(8,2);",
      "ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS mobile_app_rating DECIMAL(3,2);",
      "ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS research_tools_rating DECIMAL(3,2);",
      "ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS education_rating DECIMAL(3,2);"
    ];
    
    console.log('Updating brokers table with additional columns...');
    for (const sql of brokerTableUpdates) {
      const result = await executeSQL(sql);
      if (!result.success) {
        console.warn(`Warning: ${result.error}`);
      } else {
        console.log('✓ Column added successfully');
      }
    }
    
    // Create enum types
    const enumTypes = [
      "DO $$ BEGIN CREATE TYPE execution_type AS ENUM ('market', 'instant', 'request', 'stp', 'ecn'); EXCEPTION WHEN duplicate_object THEN null; END $$;",
      "DO $$ BEGIN CREATE TYPE payment_method AS ENUM ('credit_card', 'debit_card', 'bank_transfer', 'wire_transfer', 'paypal', 'skrill', 'neteller', 'webmoney', 'perfect_money', 'bitcoin', 'ethereum', 'other_crypto', 'local_payment'); EXCEPTION WHEN duplicate_object THEN null; END $$;",
      "DO $$ BEGIN CREATE TYPE bonus_type AS ENUM ('welcome', 'deposit', 'no_deposit', 'cashback', 'loyalty', 'referral', 'trading_contest'); EXCEPTION WHEN duplicate_object THEN null; END $$;",
      "DO $$ BEGIN CREATE TYPE support_channel AS ENUM ('live_chat', 'email', 'phone', 'ticket_system', 'social_media', 'faq', 'knowledge_base'); EXCEPTION WHEN duplicate_object THEN null; END $$;"
    ];
    
    console.log('Creating enum types...');
    for (const sql of enumTypes) {
      const result = await executeSQL(sql);
      if (!result.success) {
        console.warn(`Warning: ${result.error}`);
      } else {
        console.log('✓ Enum type created successfully');
      }
    }
    
    // Create the main additional tables one by one
    const tables = [
      {
        name: 'broker_trading_conditions',
        sql: `CREATE TABLE IF NOT EXISTS public.broker_trading_conditions (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          broker_id UUID REFERENCES public.brokers(id) ON DELETE CASCADE NOT NULL,
          account_type TEXT NOT NULL,
          min_deposit DECIMAL(10,2),
          max_leverage TEXT,
          spread_type TEXT,
          avg_spread_eurusd DECIMAL(5,2),
          commission_per_lot DECIMAL(8,2),
          execution_type execution_type,
          swap_free_available BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );`
      },
      {
        name: 'broker_instruments',
        sql: `CREATE TABLE IF NOT EXISTS public.broker_instruments (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          broker_id UUID REFERENCES public.brokers(id) ON DELETE CASCADE NOT NULL,
          instrument_category TEXT NOT NULL,
          instrument_name TEXT NOT NULL,
          symbol TEXT,
          min_spread DECIMAL(5,2),
          avg_spread DECIMAL(5,2),
          max_leverage TEXT,
          trading_hours TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );`
      },
      {
        name: 'broker_deposit_methods',
        sql: `CREATE TABLE IF NOT EXISTS public.broker_deposit_methods (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          broker_id UUID REFERENCES public.brokers(id) ON DELETE CASCADE NOT NULL,
          method payment_method NOT NULL,
          min_amount DECIMAL(10,2),
          max_amount DECIMAL(10,2),
          processing_time TEXT,
          fee_percentage DECIMAL(5,2),
          fee_fixed DECIMAL(10,2),
          currencies_supported TEXT[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );`
      },
      {
        name: 'broker_withdrawal_methods',
        sql: `CREATE TABLE IF NOT EXISTS public.broker_withdrawal_methods (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          broker_id UUID REFERENCES public.brokers(id) ON DELETE CASCADE NOT NULL,
          method payment_method NOT NULL,
          min_amount DECIMAL(10,2),
          max_amount DECIMAL(10,2),
          processing_time TEXT,
          fee_percentage DECIMAL(5,2),
          fee_fixed DECIMAL(10,2),
          currencies_supported TEXT[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );`
      }
    ];
    
    console.log('Creating additional tables...');
    for (const table of tables) {
      console.log(`Creating table: ${table.name}`);
      const result = await executeSQL(table.sql);
      if (!result.success) {
        console.warn(`Warning creating ${table.name}: ${result.error}`);
      } else {
        console.log(`✓ Table ${table.name} created successfully`);
      }
    }
    
    console.log('\n=== Migration Summary ===');
    console.log('✓ Broker table columns added');
    console.log('✓ Enum types created');
    console.log('✓ Additional tables created');
    console.log('\nMigration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
applySchemaMigration();