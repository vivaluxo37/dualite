import { supabase } from '../src/lib/supabase';

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
      
      // Create admin_users table
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
        return;
      }
      
      console.log('✅ admin_users table created successfully');
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
      return;
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

    // Create admin activity log table if it doesn't exist
    console.log('\n📋 Checking admin_activity_log table...');
    const { error: activityCheckError } = await supabase
      .from('admin_activity_log')
      .select('id')
      .limit(1);

    if (activityCheckError && activityCheckError.code === '42P01') {
      console.log('⚠️  admin_activity_log table not found. Creating table...');
      
      const { error: createActivityError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS admin_activity_log (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            admin_id TEXT NOT NULL,
            action TEXT NOT NULL,
            target_type TEXT NOT NULL,
            target_id TEXT,
            details JSONB,
            ip_address TEXT,
            user_agent TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          CREATE INDEX IF NOT EXISTS idx_admin_activity_admin_id ON admin_activity_log(admin_id);
          CREATE INDEX IF NOT EXISTS idx_admin_activity_action ON admin_activity_log(action);
          CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at ON admin_activity_log(created_at);
        `
      });

      if (createActivityError) {
        console.error('❌ Failed to create admin_activity_log table:', createActivityError);
      } else {
        console.log('✅ admin_activity_log table created successfully');
      }
    } else {
      console.log('✅ admin_activity_log table exists');
    }

    // Add sample activity log entries
    console.log('\n📝 Adding sample activity log entries...');
    const sampleActivities = [
      {
        admin_id: 'system',
        action: 'system_setup',
        target_type: 'system',
        target_id: 'setup',
        details: {
          message: 'Admin dashboard setup completed',
          setup_date: new Date().toISOString(),
          version: '2.1.0'
        }
      },
      {
        admin_id: 'system',
        action: 'admin_created',
        target_type: 'admin_user',
        target_id: adminEmail,
        details: {
          message: `Admin user created: ${adminEmail}`,
          role: 'super_admin',
          permissions_count: 10
        }
      }
    ];

    for (const activity of sampleActivities) {
      const { error: logError } = await supabase
        .from('admin_activity_log')
        .insert(activity);

      if (logError) {
        console.error('❌ Error adding sample activity:', logError);
      }
    }

    console.log('\n✅ Sample activity log entries added');

    // Verify setup
    console.log('\n🔍 Verifying setup...');
    const { data: adminCount, error: countError } = await supabase
      .from('admin_users')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error verifying admin setup:', countError);
    } else {
      console.log(`✅ Found ${adminCount.length} admin user(s)`);
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