import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  TrendingUp, 
  Calendar,
  Globe,
  Star,
  MessageSquare,
  Target,
  BookOpen
} from 'lucide-react';

interface UserStats {
  totalUsers: number;
  newUsersThisMonth: number;
  activeUsers: number;
  verifiedUsers: number;
  usersByRole: { [key: string]: number };
  usersByLanguage: { [key: string]: number };
  recentUsers: any[];
}

interface ActivityStats {
  totalReviews: number;
  totalShortlists: number;
  totalQuizAttempts: number;
  avgQuizScore: number;
  topBrokers: any[];
  recentActivity: any[];
}

export const UserAnalytics: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    newUsersThisMonth: 0,
    activeUsers: 0,
    verifiedUsers: 0,
    usersByRole: {},
    usersByLanguage: {},
    recentUsers: []
  });
  
  const [activityStats, setActivityStats] = useState<ActivityStats>({
    totalReviews: 0,
    totalShortlists: 0,
    totalQuizAttempts: 0,
    avgQuizScore: 0,
    topBrokers: [],
    recentActivity: []
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      await Promise.all([
        fetchUserStats(),
        fetchActivityStats()
      ]);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      // Total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // New users this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { count: newUsersThisMonth } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      // Active users (users with activity in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: activeUserIds } = await supabase
        .from('reviews')
        .select('user_id')
        .gte('created_at', thirtyDaysAgo.toISOString());
      
      const uniqueActiveUsers = new Set(activeUserIds?.map(r => r.user_id) || []);

      // Users by role
      const { data: roleData } = await supabase
        .from('users')
        .select('role');
      
      const usersByRole = roleData?.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number }) || {};

      // Users by language
      const { data: languageData } = await supabase
        .from('users')
        .select('language_preference');
      
      const usersByLanguage = languageData?.reduce((acc, user) => {
        const lang = user.language_preference || 'en';
        acc[lang] = (acc[lang] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number }) || {};

      // Recent users
      const { data: recentUsers } = await supabase
        .from('users')
        .select('id, display_name, avatar_url, role, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      setUserStats({
        totalUsers: totalUsers || 0,
        newUsersThisMonth: newUsersThisMonth || 0,
        activeUsers: uniqueActiveUsers.size,
        verifiedUsers: 0, // This would need a verified field in users table
        usersByRole,
        usersByLanguage,
        recentUsers: recentUsers || []
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchActivityStats = async () => {
    try {
      // Total reviews
      const { count: totalReviews } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true });

      // Total shortlists
      const { count: totalShortlists } = await supabase
        .from('user_shortlists')
        .select('*', { count: 'exact', head: true });

      // Quiz stats
      const { data: quizResults } = await supabase
        .from('quiz_results')
        .select('score');
      
      const totalQuizAttempts = quizResults?.length || 0;
      const avgQuizScore = quizResults?.length 
        ? quizResults.reduce((sum, result) => sum + result.score, 0) / quizResults.length
        : 0;

      // Top brokers by reviews
      const { data: topBrokers } = await supabase
        .from('brokers')
        .select(`
          id,
          name,
          logo_url,
          rating,
          review_count
        `)
        .order('review_count', { ascending: false })
        .limit(5);

      // Recent activity (reviews)
      const { data: recentActivity } = await supabase
        .from('reviews')
        .select(`
          id,
          title,
          rating,
          created_at,
          users:user_id (
            display_name,
            avatar_url
          ),
          brokers:broker_id (
            name,
            logo_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      setActivityStats({
        totalReviews: totalReviews || 0,
        totalShortlists: totalShortlists || 0,
        totalQuizAttempts,
        avgQuizScore: Math.round(avgQuizScore * 10) / 10,
        topBrokers: topBrokers || [],
        recentActivity: recentActivity || []
      });
    } catch (error) {
      console.error('Error fetching activity stats:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
        <h2 className="text-2xl font-bold text-gray-900">User Analytics</h2>
        <p className="text-gray-600">Insights into user behavior and platform engagement</p>
      </div>

      {/* User Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{userStats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-3xl font-bold text-gray-900">{userStats.newUsersThisMonth.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <UserPlus className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900">{userStats.activeUsers.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Last 30 days</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified Users</p>
                <p className="text-3xl font-bold text-gray-900">{userStats.verifiedUsers.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <UserCheck className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{activityStats.totalReviews.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shortlisted Brokers</p>
                <p className="text-3xl font-bold text-gray-900">{activityStats.totalShortlists.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-pink-100 rounded-full">
                <Target className="h-6 w-6 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quiz Attempts</p>
                <p className="text-3xl font-bold text-gray-900">{activityStats.totalQuizAttempts.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Quiz Score</p>
                <p className="text-3xl font-bold text-gray-900">{activityStats.avgQuizScore}%</p>
              </div>
              <div className="p-3 bg-teal-100 rounded-full">
                <Star className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Breakdown by role and language</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">By Role</h4>
              <div className="space-y-2">
                {Object.entries(userStats.usersByRole).map(([role, count]) => (
                  <div key={role} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleBadgeColor(role)}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Badge>
                    </div>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">By Language</h4>
              <div className="space-y-2">
                {Object.entries(userStats.usersByLanguage).map(([lang, count]) => (
                  <div key={lang} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{lang.toUpperCase()}</span>
                    </div>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Brokers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Brokers</CardTitle>
            <CardDescription>Most reviewed brokers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityStats.topBrokers.map((broker, index) => (
                <div key={broker.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {index + 1}
                  </div>
                  {broker.logo_url && (
                    <img 
                      src={broker.logo_url} 
                      alt={broker.name}
                      className="w-8 h-8 object-contain rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{broker.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span>{broker.rating}</span>
                      <span>•</span>
                      <span>{broker.review_count} reviews</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userStats.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-3">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.display_name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{user.display_name}</p>
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleBadgeColor(user.role)} size="sm">
                        {user.role}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest reviews and interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityStats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  {activity.users?.avatar_url ? (
                    <img 
                      src={activity.users.avatar_url} 
                      alt={activity.users.display_name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-gray-500" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.users?.display_name}</span>
                      {' reviewed '}
                      <span className="font-medium">{activity.brokers?.name}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600 ml-1">{activity.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(activity.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-1">{activity.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};