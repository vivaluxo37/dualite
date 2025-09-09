import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Activity,
  Eye,
  Edit,
  Trash2,
  Plus,
  Settings,
  Shield,
  AlertTriangle
} from 'lucide-react';

interface AdminActivity {
  id: string;
  admin_id: string;
  action: string;
  target_type: string;
  target_id: string;
  details: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  users?: {
    display_name: string;
    avatar_url?: string;
  };
}

export const AdminActivityLog: React.FC = () => {
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedActivity, setSelectedActivity] = useState<AdminActivity | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_activity_log')
        .select(`
          *,
          users:admin_id (
            display_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching admin activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'broker_created':
      case 'content_created':
      case 'user_created':
        return <Plus className="h-4 w-4 text-green-600" />;
      case 'broker_updated':
      case 'content_updated':
      case 'user_updated':
        return <Edit className="h-4 w-4 text-blue-600" />;
      case 'broker_deleted':
      case 'content_deleted':
      case 'user_deleted':
        return <Trash2 className="h-4 w-4 text-red-600" />;
      case 'review_approved':
      case 'review_rejected':
        return <Shield className="h-4 w-4 text-purple-600" />;
      case 'settings_updated':
        return <Settings className="h-4 w-4 text-gray-600" />;
      case 'login':
      case 'logout':
        return <User className="h-4 w-4 text-indigo-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionBadge = (action: string) => {
    const actionType = action.split('_')[1] || action;
    
    switch (actionType) {
      case 'created':
        return <Badge className="bg-green-100 text-green-800">Created</Badge>;
      case 'updated':
        return <Badge className="bg-blue-100 text-blue-800">Updated</Badge>;
      case 'deleted':
        return <Badge className="bg-red-100 text-red-800">Deleted</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'login':
        return <Badge className="bg-indigo-100 text-indigo-800">Login</Badge>;
      case 'logout':
        return <Badge className="bg-gray-100 text-gray-800">Logout</Badge>;
      default:
        return <Badge variant="secondary">{actionType}</Badge>;
    }
  };

  const getTargetTypeIcon = (targetType: string) => {
    switch (targetType) {
      case 'broker':
        return '🏢';
      case 'review':
        return '⭐';
      case 'content':
        return '📄';
      case 'user':
        return '👤';
      case 'system':
        return '⚙️';
      default:
        return '📋';
    }
  };

  const formatActionDescription = (activity: AdminActivity) => {
    const { action, target_type, details } = activity;
    const adminName = activity.users?.display_name || 'Admin';
    
    switch (action) {
      case 'broker_created':
        return `${adminName} created a new broker: ${details?.name || 'Unknown'}`;
      case 'broker_updated':
        return `${adminName} updated broker: ${details?.name || 'Unknown'}`;
      case 'broker_deleted':
        return `${adminName} deleted broker: ${details?.name || 'Unknown'}`;
      case 'review_approved':
        return `${adminName} approved a review for ${details?.broker_name || 'a broker'}`;
      case 'review_rejected':
        return `${adminName} rejected a review for ${details?.broker_name || 'a broker'}`;
      case 'content_created':
        return `${adminName} created content: ${details?.title || 'Unknown'}`;
      case 'content_updated':
        return `${adminName} updated content: ${details?.title || 'Unknown'}`;
      case 'content_deleted':
        return `${adminName} deleted content: ${details?.title || 'Unknown'}`;
      case 'user_updated':
        return `${adminName} updated user: ${details?.user_name || 'Unknown'}`;
      case 'settings_updated':
        return `${adminName} updated system settings`;
      case 'login':
        return `${adminName} logged in`;
      case 'logout':
        return `${adminName} logged out`;
      default:
        return `${adminName} performed ${action.replace('_', ' ')} on ${target_type}`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getDateFilterOptions = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      all: () => true,
      today: (date: string) => new Date(date) >= today,
      yesterday: (date: string) => {
        const activityDate = new Date(date);
        return activityDate >= yesterday && activityDate < today;
      },
      week: (date: string) => new Date(date) >= weekAgo,
      month: (date: string) => new Date(date) >= monthAgo
    };
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.target_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.users?.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(activity.details).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || activity.action.includes(actionFilter);
    
    const dateFilterFn = getDateFilterOptions()[dateFilter as keyof ReturnType<typeof getDateFilterOptions>];
    const matchesDate = dateFilterFn ? dateFilterFn(activity.created_at) : true;
    
    return matchesSearch && matchesAction && matchesDate;
  });

  const uniqueActions = [...new Set(activities.map(a => a.action.split('_')[1] || a.action))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Activity Log</h2>
        <p className="text-gray-600">Track all administrative actions and system changes</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search activities, admins, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Actions</option>
                  {uniqueActions.map(action => (
                    <option key={action} value={action}>
                      {action.charAt(0).toUpperCase() + action.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Activity Details
                  {getActionBadge(selectedActivity.action)}
                </CardTitle>
                <CardDescription>
                  {formatDate(selectedActivity.created_at)}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedActivity(null)}
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Admin:</span> {selectedActivity.users?.display_name}</div>
                  <div><span className="font-medium">Action:</span> {selectedActivity.action}</div>
                  <div><span className="font-medium">Target Type:</span> {selectedActivity.target_type}</div>
                  <div><span className="font-medium">Target ID:</span> {selectedActivity.target_id}</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Technical Details</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">IP Address:</span> {selectedActivity.ip_address || 'N/A'}</div>
                  <div><span className="font-medium">User Agent:</span> {selectedActivity.user_agent ? selectedActivity.user_agent.substring(0, 50) + '...' : 'N/A'}</div>
                  <div><span className="font-medium">Timestamp:</span> {formatDate(selectedActivity.created_at)}</div>
                </div>
              </div>
            </div>

            {selectedActivity.details && Object.keys(selectedActivity.details).length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Additional Details</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(selectedActivity.details, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Activities List */}
      <div className="space-y-2">
        {filteredActivities.map((activity) => (
          <Card key={activity.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    {activity.users?.avatar_url ? (
                      <img 
                        src={activity.users.avatar_url} 
                        alt={activity.users.display_name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      {getActionIcon(activity.action)}
                      <span className="text-lg">{getTargetTypeIcon(activity.target_type)}</span>
                      {getActionBadge(activity.action)}
                    </div>
                    
                    <p className="text-gray-900 font-medium">
                      {formatActionDescription(activity)}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(activity.created_at)}
                      </div>
                      {activity.ip_address && (
                        <div className="flex items-center">
                          <Shield className="h-3 w-3 mr-1" />
                          {activity.ip_address}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredActivities.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-600">
                {searchTerm || actionFilter !== 'all' || dateFilter !== 'all'
                  ? 'No activities match your current filters.'
                  : 'No admin activities have been logged yet.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
          <CardDescription>Overview of recent administrative actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{filteredActivities.length}</p>
              <p className="text-sm text-gray-600">Total Activities</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {filteredActivities.filter(a => a.action.includes('created')).length}
              </p>
              <p className="text-sm text-gray-600">Created</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {filteredActivities.filter(a => a.action.includes('updated')).length}
              </p>
              <p className="text-sm text-gray-600">Updated</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {filteredActivities.filter(a => a.action.includes('deleted')).length}
              </p>
              <p className="text-sm text-gray-600">Deleted</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};