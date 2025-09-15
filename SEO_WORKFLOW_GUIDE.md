# SEO Workflow System - Complete Usage Guide

## Overview

The SEO Workflow System is a comprehensive automated solution for creating, optimizing, and deploying SEO-optimized content for forex broker reviews. This system integrates multiple AI agents and MCP tools to provide end-to-end content creation and deployment.

## System Architecture

### Core Components

1. **Broker Scraping Service** (`src/lib/broker-scraping.ts`)
   - Scrapes broker data from 20+ forex broker review sites
   - Integrates Firecrawl MCP for intelligent web scraping
   - Supports fallback scraping with WebFetch

2. **Keyword Research Agent** (`src/lib/keyword-research.ts`)
   - Generates comprehensive keyword strategies
   - Uses WebSearch MCP for competitor analysis
   - Clusters keywords by search intent

3. **Content Planning Agent** (`src/lib/content-planning.ts`)
   - Creates structured content outlines
   - Integrates with global SEO content planner agent
   - Generates topic clusters and content strategies

4. **Content Generation Agent** (`src/lib/content-generation.ts`)
   - Produces SEO-optimized content
   - Uses Context7 MCP for documentation and examples
   - Integrates with global SEO content writer agent

5. **SEO Optimization Agent** (`src/lib/seo-optimization.ts`)
   - Optimizes content meta tags and structure
   - Generates structured data
   - Optimizes for featured snippets

6. **Quality Assurance Agent** (`src/lib/quality-assurance.ts`)
   - Validates content accuracy and readability
   - Ensures SEO compliance
   - Performs brand safety checks

7. **Automated Deployment Service** (`src/lib/automated-deployment.ts`)
   - Generates React components from content
   - Creates dynamic routes
   - Updates sitemaps automatically

8. **Workflow Orchestrator** (`src/lib/workflow-orchestrator.ts`)
   - Coordinates all agents and services
   - Provides progress tracking and error handling
   - Supports batch processing and retry logic

## Database Schema

The system uses the following database tables:

### SEO Workflow Tables
- `broker_keywords` - Keyword research results
- `page_outlines` - Content planning data
- `page_drafts` - Generated content drafts
- `page_seo` - SEO optimization data
- `page_audit` - Quality assurance results

### Deployment Tables
- `deployed_pages` - Generated React components
- `deployed_routes` - Route configurations
- `deployed_sitemaps` - Sitemap data
- `deployment_status` - Deployment tracking

### Test Tables
- `workflow_test_results` - Test execution results
- `workflow_test_reports` - Test reports and summaries
- `workflow_test_failures` - Error tracking
- `workflow_performance_metrics` - Performance data

## Configuration

### Environment Variables

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id

# Optional Configuration
NOTIFICATION_EMAIL=your-email@example.com
WEBHOOK_URL=your-webhook-url
SLACK_WEBHOOK=your-slack-webhook
```

### Workflow Configuration

```typescript
const workflowConfig = {
  supabaseProjectId: 'your-project-id',
  brokerNames: ['XM', 'FP Markets', 'Pepperstone'],
  contentTypes: ['review', 'guide', 'comparison'],
  qualityThreshold: 70,
  maxConcurrentProcesses: 3,
  enableDeployment: true,
  retryFailedSteps: true,
  notificationSettings: {
    email: 'admin@example.com',
    webhook: 'https://your-webhook-url.com',
    slack: 'your-slack-webhook'
  }
};
```

## Usage

### Basic Usage

```typescript
import { WorkflowOrchestrator } from './src/lib/workflow-orchestrator';

const orchestrator = new WorkflowOrchestrator(workflowConfig);
const results = await orchestrator.executeWorkflow();

console.log('Workflow completed:', results);
```

### Individual Component Usage

#### Broker Scraping

```typescript
import { BrokerScrapingService } from './src/lib/broker-scraping';

const scrapingService = new BrokerScrapingService();
const brokerData = await scrapingService.scrapeBrokerData('XM');
```

#### Keyword Research

```typescript
import { KeywordResearchAgent } from './src/lib/keyword-research';

const keywordAgent = new KeywordResearchAgent(projectId);
const keywords = await keywordAgent.researchBrokerKeywords({
  broker_name: 'XM',
  broker_type: 'forex',
  target_audience: 'traders',
  content_goals: ['educational', 'review']
});
```

#### Content Generation

```typescript
import { ContentGenerationAgent } from './src/lib/content-generation';

const generationAgent = new ContentGenerationAgent(projectId);
const content = await generationAgent.generateContent({
  broker_name: 'XM',
  content_type: 'review',
  outline: contentOutline,
  target_keywords: ['forex broker', 'trading platform'],
  tone: 'professional',
  word_count: 1500
});
```

#### SEO Optimization

```typescript
import { SEOOptimizationAgent } from './src/lib/seo-optimization';

const seoAgent = new SEOOptimizationAgent(projectId);
const optimized = await seoAgent.optimizeContent({
  content: generatedContent,
  title: 'XM Broker Review',
  content_type: 'review',
  target_keywords: ['forex broker', 'trading platform'],
  broker_data: brokerData,
  current_url: '/brokers/xm',
  include_structured_data: true,
  optimize_for_snippets: true
});
```

#### Quality Assurance

```typescript
import { QualityAssuranceAgent } from './src/lib/quality-assurance';

const qaAgent = new QualityAssuranceAgent(projectId);
const qa = await qaAgent.performQualityAssurance({
  content: optimizedContent,
  title: 'XM Broker Review',
  content_type: 'review',
  target_keywords: ['forex broker', 'trading platform'],
  broker_data: brokerData,
  compliance_requirements: ['financial_services', 'broker_disclosure'],
  quality_threshold: 70
});
```

#### Automated Deployment

```typescript
import { AutomatedDeploymentService } from './src/lib/automated-deployment';

