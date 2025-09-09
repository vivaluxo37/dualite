import React, { useState, useEffect, memo, useMemo } from 'react'
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
import { BrokerSEO } from '../components/seo/BrokerSEO'
import { createImageLazyLoader, addResourceHints, initWebVitals, optimizeImageLoading } from '../utils/performance'
import '../styles/performance.css'

// Lazy load heavy components
// Note: TradingChart and ReviewsSection components will be implemented later
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
  Check,
  Smartphone,
  Monitor,
  CreditCard,
  Banknote,
  GraduationCap,
  HeadphonesIcon,
  Clock,
  Users,
  Award,
  FileText,
  Lock,
  Zap,
  Target,
  TrendingDown,
  Calculator,
  BookOpen,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  Building,
  Flag,
  Percent,
  Timer,
  Activity,
  Database,
  Wifi,
  ShieldCheck,
  Info
} from 'lucide-react'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Separator } from '../components/ui/separator'



interface TradingCondition {
  label: string
  value: string | number
  icon: React.ReactNode
  description?: string
  highlight?: boolean
}

interface Feature {
  name: string
  available: boolean
  description?: string
  category?: string
}

interface SecurityFeature {
  name: string
  status: 'available' | 'partial' | 'unavailable'
  description: string
}

interface PlatformInfo {
  name: string
  type: 'desktop' | 'mobile' | 'web'
  features: string[]
  rating?: number
}

interface FeeStructure {
  type: string
  amount: string
  description: string
  frequency?: string
}

// Memoized components for better performance
const TradingConditionCard = memo(({ condition, index }: { condition: TradingCondition; index: number }) => (
  <Card key={index} className={`${condition.highlight ? 'ring-2 ring-green-500' : ''}`}>
    <CardContent className="p-4">
      <div className="flex items-center gap-2 mb-2">
        {condition.icon}
        <span className="text-sm font-medium text-muted-foreground">
          {condition.label}
        </span>
      </div>
      <div className="text-xl font-bold text-foreground">
        {condition.value}
      </div>
      {condition.highlight && (
        <Badge variant="secondary" className="mt-1 text-xs">
          Competitive
        </Badge>
      )}
    </CardContent>
  </Card>
))

