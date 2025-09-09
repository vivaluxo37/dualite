// Dashboard Responsive Design Browser Test Script
// Run this in browser console on http://localhost:5173/dashboard

console.log('🎯 Dashboard Responsive Design Test Suite');
console.log('=' .repeat(50));

// Test configurations for different screen sizes
const SCREEN_SIZES = [
  { name: 'Mobile XS', width: 320, height: 568, category: 'mobile' },
  { name: 'Mobile S', width: 375, height: 667, category: 'mobile' },
  { name: 'Mobile M', width: 414, height: 896, category: 'mobile' },
  { name: 'Tablet Portrait', width: 768, height: 1024, category: 'tablet' },
  { name: 'Tablet Landscape', width: 1024, height: 768, category: 'tablet' },
  { name: 'Desktop S', width: 1200, height: 800, category: 'desktop' },
  { name: 'Desktop M', width: 1440, height: 900, category: 'desktop' },
  { name: 'Desktop L', width: 1920, height: 1080, category: 'desktop' }
];

// Helper functions
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function simulateViewport(width, height) {
  // Try to resize window (may not work in all browsers)
  try {
    window.resizeTo(width, height);
  } catch (e) {
    console.log('⚠️ Cannot resize window, using CSS simulation');
  }
  
  // Simulate viewport with CSS
  const style = document.createElement('style');
  style.id = 'responsive-test-style';
  style.textContent = `
    html, body {
      max-width: ${width}px !important;
      overflow-x: auto !important;
    }
    .container, .max-w-7xl, .max-w-6xl, .max-w-5xl {
      max-width: ${width - 32}px !important;
    }
  `;
  
  // Remove existing test style
  const existing = document.getElementById('responsive-test-style');
  if (existing) existing.remove();
  
  document.head.appendChild(style);
}

function resetViewport() {
  const testStyle = document.getElementById('responsive-test-style');
  if (testStyle) testStyle.remove();
  
  try {
    window.resizeTo(1440, 900);
  } catch (e) {}
}

function getElementMetrics(selector) {
  const element = document.querySelector(selector);
  if (!element) return null;
  
  const rect = element.getBoundingClientRect();
  const styles = window.getComputedStyle(element);
  
  return {
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    visible: rect.width > 0 && rect.height > 0,
    display: styles.display,
    position: styles.position,
    fontSize: parseFloat(styles.fontSize),
    padding: styles.padding,
    margin: styles.margin,
    overflow: styles.overflow
  };
}

function checkHorizontalOverflow() {
  const body = document.body;
  const html = document.documentElement;
  
  const documentWidth = Math.max(
    body.scrollWidth, body.offsetWidth,
    html.clientWidth, html.scrollWidth, html.offsetWidth
  );
  
  return documentWidth > window.innerWidth;
}

function checkTouchTargetSizes() {
  const interactiveElements = document.querySelectorAll(
    'button, a[href], input, select, textarea, [role="button"], [tabindex="0"], .cursor-pointer'
  );
  
  const issues = [];
  const MIN_TOUCH_SIZE = 44; // 44px minimum for accessibility
  
  interactiveElements.forEach((element, index) => {
    const rect = element.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      if (rect.width < MIN_TOUCH_SIZE || rect.height < MIN_TOUCH_SIZE) {
        issues.push({
          element: element.tagName.toLowerCase(),
          text: element.textContent?.trim().substring(0, 30) || '',
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          selector: element.className ? `.${element.className.split(' ')[0]}` : element.tagName.toLowerCase()
        });
      }
    }
  });
  
  return issues;
}

function analyzeNavigation() {
  const nav = document.querySelector('nav, .navigation, .navbar, header nav');
  if (!nav) return { exists: false };
  
  const rect = nav.getBoundingClientRect();
  const styles = window.getComputedStyle(nav);
  
  // Check for mobile menu indicators
  const hamburger = nav.querySelector('.hamburger, .menu-toggle, [aria-label*="menu"], .mobile-menu-button');
  const mobileMenu = document.querySelector('.mobile-menu, .nav-mobile, .drawer');
  
  return {
    exists: true,
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    visible: rect.width > 0 && rect.height > 0,
    display: styles.display,
    hasHamburger: !!hamburger,
    hasMobileMenu: !!mobileMenu,
    position: styles.position
  };
}

