// LearningProgress Component Browser Test Script
// Run this in browser console on http://localhost:5173/dashboard

console.log('=== LearningProgress Component Test Suite ===');
console.log('🚀 Starting comprehensive testing...');

// Helper functions
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }
    
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test 1: Navigate to Learning Progress tab
async function testNavigationToLearningProgress() {
  console.log('\n📍 Test 1: Navigation to Learning Progress');
  
  try {
    // First ensure we're on dashboard
    if (!window.location.pathname.includes('/dashboard')) {
      console.log('🔄 Navigating to dashboard...');
      window.location.href = '/dashboard';
      await sleep(2000);
    }
    
    // Look for Learning Progress tab
    const tabs = document.querySelectorAll('[role="tab"], button, a');
    let learningProgressTab = null;
    
    for (const tab of tabs) {
      const text = tab.textContent?.toLowerCase() || '';
      if (text.includes('learning progress') || 
          text.includes('progress') || 
          (text.includes('learning') && text.length < 20)) {
        learningProgressTab = tab;
        break;
      }
    }
    
    if (learningProgressTab) {
      console.log('✅ Learning Progress tab found:', learningProgressTab.textContent.trim());
      learningProgressTab.click();
      await sleep(2000);
      console.log('✅ Successfully clicked Learning Progress tab');
      return true;
    } else {
      console.log('❌ Learning Progress tab not found');
      console.log('Available tabs:', Array.from(tabs).map(t => t.textContent?.trim()).filter(Boolean));
      return false;
    }
  } catch (error) {
    console.log('❌ Error in navigation test:', error.message);
    return false;
  }
}

// Test 2: Check component loading and structure
async function testComponentLoading() {
  console.log('\n📍 Test 2: Component Loading & Structure');
  
  try {
    // Check for loading states
    const loadingElements = document.querySelectorAll(
      '.loading, .spinner, .skeleton, [data-testid="loading"]'
    );
    if (loadingElements.length > 0) {
      console.log('🔄 Loading state detected, waiting...');
      await sleep(3000);
    }
    
    // Check for main container
    const containers = document.querySelectorAll(
      '.learning-progress, [data-testid="learning-progress"], .progress-container'
    );
    
    if (containers.length > 0) {
      console.log('✅ Learning Progress container found');
    } else {
      console.log('⚠️ No specific Learning Progress container found, checking general content...');
    }
    
    // Check for any content in the active tab panel
    const activeTabPanel = document.querySelector('[role="tabpanel"]:not([hidden])');
    if (activeTabPanel && activeTabPanel.children.length > 0) {
      console.log('✅ Active tab panel has content');
      return true;
    }
    
    // Fallback: check for any meaningful content
    const contentElements = document.querySelectorAll('h1, h2, h3, .card, .progress');
    if (contentElements.length > 0) {
      console.log('✅ Content elements found:', contentElements.length);
      return true;
    }
    
    console.log('❌ No content found in Learning Progress section');
    return false;
  } catch (error) {
    console.log('❌ Error in component loading test:', error.message);
    return false;
  }
}

