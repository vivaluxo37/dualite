import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Search, Star, ExternalLink, TrendingUp, Clock, Target, BarChart3 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Broker } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'

interface StyleInfo {
  title: string
  description: string
  icon: React.ReactNode
  characteristics: string[]
  recommendedFeatures: string[]
}

const tradingStyles: Record<string, StyleInfo> = {
  scalping: {
    title: 'Scalping Brokers',
    description: 'Ultra-fast execution and tight spreads for high-frequency trading',
    icon: <TrendingUp className="h-6 w-6" />,
    characteristics: [
      'Hold positions for seconds to minutes',
      'Require very tight spreads',
      'Need ultra-fast execution',
      'High trading frequency'
    ],
    recommendedFeatures: [
      'ECN/STP execution',
      'Low latency servers',
      'Tight spreads (&lt; 1 pip)',
      'No dealing desk'
    ]
  },
  'day-trading': {
    title: 'Day Trading Brokers',
    description: 'Reliable platforms and competitive costs for intraday trading',
    icon: <Clock className="h-6 w-6" />,
    characteristics: [
      'Positions closed within the same day',
      'Focus on technical analysis',
      'Moderate trading frequency',
      'Need reliable platforms'
    ],
    recommendedFeatures: [
      'Advanced charting tools',
      'Real-time market data',
      'Competitive spreads',
      'Mobile trading apps'
    ]
  },
  'swing-trading': {
    title: 'Swing Trading Brokers',
    description: 'Comprehensive research tools for medium-term position trading',
    icon: <Target className="h-6 w-6" />,
    characteristics: [
      'Hold positions for days to weeks',
      'Combine technical and fundamental analysis',
      'Lower trading frequency',
      'Focus on market trends'
    ],
    recommendedFeatures: [
      'Research and analysis tools',
      'Economic calendar',
      'Market news feeds',
      'Educational resources'
    ]
  },
  'position-trading': {
    title: 'Position Trading Brokers',
    description: 'Long-term focused platforms with comprehensive market analysis',
    icon: <BarChart3 className="h-6 w-6" />,
    characteristics: [
      'Hold positions for weeks to months',
      'Heavy focus on fundamentals',
      'Very low trading frequency',
      'Long-term market outlook'
    ],
    recommendedFeatures: [
      'Fundamental analysis tools',
      'Long-term charts',
      'Economic research',
      'Low overnight fees'
    ]
  },
  islamic: {
    title: 'Islamic Trading Accounts',
    description: 'Sharia-compliant trading accounts without interest (swap-free)',
    icon: <Star className="h-6 w-6" />,
    characteristics: [
      'No interest charges (swap-free)',
      'Sharia-compliant trading',
      'Halal investment options',
      'Islamic finance principles'
    ],
    recommendedFeatures: [
      'Swap-free accounts',
      'Islamic certification',
      'Halal trading instruments',
      'Sharia advisory board'
    ]
  }
}

