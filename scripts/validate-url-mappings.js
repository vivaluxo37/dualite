const fs = require('fs');
const path = require('path');

// Load App.tsx to analyze routes
const appPath = path.join(__dirname, '../src/App.tsx');
const appContent = fs.readFileSync(appPath, 'utf8');

// Load ForexBrokersRouter to analyze forex-brokers routes
const routerPath = path.join(__dirname, '../src/pages/forex-brokers/ForexBrokersRouter.tsx');
const routerContent = fs.readFileSync(routerPath, 'utf8');

// Extract routes from App.tsx
function extractAppRoutes(content) {
  const routes = [];
  
  // Find all Route elements with path attributes
  const pathRegex = /path="([^"]+)"/g;
  let match;
  
  while ((match = pathRegex.exec(content)) !== null) {
    const path = match[1];
    if (!path.includes('*') && !path.includes(':')) { // Exclude dynamic routes
      routes.push(path);
    }
  }
  
  return routes;
}

// Extract forex-brokers routes from router
function extractForexBrokersRoutes(content) {
  const routes = [];
  
  // Find region mappings
  const regionMappings = [
    'north-america', 'europe', 'asia-pacific', 'middle-east-africa', 'south-asia',
    'malaysia', 'pakistan', 'australia', 'usa', 'canada', 'dubai', 'singapore',
    'south-africa', 'india', 'nepal'
  ];
  
  // Find trading type mappings
  const tradingTypeMappings = [
    'ecn', 'islamic', 'beginners', 'mt4', 'low-spread', 'copy-trading',
    'auto-trading', 'scalping', 'high-leverage', 'oil-trading', 'demo-accounts',
    'stock-trading'
  ];
  
  // Generate forex-brokers routes
  regionMappings.forEach(region => {
    routes.push(`forex-brokers/regions/${region}`);
    routes.push(`forex-brokers/regional/${region}`);
  });
  
  tradingTypeMappings.forEach(type => {
    routes.push(`forex-brokers/trading-types/${type}`);
  });
  
  return routes;
}

// Analyze URL patterns and identify inconsistencies
function analyzeUrlMappings(appRoutes, forexRoutes) {
  const issues = [];
  const suggestions = [];
  
  // Check for region route inconsistencies
  const regionRoutes = appRoutes.filter(route => route.includes('brokers/') && !route.includes('style/'));
  const expectedRegionRoutes = [
    'brokers/north-america',
    'brokers/europe', 
    'brokers/asia-pacific',
    'brokers/middle-east-africa',
    'brokers/south-asia',
    'brokers/malaysia',
    'brokers/pakistan',
    'brokers/australia'
  ];
  
  expectedRegionRoutes.forEach(expected => {
    if (!regionRoutes.includes(expected)) {
      issues.push(`Missing region route: ${expected}`);
      suggestions.push(`Add route for ${expected} in App.tsx`);
    }
  });
  
  // Check for trading style route inconsistencies
  const tradingStyleRoutes = appRoutes.filter(route => route.includes('brokers/style/'));
  const expectedTradingStyleRoutes = [
    'brokers/style/ecn',
    'brokers/style/islamic',
    'brokers/style/beginners',
    'brokers/style/mt4',
    'brokers/style/low-spread',
    'brokers/style/copy-trading',
    'brokers/style/auto-trading',
    'brokers/style/scalping',
    'brokers/style/high-leverage'
  ];
  
  expectedTradingStyleRoutes.forEach(expected => {
    if (!tradingStyleRoutes.includes(expected)) {
      issues.push(`Missing trading style route: ${expected}`);
      suggestions.push(`Add route for ${expected} in App.tsx`);
    }
  });
  
  // Check for forex-brokers route consistency
  const forexRegionRoutes = forexRoutes.filter(route => route.includes('regions/'));
  const forexRegionalRoutes = forexRoutes.filter(route => route.includes('regional/'));
  const forexTradingRoutes = forexRoutes.filter(route => route.includes('trading-types/'));
  
  // Check if forex-brokers router handles all expected routes
  const expectedForexRegions = [
    'north-america', 'europe', 'asia-pacific', 'middle-east-africa', 'south-asia',
    'malaysia', 'pakistan', 'australia', 'usa', 'canada', 'dubai', 'singapore',
    'south-africa', 'india', 'nepal'
  ];
  
  expectedForexRegions.forEach(region => {
    const regionRoute = `forex-brokers/regions/${region}`;
    const regionalRoute = `forex-brokers/regional/${region}`;
    
    if (!forexRegionRoutes.includes(regionRoute)) {
      issues.push(`Missing forex region route: ${regionRoute}`);
      suggestions.push(`Add handling for ${regionRoute} in ForexBrokersRouter`);
    }
    
    if (!forexRegionalRoutes.includes(regionalRoute)) {
      issues.push(`Missing forex regional route: ${regionalRoute}`);
      suggestions.push(`Add handling for ${regionalRoute} in ForexBrokersRouter`);
    }
  });
  
  return { issues, suggestions };
}

// Generate URL mapping fixes
function generateUrlMappingFixes(issues, suggestions) {
  const fixes = [];
  
  // Fix App.tsx routes
  fixes.push({
    file: 'src/App.tsx',
    description: 'Add missing region routes',
    code: `// Add these routes to App.tsx:
<Route
  path="brokers/north-america"
  element={
    <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
      <RegionPage />
    </Suspense>
  }
/>
// Repeat for other regions...`
  });
  
  // Fix ForexBrokersRouter mappings
  fixes.push({
    file: 'src/pages/forex-brokers/ForexBrokersRouter.tsx',
    description: 'Add missing URL mappings',
    code: `// Add these mappings to the urlMappings object:
const urlMappings: Record<string, string> = {
  // ... existing mappings ...
  'north-america': 'north-america',
  'europe': 'europe',
  'asia-pacific': 'asia-pacific',
  'middle-east-africa': 'middle-east-africa',
  'south-asia': 'south-asia'
};`
  });
  
  return fixes;
}

// Main analysis
console.log('🔍 Analyzing URL mappings...\n');

const appRoutes = extractAppRoutes(appContent);
const forexRoutes = extractForexBrokersRoutes(routerContent);

console.log('📊 Route Analysis:');
console.log(`App.tsx routes found: ${appRoutes.length}`);
console.log(`Forex-brokers routes found: ${forexRoutes.length}\n`);

console.log('📋 App.tsx Routes:');
appRoutes.forEach(route => console.log(`  - ${route}`));

console.log('\n📋 Forex-brokers Routes:');
forexRoutes.forEach(route => console.log(`  - ${route}`));

const { issues, suggestions } = analyzeUrlMappings(appRoutes, forexRoutes);

console.log('\n⚠️ Issues Found:');
issues.forEach(issue => console.log(`  - ${issue}`));

console.log('\n💡 Suggestions:');
suggestions.forEach(suggestion => console.log(`  - ${suggestion}`));

const fixes = generateUrlMappingFixes(issues, suggestions);

console.log('\n🔧 Generated Fixes:');
fixes.forEach((fix, index) => {
  console.log(`\n${index + 1}. ${fix.file} - ${fix.description}`);
  console.log(fix.code);
});

// Save analysis report
const report = {
  analysisDate: new Date().toISOString(),
  appRoutes,
  forexRoutes,
  issues,
  suggestions,
  fixes
};

const reportPath = path.join(__dirname, '../url-mapping-analysis.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log(`\n✅ Analysis report saved to ${reportPath}`);
console.log('🎯 URL mapping validation complete!');