const deploymentService = new AutomatedDeploymentService({
  outputDir: 'src/pages',
  templateDir: 'src/templates',
  generateRoutes: true,
  updateSitemap: true,
  deployToProduction: true
});

const deploymentResult = await deploymentService.deployPages([generatedPage]);
```

## Testing

### Running Tests

```bash
# Install dependencies
npm install

# Run individual component tests
npx ts-node scripts/test-workflow.ts

# Run full workflow test
WORKFLOW_TEST_TYPE=full npx ts-node scripts/test-workflow.ts
```

### Test Configuration

```typescript
const testConfig = {
  supabaseProjectId: 'your-project-id',
  sampleBrokers: ['XM', 'FP Markets'],
  contentTypes: ['review', 'guide'],
  qualityThreshold: 70,
  enableDeployment: false // Set to false for testing
};
```

## Integration with Existing Dualite Application

### Adding to Build Process

```json
{
  "scripts": {
    "build": "npm run workflow && vite build",
    "workflow": "npx ts-node scripts/execute-workflow.ts",
    "workflow:test": "npx ts-node scripts/test-workflow.ts"
  }
}
```

### Integrating with Admin Dashboard

```typescript
// Add to admin dashboard
import { WorkflowOrchestrator } from '../lib/workflow-orchestrator';

const AdminWorkflowControl = () => {
  const executeWorkflow = async () => {
    const orchestrator = new WorkflowOrchestrator(workflowConfig);
    const results = await orchestrator.executeWorkflow();
    // Display results in admin interface
  };

  return (
    <button onClick={executeWorkflow}>
      Execute SEO Workflow
    </button>
  );
};
```

## Monitoring and Analytics

### Workflow Progress Tracking

```typescript
const orchestrator = new WorkflowOrchestrator(workflowConfig);

// Add progress listener
orchestrator.on('progress', (progress) => {
  console.log(`Progress: ${progress.completedSteps}/${progress.totalSteps}`);
  console.log(`Current step: ${progress.currentStep}`);
  console.log(`Step progress: ${progress.stepProgress}%`);
});
```

### Performance Monitoring

```typescript
// Monitor execution times
const execution = await orchestrator.executeWorkflow();
const processingTime = execution.results.summary.totalProcessingTime;
console.log(`Total processing time: ${processingTime}ms`);
```

## Error Handling and Recovery

### Automatic Retry

The workflow system includes automatic retry logic for failed steps:

```typescript
const config = {
  retryFailedSteps: true,
  maxRetries: 3,
  retryDelay: 5000 // 5 seconds
};
```

### Error Logging

```typescript
// Errors are automatically logged to the database
// View errors in Supabase dashboard or through API
const { data, error } = await supabase
  .from('workflow_errors')
  .select('*')
  .order('created_at', { ascending: false });
```

## Best Practices

### Content Quality

1. **Set appropriate quality thresholds** (70-85 recommended)
2. **Use multiple content types** for comprehensive coverage
3. **Regular keyword research** to stay current with trends
4. **Quality assurance** before deployment

### Performance

1. **Limit concurrent processes** to avoid API rate limits
2. **Use batch processing** for multiple brokers
3. **Monitor performance metrics** regularly
4. **Optimize database queries** with proper indexing

### Security

1. **Keep API keys secure** in environment variables
2. **Use RLS policies** for database access
3. **Validate all inputs** before processing
4. **Monitor for suspicious activity**

## Troubleshooting

### Common Issues

1. **MCP Tools Not Available**
   - Check MCP server configuration
   - Verify tool permissions
   - Restart MCP servers if needed

2. **Database Connection Issues**
   - Verify Supabase credentials
   - Check network connectivity
   - Review RLS policies

3. **Content Generation Failures**
   - Check API rate limits
   - Verify input data quality
   - Review content templates

4. **Deployment Issues**
   - Check file system permissions
   - Verify template paths
   - Review deployment configuration

### Debug Mode

```typescript
const config = {
  debug: true,
  logLevel: 'verbose',
  enableVerboseLogging: true
};
```

## API Reference

### WorkflowOrchestrator

#### Methods
- `executeWorkflow()` - Execute complete workflow
- `getExecutionStatus()` - Get current execution status
- `pauseWorkflow()` - Pause running workflow
- `resumeWorkflow()` - Resume paused workflow
- `cancelWorkflow()` - Cancel workflow execution

### Individual Agents

Each agent follows a similar pattern with standardized interfaces:

```typescript
interface AgentInterface {
  execute(request: AgentRequest): Promise<AgentResponse>;
  validate(request: AgentRequest): Promise<boolean>;
  getCapabilities(): AgentCapabilities;
}
```

## Future Enhancements

### Planned Features

1. **Advanced Analytics**
   - Content performance tracking
   - SEO ranking monitoring
   - User engagement metrics

2. **Enhanced AI Integration**
   - GPT-4 integration for better content
   - Advanced NLP for keyword analysis
   - Automated content A/B testing

3. **Multi-language Support**
   - Content generation in multiple languages
   - International SEO optimization
   - Localized keyword research

4. **Real-time Processing**
   - Stream processing for large datasets
   - Real-time content updates
   - Live performance monitoring

## Support

For issues and questions:

1. **Check the logs** in the database
2. **Run diagnostic tests** using the test runner
3. **Review the documentation** for specific components
4. **Contact support** for complex issues

## License

This system is part of the Dualite project and follows the same license terms.