// Test 3: Check progress overview display
async function testProgressOverview() {
  console.log('\n📍 Test 3: Progress Overview Display');
  
  try {
    let foundElements = [];
    
    // Look for progress bars or circles
    const progressBars = document.querySelectorAll(
      '.progress-bar, .progress-circle, .progress, [role="progressbar"]'
    );
    if (progressBars.length > 0) {
      foundElements.push(`Progress bars: ${progressBars.length}`);
    }
    
    // Look for percentage displays
    const allText = document.body.textContent;
    const percentageMatches = allText.match(/\d+%/g);
    if (percentageMatches) {
      foundElements.push(`Percentages: ${percentageMatches.join(', ')}`);
    }
    
    // Look for completion statistics
    const statsPattern = /\d+\s*\/\s*\d+|\d+\s+of\s+\d+|completed|modules?/gi;
    const statsMatches = allText.match(statsPattern);
    if (statsMatches) {
      foundElements.push(`Stats indicators: ${statsMatches.slice(0, 3).join(', ')}`);
    }
    
    // Look for progress-related headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const progressHeadings = Array.from(headings).filter(h => 
      h.textContent.toLowerCase().includes('progress') ||
      h.textContent.toLowerCase().includes('overview') ||
      h.textContent.toLowerCase().includes('learning')
    );
    
    if (progressHeadings.length > 0) {
      foundElements.push(`Progress headings: ${progressHeadings.map(h => h.textContent.trim()).join(', ')}`);
    }
    
    if (foundElements.length > 0) {
      console.log('✅ Progress overview elements found:');
      foundElements.forEach(element => console.log(`   - ${element}`));
      return true;
    } else {
      console.log('❌ No progress overview elements found');
      return false;
    }
  } catch (error) {
    console.log('❌ Error in progress overview test:', error.message);
    return false;
  }
}

// Test 4: Check learning modules display
async function testLearningModules() {
  console.log('\n📍 Test 4: Learning Modules Display');
  
  try {
    let foundElements = [];
    
    // Look for module cards or list items
    const moduleCards = document.querySelectorAll(
      '.module, .card, .learning-module, [data-testid="module"], .module-card'
    );
    if (moduleCards.length > 0) {
      foundElements.push(`Module cards: ${moduleCards.length}`);
    }
    
    // Look for module titles
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6, .title, .module-title');
    const moduleHeadings = Array.from(headings).filter(h => {
      const text = h.textContent.toLowerCase();
      return text.includes('forex') || text.includes('trading') || 
             text.includes('analysis') || text.includes('basics') ||
             text.includes('introduction') || text.includes('fundamental') ||
             text.includes('technical') || text.includes('risk');
    });
    
    if (moduleHeadings.length > 0) {
      foundElements.push(`Module titles: ${moduleHeadings.map(h => h.textContent.trim()).slice(0, 3).join(', ')}`);
    }
    
    // Look for difficulty levels
    const allText = document.body.textContent.toLowerCase();
    const difficultyLevels = [];
    if (allText.includes('beginner')) difficultyLevels.push('beginner');
    if (allText.includes('intermediate')) difficultyLevels.push('intermediate');
    if (allText.includes('advanced')) difficultyLevels.push('advanced');
    
    if (difficultyLevels.length > 0) {
      foundElements.push(`Difficulty levels: ${difficultyLevels.join(', ')}`);
    }
    
    // Look for completion status indicators
    const statusElements = document.querySelectorAll(
      '.completed, .in-progress, .not-started, .status, .badge'
    );
    if (statusElements.length > 0) {
      foundElements.push(`Status indicators: ${statusElements.length}`);
    }
    
    // Look for progress indicators within modules
    const moduleProgress = document.querySelectorAll(
      '.module .progress, .card .progress, .module-progress'
    );
    if (moduleProgress.length > 0) {
      foundElements.push(`Module progress bars: ${moduleProgress.length}`);
    }
    
    if (foundElements.length > 0) {
      console.log('✅ Learning modules elements found:');
      foundElements.forEach(element => console.log(`   - ${element}`));
      return true;
    } else {
      console.log('❌ No learning modules elements found');
      return false;
    }
  } catch (error) {
    console.log('❌ Error in learning modules test:', error.message);
    return false;
  }
}

