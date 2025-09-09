// Dashboard User Authentication Browser Test Suite
// Run this script in the browser console at http://localhost:5173/dashboard

console.log('🔐 Dashboard Authentication Test Suite');
console.log('=' .repeat(50));

// Configuration
const TEST_CONFIG = {
  dashboardUrl: 'http://localhost:5173/dashboard',
  loginUrl: 'http://localhost:5173/login',
  testTimeout: 5000,
  retryAttempts: 3,
  waitBetweenTests: 1000
};

// Helper Functions
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    function check() {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
      } else if (Date.now() - startTime > timeout) {
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      } else {
        setTimeout(check, 100);
      }
    }
    
    check();
  });
}

function getAuthenticationState() {
  // Check for various authentication indicators
  const indicators = {
    loginButtons: document.querySelectorAll(
      '[data-testid="login"], .login-button, button[title*="Login"], button[title*="Sign In"], a[href*="login"]'
    ).length,
    
    userMenus: document.querySelectorAll(
      '[data-testid="user-menu"], .user-menu, .profile-menu, .avatar-menu, [data-testid="user-avatar"]'
    ).length,
    
    userInfo: document.querySelectorAll(
      '[data-testid="user-info"], .user-name, .user-email, .profile-info'
    ).length,
    
    logoutButtons: document.querySelectorAll(
      '[data-testid="logout"], .logout-button, button[title*="Logout"], button[title*="Sign Out"]'
    ).length,
    
    protectedContent: document.querySelectorAll(
      '[data-protected="true"], .protected-route, .auth-required'
    ).length
  };
  
  // Check localStorage for auth tokens
  const authTokenKeys = Object.keys(localStorage).filter(key => 
    key.includes('supabase') || key.includes('auth') || key.includes('token')
  );
  
  const hasAuthTokens = authTokenKeys.length > 0;
  
  // Determine authentication status
  const isAuthenticated = indicators.userMenus > 0 || indicators.userInfo > 0 || indicators.logoutButtons > 0;
  const isGuest = indicators.loginButtons > 0 && !isAuthenticated;
  
  return {
    ...indicators,
    hasAuthTokens,
    authTokenKeys,
    isAuthenticated,
    isGuest,
    currentUrl: window.location.href,
    timestamp: new Date().toISOString()
  };
}

function getDashboardState() {
  const currentUrl = window.location.href;
  const isDashboard = currentUrl.includes('/dashboard');
  const isLoginPage = currentUrl.includes('/login') || currentUrl.includes('/auth');
  
  // Check for dashboard-specific elements
  const dashboardElements = {
    tabs: document.querySelectorAll('[role="tab"], .tab-button, [data-testid*="tab"]').length,
    content: document.querySelectorAll('.dashboard-content, [data-testid="dashboard"], .dashboard-main').length,
    navigation: document.querySelectorAll('.dashboard-nav, .sidebar, [data-testid="navigation"]').length,
    errors: document.querySelectorAll('.error-message, .access-denied, [role="alert"]').length,
    loading: document.querySelectorAll('.loading, .spinner, .skeleton, [aria-busy="true"]').length
  };
  
  const hasAccess = isDashboard && (dashboardElements.tabs > 0 || dashboardElements.content > 0);
  
  return {
    currentUrl,
    isDashboard,
    isLoginPage,
    ...dashboardElements,
    hasAccess,
    timestamp: new Date().toISOString()
  };
}

function getUserDataState() {
  // Check for user-specific data
  const dataElements = {
    savedBrokers: document.querySelectorAll('.broker-card, [data-testid*="broker"], .saved-broker').length,
    matchHistory: document.querySelectorAll('.match-result, [data-testid*="match"], .quiz-result, .history-item').length,
    learningProgress: document.querySelectorAll('.progress-item, [data-testid*="progress"], .module-progress, .learning-module').length,
    userProfile: document.querySelectorAll('.user-profile, .profile-info, [data-testid*="profile"]').length
  };
  
  const loadingElements = document.querySelectorAll(
    '.loading, .spinner, .skeleton, [aria-busy="true"], .animate-pulse'
  ).length;
  
  const errorElements = document.querySelectorAll(
    '.error-message, .error-state, [role="alert"], .error'
  ).length;
  
  const emptyStates = document.querySelectorAll(
    '.empty-state, .no-data, [data-testid*="empty"], .placeholder'
  ).length;
  
  const hasUserData = Object.values(dataElements).some(count => count > 0);
  
  return {
    ...dataElements,
    loadingElements,
    errorElements,
    emptyStates,
    hasUserData,
    timestamp: new Date().toISOString()
  };
}

