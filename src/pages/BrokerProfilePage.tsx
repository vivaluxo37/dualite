import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { Broker } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { 
  Star, 
  Shield, 
  MapPin, 
  ExternalLink, 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  Globe, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  BarChart3,
  Smartphone,
  Monitor,
  CreditCard,
  Banknote,
  GraduationCap,
  HeadphonesIcon
} from 'lucide-react'
import { Alert, AlertDescription } from '../components/ui/alert'

interface TradingCondition {
  label: string
  value: string | number
  icon: React.ReactNode
  description?: string
}

interface Feature {
  name: string
  available: boolean
  description?: string
}

export function BrokerProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  const { data: broker, isLoading, error } = useQuery({
    queryKey: ['broker', id],
    queryFn: async () => {
      if (!id) throw new Error('Broker ID is required')
      
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single()
      
      if (error) throw error
      return data as Broker
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load broker information. The broker may not exist or may be inactive.
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => navigate('/brokers')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Brokers
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="h-64 bg-muted rounded" />
              <div className="h-48 bg-muted rounded" />
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-muted rounded" />
              <div className="h-48 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!broker) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Broker not found or is no longer active.
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => navigate('/brokers')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Brokers
        </Button>
      </div>
    )
  }

  const tradingConditions: TradingCondition[] = [
    {
      label: 'Minimum Deposit',
      value: `$${broker.min_deposit || 0}`,
      icon: <DollarSign className="h-4 w-4" />,
      description: 'Minimum amount required to open an account'
    },
    {
      label: 'Average Spreads',
      value: `${broker.spreads_avg || 0} pips`,
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Typical spread on major currency pairs'
    },
    {
      label: 'Maximum Leverage',
      value: `1:${broker.max_leverage || 0}`,
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Maximum leverage available for trading'
    },
    {
      label: 'Commission per Lot',
      value: `$${broker.commission_per_lot || 0}`,
      icon: <Banknote className="h-4 w-4" />,
      description: 'Commission charged per standard lot'
    }
  ]

  const features: Feature[] = [
    {
      name: 'Demo Account',
      available: broker.demo_account || false,
      description: 'Practice trading with virtual money'
    },
    {
      name: 'Education Resources',
      available: broker.education_resources || false,
      description: 'Learning materials and trading guides'
    },
    {
      name: 'Mobile Trading',
      available: broker.platforms?.includes('Mobile') || false,
      description: 'Trade on mobile devices'
    },
    {
      name: 'MetaTrader 4',
      available: broker.platforms?.includes('MT4') || false,
      description: 'Popular trading platform'
    },
    {
      name: 'MetaTrader 5',
      available: broker.platforms?.includes('MT5') || false,
      description: 'Advanced trading platform'
    },
    {
      name: 'Web Trading',
      available: broker.platforms?.includes('Web') || false,
      description: 'Browser-based trading'
    }
  ]

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrustScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Poor'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/brokers" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              All Brokers
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2">
                  {broker.name}
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {broker.country}
                  </Badge>
                  {broker.founded_year && (
                    <Badge variant="outline">
                      Est. {broker.founded_year}
                    </Badge>
                  )}
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{broker.avg_rating?.toFixed(1) || '0.0'}</span>
                    <span className="text-muted-foreground text-sm">({broker.review_count || 0} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {broker.description && (
              <p className="text-muted-foreground leading-relaxed mb-6">
                {broker.description}
              </p>
            )}

            {/* Quick Actions */}
            <div className="flex gap-3 mb-8">
              {broker.affiliate_url && (
                <Button size="lg" asChild>
                  <a 
                    href={broker.affiliate_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Broker
                  </a>
                </Button>
              )}
              <Button variant="outline" size="lg" asChild>
                <Link to="/compare" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Compare
                </Link>
              </Button>
            </div>
          </div>

          {/* Trust Score Card */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Trust Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className={`text-4xl font-bold ${getTrustScoreColor(broker.trust_score || 0)}`}>
                    {broker.trust_score || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getTrustScoreLabel(broker.trust_score || 0)}
                  </div>
                </div>
                <Progress value={broker.trust_score || 0} className="mb-4" />
                <div className="text-xs text-muted-foreground text-center">
                  Based on regulation, reputation, and user reviews
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="regulation">Regulation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Trading Conditions */}
            <Card>
              <CardHeader>
                <CardTitle>Trading Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {tradingConditions.map((condition, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {condition.icon}
                      </div>
                      <div>
                        <div className="font-medium">{condition.label}</div>
                        <div className="text-lg font-bold text-primary">{condition.value}</div>
                        {condition.description && (
                          <div className="text-sm text-muted-foreground">{condition.description}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platforms */}
            {broker.platforms && broker.platforms.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Trading Platforms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {broker.platforms.map((platform, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {platform === 'Mobile' && <Smartphone className="h-3 w-3" />}
                        {platform === 'Web' && <Globe className="h-3 w-3" />}
                        {(platform === 'MT4' || platform === 'MT5') && <Monitor className="h-3 w-3" />}
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="trading" className="space-y-6">
            {/* Payment Methods */}
            <div className="grid md:grid-cols-2 gap-6">
              {broker.deposit_methods && broker.deposit_methods.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Deposit Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {broker.deposit_methods.map((method, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{method}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {broker.withdrawal_methods && broker.withdrawal_methods.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Banknote className="h-5 w-5" />
                      Withdrawal Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {broker.withdrawal_methods.map((method, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{method}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Customer Support */}
            {broker.customer_support && broker.customer_support.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HeadphonesIcon className="h-5 w-5" />
                    Customer Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {broker.customer_support.map((support, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{support}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1">
                        {feature.available ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{feature.name}</div>
                        {feature.description && (
                          <div className="text-sm text-muted-foreground">{feature.description}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education Resources */}
            {broker.education_resources && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education & Learning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Educational resources available</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This broker provides educational materials to help traders improve their skills.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="regulation" className="space-y-6">
            {/* Regulations */}
            {broker.regulations && broker.regulations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Regulatory Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {broker.regulations.map((regulation, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium">Regulated by {regulation}</div>
                          <div className="text-sm text-muted-foreground">
                            Licensed and regulated financial services provider
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-blue-900 dark:text-blue-100">
                          Regulatory Protection
                        </div>
                        <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          This broker is regulated by reputable financial authorities, providing 
                          investor protection and ensuring compliance with industry standards.
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Trust Score Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Trust Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Regulation & Licensing</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="w-24" />
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>User Reviews & Ratings</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(broker.avg_rating || 0) * 20} className="w-24" />
                      <span className="text-sm font-medium">{((broker.avg_rating || 0) * 20).toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Trading Conditions</span>
                    <div className="flex items-center gap-2">
                      <Progress value={75} className="w-24" />
                      <span className="text-sm font-medium">75%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Platform & Features</span>
                    <div className="flex items-center gap-2">
                      <Progress value={80} className="w-24" />
                      <span className="text-sm font-medium">80%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Related Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12"
      >
        <Card>
          <CardHeader>
            <CardTitle>Related Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" asChild>
                <Link to="/compare">Compare with Other Brokers</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/ai-match">Find Similar Brokers</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to={`/brokers/${broker.country?.toLowerCase()}`}>More {broker.country} Brokers</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/quiz">Take Broker Quiz</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
