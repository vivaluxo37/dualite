import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuthContext } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar, Star, TrendingUp, ExternalLink, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MatchResult {
  id: string;
  created_at: string;
  match_score: number;
  user_preferences: {
    experience_level: string;
    trading_style: string;
    deposit_amount: number;
    risk_tolerance: string;
    preferred_platforms: string[];
    important_features: string[];
  };
  recommended_brokers: {
    broker_id: string;
    broker_name: string;
    match_percentage: number;
    reasons: string[];
    rating: number;
    regulation: string;
    min_deposit: number;
  }[];
}

export const MatchHistory: React.FC = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  // Fetch match history
  const { data: matchHistory, isLoading, error, refetch } = useQuery({
    queryKey: ['matchHistory', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('ai_matcher_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as MatchResult[];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const handleStartNewMatch = () => {
    navigate('/ai-matcher');
  };

  const toggleExpanded = (matchId: string) => {
    setExpandedMatch(expandedMatch === matchId ? null : matchId);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 75) return 'Good Match';
    if (score >= 60) return 'Fair Match';
    return 'Poor Match';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Match History</h3>
          <Button disabled variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Failed to load match history</p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Match History</h3>
        <div className="flex space-x-2">
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleStartNewMatch} size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            New Match
          </Button>
        </div>
      </div>

      {!matchHistory || matchHistory.length === 0 ? (
        <div className="text-center py-12">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            No matches yet
          </h4>
          <p className="text-gray-500 mb-6">
            Use our AI matcher to find brokers that fit your trading style
          </p>
          <Button onClick={handleStartNewMatch}>
            Start AI Matcher
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {matchHistory.map((match) => (
            <Card key={match.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {new Date(match.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <Badge 
                    className={`px-3 py-1 ${getScoreColor(match.match_score)}`}
                  >
                    {match.match_score}% - {getScoreLabel(match.match_score)}
                  </Badge>
                </div>

                {/* User Preferences Summary */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-sm mb-2">Your Preferences:</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Experience:</span>
                      <span className="ml-1 font-medium">
                        {match.user_preferences.experience_level}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Style:</span>
                      <span className="ml-1 font-medium">
                        {match.user_preferences.trading_style}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Deposit:</span>
                      <span className="ml-1 font-medium">
                        ${match.user_preferences.deposit_amount.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Risk:</span>
                      <span className="ml-1 font-medium">
                        {match.user_preferences.risk_tolerance}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Top Recommended Brokers */}
                <div className="space-y-3">
                  <h5 className="font-medium text-sm">Recommended Brokers:</h5>
                  {match.recommended_brokers.slice(0, expandedMatch === match.id ? undefined : 3).map((broker, index) => (
                    <div key={broker.broker_id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{broker.broker_name}</div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <div className="flex items-center">
                              {renderStars(broker.rating)}
                              <span className="ml-1">({broker.rating}/5)</span>
                            </div>
                            <span>•</span>
                            <span>{broker.regulation}</span>
                            <span>•</span>
                            <span>Min: ${broker.min_deposit.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          {broker.match_percentage}% match
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/brokers/${broker.broker_id}`)}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Expand/Collapse Button */}
                {match.recommended_brokers.length > 3 && (
                  <div className="mt-4 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(match.id)}
                    >
                      {expandedMatch === match.id 
                        ? `Show Less` 
                        : `Show ${match.recommended_brokers.length - 3} More Brokers`
                      }
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};