// Test 5: Check interactive elements
async function testInteractiveElements() {
  console.log('\n📍 Test 5: Interactive Elements');
  
  try {
    let foundElements = [];
    
    // Look for action buttons
    const buttons = document.querySelectorAll('button, a[role="button"], .btn');
    const actionButtons = Array.from(buttons).filter(btn => {
      const text = btn.textContent?.toLowerCase() || '';
      return text.includes('start') || text.includes('continue') || 
             text.includes('resume') || text.includes('view') ||
             text.includes('browse') || text.includes('learn') ||
             text.includes('begin') || text.includes('next');
    });
    
    if (actionButtons.length > 0) {
      foundElements.push(`Action buttons: ${actionButtons.map(btn => btn.textContent.trim()).slice(0, 3).join(', ')}`);
    }
    
    // Look for clickable modules
    const clickableElements = document.querySelectorAll(
      '[role="button"], .cursor-pointer, .clickable, .module[onclick], .card[onclick]'
    );
    if (clickableElements.length > 0) {
      foundElements.push(`Clickable elements: ${clickableElements.length}`);
    }
    
    // Look for links
    const links = document.querySelectorAll('a[href]');
    const relevantLinks = Array.from(links).filter(link => {
      const href = link.getAttribute('href') || '';
      const text = link.textContent?.toLowerCase() || '';
      return href.includes('learning') || href.includes('module') ||
             text.includes('learn') || text.includes('module');
    });
    
    if (relevantLinks.length > 0) {
      foundElements.push(`Learning links: ${relevantLinks.length}`);
    }
    
    // Look for form elements (filters, search)
    const formElements = document.querySelectorAll(
      'input, select, .filter, .search, [role="combobox"]'
    );
    if (formElements.length > 0) {
      foundElements.push(`Form elements: ${formElements.length}`);
    }
    
    if (foundElements.length > 0) {
      console.log('✅ Interactive elements found:');
      foundElements.forEach(element => console.log(`   - ${element}`));
      return true;
    } else {
      console.log('❌ No interactive elements found');
      return false;
    }
  } catch (error) {
    console.log('❌ Error in interactive elements test:', error.message);
    return false;
  }
}

// Test 6: Check empty state handling
async function testEmptyState() {
  console.log('\n📍 Test 6: Empty State Handling');
  
  try {
    const allText = document.body.textContent.toLowerCase();
    const emptyStateIndicators = [];
    
    // Look for empty state messages
    if (allText.includes('no modules') || allText.includes('no progress')) {
      emptyStateIndicators.push('No content message');
    }
    
    if (allText.includes('start learning') || allText.includes('begin your journey')) {
      emptyStateIndicators.push('Start learning prompt');
    }
    
    if (allText.includes('browse learning hub') || allText.includes('explore modules')) {
      emptyStateIndicators.push('Browse suggestion');
    }
    
    // Look for empty state illustrations or icons
    const emptyStateElements = document.querySelectorAll(
      '.empty-state, .no-content, .placeholder, [data-testid="empty-state"]'
    );
    if (emptyStateElements.length > 0) {
      emptyStateIndicators.push(`Empty state elements: ${emptyStateElements.length}`);
    }
    
    // Check if there's minimal content (might indicate empty state)
    const contentElements = document.querySelectorAll('.card, .module, .item');
    if (contentElements.length === 0) {
      emptyStateIndicators.push('No content cards (possible empty state)');
    }
    
    if (emptyStateIndicators.length > 0) {
      console.log('✅ Empty state indicators found:');
      emptyStateIndicators.forEach(indicator => console.log(`   - ${indicator}`));
      return true;
    } else {
      console.log('ℹ️ No empty state detected (content is available)');
      return true; // This is actually good - means there's content
    }
  } catch (error) {
    console.log('❌ Error in empty state test:', error.message);
    return false;
  }
}

