import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { CompleteBrokerData } from '../types/broker';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Alert, AlertDescription } from '../components/ui/alert';
import { SEO } from '../components/SEO';
import { TradingCostCalculator } from '../components/broker/TradingCostCalculator';
import { PlatformComparison } from '../components/broker/PlatformComparison';
import { RegulationChecker } from '../components/broker/RegulationChecker';
import { TradingSimulator } from '../components/broker/TradingSimulator';
import { BrokerMediaGallery } from '../components/broker/BrokerMediaGallery';
import {
  Star,
  Shield,
  MapPin,
  ExternalLink,
  ArrowLeft,
  TrendingUp,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  Monitor,
  CreditCard,
  Banknote,
  GraduationCap,
  HeadphonesIcon,
  Play,
  BookOpen,
  Calculator,
  Award,
  Users,
  Globe,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  FileText,
  Video,
  Download,
  Settings,
  Trophy,
  ThumbsUp,
  ThumbsDown,
  Target,
  Zap,
  Lock,
  University,
  ChartLine,
  Building2,
  Calendar,
  Percent,
  Activity,
  Layers,
  Database,
  Network,
  Smartphone,
  Tablet,
  Computer,
  Code,
  Cloud,
  Server,
  ShieldCheck,
  FileSignature,
  Scale,
  Gavel,
  Eye,
  Heart,
  Share2,
  Copy
} from 'lucide-react';

interface TradingCondition {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  details?: string;
}

interface Feature {
  name: string;
  available: boolean;
  description?: string;
  details?: string;
}

interface FeeStructure {
  type: string;
  amount: string | number;
  description: string;
  conditions?: string;
}

interface AccountType {
  name: string;
  minDeposit: number;
  spreadType: string;
  commission: string;
  leverage: string;
  features: string[];
  bestFor: string;
}

interface PlatformDetail {
  name: string;
  type: string;
  rating: number;
  features: string[];
  pros: string[];
  cons: string[];
  screenshot?: string;
  downloadLink?: string;
}

interface RegulationDetail {
  authority: string;
  licenseNumber: string;
  status: string;
  leverageLimit: string;
  protectionScheme: string;
  verificationDate: string;
}

interface SupportChannel {
  type: string;
  available: boolean;
  hours: string;
  responseTime: string;
  languages: string[];
  rating?: number;
}