function clearAuthTokens() {
  try {
    // Clear all authentication-related storage
    Object.keys(localStorage).forEach(key => {
      if (key.includes('supabase') || key.includes('auth') || key.includes('token')) {
        localStorage.removeItem(key);
      }
    });
    
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes('supabase') || key.includes('auth') || key.includes('token')) {
        sessionStorage.removeItem(key);
      }
    });
    
    // Clear cookies if any
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    return true;
  } catch (error) {
    console.error('Failed to clear auth tokens:', error);
    return false;
  }
}

function expireAuthTokens() {
  try {
    // Modify auth tokens to make them invalid
    Object.keys(localStorage).forEach(key => {
      if (key.includes('supabase') && key.includes('auth')) {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            const parsed = JSON.parse(value);
            if (parsed.expires_at) {
              parsed.expires_at = Math.floor(Date.now() / 1000) - 3600; // Expired 1 hour ago
            }
            if (parsed.access_token) {
              parsed.access_token = 'expired_' + parsed.access_token;
            }
            if (parsed.refresh_token) {
              parsed.refresh_token = 'expired_' + parsed.refresh_token;
            }
            localStorage.setItem(key, JSON.stringify(parsed));
          } catch (e) {
            // If not JSON, just modify the value
            localStorage.setItem(key, 'expired_' + value);
          }
        }
      }
    });
    
    return true;
  } catch (error) {
    console.error('Failed to expire auth tokens:', error);
    return false;
  }
}

function navigateToDashboard() {
  if (!window.location.href.includes('/dashboard')) {
    window.location.href = TEST_CONFIG.dashboardUrl;
    return new Promise(resolve => {
      setTimeout(resolve, 2000); // Wait for navigation
    });
  }
  return Promise.resolve();
}

function clickElement(selector, description = '') {
  const element = document.querySelector(selector);
  if (element) {
    element.click();
    console.log(`   ✅ Clicked ${description || selector}`);
    return true;
  } else {
    console.log(`   ❌ Element not found: ${description || selector}`);
    return false;
  }
}

// Test Functions
async function testUnauthenticatedAccess() {
  console.log('\n🚫 Testing Unauthenticated Access');
  console.log('-'.repeat(40));
  
  const results = {
    testName: 'Unauthenticated Access',
    passed: 0,
    failed: 0,
    details: []
  };
  
  try {
    // Clear authentication
    console.log('   Clearing authentication tokens...');
    const cleared = clearAuthTokens();
    results.details.push({ step: 'Clear tokens', success: cleared });
    
    // Navigate to dashboard
    await navigateToDashboard();
    await sleep(2000);
    
    // Check authentication state
    const authState = getAuthenticationState();
    const dashboardState = getDashboardState();
    
    // Test 1: Should not be authenticated
    const notAuthenticated = !authState.isAuthenticated;
    results.details.push({ 
      step: 'Not authenticated', 
      success: notAuthenticated,
      actual: authState.isAuthenticated,
      expected: false
    });
    
    // Test 2: Should show login options
    const hasLoginOptions = authState.loginButtons > 0 || authState.isGuest;
    results.details.push({ 
      step: 'Login options visible', 
      success: hasLoginOptions,
      actual: authState.loginButtons,
      expected: '> 0'
    });
    
    // Test 3: Dashboard access should be restricted
    const accessRestricted = !dashboardState.hasAccess || dashboardState.isLoginPage;
    results.details.push({ 
      step: 'Dashboard access restricted', 
      success: accessRestricted,
      actual: dashboardState.hasAccess,
      expected: false
    });
    
    // Test 4: No user data should be visible
    const userData = getUserDataState();
    const noUserData = !userData.hasUserData;
    results.details.push({ 
      step: 'No user data visible', 
      success: noUserData,
      actual: userData.hasUserData,
      expected: false
    });
    
    // Test 5: Try clicking dashboard tabs (should fail or redirect)
    const tabs = document.querySelectorAll('[role="tab"], .tab-button');
    if (tabs.length > 0) {
      console.log('   Testing tab access without authentication...');
      tabs[0].click();
      await sleep(1000);
      
      const postClickState = getDashboardState();
      const tabAccessBlocked = !postClickState.hasAccess || postClickState.isLoginPage;
      results.details.push({ 
        step: 'Tab access blocked', 
        success: tabAccessBlocked,
        actual: postClickState.hasAccess,
        expected: false
      });
    }
    
    // Calculate results
    results.passed = results.details.filter(d => d.success).length;
    results.failed = results.details.filter(d => !d.success).length;
    
    console.log(`   ✅ Passed: ${results.passed}`);
    console.log(`   ❌ Failed: ${results.failed}`);
    
    return results;
    
  } catch (error) {
    console.error('   💥 Test failed with error:', error);
    results.error = error.message;
    return results;
  }
}

