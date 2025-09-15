import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import {
  FileText,
  Image,
  Video,
  BookOpen,
  Globe,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  Save,
  X,
  Calendar,
  User,
  TrendingUp,
  BarChart3,
  Monitor,
  Smartphone,
  Tablet,
  Hash,
  Link,
  ExternalLink,
  Copy,
  Share2,
  MessageSquare,
  Heart,
  Bookmark,
  Clock,
  Zap,
  Layers,
  Grid,
  List,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ShoppingBag,
  FolderOpen
} from 'lucide-react';

interface WebsiteContent {
  id: string;
  title: string;
  slug: string;
  content_type: 'page' | 'post' | 'product' | 'category' | 'banner' | 'menu' | 'footer' | 'widget';
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  content: string;
  excerpt?: string;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  author_id?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  view_count?: number;
  template?: string;
  parent_id?: string;
  sort_order?: number;
  seo_score?: number;
  reading_time?: number;
  tags?: string[];
  categories?: string[];
}

interface ContentStats {
  total_pages: number;
  published_pages: number;
  draft_pages: number;
  total_posts: number;
  published_posts: number;
  total_products: number;
  total_categories: number;
  most_viewed: WebsiteContent[];
  recent_updates: WebsiteContent[];
  content_by_type: Record<string, number>;
}

interface SEOAnalysis {
  title_length: number;
  meta_description_length: number;
  keyword_density: Record<string, number>;
  readability_score: number;
  images_alt_text: number;
  internal_links: number;
  external_links: number;
  word_count: number;
  headingStructure: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
  };
}

