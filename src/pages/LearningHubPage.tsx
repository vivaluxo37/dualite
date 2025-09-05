import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Video, FileText, Award, TrendingUp, Users, Clock, Star, ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  lessons: number;
  completed: number;
  type: 'course' | 'video' | 'guide' | 'quiz';
  category: 'basics' | 'technical' | 'fundamental' | 'psychology' | 'risk';
  rating: number;
  students: number;
  featured: boolean;
}

const mockModules: LearningModule[] = [
  {
    id: '1',
    title: 'Forex Trading Fundamentals',
    description: 'Complete introduction to forex trading covering currency pairs, market structure, and basic terminology.',
    difficulty: 'beginner',
    duration: '4 hours',
    lessons: 12,
    completed: 8,
    type: 'course',
    category: 'basics',
    rating: 4.8,
    students: 15420,
    featured: true
  },
  {
    id: '2',
    title: 'Technical Analysis Mastery',
    description: 'Learn to read charts, identify patterns, and use technical indicators for better trading decisions.',
    difficulty: 'intermediate',
    duration: '6 hours',
    lessons: 18,
    completed: 0,
    type: 'course',
    category: 'technical',
    rating: 4.9,
    students: 12350,
    featured: true
  },
  {
    id: '3',
    title: 'Risk Management Strategies',
    description: 'Essential risk management techniques to protect your capital and maximize long-term profitability.',
    difficulty: 'intermediate',
    duration: '3 hours',
    lessons: 10,
    completed: 10,
    type: 'course',
    category: 'risk',
    rating: 4.7,
    students: 9870,
    featured: false
  },
  {
    id: '4',
    title: 'Market Psychology & Trading Mindset',
    description: 'Understand the psychological aspects of trading and develop a winning mindset.',
    difficulty: 'advanced',
    duration: '2.5 hours',
    lessons: 8,
    completed: 3,
    type: 'course',
    category: 'psychology',
    rating: 4.6,
    students: 7650,
    featured: false
  },
  {
    id: '5',
    title: 'Economic Indicators Deep Dive',
    description: 'Learn how economic data affects currency markets and how to trade news events.',
    difficulty: 'advanced',
    duration: '5 hours',
    lessons: 15,
    completed: 0,
    type: 'course',
    category: 'fundamental',
    rating: 4.8,
    students: 5430,
    featured: true
  },
  {
    id: '6',
    title: 'Live Trading Webinar Series',
    description: 'Weekly live trading sessions with professional traders sharing real-time analysis.',
    difficulty: 'intermediate',
    duration: '1 hour',
    lessons: 1,
    completed: 0,
    type: 'video',
    category: 'technical',
    rating: 4.9,
    students: 3200,
    featured: false
  }
];

const categories = [
  { id: 'all', name: 'All Categories', icon: BookOpen },
  { id: 'basics', name: 'Trading Basics', icon: BookOpen },
  { id: 'technical', name: 'Technical Analysis', icon: TrendingUp },
  { id: 'fundamental', name: 'Fundamental Analysis', icon: FileText },
  { id: 'psychology', name: 'Trading Psychology', icon: Users },
  { id: 'risk', name: 'Risk Management', icon: Award }
];

export function LearningHubPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const filteredModules = mockModules.filter(module => {
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || module.difficulty === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  const featuredModules = mockModules.filter(module => module.featured);
  const completedModules = mockModules.filter(module => module.completed === module.lessons).length;
  const totalProgress = mockModules.reduce((acc, module) => acc + (module.completed / module.lessons) * 100, 0) / mockModules.length;

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'guide':
        return <FileText className="h-4 w-4" />;
      case 'quiz':
        return <Award className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Learning Hub</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Master forex trading with our comprehensive learning resources. From beginner basics to advanced strategies, 
          we have everything you need to become a successful trader.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold">{mockModules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedModules}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-2xl font-bold">{Math.round(totalProgress)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Hours Learned</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Courses */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredModules.map((module) => (
            <Card key={module.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge className={getDifficultyColor(module.difficulty)}>
                    {module.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {getTypeIcon(module.type)}
                  </div>
                </div>
                <CardTitle className="text-lg">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {module.duration}
                    </span>
                    <span>{module.lessons} lessons</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{module.rating}</span>
                    </div>
                    <span className="text-muted-foreground">{module.students.toLocaleString()} students</span>
                  </div>
                  
                  {module.completed > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{module.completed}/{module.lessons}</span>
                      </div>
                      <Progress value={(module.completed / module.lessons) * 100} className="h-2" />
                    </div>
                  )}
                  
                  <Button className="w-full">
                    {module.completed > 0 ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Continue Learning
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Start Course
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/learn/market-analysis" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Market Analysis</h3>
              <p className="text-muted-foreground mb-4">
                Daily market insights, technical analysis, and trading opportunities
              </p>
              <Button variant="outline" className="w-full">
                <ArrowRight className="h-4 w-4 ml-2" />
                View Analysis
              </Button>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/quiz" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Trading Quiz</h3>
              <p className="text-muted-foreground mb-4">
                Test your knowledge and track your learning progress
              </p>
              <Button variant="outline" className="w-full">
                <ArrowRight className="h-4 w-4 ml-2" />
                Take Quiz
              </Button>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/calculators" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Trading Tools</h3>
              <p className="text-muted-foreground mb-4">
                Calculators, simulators, and other essential trading tools
              </p>
              <Button variant="outline" className="w-full">
                <ArrowRight className="h-4 w-4 ml-2" />
                Use Tools
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">All Learning Resources</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <category.icon className="h-4 w-4" />
              {category.name}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDifficulty('all')}
          >
            All Levels
          </Button>
          <Button
            variant={selectedDifficulty === 'beginner' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDifficulty('beginner')}
          >
            Beginner
          </Button>
          <Button
            variant={selectedDifficulty === 'intermediate' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDifficulty('intermediate')}
          >
            Intermediate
          </Button>
          <Button
            variant={selectedDifficulty === 'advanced' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDifficulty('advanced')}
          >
            Advanced
          </Button>
        </div>
      </div>

      {/* All Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <Card key={module.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Badge className={getDifficultyColor(module.difficulty)}>
                  {module.difficulty}
                </Badge>
                <div className="flex items-center gap-1">
                  {getTypeIcon(module.type)}
                </div>
              </div>
              <CardTitle className="text-lg">{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {module.duration}
                  </span>
                  <span>{module.lessons} lessons</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{module.rating}</span>
                  </div>
                  <span className="text-muted-foreground">{module.students.toLocaleString()} students</span>
                </div>
                
                {module.completed > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{module.completed}/{module.lessons}</span>
                    </div>
                    <Progress value={(module.completed / module.lessons) * 100} className="h-2" />
                  </div>
                )}
                
                <Button className="w-full" variant="outline">
                  {module.completed > 0 ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Continue Learning
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Start Course
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <Card className="mt-12">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Start Your Trading Journey?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of successful traders who started their journey with our comprehensive learning resources. 
            Get personalized recommendations based on your experience level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/ai-match">
                Get Personalized Recommendations
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/quiz">
                <Award className="h-4 w-4 mr-2" />
                Take Assessment Quiz
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
