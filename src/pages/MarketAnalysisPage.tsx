import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, BarChart3, PieChart, LineChart, Calendar, Search, Filter, BookOpen, Video, FileText, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MarketAnalysis {
  id: string;
  title: string;
  type: 'technical' | 'fundamental' | 'sentiment' | 'economic';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  description: string;
  tags: string[];
  trend: 'bullish' | 'bearish' | 'neutral';
  publishedAt: string;
  author: string;
  readTime: string;
  format: 'article' | 'video' | 'infographic' | 'report';
}

const mockAnalyses: MarketAnalysis[] = [
  {
    id: '1',
    title: 'EUR/USD Technical Analysis: Key Support and Resistance Levels',
    type: 'technical',
    difficulty: 'intermediate',
    duration: '15 min read',
    description: 'Comprehensive analysis of EUR/USD pair focusing on critical support and resistance levels, trend patterns, and potential breakout scenarios.',
    tags: ['EUR/USD', 'Support/Resistance', 'Trend Analysis', 'Breakouts'],
    trend: 'bullish',
    publishedAt: '2024-01-15',
    author: 'Sarah Johnson',
    readTime: '15 min',
    format: 'article'
  },
  {
    id: '2',
    title: 'Federal Reserve Policy Impact on USD Strength',
    type: 'fundamental',
    difficulty: 'advanced',
    duration: '20 min read',
    description: 'Deep dive into how Federal Reserve monetary policy decisions affect USD strength and global forex markets.',
    tags: ['Federal Reserve', 'Monetary Policy', 'USD', 'Interest Rates'],
    trend: 'neutral',
    publishedAt: '2024-01-14',
    author: 'Michael Chen',
    readTime: '20 min',
    format: 'report'
  },
  {
    id: '3',
    title: 'Market Sentiment Analysis: Risk-On vs Risk-Off Trading',
    type: 'sentiment',
    difficulty: 'beginner',
    duration: '12 min watch',
    description: 'Understanding market sentiment indicators and how to identify risk-on and risk-off market conditions.',
    tags: ['Market Sentiment', 'Risk Management', 'Safe Haven', 'Volatility'],
    trend: 'bearish',
    publishedAt: '2024-01-13',
    author: 'Emma Rodriguez',
    readTime: '12 min',
    format: 'video'
  },
  {
    id: '4',
    title: 'Economic Calendar: Key Events This Week',
    type: 'economic',
    difficulty: 'intermediate',
    duration: '10 min read',
    description: 'Weekly overview of major economic events and their potential impact on currency markets.',
    tags: ['Economic Calendar', 'NFP', 'CPI', 'GDP', 'Central Banks'],
    trend: 'neutral',
    publishedAt: '2024-01-12',
    author: 'David Kim',
    readTime: '10 min',
    format: 'article'
  },
  {
    id: '5',
    title: 'Cryptocurrency Impact on Traditional Forex Markets',
    type: 'fundamental',
    difficulty: 'advanced',
    duration: '18 min read',
    description: 'Analysis of how cryptocurrency adoption and regulation affect traditional forex trading and currency valuations.',
    tags: ['Cryptocurrency', 'Digital Assets', 'Regulation', 'Market Correlation'],
    trend: 'bullish',
    publishedAt: '2024-01-11',
    author: 'Lisa Wang',
    readTime: '18 min',
    format: 'report'
  },
  {
    id: '6',
    title: 'Japanese Yen Carry Trade Strategies',
    type: 'technical',
    difficulty: 'advanced',
    duration: '25 min read',
    description: 'Comprehensive guide to understanding and implementing carry trade strategies using the Japanese Yen.',
    tags: ['JPY', 'Carry Trade', 'Interest Rate Differential', 'Risk Management'],
    trend: 'neutral',
    publishedAt: '2024-01-10',
    author: 'Hiroshi Tanaka',
    readTime: '25 min',
    format: 'article'
  }
];

const analysisTypes = [
  { value: 'all', label: 'All Types', icon: BarChart3 },
  { value: 'technical', label: 'Technical Analysis', icon: LineChart },
  { value: 'fundamental', label: 'Fundamental Analysis', icon: PieChart },
  { value: 'sentiment', label: 'Sentiment Analysis', icon: TrendingUp },
  { value: 'economic', label: 'Economic Analysis', icon: Calendar }
];

const difficultyLevels = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

const formatTypes = [
  { value: 'all', label: 'All Formats' },
  { value: 'article', label: 'Articles' },
  { value: 'video', label: 'Videos' },
  { value: 'report', label: 'Reports' },
  { value: 'infographic', label: 'Infographics' }
];

export function MarketAnalysisPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');

  const filteredAnalyses = mockAnalyses.filter(analysis => {
    const matchesSearch = analysis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         analysis.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         analysis.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || analysis.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || analysis.difficulty === selectedDifficulty;
    const matchesFormat = selectedFormat === 'all' || analysis.format === selectedFormat;
    
    return matchesSearch && matchesType && matchesDifficulty && matchesFormat;
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'bearish':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'report':
        return <FileText className="h-4 w-4" />;
      case 'infographic':
        return <PieChart className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'technical':
        return 'bg-blue-100 text-blue-800';
      case 'fundamental':
        return 'bg-purple-100 text-purple-800';
      case 'sentiment':
        return 'bg-orange-100 text-orange-800';
      case 'economic':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link to="/learn" className="hover:text-primary">Learning Hub</Link>
          <span>/</span>
          <span>Market Analysis</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Market Analysis</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Stay ahead of the markets with our comprehensive analysis covering technical patterns, 
          fundamental drivers, market sentiment, and economic indicators.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Technical</p>
                <p className="text-2xl font-bold">{mockAnalyses.filter(a => a.type === 'technical').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Fundamental</p>
                <p className="text-2xl font-bold">{mockAnalyses.filter(a => a.type === 'fundamental').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Sentiment</p>
                <p className="text-2xl font-bold">{mockAnalyses.filter(a => a.type === 'sentiment').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-sm text-muted-foreground">Economic</p>
                <p className="text-2xl font-bold">{mockAnalyses.filter(a => a.type === 'economic').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search analysis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {analysisTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty</label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficultyLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formatTypes.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnalyses.map((analysis) => (
          <Card key={analysis.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2 mb-2">
                    {analysis.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    {getTrendIcon(analysis.trend)}
                    <span className="text-sm text-muted-foreground capitalize">
                      {analysis.trend} outlook
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {getFormatIcon(analysis.format)}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className={getTypeColor(analysis.type)}>
                  {analysis.type}
                </Badge>
                <Badge className={getDifficultyColor(analysis.difficulty)}>
                  {analysis.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-3 mb-4">
                {analysis.description}
              </CardDescription>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {analysis.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {analysis.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{analysis.tags.length - 3} more
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>By {analysis.author}</span>
                <span>{analysis.readTime}</span>
              </div>
              
              <Button className="w-full" variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Read Analysis
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAnalyses.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No analysis found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or filters to find relevant market analysis.
          </p>
        </div>
      )}

      {/* Call to Action */}
      <Card className="mt-12">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Want Personalized Analysis?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get tailored market analysis and trading insights based on your trading style and preferences. 
            Our AI-powered tools can help you identify the best opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/ai-match">
                Try AI Broker Matcher
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/quiz">
                Take Trading Quiz
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}