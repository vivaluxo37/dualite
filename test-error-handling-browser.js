// Dashboard Error Handling Test Suite
// Run this in browser console on http://localhost:5173/dashboard

console.log('🚨 Dashboard Error Handling Test Suite');
console.log('=' .repeat(50));

// Helper functions
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function simulateNetworkError() {
  // Override fetch to simulate network errors
  const originalFetch = window.fetch;
  let errorCount = 0;
  
  window.fetch = function(...args) {
    errorCount++;
    if (errorCount % 3 === 0) {
      return Promise.reject(new Error('Simulated network error'));
    }
    return originalFetch.apply(this, args);
  };
  
  console.log('🌐 Network error simulation enabled (every 3rd request fails)');
  
  return () => {
    window.fetch = originalFetch;
    console.log('🌐 Network error simulation disabled');
  };
}

function simulateSlowNetwork(delay = 3000) {
  const originalFetch = window.fetch;
  
  window.fetch = function(...args) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(originalFetch.apply(this, args));
      }, delay);
    });
  };
  
  console.log(`🐌 Slow network simulation enabled (${delay}ms delay)`);
  
  return () => {
    window.fetch = originalFetch;
    console.log('🐌 Slow network simulation disabled');
  };
}

function checkErrorBoundaries() {
  const errorBoundaries = document.querySelectorAll('[data-error-boundary], .error-boundary');
  const errorMessages = document.querySelectorAll('.error-message, .error-state, [role="alert"]');
  
  return {
    errorBoundaries: errorBoundaries.length,
    errorMessages: errorMessages.length,
    hasErrorHandling: errorBoundaries.length > 0 || errorMessages.length > 0
  };
}

function checkLoadingStates() {
  const loadingElements = document.querySelectorAll(
    '.loading, .spinner, .skeleton, [aria-busy="true"], .animate-pulse'
  );
  
  const loadingIndicators = Array.from(loadingElements).map(element => {
    const rect = element.getBoundingClientRect();
    return {
      type: element.className.includes('skeleton') ? 'skeleton' : 
            element.className.includes('spinner') ? 'spinner' : 'loading',
      visible: rect.width > 0 && rect.height > 0,
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    };
  });
  
  return {
    count: loadingElements.length,
    indicators: loadingIndicators,
    hasLoadingStates: loadingElements.length > 0
  };
}

function checkEmptyStates() {
  const emptyStateElements = document.querySelectorAll(
    '.empty-state, .no-data, .no-results, [data-empty="true"]'
  );
  
  const emptyStateTexts = [
    'No data available',
    'No results found',
    'No saved brokers',
    'No match history',
    'No progress',
    'Empty',
    'Nothing to show',
    'No items',
    'Start by',
    'Get started'
  ];
  
  const textElements = document.querySelectorAll('p, div, span, h1, h2, h3, h4, h5, h6');
  const emptyTextFound = Array.from(textElements).some(element => {
    const text = element.textContent?.toLowerCase() || '';
    return emptyStateTexts.some(emptyText => text.includes(emptyText.toLowerCase()));
  });
  
  return {
    emptyStateElements: emptyStateElements.length,
    hasEmptyStateText: emptyTextFound,
    hasEmptyStates: emptyStateElements.length > 0 || emptyTextFound
  };
}

function triggerJavaScriptError() {
  try {
    // Intentionally trigger an error
    window.nonExistentFunction();
  } catch (error) {
    console.log('✅ JavaScript error triggered:', error.message);
    return error;
  }
}

function testConsoleErrors() {
  const originalError = console.error;
  const errors = [];
  
  console.error = function(...args) {
    errors.push(args.join(' '));
    originalError.apply(console, args);
  };
  
  setTimeout(() => {
    console.error = originalError;
    console.log(`📊 Console errors captured: ${errors.length}`);
    if (errors.length > 0) {
      console.log('Recent errors:');
      errors.slice(-3).forEach(error => console.log(`   - ${error}`));
    }
  }, 5000);
  
  return errors;
}