function analyzeTabs() {
  const tabContainer = document.querySelector('[role="tablist"], .tabs, .tab-container');
  if (!tabContainer) return { exists: false };
  
  const tabs = tabContainer.querySelectorAll('[role="tab"], .tab, .tab-button');
  const rect = tabContainer.getBoundingClientRect();
  const styles = window.getComputedStyle(tabContainer);
  
  const tabMetrics = Array.from(tabs).map(tab => {
    const tabRect = tab.getBoundingClientRect();
    return {
      text: tab.textContent?.trim() || '',
      width: Math.round(tabRect.width),
      height: Math.round(tabRect.height),
      visible: tabRect.width > 0 && tabRect.height > 0
    };
  });
  
  return {
    exists: true,
    containerWidth: Math.round(rect.width),
    containerHeight: Math.round(rect.height),
    tabCount: tabs.length,
    tabs: tabMetrics,
    overflow: styles.overflow,
    allTabsVisible: tabMetrics.every(tab => tab.visible)
  };
}

function analyzeContent() {
  const main = document.querySelector('main, .main-content, .dashboard-content, .content');
  if (!main) return { exists: false };
  
  const cards = main.querySelectorAll('.card, .broker-card, .module-card, .progress-card');
  const grids = main.querySelectorAll('.grid, .flex, .grid-cols-1, .grid-cols-2, .grid-cols-3');
  
  const rect = main.getBoundingClientRect();
  
  return {
    exists: true,
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    cardCount: cards.length,
    gridCount: grids.length,
    hasScrollableContent: main.scrollHeight > main.clientHeight
  };
}

function checkTextReadability() {
  const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, label');
  const issues = [];
  
  textElements.forEach(element => {
    const styles = window.getComputedStyle(element);
    const fontSize = parseFloat(styles.fontSize);
    const lineHeight = parseFloat(styles.lineHeight);
    
    // Check for text that might be too small on mobile
    if (fontSize < 14) {
      const text = element.textContent?.trim();
      if (text && text.length > 10) {
        issues.push({
          element: element.tagName.toLowerCase(),
          fontSize: fontSize,
          text: text.substring(0, 30) + (text.length > 30 ? '...' : '')
        });
      }
    }
  });
  
  return issues;
}

// Main responsive analysis function
function analyzeResponsiveLayout(screenSize) {
  const analysis = {
    screenSize: screenSize,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    issues: [],
    warnings: [],
    successes: []
  };
  
  // Check horizontal overflow
  const hasOverflow = checkHorizontalOverflow();
  if (hasOverflow) {
    analysis.issues.push('Horizontal overflow detected');
  } else {
    analysis.successes.push('No horizontal overflow');
  }
  
  // Check touch targets
  const touchIssues = checkTouchTargetSizes();
  if (touchIssues.length > 0) {
    analysis.issues.push(`${touchIssues.length} touch targets too small`);
    analysis.touchIssues = touchIssues.slice(0, 5); // Limit to first 5
  } else {
    analysis.successes.push('All touch targets adequate size');
  }
  
  // Analyze navigation
  const navigation = analyzeNavigation();
  analysis.navigation = navigation;
  if (navigation.exists) {
    if (screenSize.category === 'mobile' && !navigation.hasHamburger) {
      analysis.warnings.push('Mobile navigation might need hamburger menu');
    }
    if (navigation.visible) {
      analysis.successes.push('Navigation is visible');
    }
  } else {
    analysis.warnings.push('No navigation found');
  }
  
  // Analyze tabs
  const tabs = analyzeTabs();
  analysis.tabs = tabs;
  if (tabs.exists) {
    if (tabs.allTabsVisible) {
      analysis.successes.push('All tabs are visible');
    } else {
      analysis.warnings.push('Some tabs may not be visible');
    }
  }
  
  // Analyze content
  const content = analyzeContent();
  analysis.content = content;
  if (content.exists) {
    analysis.successes.push(`Content area found with ${content.cardCount} cards`);
  }
  
  // Check text readability
  const textIssues = checkTextReadability();
  if (textIssues.length > 0 && screenSize.category === 'mobile') {
    analysis.warnings.push(`${textIssues.length} text elements may be too small`);
    analysis.textIssues = textIssues.slice(0, 3);
  }
  
  return analysis;
}

