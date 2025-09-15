import { useState, useMemo } from 'react';
import { SEO } from '@/components/SEO';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Search, Star, TrendingUp, ExternalLink, Heart, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Broker } from '@/types';

export function BrokersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('trust_score');
  const [filterRegulation, setFilterRegulation] = useState('all');
  const [filterMinDeposit, setFilterMinDeposit] = useState('all');
  const siteUrl = window.location.origin;
  const currentUrl = window.location.href;

  const { data: brokers = [], isLoading } = useQuery<Broker[]>({
    queryKey: ['brokers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .eq('is_active', true)
        .order('trust_score', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredAndSortedBrokers = useMemo(() => {
    const filtered = brokers?.filter(broker => {
      const matchesSearch = broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           broker.country.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegulation = filterRegulation === 'all' ||
                              broker.regulations.some(reg => reg.toLowerCase().includes(filterRegulation.toLowerCase()));
      const matchesMinDeposit = filterMinDeposit === 'all' ||
                               (filterMinDeposit === '0-100' && (broker.min_deposit || 0) <= 100) ||
                               (filterMinDeposit === '100-500' && (broker.min_deposit || 0) > 100 && (broker.min_deposit || 0) <= 500) ||
                               (filterMinDeposit === '500+' && (broker.min_deposit || 0) > 500);
      return matchesSearch && matchesRegulation && matchesMinDeposit;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'trust_score':
          return (b.trust_score || 0) - (a.trust_score || 0);
        case 'rating':
          return (b.avg_rating || 0) - (a.avg_rating || 0);
        case 'min_deposit':
          return (a.min_deposit || 0) - (b.min_deposit || 0);
        case 'spreads':
          return (a.spreads_avg || 0) - (b.spreads_avg || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    return filtered;
  }, [brokers, searchTerm, sortBy, filterRegulation, filterMinDeposit]);

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Compare Forex Brokers - BrokerAnalysis",
    "description": "Compare and find the best forex brokers based on regulation, spreads, and user reviews. Comprehensive broker comparison platform.",
    "url": currentUrl,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": filteredAndSortedBrokers.slice(0, 10).map((broker, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${siteUrl}/review/${broker.slug}`,
        "name": broker.name
      }))
    }
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Brokers",
        "item": currentUrl
      }
    ]
  };

  return (
    <>
      <SEO
        title="Compare Forex Brokers 2025 - Find the Best Trading Platform | BrokerAnalysis"
        description="Compare top forex brokers with detailed reviews, regulation status, spreads, and trading conditions. Find your perfect broker with our comprehensive comparison tool."
        keywords="forex broker comparison, compare brokers, best forex brokers, regulated brokers, trading platforms, broker reviews"
        canonicalUrl={currentUrl}
        ogType="website"
        ogTitle="Compare Forex Brokers 2025 - Find the Best Trading Platform | BrokerAnalysis"
        ogDescription="Compare top forex brokers with detailed reviews, regulation status, spreads, and trading conditions. Find your perfect broker with our comprehensive comparison tool."
        structuredData={[structuredData, breadcrumbStructuredData]}
      />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tighter">
            Compare Forex Brokers
          </h1>
          <p className="text-muted-foreground text-lg">
            Find and compare the best forex brokers based on regulation, spreads, and user reviews.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-lg p-6 mb-8 border"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by broker name or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="trust_score">Trust Score</SelectItem>
                  <SelectItem value="rating">User Rating</SelectItem>
                  <SelectItem value="min_deposit">Min Deposit</SelectItem>
                  <SelectItem value="spreads">Spreads</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Regulation</Label>
              <Select value={filterRegulation} onValueChange={setFilterRegulation}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regulations</SelectItem>
                  <SelectItem value="fca">FCA (UK)</SelectItem>
                  <SelectItem value="cysec">CySEC (Cyprus)</SelectItem>
                  <SelectItem value="asic">ASIC (Australia)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Min Deposit</Label>
              <Select value={filterMinDeposit} onValueChange={setFilterMinDeposit}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Amount</SelectItem>
                  <SelectItem value="0-100">$0 - $100</SelectItem>
                  <SelectItem value="100-500">$100 - $500</SelectItem>
                  <SelectItem value="500+">$500+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          {isLoading ? (
            <p className="text-muted-foreground">Loading brokers...</p>
          ) : (
            <p className="text-muted-foreground">
              Showing {filteredAndSortedBrokers.length} of {brokers.length} brokers
            </p>
          )}
        </motion.div>

        {/* Broker Cards */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {filteredAndSortedBrokers.map((broker, index) => (
              <motion.div
                key={broker.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

                      {/* Broker Info */}
                      <div className="lg:col-span-3">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                            {broker.logo_url ? (
                              <img src={broker.logo_url} alt={broker.name} className="w-12 h-12 object-contain" />
                            ) : (
                              <TrendingUp className="h-8 w-8 text-primary" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{broker.name}</h3>
                            <p className="text-sm text-muted-foreground">{broker.country}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {broker.regulations.slice(0, 2).map((reg) => (
                                <Badge key={reg} variant="secondary" className="text-xs">
                                  {reg}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Trust Score */}
                      <div className="lg:col-span-2">
                        <div className="text-center">
                          <div className="text-sm font-medium mb-1">Trust Score</div>
                          <div className={`text-2xl font-bold`}>
                            {broker.trust_score || 0}/100
                          </div>
                          <Progress
                            value={broker.trust_score || 0}
                            className="mt-2 h-1.5"
                            indicatorClassName={getTrustScoreColor(broker.trust_score || 0)}
                          />
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="lg:col-span-2">
                        <div className="text-center">
                          <div className="text-sm font-medium mb-1">User Rating</div>
                          <div className="flex items-center justify-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="font-semibold">{(broker.avg_rating || 0).toFixed(1)}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {broker.total_reviews || 0} reviews
                          </div>
                        </div>
                      </div>

                      {/* Key Stats */}
                      <div className="lg:col-span-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium">Min Deposit</div>
                            <div className="text-muted-foreground">${broker.min_deposit || 0}</div>
                          </div>
                          <div>
                            <div className="font-medium">Avg Spreads</div>
                            <div className="text-muted-foreground">{broker.spreads_avg || 0} pips</div>
                          </div>
                          <div>
                            <div className="font-medium">Max Leverage</div>
                            <div className="text-muted-foreground">
                              {broker.leverage_max ? `1:${broker.leverage_max}` : 'N/A'}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">Platforms</div>
                            <div className="text-muted-foreground">
                              {broker.platforms?.slice(0, 2).join(', ') || 'N/A'}
                              {broker.platforms && broker.platforms.length > 2 && '...'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="lg:col-span-2">
                        <div className="flex flex-col space-y-2">
                          <Button asChild className="w-full">
                            <Link to={`/review/${broker.slug}`}>View Details</Link>
                          </Button>
                          {broker.affiliate_url && (
                            <Button variant="outline" className="w-full" asChild>
                              <a href={broker.affiliate_url} target="_blank" rel="noopener noreferrer">
                                Visit Broker <ExternalLink className="h-4 w-4 ml-2" />
                              </a>
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="w-full">
                            <Heart className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!isLoading && filteredAndSortedBrokers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground text-lg">
              No brokers found matching your criteria. Try adjusting your filters.
            </p>
          </motion.div>
        )}
      </div>
    </>
  );
}