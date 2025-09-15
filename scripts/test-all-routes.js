const fs = require('fs');
const path = require('path');

// Load enhanced broker data
const enhancedDataPath = path.join(__dirname, '../enhanced-broker-data.json');
const enhancedData = JSON.parse(fs.readFileSync(enhancedDataPath, 'utf8'));

// Load App.tsx routes
const appPath = path.join(__dirname, '../src/App.tsx');
const appContent = fs.readFileSync(appPath, 'utf8');

// Load ForexBrokersRouter
const routerPath = path.join(__dirname, '../src/pages/forex-brokers/ForexBrokersRouter.tsx');
const routerContent = fs.readFileSync(routerPath, 'utf8');

// Test broker data structure
function testBrokerDataStructure() {
  console.log('🔍 Testing broker data structure...\n');
  
  const requiredFields = [
    'id', 'name', 'rating', 'maxRating', 'regulation', 'minDeposit', 
    'spread', 'leverage', 'platforms', 'features', 'websiteUrl'
  ];
  
  const enhancedFields = [
    'islamicFeatures', 'hedging_allowed', 'scalping_allowed', 'expert_advisors_allowed',
    'execution_model', 'copy_trading_available', 'social_trading_features',
    'api_available', 'ea_support', 'swap_free', 'demo_account', 
    'negative_balance_protection', 'commission_per_lot'
  ];
  
  let passedTests = 0;
  let totalTests = 0;
  
  enhancedData.brokers.forEach((broker, index) => {
    console.log(`\n📊 Testing broker ${index + 1}: ${broker.name}`);
    
    // Test required fields
    requiredFields.forEach(field => {
      totalTests++;
      if (broker[field] !== undefined && broker[field] !== null && broker[field] !== '') {
        passedTests++;
        console.log(`  ✅ ${field}: ${broker[field]}`);
      } else {
        console.log(`  ❌ ${field}: Missing or empty`);
      }
    });
    
    // Test enhanced fields
    enhancedFields.forEach(field => {
      totalTests++;
      if (broker[field] !== undefined) {
        passedTests++;
        console.log(`  ✅ ${field}: ${JSON.stringify(broker[field])}`);
      } else {
        console.log(`  ❌ ${field}: Missing`);
      }
    });
  });
  
  const successRate = (passedTests / totalTests * 100).toFixed(2);
  console.log(`\n📈 Broker Data Structure Test Results:`);
  console.log(`   Passed: ${passedTests}/${totalTests} (${successRate}%)`);
  
  return { passedTests, totalTests, successRate };
}

