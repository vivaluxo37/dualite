-- Admin Users Table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_clerk_id ON admin_users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- Admin Activity Log Table
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

-- Create indexes for activity log
CREATE INDEX IF NOT EXISTS idx_admin_activity_admin_id ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_action ON admin_activity_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at ON admin_activity_log(created_at);

-- Insert admin user
INSERT INTO admin_users (clerk_user_id, email, role, permissions, is_active, created_at, updated_at)
VALUES (
    'clerk_admin_temp_id',
    'contact@brokeranalysis.com',
    'super_admin',
    ARRAY[
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
    true,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    role = EXCLUDED.role,
    permissions = EXCLUDED.permissions,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Insert sample activity log entries
INSERT INTO admin_activity_log (admin_id, action, target_type, target_id, details, created_at)
VALUES 
    ('system', 'system_setup', 'system', 'setup', 
     '{"message": "Admin dashboard setup completed", "setup_date": "' || NOW() || '", "version": "2.1.0"}', 
     NOW()),
    ('system', 'admin_created', 'admin_user', 'contact@brokeranalysis.com',
     '{"message": "Admin user created: contact@brokeranalysis.com", "role": "super_admin", "permissions_count": 10}',
     NOW());