function checkAuthenticationState() {
  // Check for authentication indicators
  const loginButtons = document.querySelectorAll('[data-testid="login"], .login-button, button:contains("Login"), button:contains("Sign In")');
  const userMenus = document.querySelectorAll('[data-testid="user-menu"], .user-menu, .profile-menu');
  const protectedContent = document.querySelectorAll('[data-protected="true"], .protected-route');
  
  return {
    loginButtons: loginButtons.length,
    userMenus: userMenus.length,
    protectedContent: protectedContent.length,
    isAuthenticated: userMenus.length > 0 && loginButtons.length === 0
  };
}

function simulateAuthError() {
  // Try to clear authentication tokens
  try {
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('supabase.auth.token');
    
    // Clear all supabase related storage
    Object.keys(localStorage).forEach(key => {
      if (key.includes('supabase')) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('🔐 Authentication tokens cleared');
    return true;
  } catch (error) {
    console.log('❌ Failed to clear auth tokens:', error);
    return false;
  }
}

// Test individual error scenarios
async function testNetworkErrorHandling() {
  console.log('\n🌐 Testing Network Error Handling...');
  
  const restoreNetwork = simulateNetworkError();
  
  // Try to trigger some network requests
  const tabs = document.querySelectorAll('[role="tab"], .tab-button, [data-testid*="tab"]');
  if (tabs.length > 0) {
    for (let i = 0; i < Math.min(tabs.length, 3); i++) {
      console.log(`   Clicking tab ${i + 1} with network errors...`);
      tabs[i].click();
      await sleep(2000);
      
      const errorCheck = checkErrorBoundaries();
      console.log(`   Error handling: ${errorCheck.hasErrorHandling ? '✅' : '❌'}`);
    }
  }
  
  // Test refresh button if available
  const refreshButtons = document.querySelectorAll('[data-testid="refresh"], .refresh-button, button[title*="refresh"], button[title*="Refresh"]');
  if (refreshButtons.length > 0) {
    console.log('   Testing refresh with network errors...');
    refreshButtons[0].click();
    await sleep(2000);
  }
  
  restoreNetwork();
  await sleep(1000);
  
  console.log('✅ Network error handling test completed');
}

async function testLoadingStates() {
  console.log('\n⏳ Testing Loading States...');
  
  const restoreNetwork = simulateSlowNetwork(2000);
  
  // Check initial loading states
  let loadingCheck = checkLoadingStates();
  console.log(`   Initial loading indicators: ${loadingCheck.count}`);
  
  // Trigger tab changes to see loading states
  const tabs = document.querySelectorAll('[role="tab"], .tab-button, [data-testid*="tab"]');
  if (tabs.length > 0) {
    for (let i = 0; i < Math.min(tabs.length, 2); i++) {
      console.log(`   Testing loading state for tab ${i + 1}...`);
      tabs[i].click();
      
      // Check for loading indicators immediately after click
      await sleep(500);
      loadingCheck = checkLoadingStates();
      console.log(`   Loading indicators during transition: ${loadingCheck.count}`);
      console.log(`   Loading types: ${loadingCheck.indicators.map(i => i.type).join(', ')}`);
      
      await sleep(2500); // Wait for slow network
    }
  }
  
  // Test search loading if available
  const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]');
  if (searchInputs.length > 0) {
    console.log('   Testing search loading states...');
    const searchInput = searchInputs[0];
    searchInput.value = 'test search';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    await sleep(500);
    loadingCheck = checkLoadingStates();
    console.log(`   Search loading indicators: ${loadingCheck.count}`);
    
    await sleep(2000);
  }
  
  restoreNetwork();
  
  // Final check
  await sleep(1000);
  loadingCheck = checkLoadingStates();
  console.log(`   Final loading indicators: ${loadingCheck.count}`);
  console.log(`✅ Loading states test completed`);
}

async function testEmptyStates() {
  console.log('\n📭 Testing Empty States...');
  
  const emptyCheck = checkEmptyStates();
  console.log(`   Empty state elements found: ${emptyCheck.emptyStateElements}`);
  console.log(`   Empty state text found: ${emptyCheck.hasEmptyStateText ? '✅' : '❌'}`);
  console.log(`   Overall empty state handling: ${emptyCheck.hasEmptyStates ? '✅' : '❌'}`);
  
  // Test search for non-existent items
  const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]');
  if (searchInputs.length > 0) {
    console.log('   Testing search empty states...');
    const searchInput = searchInputs[0];
    
    // Search for something that definitely won't exist
    searchInput.value = 'xyznothingfound123';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    searchInput.dispatchEvent(new Event('change', { bubbles: true }));
    
    await sleep(1500);
    
    const postSearchEmpty = checkEmptyStates();
    console.log(`   Empty state after search: ${postSearchEmpty.hasEmptyStates ? '✅' : '❌'}`);
    
    // Clear search
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await sleep(500);
  }
  
  // Test filter empty states
  const filterButtons = document.querySelectorAll('[data-testid*="filter"], .filter-button, button[title*="filter"], button[title*="Filter"]');
  if (filterButtons.length > 0) {
    console.log('   Testing filter empty states...');
    filterButtons[0].click();
    await sleep(1000);
    
    const filterEmptyCheck = checkEmptyStates();
    console.log(`   Empty state after filtering: ${filterEmptyCheck.hasEmptyStates ? '✅' : '❌'}`);
  }
  
  console.log('✅ Empty states test completed');
}