async function testAuthenticatedAccess() {
  console.log('\n✅ Testing Authenticated Access');
  console.log('-'.repeat(40));
  
  const results = {
    testName: 'Authenticated Access',
    passed: 0,
    failed: 0,
    details: []
  };
  
  try {
    const authState = getAuthenticationState();
    const dashboardState = getDashboardState();
    
    // Test 1: Should be authenticated
    const isAuthenticated = authState.isAuthenticated;
    results.details.push({ 
      step: 'User authenticated', 
      success: isAuthenticated,
      actual: authState.isAuthenticated,
      expected: true
    });
    
    if (!isAuthenticated) {
      console.log('   ⚠️ User not authenticated - skipping authenticated tests');
      results.skipped = true;
      return results;
    }
    
    // Test 2: Should have dashboard access
    const hasDashboardAccess = dashboardState.hasAccess;
    results.details.push({ 
      step: 'Dashboard accessible', 
      success: hasDashboardAccess,
      actual: dashboardState.hasAccess,
      expected: true
    });
    
    // Test 3: Should have user interface elements
    const hasUserInterface = authState.userMenus > 0 || authState.logoutButtons > 0;
    results.details.push({ 
      step: 'User interface visible', 
      success: hasUserInterface,
      actual: authState.userMenus + authState.logoutButtons,
      expected: '> 0'
    });
    
    // Test 4: Should have auth tokens
    const hasTokens = authState.hasAuthTokens;
    results.details.push({ 
      step: 'Auth tokens present', 
      success: hasTokens,
      actual: authState.authTokenKeys.length,
      expected: '> 0'
    });
    
    // Test 5: User data loading
    const userData = getUserDataState();
    const dataLoadingOk = userData.hasUserData || userData.emptyStates > 0 || userData.loadingElements > 0;
    results.details.push({ 
      step: 'User data loading', 
      success: dataLoadingOk,
      actual: `Data: ${userData.hasUserData}, Empty: ${userData.emptyStates}, Loading: ${userData.loadingElements}`,
      expected: 'At least one > 0'
    });
    
    // Test 6: Tab navigation
    const tabs = document.querySelectorAll('[role="tab"], .tab-button');
    if (tabs.length > 1) {
      console.log('   Testing authenticated tab navigation...');
      
      let tabTestsPassed = 0;
      const maxTabsToTest = Math.min(tabs.length, 3);
      
      for (let i = 0; i < maxTabsToTest; i++) {
        tabs[i].click();
        await sleep(1500);
        
        const tabDashboardState = getDashboardState();
        const tabUserData = getUserDataState();
        
        const tabWorking = tabDashboardState.hasAccess && (tabUserData.hasUserData || tabUserData.emptyStates > 0);
        if (tabWorking) tabTestsPassed++;
        
        console.log(`     Tab ${i + 1}: ${tabWorking ? '✅' : '❌'}`);
      }
      
      results.details.push({ 
        step: 'Tab navigation', 
        success: tabTestsPassed > 0,
        actual: `${tabTestsPassed}/${maxTabsToTest} tabs working`,
        expected: 'At least 1 working'
      });
    }
    
    // Calculate results
    results.passed = results.details.filter(d => d.success).length;
    results.failed = results.details.filter(d => !d.success).length;
    
    console.log(`   ✅ Passed: ${results.passed}`);
    console.log(`   ❌ Failed: ${results.failed}`);
    
    return results;
    
  } catch (error) {
    console.error('   💥 Test failed with error:', error);
    results.error = error.message;
    return results;
  }
}

