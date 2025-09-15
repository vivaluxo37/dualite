import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Broker } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import '../styles/performance.css';
import { Star, MapPin, ExternalLink, BarChart3, Building, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface BrokerComparison {
  broker: Broker;
  score: number;
  selected: boolean;
}

export function ComparePage() {
  const [selectedBrokers, setSelectedBrokers] = useState<BrokerComparison[]>([]);
  const [maxBrokers] = useState(3);
  const [sortBy, setSortBy] = useState<'trust_score' | 'min_deposit' | 'spreads_avg'>('trust_score');

  const { data: brokers, isLoading } = useQuery({
    queryKey: ['brokers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .eq('is_active', true)
        .order('trust_score', { ascending: false });

      if (error) throw error;
      return data as Broker[];
    }
  });

  useEffect(() => {
    if (brokers) {
      const comparisonBrokers = brokers.slice(0, 5).map(broker => ({
        broker,
        score: broker.trust_score || 0,
        selected: false
      }));
      setSelectedBrokers(comparisonBrokers);
    }
  }, [brokers]);

  const toggleBrokerSelection = (brokerId: string) => {
    setSelectedBrokers(prev => prev.map(item =>
      item.broker.id === brokerId
        ? { ...item, selected: !item.selected }
        : item.selected && prev.filter(b => b.selected).length >= maxBrokers
          ? item
          : item
    ));
  };

  const selectedBrokerData = selectedBrokers.filter(b => b.selected);

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrustScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const sortedBrokers = [...selectedBrokerData].sort((a, b) => {
    switch (sortBy) {
      case 'trust_score':
        return (b.broker.trust_score || 0) - (a.broker.trust_score || 0);
      case 'min_deposit':
        return (Number(a.broker.min_deposit) || 0) - (Number(b.broker.min_deposit) || 0);
      case 'spreads_avg':
        return (Number(a.broker.spreads_avg) || 0) - (Number(b.broker.spreads_avg) || 0);
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Compare Forex Brokers</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compare leading forex brokers side by side. Find the perfect broker based on your trading needs and preferences.
          </p>
        </motion.div>

        {/* Broker Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Select Brokers to Compare
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedBrokers.map((item) => (
                <motion.div
                  key={item.broker.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    item.selected
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleBrokerSelection(item.broker.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      {item.broker.logo_url ? (
                        <img
                          src={item.broker.logo_url}
                          alt={item.broker.name}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <Building className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.broker.name}</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{item.broker.avg_rating?.toFixed(1) || '0.0'}</span>
                        <span className="text-muted-foreground">
                          ({item.broker.total_reviews || 0})
                        </span>
                      </div>
                    </div>
                    {item.selected ? (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-border rounded" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {selectedBrokerData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Select brokers above to start comparing
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comparison Controls */}
        {selectedBrokerData.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Sort by:</span>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trust_score">Trust Score</SelectItem>
                  <SelectItem value="min_deposit">Min Deposit</SelectItem>
                  <SelectItem value="spreads_avg">Spreads</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedBrokerData.length} of {maxBrokers} brokers selected
            </div>
          </div>
        )}

        {/* Comparison Table */}
        {selectedBrokerData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  {sortedBrokers.map((item) => (
                    <th key={item.broker.id} className="text-center p-4 font-semibold">
                      {item.broker.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>

                {/* Basic Info */}
                <tr className="border-b">
                  <td className="p-4 font-medium">Logo</td>
                  {sortedBrokers.map((item) => (
                    <td key={item.broker.id} className="text-center p-4">
                      <div className="w-16 h-16 mx-auto rounded-lg bg-muted flex items-center justify-center">
                        {item.broker.logo_url ? (
                          <img
                            src={item.broker.logo_url}
                            alt={item.broker.name}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <Building className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr className="border-b">
                  <td className="p-4 font-medium">Rating</td>
                  {sortedBrokers.map((item) => (
                    <td key={item.broker.id} className="text-center p-4">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{item.broker.avg_rating?.toFixed(1) || '0.0'}</span>
                        <span className="text-sm text-muted-foreground">
                          ({item.broker.total_reviews || 0})
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>

                <tr className="border-b">
                  <td className="p-4 font-medium">Trust Score</td>
                  {sortedBrokers.map((item) => (
                    <td key={item.broker.id} className="text-center p-4">
                      <div className={`text-xl font-bold ${getTrustScoreColor(item.broker.trust_score || 0)}`}>
                        {item.broker.trust_score || 0}/100
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getTrustScoreLabel(item.broker.trust_score || 0)}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr className="border-b">
                  <td className="p-4 font-medium">Regulation</td>
                  {sortedBrokers.map((item) => (
                    <td key={item.broker.id} className="text-center p-4">
                      <div className="text-sm">
                        {item.broker.regulations ? (
                          <Badge variant="secondary">{item.broker.regulations}</Badge>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr className="border-b">
                  <td className="p-4 font-medium">Min Deposit</td>
                  {sortedBrokers.map((item) => (
                    <td key={item.broker.id} className="text-center p-4">
                      <div className="text-lg font-semibold text-primary">
                        ${Number(item.broker.min_deposit) || 0}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr className="border-b">
                  <td className="p-4 font-medium">Max Leverage</td>
                  {sortedBrokers.map((item) => (
                    <td key={item.broker.id} className="text-center p-4">
                      <div className="font-semibold">
                        1:{item.broker.leverage_max || 0}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr className="border-b">
                  <td className="p-4 font-medium">Avg Spreads</td>
                  {sortedBrokers.map((item) => (
                    <td key={item.broker.id} className="text-center p-4">
                      <div className="font-semibold">
                        {Number(item.broker.spreads_avg) || 0} pips
                      </div>
                    </td>
                  ))}
                </tr>

                <tr className="border-b">
                  <td className="p-4 font-medium">Country</td>
                  {sortedBrokers.map((item) => (
                    <td key={item.broker.id} className="text-center p-4">
                      <div className="flex items-center justify-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{item.broker.country}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                <tr className="border-b">
                  <td className="p-4 font-medium">Platforms</td>
                  {sortedBrokers.map((item) => (
                    <td key={item.broker.id} className="text-center p-4">
                      <div className="text-sm">
                        {item.broker.platforms?.length ? (
                          <div className="flex flex-wrap gap-1 justify-center">
                            {item.broker.platforms.slice(0, 2).map((platform, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                            {item.broker.platforms.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{item.broker.platforms.length - 2}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr className="border-b">
                  <td className="p-4 font-medium">Instruments</td>
                  {sortedBrokers.map((item) => (
                    <td key={item.broker.id} className="text-center p-4">
                      <div className="text-sm">
                        {item.broker.instruments?.length ? (
                          <div className="flex flex-wrap gap-1 justify-center">
                            {item.broker.instruments.slice(0, 3).map((instrument, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {instrument}
                              </Badge>
                            ))}
                            {item.broker.instruments.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{item.broker.instruments.length - 3}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Action Row */}
                <tr>
                  <td className="p-4 font-medium">Actions</td>
                  {sortedBrokers.map((item) => (
                    <td key={item.broker.id} className="text-center p-4">
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => window.open(item.broker.affiliate_url || item.broker.website_url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Broker
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => window.location.href = `/review/${item.broker.slug}`}
                        >
                          Read Review
                        </Button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* CTA Section */}
        {selectedBrokerData.length === 0 && (
          <Card className="text-center p-8">
            <CardContent>
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Compare Top Forex Brokers</h3>
              <p className="text-muted-foreground mb-4">
                Select up to 3 brokers from the list above to see a detailed side-by-side comparison.
              </p>
              <Button onClick={() => {
                const topBrokers = selectedBrokers.slice(0, 3);
                setSelectedBrokers(topBrokers.map(b => ({ ...b, selected: true })));
              }}>
                Compare Top 3 Brokers
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 