async function testErrorBoundaries() {
  console.log('\n🛡️ Testing Error Boundaries...');
  
  const initialErrorCheck = checkErrorBoundaries();
  console.log(`   Initial error boundaries: ${initialErrorCheck.errorBoundaries}`);
  console.log(`   Initial error messages: ${initialErrorCheck.errorMessages}`);
  
  // Capture console errors
  const errors = testConsoleErrors();
  
  // Try to trigger a JavaScript error
  try {
    triggerJavaScriptError();
  } catch (e) {
    console.log('   JavaScript error triggered successfully');
  }
  
  // Try to access non-existent DOM elements
  try {
    document.querySelector('#non-existent-element').click();
  } catch (e) {
    console.log('   DOM error triggered successfully');
  }
  
  await sleep(2000);
  
  const finalErrorCheck = checkErrorBoundaries();
  console.log(`   Final error boundaries: ${finalErrorCheck.errorBoundaries}`);
  console.log(`   Final error messages: ${finalErrorCheck.errorMessages}`);
  console.log(`   Error boundary handling: ${finalErrorCheck.hasErrorHandling ? '✅' : '❌'}`);
  
  console.log('✅ Error boundaries test completed');
}

async function testAuthenticationErrors() {
  console.log('\n🔐 Testing Authentication Error Handling...');
  
  const initialAuthState = checkAuthenticationState();
  console.log(`   Initial auth state - Authenticated: ${initialAuthState.isAuthenticated ? '✅' : '❌'}`);
  console.log(`   Login buttons: ${initialAuthState.loginButtons}`);
  console.log(`   User menus: ${initialAuthState.userMenus}`);
  
  if (initialAuthState.isAuthenticated) {
    console.log('   Simulating auth token expiration...');
    const authCleared = simulateAuthError();
    
    if (authCleared) {
      // Try to access protected content
      const protectedTabs = document.querySelectorAll('[role="tab"], .tab-button');
      if (protectedTabs.length > 0) {
        console.log('   Accessing protected content without auth...');
        protectedTabs[0].click();
        await sleep(2000);
        
        const authErrorCheck = checkErrorBoundaries();
        console.log(`   Auth error handling: ${authErrorCheck.hasErrorHandling ? '✅' : '❌'}`);
      }
      
      // Check if redirected to login
      const newAuthState = checkAuthenticationState();
      console.log(`   Redirected to login: ${newAuthState.loginButtons > 0 ? '✅' : '❌'}`);
    }
  } else {
    console.log('   User not authenticated - testing guest access...');
    
    // Try to access dashboard features
    const tabs = document.querySelectorAll('[role="tab"], .tab-button');
    if (tabs.length > 0) {
      tabs[0].click();
      await sleep(1000);
      
      const guestAccessCheck = checkErrorBoundaries();
      console.log(`   Guest access handling: ${guestAccessCheck.hasErrorHandling ? '✅' : '❌'}`);
    }
  }
  
  console.log('✅ Authentication error handling test completed');
}