const PlatformCard = memo(({ platform, index }: { platform: PlatformInfo; index: number }) => (
  <Card key={index}>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        {platform.type === 'desktop' && <Monitor className="h-5 w-5" />}
        {platform.type === 'mobile' && <Smartphone className="h-5 w-5" />}
        {platform.type === 'web' && <Globe className="h-5 w-5" />}
        {platform.name}
      </CardTitle>
      {platform.rating && (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{platform.rating}/5.0</span>
        </div>
      )}
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="text-sm text-muted-foreground">
          Key features and capabilities:
        </div>
        <div className="space-y-2">
          {platform.features.map((feature, featureIndex) => (
            <div key={featureIndex} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
))

export const EnhancedBrokerProfilePage = memo(() => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  // Initialize performance monitoring
  useEffect(() => {
    initWebVitals()
    addResourceHints()
  }, [])

  // Create image lazy loader
  const lazyLoader = useMemo(() => createImageLazyLoader(), [])

  const { data: broker, isLoading, error } = useQuery({
    queryKey: ['broker', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Broker slug is required')
      
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) throw error
      return data as Broker
    },
    enabled: !!slug
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

  // Memoized data calculations for performance
  const tradingConditions: TradingCondition[] = useMemo(() => [
    {
      label: 'Minimum Deposit',
      value: `$${broker.min_deposit || 0}`,
      icon: <DollarSign className="h-4 w-4" />,
      description: 'Minimum amount required to open a live trading account',
      highlight: (broker.min_deposit || 0) <= 100
    },
    {
      label: 'Average Spreads',
      value: `${broker.spreads_avg || 0} pips`,
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Typical spread on EUR/USD during London session',
      highlight: (broker.spreads_avg || 0) <= 1.5
    },
    {
      label: 'Maximum Leverage',
      value: `1:${broker.max_leverage || 0}`,
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Maximum leverage available for retail clients',
      highlight: (broker.max_leverage || 0) >= 500
    },
    {
      label: 'Commission',
      value: broker.commission_per_lot ? `$${broker.commission_per_lot}/lot` : 'Spread Only',
      icon: <Banknote className="h-4 w-4" />,
      description: 'Commission structure for standard accounts'
    }
  ], [broker.min_deposit, broker.spreads_avg, broker.max_leverage, broker.commission_per_lot])

  // Platform Information - memoized for performance
  const platforms: PlatformInfo[] = useMemo(() => [
    {
      name: 'MetaTrader 4',
      type: 'desktop',
      features: ['Expert Advisors', 'Custom Indicators', 'One-Click Trading', 'Advanced Charting'],
      rating: 4.5
    },
    {
      name: 'MetaTrader 5',
      type: 'desktop', 
      features: ['Multi-Asset Trading', 'Advanced Analytics', 'Economic Calendar', 'Copy Trading'],
      rating: 4.7
    },
    {
      name: 'Mobile Trading App',
      type: 'mobile',
      features: ['iOS & Android', 'Push Notifications', 'Touch ID Login', 'Real-time Quotes'],
      rating: 4.3
    },
    {
      name: 'WebTrader',
      type: 'web',
      features: ['No Download Required', 'Cross-Platform', 'Real-time Charts', 'Order Management'],
      rating: 4.1
    }
  ], [])

  // Security Features
  const securityFeatures: SecurityFeature[] = [
    {
      name: 'Regulatory Compliance',
      status: broker.regulations ? 'available' : 'unavailable',
      description: `Regulated by ${broker.regulations || 'No regulation information available'}`
    },
    {
      name: 'Client Fund Protection',
      status: 'available',
      description: 'Client funds segregated from company operational funds'
    },
    {
      name: 'Negative Balance Protection',
      status: 'available',
      description: 'Cannot lose more than your account balance'
    },
    {
      name: 'SSL Encryption',
      status: 'available',
      description: 'Bank-grade 256-bit SSL encryption for all transactions'
    },
    {
      name: 'Two-Factor Authentication',
      status: 'available',
      description: 'Additional security layer for account access'
    }
  ]

  // Fee Structure
  const feeStructure: FeeStructure[] = [
    {
      type: 'Spreads',
      amount: `From ${broker.spreads_avg || 0} pips`,
      description: 'Variable spreads on major currency pairs'
    },
    {
      type: 'Commission',
      amount: broker.commission_per_lot ? `$${broker.commission_per_lot} per lot` : 'No commission',
      description: 'Commission charged on ECN/Raw spread accounts'
    },
    {
      type: 'Overnight Fees',
      amount: 'Variable',
      description: 'Swap rates applied to positions held overnight',
      frequency: 'Daily'
    },
    {
      type: 'Deposit Fees',
      amount: 'Free',
      description: 'No fees for most deposit methods'
    },
    {
      type: 'Withdrawal Fees',
      amount: 'Variable',
      description: 'Depends on withdrawal method and amount'
    },
    {
      type: 'Inactivity Fee',
      amount: 'Variable',
      description: 'Charged after extended periods of inactivity',
      frequency: 'Monthly'
    }
  ]

  // Calculate Trust Score Color
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

  const getTrustScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    if (score >= 40) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="min-h-screen bg-background broker-content">
      {/* SEO Component */}
      <BrokerSEO broker={broker} />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link to="/brokers" className="hover:text-foreground transition-colors">Brokers</Link>
          <span>/</span>
          <Link to={`/brokers/${broker.country?.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-foreground transition-colors">{broker.country} Brokers</Link>
          <span>/</span>
          <span className="text-foreground">{broker.name} Review</span>
        </nav>

        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border-2 border-gray-100 shadow-sm flex items-center justify-center p-2">
                  {broker.logo_url ? (
                    <img 
                      src={broker.logo_url} 
                      alt={`${broker.name} logo`}
                      className="w-full h-full object-contain broker-logo loading"
                      loading="eager"
                      onLoad={(e) => {
                        const img = e.target as HTMLImageElement
                        img.classList.remove('loading')
                        img.classList.add('loaded')
                        optimizeImageLoading(img)
                      }}
                    />
                  ) : (
                    <Building className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                  {broker.name} Review 2025
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-700">{broker.country}</span>
                  </div>
                  {broker.founded_year && (
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-700">Founded {broker.founded_year}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-yellow-700">{broker.avg_rating?.toFixed(1) || '0.0'}</span>
                    <span className="text-gray-600">({broker.total_reviews || 0} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit {broker.name}
              </Button>
              <Button variant="outline" size="lg">
                <BarChart3 className="h-4 w-4 mr-2" />
                Compare Brokers
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {tradingConditions.map((condition, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <TradingConditionCard condition={condition} index={index} />
              </motion.div>
            ))}
          </div>

          {/* Trust Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 shadow-lg mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Trust Score</h3>
                <p className="text-gray-600 text-base">
                  Based on regulation, security, and user feedback
                </p>
              </div>
              <div className="text-right">
                <div className={`text-5xl font-bold ${getTrustScoreColor(broker.trust_score || 0)} mb-1`}>
                  {broker.trust_score || 0}<span className="text-2xl text-gray-400">/100</span>
                </div>
                <div className={`text-sm font-semibold px-3 py-1 rounded-full ${getTrustScoreBadgeColor(broker.trust_score || 0)}`}>
                  {getTrustScoreLabel(broker.trust_score || 0)}
                </div>
              </div>
            </div>
            <div className="relative">
              <Progress 
                value={broker.trust_score || 0} 
                className="h-3 bg-gray-200"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Poor</span>
                <span>Fair</span>
                <span>Good</span>
                <span>Excellent</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8 tabs-content">
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-200">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 bg-transparent gap-1">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl py-3 px-4 font-medium transition-all duration-200"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="trading" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl py-3 px-4 font-medium transition-all duration-200"
              >
                Trading
              </TabsTrigger>
              <TabsTrigger 
                value="fees" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl py-3 px-4 font-medium transition-all duration-200"
              >
                Fees & Pricing
              </TabsTrigger>
              <TabsTrigger 
                value="platforms" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl py-3 px-4 font-medium transition-all duration-200"
              >
                Platforms
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl py-3 px-4 font-medium transition-all duration-200"
              >
                Security
              </TabsTrigger>
              <TabsTrigger 
                value="support" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl py-3 px-4 font-medium transition-all duration-200"
              >
                Support
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                {/* Broker Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-200">
                      <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Building className="h-6 w-6 text-blue-600" />
                        </div>
                        Company Background
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {broker.description || `${broker.name} is a ${broker.country}-based forex and CFD broker offering trading services to retail and institutional clients worldwide. Established in ${broker.founded_year || 'N/A'}, the company has built a reputation for providing competitive trading conditions and reliable execution.`}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Company Details</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Founded:</span>
                            <span>{broker.founded_year || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Headquarters:</span>
                            <span>{broker.country}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Regulation:</span>
                            <span>
                              {broker.regulations ? (
                                <Link 
                                  to={`/regulation/${broker.regulations.toLowerCase().replace(/\s+/g, '-')}`}
                                  className="text-primary hover:underline"
                                >
                                  {broker.regulations}
                                </Link>
                              ) : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Trading Statistics</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Avg Rating:</span>
                            <span>{broker.avg_rating?.toFixed(1) || '0.0'}/5.0</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Reviews:</span>
                            <span>{broker.total_reviews || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Trust Score:</span>
                            <span className={getTrustScoreColor(broker.trust_score || 0)}>
                              {broker.trust_score || 0}/100
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Key Features */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Key Features & Highlights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Competitive spreads from {broker.spreads_avg || 0} pips</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Maximum leverage up to 1:{broker.max_leverage || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Minimum deposit ${broker.min_deposit || 0}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Multiple trading platforms</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Regulated and licensed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">24/5 customer support</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full" size="lg">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit {broker.name}
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Read Full Review
                    </Button>
                    <Button variant="outline" className="w-full">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Compare Brokers
                    </Button>
                  </CardContent>
                </Card>

                {/* Related Brokers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Similar Brokers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Explore other {broker.country} regulated brokers:
                    </div>
                    <div className="space-y-2">
                      <Link to={`/brokers/${broker.country?.toLowerCase().replace(/\s+/g, '-')}`} className="block text-sm text-primary hover:underline">
                        → View all {broker.country} brokers
                      </Link>
                      <Link to={`/regulation/${broker.regulations?.toLowerCase().replace(/\s+/g, '-')}`} className="block text-sm text-primary hover:underline">
                        → {broker.regulations} regulated brokers
                      </Link>
                      <Link to="/compare" className="block text-sm text-primary hover:underline">
                        → Compare with competitors
                      </Link>
                      <Link to="/ai-match" className="block text-sm text-primary hover:underline">
                        → Find your perfect broker
                      </Link>
                      <Link to={`/compare?brokers=${broker.slug}`} className="block text-sm text-primary hover:underline">
                        → Compare {broker.name}
                      </Link>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <h4 className="font-semibold text-sm">Popular Brokers</h4>
                      <div className="space-y-1">
                        <Link to="/review/ic-markets" className="block text-sm text-primary hover:underline">
                          → IC Markets Review
                        </Link>
                        <Link to="/review/pepperstone" className="block text-sm text-primary hover:underline">
                          → Pepperstone Review
                        </Link>
                        <Link to="/review/oanda" className="block text-sm text-primary hover:underline">
                          → OANDA Review
                        </Link>
                        <Link to="/review/forex-com" className="block text-sm text-primary hover:underline">
                          → Forex.com Review
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Trading Tab */}
          <TabsContent value="trading" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Account Types */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Account Types
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Standard Account</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Minimum Deposit:</span>
                          <span>${broker.min_deposit || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Spreads:</span>
                          <span>From {broker.spreads_avg || 0} pips</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Commission:</span>
                          <span>{broker.commission_per_lot ? `$${broker.commission_per_lot}/lot` : 'No commission'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">ECN Account</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Minimum Deposit:</span>
                          <span>${(broker.min_deposit || 0) * 10}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Spreads:</span>
                          <span>From 0.0 pips</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Commission:</span>
                          <span>$7/lot round turn</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trading Instruments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Available Instruments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Forex Pairs</h4>
                      <div className="text-sm text-muted-foreground">
                        <div>• Major pairs (EUR/USD, GBP/USD)</div>
                        <div>• Minor pairs (EUR/GBP, AUD/JPY)</div>
                        <div>• Exotic pairs (USD/TRY, EUR/ZAR)</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">CFDs</h4>
                      <div className="text-sm text-muted-foreground">
                        <div>• Stock indices</div>
                        <div>• Commodities</div>
                        <div>• Individual stocks</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trading Conditions Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Detailed Trading Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  {tradingConditions.map((condition, index) => (
                    <div key={index} className="text-center space-y-2">
                      <div className="flex justify-center">
                        {condition.icon}
                      </div>
                      <div className="font-semibold">{condition.label}</div>
                      <div className="text-2xl font-bold text-primary">{condition.value}</div>
                      <div className="text-xs text-muted-foreground">{condition.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fees & Pricing Tab */}
          <TabsContent value="fees" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Fee Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feeStructure.map((fee, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-semibold">{fee.type}</div>
                        <div className="text-sm text-muted-foreground">{fee.description}</div>
                        {fee.frequency && (
                          <Badge variant="outline" className="text-xs">{fee.frequency}</Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{fee.amount}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cost Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  Trading Cost Examples
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    Estimated costs for common trading scenarios:
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <div className="font-semibold mb-2">1 Lot EUR/USD</div>
                      <div className="text-2xl font-bold text-primary mb-1">
                        ${((broker.spreads_avg || 0) * 10 + (broker.commission_per_lot || 0)).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">Total cost</div>
                    </div>
                    
                    <div className="p-4 border rounded-lg text-center">
                      <div className="font-semibold mb-2">10 Lots GBP/USD</div>
                      <div className="text-2xl font-bold text-primary mb-1">
                        ${(((broker.spreads_avg || 0) * 10 + (broker.commission_per_lot || 0)) * 10).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">Total cost</div>
                    </div>
                    
                    <div className="p-4 border rounded-lg text-center">
                      <div className="font-semibold mb-2">Monthly Trading</div>
                      <div className="text-2xl font-bold text-primary mb-1">
                        ${(((broker.spreads_avg || 0) * 10 + (broker.commission_per_lot || 0)) * 100).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">100 lots/month</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Platforms Tab */}
          <TabsContent value="platforms" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {platforms.map((platform, index) => (
                <PlatformCard key={index} platform={platform} index={index} />
              ))}
            </div>
            
            {/* Trading chart placeholder - to be implemented */}
            <Card>
              <CardContent className="p-6">
                <div className="h-64 bg-muted rounded flex items-center justify-center">
                  <p className="text-muted-foreground">Trading Chart - Coming Soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Security & Reliability Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-semibold flex items-center gap-2">
                          {feature.status === 'available' && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {feature.status === 'partial' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                          {feature.status === 'unavailable' && <XCircle className="h-4 w-4 text-red-600" />}
                          {feature.name}
                        </div>
                        <div className="text-sm text-muted-foreground">{feature.description}</div>
                      </div>
                      <Badge 
                        variant={feature.status === 'available' ? 'default' : feature.status === 'partial' ? 'secondary' : 'destructive'}
                      >
                        {feature.status === 'available' ? 'Available' : feature.status === 'partial' ? 'Partial' : 'Not Available'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Performance & Reliability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-green-600">99.9%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-blue-600">&lt; 50ms</div>
                    <div className="text-sm text-muted-foreground">Execution Speed</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-purple-600">99.8%</div>
                    <div className="text-sm text-muted-foreground">Order Fill Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Customer Support */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HeadphonesIcon className="h-5 w-5" />
                    Customer Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span className="font-medium">Phone Support</span>
                      </div>
                      <Badge variant="default">24/5</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        <span className="font-medium">Live Chat</span>
                      </div>
                      <Badge variant="default">24/5</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="font-medium">Email Support</span>
                      </div>
                      <Badge variant="secondary">24/7</Badge>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Support Languages</h4>
                    <div className="text-sm text-muted-foreground">
                      English, Spanish, French, German, Italian, Portuguese
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Educational Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Educational Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Trading tutorials and guides</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Market analysis and insights</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Economic calendar</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Webinars and seminars</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Demo account training</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Learning Resources</h4>
                    <div className="space-y-1">
                      <Link to="/learn/forex-trading" className="block text-sm text-primary hover:underline">
                        → Forex Trading Course
                      </Link>
                      <Link to="/learn/market-analysis" className="block text-sm text-primary hover:underline">
                        → Market Analysis Guide
                      </Link>
                      <Link to="/learn/trading-platforms" className="block text-sm text-primary hover:underline">
                        → Trading Platform Guides
                      </Link>
                      <Link to="/calculators" className="block text-sm text-primary hover:underline">
                        → Trading Calculators
                      </Link>
                      <Link to={`/learn/brokers/${broker.slug}`} className="block text-sm text-primary hover:underline">
                        → {broker.name} Trading Guide
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 text-center space-y-6"
        >
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Start Trading with {broker.name}?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of traders who trust {broker.name} for their forex and CFD trading needs. 
              Open your account today and start trading with competitive conditions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Account with {broker.name}
              </Button>
              <Button variant="outline" size="lg">
                <FileText className="h-4 w-4 mr-2" />
                Download Full Review PDF
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Related Content */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold text-center">Related Content</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Compare Brokers</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  See how {broker.name} stacks up against other top brokers
                </p>
                <Link to="/compare">
                  <Button variant="outline" size="sm">
                    Compare Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Find Your Broker</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use our AI-powered tool to find the perfect broker for you
                </p>
                <Link to="/ai-match">
                  <Button variant="outline" size="sm">
                    Get Matched
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Learn Trading</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Master forex trading with our comprehensive learning hub
                </p>
                <Link to="/learn">
                  <Button variant="outline" size="sm">
                    Start Learning
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Strategic Internal Links Footer */}
        <div className="mt-12 border-t pt-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Trading Tools</h3>
              <div className="space-y-2 text-sm">
                <Link to="/simulator" className="block text-primary hover:underline">
                  Trading Simulator
                </Link>
                <Link to="/calculators" className="block text-primary hover:underline">
                  Trading Calculators
                </Link>
                <Link to="/quiz" className="block text-primary hover:underline">
                  Broker Quiz
                </Link>
                <Link to="/ai-match" className="block text-primary hover:underline">
                  AI Broker Matching
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">By Country</h3>
              <div className="space-y-2 text-sm">
                <Link to="/brokers/australia" className="block text-primary hover:underline">
                  Australian Brokers
                </Link>
                <Link to="/brokers/uk" className="block text-primary hover:underline">
                  UK Brokers
                </Link>
                <Link to="/brokers/usa" className="block text-primary hover:underline">
                  US Brokers
                </Link>
                <Link to="/brokers/cyprus" className="block text-primary hover:underline">
                  Cyprus Brokers
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">By Regulation</h3>
              <div className="space-y-2 text-sm">
                <Link to="/regulation/asic" className="block text-primary hover:underline">
                  ASIC Regulated
                </Link>
                <Link to="/regulation/fca" className="block text-primary hover:underline">
                  FCA Regulated
                </Link>
                <Link to="/regulation/cysec" className="block text-primary hover:underline">
                  CySEC Regulated
                </Link>
                <Link to="/regulation/cftc" className="block text-primary hover:underline">
                  CFTC Regulated
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Learning Hub</h3>
              <div className="space-y-2 text-sm">
                <Link to="/learn/forex-trading" className="block text-primary hover:underline">
                  Forex Trading Guide
                </Link>
                <Link to="/learn/market-analysis" className="block text-primary hover:underline">
                  Market Analysis
                </Link>
                <Link to="/learn/risk-management" className="block text-primary hover:underline">
                  Risk Management
                </Link>
                <Link to="/learn/trading-strategies" className="block text-primary hover:underline">
                  Trading Strategies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

EnhancedBrokerProfilePage.displayName = 'EnhancedBrokerProfilePage'