export const WebsiteContentManagement: React.FC = () => {
  const [content, setContent] = useState<WebsiteContent[]>([]);
  const [stats, setStats] = useState<ContentStats>({
    total_pages: 0,
    published_pages: 0,
    draft_pages: 0,
    total_posts: 0,
    published_posts: 0,
    total_products: 0,
    total_categories: 0,
    most_viewed: [],
    recent_updates: [],
    content_by_type: {}
  });
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingContent, setEditingContent] = useState<WebsiteContent | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      // Fetch pages
      const { data: pages } = await supabase
        .from('website_pages')
        .select('*')
        .order('created_at', { ascending: false });

      // Transform data to match WebsiteContent interface
      const transformedContent: WebsiteContent[] = (pages || []).map(page => ({
        id: page.id,
        title: page.title,
        slug: page.slug,
        content_type: 'page',
        status: page.status,
        content: page.content,
        excerpt: page.excerpt,
        featured_image: page.featured_image,
        meta_title: page.meta_title,
        meta_description: page.meta_description,
        meta_keywords: page.meta_keywords || [],
        author_id: page.author_id,
        published_at: page.published_at,
        created_at: page.created_at,
        updated_at: page.updated_at,
        view_count: page.view_count,
        template: page.template,
        parent_id: page.parent_id,
        sort_order: page.sort_order,
        seo_score: page.seo_score,
        reading_time: page.reading_time,
        tags: page.tags || [],
        categories: page.categories || []
      }));

      setContent(transformedContent);

      // Calculate stats
      const publishedCount = transformedContent.filter(c => c.status === 'published').length;
      const draftCount = transformedContent.filter(c => c.status === 'draft').length;
      const contentByType = transformedContent.reduce((acc, item) => {
        acc[item.content_type] = (acc[item.content_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setStats({
        total_pages: transformedContent.length,
        published_pages: publishedCount,
        draft_pages: draftCount,
        total_posts: 0,
        published_posts: 0,
        total_products: 0,
        total_categories: Object.keys(contentByType).length,
        most_viewed: transformedContent
          .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
          .slice(0, 5),
        recent_updates: transformedContent
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .slice(0, 5),
        content_by_type: contentByType
      });
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.content_type === selectedType;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'page':
        return <FileText className="h-4 w-4" />;
      case 'post':
        return <BookOpen className="h-4 w-4" />;
      case 'product':
        return <ShoppingBag className="h-4 w-4" />;
      case 'category':
        return <FolderOpen className="h-4 w-4" />;
      case 'banner':
        return <Image className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePublish = async (id: string) => {
    try {
      await supabase
        .from('website_pages')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      await fetchContent();
    } catch (error) {
      console.error('Error publishing content:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;
    try {
      await supabase
        .from('website_pages')
        .delete()
        .eq('id', id);
      await fetchContent();
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const handleEdit = (item: WebsiteContent) => {
    setEditingContent(item);
    setShowEditor(true);
  };

  const handleSave = async (updatedContent: WebsiteContent) => {
    try {
      const { id, ...updateData } = updatedContent;
      await supabase
        .from('website_pages')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      setShowEditor(false);
      setEditingContent(null);
      await fetchContent();
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const exportContent = () => {
    const csvData = [
      ['Title', 'Type', 'Status', 'Views', 'Created', 'Updated', 'URL'],
      ...filteredContent.map(item => [
        item.title,
        item.content_type,
        item.status,
        (item.view_count || 0).toString(),
        formatDate(item.created_at),
        formatDate(item.updated_at),
        `/${item.slug}`
      ])
    ];
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website_content_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const analyzeSEO = (content: WebsiteContent): SEOAnalysis => {
    const wordCount = content.content.split(/\s+/).length;
    const titleLength = content.meta_title?.length || content.title.length;
    const metaDescriptionLength = content.meta_description?.length || 0;

    // Simple heading analysis
    const headingStructure = {
      h1: (content.content.match(/<h1[^>]*>/g) || []).length,
      h2: (content.content.match(/<h2[^>]*>/g) || []).length,
      h3: (content.content.match(/<h3[^>]*>/g) || []).length,
      h4: (content.content.match(/<h4[^>]*>/g) || []).length
    };

    // Simple keyword density (very basic)
    const words = content.content.toLowerCase().split(/\s+/);
    const wordFreq: Record<string, number> = {};
    words.forEach(word => {
      if (word.length > 3) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    return {
      title_length: titleLength,
      meta_description_length: metaDescriptionLength,
      keyword_density: wordFreq,
      readability_score: Math.min(100, Math.max(0, 100 - (wordCount / 10))),
      images_alt_text: (content.content.match(/<img[^>]*alt="[^"]*"[^>]*>/g) || []).length,
      internal_links: (content.content.match(/href="\/[^"]*"/g) || []).length,
      external_links: (content.content.match(/href="https?:\/\/[^"]*"/g) || []).length,
      word_count: wordCount,
      headingStructure
    };
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Website Content Management</h2>
          <p className="text-gray-600">Manage all website pages, posts, and content</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportContent}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => {
            setEditingContent(null);
            setShowEditor(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            New Content
          </Button>
        </div>
      </div>

      {/* Content Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_pages}</p>
                <p className="text-xs text-green-600">{stats.published_pages} published</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Draft Pages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.draft_pages}</p>
                <p className="text-xs text-yellow-600">Needs review</p>
              </div>
              <Edit className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Content Types</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_categories}</p>
                <p className="text-xs text-gray-500">Active types</p>
              </div>
              <Layers className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {content.reduce((sum, item) => sum + (item.view_count || 0), 0)}
                </p>
                <p className="text-xs text-green-600">All time</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most Viewed Content */}
        <Card className="">
          <CardHeader>
            <CardTitle className="">Most Viewed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.most_viewed.slice(0, 5).map((item, index) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <span className="text-sm truncate">{item.title}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {item.view_count || 0}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Updates */}
        <Card className="">
          <CardHeader>
            <CardTitle className="">Recent Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recent_updates.slice(0, 5).map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate">{item.title}</span>
                    {getStatusBadge(item.status)}
                  </div>
                  <p className="text-xs text-gray-500">
                    Updated {formatDate(item.updated_at)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content by Type */}
        <Card className="">
          <CardHeader>
            <CardTitle className="">Content by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.content_by_type).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(type)}
                    <span className="text-sm capitalize">{type}</span>
                  </div>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="page">Pages</option>
                <option value="post">Posts</option>
                <option value="product">Products</option>
                <option value="category">Categories</option>
                <option value="banner">Banners</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
                <option value="scheduled">Scheduled</option>
              </select>

              <div className="flex gap-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContent.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.content_type)}
                    <Badge variant="outline" className="text-xs">
                      {item.content_type}
                    </Badge>
                  </div>
                  {getStatusBadge(item.status)}
                </div>
                <CardTitle className="text-lg line-clamp-2">
                  {item.title}
                </CardTitle>
                {item.excerpt && (
                  <CardDescription className="line-clamp-2">
                    {item.excerpt}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Views:</span>
                    <span className="font-medium">{item.view_count || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Created:</span>
                    <span className="font-medium">{formatDate(item.created_at)}</span>
                  </div>
                  {item.seo_score && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">SEO Score:</span>
                      <div className="flex items-center gap-1">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              item.seo_score >= 80 ? 'bg-green-600' :
                              item.seo_score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${item.seo_score}%` }}
                          ></div>
                        </div>
                        <span className="font-medium">{item.seo_score}%</span>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {item.status === 'draft' && (
                      <Button size="sm" onClick={() => handlePublish(item.id)}>
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => window.open(`/${item.slug}`, '_blank')}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="">
          <CardHeader>
            <CardTitle className="">All Content</CardTitle>
            <CardDescription className="">
              {filteredContent.length} item(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Title</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Views</th>
                    <th className="text-left p-3">Created</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContent.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-gray-500">
                            /{item.slug}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(item.content_type)}
                          <span className="capitalize">{item.content_type}</span>
                        </div>
                      </td>
                      <td className="p-3">{getStatusBadge(item.status)}</td>
                      <td className="p-3">
                        <span className="">{item.view_count || 0}</span>
                      </td>
                      <td className="p-3">
                        <span className="">{formatDate(item.created_at)}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {item.status === 'draft' && (
                            <Button size="sm" onClick={() => handlePublish(item.id)}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => window.open(`/${item.slug}`, '_blank')}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredContent.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
                <p className="text-gray-600">
                  {searchTerm || selectedType !== 'all' || selectedStatus !== 'all'
                    ? 'No content matches your current filters.'
                    : 'No content has been created yet.'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Content Editor Modal (simplified) */}
      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {editingContent ? 'Edit Content' : 'Create New Content'}
              </h3>
              <Button variant="outline" onClick={() => setShowEditor(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  value={editingContent?.title || ''}
                  onChange={(e) => editingContent && setEditingContent({
                    ...editingContent,
                    title: e.target.value
                  })}
                  className=""
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <Input
                  value={editingContent?.slug || ''}
                  onChange={(e) => editingContent && setEditingContent({
                    ...editingContent,
                    slug: e.target.value
                  })}
                  className=""
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={editingContent?.content || ''}
                  onChange={(e) => editingContent && setEditingContent({
                    ...editingContent,
                    content: e.target.value
                  })}
                  rows={10}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Excerpt</label>
                <textarea
                  value={editingContent?.excerpt || ''}
                  onChange={(e) => editingContent && setEditingContent({
                    ...editingContent,
                    excerpt: e.target.value
                  })}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Meta Title</label>
                  <Input
                    value={editingContent?.meta_title || ''}
                    onChange={(e) => editingContent && setEditingContent({
                      ...editingContent,
                      meta_title: e.target.value
                    })}
                    className=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Meta Description</label>
                  <Input
                    value={editingContent?.meta_description || ''}
                    onChange={(e) => editingContent && setEditingContent({
                      ...editingContent,
                      meta_description: e.target.value
                    })}
                    className=""
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditor(false)}>
                  Cancel
                </Button>
                <Button onClick={() => editingContent && handleSave(editingContent)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredContent.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedType !== 'all' || selectedStatus !== 'all'
              ? 'No content matches your current filters.'
              : 'No content has been created yet.'
            }
          </p>
          <Button onClick={() => {
            setEditingContent(null);
            setShowEditor(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Content
          </Button>
        </div>
      )}
    </div>
  );
};