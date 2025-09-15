import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://efxpwrnxdorgzcqhbnfn.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Admin Setup Script
 * This script sets up the admin user and necessary database tables for the admin dashboard
 */

async function setupAdmin() {
  console.log('🚀 Setting up admin dashboard...\n');

  try {
    // Check if admin_users table exists, create if it doesn't
    console.log('📋 Checking admin_users table...');
    const { error: tableCheckError } = await supabase
      .from('admin_users')
      .select('id')
      .limit(1);

    if (tableCheckError && tableCheckError.code === '42P01') {
      console.log('⚠️  admin_users table not found. Creating table...');
      
      // Create admin_users table using SQL
      const { error: createTableError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS admin_users (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            clerk_user_id TEXT UNIQUE NOT NULL,
            email TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'admin',
            permissions TEXT[] DEFAULT ARRAY['read_dashboard', 'manage_content', 'manage_brokers'],
            is_active BOOLEAN DEFAULT true,
            last_login TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          CREATE INDEX IF NOT EXISTS idx_admin_users_clerk_id ON admin_users(clerk_user_id);
          CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
          CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
        `
      });

      if (createTableError) {
        console.error('❌ Failed to create admin_users table:', createTableError);
        // Try direct SQL instead
        const { error: directError } = await supabase
          .from('admin_users')
          .select('id')
          .limit(1);
          
        if (directError) {
          console.log('⚠️  Could not create table via RPC. You may need to create it manually in Supabase dashboard.');
        }
      } else {
        console.log('✅ admin_users table created successfully');
      }
    } else {
      console.log('✅ admin_users table exists');
    }

    // Create or update admin user for contact@brokeranalysis.com
    console.log('\n👤 Setting up admin user...');
    const adminEmail = 'contact@brokeranalysis.com';
    
    // Check if admin user already exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', adminEmail)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error checking existing admin:', checkError);
    }

    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email);
      
      // Update permissions if needed
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({
          role: 'super_admin',
          permissions: [
            'read_dashboard',
            'manage_content', 
            'manage_brokers',
            'manage_reviews',
            'manage_users',
            'view_analytics',
            'view_activity_log',
            'system_settings',
            'manage_admins',
            'database_operations'
          ],
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('email', adminEmail);

      if (updateError) {
        console.error('❌ Error updating admin user:', updateError);
      } else {
        console.log('✅ Admin user updated with super_admin permissions');
      }
    } else {
      // Create new admin user
      const { data: newAdmin, error: createError } = await supabase
        .from('admin_users')
        .insert({
          clerk_user_id: 'clerk_admin_temp_id', // This will be updated when user signs in with Clerk
          email: adminEmail,
          role: 'super_admin',
          permissions: [
            'read_dashboard',
            'manage_content', 
            'manage_brokers',
            'manage_reviews',
            'manage_users',
            'view_analytics',
            'view_activity_log',
            'system_settings',
            'manage_admins',
            'database_operations'
          ],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Error creating admin user:', createError);
      } else {
        console.log('✅ Admin user created successfully:', newAdmin.email);
      }
    }

    console.log('\n🎉 Admin dashboard setup completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Make sure Clerk is properly configured in your environment');
    console.log('2. Create a Clerk user with email: contact@brokeranalysis.com');
    console.log('3. Set the user\'s public metadata role to "admin" or "super_admin"');
    console.log('4. Navigate to /admin to access the dashboard');
    console.log('\n🔐 Admin Credentials:');
    console.log('Email: contact@brokeranalysis.com');
    console.log('Password: Set when creating the Clerk user');
    console.log('Role: super_admin');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Run the setup
setupAdmin().catch(console.error);