async function testPerformanceUnderErrors() {
  console.log('\n⚡ Testing Performance Under Error Conditions...');
  
  const startTime = performance.now();
  
  // Simulate multiple error conditions simultaneously
  const restoreNetwork = simulateSlowNetwork(1000);
  const restoreErrors = simulateNetworkError();
  
  // Rapid tab switching under error conditions
  const tabs = document.querySelectorAll('[role="tab"], .tab-button');
  if (tabs.length > 1) {
    console.log('   Rapid tab switching under error conditions...');
    
    for (let i = 0; i < 5; i++) {
      const tabIndex = i % tabs.length;
      tabs[tabIndex].click();
      await sleep(200); // Rapid switching
    }
    
    await sleep(2000); // Let things settle
  }
  
  // Rapid search operations
  const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="search"]');
  if (searchInputs.length > 0) {
    console.log('   Rapid search operations under error conditions...');
    const searchInput = searchInputs[0];
    
    const searchTerms = ['test', 'broker', 'forex', 'trading', 'analysis'];
    for (const term of searchTerms) {
      searchInput.value = term;
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      await sleep(300);
    }
  }
  
  restoreNetwork();
  restoreErrors();
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  console.log(`   Performance test duration: ${duration.toFixed(1)}ms`);
  console.log(`   Performance under errors: ${duration < 10000 ? '✅ Good' : '⚠️ Slow'}`);
  
  // Check if app is still responsive
  const finalCheck = checkLoadingStates();
  console.log(`   App still responsive: ${finalCheck.count < 10 ? '✅' : '⚠️ Many loading states'}`);
  
  console.log('✅ Performance under errors test completed');
}

// Comprehensive error handling test
async function runErrorHandlingTests() {
  console.log('🚀 Starting Comprehensive Error Handling Test Suite');
  console.log('=' .repeat(60));
  
  const startTime = Date.now();
  
  try {
    // Run all error handling tests
    await testNetworkErrorHandling();
    await testLoadingStates();
    await testEmptyStates();
    await testErrorBoundaries();
    await testAuthenticationErrors();
    await testPerformanceUnderErrors();
    
    const duration = Date.now() - startTime;
    
    // Generate final report
    console.log('\n' + '=' .repeat(60));
    console.log('📊 ERROR HANDLING TEST RESULTS');
    console.log('=' .repeat(60));
    
    const finalLoadingCheck = checkLoadingStates();
    const finalEmptyCheck = checkEmptyStates();
    const finalErrorCheck = checkErrorBoundaries();
    const finalAuthCheck = checkAuthenticationState();
    
    console.log('\n📈 FINAL ASSESSMENT:');
    console.log(`   Loading States: ${finalLoadingCheck.hasLoadingStates ? '✅ Implemented' : '❌ Missing'}`);
    console.log(`   Empty States: ${finalEmptyCheck.hasEmptyStates ? '✅ Implemented' : '❌ Missing'}`);
    console.log(`   Error Boundaries: ${finalErrorCheck.hasErrorHandling ? '✅ Implemented' : '❌ Missing'}`);
    console.log(`   Authentication: ${finalAuthCheck.isAuthenticated ? '✅ Authenticated' : '⚠️ Guest Mode'}`);
    console.log(`   Test Duration: ${(duration / 1000).toFixed(1)}s`);
    
    const totalFeatures = 3;
    const implementedFeatures = [
      finalLoadingCheck.hasLoadingStates,
      finalEmptyCheck.hasEmptyStates,
      finalErrorCheck.hasErrorHandling
    ].filter(Boolean).length;
    
    const score = Math.round((implementedFeatures / totalFeatures) * 100);
    console.log(`   Overall Score: ${score}%`);
    
    if (score >= 80) {
      console.log('\n🎉 EXCELLENT! Dashboard has robust error handling.');
    } else if (score >= 60) {
      console.log('\n✅ GOOD! Dashboard has basic error handling with room for improvement.');
    } else {
      console.log('\n⚠️ NEEDS IMPROVEMENT! Dashboard error handling should be enhanced.');
    }
    
    console.log('\n💡 RECOMMENDATIONS:');
    if (!finalLoadingCheck.hasLoadingStates) {
      console.log('   - Add loading indicators for better user feedback');
    }
    if (!finalEmptyCheck.hasEmptyStates) {
      console.log('   - Implement empty state messages and call-to-actions');
    }
    if (!finalErrorCheck.hasErrorHandling) {
      console.log('   - Add error boundaries and error message displays');
    }
    
    console.log('\n🔧 DETAILED FINDINGS:');
    console.log(`   Loading indicators found: ${finalLoadingCheck.count}`);
    console.log(`   Error boundaries found: ${finalErrorCheck.errorBoundaries}`);
    console.log(`   Error messages found: ${finalErrorCheck.errorMessages}`);
    console.log(`   Empty state elements: ${finalEmptyCheck.emptyStateElements}`);
    
  } catch (error) {
    console.error('💥 Error handling test suite failed:', error);
  }
}

