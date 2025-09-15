#!/usr/bin/env node

/**
 * Comprehensive 90-Day Content Calendar Generator
 * This script creates a structured content calendar based on keyword research results
 * for systematic content production across all categories.
 */

const fs = require('fs');
const path = require('path');

console.log('📅 Comprehensive 90-Day Content Calendar Generator');
console.log('=====================================================');

class ContentCalendarGenerator {
  constructor() {
    this.keywordClusters = this.loadKeywordClusters();
  }

  async generateCalendar() {
    try {
      console.log('🎯 Loading keyword research data...');
      
      const startTime = Date.now();
      
      // Step 1: Load and analyze keyword clusters
      console.log('\n📊 Step 1: Analyzing keyword clusters...');
      const analyzedClusters = await this.analyzeKeywordClusters();
      
      // Step 2: Define content pillars and themes
      console.log('\n🏗️ Step 2: Defining content pillars...');
      const contentPillars = await this.defineContentPillars(analyzedClusters);
      
      // Step 3: Create 90-day content plan
      console.log('\n📅 Step 3: Creating 90-day content plan...');
      const contentPlan = await this.create90DayPlan(contentPillars);
      
      // Step 4: Generate weekly content schedules
      console.log('\n📆 Step 4: Generating weekly schedules...');
      const weeklySchedules = await this.generateWeeklySchedules(contentPlan);
      
      // Step 5: Create content templates and guidelines
      console.log('\n📝 Step 5: Creating content templates...');
      const contentTemplates = await this.createContentTemplates();
      
      // Step 6: Generate content production workflow
      console.log('\n⚙️ Step 6: Creating production workflow...');
      const productionWorkflow = await this.createProductionWorkflow();
      
      // Step 7: Output results to files
      console.log('\n💾 Step 7: Saving calendar files...');
      await this.saveCalendarResults({
        analyzedClusters,
        contentPillars,
        contentPlan,
        weeklySchedules,
        contentTemplates,
        productionWorkflow,
        generatedAt: new Date().toISOString()
      });
      
      const endTime = Date.now();
      const totalTime = Math.round((endTime - startTime) / 1000);
      
      console.log('\n🎉 Content Calendar Generated Successfully!');
      console.log('=====================================');
      console.log(`⏱️  Total Time: ${totalTime} seconds`);
      console.log(`📅 Calendar Duration: 90 days`);
      console.log(`📝 Total Content Items: ${contentPlan.length}`);
      console.log(`🏗️  Content Pillars: ${contentPillars.length}`);
      console.log(`📆 Weekly Schedules: ${weeklySchedules.length}`);
      console.log(`📋 Content Templates: ${contentTemplates.length}`);
      
      // Show content type distribution
      console.log('\n📊 Content Type Distribution:');
      const contentTypeCounts = {};
      contentPlan.forEach(item => {
        contentTypeCounts[item.contentType] = (contentTypeCounts[item.contentType] || 0) + 1;
      });
      
      Object.entries(contentTypeCounts)
        .sort(([,a], [,b]) => b - a)
        .forEach(([type, count]) => {
          console.log(`   ${type}: ${count} items`);
        });
      
    } catch (error) {
      console.error('\n❌ Content calendar generation failed:');
      console.error(`   Error: ${error.message}`);
      throw error;
    }
  }

