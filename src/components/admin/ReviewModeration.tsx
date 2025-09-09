import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { 
  Search, 
  Eye, 
  Check, 
  X, 
  Flag, 
  Star, 
  MessageSquare,
  User,
  Calendar,
  Filter
} from 'lucide-react';

interface Review {
  id: string;
  user_id: string;
  broker_id: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  trading_experience: string;
  account_type: string;
  deposit_amount: number;
  trading_duration: string;
  is_verified: boolean;
  is_featured: boolean;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  users?: {
    display_name: string;
    avatar_url?: string;
  };
  brokers?: {
    name: string;
    logo_url?: string;
  };
}

export const ReviewModeration: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          users:user_id (
            display_name,
            avatar_url
          ),
          brokers:broker_id (
            name,
            logo_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (reviewId: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ 
          status, 
          admin_notes: notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId);

      if (error) throw error;
      
      // Log admin activity
      await supabase
        .from('admin_activity_log')
        .insert({
          action: `review_${status}`,
          target_type: 'review',
          target_id: reviewId,
          details: { notes }
        });

      fetchReviews();
      setSelectedReview(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Error updating review status:', error);
    }
  };

  const toggleFeatured = async (review: Review) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_featured: !review.is_featured })
        .eq('id', review.id);

      if (error) throw error;
      fetchReviews();
    } catch (error) {
      console.error('Error updating featured status:', error);
    }
  };

  const toggleVerified = async (review: Review) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_verified: !review.is_verified })
        .eq('id', review.id);

      if (error) throw error;
      fetchReviews();
    } catch (error) {
      console.error('Error updating verified status:', error);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.users?.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.brokers?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <h2 className="text-2xl font-bold text-gray-900">Review Moderation</h2>
        <p className="text-gray-600">Moderate and manage user reviews</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reviews, users, or brokers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Detail Modal */}
      {selectedReview && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Review Details
                  {getStatusBadge(selectedReview.status)}
                </CardTitle>
                <CardDescription>
                  Review by {selectedReview.users?.display_name} for {selectedReview.brokers?.name}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedReview(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Review Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Rating:</span> {selectedReview.rating}/5 stars</div>
                  <div><span className="font-medium">Title:</span> {selectedReview.title}</div>
                  <div><span className="font-medium">Trading Experience:</span> {selectedReview.trading_experience}</div>
                  <div><span className="font-medium">Account Type:</span> {selectedReview.account_type}</div>
                  <div><span className="font-medium">Deposit Amount:</span> ${selectedReview.deposit_amount}</div>
                  <div><span className="font-medium">Trading Duration:</span> {selectedReview.trading_duration}</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Verified:</span>
                    <Badge className={selectedReview.is_verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {selectedReview.is_verified ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Featured:</span>
                    <Badge className={selectedReview.is_featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}>
                      {selectedReview.is_featured ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div><span className="font-medium">Created:</span> {formatDate(selectedReview.created_at)}</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Review Content</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{selectedReview.content}</p>
            </div>

            {selectedReview.pros && selectedReview.pros.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Pros</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedReview.pros.map((pro, index) => (
                    <Badge key={index} className="bg-green-100 text-green-800">{pro}</Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedReview.cons && selectedReview.cons.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Cons</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedReview.cons.map((con, index) => (
                    <Badge key={index} className="bg-red-100 text-red-800">{con}</Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedReview.admin_notes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Admin Notes</h4>
                <p className="text-gray-700 bg-yellow-50 p-3 rounded-md border border-yellow-200">
                  {selectedReview.admin_notes}
                </p>
              </div>
            )}

            {selectedReview.status === 'pending' && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Moderation Actions</h4>
                <div className="space-y-3">
                  <Textarea
                    placeholder="Add admin notes (optional)..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => updateReviewStatus(selectedReview.id, 'approved', adminNotes)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => updateReviewStatus(selectedReview.id, 'rejected', adminNotes)}
                      variant="destructive"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleVerified(selectedReview)}
                >
                  {selectedReview.is_verified ? 'Remove Verification' : 'Mark as Verified'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFeatured(selectedReview)}
                >
                  <Star className={`h-4 w-4 mr-1 ${selectedReview.is_featured ? 'fill-current text-yellow-500' : ''}`} />
                  {selectedReview.is_featured ? 'Remove Featured' : 'Mark as Featured'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="grid gap-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    {review.users?.avatar_url ? (
                      <img 
                        src={review.users.avatar_url} 
                        alt={review.users.display_name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{review.title}</h3>
                      {getStatusBadge(review.status)}
                      {review.is_verified && (
                        <Badge className="bg-blue-100 text-blue-800">
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {review.is_featured && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {review.users?.display_name}
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {review.brokers?.name}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                        {review.rating}/5
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(review.created_at)}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 line-clamp-2 mb-3">{review.content}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span><strong>Experience:</strong> {review.trading_experience}</span>
                      <span><strong>Account:</strong> {review.account_type}</span>
                      <span><strong>Deposit:</strong> ${review.deposit_amount}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedReview(review)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  {review.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateReviewStatus(review.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateReviewStatus(review.id, 'rejected')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredReviews.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all'
                  ? 'No reviews match your current filters.'
                  : 'No reviews have been submitted yet.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};