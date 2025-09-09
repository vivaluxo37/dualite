// Browser console test script for SavedBrokers component
// Run this in browser console after navigating to dashboard

console.log('🧪 Starting SavedBrokers Component Test...');

// Test 1: Check if dashboard page loads
function testDashboardLoad() {
  console.log('\n📋 Test 1: Dashboard Load');
  const dashboard = document.querySelector('[data-testid="dashboard"], .dashboard, main');
  if (dashboard) {
    console.log('✅ Dashboard container found');
    return true;
  } else {
    console.log('❌ Dashboard container not found');
    return false;
  }
}

// Test 2: Check if Saved Brokers tab exists
function testSavedBrokersTab() {
  console.log('\n📋 Test 2: Saved Brokers Tab');
  const tabs = document.querySelectorAll('[role="tab"], .tab, button');
  let savedBrokersTab = null;
  
  tabs.forEach(tab => {
    if (tab.textContent.includes('Saved Brokers') || tab.textContent.includes('Saved')) {
      savedBrokersTab = tab;
    }
  });
  
  if (savedBrokersTab) {
    console.log('✅ Saved Brokers tab found:', savedBrokersTab.textContent);
    return savedBrokersTab;
  } else {
    console.log('❌ Saved Brokers tab not found');
    console.log('Available tabs:', Array.from(tabs).map(t => t.textContent));
    return null;
  }
}

// Test 3: Click Saved Brokers tab and check content
function testSavedBrokersContent(tab) {
  console.log('\n📋 Test 3: Saved Brokers Content');
  
  if (!tab) {
    console.log('❌ No tab provided');
    return false;
  }
  
  // Click the tab
  tab.click();
  
  // Wait a moment for content to load
  setTimeout(() => {
    // Check for search input
    const searchInput = document.querySelector('input[placeholder*="search"], input[placeholder*="Search"], input[type="search"]');
    if (searchInput) {
      console.log('✅ Search input found');
    } else {
      console.log('⚠️ Search input not found');
    }
    
    // Check for broker cards or empty state
    const brokerCards = document.querySelectorAll('.broker-card, [data-testid="broker-card"], .card');
    const emptyState = document.querySelector('.empty-state, [data-testid="empty-state"]');
    
    if (brokerCards.length > 0) {
      console.log(`✅ Found ${brokerCards.length} broker cards`);
      
      // Test first broker card content
      const firstCard = brokerCards[0];
      const brokerName = firstCard.querySelector('h3, h4, .broker-name, [data-testid="broker-name"]');
      const rating = firstCard.querySelector('.rating, [data-testid="rating"], .stars');
      
      if (brokerName) {
        console.log('✅ Broker name found:', brokerName.textContent);
      }
      if (rating) {
        console.log('✅ Rating found:', rating.textContent);
      }
      
    } else if (emptyState) {
      console.log('✅ Empty state displayed (no saved brokers)');
    } else {
      console.log('⚠️ No broker cards or empty state found');
    }
    
    // Check for loading states
    const loadingElements = document.querySelectorAll('.loading, .skeleton, [data-testid="loading"]');
    if (loadingElements.length > 0) {
      console.log('⚠️ Loading elements still visible');
    }
    
  }, 1000);
  
  return true;
}

// Test 4: Test search functionality
function testSearchFunctionality() {
  console.log('\n📋 Test 4: Search Functionality');
  
  setTimeout(() => {
    const searchInput = document.querySelector('input[placeholder*="search"], input[placeholder*="Search"], input[type="search"]');
    
    if (searchInput) {
      console.log('🔍 Testing search functionality...');
      
      // Get initial broker count
      const initialCards = document.querySelectorAll('.broker-card, [data-testid="broker-card"], .card').length;
      console.log(`Initial broker count: ${initialCards}`);
      
      // Test search
      searchInput.value = 'test';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      setTimeout(() => {
        const filteredCards = document.querySelectorAll('.broker-card, [data-testid="broker-card"], .card').length;
        console.log(`Filtered broker count: ${filteredCards}`);
        
        if (filteredCards <= initialCards) {
          console.log('✅ Search appears to be working');
        } else {
          console.log('⚠️ Search results unexpected');
        }
        
        // Clear search
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        
      }, 500);
    } else {
      console.log('❌ Search input not found for testing');
    }
  }, 1500);
}

// Test 5: Check for remove buttons
function testRemoveButtons() {
  console.log('\n📋 Test 5: Remove Buttons');
  
  setTimeout(() => {
    const removeButtons = document.querySelectorAll('button[aria-label*="remove"], button[title*="remove"], .remove-btn, [data-testid="remove-button"]');
    
    if (removeButtons.length > 0) {
      console.log(`✅ Found ${removeButtons.length} remove buttons`);
    } else {
      console.log('⚠️ No remove buttons found');
    }
  }, 2000);
}

// Run all tests
function runAllTests() {
  console.log('🚀 Running SavedBrokers Component Tests...');
  
  const dashboardLoaded = testDashboardLoad();
  if (!dashboardLoaded) {
    console.log('❌ Cannot proceed - Dashboard not loaded');
    return;
  }
  
  const savedBrokersTab = testSavedBrokersTab();
  if (!savedBrokersTab) {
    console.log('❌ Cannot proceed - Saved Brokers tab not found');
    return;
  }
  
  testSavedBrokersContent(savedBrokersTab);
  testSearchFunctionality();
  testRemoveButtons();
  
  setTimeout(() => {
    console.log('\n🏁 SavedBrokers Component Test Complete!');
    console.log('Check the results above for any issues.');
  }, 3000);
}

// Auto-run if on dashboard page
if (window.location.pathname.includes('/dashboard') || window.location.pathname === '/') {
  runAllTests();
} else {
  console.log('Navigate to dashboard page and run: runAllTests()');
}

// Export functions for manual testing
window.testSavedBrokers = {
  runAllTests,
  testDashboardLoad,
  testSavedBrokersTab,
  testSavedBrokersContent,
  testSearchFunctionality,
  testRemoveButtons
};