  loadKeywordClusters() {
    try {
      const clustersPath = path.join(process.cwd(), 'keyword-research-results', 'keyword-clusters.json');
      if (fs.existsSync(clustersPath)) {
        const data = fs.readFileSync(clustersPath, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn('Could not load keyword clusters, using default data');
    }
    
    // Fallback data based on our research
    return [
      {
        category: 'broker_reviews',
        keywords: [
          { keyword: 'ecn forex broker review', score: 184, volume: 600, intent: 'commercial' },
          { keyword: 'best forex broker 2025', score: 180, volume: 800, intent: 'commercial' },
          { keyword: 'regulated forex brokers comparison', score: 175, volume: 500, intent: 'commercial' }
        ],
        avg_score: 180,
        total_volume: 1900,
        avg_difficulty: 70
      },
      {
        category: 'education',
        keywords: [
          { keyword: 'forex trading for beginners', score: 170, volume: 1000, intent: 'informational' },
          { keyword: 'learn forex trading step by step', score: 165, volume: 600, intent: 'informational' },
          { keyword: 'forex trading tutorial', score: 160, volume: 800, intent: 'informational' }
        ],
        avg_score: 165,
        total_volume: 2400,
        avg_difficulty: 60
      },
      {
        category: 'trading_strategies',
        keywords: [
          { keyword: 'forex scalping strategy', score: 155, volume: 400, intent: 'informational' },
          { keyword: 'day trading forex strategy', score: 150, volume: 500, intent: 'informational' },
          { keyword: 'swing trading strategy forex', score: 145, volume: 300, intent: 'informational' }
        ],
        avg_score: 150,
        total_volume: 1200,
        avg_difficulty: 65
      },
      {
        category: 'trading_platforms',
        keywords: [
          { keyword: 'mt4 vs mt5 comparison', score: 160, volume: 600, intent: 'commercial' },
          { keyword: 'best trading platform for beginners', score: 155, volume: 700, intent: 'commercial' },
          { keyword: 'metatrader 4 tutorial', score: 150, volume: 500, intent: 'informational' }
        ],
        avg_score: 155,
        total_volume: 1800,
        avg_difficulty: 65
      },
      {
        category: 'regulation',
        keywords: [
          { keyword: 'forex broker regulation explained', score: 140, volume: 300, intent: 'informational' },
          { keyword: 'fca regulated brokers list', score: 135, volume: 200, intent: 'commercial' },
          { keyword: 'safe forex brokers regulation', score: 130, volume: 250, intent: 'commercial' }
        ],
        avg_score: 135,
        total_volume: 750,
        avg_difficulty: 55
      },
      {
        category: 'account_types',
        keywords: [
          { keyword: 'ecn vs stp account comparison', score: 145, volume: 350, intent: 'informational' },
          { keyword: 'islamic forex account explained', score: 140, volume: 200, intent: 'informational' },
          { keyword: 'forex demo account practice', score: 135, volume: 400, intent: 'informational' }
        ],
        avg_score: 140,
        total_volume: 950,
        avg_difficulty: 60
      }
    ];
  }

  async analyzeKeywordClusters() {
    const analyzed = this.keywordClusters.map(cluster => ({
      category: cluster.category,
      keywordCount: cluster.keywords.length,
      avgScore: cluster.avg_score,
      totalVolume: cluster.total_volume,
      avgDifficulty: cluster.avg_difficulty,
      topKeywords: cluster.keywords
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 10)
        .map(k => ({
          keyword: k.keyword,
          score: k.score || 0,
          volume: k.volume || 0,
          intent: k.intent || 'informational'
        })),
      contentPotential: this.calculateContentPotential(cluster),
      priorityScore: this.calculatePriorityScore(cluster)
    }));

    return analyzed.sort((a, b) => b.priorityScore - a.priorityScore);
  }

  calculateContentPotential(cluster) {
    const volumeWeight = 0.4;
    const scoreWeight = 0.3;
    const keywordCountWeight = 0.2;
    const difficultyWeight = 0.1;

    const normalizedVolume = Math.log(cluster.total_volume + 1) / Math.log(10000);
    const normalizedScore = cluster.avg_score / 100;
    const normalizedKeywordCount = Math.log(cluster.keywordCount + 1) / Math.log(100);
    const normalizedDifficulty = (100 - cluster.avg_difficulty) / 100;

    return (
      normalizedVolume * volumeWeight +
      normalizedScore * scoreWeight +
      normalizedKeywordCount * keywordCountWeight +
      normalizedDifficulty * difficultyWeight
    ) * 100;
  }

  calculatePriorityScore(cluster) {
    const contentPotential = this.calculateContentPotential(cluster);
    const commercialIntentBonus = cluster.keywords.filter(k => k.intent === 'commercial').length / cluster.keywords.length * 20;
    const lowDifficultyBonus = cluster.avg_difficulty < 60 ? 15 : 0;

    return contentPotential + commercialIntentBonus + lowDifficultyBonus;
  }

  async defineContentPillars(analyzedClusters) {
    const pillars = [
      {
        name: 'Broker Reviews & Comparisons',
        description: 'Comprehensive broker reviews, comparisons, and recommendations',
        categories: ['broker_reviews'],
        contentTypes: ['review', 'comparison', 'listicle'],
        targetAudience: 'traders seeking broker information',
        publishingFrequency: '3-4 times per week',
        contentGoals: ['conversion', 'authority building', 'lead generation']
      },
      {
        name: 'Trading Education & Tutorials',
        description: 'Educational content for traders of all levels',
        categories: ['education', 'beginner_content', 'advanced_content'],
        contentTypes: ['tutorial', 'guide', 'how_to'],
        targetAudience: 'beginner to advanced traders',
        publishingFrequency: '4-5 times per week',
        contentGoals: ['education', 'engagement', 'brand building']
      },
      {
        name: 'Trading Strategies & Systems',
        description: 'Detailed trading strategies and system explanations',
        categories: ['trading_strategies'],
        contentTypes: ['tutorial', 'guide', 'case_study'],
        targetAudience: 'intermediate to advanced traders',
        publishingFrequency: '2-3 times per week',
        contentGoals: ['education', 'demonstrating expertise', 'engagement']
      },
      {
        name: 'Platform & Tool Reviews',
        description: 'Reviews and tutorials for trading platforms and tools',
        categories: ['trading_platforms'],
        contentTypes: ['review', 'tutorial', 'comparison'],
        targetAudience: 'traders seeking platform information',
        publishingFrequency: '2-3 times per week',
        contentGoals: ['affiliate revenue', 'education', 'user assistance']
      },
      {
        name: 'Regulation & Safety',
        description: 'Information about broker regulation, safety, and compliance',
        categories: ['regulation'],
        contentTypes: ['guide', 'explanation', 'listicle'],
        targetAudience: 'safety-conscious traders',
        publishingFrequency: '1-2 times per week',
        contentGoals: ['trust building', 'education', 'risk management']
      },
      {
        name: 'Account Types & Features',
        description: 'Detailed information about different account types and features',
        categories: ['account_types', 'payment_methods'],
        contentTypes: ['guide', 'comparison', 'explanation'],
        targetAudience: 'traders researching account options',
        publishingFrequency: '2-3 times per week',
        contentGoals: ['education', 'conversion', 'user assistance']
      }
    ];

    // Assign analyzed clusters to pillars
    pillars.forEach(pillar => {
      pillar.assignedClusters = analyzedClusters.filter(cluster => 
        pillar.categories.includes(cluster.category)
      );
      pillar.totalKeywords = pillar.assignedClusters.reduce((sum, cluster) => sum + cluster.keywordCount, 0);
      pillar.avgPriorityScore = pillar.assignedClusters.reduce((sum, cluster) => sum + cluster.priorityScore, 0) / pillar.assignedClusters.length;
    });

    return pillars.sort((a, b) => b.avgPriorityScore - a.avgPriorityScore);
  }

  async create90DayPlan(contentPillars) {
    const contentPlan = [];
    const startDate = new Date();
    
    // Calculate content distribution based on pillar priority and publishing frequency
    const totalWeeks = 13; // 90 days / 7 days
    const weeklyContentTargets = {
      'Broker Reviews & Comparisons': 3.5,
      'Trading Education & Tutorials': 4.5,
      'Trading Strategies & Systems': 2.5,
      'Platform & Tool Reviews': 2.5,
      'Regulation & Safety': 1.5,
      'Account Types & Features': 2.5
    };

    for (let week = 0; week < totalWeeks; week++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + (week * 7));

      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(weekStart);
        currentDate.setDate(weekStart.getDate() + day);

        // Skip weekends (Saturday = 6, Sunday = 0)
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
          continue;
        }

        // Determine daily content based on pillar distribution
        const dailyContent = this.generateDailyContent(currentDate, contentPillars, weeklyContentTargets, week);
        contentPlan.push(...dailyContent);
      }
    }

    return contentPlan.sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate));
  }

  generateDailyContent(date, pillars, weeklyTargets, weekNumber) {
    const dailyContent = [];
    const dayOfWeek = date.getDay();
    
    // Define content rhythm for the week
    const weeklyRhythm = {
      1: ['Trading Education & Tutorials', 'Broker Reviews & Comparisons'], // Monday
      2: ['Trading Education & Tutorials', 'Trading Strategies & Systems'], // Tuesday
      3: ['Broker Reviews & Comparisons', 'Platform & Tool Reviews'], // Wednesday
      4: ['Trading Education & Tutorials', 'Account Types & Features'], // Thursday
      5: ['Trading Strategies & Systems', 'Regulation & Safety'] // Friday
    };

    const dayPillars = weeklyRhythm[dayOfWeek] || ['Trading Education & Tutorials'];

    for (const pillarName of dayPillars) {
      const pillar = pillars.find(p => p.name === pillarName);
      if (!pillar) continue;

      const content = this.createContentItem(date, pillar, weekNumber);
      if (content) {
        dailyContent.push(content);
      }
    }

    return dailyContent;
  }

  createContentItem(date, pillar, weekNumber) {
    const availableKeywords = pillar.assignedClusters.flatMap(cluster => cluster.topKeywords);
    if (availableKeywords.length === 0) return null;

    // Select keyword based on rotation and week number
    const keywordIndex = (weekNumber * 7 + date.getDay()) % availableKeywords.length;
    const selectedKeyword = availableKeywords[keywordIndex];

    const contentTypes = {
      'Broker Reviews & Comparisons': ['review', 'comparison', 'listicle'],
      'Trading Education & Tutorials': ['tutorial', 'guide', 'how_to'],
      'Trading Strategies & Systems': ['tutorial', 'guide', 'case_study'],
      'Platform & Tool Reviews': ['review', 'tutorial', 'comparison'],
      'Regulation & Safety': ['guide', 'explanation', 'listicle'],
      'Account Types & Features': ['guide', 'comparison', 'explanation']
    };

    const contentType = contentTypes[pillar.name][Math.floor(Math.random() * contentTypes[pillar.name].length)];

    return {
      id: `content_${date.getTime()}_${Math.random().toString(36).substr(2, 9)}`,
      publishDate: date.toISOString().split('T')[0],
      publishDay: date.toLocaleDateString('en-US', { weekday: 'long' }),
      pillar: pillar.name,
      category: pillar.categories[0],
      contentType,
      keyword: selectedKeyword.keyword,
      keywordScore: selectedKeyword.score,
      keywordVolume: selectedKeyword.volume,
      keywordIntent: selectedKeyword.intent,
      title: this.generateContentTitle(selectedKeyword.keyword, contentType),
      targetWordCount: this.getTargetWordCount(contentType),
      estimatedReadTime: this.getEstimatedReadTime(contentType),
      priority: this.calculateContentPriority(selectedKeyword, pillar),
      status: 'planned',
      assignedTo: 'content_team',
      deadline: this.calculateDeadline(date),
      contentGoals: pillar.contentGoals,
      targetAudience: pillar.targetAudience
    };
  }

  generateContentTitle(keyword, contentType) {
    const templates = {
      review: [
        `${keyword.replace(/review$/, '').trim()} Review 2025`,
        `Is ${keyword.replace(/review$/, '').trim()} Worth It? Complete Review`,
        `${keyword.replace(/review$/, '').trim()}: Pros, Cons, and Verdict`
      ],
      comparison: [
        `${keyword} - Complete Comparison Guide`,
        `Top ${keyword.replace(/comparison$/, '').trim()} Compared`,
        `${keyword}: Which One is Best for You?`
      ],
      tutorial: [
        `How to ${keyword.replace(/tutorial$/, '').trim()}: Step-by-Step Guide`,
        `${keyword.replace(/tutorial$/, '').trim()} Tutorial for Beginners`,
        `Master ${keyword.replace(/tutorial$/, '').trim()}: Complete Tutorial`
      ],
      guide: [
        `The Ultimate Guide to ${keyword.replace(/guide$/, '').trim()}`,
        `${keyword.replace(/guide$/, '').trim()}: Everything You Need to Know`,
        `Complete ${keyword.replace(/guide$/, '').trim()} Guide for 2025`
      ],
      how_to: [
        `How to ${keyword.replace(/how to /, '').trim()}`,
        `Step-by-Step: ${keyword.replace(/how to /, '').trim()}`,
        `${keyword.replace(/how to /, '').trim()}: A Beginner's Guide`
      ],
      case_study: [
        `${keyword.replace(/case study$/, '').trim()}: Real Results`,
        `Case Study: ${keyword.replace(/case study$/, '').trim()} Success`,
        `${keyword.replace(/case study$/, '').trim()}: Lessons from the Pros`
      ],
      explanation: [
        `${keyword.replace(/explained$/, '').trim()} Explained Simply`,
        `Understanding ${keyword.replace(/explained$/, '').trim()}`,
        `${keyword.replace(/explained$/, '').trim()}: What You Need to Know`
      ],
      listicle: [
        `10 Things You Should Know About ${keyword.replace(/list$/, '').trim()}`,
        `Top 5 ${keyword.replace(/list$/, '').trim()} for Traders`,
        `${keyword.replace(/list$/, '').trim()}: The Complete List`
      ]
    };

    const templateList = templates[contentType] || templates.guide;
    return templateList[Math.floor(Math.random() * templateList.length)];
  }

  getTargetWordCount(contentType) {
    const wordCounts = {
      review: 1500,
      comparison: 2000,
      tutorial: 1800,
      guide: 2500,
      how_to: 1200,
      case_study: 2000,
      explanation: 1000,
      listicle: 1200
    };
    return wordCounts[contentType] || 1500;
  }

  getEstimatedReadTime(contentType) {
    const wordCount = this.getTargetWordCount(contentType);
    return Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute
  }

  calculateContentPriority(keyword, pillar) {
    const basePriority = keyword.score;
    const volumeMultiplier = Math.log(keyword.volume + 1) / Math.log(1000);
    const pillarPriority = pillar.avgPriorityScore / 100;
    
    return Math.round(basePriority * volumeMultiplier * pillarPriority);
  }

  calculateDeadline(publishDate) {
    const deadline = new Date(publishDate);
    deadline.setDate(deadline.getDate() - 3); // 3 days before publish date
    return deadline.toISOString().split('T')[0];
  }

  async generateWeeklySchedules(contentPlan) {
    const weeklySchedules = [];
    const totalWeeks = 13;

    for (let week = 1; week <= totalWeeks; week++) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() + ((week - 1) * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekContent = contentPlan.filter(item => {
        const itemDate = new Date(item.publishDate);
        return itemDate >= weekStart && itemDate <= weekEnd;
      });

      const weeklySchedule = {
        weekNumber: week,
        weekStart: weekStart.toISOString().split('T')[0],
        weekEnd: weekEnd.toISOString().split('T')[0],
        totalContent: weekContent.length,
        contentByType: this.groupContentByType(weekContent),
        contentByPillar: this.groupContentByPillar(weekContent),
        estimatedTotalWords: weekContent.reduce((sum, item) => sum + item.targetWordCount, 0),
        contentItems: weekContent.sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate)),
        weeklyThemes: this.generateWeeklyThemes(week, weekContent)
      };

      weeklySchedules.push(weeklySchedule);
    }

    return weeklySchedules;
  }

  groupContentByType(content) {
    const grouped = {};
    content.forEach(item => {
      grouped[item.contentType] = (grouped[item.contentType] || 0) + 1;
    });
    return grouped;
  }

  groupContentByPillar(content) {
    const grouped = {};
    content.forEach(item => {
      grouped[item.pillar] = (grouped[item.pillar] || 0) + 1;
    });
    return grouped;
  }

  generateWeeklyThemes(weekNumber, weekContent) {
    const themes = [
      'Forex Fundamentals Week',
      'Broker Selection Week',
      'Trading Strategies Week',
      'Platform Mastery Week',
      'Risk Management Week',
      'Advanced Trading Week',
      'Market Analysis Week',
      'Trading Psychology Week',
      'Account Types Week',
      'Regulation & Safety Week',
      'Educational Series Week',
      'Tool Reviews Week',
      'Year-End Planning Week'
    ];

    return themes[(weekNumber - 1) % themes.length];
  }

  async createContentTemplates() {
    return [
      {
        name: 'Broker Review Template',
        contentType: 'review',
        sections: [
          'Introduction',
          'Broker Overview',
          'Regulation & Safety',
          'Trading Conditions',
          'Platform Review',
          'Account Types',
          'Customer Support',
          'Pros & Cons',
          'Final Verdict',
          'FAQ'
        ],
        wordCount: 1500,
        keyElements: ['regulatory info', 'trading costs', 'platform features', 'user experience'],
        checklist: [
          'Include regulatory information',
          'Detail trading costs and fees',
          'Review platform usability',
          'Include customer support channels',
          'Add pros and cons summary'
        ]
      },
      {
        name: 'Educational Tutorial Template',
        contentType: 'tutorial',
        sections: [
          'Introduction',
          'What You\'ll Learn',
          'Prerequisites',
          'Step-by-Step Instructions',
          'Visual Examples',
          'Common Mistakes',
          'Tips for Success',
          'Practice Exercises',
          'Next Steps',
          'Resources'
        ],
        wordCount: 1800,
        keyElements: ['clear instructions', 'visual aids', 'practice examples', 'progressive learning'],
        checklist: [
          'Define learning objectives',
          'Break down complex concepts',
          'Include visual examples',
          'Add practice exercises',
          'Provide additional resources'
        ]
      },
      {
        name: 'Trading Strategy Guide',
        contentType: 'guide',
        sections: [
          'Strategy Overview',
          'How It Works',
          'Best Timeframes',
          'Entry & Exit Rules',
          'Risk Management',
          'Examples & Case Studies',
          'Backtesting Results',
          'Pros & Cons',
          'Required Tools',
          'Implementation Tips'
        ],
        wordCount: 2500,
        keyElements: ['clear rules', 'risk management', 'examples', 'performance metrics'],
        checklist: [
          'Define clear entry/exit rules',
          'Include risk management guidelines',
          'Provide real examples',
          'Include performance data',
          'List required tools/resources'
        ]
      },
      {
        name: 'Comparison Article Template',
        contentType: 'comparison',
        sections: [
          'Introduction',
          'Comparison Criteria',
          'Option 1 Review',
          'Option 2 Review',
          'Option 3 Review',
          'Side-by-Side Comparison',
          'Head-to-Head Analysis',
          'Use Case Scenarios',
          'Recommendations',
          'Final Verdict'
        ],
        wordCount: 2000,
        keyElements: ['objective criteria', 'detailed analysis', 'clear recommendations'],
        checklist: [
          'Define comparison criteria',
          'Analyze each option objectively',
          'Include side-by-side comparison table',
          'Provide specific recommendations',
          'Add use case scenarios'
        ]
      }
    ];
  }

  async createProductionWorkflow() {
    return {
      stages: [
        {
          name: 'Content Planning',
          duration: '1-2 days',
          responsible: 'Content Strategist',
          deliverables: ['Content brief', 'Keyword selection', 'Outline'],
          checklist: [
            'Research keyword thoroughly',
            'Define content goals',
            'Create detailed outline',
            'Assign to writer'
          ]
        },
        {
          name: 'Content Creation',
          duration: '2-3 days',
          responsible: 'Content Writer',
          deliverables: ['First draft', 'Images', 'Internal links'],
          checklist: [
            'Follow content template',
            'Include SEO optimization',
            'Add internal links',
            'Include relevant images'
          ]
        },
        {
          name: 'Content Review',
          duration: '1 day',
          responsible: 'Content Editor',
          deliverables: ['Reviewed content', 'Edits documented'],
          checklist: [
            'Check for accuracy',
            'Ensure SEO optimization',
            'Verify readability',
            'Check brand voice consistency'
          ]
        },
        {
          name: 'Quality Assurance',
          duration: '1 day',
          responsible: 'QA Specialist',
          deliverables: ['QA report', 'Final approval'],
          checklist: [
            'Grammar and spell check',
            'Fact verification',
            'Link validation',
            'Mobile responsiveness check'
          ]
        },
        {
          name: 'SEO Optimization',
          duration: '0.5 days',
          responsible: 'SEO Specialist',
          deliverables: ['Meta tags', 'Structured data', 'Internal linking'],
          checklist: [
            'Optimize title and meta description',
            'Add structured data',
            'Internal link optimization',
            'Image optimization'
          ]
        },
        {
          name: 'Publishing',
          duration: '0.5 days',
          responsible: 'Content Manager',
          deliverables: ['Published content', 'Social media posts'],
          checklist: [
            'Schedule publishing',
            'Create social media assets',
            'Set up distribution',
            'Monitor initial performance'
          ]
        }
      ],
      totalProductionTime: '6-8 days',
      teamRoles: [
        'Content Strategist',
        'Content Writer',
        'Content Editor',
        'QA Specialist',
        'SEO Specialist',
        'Content Manager'
      ],
      qualityStandards: {
        minWordCount: 1000,
        maxReadabilityScore: 60,
        requiredSections: ['introduction', 'conclusion', 'call_to_action'],
        seoRequirements: ['meta_title', 'meta_description', 'focus_keyword', 'internal_links']
      }
    };
  }

  async saveCalendarResults(data) {
    const outputDir = path.join(process.cwd(), 'content-calendar');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save 90-day content plan
    fs.writeFileSync(
      path.join(outputDir, '90-day-content-plan.json'),
      JSON.stringify(data.contentPlan, null, 2)
    );

    // Save weekly schedules
    fs.writeFileSync(
      path.join(outputDir, 'weekly-schedules.json'),
      JSON.stringify(data.weeklySchedules, null, 2)
    );

    // Save content templates
    fs.writeFileSync(
      path.join(outputDir, 'content-templates.json'),
      JSON.stringify(data.contentTemplates, null, 2)
    );

    // Save production workflow
    fs.writeFileSync(
      path.join(outputDir, 'production-workflow.json'),
      JSON.stringify(data.productionWorkflow, null, 2)
    );

    // Save executive summary
    const executiveSummary = this.generateExecutiveSummary(data);
    fs.writeFileSync(
      path.join(outputDir, 'executive-summary.md'),
      executiveSummary
    );

    // Save content plan as CSV for easy viewing
    const csvContent = [
      'Publish Date,Title,Pillar,Content Type,Keyword,Word Count,Priority,Status',
      ...data.contentPlan.map(item => 
        `${item.publishDate},"${item.title}",${item.pillar},${item.contentType},${item.keyword},${item.targetWordCount},${item.priority},${item.status}`
      )
    ].join('\n');

    fs.writeFileSync(
      path.join(outputDir, 'content-plan.csv'),
      csvContent
    );

    console.log(`   ✅ Content calendar saved to ${outputDir}/`);
  }

  generateExecutiveSummary(data) {
    const totalContent = data.contentPlan.length;
    const totalWords = data.contentPlan.reduce((sum, item) => sum + item.targetWordCount, 0);
    const avgWordsPerPiece = Math.round(totalWords / totalContent);

    return `# 90-Day Content Calendar Executive Summary

## Overview
This comprehensive 90-day content calendar is designed to establish a consistent, high-quality content production schedule for our forex broker review platform. The calendar leverages our extensive keyword research database to create targeted, SEO-optimized content across all key categories.

## Key Metrics
- **Total Content Items:** ${totalContent}
- **Total Words:** ${totalWords.toLocaleString()}
- **Average Words per Piece:** ${avgWordsPerPiece}
- **Production Duration:** 90 days
- **Content Pillars:** ${data.contentPillars.length}
- **Weekly Publishing Frequency:** 5 days per week (Monday-Friday)

## Content Pillars
${data.contentPillars.map(pillar => `
### ${pillar.name}
- **Categories:** ${pillar.categories.join(', ')}
- **Keywords Available:** ${pillar.totalKeywords}
- **Publishing Frequency:** ${pillar.publishingFrequency}
- **Primary Goals:** ${pillar.contentGoals.join(', ')}
- **Target Audience:** ${pillar.targetAudience}
`).join('\n')}

## Production Workflow
The content production follows a structured 6-stage workflow:
1. **Content Planning** (1-2 days)
2. **Content Creation** (2-3 days)
3. **Content Review** (1 day)
4. **Quality Assurance** (1 day)
5. **SEO Optimization** (0.5 days)
6. **Publishing** (0.5 days)

**Total Production Time:** 6-8 days per content piece

## Expected Outcomes
- **SEO Authority:** Comprehensive coverage of target keywords
- **User Engagement:** Educational content for all trader levels
- **Lead Generation:** Commercial content targeting high-intent keywords
- **Brand Authority:** In-depth reviews and educational content
- **Traffic Growth:** Consistent publishing schedule across all categories

## Content Distribution
- **Monday:** Educational content + Broker reviews
- **Tuesday:** Educational content + Trading strategies
- **Wednesday:** Broker reviews + Platform reviews
- **Thursday:** Educational content + Account features
- **Friday:** Trading strategies + Regulation content

## Quality Standards
- **Minimum Word Count:** 1,000 words
- **SEO Optimization:** Meta tags, structured data, internal linking
- **Quality Assurance:** Grammar, fact-checking, readability
- **Content Templates:** Standardized structure per content type

## Implementation Timeline
- **Week 1-4:** Establish production workflow and initial content
- **Week 5-8:** Scale production and optimize workflow
- **Week 9-12:** Analyze performance and refine strategy

Generated on: ${new Date().toISOString().split('T')[0]}
`;
  }
}

// Main execution function
async function main() {
  const generator = new ContentCalendarGenerator();
  await generator.generateCalendar();
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Content calendar generation interrupted by user');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Content calendar generation terminated');
  process.exit(0);
});

// Run the execution
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});