export function BrokerStylePage() {
  const { style } = useParams<{ style: string }>()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('trust_score')
  const [filterRegulation, setFilterRegulation] = useState('all')
  const [filterMinDeposit, setFilterMinDeposit] = useState('all')

  const styleInfo = style ? tradingStyles[style] : null

  const { data: brokers = [], isLoading } = useQuery<Broker[]>({
    queryKey: ['brokers-by-style', style],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .eq('is_active', true)
        .order('trust_score', { ascending: false })

      if (error) throw error
      return data
    },
  })

  // Filter brokers based on trading style requirements
  const filteredBrokers = useMemo(() => {
    if (!style || !brokers.length) return []

    const filtered = brokers?.filter(broker => {
      // Basic search and filter logic
      const matchesSearch = broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           broker.country.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRegulation = filterRegulation === 'all' || 
                               broker.regulations.some(reg => 
                                 reg.toLowerCase().includes(filterRegulation.toLowerCase())
                               )
      
      const matchesMinDeposit = filterMinDeposit === 'all' || 
                                (filterMinDeposit === '0-100' && broker.min_deposit <= 100) ||
                                (filterMinDeposit === '100-500' && broker.min_deposit > 100 && broker.min_deposit <= 500) ||
                                (filterMinDeposit === '500+' && broker.min_deposit > 500)

      // Style-specific filtering
      let matchesStyle = true
      
      switch (style) {
        case 'scalping':
          // Prefer brokers with tight spreads and ECN execution
          matchesStyle = broker.spreads_avg <= 1.5 && broker.trust_score >= 70
          break
        case 'day-trading':
          // Prefer brokers with good spreads and high trust scores
          matchesStyle = broker.spreads_avg <= 2.0 && broker.trust_score >= 65
          break
        case 'swing-trading':
          // Focus on educational resources and research tools
          matchesStyle = broker.education_resources && broker.trust_score >= 60
          break
        case 'position-trading':
          // Focus on established brokers with good regulation
          matchesStyle = broker.regulations.length > 0 && broker.trust_score >= 65
          break
        case 'islamic':
          // For now, show all brokers (in real implementation, would filter for Islamic accounts)
          matchesStyle = true
          break
        default:
          matchesStyle = true
      }

      return matchesSearch && matchesRegulation && matchesMinDeposit && matchesStyle
    })

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'trust_score':
          return b.trust_score - a.trust_score
        case 'rating':
          return b.avg_rating - a.avg_rating
        case 'min_deposit':
          return a.min_deposit - b.min_deposit
        case 'spreads':
          return a.spreads_avg - b.spreads_avg
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return filtered
  }, [brokers, style, searchTerm, sortBy, filterRegulation, filterMinDeposit])

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (!styleInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Trading Style Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The trading style "{style}" is not recognized. Please check the URL or browse our available trading styles.
          </p>
          <Button asChild>
            <Link to="/brokers">View All Brokers</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            {styleInfo.icon}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">{styleInfo.title}</h1>
            <p className="text-muted-foreground text-lg mt-2">{styleInfo.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Style Information Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-2 gap-6 mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Trading Characteristics</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {styleInfo.characteristics.map((char, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{char}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {styleInfo.recommendedFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trust_score">Trust Score</SelectItem>
                <SelectItem value="rating">User Rating</SelectItem>
                <SelectItem value="spreads">Spreads (Low to High)</SelectItem>
                <SelectItem value="min_deposit">Min Deposit (Low to High)</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Regulation</Label>
            <Select value={filterRegulation} onValueChange={setFilterRegulation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regulations</SelectItem>
                <SelectItem value="fca">FCA (UK)</SelectItem>
                <SelectItem value="cysec">CySEC (Cyprus)</SelectItem>
                <SelectItem value="asic">ASIC (Australia)</SelectItem>
                <SelectItem value="cftc">CFTC (US)</SelectItem>
                <SelectItem value="bafin">BaFin (Germany)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Min Deposit</Label>
            <Select value={filterMinDeposit} onValueChange={setFilterMinDeposit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
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

      {/* Results */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : filteredBrokers.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Found {filteredBrokers.length} broker{filteredBrokers.length !== 1 ? 's' : ''} suitable for {styleInfo.title.toLowerCase()}
            </p>
          </div>

          <div className="space-y-4">
            {filteredBrokers.map((broker, index) => (
              <motion.div
                key={broker.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid lg:grid-cols-5 gap-6">
                      {/* Broker Info */}
                      <div className="lg:col-span-2">
                        <div className="flex items-start gap-4">
                          {broker.logo_url && (
                            <img
                              src={broker.logo_url}
                              alt={`${broker.name} logo`}
                              className="w-12 h-12 object-contain rounded"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{broker.name}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{broker.country}</Badge>
                              {broker.regulations.slice(0, 2).map((reg) => (
                                <Badge key={reg} variant="secondary">{reg}</Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="ml-1 text-sm font-medium">{broker.avg_rating.toFixed(1)}</span>
                                <span className="text-muted-foreground text-sm ml-1">({broker.review_count})</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Trust Score */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Trust Score</div>
                        <div className="text-2xl font-bold">{broker.trust_score}</div>
                        <Progress value={broker.trust_score} className="h-2" indicatorClassName={getTrustScoreColor(broker.trust_score)} />
                      </div>

                      {/* Key Metrics */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium">Min Deposit</div>
                            <div className="text-muted-foreground">${broker.min_deposit}</div>
                          </div>
                          <div>
                            <div className="font-medium">Avg Spreads</div>
                            <div className="text-muted-foreground">{broker.spreads_avg} pips</div>
                          </div>
                          <div>
                            <div className="font-medium">Max Leverage</div>
                            <div className="text-muted-foreground">
                              {broker.max_leverage ? `1:${broker.max_leverage}` : 'N/A'}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">Platforms</div>
                            <div className="text-muted-foreground">
                              {broker.platforms.slice(0, 2).join(', ')}
                              {broker.platforms.length > 2 && '...'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2">
                        <Button asChild className="w-full">
                          <Link to={`/brokers/${broker.id}`}>View Details</Link>
                        </Button>
                        {broker.affiliate_url && (
                          <Button variant="outline" className="w-full" asChild>
                            <a href={broker.affiliate_url} target="_blank" rel="noopener noreferrer">
                              Visit Broker <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground text-lg mb-4">
            No brokers found matching your criteria for {styleInfo.title.toLowerCase()}.
          </p>
          <p className="text-muted-foreground mb-8">
            Try adjusting your filters or browse all brokers.
          </p>
          <Button asChild>
            <Link to="/brokers">View All Brokers</Link>
          </Button>
        </motion.div>
      )}
    </div>
  )
}