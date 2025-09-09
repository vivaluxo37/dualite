# Dashboard User Authentication Test Plan

## Test Environment
- **URL**: http://localhost:5173/dashboard
- **Authentication System**: Supabase Auth
- **Test Focus**: Access control, authentication flows, user permissions
- **Date**: January 2025

## Authentication Test Categories

### 1. Unauthenticated User Access
- [ ] **Dashboard Access**: Test direct access to /dashboard without login
- [ ] **Tab Navigation**: Test accessing individual dashboard tabs
- [ ] **Protected Routes**: Verify redirection to login page
- [ ] **API Calls**: Test behavior when making authenticated API calls
- [ ] **Local Storage**: Check handling of missing auth tokens

### 2. Authentication Flow
- [ ] **Login Process**: Test successful login flow
- [ ] **Registration Process**: Test new user registration
- [ ] **Password Reset**: Test password reset functionality
- [ ] **Social Login**: Test OAuth providers if available
- [ ] **Remember Me**: Test persistent login sessions

### 3. Authenticated User Access
- [ ] **Dashboard Access**: Verify full dashboard access after login
- [ ] **User Data**: Test loading of user-specific data
- [ ] **Saved Brokers**: Test access to user's saved brokers
- [ ] **Match History**: Test access to user's quiz results
- [ ] **Learning Progress**: Test access to user's learning data

### 4. Session Management
- [ ] **Session Persistence**: Test login persistence across browser sessions
- [ ] **Session Expiry**: Test behavior when session expires
- [ ] **Token Refresh**: Test automatic token refresh
- [ ] **Logout Process**: Test proper logout and cleanup
- [ ] **Multiple Sessions**: Test concurrent sessions in different tabs

### 5. Authorization Levels
- [ ] **Regular User**: Test standard user permissions
- [ ] **Admin User**: Test admin-only features if available
- [ ] **Guest User**: Test limited guest access
- [ ] **Banned User**: Test access for suspended accounts
- [ ] **Unverified User**: Test access for unverified emails

### 6. Security Testing
- [ ] **Token Manipulation**: Test with invalid/expired tokens
- [ ] **CSRF Protection**: Test cross-site request forgery protection
- [ ] **XSS Prevention**: Test script injection attempts
- [ ] **SQL Injection**: Test database query protection
- [ ] **Brute Force**: Test login attempt rate limiting

## Authentication States to Test

### 1. Not Logged In
- User has never logged in
- No authentication tokens present
- Should redirect to login page
- Should show public content only

### 2. Logged In (Fresh Session)
- User just completed login
- Valid authentication tokens
- Full access to dashboard features
- User data loads correctly

### 3. Logged In (Existing Session)
- User returns with existing session
- Tokens are still valid
- Dashboard loads without re-authentication
- Data persists from previous session

### 4. Session Expired
- User session has timed out
- Tokens are expired but still present
- Should prompt for re-authentication
- Should preserve user's current location

### 5. Logged Out
- User manually logged out
- Tokens cleared from storage
- Should redirect to public pages
- Should clear all user data

## Browser Authentication Test Script