async function testSessionExpiry() {
  console.log('\n⏰ Testing Session Expiry');
  console.log('-'.repeat(40));
  
  const results = {
    testName: 'Session Expiry',
    passed: 0,
    failed: 0,
    details: []
  };
  
  try {
    const initialAuthState = getAuthenticationState();
    
    if (!initialAuthState.isAuthenticated) {
      console.log('   ⚠️ User not authenticated - cannot test session expiry');
      results.skipped = true;
      return results;
    }
    
    // Test 1: Initial authentication
    results.details.push({ 
      step: 'Initially authenticated', 
      success: initialAuthState.isAuthenticated,
      actual: initialAuthState.isAuthenticated,
      expected: true
    });
    
    // Expire the session
    console.log('   Expiring authentication tokens...');
    const expired = expireAuthTokens();
    results.details.push({ 
      step: 'Tokens expired', 
      success: expired,
      actual: expired,
      expected: true
    });
    
    // Wait and trigger a request
    await sleep(1000);
    
    // Try to access protected content
    const tabs = document.querySelectorAll('[role="tab"], .tab-button');
    if (tabs.length > 0) {
      console.log('   Triggering request with expired tokens...');
      tabs[0].click();
      await sleep(3000); // Wait for potential redirect
      
      const postExpiryAuthState = getAuthenticationState();
      const postExpiryDashboardState = getDashboardState();
      
      // Test 2: Should handle expired session
      const sessionHandled = !postExpiryAuthState.isAuthenticated || postExpiryDashboardState.isLoginPage;
      results.details.push({ 
        step: 'Expired session handled', 
        success: sessionHandled,
        actual: `Auth: ${postExpiryAuthState.isAuthenticated}, Login page: ${postExpiryDashboardState.isLoginPage}`,
        expected: 'Auth: false OR Login page: true'
      });
      
      // Test 3: Dashboard access revoked
      const accessRevoked = !postExpiryDashboardState.hasAccess;
      results.details.push({ 
        step: 'Dashboard access revoked', 
        success: accessRevoked,
        actual: postExpiryDashboardState.hasAccess,
        expected: false
      });
    }
    
    // Calculate results
    results.passed = results.details.filter(d => d.success).length;
    results.failed = results.details.filter(d => !d.success).length;
    
    console.log(`   ✅ Passed: ${results.passed}`);
    console.log(`   ❌ Failed: ${results.failed}`);
    
    return results;
    
  } catch (error) {
    console.error('   💥 Test failed with error:', error);
    results.error = error.message;
    return results;
  }
}

