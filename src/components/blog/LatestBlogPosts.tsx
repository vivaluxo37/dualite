import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { BlogCard } from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, BookOpen, TrendingUp, ArrowRight, Calendar, Clock, Eye, MessageCircle, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LatestBlogPostsProps {
  limit?: number;
  showFeatured?: boolean;
  className?: string;
}

export function LatestBlogPosts({ limit = 3, showFeatured = true, className = '' }: LatestBlogPostsProps) {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['latest-blog-posts', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: featuredPost = null } = useQuery({
    queryKey: ['blog-featured-post'],
    queryFn: async () => {
      if (!showFeatured) return null;
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_featured', true)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: showFeatured
  });

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted rounded-lg h-48"></div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No blog posts yet</h3>
        <p className="text-muted-foreground">Check back soon for new content.</p>
      </div>
    );
  }

  const displayPosts = showFeatured && featuredPost 
    ? posts.filter(post => post.id !== featuredPost.id).slice(0, limit - 1) 
    : posts.slice(0, limit);

  return (
    <section className={`py-24 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tighter flex items-center justify-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Latest Blog Posts
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest forex trading insights and strategies from our expert team
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {showFeatured && featuredPost && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.5 }} 
                className="mb-12"
              >
                <BlogCard post={featuredPost} featured />
              </motion.div>
            )}

            {/* Regular Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayPosts.map((post, index) => (
                <motion.div 
                  key={post.id} 
                  initial={{ opacity: 0, y: 50 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
              <Button variant="secondary" asChild size="lg">
                <Link to="/blog">
                  View All Blog Posts <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// Compact version for sidebars and widgets
interface BlogPostsWidgetProps {
  title?: string;
  limit?: number;
  showDate?: boolean;
  className?: string;
}

export function BlogPostsWidget({ title = "Recent Posts", limit = 5, showDate = true, className = '' }: BlogPostsWidgetProps) {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts-widget', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          id, 
          title, 
          slug, 
          excerpt, 
          featured_image_url, 
          published_at, 
          reading_time
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className={`space-y-3 ${className}`}>
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-3 bg-muted rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <p className="text-muted-foreground text-sm">No posts available</p>
      </div>
    );
  }

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className={className}>
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <BookOpen className="h-4 w-4" />
        {title}
      </h3>
      <div className="space-y-3">
        {posts.map((post) => (
          <Link 
            key={post.id} 
            to={`/blog/${post.slug}`} 
            className="block p-3 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <h4 className="text-sm font-medium line-clamp-2 mb-1 group-hover:text-primary transition-colors">
              {post.title}
            </h4>
            {showDate && (
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(post.published_at)}</span>
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>
      <Button variant="ghost" size="sm" className="w-full mt-4" asChild>
        <Link to="/blog">
          View All Posts <ArrowRight className="h-3 w-3 ml-2" />
        </Link>
      </Button>
    </div>
  );
}