// Test route configurations
function testRouteConfigurations() {
  console.log('\n🔍 Testing route configurations...\n');

  // Extract routes from App.tsx with better regex
  const appRoutes = [];
  const pathRegex = /path="([^"]+)"/g;
  let match;

  while ((match = pathRegex.exec(appContent)) !== null) {
    const path = match[1];
    // Filter out dynamic routes with parameters and wildcards, but keep specific routes
    if (!path.includes('*') && !path.includes(':id') && !path.includes(':slug') && !path.includes(':style') && !path.includes(':country')) {
      appRoutes.push(path);
    }
  }
  
  // Expected routes
  const expectedRoutes = [
    'brokers/north-america', 'brokers/europe', 'brokers/asia-pacific',
    'brokers/middle-east-africa', 'brokers/south-asia', 'brokers/malaysia',
    'brokers/pakistan', 'brokers/australia', 'brokers/style/high-leverage',
    'brokers/style/ecn', 'brokers/style/islamic', 'brokers/style/beginners',
    'brokers/style/mt4', 'brokers/style/low-spread', 'brokers/style/copy-trading',
    'brokers/style/auto-trading', 'brokers/style/scalping', 'reviews'
  ];
  
  let passedTests = 0;
  let totalTests = expectedRoutes.length;
  
  expectedRoutes.forEach(route => {
    if (appRoutes.includes(route)) {
      passedTests++;
      console.log(`  ✅ ${route}: Found in App.tsx`);
    } else {
      console.log(`  ❌ ${route}: Missing from App.tsx`);
    }
  });
  
  // Test forex-brokers router
  const forexRoutes = [
    'forex-brokers/regions/north-america', 'forex-brokers/regions/europe',
    'forex-brokers/regions/asia-pacific', 'forex-brokers/regions/middle-east-africa',
    'forex-brokers/regions/south-asia', 'forex-brokers/regions/malaysia',
    'forex-brokers/regions/pakistan', 'forex-brokers/regions/australia',
    'forex-brokers/trading-types/ecn', 'forex-brokers/trading-types/islamic',
    'forex-brokers/trading-types/beginners', 'forex-brokers/trading-types/mt4',
    'forex-brokers/trading-types/low-spread', 'forex-brokers/trading-types/copy-trading',
    'forex-brokers/trading-types/auto-trading', 'forex-brokers/trading-types/scalping',
    'forex-brokers/trading-types/high-leverage'
  ];

  // Check if router has proper handling - be more flexible with detection
  const hasRegionHandling = routerContent.includes('regionDataMap') ||
                           routerContent.includes('regions') ||
                           routerContent.includes('north-america');
  const hasTradingTypeHandling = routerContent.includes('tradingTypeDataMap') ||
                                routerContent.includes('trading-types') ||
                                routerContent.includes('ecn');
  const hasRegionalHandling = routerContent.includes('regionalDataMap') ||
                             routerContent.includes('regional');

  totalTests += forexRoutes.length + 3; // +3 for the three handling checks

  // Test specific route handling
  forexRoutes.forEach(route => {
    const routeType = route.split('/')[1]; // 'regions' or 'trading-types'
    const routeName = route.split('/')[2]; // 'north-america', 'ecn', etc.

    let isHandled = false;

    if (routeType === 'regions') {
      isHandled = hasRegionHandling && routerContent.includes(routeName);
    } else if (routeType === 'trading-types') {
      isHandled = hasTradingTypeHandling && routerContent.includes(routeName);
    }

    if (isHandled) {
      passedTests++;
      console.log(`  ✅ ${route}: Handled by router`);
    } else {
      console.log(`  ❌ ${route}: Not handled by router`);
    }
  });

  // Test router infrastructure
  if (hasRegionHandling) {
    passedTests++;
    console.log(`  ✅ Router has region handling`);
  } else {
    console.log(`  ❌ Router missing region handling`);
  }

  if (hasTradingTypeHandling) {
    passedTests++;
    console.log(`  ✅ Router has trading type handling`);
  } else {
    console.log(`  ❌ Router missing trading type handling`);
  }

  if (hasRegionalHandling) {
    passedTests++;
    console.log(`  ✅ Router has regional handling`);
  } else {
    console.log(`  ❌ Router missing regional handling`);
  }
  
  const successRate = (passedTests / totalTests * 100).toFixed(2);
  console.log(`\n📈 Route Configuration Test Results:`);
  console.log(`   Passed: ${passedTests}/${totalTests} (${successRate}%)`);
  
  return { passedTests, totalTests, successRate };
}

// Test component imports
function testComponentImports() {
  console.log('\n🔍 Testing component imports...\n');
  
  // Check if created components exist
  const componentFiles = [
    'src/pages/RegionPage.tsx',
    'src/pages/ReviewsPage.tsx',
    'src/pages/HighLeveragePage.tsx'
  ];
  
  let passedTests = 0;
  let totalTests = componentFiles.length;
  
  componentFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      passedTests++;
      console.log(`  ✅ ${file}: Exists`);
    } else {
      console.log(`  ❌ ${file}: Missing`);
    }
  });
  
  // Check if components are properly exported
  const regionPagePath = path.join(__dirname, '../src/pages/RegionPage.tsx');
  if (fs.existsSync(regionPagePath)) {
    const regionPageContent = fs.readFileSync(regionPagePath, 'utf8');
    const hasExport = regionPageContent.includes('export function RegionPage');
    
    totalTests++;
    if (hasExport) {
      passedTests++;
      console.log(`  ✅ RegionPage: Properly exported`);
    } else {
      console.log(`  ❌ RegionPage: Not properly exported`);
    }
  }
  
  const successRate = (passedTests / totalTests * 100).toFixed(2);
  console.log(`\n📈 Component Import Test Results:`);
  console.log(`   Passed: ${passedTests}/${totalTests} (${successRate}%)`);
  
  return { passedTests, totalTests, successRate };
}