async function testLogoutProcess() {
  console.log('\n🚪 Testing Logout Process');
  console.log('-'.repeat(40));
  
  const results = {
    testName: 'Logout Process',
    passed: 0,
    failed: 0,
    details: []
  };
  
  try {
    const initialAuthState = getAuthenticationState();
    
    if (!initialAuthState.isAuthenticated) {
      console.log('   ⚠️ User not authenticated - cannot test logout');
      results.skipped = true;
      return results;
    }
    
    // Test 1: Initial authentication
    results.details.push({ 
      step: 'Initially authenticated', 
      success: initialAuthState.isAuthenticated,
      actual: initialAuthState.isAuthenticated,
      expected: true
    });
    
    // Try to find logout button
    const logoutSelectors = [
      '[data-testid="logout"]',
      '.logout-button',
      'button[title*="Logout"]',
      'button[title*="Sign Out"]',
      'button:contains("Logout")',
      'button:contains("Sign Out")'
    ];
    
    let logoutButton = null;
    for (const selector of logoutSelectors) {
      logoutButton = document.querySelector(selector);
      if (logoutButton) break;
    }
    
    if (logoutButton) {
      console.log('   Found logout button, attempting logout...');
      logoutButton.click();
      await sleep(3000); // Wait for logout process
      
      const postLogoutAuthState = getAuthenticationState();
      const postLogoutDashboardState = getDashboardState();
      
      // Test 2: Should be logged out
      const isLoggedOut = !postLogoutAuthState.isAuthenticated;
      results.details.push({ 
        step: 'User logged out', 
        success: isLoggedOut,
        actual: postLogoutAuthState.isAuthenticated,
        expected: false
      });
      
      // Test 3: Tokens should be cleared
      const tokensCleared = !postLogoutAuthState.hasAuthTokens;
      results.details.push({ 
        step: 'Auth tokens cleared', 
        success: tokensCleared,
        actual: postLogoutAuthState.authTokenKeys.length,
        expected: 0
      });
      
      // Test 4: Dashboard access revoked
      const accessRevoked = !postLogoutDashboardState.hasAccess;
      results.details.push({ 
        step: 'Dashboard access revoked', 
        success: accessRevoked,
        actual: postLogoutDashboardState.hasAccess,
        expected: false
      });
      
      // Test 5: Redirected away from dashboard
      const redirected = !postLogoutDashboardState.isDashboard || postLogoutDashboardState.isLoginPage;
      results.details.push({ 
        step: 'Redirected from dashboard', 
        success: redirected,
        actual: `Dashboard: ${postLogoutDashboardState.isDashboard}, Login: ${postLogoutDashboardState.isLoginPage}`,
        expected: 'Dashboard: false OR Login: true'
      });
      
    } else {
      console.log('   No logout button found, testing manual logout...');
      
      // Manual logout by clearing tokens
      const manualLogout = clearAuthTokens();
      results.details.push({ 
        step: 'Manual logout', 
        success: manualLogout,
        actual: manualLogout,
        expected: true
      });
      
      await sleep(1000);
      
      const manualLogoutState = getAuthenticationState();
      const manualLogoutSuccess = !manualLogoutState.isAuthenticated;
      results.details.push({ 
        step: 'Manual logout effective', 
        success: manualLogoutSuccess,
        actual: manualLogoutState.isAuthenticated,
        expected: false
      });
    }
    
    // Calculate results
    results.passed = results.details.filter(d => d.success).length;
    results.failed = results.details.filter(d => !d.success).length;
    
    console.log(`   ✅ Passed: ${results.passed}`);
    console.log(`   ❌ Failed: ${results.failed}`);
    
    return results;
    
  } catch (error) {
    console.error('   💥 Test failed with error:', error);
    results.error = error.message;
    return results;
  }
}

async function testSecurityVulnerabilities() {
  console.log('\n🔒 Testing Security Vulnerabilities');
  console.log('-'.repeat(40));
  
  const results = {
    testName: 'Security Vulnerabilities',
    passed: 0,
    failed: 0,
    details: []
  };
  
  try {
    // Test 1: Check for exposed sensitive data in DOM
    const sensitiveSelectors = [
      '[data-password]',
      '[data-token]',
      '[data-secret]',
      '.password',
      '.token',
      '.secret'
    ];
    
    let exposedData = 0;
    sensitiveSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      exposedData += elements.length;
    });
    
    results.details.push({ 
      step: 'No exposed sensitive data', 
      success: exposedData === 0,
      actual: exposedData,
      expected: 0
    });
    
    // Test 2: Check for hardcoded credentials in localStorage
    const storageKeys = Object.keys(localStorage);
    const suspiciousKeys = storageKeys.filter(key => 
      key.toLowerCase().includes('password') || 
      key.toLowerCase().includes('secret') ||
      key.toLowerCase().includes('private')
    );
    
    results.details.push({ 
      step: 'No hardcoded credentials in storage', 
      success: suspiciousKeys.length === 0,
      actual: suspiciousKeys.length,
      expected: 0
    });
    
    // Test 3: Check for proper HTTPS (in production)
    const isHttps = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    results.details.push({ 
      step: 'Secure protocol', 
      success: isHttps,
      actual: window.location.protocol,
      expected: 'https: or localhost'
    });
    
    // Test 4: Check for XSS protection headers (if available)
    const hasCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    results.details.push({ 
      step: 'Content Security Policy', 
      success: hasCSP !== null,
      actual: hasCSP ? 'Present' : 'Missing',
      expected: 'Present'
    });
    
    // Test 5: Check for proper token format (should be JWT-like)
    const authState = getAuthenticationState();
    if (authState.hasAuthTokens) {
      const tokenKeys = authState.authTokenKeys;
      let validTokenFormat = true;
      
      tokenKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value && value.includes('access_token')) {
          try {
            const parsed = JSON.parse(value);
            const token = parsed.access_token;
            // JWT tokens should have 3 parts separated by dots
            if (token && typeof token === 'string') {
              const parts = token.split('.');
              if (parts.length !== 3) {
                validTokenFormat = false;
              }
            }
          } catch (e) {
            validTokenFormat = false;
          }
        }
      });
      
      results.details.push({ 
        step: 'Valid token format', 
        success: validTokenFormat,
        actual: validTokenFormat ? 'Valid JWT format' : 'Invalid format',
        expected: 'Valid JWT format'
      });
    }
    
    // Calculate results
    results.passed = results.details.filter(d => d.success).length;
    results.failed = results.details.filter(d => !d.success).length;
    
    console.log(`   ✅ Passed: ${results.passed}`);
    console.log(`   ❌ Failed: ${results.failed}`);
    
    return results;
    
  } catch (error) {
    console.error('   💥 Test failed with error:', error);
    results.error = error.message;
    return results;
  }
}