// Test individual screen size
async function testScreenSize(screenConfig) {
  console.log(`\n📱 Testing ${screenConfig.name} (${screenConfig.width}x${screenConfig.height})`);
  
  // Apply screen size
  simulateViewport(screenConfig.width, screenConfig.height);
  await sleep(1500); // Wait for layout to settle
  
  // Analyze layout
  const analysis = analyzeResponsiveLayout(screenConfig);
  
  // Report results
  console.log(`   Viewport: ${analysis.viewport.width}x${analysis.viewport.height}`);
  
  if (analysis.issues.length > 0) {
    console.log(`   ❌ Issues (${analysis.issues.length}):`);
    analysis.issues.forEach(issue => console.log(`      - ${issue}`));
  }
  
  if (analysis.warnings.length > 0) {
    console.log(`   ⚠️ Warnings (${analysis.warnings.length}):`);
    analysis.warnings.forEach(warning => console.log(`      - ${warning}`));
  }
  
  if (analysis.successes.length > 0) {
    console.log(`   ✅ Successes (${analysis.successes.length}):`);
    analysis.successes.slice(0, 2).forEach(success => console.log(`      - ${success}`));
  }
  
  // Show touch target issues if any
  if (analysis.touchIssues && analysis.touchIssues.length > 0) {
    console.log(`   🔍 Small touch targets:`);
    analysis.touchIssues.forEach(issue => {
      console.log(`      - ${issue.element}: ${issue.width}x${issue.height}px "${issue.text}"`);
    });
  }
  
  return analysis;
}

// Test all dashboard tabs at current screen size
async function testTabsAtCurrentSize() {
  console.log('\n🔄 Testing all tabs at current screen size...');
  
  const tabs = document.querySelectorAll('[role="tab"], .tab-button, .tab');
  const results = [];
  
  if (tabs.length === 0) {
    console.log('   ⚠️ No tabs found');
    return [];
  }
  
  for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i];
    const tabName = tab.textContent?.trim() || `Tab ${i + 1}`;
    
    console.log(`   Testing ${tabName}...`);
    
    // Click tab and wait
    tab.click();
    await sleep(1000);
    
    // Quick analysis
    const hasOverflow = checkHorizontalOverflow();
    const touchIssues = checkTouchTargetSizes();
    const content = analyzeContent();
    
    const result = {
      tab: tabName,
      hasOverflow,
      touchIssueCount: touchIssues.length,
      cardCount: content.cardCount || 0,
      contentVisible: content.exists
    };
    
    results.push(result);
    
    const status = hasOverflow || touchIssues.length > 3 ? '⚠️' : '✅';
    console.log(`      ${status} Overflow: ${hasOverflow}, Touch issues: ${touchIssues.length}, Cards: ${result.cardCount}`);
  }
  
  return results;
}

// Run comprehensive responsive test
async function runResponsiveTestSuite() {
  console.log('🚀 Starting Comprehensive Responsive Test Suite');
  console.log('=' .repeat(60));
  
  const startTime = Date.now();
  const results = [];
  
  try {
    // Test each screen size
    for (const screenSize of SCREEN_SIZES) {
      const analysis = await testScreenSize(screenSize);
      
      // Test tabs at this screen size
      const tabResults = await testTabsAtCurrentSize();
      analysis.tabResults = tabResults;
      
      results.push(analysis);
      
      // Brief pause between tests
      await sleep(500);
    }
    
    // Reset viewport
    resetViewport();
    await sleep(1000);
    
    // Generate comprehensive report
    generateResponsiveReport(results, Date.now() - startTime);
    
    return results;
    
  } catch (error) {
    console.error('💥 Responsive test suite failed:', error);
    resetViewport();
    return [];
  }
}