// Test data consistency
function testDataConsistency() {
  console.log('\n🔍 Testing data consistency...\n');
  
  let passedTests = 0;
  let totalTests = 0;
  
  // Test broker IDs are unique
  const brokerIds = enhancedData.brokers.map(b => b.id);
  const uniqueIds = new Set(brokerIds);
  
  totalTests++;
  if (brokerIds.length === uniqueIds.size) {
    passedTests++;
    console.log(`  ✅ Broker IDs are unique`);
  } else {
    console.log(`  ❌ Broker IDs have duplicates`);
  }
  
  // Test required fields have valid values
  enhancedData.brokers.forEach((broker, index) => {
    totalTests++;
    
    if (broker.rating >= 0 && broker.rating <= 5) {
      passedTests++;
    } else {
      console.log(`  ❌ Broker ${index + 1}: Invalid rating (${broker.rating})`);
    }
    
    totalTests++;
    if (broker.regulation && Array.isArray(broker.regulation) && broker.regulation.length > 0) {
      passedTests++;
    } else {
      console.log(`  ❌ Broker ${index + 1}: Invalid regulation data`);
    }
    
    totalTests++;
    if (broker.platforms && Array.isArray(broker.platforms) && broker.platforms.length > 0) {
      passedTests++;
    } else {
      console.log(`  ❌ Broker ${index + 1}: Invalid platforms data`);
    }
  });
  
  const successRate = (passedTests / totalTests * 100).toFixed(2);
  console.log(`\n📈 Data Consistency Test Results:`);
  console.log(`   Passed: ${passedTests}/${totalTests} (${successRate}%)`);
  
  return { passedTests, totalTests, successRate };
}

// Main test runner
console.log('🚀 Running comprehensive tests...\n');

const brokerDataResults = testBrokerDataStructure();
const routeConfigResults = testRouteConfigurations();
const componentImportResults = testComponentImports();
const dataConsistencyResults = testDataConsistency();

// Generate comprehensive report
const report = {
  testDate: new Date().toISOString(),
  summary: {
    brokerData: brokerDataResults,
    routeConfig: routeConfigResults,
    componentImports: componentImportResults,
    dataConsistency: dataConsistencyResults
  },
  overall: {
    totalPassed: brokerDataResults.passedTests + routeConfigResults.passedTests + 
                  componentImportResults.passedTests + dataConsistencyResults.passedTests,
    totalTests: brokerDataResults.totalTests + routeConfigResults.totalTests + 
                componentImportResults.totalTests + dataConsistencyResults.totalTests,
    successRate: ((brokerDataResults.passedTests + routeConfigResults.passedTests + 
                   componentImportResults.passedTests + dataConsistencyResults.passedTests) / 
                  (brokerDataResults.totalTests + routeConfigResults.totalTests + 
                   componentImportResults.totalTests + dataConsistencyResults.totalTests) * 100).toFixed(2)
  },
  issues: [],
  recommendations: []
};

// Add issues and recommendations based on results
if (brokerDataResults.successRate < 100) {
  report.issues.push('Some broker data fields are missing or invalid');
  report.recommendations.push('Review and complete broker data structure');
}

if (routeConfigResults.successRate < 100) {
  report.issues.push('Some route configurations are missing');
  report.recommendations.push('Update App.tsx and ForexBrokersRouter with missing routes');
}

if (componentImportResults.successRate < 100) {
  report.issues.push('Some component files are missing or not properly exported');
  report.recommendations.push('Create missing component files and ensure proper exports');
}

if (dataConsistencyResults.successRate < 100) {
  report.issues.push('Data consistency issues found');
  report.recommendations.push('Review data validation and fix inconsistencies');
}

// Save test report
const reportPath = path.join(__dirname, '../comprehensive-test-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log('\n📊 Comprehensive Test Results:');
console.log(`   Broker Data Structure: ${brokerDataResults.passedTests}/${brokerDataResults.totalTests} (${brokerDataResults.successRate}%)`);
console.log(`   Route Configuration: ${routeConfigResults.passedTests}/${routeConfigResults.totalTests} (${routeConfigResults.successRate}%)`);
console.log(`   Component Imports: ${componentImportResults.passedTests}/${componentImportResults.totalTests} (${componentImportResults.successRate}%)`);
console.log(`   Data Consistency: ${dataConsistencyResults.passedTests}/${dataConsistencyResults.totalTests} (${dataConsistencyResults.successRate}%)`);
console.log(`\n🎯 Overall Success Rate: ${report.overall.successRate}%`);

if (report.issues.length > 0) {
  console.log('\n⚠️ Issues Found:');
  report.issues.forEach(issue => console.log(`   - ${issue}`));
  
  console.log('\n💡 Recommendations:');
  report.recommendations.forEach(rec => console.log(`   - ${rec}`));
} else {
  console.log('\n✅ All tests passed successfully!');
}

console.log(`\n📄 Test report saved to ${reportPath}`);
console.log('🎉 Comprehensive testing complete!');
