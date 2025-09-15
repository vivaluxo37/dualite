import React, { useState, useEffect } from 'react';
import { useClerkAdmin } from '../contexts/ClerkAdminContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { EnhancedContentManagement } from '../components/admin/EnhancedContentManagement';
import { BrokerManagement } from '../components/admin/BrokerManagement';
import { UserManagement } from '../components/admin/UserManagement';
import { UserAnalytics } from '../components/admin/UserAnalytics';
import { ReviewModeration } from '../components/admin/ReviewModeration';
import { AdminActivityLog } from '../components/admin/AdminActivityLog';
import { SystemManagement } from '../components/admin/SystemManagement';
import { WebsiteContentManagement } from '../components/admin/WebsiteContentManagement';
import {
  BarChart3,
  FileText,
  Building2,
  MessageSquare,
  Activity,
  Users,
  TrendingUp,
  Shield,
  Settings,
  Database,
  Users as UsersIcon,
  AlertTriangle,
  CheckCircle,
  Plus,
  Globe
} from 'lucide-react';

interface AdminStats {
  totalBrokers: number;
  activeUsers: number;
  totalReviews: number;
  aiMatches: number;
  systemHealth: {
    database: 'healthy' | 'warning' | 'error';
    api: 'healthy' | 'warning' | 'error';
    storage: 'healthy' | 'warning' | 'error';
  };
}

const AdminPage: React.FC = () => {
  const { isAdmin, isLoading, adminUser, hasPermission } = useClerkAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats>({
    totalBrokers: 0,
    activeUsers: 0,
    totalReviews: 0,
    aiMatches: 0,
    systemHealth: {
      database: 'healthy',
      api: 'healthy',
      storage: 'healthy'
    }
  });

  useEffect(() => {
    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin]);

  const loadStats = async () => {
    // Simulated stats - in real app, fetch from Supabase
    setStats({
      totalBrokers: 50,
      activeUsers: 1234,
      totalReviews: 856,
      aiMatches: 2341,
      systemHealth: {
        database: 'healthy',
        api: 'healthy',
        storage: 'warning'
      }
    });
  };

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

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage content, brokers, users, and platform analytics</p>
        </div>

        {/* Admin Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage content, brokers, users, and platform analytics</p>
              <div className="flex items-center gap-2 mt-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">
                  Signed in as {adminUser?.email} ({adminUser?.role})
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                Back to Site
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Brokers</CardTitle>
              <Building2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBrokers}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReviews}</div>
              <p className="text-xs text-muted-foreground">+18 this week</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Matches</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.aiMatches.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+25% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-9 lg:grid-cols-9">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="brokers" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Brokers
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              System
            </TabsTrigger>
            <TabsTrigger value="website" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Website
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="">Recent Activity</CardTitle>
                  <CardDescription className="">Latest admin actions and system events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New broker added: Pepperstone</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Review moderated: IC Markets</p>
                        <p className="text-xs text-gray-500">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Content published: Trading Guide</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">User registration spike detected</p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card className="">
                <CardHeader>
                  <CardTitle className="">System Health</CardTitle>
                  <CardDescription className="">Platform performance and status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Database</span>
                      <div className="flex items-center space-x-2">
                        {stats.systemHealth.database === 'healthy' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        )}
                        <span className={`text-sm ${
                          stats.systemHealth.database === 'healthy' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {stats.systemHealth.database === 'healthy' ? 'Healthy' : 'Warning'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">API Response</span>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Fast (120ms)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Storage</span>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-600">75% Used</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Security</span>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Protected</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex-col"
                    onClick={() => {
                      setActiveTab('brokers');
                      setTimeout(() => {
                        const addBrokerButton = document.querySelector('button[class*="Add Broker"]');
                        if (addBrokerButton) {
                          (addBrokerButton as HTMLButtonElement).click();
                        }
                      }, 100);
                    }}
                  >
                    <Plus className="h-6 w-6 mb-2" />
                    <span className="text-sm">Add Broker</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col"
                    onClick={() => {
                      setActiveTab('content');
                      setTimeout(() => {
                        const createContentButton = document.querySelector('button[class*="Create Content"]');
                        if (createContentButton) {
                          (createContentButton as HTMLButtonElement).click();
                        }
                      }, 100);
                    }}
                  >
                    <FileText className="h-6 w-6 mb-2" />
                    <span className="text-sm">New Content</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab('users')}>
                    <UsersIcon className="h-6 w-6 mb-2" />
                    <span className="text-sm">Manage Users</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab('system')}>
                    <Settings className="h-6 w-6 mb-2" />
                    <span className="text-sm">Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system">
            <SystemManagement />
          </TabsContent>

          <TabsContent value="website">
            <WebsiteContentManagement />
          </TabsContent>

          <TabsContent value="content">
            <EnhancedContentManagement />
          </TabsContent>

          <TabsContent value="brokers">
            <BrokerManagement />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewModeration />
          </TabsContent>

          <TabsContent value="analytics">
            <UserAnalytics />
          </TabsContent>

          <TabsContent value="activity">
            <AdminActivityLog />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;