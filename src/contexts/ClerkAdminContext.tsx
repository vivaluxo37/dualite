import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuth, useUser, useClerk } from '@clerk/clerk-react';
import { supabase, supabaseAdmin } from '../lib/supabase';

interface AdminUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  role: 'admin' | 'super_admin' | 'content_manager';
  permissions: string[];
  lastLogin?: Date;
}

interface ClerkAdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  adminUser: AdminUser | null;
  hasPermission: (permission: string) => boolean;
  refreshAdminStatus: () => Promise<void>;
  logout: () => Promise<void>;
}

const ClerkAdminContext = createContext<ClerkAdminContextType | undefined>(undefined);

export function ClerkAdminProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminStatus = async () => {
    if (!isLoaded || !isSignedIn || !user) {
      setAdminUser(null);
      setIsLoading(false);
      return;
    }

    try {
      // Check if user has admin role in Clerk metadata
      const clerkRole = user.publicMetadata?.role as string;
      const isSuperAdmin = user.publicMetadata?.isSuperAdmin as boolean;
      const userEmail = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress;

      // Define admin emails that should have access
      const adminEmails = [
        'vivaluxo37@gmail.com',
        'contact@brokeranalysis.com',
        'admin@brokeranalysis.com',
        'mabr@brokeranalysis.com'
      ];

      const isAdminByEmail = userEmail && adminEmails.includes(userEmail);
      const isAdminByRole = clerkRole === 'admin' || clerkRole === 'super_admin' || isSuperAdmin;

      console.log('Admin Check Debug:', {
        userEmail,
        clerkRole,
        isSuperAdmin,
        isAdminByEmail,
        isAdminByRole,
        adminEmails
      });

      if (isAdminByEmail || isAdminByRole) {
        const adminUserData: AdminUser = {
          id: user.id,
          email: userEmail || '',
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
          imageUrl: user.imageUrl || undefined,
          role: (clerkRole as AdminUser['role']) || 'admin',
          permissions: getPermissionsForRole((clerkRole as AdminUser['role']) || 'admin'),
          lastLogin: new Date()
        };

        // Try to sync with Supabase admin table
        try {
          if (supabaseAdmin) {
            const { data: existingAdmin } = await supabaseAdmin
              .from('admin_users')
              .select('*')
              .eq('clerk_user_id', user.id)
              .single();

            if (!existingAdmin) {
              // Create admin record in Supabase
              await supabaseAdmin.from('admin_users').insert({
                clerk_user_id: user.id,
                email: userEmail,
                role: adminUserData.role,
                permissions: adminUserData.permissions,
                is_active: true,
                last_login: new Date().toISOString()
              });
            } else {
              // Update last login and sync permissions
              await supabaseAdmin
                .from('admin_users')
                .update({
                  last_login: new Date().toISOString(),
                  role: adminUserData.role,
                  permissions: adminUserData.permissions
                })
                .eq('clerk_user_id', user.id);
            }
          } else {
            console.warn('Supabase admin client not available. Cannot sync admin user.');
          }
        } catch (error) {
          console.warn('Could not sync admin user with Supabase:', error);
        }

        setAdminUser(adminUserData);
      } else {
        setAdminUser(null);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setAdminUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getPermissionsForRole = (role: AdminUser['role']): string[] => {
    const permissionMap = {
      'admin': [
        'read_dashboard',
        'manage_content',
        'manage_brokers',
        'manage_reviews',
        'view_analytics',
        'view_activity_log'
      ],
      'super_admin': [
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
      'content_manager': [
        'read_dashboard',
        'manage_content',
        'view_analytics',
        'view_activity_log'
      ]
    };

    return permissionMap[role] || [];
  };

  const hasPermission = (permission: string): boolean => {
    if (!adminUser) return false;
    return adminUser.permissions.includes(permission) || adminUser.role === 'super_admin';
  };

  const refreshAdminStatus = async () => {
    setIsLoading(true);
    await checkAdminStatus();
  };

  const logout = async () => {
    try {
      await signOut();
      setAdminUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, [isLoaded, isSignedIn, user]);

  return (
    <ClerkAdminContext.Provider value={{
      isAdmin: !!adminUser,
      isLoading,
      adminUser,
      hasPermission,
      refreshAdminStatus,
      logout
    }}>
      {children}
    </ClerkAdminContext.Provider>
  );
}

export function useClerkAdmin() {
  const context = useContext(ClerkAdminContext);
  if (context === undefined) {
    throw new Error('useClerkAdmin must be used within a ClerkAdminProvider');
  }
  return context;
}

// Admin guard component
interface AdminGuardProps {
  children: ReactNode;
  requiredPermission?: string;
  fallback?: ReactNode;
}

export function AdminGuard({ children, requiredPermission, fallback }: AdminGuardProps) {
  const { isAdmin, isLoading, hasPermission } = useClerkAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin || (requiredPermission && !hasPermission(requiredPermission))) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this area.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}