// Quick error check
function quickErrorCheck() {
  console.log('⚡ Quick Error Handling Check');
  console.log('=' .repeat(40));
  
  const loadingCheck = checkLoadingStates();
  const emptyCheck = checkEmptyStates();
  const errorCheck = checkErrorBoundaries();
  const authCheck = checkAuthenticationState();
  
  console.log(`Loading indicators: ${loadingCheck.count} found`);
  console.log(`Empty state handling: ${emptyCheck.hasEmptyStates ? '✅' : '❌'}`);
  console.log(`Error boundaries: ${errorCheck.hasErrorHandling ? '✅' : '❌'}`);
  console.log(`Authentication: ${authCheck.isAuthenticated ? '✅ Logged in' : '⚠️ Guest mode'}`);
  
  const features = [loadingCheck.hasLoadingStates, emptyCheck.hasEmptyStates, errorCheck.hasErrorHandling];
  const score = Math.round((features.filter(Boolean).length / features.length) * 100);
  console.log(`Quick score: ${score}%`);
  
  if (loadingCheck.indicators.length > 0) {
    console.log('Loading indicator types:', loadingCheck.indicators.map(i => `${i.type} (${i.width}x${i.height})`).join(', '));
  }
  
  return { loadingCheck, emptyCheck, errorCheck, authCheck, score };
}

// Export test functions
window.errorHandlingTests = {
  runAll: runErrorHandlingTests,
  quickCheck: quickErrorCheck,
  testNetwork: testNetworkErrorHandling,
  testLoading: testLoadingStates,
  testEmpty: testEmptyStates,
  testBoundaries: testErrorBoundaries,
  testAuth: testAuthenticationErrors,
  testPerformance: testPerformanceUnderErrors,
  simulateNetworkError: simulateNetworkError,
  simulateSlowNetwork: simulateSlowNetwork,
  simulateAuthError: simulateAuthError
};

console.log('\n💡 Available error handling test commands:');
console.log('   errorHandlingTests.runAll() - Run complete error handling test suite');
console.log('   errorHandlingTests.quickCheck() - Quick error handling assessment');
console.log('   errorHandlingTests.testNetwork() - Test network error scenarios');
console.log('   errorHandlingTests.testLoading() - Test loading states');
console.log('   errorHandlingTests.testEmpty() - Test empty states');
console.log('   errorHandlingTests.testAuth() - Test authentication errors');
console.log('   errorHandlingTests.testPerformance() - Test performance under errors');

// Auto-run quick check
console.log('\n🔄 Running quick error handling check...');
setTimeout(() => {
  quickErrorCheck();
}, 1000);