```javascript
// Dashboard Authentication Test Suite
// Run this in browser console

console.log('🔐 Dashboard Authentication Test Suite');
console.log('=' .repeat(50));

// Helper functions
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkAuthenticationState() {
  // Check for authentication indicators
  const loginButtons = document.querySelectorAll(
    '[data-testid="login"], .login-button, button[title*="Login"], button[title*="Sign In"], a[href*="login"]'
  );
  
  const userMenus = document.querySelectorAll(
    '[data-testid="user-menu"], .user-menu, .profile-menu, .avatar-menu'
  );
  
  const userInfo = document.querySelectorAll(
    '[data-testid="user-info"], .user-name, .user-email, .profile-info'
  );
  
  const logoutButtons = document.querySelectorAll(
    '[data-testid="logout"], .logout-button, button[title*="Logout"], button[title*="Sign Out"]'
  );
  
  const protectedContent = document.querySelectorAll(
    '[data-protected="true"], .protected-route, .auth-required'
  );
  
  // Check local storage for auth tokens
  const hasAuthTokens = Object.keys(localStorage).some(key => 
    key.includes('supabase') || key.includes('auth') || key.includes('token')
  );
  
  const authTokens = Object.keys(localStorage)
    .filter(key => key.includes('supabase') || key.includes('auth'))
    .map(key => ({ key, value: localStorage.getItem(key)?.substring(0, 50) + '...' }));
  
  return {
    loginButtons: loginButtons.length,
    userMenus: userMenus.length,
    userInfo: userInfo.length,
    logoutButtons: logoutButtons.length,
    protectedContent: protectedContent.length,
    hasAuthTokens,
    authTokens,
    isAuthenticated: userMenus.length > 0 || userInfo.length > 0 || logoutButtons.length > 0,
    isGuest: loginButtons.length > 0 && userMenus.length === 0
  };
}

function checkDashboardAccess() {
  const currentUrl = window.location.href;
  const isDashboard = currentUrl.includes('/dashboard');
  const isLoginPage = currentUrl.includes('/login') || currentUrl.includes('/auth');
  
  // Check for dashboard-specific elements
  const dashboardTabs = document.querySelectorAll(
    '[role="tab"], .tab-button, [data-testid*="tab"]'
  );
  
  const dashboardContent = document.querySelectorAll(
    '.dashboard-content, [data-testid="dashboard"], .dashboard-main'
  );
  
  const errorMessages = document.querySelectorAll(
    '.error-message, .access-denied, [role="alert"]'
  );
  
  return {
    currentUrl,
    isDashboard,
    isLoginPage,
    dashboardTabs: dashboardTabs.length,
    dashboardContent: dashboardContent.length,
    errorMessages: errorMessages.length,
    hasAccess: isDashboard && dashboardTabs.length > 0
  };
}

function simulateLogout() {
  try {
    // Clear authentication tokens
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
    
    console.log('🚪 Authentication tokens cleared (simulated logout)');
    return true;
  } catch (error) {
    console.log('❌ Failed to clear auth tokens:', error);
    return false;
  }
}

function simulateExpiredSession() {
  try {
    // Modify auth tokens to make them invalid
    Object.keys(localStorage).forEach(key => {
      if (key.includes('supabase') && key.includes('auth')) {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            const parsed = JSON.parse(value);
            if (parsed.expires_at) {
              parsed.expires_at = Date.now() / 1000 - 3600; // Expired 1 hour ago
            }
            if (parsed.access_token) {
              parsed.access_token = 'expired_' + parsed.access_token;
            }
            localStorage.setItem(key, JSON.stringify(parsed));
          } catch (e) {
            // If not JSON, just modify the value
            localStorage.setItem(key, 'expired_' + value);
          }
        }
      }
    });
    
    console.log('⏰ Session tokens expired (simulated)');
    return true;
  } catch (error) {
    console.log('❌ Failed to expire session:', error);
    return false;
  }
}

function testProtectedRoutes() {
  const protectedPaths = [
    '/dashboard',
    '/dashboard/saved-brokers',
    '/dashboard/match-history',
    '/dashboard/learning-progress',
    '/profile',
    '/settings'
  ];
  
  return protectedPaths.map(path => {
    const fullUrl = window.location.origin + path;
    return {
      path,
      url: fullUrl,
      accessible: window.location.pathname === path
    };
  });
}

function checkUserDataLoading() {
  // Check for user-specific data elements
  const userDataElements = {
    savedBrokers: document.querySelectorAll('.broker-card, [data-testid*="broker"]').length,
    matchHistory: document.querySelectorAll('.match-result, [data-testid*="match"], .quiz-result').length,
    learningProgress: document.querySelectorAll('.progress-item, [data-testid*="progress"], .module-progress').length,
    userProfile: document.querySelectorAll('.user-profile, .profile-info, [data-testid*="profile"]').length
  };
  
  const loadingElements = document.querySelectorAll(
    '.loading, .spinner, .skeleton, [aria-busy="true"], .animate-pulse'
  ).length;
  
  const errorElements = document.querySelectorAll(
    '.error-message, .error-state, [role="alert"]'
  ).length;
  
  return {
    ...userDataElements,
    loadingElements,
    errorElements,
    hasUserData: Object.values(userDataElements).some(count => count > 0)
  };
}

// Test individual authentication scenarios
async function testUnauthenticatedAccess() {
  console.log('\n🚫 Testing Unauthenticated Access...');
  
  // Clear any existing authentication
  simulateLogout();
  
  // Wait a moment for state to update
  await sleep(1000);
  
  const authState = checkAuthenticationState();
  const dashboardAccess = checkDashboardAccess();
  
  console.log(`   Authentication state: ${authState.isAuthenticated ? '❌ Still authenticated' : '✅ Not authenticated'}`);
  console.log(`   Login buttons visible: ${authState.loginButtons > 0 ? '✅' : '❌'}`);
  console.log(`   Dashboard access: ${dashboardAccess.hasAccess ? '❌ Unauthorized access' : '✅ Access denied'}`);
  console.log(`   Current URL: ${dashboardAccess.currentUrl}`);
  
  if (dashboardAccess.isDashboard && !authState.isAuthenticated) {
    console.log('   ⚠️ Unauthenticated user can access dashboard - potential security issue');
  }
  
  // Try to access dashboard tabs
  const tabs = document.querySelectorAll('[role="tab"], .tab-button');
  if (tabs.length > 0) {
    console.log('   Testing tab access without authentication...');
    tabs[0].click();
    await sleep(1000);
    
    const postClickAccess = checkDashboardAccess();
    console.log(`   Tab access result: ${postClickAccess.hasAccess ? '❌ Unauthorized' : '✅ Blocked'}`);
  }
  
  console.log('✅ Unauthenticated access test completed');
}

async function testAuthenticatedAccess() {
  console.log('\n✅ Testing Authenticated Access...');
  
  const authState = checkAuthenticationState();
  const dashboardAccess = checkDashboardAccess();
  
  console.log(`   Authentication state: ${authState.isAuthenticated ? '✅ Authenticated' : '❌ Not authenticated'}`);
  console.log(`   User menus visible: ${authState.userMenus > 0 ? '✅' : '❌'}`);
  console.log(`   Logout options available: ${authState.logoutButtons > 0 ? '✅' : '❌'}`);
  console.log(`   Dashboard access: ${dashboardAccess.hasAccess ? '✅ Authorized' : '❌ Access denied'}`);
  
  if (authState.isAuthenticated) {
    // Test user data loading
    const userData = checkUserDataLoading();
    console.log(`   User data loading: ${userData.hasUserData ? '✅ Data loaded' : '⚠️ No user data'}`);
    console.log(`   Loading indicators: ${userData.loadingElements}`);
    console.log(`   Error indicators: ${userData.errorElements}`);
    
    // Test tab navigation
    const tabs = document.querySelectorAll('[role="tab"], .tab-button');
    if (tabs.length > 1) {
      console.log('   Testing authenticated tab navigation...');
      
      for (let i = 0; i < Math.min(tabs.length, 3); i++) {
        tabs[i].click();
        await sleep(1000);
        
        const tabUserData = checkUserDataLoading();
        console.log(`   Tab ${i + 1} data: ${tabUserData.hasUserData ? '✅' : '⚠️ No data'}`);
      }
    }
  } else {
    console.log('   ⚠️ User appears to be unauthenticated - cannot test authenticated features');
  }
  
  console.log('✅ Authenticated access test completed');
}

async function testSessionExpiry() {
  console.log('\n⏰ Testing Session Expiry...');
  
  const initialAuthState = checkAuthenticationState();
  
  if (initialAuthState.isAuthenticated) {
    console.log('   Simulating expired session...');
    simulateExpiredSession();
    
    // Try to access protected content
    await sleep(1000);
    
    // Trigger a request that would require authentication
    const tabs = document.querySelectorAll('[role="tab"], .tab-button');
    if (tabs.length > 0) {
      tabs[0].click();
      await sleep(2000);
      
      const postExpiryState = checkAuthenticationState();
      const dashboardAccess = checkDashboardAccess();
      
      console.log(`   Post-expiry auth state: ${postExpiryState.isAuthenticated ? '❌ Still authenticated' : '✅ Session expired'}`);
      console.log(`   Dashboard access: ${dashboardAccess.hasAccess ? '❌ Still accessible' : '✅ Access revoked'}`);
      console.log(`   Redirected to login: ${dashboardAccess.isLoginPage ? '✅' : '❌'}`);
    }
  } else {
    console.log('   ⚠️ User not authenticated - cannot test session expiry');
  }
  
  console.log('✅ Session expiry test completed');
}

async function testLogoutProcess() {
  console.log('\n🚪 Testing Logout Process...');
  
  const initialAuthState = checkAuthenticationState();
  
  if (initialAuthState.isAuthenticated && initialAuthState.logoutButtons > 0) {
    console.log('   Attempting logout via UI...');
    
    // Try to find and click logout button
    const logoutButtons = document.querySelectorAll(
      '[data-testid="logout"], .logout-button, button[title*="Logout"], button[title*="Sign Out"]'
    );
    
    if (logoutButtons.length > 0) {
      logoutButtons[0].click();
      await sleep(2000);
      
      const postLogoutState = checkAuthenticationState();
      const dashboardAccess = checkDashboardAccess();
      
      console.log(`   Post-logout auth state: ${postLogoutState.isAuthenticated ? '❌ Still authenticated' : '✅ Logged out'}`);
      console.log(`   Auth tokens cleared: ${!postLogoutState.hasAuthTokens ? '✅' : '❌'}`);
      console.log(`   Dashboard access: ${dashboardAccess.hasAccess ? '❌ Still accessible' : '✅ Access revoked'}`);
      console.log(`   Redirected: ${!dashboardAccess.isDashboard ? '✅' : '❌'}`);
    } else {
      console.log('   ⚠️ No logout button found - testing manual logout');
      simulateLogout();
      
      await sleep(1000);
      
      const manualLogoutState = checkAuthenticationState();
      console.log(`   Manual logout result: ${!manualLogoutState.isAuthenticated ? '✅' : '❌'}`);
    }
  } else {
    console.log('   ⚠️ User not authenticated or no logout button - cannot test logout');
  }
  
  console.log('✅ Logout process test completed');
}

// Comprehensive authentication test
async function runAuthenticationTests() {
  console.log('🚀 Starting Comprehensive Authentication Test Suite');
  console.log('=' .repeat(60));
  
  const startTime = Date.now();
  
  try {
    // Initial state assessment
    console.log('\n📊 Initial Authentication Assessment');
    const initialState = checkAuthenticationState();
    const initialAccess = checkDashboardAccess();
    
    console.log(`Current authentication: ${initialState.isAuthenticated ? '✅ Authenticated' : '❌ Not authenticated'}`);
    console.log(`Dashboard access: ${initialAccess.hasAccess ? '✅ Accessible' : '❌ Not accessible'}`);
    console.log(`Auth tokens present: ${initialState.hasAuthTokens ? '✅' : '❌'}`);
    
    // Run authentication tests
    await testUnauthenticatedAccess();
    await testAuthenticatedAccess();
    await testSessionExpiry();
    await testLogoutProcess();
    
    const duration = Date.now() - startTime;
    
    // Generate final report
    console.log('\n' + '=' .repeat(60));
    console.log('📊 AUTHENTICATION TEST RESULTS');
    console.log('=' .repeat(60));
    
    const finalAuthState = checkAuthenticationState();
    const finalDashboardAccess = checkDashboardAccess();
    const finalUserData = checkUserDataLoading();
    
    console.log('\n📈 FINAL ASSESSMENT:');
    console.log(`   Authentication System: ${finalAuthState.hasAuthTokens ? '✅ Active' : '⚠️ No tokens'}`);
    console.log(`   Access Control: ${finalDashboardAccess.hasAccess === finalAuthState.isAuthenticated ? '✅ Working' : '❌ Broken'}`);
    console.log(`   User Data Loading: ${finalUserData.hasUserData ? '✅ Working' : '⚠️ No data'}`);
    console.log(`   Test Duration: ${(duration / 1000).toFixed(1)}s`);
    
    // Security assessment
    const securityIssues = [];
    if (finalDashboardAccess.hasAccess && !finalAuthState.isAuthenticated) {
      securityIssues.push('Unauthenticated dashboard access');
    }
    if (finalAuthState.hasAuthTokens && !finalAuthState.isAuthenticated) {
      securityIssues.push('Orphaned authentication tokens');
    }
    
    console.log(`   Security Issues: ${securityIssues.length === 0 ? '✅ None detected' : '⚠️ ' + securityIssues.length + ' found'}`);
    
    if (securityIssues.length > 0) {
      console.log('\n🔒 SECURITY CONCERNS:');
      securityIssues.forEach(issue => console.log(`   - ${issue}`));
    }
    
    console.log('\n💡 RECOMMENDATIONS:');
    if (!finalAuthState.isAuthenticated && finalDashboardAccess.hasAccess) {
      console.log('   - Implement proper authentication guards for dashboard routes');
    }
    if (finalUserData.errorElements > 0) {
      console.log('   - Review and fix user data loading errors');
    }
    if (finalAuthState.hasAuthTokens && !finalAuthState.isAuthenticated) {
      console.log('   - Implement proper token cleanup on logout/expiry');
    }
    
  } catch (error) {
    console.error('💥 Authentication test suite failed:', error);
  }
}

// Quick authentication check
function quickAuthCheck() {
  console.log('⚡ Quick Authentication Check');
  console.log('=' .repeat(40));
  
  const authState = checkAuthenticationState();
  const dashboardAccess = checkDashboardAccess();
  const userData = checkUserDataLoading();
  
  console.log(`Authentication: ${authState.isAuthenticated ? '✅ Logged in' : '❌ Not logged in'}`);
  console.log(`Dashboard access: ${dashboardAccess.hasAccess ? '✅ Accessible' : '❌ Blocked'}`);
  console.log(`User data: ${userData.hasUserData ? '✅ Loaded' : '⚠️ No data'}`);
  console.log(`Auth tokens: ${authState.hasAuthTokens ? '✅ Present' : '❌ Missing'}`);
  
  const isSecure = dashboardAccess.hasAccess === authState.isAuthenticated;
  console.log(`Security: ${isSecure ? '✅ Secure' : '❌ Vulnerable'}`);
  
  return { authState, dashboardAccess, userData, isSecure };
}

// Export test functions
window.authTests = {
  runAll: runAuthenticationTests,
  quickCheck: quickAuthCheck,
  testUnauthenticated: testUnauthenticatedAccess,
  testAuthenticated: testAuthenticatedAccess,
  testExpiry: testSessionExpiry,
  testLogout: testLogoutProcess,
  simulateLogout: simulateLogout,
  simulateExpiredSession: simulateExpiredSession,
  checkAuthState: checkAuthenticationState,
  checkDashboardAccess: checkDashboardAccess
};

console.log('\n💡 Available authentication test commands:');
console.log('   authTests.runAll() - Run complete authentication test suite');
console.log('   authTests.quickCheck() - Quick authentication assessment');
console.log('   authTests.testUnauthenticated() - Test unauthenticated access');
console.log('   authTests.testAuthenticated() - Test authenticated access');
console.log('   authTests.testExpiry() - Test session expiry');
console.log('   authTests.testLogout() - Test logout process');

// Auto-run quick check
console.log('\n🔄 Running quick authentication check...');
setTimeout(() => {
  quickAuthCheck();
}, 1000);
```