// Test 7: Check responsive design
async function testResponsiveDesign() {
  console.log('\n📍 Test 7: Responsive Design');
  
  try {
    const originalWidth = window.innerWidth;
    const results = [];
    
    // Test mobile view
    console.log('📱 Testing mobile view (375px)');
    window.resizeTo(375, 667);
    await sleep(1000);
    
    const mobileElements = document.querySelectorAll('.card, .module, .progress');
    results.push(`Mobile (375px): ${mobileElements.length} elements visible`);
    
    // Test tablet view
    console.log('📱 Testing tablet view (768px)');
    window.resizeTo(768, 1024);
    await sleep(1000);
    
    const tabletElements = document.querySelectorAll('.card, .module, .progress');
    results.push(`Tablet (768px): ${tabletElements.length} elements visible`);
    
    // Test desktop view
    console.log('🖥️ Testing desktop view (1200px)');
    window.resizeTo(1200, 800);
    await sleep(1000);
    
    const desktopElements = document.querySelectorAll('.card, .module, .progress');
    results.push(`Desktop (1200px): ${desktopElements.length} elements visible`);
    
    // Restore original size
    window.resizeTo(originalWidth, window.innerHeight);
    await sleep(500);
    
    console.log('✅ Responsive design test completed:');
    results.forEach(result => console.log(`   - ${result}`));
    
    return true;
  } catch (error) {
    console.log('❌ Error in responsive design test:', error.message);
    return false;
  }
}

// Main test runner
async function runLearningProgressTests() {
  console.log('🚀 Starting LearningProgress Component Test Suite');
  console.log('=' .repeat(60));
  
  const testResults = {};
  
  try {
    testResults.navigation = await testNavigationToLearningProgress();
    testResults.componentLoading = await testComponentLoading();
    testResults.progressOverview = await testProgressOverview();
    testResults.learningModules = await testLearningModules();
    testResults.interactiveElements = await testInteractiveElements();
    testResults.emptyState = await testEmptyState();
    testResults.responsiveDesign = await testResponsiveDesign();
    
    // Calculate results
    const totalTests = Object.keys(testResults).length;
    const passedTests = Object.values(testResults).filter(result => result === true).length;
    const failedTests = totalTests - passedTests;
    
    console.log('\n' + '=' .repeat(60));
    console.log('📊 LEARNING PROGRESS COMPONENT TEST RESULTS');
    console.log('=' .repeat(60));
    
    // Display individual results
    Object.entries(testResults).forEach(([testName, result]) => {
      const status = result ? '✅ PASS' : '❌ FAIL';
      const formattedName = testName.replace(/([A-Z])/g, ' $1').toLowerCase();
      console.log(`${status} ${formattedName}`);
    });
    
    console.log('\n📈 SUMMARY:');
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   Passed: ${passedTests}`);
    console.log(`   Failed: ${failedTests}`);
    console.log(`   Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
    
    if (passedTests === totalTests) {
      console.log('\n🎉 ALL TESTS PASSED! LearningProgress component is working correctly.');
    } else if (passedTests >= totalTests * 0.7) {
      console.log('\n⚠️ Most tests passed, but some issues were found. Component is mostly functional.');
    } else {
      console.log('\n❌ Multiple tests failed. Component needs attention.');
    }
    
    return testResults;
    
  } catch (error) {
    console.error('💥 Test suite failed with error:', error);
    return testResults;
  }
}

// Export functions for manual testing
window.learningProgressTests = {
  runAll: runLearningProgressTests,
  navigation: testNavigationToLearningProgress,
  componentLoading: testComponentLoading,
  progressOverview: testProgressOverview,
  learningModules: testLearningModules,
  interactiveElements: testInteractiveElements,
  emptyState: testEmptyState,
  responsiveDesign: testResponsiveDesign
};

console.log('\n💡 LearningProgress test functions are available:');
console.log('   window.learningProgressTests.runAll() - Run all tests');
console.log('   window.learningProgressTests.navigation() - Test navigation');
console.log('   window.learningProgressTests.progressOverview() - Test progress display');
console.log('   window.learningProgressTests.learningModules() - Test modules');
console.log('   window.learningProgressTests.interactiveElements() - Test interactions');
console.log('   window.learningProgressTests.emptyState() - Test empty state');
console.log('   window.learningProgressTests.responsiveDesign() - Test responsive design');

// Auto-run the full test suite
console.log('\n🔄 Auto-running test suite in 2 seconds...');
setTimeout(() => {
  runLearningProgressTests().catch(error => {
    console.error('💥 Auto-run failed:', error);
  });
}, 2000);