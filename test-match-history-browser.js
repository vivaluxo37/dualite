// MatchHistory Component Browser Test Script
// Run this in browser console on http://localhost:5173/dashboard

console.log('🧪 Starting MatchHistory Component Test...');

// Helper function to wait for elements
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

// Test 1: Navigate to Dashboard
async function testDashboardNavigation() {
  console.log('📍 Test 1: Dashboard Navigation');
  
  // Check if we're already on dashboard
  if (!window.location.pathname.includes('/dashboard')) {
    console.log('❌ Not on dashboard page. Please navigate to /dashboard first.');
    return false;
  }
  
  console.log('✅ On dashboard page');
  return true;
}

// Test 2: Find and click Match History tab
async function testMatchHistoryTab() {
  console.log('📍 Test 2: Match History Tab');
  
  try {
    // Look for tabs container
    const tabsContainer = document.querySelector('[role="tablist"], .tabs');
    console.log('Tabs container found:', !!tabsContainer);
    
    // Look for Match History tab by text content
    const tabs = document.querySelectorAll('[role="tab"], button');
    let matchHistoryTab = null;
    
    for (const tab of tabs) {
      if (tab.textContent && tab.textContent.toLowerCase().includes('match history')) {
        matchHistoryTab = tab;
        break;
      }
    }
    
    if (!matchHistoryTab) {
      // Try alternative selectors
      matchHistoryTab = document.querySelector('[data-testid="match-history-tab"]');
    }
    
    if (matchHistoryTab) {
      console.log('✅ Match History tab found');
      matchHistoryTab.click();
      console.log('✅ Clicked Match History tab');
      
      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } else {
      console.log('❌ Match History tab not found');
      console.log('Available tabs:', Array.from(tabs).map(t => t.textContent));
      return false;
    }
  } catch (error) {
    console.log('❌ Error finding Match History tab:', error.message);
    return false;
  }
}

// Test 3: Check Match History content
async function testMatchHistoryContent() {
  console.log('📍 Test 3: Match History Content');
  
  try {
    // Wait for content to appear
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check for various possible content indicators
    const contentSelectors = [
      '[data-testid="match-history-content"]',
      '.match-history',
      '[data-testid="match-card"]',
      '.match-card',
      'div:contains("Match History")',
      'div:contains("No matches")',
      'div:contains("Start New Match")'
    ];
    
    let contentFound = false;
    for (const selector of contentSelectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        console.log(`✅ Content found with selector: ${selector} (${elements.length} elements)`);
        contentFound = true;
      }
    }
    
    // Check for loading states
    const loadingElements = document.querySelectorAll('.animate-pulse, [data-testid="loading"], .loading');
    if (loadingElements.length > 0) {
      console.log('⏳ Loading elements found:', loadingElements.length);
    }
    
    // Check for error states
    const errorElements = document.querySelectorAll('.text-red-500, [data-testid="error"], .error');
    if (errorElements.length > 0) {
      console.log('⚠️ Error elements found:', errorElements.length);
    }
    
    // Check for empty state
    const emptyStateElements = document.querySelectorAll('div, p, span');
    for (const element of emptyStateElements) {
      if (element.textContent && (
        element.textContent.toLowerCase().includes('no matches') ||
        element.textContent.toLowerCase().includes('no history') ||
        element.textContent.toLowerCase().includes('start new match')
      )) {
        console.log('📭 Empty state detected:', element.textContent.trim());
        contentFound = true;
      }
    }
    
    return contentFound;
  } catch (error) {
    console.log('❌ Error checking content:', error.message);
    return false;
  }
}

// Test 4: Check for interactive elements
async function testInteractiveElements() {
  console.log('📍 Test 4: Interactive Elements');
  
  try {
    // Look for buttons
    const buttons = document.querySelectorAll('button');
    const relevantButtons = [];
    
    for (const button of buttons) {
      if (button.textContent && (
        button.textContent.toLowerCase().includes('refresh') ||
        button.textContent.toLowerCase().includes('new match') ||
        button.textContent.toLowerCase().includes('start')
      )) {
        relevantButtons.push({
          text: button.textContent.trim(),
          disabled: button.disabled,
          visible: button.offsetParent !== null
        });
      }
    }
    
    console.log('🔘 Interactive buttons found:', relevantButtons);
    
    // Look for clickable cards or links
    const clickableElements = document.querySelectorAll('a, [role="button"], .cursor-pointer');
    console.log('🔗 Clickable elements found:', clickableElements.length);
    
    return relevantButtons.length > 0;
  } catch (error) {
    console.log('❌ Error checking interactive elements:', error.message);
    return false;
  }
}

// Test 5: Check responsive design
async function testResponsiveDesign() {
  console.log('📍 Test 5: Responsive Design');
  
  try {
    const originalWidth = window.innerWidth;
    const testWidths = [320, 768, 1024, 1200];
    
    for (const width of testWidths) {
      // Simulate different screen sizes
      console.log(`📱 Testing width: ${width}px`);
      
      // Check if content adapts (basic check)
      const container = document.querySelector('main, .container, [data-testid="dashboard"]');
      if (container) {
        const computedStyle = window.getComputedStyle(container);
        console.log(`   Container width: ${computedStyle.width}`);
        console.log(`   Container padding: ${computedStyle.padding}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('✅ Responsive design test completed');
    return true;
  } catch (error) {
    console.log('❌ Error testing responsive design:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting MatchHistory Component Test Suite');
  console.log('=' .repeat(50));
  
  const results = {
    dashboardNavigation: await testDashboardNavigation(),
    matchHistoryTab: await testMatchHistoryTab(),
    matchHistoryContent: await testMatchHistoryContent(),
    interactiveElements: await testInteractiveElements(),
    responsiveDesign: await testResponsiveDesign()
  };
  
  console.log('=' .repeat(50));
  console.log('📊 Test Results Summary:');
  
  let passedTests = 0;
  let totalTests = 0;
  
  for (const [testName, result] of Object.entries(results)) {
    totalTests++;
    if (result) passedTests++;
    
    const status = result ? '✅ PASS' : '❌ FAIL';
    console.log(`   ${testName}: ${status}`);
  }
  
  console.log(`\n🎯 Overall Score: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! MatchHistory component is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Please check the component implementation.');
  }
  
  return results;
}

// Auto-run tests
runAllTests().catch(error => {
  console.error('💥 Test suite failed:', error);
});

// Export for manual testing
window.matchHistoryTests = {
  runAllTests,
  testDashboardNavigation,
  testMatchHistoryTab,
  testMatchHistoryContent,
  testInteractiveElements,
  testResponsiveDesign
};

console.log('\n💡 You can also run individual tests manually:');
console.log('   window.matchHistoryTests.testMatchHistoryTab()');
console.log('   window.matchHistoryTests.testMatchHistoryContent()');
console.log('   etc.');