// Generate detailed report
function generateResponsiveReport(results, duration) {
  console.log('\n' + '=' .repeat(60));
  console.log('📊 COMPREHENSIVE RESPONSIVE DESIGN REPORT');
  console.log('=' .repeat(60));
  
  let totalIssues = 0;
  let totalWarnings = 0;
  let totalSuccesses = 0;
  
  // Category analysis
  const categoryResults = {
    mobile: { tested: 0, issues: 0, warnings: 0 },
    tablet: { tested: 0, issues: 0, warnings: 0 },
    desktop: { tested: 0, issues: 0, warnings: 0 }
  };
  
  results.forEach(result => {
    const category = result.screenSize.category;
    categoryResults[category].tested++;
    categoryResults[category].issues += result.issues.length;
    categoryResults[category].warnings += result.warnings.length;
    
    totalIssues += result.issues.length;
    totalWarnings += result.warnings.length;
    totalSuccesses += result.successes.length;
    
    // Individual screen report
    const issueCount = result.issues.length;
    const warningCount = result.warnings.length;
    const status = issueCount === 0 ? '✅' : issueCount <= 2 ? '⚠️' : '❌';
    
    console.log(`${status} ${result.screenSize.name} (${result.screenSize.width}px):`);
    console.log(`   Issues: ${issueCount}, Warnings: ${warningCount}, Cards: ${result.content?.cardCount || 0}`);
    
    if (result.tabResults && result.tabResults.length > 0) {
      const tabIssues = result.tabResults.filter(tab => tab.hasOverflow || tab.touchIssueCount > 2).length;
      console.log(`   Tabs: ${result.tabResults.length} tested, ${tabIssues} with issues`);
    }
  });
  
  // Category summary
  console.log('\n📱 CATEGORY BREAKDOWN:');
  Object.entries(categoryResults).forEach(([category, data]) => {
    if (data.tested > 0) {
      const avgIssues = (data.issues / data.tested).toFixed(1);
      const status = data.issues === 0 ? '✅' : data.issues <= data.tested ? '⚠️' : '❌';
      console.log(`   ${status} ${category.toUpperCase()}: ${data.tested} sizes, avg ${avgIssues} issues per size`);
    }
  });
  
  // Overall metrics
  const totalTests = results.length;
  const successRate = totalTests > 0 ? Math.round(((totalTests * 3 - totalIssues) / (totalTests * 3)) * 100) : 0;
  
  console.log('\n📈 OVERALL METRICS:');
  console.log(`   Screen sizes tested: ${totalTests}`);
  console.log(`   Total issues: ${totalIssues}`);
  console.log(`   Total warnings: ${totalWarnings}`);
  console.log(`   Success rate: ${successRate}%`);
  console.log(`   Test duration: ${(duration / 1000).toFixed(1)}s`);
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  if (totalIssues === 0) {
    console.log('   🎉 Excellent! Dashboard is fully responsive across all screen sizes.');
  } else if (totalIssues <= totalTests) {
    console.log('   ✅ Good responsive design with minor issues to address.');
    console.log('   🔧 Focus on touch target sizes and overflow issues.');
  } else {
    console.log('   ⚠️ Responsive design needs improvement.');
    console.log('   🔧 Priority: Fix horizontal overflow and touch targets.');
    console.log('   📱 Consider mobile-first design approach.');
  }
  
  // Common issues
  const commonIssues = {};
  results.forEach(result => {
    result.issues.forEach(issue => {
      commonIssues[issue] = (commonIssues[issue] || 0) + 1;
    });
  });
  
  if (Object.keys(commonIssues).length > 0) {
    console.log('\n🔍 MOST COMMON ISSUES:');
    Object.entries(commonIssues)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .forEach(([issue, count]) => {
        console.log(`   - ${issue} (${count} screen sizes affected)`);
      });
  }
}

// Quick responsive check for current viewport
function quickResponsiveCheck() {
  console.log('⚡ Quick Responsive Check');
  console.log('=' .repeat(40));
  
  const currentSize = {
    name: 'Current',
    width: window.innerWidth,
    height: window.innerHeight,
    category: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1200 ? 'tablet' : 'desktop'
  };
  
  const analysis = analyzeResponsiveLayout(currentSize);
  
  console.log(`Current viewport: ${analysis.viewport.width}x${analysis.viewport.height} (${currentSize.category})`);
  
  if (analysis.issues.length > 0) {
    console.log(`❌ Issues found (${analysis.issues.length}):`);
    analysis.issues.forEach(issue => console.log(`   - ${issue}`));
  }
  
  if (analysis.warnings.length > 0) {
    console.log(`⚠️ Warnings (${analysis.warnings.length}):`);
    analysis.warnings.forEach(warning => console.log(`   - ${warning}`));
  }
  
  if (analysis.successes.length > 0) {
    console.log(`✅ Working well (${analysis.successes.length}):`);
    analysis.successes.slice(0, 3).forEach(success => console.log(`   - ${success}`));
  }
  
  return analysis;
}

// Export test functions
window.responsiveTests = {
  runFull: runResponsiveTestSuite,
  quickCheck: quickResponsiveCheck,
  testSize: testScreenSize,
  testTabs: testTabsAtCurrentSize,
  analyze: analyzeResponsiveLayout,
  reset: resetViewport
};

// Display available commands
console.log('\n💡 Available responsive test commands:');
console.log('   responsiveTests.runFull() - Run complete responsive test suite');
console.log('   responsiveTests.quickCheck() - Quick check current viewport');
console.log('   responsiveTests.testTabs() - Test all tabs at current size');
console.log('   responsiveTests.reset() - Reset viewport to default');

// Auto-run quick check
console.log('\n🔄 Running quick responsive check...');
setTimeout(() => {
  quickResponsiveCheck();
}, 1000);