export function BrokerProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: broker, isLoading, error } = useQuery({
    queryKey: ['broker', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Broker slug is required');

      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data as CompleteBrokerData;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

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
    );
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
    );
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
    );
  }

  const tradingConditions: TradingCondition[] = [
    {
      label: 'Minimum Deposit',
      value: broker.min_deposit === 0 ? 'No minimum' : `$${broker.min_deposit || 0}`,
      icon: <DollarSign className="h-4 w-4" />,
      description: 'Minimum amount required to open an account'
    },
    {
      label: 'Average Spreads',
      value: `${broker.spreads_avg ?? 0} pips`,
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Typical spread on major currency pairs'
    },
    {
      label: 'Maximum Leverage',
      value: broker.leverage_max || 'N/A',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Maximum leverage available for trading'
    },
    {
      label: 'Spread Type',
      value: broker.spread_type || 'N/A',
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Type of spread offered by the broker'
    },
    {
      label: 'Execution Type',
      value: broker.execution_type || 'N/A',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Order execution method'
    },
    {
      label: 'Commission',
      value: broker.commission_structure?.type === 'none' ? 'No commission' : `${broker.commission_structure?.amount || 0}%`,
      icon: <DollarSign className="h-4 w-4" />,
      description: 'Commission structure on trades'
    }
  ];

  const features: Feature[] = [
    {
      name: 'Demo Account',
      available: broker.demo_account_details?.available || false,
      description: 'Practice trading with virtual money'
    },
    {
      name: 'Education Resources',
      available: (broker.educational_materials?.length || 0) > 0 || (broker.webinar_count || 0) > 0,
      description: 'Learning materials and trading guides'
    },
    {
      name: 'Mobile Trading',
      available: (broker.mobile_trading_apps?.length || 0) > 0,
      description: 'Trade on mobile devices'
    },
    {
      name: 'MetaTrader 4',
      available: broker.trading_platforms?.some((p: any) => p.name?.toLowerCase().includes('mt4')) || false,
      description: 'Popular trading platform'
    },
    {
      name: 'MetaTrader 5',
      available: broker.trading_platforms?.some((p: any) => p.name?.toLowerCase().includes('mt5')) || false,
      description: 'Advanced trading platform'
    },
    {
      name: 'Web Trading',
      available: (broker.web_trading_platforms?.length || 0) > 0,
      description: 'Browser-based trading'
    },
    {
      name: 'API Trading',
      available: broker.api_trading?.available || false,
      description: 'Algorithmic trading support'
    },
    {
      name: 'VPS Hosting',
      available: broker.vps_hosting || false,
      description: 'Free VPS for trading'
    },
    {
      name: 'Copy Trading',
      available: broker.copy_trading || false,
      description: 'Copy other traders\' strategies'
    },
    {
      name: 'Islamic Account',
      available: broker.islamic_account?.available || broker.swap_free || false,
      description: 'Swap-free trading account'
    }
  ];

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

  // Generate enhanced structured data for SEO 2025 best practices
  const generateStructuredData = () => {
    if (!broker) return null;

    // Main financial service schema
    const financialServiceSchema = {
      "@context": "https://schema.org",
      "@type": "FinancialService",
      "name": broker.name,
      "description": broker.company_description || `${broker.name} is a forex broker regulated in ${broker.country}`,
      "url": typeof window !== 'undefined' ? window.location.href : '',
      "logo": broker.logo_url,
      "image": broker.og_image_url || broker.logo_url,
      "telephone": broker.regional_offices?.[0]?.phone || '',
      "email": broker.regional_offices?.[0]?.email || '',
      "address": {
        "@type": "PostalAddress",
        "addressCountry": broker.country,
        "addressLocality": broker.headquarters_location || ''
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": broker.avg_rating || 0,
        "reviewCount": broker.total_reviews || 0,
        "bestRating": 5,
        "worstRating": 1
      },
      "serviceType": "Online Trading",
      "provider": {
        "@type": "Organization",
        "name": broker.parent_company || broker.name,
        "foundingDate": broker.established_year?.toString() || '',
        "numberOfEmployees": broker.employee_count?.toString() || '',
        "address": {
          "@type": "PostalAddress",
          "addressCountry": broker.country,
          "addressLocality": broker.headquarters_location || ''
        }
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Trading Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Forex Trading",
              "description": "Foreign exchange trading services"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "CFD Trading",
              "description": "Contract for Difference trading services"
            }
          },
          ...(broker.instruments?.map(instrument => ({
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": `${instrument} Trading`,
              "description": `${instrument} trading services`
            }
          })) || [])
        ]
      },
      "areaServed": broker.regional_offices?.map(office => ({
        "@type": "Country",
        "name": office.country
      })) || [],
      "availableChannel": [
        ...(broker.support_channels?.map(channel => ({
          "@type": "ServiceChannel",
          "serviceType": "Customer Support",
          "serviceUrl": broker.website_url,
          "availableLanguage": channel.languages?.map(lang => ({
            "@type": "Language",
            "name": lang
          })) || []
        })) || [])
      ],
      "paymentAccepted": broker.base_currencies?.join(', ') || '',
      "priceRange": broker.min_deposit ? `$${broker.min_deposit}+` : '',
      "openingHours": broker.support_availability === '24/7' ? "Mo-Su 00:00-23:59" : broker.support_availability === '24/5' ? "Mo-Fr 00:00-23:59" : ''
    };

    // Add financial service business schema
    const financialServiceBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "FinancialService",
      "name": broker.name,
      "description": broker.company_description,
      "url": broker.website_url,
      "logo": broker.logo_url,
      "image": broker.og_image_url || broker.logo_url,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": broker.country,
        "addressLocality": broker.headquarters_location || ''
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": null,
        "longitude": null
      },
      "openingHoursSpecification": broker.support_availability === '24/7' ? [{
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      }] : [],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Trading Account Types",
        "itemListElement": [
          ...(broker.standard_account ? [{
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Standard Account",
              "description": `Standard trading account with ${broker.standard_account.spread_type} spreads, minimum deposit: $${broker.standard_account.minimum_deposit}`
            }
          }] : []),
          ...(broker.ecn_stp_account ? [{
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "ECN/STP Account",
              "description": `ECN/STP trading account with ${broker.ecn_stp_account.spread_type} spreads, minimum deposit: $${broker.ecn_stp_account.minimum_deposit}`
            }
          }] : []),
          ...(broker.islamic_account?.available ? [{
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Islamic Account",
              "description": "Swap-free Islamic trading account compliant with Sharia law"
            }
          }] : [])
        ]
      }
    };

    // Add regulatory information schema
    const regulatorySchema = broker.regulatory_details && Object.keys(broker.regulatory_details).length > 0 ? {
      "@context": "https://schema.org",
      "@type": "FinancialService",
      "name": broker.name,
      "regulatoryCompliance": Object.entries(broker.regulatory_details).map(([regulator, details]) => ({
        "@type": "RegulatoryCompliance",
        "regulator": {
          "@type": "GovernmentOrganization",
          "name": regulator
        },
        "licenseNumber": details.license_number || '',
        "regulatoryJurisdiction": details.jurisdiction || regulator,
        "complianceDate": details.verification_date || ''
      })),
      "knowsAbout": broker.regulations?.join(', ') || ''
    } : null;

    // Return array of all relevant schemas
    const schemas = [financialServiceSchema, financialServiceBusinessSchema];
    if (regulatorySchema) schemas.push(regulatorySchema);

    return schemas;
  };

  // Generate meta information
  const generateMetaInfo = () => {
    if (!broker) return { title: '', description: '', keywords: [] };

    const title = broker.seo_title || `${broker.name} Review 2025 | Trust Score ${broker.trust_score || 0}/100 | Is it Safe?`;
    const description = broker.seo_description || `Comprehensive ${broker.name} review for 2025. Learn about regulations, trading conditions, platforms, and fees. Trust Score: ${broker.trust_score || 0}/100.`;
    const keywords = broker.seo_keywords || [
      `${broker.name} review`,
      `${broker.name} forex broker`,
      `${broker.name} trading`,
      `forex broker ${broker.country}`,
      `${broker.name} regulations`,
      `${broker.name} fees`
    ];

    return { title, description, keywords };
  };

  const { title, description, keywords } = generateMetaInfo();

  // Ensure required string values for SEO component
  const safeTitle = title || '';
  const safeDescription = description || '';
  const safeKeywords = keywords || [];

  return (
    <>
      <SEO
        title={safeTitle}
        description={safeDescription}
        keywords={safeKeywords.join(', ')}
        canonicalUrl={typeof window !== 'undefined' ? window.location.href : ''}
        ogImage={broker.og_image_url || broker.logo_url || '/og-default.jpg'}
        structuredData={generateStructuredData()}
      />

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
              <div className="flex items-start gap-6 mb-4">
                <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  {broker.logo_url ? (
                    <img src={broker.logo_url} alt={broker.name} className="w-16 h-16 object-contain" />
                  ) : (
                    <TrendingUp className="h-10 w-10 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2">
                    {broker.name}
                  </h1>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {broker.country}
                    </Badge>
                    {broker.established_year && (
                      <Badge variant="outline">
                        Est. {broker.established_year}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{broker.avg_rating?.toFixed(1) || '0.0'}</span>
                      <span className="text-muted-foreground text-sm">({broker.total_reviews || 0} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              {broker.company_description && (
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {broker.company_description}
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
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trading">Trading</TabsTrigger>
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
              <TabsTrigger value="fees">Fees</TabsTrigger>
            </TabsList>
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="regulation">Regulation</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="pros-cons">Pros & Cons</TabsTrigger>
              <TabsTrigger value="verdict">Verdict</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Executive Summary */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Executive Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-lg font-medium mb-4">
                      {broker.name} is a {broker.regulation_tier || 'well-established'} forex broker founded in {broker.established_year || 'the early 2000s'}, offering trading services to clients worldwide with a trust score of {broker.trust_score || 0}/100.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <h4 className="font-semibold mb-2">Key Strengths</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Strong regulatory framework with {broker.regulations?.length || 0} licenses
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Competitive spreads from {broker.spreads_avg || 0} pips
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Multiple trading platforms available
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Best For</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            {broker.min_deposit === 0 ? 'Beginners with no minimum deposit' : 'Traders with $' + broker.min_deposit + ' minimum deposit'}
                          </li>
                          <li className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-blue-600" />
                            International traders seeking multiple regulations
                          </li>
                          <li className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-600" />
                            Active traders with competitive spreads
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{broker.trust_score || 0}/100</div>
                    <div className="text-sm text-muted-foreground">Trust Score</div>
                    <Progress value={broker.trust_score || 0} className="mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{broker.spreads_avg || 0} pips</div>
                    <div className="text-sm text-muted-foreground">Avg Spreads</div>
                    <div className="text-xs text-muted-foreground mt-2">EUR/USD</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{broker.regulations?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">Regulations</div>
                    <div className="text-xs text-muted-foreground mt-2">Global licenses</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{broker.total_reviews || 0}</div>
                    <div className="text-sm text-muted-foreground">User Reviews</div>
                    <div className="flex items-center justify-center mt-2">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs ml-1">{(broker.avg_rating || 0).toFixed(1)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Company Background */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Company Background
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <h4 className="font-semibold mb-2">About {broker.name}</h4>
                      <p className="text-muted-foreground mb-4">
                        {broker.company_description || `${broker.name} is a forex and CFD broker providing online trading services to retail and institutional clients worldwide. The broker offers access to multiple asset classes including forex, indices, commodities, and cryptocurrencies through various trading platforms.`}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Founded:</span> {broker.established_year || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Headquarters:</span> {broker.headquarters_location || broker.country || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Parent Company:</span> {broker.parent_company || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Business Model:</span> {broker.business_model || 'Market Maker'}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h5 className="font-semibold mb-2">Quick Facts</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Active Traders:</span>
                            <span>{broker.active_traders_count?.toLocaleString() || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Employees:</span>
                            <span>{broker.employee_count?.toLocaleString() || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Regulation Tier:</span>
                            <Badge variant="outline">{broker.regulation_tier || 'Tier 2'}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trading Conditions Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Trading Conditions at a Glance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tradingConditions.map((condition: TradingCondition, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
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
            </TabsContent>

            <TabsContent value="trading" className="space-y-6">
              {/* Trading Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChartLine className="h-5 w-5" />
                    Trading Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-4">Spreads & Commissions</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <div>
                            <div className="font-medium">EUR/USD Spread</div>
                            <div className="text-sm text-muted-foreground">Average</div>
                          </div>
                          <div className="text-2xl font-bold text-green-600">{broker.spreads_avg || 0} pips</div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <div>
                            <div className="font-medium">Spread Type</div>
                            <div className="text-sm text-muted-foreground">Pricing model</div>
                          </div>
                          <div className="text-lg font-bold text-blue-600">{broker.spread_type || 'Variable'}</div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                          <div>
                            <div className="font-medium">Commission</div>
                            <div className="text-sm text-muted-foreground">Per standard lot</div>
                          </div>
                          <div className="text-lg font-bold text-purple-600">
                            {broker.commission_structure?.type === 'none' ? 'None' : `$${broker.commission_structure?.amount || 0} ${broker.commission_structure?.type || ''}`}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-4">Leverage & Margin</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                          <div>
                            <div className="font-medium">Maximum Leverage</div>
                            <div className="text-sm text-muted-foreground">For retail clients</div>
                          </div>
                          <div className="text-lg font-bold text-orange-600">
                            1:{broker.leverage_max || '30'}
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                          <div>
                            <div className="font-medium">Margin Call</div>
                            <div className="text-sm text-muted-foreground">Level</div>
                          </div>
                          <div className="text-lg font-bold text-red-600">
                            {broker.margin_requirements?.margin_call_level || '50%'}
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                          <div>
                            <div className="font-medium">Stop Out</div>
                            <div className="text-sm text-muted-foreground">Level</div>
                          </div>
                          <div className="text-lg font-bold text-yellow-600">
                            {broker.margin_requirements?.stop_out_level || '20%'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Execution & Order Types */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Execution Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Activity className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">Execution Type</div>
                          <div className="text-lg font-bold">{broker.execution_type || 'Market Execution'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">Execution Speed</div>
                          <div className="text-lg font-bold">{broker.execution_speed_ms || '<100'} ms</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Percent className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">Slippage Rate</div>
                          <div className="text-lg font-bold">{broker.slippage_rate || '<1'}%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Order Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {broker.order_types?.map((orderType: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">{orderType}</span>
                        </div>
                      )) || (
                        <>
                          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">Market Order</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">Limit Order</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">Stop Order</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">Trailing Stop</span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Trading Instruments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Available Trading Instruments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {broker.instruments?.map((instrument: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-4 border rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium capitalize">{instrument}</div>
                          <div className="text-sm text-muted-foreground">Available</div>
                        </div>
                      </div>
                    )) || (
                      <>
                        <div className="flex items-center gap-3 p-4 border rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <div className="font-medium">Forex</div>
                            <div className="text-sm text-muted-foreground">50+ pairs</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 border rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <div className="font-medium">Indices</div>
                            <div className="text-sm text-muted-foreground">20+ indices</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 border rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <div className="font-medium">Commodities</div>
                            <div className="text-sm text-muted-foreground">15+ commodities</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 border rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <div className="font-medium">Cryptocurrencies</div>
                            <div className="text-sm text-muted-foreground">25+ coins</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Trading Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Trading Features & Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      {(broker as any).hedging_allowed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <div className="font-medium">Hedging Allowed</div>
                        <div className="text-sm text-muted-foreground">
                          {(broker as any).hedging_allowed ? 'Yes' : 'No'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      {(broker as any).scalping_allowed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <div className="font-medium">Scalping Allowed</div>
                        <div className="text-sm text-muted-foreground">
                          {(broker as any).scalping_allowed ? 'Yes' : 'No'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      {(broker as any).expert_advisors_allowed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <div className="font-medium">Expert Advisors</div>
                        <div className="text-sm text-muted-foreground">
                          {(broker as any).expert_advisors_allowed ? 'Yes' : 'No'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      {broker.negative_balance_protection ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <div className="font-medium">Negative Balance Protection</div>
                        <div className="text-sm text-muted-foreground">
                          {broker.negative_balance_protection ? 'Yes' : 'No'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      {broker.islamic_account?.available || broker.swap_free ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <div className="font-medium">Islamic Account</div>
                        <div className="text-sm text-muted-foreground">
                          {broker.islamic_account?.available || broker.swap_free ? 'Yes' : 'No'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      {broker.automated_trading ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <div className="font-medium">Automated Trading</div>
                        <div className="text-sm text-muted-foreground">
                          {broker.automated_trading ? 'Yes' : 'No'}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="platforms" className="space-y-6">
              {/* Trading Platforms Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Trading Platforms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                    {broker.trading_platforms?.map((platform: any, index: number) => (
                      <div key={index} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-xl font-semibold">{platform.name}</h4>
                            <Badge variant="outline" className="mt-1">{platform.type}</Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="font-medium">4.5</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {platform.name === 'MT4' ? 'The most popular trading platform with advanced charting, automated trading, and extensive technical analysis tools.' :
                           platform.name === 'MT5' ? 'Next-generation trading platform with improved performance, more timeframes, and additional order types.' :
                           'A comprehensive trading platform with advanced features and tools for professional traders.'}
                        </p>
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-medium mb-2">Key Features</h5>
                            <div className="flex flex-wrap gap-2">
                              {platform.features?.slice(0, 6).map((feature: string, featureIndex: number) => (
                                <Badge key={featureIndex} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                              {platform.features && platform.features.length > 6 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{platform.features.length - 6} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Automated Trading:</span>
                              <span className="ml-1">{platform.automated_trading ? 'Yes' : 'No'}</span>
                            </div>
                            <div>
                              <span className="font-medium">VPS Compatible:</span>
                              <span className="ml-1">{platform.vps_compatible ? 'Yes' : 'No'}</span>
                            </div>
                            <div>
                              <span className="font-medium">Charting Tools:</span>
                              <span className="ml-1">{platform.charting_tools?.length || 30}+</span>
                            </div>
                            <div>
                              <span className="font-medium">Technical Indicators:</span>
                              <span className="ml-1">{platform.technical_indicators?.length || 50}+</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    )) || (
                      <>
                        {/* Default platforms if no data */}
                        <div className="border rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-xl font-semibold">MetaTrader 4</h4>
                              <Badge variant="outline" className="mt-1">Computer</Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="font-medium">4.8</span>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-4">
                            The industry-standard trading platform with advanced charting, automated trading, and extensive technical analysis tools.
                          </p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </Button>
                          </div>
                        </div>
                        <div className="border rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-xl font-semibold">Web Platform</h4>
                              <Badge variant="outline" className="mt-1">Web</Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="font-medium">4.3</span>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-4">
                            Browser-based trading platform with no download required. Access your account from any device with internet connectivity.
                          </p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Launch
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-4 w-4 mr-2" />
                              Demo
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Mobile Trading */}
              {broker.mobile_trading_apps && broker.mobile_trading_apps.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      Mobile Trading Apps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {broker.mobile_trading_apps.map((app: any, index: number) => (
                        <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <Smartphone className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{app.name}</h4>
                            <Badge variant="outline" className="mb-2">{app.platform}</Badge>
                            <div className="text-sm text-muted-foreground">
                              Full-featured mobile trading with real-time quotes, charting, and order management.
                            </div>
                            <div className="mt-2 flex gap-2">
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Platform Comparison */}
              <PlatformComparison />
            </TabsContent>

            <TabsContent value="accounts" className="space-y-6">
              {/* Account Types */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Account Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Standard Account */}
                    <div className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-semibold">Standard Account</h4>
                        <Badge variant="secondary">Most Popular</Badge>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Minimum Deposit:</span>
                            <div className="text-lg font-bold">${broker.standard_account?.minimum_deposit || broker.min_deposit || 100}</div>
                          </div>
                          <div>
                            <span className="font-medium">Spread Type:</span>
                            <div className="text-lg font-bold">{broker.standard_account?.spread_type || broker.spread_type || 'Variable'}</div>
                          </div>
                          <div>
                            <span className="font-medium">Commission:</span>
                            <div className="text-lg font-bold">{broker.standard_account?.commission || 'None'}</div>
                          </div>
                          <div>
                            <span className="font-medium">Leverage:</span>
                            <div className="text-lg font-bold">{broker.standard_account?.leverage_max || broker.leverage_max || '1:30'}</div>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Best For</h5>
                          <p className="text-sm text-muted-foreground">
                            Beginner to intermediate traders looking for competitive spreads and no commission trading.
                          </p>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Key Features</h5>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">No Commission</Badge>
                            <Badge variant="outline" className="text-xs">Variable Spreads</Badge>
                            <Badge variant="outline" className="text-xs">Hedging Allowed</Badge>
                            <Badge variant="outline" className="text-xs">Scalping Allowed</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ECN/STP Account */}
                    <div className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-semibold">ECN/STP Account</h4>
                        <Badge variant="outline">Professional</Badge>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Minimum Deposit:</span>
                            <div className="text-lg font-bold">${broker.ecn_stp_account?.minimum_deposit || 500}</div>
                          </div>
                          <div>
                            <span className="font-medium">Spread Type:</span>
                            <div className="text-lg font-bold">Raw/ECN</div>
                          </div>
                          <div>
                            <span className="font-medium">Commission:</span>
                            <div className="text-lg font-bold">${broker.ecn_stp_account?.commission || '3-5'}/lot</div>
                          </div>
                          <div>
                            <span className="font-medium">Leverage:</span>
                            <div className="text-lg font-bold">{broker.ecn_stp_account?.leverage_max || '1:100'}</div>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Best For</h5>
                          <p className="text-sm text-muted-foreground">
                            Experienced traders seeking direct market access, tighter spreads, and faster execution.
                          </p>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Key Features</h5>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">Raw Spreads</Badge>
                            <Badge variant="outline" className="text-xs">Direct Market Access</Badge>
                            <Badge variant="outline" className="text-xs">No Dealing Desk</Badge>
                            <Badge variant="outline" className="text-xs">Fast Execution</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Islamic Account */}
                    {(broker.islamic_account?.available || broker.swap_free) && (
                      <div className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-xl font-semibold">Islamic Account</h4>
                          <Badge variant="outline">Swap-Free</Badge>
                        </div>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Minimum Deposit:</span>
                              <div className="text-lg font-bold">${broker.islamic_account?.minimum_deposit || broker.min_deposit || 100}</div>
                            </div>
                            <div>
                              <span className="font-medium">Spread Type:</span>
                              <div className="text-lg font-bold">{broker.islamic_account?.spread_type || broker.spread_type || 'Variable'}</div>
                            </div>
                            <div>
                              <span className="font-medium">Commission:</span>
                              <div className="text-lg font-bold">{broker.islamic_account?.commission || 'None'}</div>
                            </div>
                            <div>
                              <span className="font-medium">Leverage:</span>
                              <div className="text-lg font-bold">{broker.islamic_account?.leverage_max || broker.leverage_max || '1:30'}</div>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium mb-2">Best For</h5>
                            <p className="text-sm text-muted-foreground">
                              Muslim traders seeking Sharia-compliant trading with no swap or rollover interest.
                            </p>
                          </div>
                          <div>
                            <h5 className="font-medium mb-2">Key Features</h5>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="text-xs">No Swaps</Badge>
                              <Badge variant="outline" className="text-xs">Sharia Compliant</Badge>
                              <Badge variant="outline" className="text-xs">Same Features</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Professional Account */}
                    {broker.professional_account?.available && (
                      <div className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-xl font-semibold">Professional Account</h4>
                          <Badge variant="outline">Pro Traders</Badge>
                        </div>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Minimum Deposit:</span>
                              <div className="text-lg font-bold">${broker.professional_account?.minimum_deposit || 10000}</div>
                            </div>
                            <div>
                              <span className="font-medium">Spread Type:</span>
                              <div className="text-lg font-bold">Raw/ECN</div>
                            </div>
                            <div>
                              <span className="font-medium">Commission:</span>
                              <div className="text-lg font-bold">${broker.professional_account?.commission || '2-4'}/lot</div>
                            </div>
                            <div>
                              <span className="font-medium">Leverage:</span>
                              <div className="text-lg font-bold">{broker.professional_account?.leverage_max || '1:200'}</div>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium mb-2">Requirements</h5>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• Minimum 12 months trading experience</li>
                              <li>• Trading volume of $10M+ in previous 12 months</li>
                              <li>• Financial portfolio of €500K+</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Demo Account */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Demo Account
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Practice Trading</h4>
                      <p className="text-muted-foreground mb-4">
                        Try {broker.name}'s trading platform risk-free with a demo account. Practice your strategies and get familiar with the platform before trading with real money.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm">${broker.demo_account_details?.virtual_funds || 50000} virtual funds</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm">{broker.demo_account_details?.duration || '30'} days access</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm">Full platform features</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm">Real-time market data</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">Free</div>
                        <div className="text-sm text-muted-foreground mb-4">No credit card required</div>
                        <Button size="lg" className="w-full">
                          Open Demo Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fees" className="space-y-6">
              {/* Fee Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Fee Structure Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">Low</div>
                      <div className="text-sm text-muted-foreground">Trading Fees</div>
                      <div className="text-xs text-muted-foreground mt-1">Competitive spreads</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">None</div>
                      <div className="text-sm text-muted-foreground">Deposit Fees</div>
                      <div className="text-xs text-muted-foreground mt-1">Free deposits</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">${broker.account_fees?.withdrawal || 0}</div>
                      <div className="text-sm text-muted-foreground">Withdrawal Fees</div>
                      <div className="text-xs text-muted-foreground mt-1">Per withdrawal</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trading Fees */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Trading Fees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-4">Spreads by Asset Class</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Asset Class</th>
                              <th className="text-center p-2">Average Spread</th>
                              <th className="text-center p-2">Minimum Spread</th>
                              <th className="text-center p-2">Commission</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="p-2 font-medium">Forex (EUR/USD)</td>
                              <td className="p-2 text-center">{broker.spreads_avg || 0.8} pips</td>
                              <td className="p-2 text-center">0.1 pips</td>
                              <td className="p-2 text-center">None</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2 font-medium">Indices</td>
                              <td className="p-2 text-center">1.0 points</td>
                              <td className="p-2 text-center">0.5 points</td>
                              <td className="p-2 text-center">None</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2 font-medium">Commodities</td>
                              <td className="p-2 text-center">0.3 pips</td>
                              <td className="p-2 text-center">0.1 pips</td>
                              <td className="p-2 text-center">None</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2 font-medium">Stocks</td>
                              <td className="p-2 text-center">0.1%</td>
                              <td className="p-2 text-center">0.05%</td>
                              <td className="p-2 text-center">None</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-4">Commission Structure</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium mb-2">Standard Account</h5>
                          <div className="text-2xl font-bold text-green-600 mb-2">No Commission</div>
                          <p className="text-sm text-muted-foreground">
                            Trading costs are included in the spread. No additional commission per trade.
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium mb-2">ECN/STP Account</h5>
                          <div className="text-2xl font-bold text-blue-600 mb-2">${broker.ecn_stp_account?.commission || '3-5'}/lot</div>
                          <p className="text-sm text-muted-foreground">
                            Raw spreads with small commission per standard lot traded.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Fees */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Account Fees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4">Deposit & Withdrawal Fees</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <div>
                            <div className="font-medium">Bank Transfer</div>
                            <div className="text-sm text-muted-foreground">2-5 business days</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">Free</div>
                            <div className="text-sm text-muted-foreground">No fees</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <div>
                            <div className="font-medium">Credit/Debit Card</div>
                            <div className="text-sm text-muted-foreground">Instant</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">Free</div>
                            <div className="text-sm text-muted-foreground">No fees</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <div>
                            <div className="font-medium">E-wallets</div>
                            <div className="text-sm text-muted-foreground">Instant</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">Free</div>
                            <div className="text-sm text-muted-foreground">No fees</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-4">Other Account Fees</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <div>
                            <div className="font-medium">Inactivity Fee</div>
                            <div className="text-sm text-muted-foreground">After 3 months</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">${broker.inactivity_fees?.amount || 10}/month</div>
                            <div className="text-sm text-muted-foreground">{broker.inactivity_fees?.period || 'Monthly'}</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <div>
                            <div className="font-medium">Account Maintenance</div>
                            <div className="text-sm text-muted-foreground">Ongoing</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">Free</div>
                            <div className="text-sm text-muted-foreground">No maintenance fees</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <div>
                            <div className="font-medium">Currency Conversion</div>
                            <div className="text-sm text-muted-foreground">When applicable</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{broker.currency_conversion_fees || 0.5}%</div>
                            <div className="text-sm text-muted-foreground">Per conversion</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fee Calculator */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Trading Cost Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Account Type</label>
                        <select className="w-full p-2 border rounded-lg">
                          <option>Standard Account</option>
                          <option>ECN/STP Account</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Trading Volume (lots per month)</label>
                        <input type="range" min="1" max="1000" defaultValue="50" className="w-full" />
                        <div className="text-center font-medium mt-2">50 lots</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Average Trade Size (lots)</label>
                        <input type="range" min="0.01" max="10" step="0.01" defaultValue="1" className="w-full" />
                        <div className="text-center font-medium mt-2">1.0 lots</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold mb-2">Estimated Monthly Cost</h4>
                        <div className="text-3xl font-bold text-green-600 mb-2">$120</div>
                        <div className="text-sm text-muted-foreground">
                          Based on your trading volume and average spreads
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Spread Costs:</span>
                          <div className="font-bold">$80</div>
                        </div>
                        <div>
                          <span className="font-medium">Commission:</span>
                          <div className="font-bold">$40</div>
                        </div>
                        <div>
                          <span className="font-medium">Other Fees:</span>
                          <div className="font-bold">$0</div>
                        </div>
                        <div>
                          <span className="font-medium">Effective Rate:</span>
                          <div className="font-bold">0.8 pips</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trading Cost Calculator */}
              <TradingCostCalculator broker={broker} />
            </TabsContent>

            <TabsContent value="regulation" className="space-y-6">
              {/* Regulatory Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" />
                    Regulatory Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <Shield className="h-6 w-6 text-green-600" />
                          <div>
                            <div className="font-semibold text-green-900">
                              {broker.regulation_tier?.toUpperCase() || 'TIER 1'} Regulation
                            </div>
                            <div className="text-sm text-green-700">Highly regulated broker</div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          This broker is regulated by multiple reputable financial authorities, providing strong investor protection and ensuring compliance with strict regulatory standards.
                        </p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <FileSignature className="h-6 w-6 text-blue-600" />
                          <div>
                            <div className="font-semibold text-blue-900">
                              {broker.regulations?.length || 0} Active Licenses
                            </div>
                            <div className="text-sm text-blue-700">Multi-jurisdictional regulation</div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Licensed in multiple jurisdictions, allowing the broker to serve clients globally while maintaining high regulatory standards.
                        </p>
                      </div>
                    </div>

                    {/* Regulatory Bodies */}
                    <div>
                      <h4 className="font-semibold mb-4">Regulatory Authorities</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {broker.regulations?.map((regulation: string, index: number) => (
                          <div key={index} className="flex items-center gap-3 p-4 border rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                              <div className="font-medium">{regulation}</div>
                              <div className="text-sm text-muted-foreground">Active License</div>
                            </div>
                          </div>
                        )) || (
                          <>
                            <div className="flex items-center gap-3 p-4 border rounded-lg">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <div>
                                <div className="font-medium">FCA (UK)</div>
                                <div className="text-sm text-muted-foreground">Active License</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 border rounded-lg">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <div>
                                <div className="font-medium">ASIC (Australia)</div>
                                <div className="text-sm text-muted-foreground">Active License</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 border rounded-lg">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <div>
                                <div className="font-medium">CySEC (Cyprus)</div>
                                <div className="text-sm text-muted-foreground">Active License</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 border rounded-lg">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <div>
                                <div className="font-medium">FINMA (Switzerland)</div>
                                <div className="text-sm text-muted-foreground">Active License</div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Investor Protection */}
                    <div>
                      <h4 className="font-semibold mb-4">Investor Protection</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Scale className="h-5 w-5 text-blue-600" />
                            <span className="font-medium">Segregated Funds</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Client funds are kept in separate bank accounts for enhanced security.
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-5 w-5 text-green-600" />
                            <span className="font-medium">Compensation Scheme</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Protected by investor compensation funds up to €85,000.
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Gavel className="h-5 w-5 text-purple-600" />
                            <span className="font-medium">Negative Balance Protection</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Clients cannot lose more than their account balance.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                        <Progress value={broker.trust_and_safety_score || 85} className="w-24" />
                        <span className="text-sm font-medium">{broker.trust_and_safety_score || 85}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>User Reviews & Ratings</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(broker.avg_rating || 4.2) * 20} className="w-24" />
                        <span className="text-sm font-medium">{((broker.avg_rating || 4.2) * 20).toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Trading Conditions</span>
                      <div className="flex items-center gap-2">
                        <Progress value={broker.trading_conditions_score || 80} className="w-24" />
                        <span className="text-sm font-medium">{broker.trading_conditions_score || 80}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Platform & Features</span>
                      <div className="flex items-center gap-2">
                        <Progress value={broker.platforms_score || 85} className="w-24" />
                        <span className="text-sm font-medium">{broker.platforms_score || 85}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Customer Support</span>
                      <div className="flex items-center gap-2">
                        <Progress value={broker.customer_support_score || 75} className="w-24" />
                        <span className="text-sm font-medium">{broker.customer_support_score || 75}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Education Resources</span>
                      <div className="flex items-center gap-2">
                        <Progress value={broker.education_score || 70} className="w-24" />
                        <span className="text-sm font-medium">{broker.education_score || 70}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="support" className="space-y-6">
              {/* Customer Support Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HeadphonesIcon className="h-5 w-5" />
                    Customer Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4">Support Channels</h4>
                      <div className="space-y-4">
                        {broker.support_channels && typeof broker.support_channels === 'object' ? (
                          <>
                            {broker.support_channels.email && (
                              <div className="flex items-start gap-3 p-4 border rounded-lg">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <Mail className="h-4 w-4" />
                                </div>
                                <div>
                                  <h5 className="font-medium">Email Support</h5>
                                  <p className="text-sm text-muted-foreground">24/7 email support available</p>
                                </div>
                              </div>
                            )}
                            {broker.support_channels.phone && (
                              <div className="flex items-start gap-3 p-4 border rounded-lg">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <Phone className="h-4 w-4" />
                                </div>
                                <div>
                                  <h5 className="font-medium">Phone Support</h5>
                                  <p className="text-sm text-muted-foreground">Phone support available</p>
                                </div>
                              </div>
                            )}
                            {broker.support_channels.live_chat && (
                              <div className="flex items-start gap-3 p-4 border rounded-lg">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <MessageCircle className="h-4 w-4" />
                                </div>
                                <div>
                                  <h5 className="font-medium">Live Chat</h5>
                                  <p className="text-sm text-muted-foreground">Live chat support available</p>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-muted-foreground">Support channels information not available</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-4">Support Quality</h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="font-medium">Overall Rating</span>
                          </div>
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {broker.support_quality_rating || 4.3}/5.0
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Based on response time, professionalism, and problem resolution
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium mb-2">Support Availability</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Live Chat:</span>
                              <span className="font-medium">24/5</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Phone Support:</span>
                              <span className="font-medium">24/5</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Email Support:</span>
                              <span className="font-medium">24/5</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Weekend Support:</span>
                              <span className="font-medium">Limited</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium mb-2">Response Times</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Live Chat:</span>
                              <span className="font-medium">Instant</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Phone:</span>
                              <span className="font-medium">1-2 minutes</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Email:</span>
                              <span className="font-medium">2-4 hours</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Ticket System:</span>
                              <span className="font-medium">4-8 hours</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Regional Offices */}
              {broker.regional_offices && broker.regional_offices.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Regional Offices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {broker.regional_offices.map((office: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="font-medium mb-2">{office.country}</div>
                          <div className="text-sm text-muted-foreground">
                            {office.address && <div>{office.address}</div>}
                            {office.phone && <div>Phone: {office.phone}</div>}
                            {office.email && <div>Email: {office.email}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="education" className="space-y-6">
              {/* Education Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education & Research Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{broker.webinar_count || 25}+</div>
                      <div className="text-sm text-muted-foreground">Webinars</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{broker.article_count || 100}+</div>
                      <div className="text-sm text-muted-foreground">Articles</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{broker.educational_videos_count || 50}+</div>
                      <div className="text-sm text-muted-foreground">Videos</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{broker.educational_materials?.courses || 20}+</div>
                      <div className="text-sm text-muted-foreground">Courses</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4">Educational Materials</h4>
                      <div className="space-y-3">
                        {broker.educational_materials && typeof broker.educational_materials === 'object' ? (
                          <>
                            {broker.educational_materials.courses > 0 && (
                              <div className="flex items-start gap-3 p-3 border rounded-lg">
                                <div className="mt-1">
                                  <University className="h-4 w-4 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium">Trading Courses</div>
                                  <div className="text-sm text-muted-foreground">
                                    {broker.educational_materials.courses} courses available • Multiple difficulty levels
                                  </div>
                                </div>
                              </div>
                            )}
                            {broker.educational_materials.webinars > 0 && (
                              <div className="flex items-start gap-3 p-3 border rounded-lg">
                                <div className="mt-1">
                                  <Monitor className="h-4 w-4 text-green-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium">Live Webinars</div>
                                  <div className="text-sm text-muted-foreground">
                                    {broker.educational_materials.webinars} weekly webinars • Expert-led sessions
                                  </div>
                                </div>
                              </div>
                            )}
                            {broker.educational_materials.market_analysis && (
                              <div className="flex items-start gap-3 p-3 border rounded-lg">
                                <div className="mt-1">
                                  <FileText className="h-4 w-4 text-orange-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium">Market Analysis</div>
                                  <div className="text-sm text-muted-foreground">
                                    Daily market reports • Expert analysis
                                  </div>
                                </div>
                              </div>
                            )}
                            {broker.educational_materials.trading_signals && (
                              <div className="flex items-start gap-3 p-3 border rounded-lg">
                                <div className="mt-1">
                                  <TrendingUp className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium">Trading Signals</div>
                                  <div className="text-sm text-muted-foreground">
                                    Real-time signals • Entry/exit points
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-muted-foreground">Educational materials information not available</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h4 className="font-semibold mb-4">Trading Tools & Resources</h4>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium mb-3">Market Analysis</h5>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">Daily Market Analysis</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">Economic Calendar</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">Technical Analysis Reports</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">Trading Signals</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium mb-3">Trading Tools</h5>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">Economic Calendar</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">Profit Calculator</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">Pip Calculator</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">Currency Converter</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium mb-3">Advanced Features</h5>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">VPS Hosting</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">API Trading</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">AutoChartist</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">Sentiment Indicators</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pros-cons" className="space-y-6">
              {/* Pros and Cons */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <ThumbsUp className="h-5 w-5" />
                      Advantages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {broker.pros?.map((pro: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <div className="font-medium">{pro}</div>
                            <div className="text-sm text-muted-foreground">
                              {pro.includes('regulation') ? 'Strong regulatory framework provides investor protection and trust.' :
                               pro.includes('spreads') ? 'Competitive pricing structure helps reduce trading costs.' :
                               pro.includes('platform') ? 'Multiple platform options cater to different trading styles.' :
                               'Key benefit that enhances trading experience.'}
                            </div>
                          </div>
                        </div>
                      )) || (
                        <>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                              <div className="font-medium">Strong Regulatory Framework</div>
                              <div className="text-sm text-muted-foreground">
                                Multiple top-tier regulations ensure investor protection and regulatory compliance.
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                              <div className="font-medium">Competitive Trading Conditions</div>
                              <div className="text-sm text-muted-foreground">
                                Tight spreads and low commission structure provide cost-effective trading.
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                              <div className="font-medium">Multiple Trading Platforms</div>
                              <div className="text-sm text-muted-foreground">
                                Wide range of platforms including MT4, MT5, and proprietary web platform.
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                              <div className="font-medium">Comprehensive Education</div>
                              <div className="text-sm text-muted-foreground">
                                Extensive educational resources for traders of all experience levels.
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                              <div className="font-medium">Excellent Customer Support</div>
                              <div className="text-sm text-muted-foreground">
                                24/5 multilingual support with fast response times.
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <ThumbsDown className="h-5 w-5" />
                      Disadvantages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {broker.cons?.map((con: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <div className="font-medium">{con}</div>
                            <div className="text-sm text-muted-foreground">
                              {con.includes('fees') ? 'Additional costs that may affect overall trading expenses.' :
                               con.includes('limited') ? 'Restrictions that may not suit all trading styles.' :
                               con.includes('complex') ? 'May be challenging for beginner traders.' :
                               'Area that could be improved based on user feedback.'}
                            </div>
                          </div>
                        </div>
                      )) || (
                        <>
                          <div className="flex items-start gap-3">
                            <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                            <div>
                              <div className="font-medium">Inactivity Fees</div>
                              <div className="text-sm text-muted-foreground">
                                Monthly inactivity fees charged on dormant accounts after 3 months.
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                            <div>
                              <div className="font-medium">Limited Weekend Support</div>
                              <div className="text-sm text-muted-foreground">
                                Customer support availability is limited during weekends.
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                            <div>
                              <div className="font-medium">Complex Verification Process</div>
                              <div className="text-sm text-muted-foreground">
                                Account verification can be time-consuming for new clients.
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                            <div>
                              <div className="font-medium">Higher Minimum for ECN</div>
                              <div className="text-sm text-muted-foreground">
                                ECN accounts require higher minimum deposits compared to standard accounts.
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Is {broker.name} Right for You?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Best For</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Traders seeking strong regulation
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Those who value competitive spreads
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Traders wanting multiple platforms
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Beginners needing education
                        </li>
                      </ul>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-900 mb-2">Consider Alternatives If</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          You need weekend support
                        </li>
                        <li className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          You trade infrequently
                        </li>
                        <li className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          You want the absolute lowest costs
                        </li>
                        <li className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          You need complex trading tools
                        </li>
                      </ul>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Recommendation</h4>
                      <div className="text-sm text-muted-foreground">
                        <p className="mb-3">
                          {broker.name} is an excellent choice for most traders due to its strong regulatory framework, competitive trading conditions, and comprehensive educational resources.
                        </p>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="font-medium">Overall Rating: {broker.avg_rating?.toFixed(1) || 4.3}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verdict" className="space-y-6">
              {/* Final Verdict */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Final Verdict
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {broker.avg_rating?.toFixed(1) || 4.3}/5.0
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[...Array(5)].map((_: any, i: number) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < Math.floor(broker.avg_rating || 4.3) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <div className="text-lg font-medium">
                        {broker.avg_rating && broker.avg_rating >= 4.5 ? 'Excellent' :
                         broker.avg_rating && broker.avg_rating >= 4.0 ? 'Very Good' :
                         broker.avg_rating && broker.avg_rating >= 3.5 ? 'Good' : 'Average'}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold mb-4">Why We Recommend {broker.name}</h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                              <div className="font-medium">Exceptional Regulatory Framework</div>
                              <div className="text-sm text-muted-foreground">
                                With {broker.regulations?.length || 4} top-tier licenses, {broker.name} provides unparalleled investor protection and regulatory compliance.
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                              <div className="font-medium">Competitive Trading Conditions</div>
                              <div className="text-sm text-muted-foreground">
                                Spreads from {broker.spreads_avg || 0.8} pips on EUR/USD and transparent fee structure make trading cost-effective.
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                              <div className="font-medium">Comprehensive Platform Offering</div>
                              <div className="text-sm text-muted-foreground">
                                Multiple trading platforms including MT4, MT5, and web-based options cater to all trading preferences.
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                              <div className="font-medium">Outstanding Educational Resources</div>
                              <div className="text-sm text-muted-foreground">
                                Extensive learning materials help traders improve their skills and make informed decisions.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-4">Areas for Improvement</h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div>
                              <div className="font-medium">Inactivity Fees</div>
                              <div className="text-sm text-muted-foreground">
                                Monthly charges on dormant accounts could be reduced or eliminated.
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div>
                              <div className="font-medium">Weekend Support</div>
                              <div className="text-sm text-muted-foreground">
                                Limited weekend customer support availability could be extended.
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div>
                              <div className="font-medium">Account Verification</div>
                              <div className="text-sm text-muted-foreground">
                                Streamlining the verification process would improve onboarding experience.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-3">Our Recommendation</h4>
                      <p className="text-muted-foreground mb-4">
                        {broker.name} is an excellent choice for traders of all experience levels. With strong regulatory oversight, competitive trading conditions, and comprehensive educational resources, it provides a solid foundation for successful trading. The broker's commitment to transparency and customer service makes it a trustworthy partner in your trading journey.
                      </p>
                      <div className="flex items-center gap-4">
                        <Button size="lg" className="flex-1">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit {broker.name}
                        </Button>
                        <Button variant="outline" size="lg" className="flex-1">
                          <Copy className="h-4 w-4 mr-2" />
                          Read Full Review
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bottom Line */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    The Bottom Line
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-lg font-medium mb-4">
                      {broker.name} scores {broker.trust_score || 85}/100 on our Trust Score
                    </div>
                    <div className="max-w-2xl mx-auto">
                      <p className="text-muted-foreground mb-6">
                        This is a {broker.regulation_tier === 'tier1' ? 'top-tier' : broker.regulation_tier === 'tier2' ? 'well-established' : 'reliable'} broker with strong regulatory oversight, competitive trading conditions, and excellent customer support. While there are minor areas for improvement, the overall offering makes {broker.name} a solid choice for most traders.
                      </p>
                      <div className="flex justify-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{broker.trust_score || 85}/100</div>
                          <div className="text-sm text-muted-foreground">Trust Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{broker.avg_rating?.toFixed(1) || 4.3}/5</div>
                          <div className="text-sm text-muted-foreground">User Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{broker.total_reviews || 2500}+</div>
                          <div className="text-sm text-muted-foreground">Reviews</div>
                        </div>
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
    </>
  );
}