// Main Test Runner
async function runAuthenticationTests() {
  console.log('🚀 Starting Comprehensive Authentication Test Suite');
  console.log('=' .repeat(60));
  
  const startTime = Date.now();
  const allResults = [];
  
  try {
    // Initial assessment
    console.log('\n📊 Initial Authentication Assessment');
    const initialAuthState = getAuthenticationState();
    const initialDashboardState = getDashboardState();
    
    console.log(`Current URL: ${initialDashboardState.currentUrl}`);
    console.log(`Authentication: ${initialAuthState.isAuthenticated ? '✅ Authenticated' : '❌ Not authenticated'}`);
    console.log(`Dashboard access: ${initialDashboardState.hasAccess ? '✅ Accessible' : '❌ Not accessible'}`);
    console.log(`Auth tokens: ${initialAuthState.hasAuthTokens ? '✅ Present' : '❌ Missing'}`);
    
    // Run all tests
    const tests = [
      testUnauthenticatedAccess,
      testAuthenticatedAccess,
      testSessionExpiry,
      testLogoutProcess,
      testSecurityVulnerabilities
    ];
    
    for (const test of tests) {
      try {
        const result = await test();
        allResults.push(result);
        await sleep(TEST_CONFIG.waitBetweenTests);
      } catch (error) {
        console.error(`Test ${test.name} failed:`, error);
        allResults.push({
          testName: test.name,
          error: error.message,
          passed: 0,
          failed: 1
        });
      }
    }
    
    // Generate comprehensive report
    const duration = Date.now() - startTime;
    
    console.log('\n' + '=' .repeat(60));
    console.log('📊 AUTHENTICATION TEST RESULTS');
    console.log('=' .repeat(60));
    
    let totalPassed = 0;
    let totalFailed = 0;
    let totalSkipped = 0;
    
    allResults.forEach(result => {
      console.log(`\n📋 ${result.testName}:`);
      
      if (result.skipped) {
        console.log('   ⏭️ Skipped (prerequisites not met)');
        totalSkipped++;
      } else if (result.error) {
        console.log(`   💥 Error: ${result.error}`);
        totalFailed++;
      } else {
        console.log(`   ✅ Passed: ${result.passed}`);
        console.log(`   ❌ Failed: ${result.failed}`);
        totalPassed += result.passed;
        totalFailed += result.failed;
        
        // Show failed test details
        if (result.failed > 0) {
          const failedDetails = result.details.filter(d => !d.success);
          failedDetails.forEach(detail => {
            console.log(`     ❌ ${detail.step}: Expected ${detail.expected}, got ${detail.actual}`);
          });
        }
      }
    });
    
    // Final assessment
    const finalAuthState = getAuthenticationState();
    const finalDashboardState = getDashboardState();
    
    console.log('\n📈 FINAL ASSESSMENT:');
    console.log(`   Total Tests Passed: ${totalPassed}`);
    console.log(`   Total Tests Failed: ${totalFailed}`);
    console.log(`   Tests Skipped: ${totalSkipped}`);
    console.log(`   Success Rate: ${totalPassed + totalFailed > 0 ? Math.round((totalPassed / (totalPassed + totalFailed)) * 100) : 0}%`);
    console.log(`   Test Duration: ${(duration / 1000).toFixed(1)}s`);
    
    // Security assessment
    const securityIssues = [];
    if (finalDashboardState.hasAccess && !finalAuthState.isAuthenticated) {
      securityIssues.push('Unauthenticated dashboard access');
    }
    if (finalAuthState.hasAuthTokens && !finalAuthState.isAuthenticated) {
      securityIssues.push('Orphaned authentication tokens');
    }
    
    console.log(`   Security Status: ${securityIssues.length === 0 ? '✅ Secure' : '⚠️ ' + securityIssues.length + ' issues'}`);
    
    if (securityIssues.length > 0) {
      console.log('\n🔒 SECURITY ISSUES:');
      securityIssues.forEach(issue => console.log(`   - ${issue}`));
    }
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    if (totalFailed > 0) {
      console.log('   - Review and fix failed authentication tests');
    }
    if (securityIssues.length > 0) {
      console.log('   - Address security vulnerabilities immediately');
    }
    if (totalSkipped > 0) {
      console.log('   - Ensure proper authentication state for complete testing');
    }
    
    console.log('\n✅ Authentication test suite completed');
    
    return {
      totalPassed,
      totalFailed,
      totalSkipped,
      duration,
      securityIssues,
      allResults
    };
    
  } catch (error) {
    console.error('💥 Authentication test suite failed:', error);
    return { error: error.message };
  }
}