## Expected Authentication Behaviors

### Unauthenticated Users
- ✅ **Redirect to Login**: Dashboard access redirects to login page
- ✅ **Limited Access**: Only public content is accessible
- ✅ **Clear Messaging**: User understands they need to log in
- ✅ **Preserved Intent**: Return to intended page after login

### Authenticated Users
- ✅ **Full Access**: Complete dashboard functionality available
- ✅ **User Data**: Personal data loads correctly
- ✅ **Session Persistence**: Login persists across browser sessions
- ✅ **Secure Tokens**: Authentication tokens are properly managed

### Session Management
- ✅ **Auto Refresh**: Tokens refresh automatically before expiry
- ✅ **Graceful Expiry**: Clear messaging when session expires
- ✅ **Clean Logout**: All user data and tokens cleared on logout
- ✅ **Security**: No unauthorized access to protected resources

## Test Results

| Authentication Aspect | Implementation | Security | User Experience | Status |
|----------------------|----------------|----------|-----------------|--------|
| Login Flow | ⏳ | ⏳ | ⏳ | ⏳ |
| Dashboard Access | ⏳ | ⏳ | ⏳ | ⏳ |
| Session Management | ⏳ | ⏳ | ⏳ | ⏳ |
| User Data Loading | ⏳ | ⏳ | ⏳ | ⏳ |
| Logout Process | ⏳ | ⏳ | ⏳ | ⏳ |
| Token Management | ⏳ | ⏳ | ⏳ | ⏳ |
| Error Handling | ⏳ | ⏳ | ⏳ | ⏳ |
| Route Protection | ⏳ | ⏳ | ⏳ | ⏳ |

**Overall Authentication Score**: 🔄 In Progress

## Security Checklist

- [ ] **Route Guards**: Protected routes require authentication
- [ ] **Token Security**: Tokens stored securely and expire appropriately
- [ ] **CSRF Protection**: Cross-site request forgery prevention
- [ ] **XSS Prevention**: Input sanitization and output encoding
- [ ] **Session Fixation**: Session IDs regenerated on login
- [ ] **Brute Force**: Login attempt rate limiting
- [ ] **Password Policy**: Strong password requirements
- [ ] **Two-Factor Auth**: Optional 2FA for enhanced security

## Issues Found

*Document any authentication issues discovered*

## Recommendations

*List improvements for better authentication security and UX*