// Quick authentication check
function quickAuthCheck() {
  console.log('⚡ Quick Authentication Check');
  console.log('=' .repeat(40));
  
  const authState = getAuthenticationState();
  const dashboardState = getDashboardState();
  const userData = getUserDataState();
  
  console.log(`Authentication: ${authState.isAuthenticated ? '✅ Logged in' : '❌ Not logged in'}`);
  console.log(`Dashboard access: ${dashboardState.hasAccess ? '✅ Accessible' : '❌ Blocked'}`);
  console.log(`User data: ${userData.hasUserData ? '✅ Loaded' : '⚠️ No data'}`);
  console.log(`Auth tokens: ${authState.hasAuthTokens ? '✅ Present' : '❌ Missing'}`);
  console.log(`Current URL: ${dashboardState.currentUrl}`);
  
  const isSecure = dashboardState.hasAccess === authState.isAuthenticated;
  console.log(`Security: ${isSecure ? '✅ Secure' : '❌ Vulnerable'}`);
  
  if (!isSecure) {
    console.log('⚠️ SECURITY ISSUE: Dashboard access does not match authentication state!');
  }
  
  return { authState, dashboardState, userData, isSecure };
}

// Export test functions
window.authTests = {
  runAll: runAuthenticationTests,
  quickCheck: quickAuthCheck,
  testUnauthenticated: testUnauthenticatedAccess,
  testAuthenticated: testAuthenticatedAccess,
  testExpiry: testSessionExpiry,
  testLogout: testLogoutProcess,
  testSecurity: testSecurityVulnerabilities,
  clearTokens: clearAuthTokens,
  expireTokens: expireAuthTokens,
  getAuthState: getAuthenticationState,
  getDashboardState: getDashboardState,
  getUserData: getUserDataState
};

console.log('\n💡 Available authentication test commands:');
console.log('   authTests.runAll() - Run complete authentication test suite');
console.log('   authTests.quickCheck() - Quick authentication assessment');
console.log('   authTests.testUnauthenticated() - Test unauthenticated access');
console.log('   authTests.testAuthenticated() - Test authenticated access');
console.log('   authTests.testExpiry() - Test session expiry');
console.log('   authTests.testLogout() - Test logout process');
console.log('   authTests.testSecurity() - Test security vulnerabilities');

// Auto-run quick check
console.log('\n🔄 Running quick authentication check...');
setTimeout(() => {
  quickAuthCheck();
}, 1000);