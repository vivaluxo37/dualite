// Dashboard Performance Test Suite
// Run this script in the browser console at http://localhost:5173/dashboard

console.log('⚡ Dashboard Performance Test Suite');
console.log('=' .repeat(50));

// Performance Configuration
const PERF_CONFIG = {
  dashboardUrl: 'http://localhost:5173/dashboard',
  testTimeout: 10000,
  measurementDuration: 5000,
  targetMetrics: {
    lcp: 2500, // ms
    fid: 100,  // ms
    cls: 0.1,  // score
    fcp: 1800, // ms
    tti: 3800, // ms
    dashboardLoad: 3000, // ms
    tabSwitch: 500, // ms
    searchResponse: 300, // ms
    memoryLimit: 100 * 1024 * 1024, // 100MB in bytes
    bundleSize: 2 * 1024 * 1024 // 2MB in bytes
  },
  sampleSize: 5,
  waitBetweenTests: 1000
};

// Performance Utilities
class PerformanceMonitor {
  constructor() {
    this.measurements = [];
    this.observers = [];
    this.startTime = performance.now();
  }

  // Core Web Vitals measurement
  measureCoreWebVitals() {
    return new Promise((resolve) => {
      const vitals = {
        lcp: null,
        fid: null,
        cls: null,
        fcp: null,
        tti: null
      };

      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            if (entries.length > 0) {
              vitals.lcp = entries[entries.length - 1].startTime;
            }
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
          this.observers.push(lcpObserver);
        } catch (e) {
          console.warn('LCP measurement not supported');
        }

        // First Input Delay
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
              if (entry.processingStart && entry.startTime) {
                vitals.fid = entry.processingStart - entry.startTime;
              }
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
          this.observers.push(fidObserver);
        } catch (e) {
          console.warn('FID measurement not supported');
        }

        // Cumulative Layout Shift
        try {
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
            vitals.cls = clsValue;
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
          this.observers.push(clsObserver);
        } catch (e) {
          console.warn('CLS measurement not supported');
        }

        // First Contentful Paint
        try {
          const fcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
              if (entry.name === 'first-contentful-paint') {
                vitals.fcp = entry.startTime;
              }
            });
          });
          fcpObserver.observe({ entryTypes: ['paint'] });
          this.observers.push(fcpObserver);
        } catch (e) {
          console.warn('FCP measurement not supported');
        }
      }

      // Fallback measurements from Navigation Timing
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          if (!vitals.fcp && navigation.responseEnd) {
            vitals.fcp = navigation.responseEnd - navigation.fetchStart;
          }
          if (!vitals.tti && navigation.loadEventEnd) {
            vitals.tti = navigation.loadEventEnd - navigation.fetchStart;
          }
        }

        // Get paint timings
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach(entry => {
          if (entry.name === 'first-contentful-paint' && !vitals.fcp) {
            vitals.fcp = entry.startTime;
          }
        });

        resolve(vitals);
      }, 3000);
    });
  }

  // Memory usage measurement
  measureMemoryUsage() {
    if ('memory' in performance) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        timestamp: performance.now()
      };
    }
    return null;
  }

  // Network performance
  measureNetworkPerformance() {
    const resources = performance.getEntriesByType('resource');
    const navigation = performance.getEntriesByType('navigation')[0];

    const networkMetrics = {
      totalRequests: resources.length,
      totalTransferSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
      totalEncodedSize: resources.reduce((sum, r) => sum + (r.encodedBodySize || 0), 0),
      averageResponseTime: resources.length > 0 ? 
        resources.reduce((sum, r) => sum + (r.responseEnd - r.requestStart), 0) / resources.length : 0,
      slowestRequest: resources.reduce((slowest, r) => {
        const duration = r.responseEnd - r.requestStart;
        return duration > (slowest.duration || 0) ? { name: r.name, duration } : slowest;
      }, {}),
      domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.fetchStart : null,
      pageLoad: navigation ? navigation.loadEventEnd - navigation.fetchStart : null
    };

    return networkMetrics;
  }

  // Bundle size analysis
  analyzeBundleSize() {
    const resources = performance.getEntriesByType('resource');
    
    const bundles = {
      javascript: { count: 0, size: 0 },
      css: { count: 0, size: 0 },
      images: { count: 0, size: 0 },
      fonts: { count: 0, size: 0 },
      other: { count: 0, size: 0 }
    };

    resources.forEach(resource => {
      const size = resource.transferSize || 0;
      const name = resource.name.toLowerCase();

      if (name.includes('.js') || name.includes('javascript')) {
        bundles.javascript.count++;
        bundles.javascript.size += size;
      } else if (name.includes('.css') || name.includes('stylesheet')) {
        bundles.css.count++;
        bundles.css.size += size;
      } else if (name.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) {
        bundles.images.count++;
        bundles.images.size += size;
      } else if (name.match(/\.(woff|woff2|ttf|eot)$/)) {
        bundles.fonts.count++;
        bundles.fonts.size += size;
      } else {
        bundles.other.count++;
        bundles.other.size += size;
      }
    });

    const totalSize = Object.values(bundles).reduce((sum, bundle) => sum + bundle.size, 0);

    return { bundles, totalSize };
  }

  // Cleanup observers
  cleanup() {
    this.observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch (e) {
        console.warn('Failed to disconnect observer:', e);
      }
    });
    this.observers = [];
  }
}

// Helper Functions
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function measureTime(fn) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  return { result, duration: end - start };
}

async function measureAsyncTime(fn) {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  return { result, duration: end - start };
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

function getFrameRate() {
  return new Promise((resolve) => {
    let frames = 0;
    const startTime = performance.now();
    
    function countFrame() {
      frames++;
      if (performance.now() - startTime < 1000) {
        requestAnimationFrame(countFrame);
      } else {
        resolve(frames);
      }
    }
    
    requestAnimationFrame(countFrame);
  });
}

function simulateUserInteraction(element, type = 'click') {
  const event = new Event(type, { bubbles: true, cancelable: true });
  const start = performance.now();
  element.dispatchEvent(event);
  return performance.now() - start;
}

// Test Functions
async function testInitialLoadPerformance() {
  console.log('\n🚀 Testing Initial Load Performance');
  console.log('-'.repeat(40));
  
  const results = {
    testName: 'Initial Load Performance',
    passed: 0,
    failed: 0,
    details: []
  };
  
  try {
    const monitor = new PerformanceMonitor();
    
    // Measure Core Web Vitals
    console.log('   Measuring Core Web Vitals...');
    const vitals = await monitor.measureCoreWebVitals();
    
    // Test LCP
    const lcpPassed = vitals.lcp && vitals.lcp <= PERF_CONFIG.targetMetrics.lcp;
    results.details.push({
      metric: 'Largest Contentful Paint (LCP)',
      value: vitals.lcp ? `${vitals.lcp.toFixed(0)}ms` : 'Not measured',
      target: `${PERF_CONFIG.targetMetrics.lcp}ms`,
      passed: lcpPassed
    });
    
    // Test FCP
    const fcpPassed = vitals.fcp && vitals.fcp <= PERF_CONFIG.targetMetrics.fcp;
    results.details.push({
      metric: 'First Contentful Paint (FCP)',
      value: vitals.fcp ? `${vitals.fcp.toFixed(0)}ms` : 'Not measured',
      target: `${PERF_CONFIG.targetMetrics.fcp}ms`,
      passed: fcpPassed
    });
    
    // Test CLS
    const clsPassed = vitals.cls !== null && vitals.cls <= PERF_CONFIG.targetMetrics.cls;
    results.details.push({
      metric: 'Cumulative Layout Shift (CLS)',
      value: vitals.cls !== null ? vitals.cls.toFixed(3) : 'Not measured',
      target: PERF_CONFIG.targetMetrics.cls.toString(),
      passed: clsPassed
    });
    
    // Test TTI
    const ttiPassed = vitals.tti && vitals.tti <= PERF_CONFIG.targetMetrics.tti;
    results.details.push({
      metric: 'Time to Interactive (TTI)',
      value: vitals.tti ? `${vitals.tti.toFixed(0)}ms` : 'Not measured',
      target: `${PERF_CONFIG.targetMetrics.tti}ms`,
      passed: ttiPassed
    });
    
    // Test dashboard-specific load time
    const dashboardElements = document.querySelectorAll('[role="tab"], .dashboard-content, .tab-content');
    const dashboardLoaded = dashboardElements.length > 0;
    const loadTime = performance.now();
    const dashboardLoadPassed = dashboardLoaded && loadTime <= PERF_CONFIG.targetMetrics.dashboardLoad;
    
    results.details.push({
      metric: 'Dashboard Load Time',
      value: `${loadTime.toFixed(0)}ms`,
      target: `${PERF_CONFIG.targetMetrics.dashboardLoad}ms`,
      passed: dashboardLoadPassed
    });
    
    monitor.cleanup();
    
    // Calculate results
    results.passed = results.details.filter(d => d.passed).length;
    results.failed = results.details.filter(d => !d.passed).length;
    
    console.log(`   ✅ Passed: ${results.passed}`);
    console.log(`   ❌ Failed: ${results.failed}`);
    
    return results;
    
  } catch (error) {
    console.error('   💥 Test failed with error:', error);
    results.error = error.message;
    return results;
  }
}

async function testNavigationPerformance() {
  console.log('\n🧭 Testing Navigation Performance');
  console.log('-'.repeat(40));
  
  const results = {
    testName: 'Navigation Performance',
    passed: 0,
    failed: 0,
    details: []
  };
  
  try {
    const tabs = document.querySelectorAll('[role="tab"], .tab-button, [data-testid*="tab"]');
    
    if (tabs.length === 0) {
      console.log('   ⚠️ No tabs found for navigation testing');
      results.skipped = true;
      return results;
    }
    
    console.log(`   Testing ${tabs.length} tabs...`);
    
    let totalSwitchTime = 0;
    let successfulSwitches = 0;
    
    for (let i = 0; i < Math.min(tabs.length, 4); i++) {
      const tab = tabs[i];
      const tabName = tab.textContent || tab.getAttribute('aria-label') || `Tab ${i + 1}`;
      
      console.log(`   Testing ${tabName}...`);
      
      const { duration } = measureTime(() => {
        tab.click();
      });
      
      // Wait for content to load
      await sleep(500);
      
      // Check if tab is active and content is visible
      const isActive = tab.getAttribute('aria-selected') === 'true' || 
                      tab.classList.contains('active') ||
                      tab.classList.contains('selected');
      
      const contentVisible = document.querySelector('.tab-content, [role="tabpanel"], .dashboard-content');
      
      if (isActive && contentVisible) {
        totalSwitchTime += duration;
        successfulSwitches++;
        
        const switchPassed = duration <= PERF_CONFIG.targetMetrics.tabSwitch;
        results.details.push({
          metric: `${tabName} Switch Time`,
          value: `${duration.toFixed(1)}ms`,
          target: `${PERF_CONFIG.targetMetrics.tabSwitch}ms`,
          passed: switchPassed
        });
      } else {
        results.details.push({
          metric: `${tabName} Switch`,
          value: 'Failed to activate',
          target: 'Should activate',
          passed: false
        });
      }
    }
    
    // Test average switch time
    if (successfulSwitches > 0) {
      const averageSwitchTime = totalSwitchTime / successfulSwitches;
      const averagePassed = averageSwitchTime <= PERF_CONFIG.targetMetrics.tabSwitch;
      
      results.details.push({
        metric: 'Average Tab Switch Time',
        value: `${averageSwitchTime.toFixed(1)}ms`,
        target: `${PERF_CONFIG.targetMetrics.tabSwitch}ms`,
        passed: averagePassed
      });
    }
    
    // Test frame rate during navigation
    console.log('   Measuring frame rate...');
    const frameRate = await getFrameRate();
    const frameRatePassed = frameRate >= 55; // Close to 60fps
    
    results.details.push({
      metric: 'Frame Rate',
      value: `${frameRate} fps`,
      target: '≥55 fps',
      passed: frameRatePassed
    });
    
    // Calculate results
    results.passed = results.details.filter(d => d.passed).length;
    results.failed = results.details.filter(d => !d.passed).length;
    
    console.log(`   ✅ Passed: ${results.passed}`);
    console.log(`   ❌ Failed: ${results.failed}`);
    
    return results;
    
  } catch (error) {
    console.error('   💥 Test failed with error:', error);
    results.error = error.message;
    return results;
  }
}

async function testInteractivePerformance() {
  console.log('\n🖱️ Testing Interactive Performance');
  console.log('-'.repeat(40));
  
  const results = {
    testName: 'Interactive Performance',
    passed: 0,
    failed: 0,
    details: []
  };
  
  try {
    // Test button responsiveness
    const buttons = document.querySelectorAll('button:not([disabled])');
    if (buttons.length > 0) {
      console.log('   Testing button responsiveness...');
      
      let totalResponseTime = 0;
      let buttonTests = 0;
      
      for (let i = 0; i < Math.min(buttons.length, 5); i++) {
        const button = buttons[i];
        const responseTime = simulateUserInteraction(button, 'click');
        totalResponseTime += responseTime;
        buttonTests++;
        
        await sleep(100); // Small delay between tests
      }
      
      const averageResponseTime = totalResponseTime / buttonTests;
      const buttonsPassed = averageResponseTime <= PERF_CONFIG.targetMetrics.fid;
      
      results.details.push({
        metric: 'Button Response Time',
        value: `${averageResponseTime.toFixed(1)}ms`,
        target: `${PERF_CONFIG.targetMetrics.fid}ms`,
        passed: buttonsPassed
      });
    }
    
    // Test input responsiveness
    const inputs = document.querySelectorAll('input[type="text"], input[type="search"], textarea');
    if (inputs.length > 0) {
      console.log('   Testing input responsiveness...');
      
      const input = inputs[0];
      const startTime = performance.now();
      
      // Simulate typing
      input.focus();
      input.value = 'test';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      
      const inputResponseTime = performance.now() - startTime;
      const inputPassed = inputResponseTime <= PERF_CONFIG.targetMetrics.fid;
      
      results.details.push({
        metric: 'Input Response Time',
        value: `${inputResponseTime.toFixed(1)}ms`,
        target: `${PERF_CONFIG.targetMetrics.fid}ms`,
        passed: inputPassed
      });
      
      // Clear the input
      input.value = '';
    }
    
    // Test scroll performance
    console.log('   Testing scroll performance...');
    const scrollableElements = document.querySelectorAll('[style*="overflow"], .overflow-auto, .overflow-y-auto');
    const scrollElement = scrollableElements.length > 0 ? scrollableElements[0] : document.documentElement;
    
    const scrollStartTime = performance.now();
    let scrollFrames = 0;
    
    const scrollTest = () => {
      scrollFrames++;
      if (performance.now() - scrollStartTime < 1000) {
        scrollElement.scrollTop += 10;
        requestAnimationFrame(scrollTest);
      }
    };
    
    requestAnimationFrame(scrollTest);
    await sleep(1000);
    
    const scrollFPS = scrollFrames;
    const scrollPassed = scrollFPS >= 55;
    
    results.details.push({
      metric: 'Scroll Performance',
      value: `${scrollFPS} fps`,
      target: '≥55 fps',
      passed: scrollPassed
    });
    
    // Reset scroll position
    scrollElement.scrollTop = 0;
    
    // Test search functionality if available
    const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="search" i], input[placeholder*="filter" i]');
    if (searchInputs.length > 0) {
      console.log('   Testing search performance...');
      
      const searchInput = searchInputs[0];
      const searchStartTime = performance.now();
      
      searchInput.focus();
      searchInput.value = 'test';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Wait for search results
      await sleep(500);
      
      const searchResponseTime = performance.now() - searchStartTime;
      const searchPassed = searchResponseTime <= PERF_CONFIG.targetMetrics.searchResponse;
      
      results.details.push({
        metric: 'Search Response Time',
        value: `${searchResponseTime.toFixed(0)}ms`,
        target: `${PERF_CONFIG.targetMetrics.searchResponse}ms`,
        passed: searchPassed
      });
      
      // Clear search
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // Calculate results
    results.passed = results.details.filter(d => d.passed).length;
    results.failed = results.details.filter(d => !d.passed).length;
    
    console.log(`   ✅ Passed: ${results.passed}`);
    console.log(`   ❌ Failed: ${results.failed}`);
    
    return results;
    
  } catch (error) {
    console.error('   💥 Test failed with error:', error);
    results.error = error.message;
    return results;
  }
}

async function testMemoryPerformance() {
  console.log('\n🧠 Testing Memory Performance');
  console.log('-'.repeat(40));
  
  const results = {
    testName: 'Memory Performance',
    passed: 0,
    failed: 0,
    details: []
  };
  
  try {
    const monitor = new PerformanceMonitor();
    
    // Initial memory measurement
    const initialMemory = monitor.measureMemoryUsage();
    if (!initialMemory) {
      console.log('   ⚠️ Memory measurement not supported in this browser');
      results.skipped = true;
      return results;
    }
    
    console.log('   Measuring initial memory usage...');
    const initialPassed = initialMemory.used <= PERF_CONFIG.targetMetrics.memoryLimit;
    
    results.details.push({
      metric: 'Initial Memory Usage',
      value: `${(initialMemory.used / 1024 / 1024).toFixed(1)} MB`,
      target: `${(PERF_CONFIG.targetMetrics.memoryLimit / 1024 / 1024).toFixed(0)} MB`,
      passed: initialPassed
    });
    
    // Stress test with tab switching
    console.log('   Performing memory stress test...');
    const tabs = document.querySelectorAll('[role="tab"], .tab-button');
    
    if (tabs.length > 1) {
      // Switch tabs multiple times
      for (let i = 0; i < 10; i++) {
        const tabIndex = i % tabs.length;
        tabs[tabIndex].click();
        await sleep(200);
      }
      
      // Force garbage collection if available
      if (window.gc) {
        window.gc();
      }
      
      await sleep(1000);
      
      const stressMemory = monitor.measureMemoryUsage();
      const memoryIncrease = stressMemory.used - initialMemory.used;
      const stressPassed = stressMemory.used <= PERF_CONFIG.targetMetrics.memoryLimit;
      
      results.details.push({
        metric: 'Memory After Stress Test',
        value: `${(stressMemory.used / 1024 / 1024).toFixed(1)} MB`,
        target: `${(PERF_CONFIG.targetMetrics.memoryLimit / 1024 / 1024).toFixed(0)} MB`,
        passed: stressPassed
      });
      
      const increaseReasonable = memoryIncrease <= (10 * 1024 * 1024); // 10MB increase is reasonable
      results.details.push({
        metric: 'Memory Increase',
        value: `${(memoryIncrease / 1024 / 1024).toFixed(1)} MB`,
        target: '≤10 MB',
        passed: increaseReasonable
      });
    }
    
    // Test for memory leaks
    console.log('   Testing for memory leaks...');
    const memoryMeasurements = [];
    
    for (let i = 0; i < 5; i++) {
      // Trigger some interactions
      const buttons = document.querySelectorAll('button');
      if (buttons.length > 0) {
        buttons[0].click();
      }
      
      await sleep(500);
      const memory = monitor.measureMemoryUsage();
      memoryMeasurements.push(memory.used);
    }
    
    // Check if memory is consistently increasing
    let increasingCount = 0;
    for (let i = 1; i < memoryMeasurements.length; i++) {
      if (memoryMeasurements[i] > memoryMeasurements[i - 1]) {
        increasingCount++;
      }
    }
    
    const noMemoryLeak = increasingCount < memoryMeasurements.length - 1;
    results.details.push({
      metric: 'Memory Leak Test',
      value: noMemoryLeak ? 'No leaks detected' : 'Potential leak detected',
      target: 'No leaks',
      passed: noMemoryLeak
    });
    
    monitor.cleanup();
    
    // Calculate results
    results.passed = results.details.filter(d => d.passed).length;
    results.failed = results.details.filter(d => !d.passed).length;
    
    console.log(`   ✅ Passed: ${results.passed}`);
    console.log(`   ❌ Failed: ${results.failed}`);
    
    return results;
    
  } catch (error) {
    console.error('   💥 Test failed with error:', error);
    results.error = error.message;
    return results;
  }
}

async function testNetworkPerformance() {
  console.log('\n🌐 Testing Network Performance');
  console.log('-'.repeat(40));
  
  const results = {
    testName: 'Network Performance',
    passed: 0,
    failed: 0,
    details: []
  };
  
  try {
    const monitor = new PerformanceMonitor();
    const networkMetrics = monitor.measureNetworkPerformance();
    
    console.log('   Analyzing network requests...');
    
    // Test total requests
    const requestsPassed = networkMetrics.totalRequests <= 50; // Reasonable limit
    results.details.push({
      metric: 'Total Network Requests',
      value: networkMetrics.totalRequests.toString(),
      target: '≤50',
      passed: requestsPassed
    });
    
    // Test total transfer size
    const transferSizeMB = networkMetrics.totalTransferSize / 1024 / 1024;
    const transferPassed = networkMetrics.totalTransferSize <= PERF_CONFIG.targetMetrics.bundleSize;
    results.details.push({
      metric: 'Total Transfer Size',
      value: `${transferSizeMB.toFixed(1)} MB`,
      target: `${(PERF_CONFIG.targetMetrics.bundleSize / 1024 / 1024).toFixed(1)} MB`,
      passed: transferPassed
    });
    
    // Test average response time
    const avgResponsePassed = networkMetrics.averageResponseTime <= 1000; // 1 second
    results.details.push({
      metric: 'Average Response Time',
      value: `${networkMetrics.averageResponseTime.toFixed(0)}ms`,
      target: '≤1000ms',
      passed: avgResponsePassed
    });
    
    // Test slowest request
    if (networkMetrics.slowestRequest.duration) {
      const slowestPassed = networkMetrics.slowestRequest.duration <= 3000; // 3 seconds
      results.details.push({
        metric: 'Slowest Request',
        value: `${networkMetrics.slowestRequest.duration.toFixed(0)}ms`,
        target: '≤3000ms',
        passed: slowestPassed
      });
    }
    
    // Test DOM content loaded time
    if (networkMetrics.domContentLoaded) {
      const domPassed = networkMetrics.domContentLoaded <= 2000; // 2 seconds
      results.details.push({
        metric: 'DOM Content Loaded',
        value: `${networkMetrics.domContentLoaded.toFixed(0)}ms`,
        target: '≤2000ms',
        passed: domPassed
      });
    }
    
    // Test page load time
    if (networkMetrics.pageLoad) {
      const pageLoadPassed = networkMetrics.pageLoad <= PERF_CONFIG.targetMetrics.dashboardLoad;
      results.details.push({
        metric: 'Page Load Time',
        value: `${networkMetrics.pageLoad.toFixed(0)}ms`,
        target: `${PERF_CONFIG.targetMetrics.dashboardLoad}ms`,
        passed: pageLoadPassed
      });
    }
    
    // Analyze bundle composition
    const bundleAnalysis = monitor.analyzeBundleSize();
    
    // Test JavaScript bundle size
    const jsBundleMB = bundleAnalysis.bundles.javascript.size / 1024 / 1024;
    const jsPassed = bundleAnalysis.bundles.javascript.size <= (1.5 * 1024 * 1024); // 1.5MB
    results.details.push({
      metric: 'JavaScript Bundle Size',
      value: `${jsBundleMB.toFixed(1)} MB`,
      target: '≤1.5 MB',
      passed: jsPassed
    });
    
    // Test CSS bundle size
    const cssBundleKB = bundleAnalysis.bundles.css.size / 1024;
    const cssPassed = bundleAnalysis.bundles.css.size <= (200 * 1024); // 200KB
    results.details.push({
      metric: 'CSS Bundle Size',
      value: `${cssBundleKB.toFixed(0)} KB`,
      target: '≤200 KB',
      passed: cssPassed
    });
    
    monitor.cleanup();
    
    // Calculate results
    results.passed = results.details.filter(d => d.passed).length;
    results.failed = results.details.filter(d => !d.passed).length;
    
    console.log(`   ✅ Passed: ${results.passed}`);
    console.log(`   ❌ Failed: ${results.failed}`);
    
    return results;
    
  } catch (error) {
    console.error('   💥 Test failed with error:', error);
    results.error = error.message;
    return results;
  }
}

// Main Performance Test Runner
async function runPerformanceTests() {
  console.log('🚀 Starting Comprehensive Performance Test Suite');
  console.log('=' .repeat(60));
  
  const startTime = performance.now();
  const allResults = [];
  
  try {
    // Initial performance assessment
    console.log('\n📊 Initial Performance Assessment');
    const initialMemory = new PerformanceMonitor().measureMemoryUsage();
    const initialNetwork = new PerformanceMonitor().measureNetworkPerformance();
    
    console.log(`Current URL: ${window.location.href}`);
    console.log(`Memory usage: ${initialMemory ? (initialMemory.used / 1024 / 1024).toFixed(1) + ' MB' : 'Not available'}`);
    console.log(`Network requests: ${initialNetwork.totalRequests}`);
    console.log(`Page load time: ${initialNetwork.pageLoad ? initialNetwork.pageLoad.toFixed(0) + 'ms' : 'Not available'}`);
    
    // Run all performance tests
    const tests = [
      testInitialLoadPerformance,
      testNavigationPerformance,
      testInteractivePerformance,
      testMemoryPerformance,
      testNetworkPerformance
    ];
    
    for (const test of tests) {
      try {
        const result = await test();
        allResults.push(result);
        await sleep(PERF_CONFIG.waitBetweenTests);
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
    
    // Generate comprehensive performance report
    const duration = performance.now() - startTime;
    
    console.log('\n' + '=' .repeat(60));
    console.log('📊 PERFORMANCE TEST RESULTS');
    console.log('=' .repeat(60));
    
    let totalPassed = 0;
    let totalFailed = 0;
    let totalSkipped = 0;
    const criticalIssues = [];
    const recommendations = [];
    
    allResults.forEach(result => {
      console.log(`\n📋 ${result.testName}:`);
      
      if (result.skipped) {
        console.log('   ⏭️ Skipped (not supported or no elements found)');
        totalSkipped++;
      } else if (result.error) {
        console.log(`   💥 Error: ${result.error}`);
        totalFailed++;
        criticalIssues.push(`${result.testName}: ${result.error}`);
      } else {
        console.log(`   ✅ Passed: ${result.passed}`);
        console.log(`   ❌ Failed: ${result.failed}`);
        totalPassed += result.passed;
        totalFailed += result.failed;
        
        // Show failed test details
        if (result.failed > 0) {
          const failedDetails = result.details.filter(d => !d.passed);
          failedDetails.forEach(detail => {
            console.log(`     ❌ ${detail.metric}: ${detail.value} (target: ${detail.target})`);
            
            // Add to critical issues if performance is very poor
            if (detail.metric.includes('Load') && parseFloat(detail.value) > 5000) {
              criticalIssues.push(`Slow ${detail.metric}: ${detail.value}`);
            }
            if (detail.metric.includes('Memory') && parseFloat(detail.value) > 150) {
              criticalIssues.push(`High ${detail.metric}: ${detail.value}`);
            }
          });
        }
      }
    });
    
    // Final performance assessment
    const finalMemory = new PerformanceMonitor().measureMemoryUsage();
    const finalNetwork = new PerformanceMonitor().measureNetworkPerformance();
    
    console.log('\n📈 FINAL PERFORMANCE ASSESSMENT:');
    console.log(`   Total Tests Passed: ${totalPassed}`);
    console.log(`   Total Tests Failed: ${totalFailed}`);
    console.log(`   Tests Skipped: ${totalSkipped}`);
    
    const successRate = totalPassed + totalFailed > 0 ? Math.round((totalPassed / (totalPassed + totalFailed)) * 100) : 0;
    console.log(`   Success Rate: ${successRate}%`);
    console.log(`   Test Duration: ${(duration / 1000).toFixed(1)}s`);
    
    // Performance grade
    let grade = 'F';
    if (successRate >= 90) grade = 'A';
    else if (successRate >= 80) grade = 'B';
    else if (successRate >= 70) grade = 'C';
    else if (successRate >= 60) grade = 'D';
    
    console.log(`   Performance Grade: ${grade}`);
    
    // Memory comparison
    if (finalMemory && initialMemory) {
      const memoryChange = finalMemory.used - initialMemory.used;
      console.log(`   Memory Change: ${(memoryChange / 1024 / 1024).toFixed(1)} MB`);
    }
    
    // Critical issues
    if (criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL PERFORMANCE ISSUES:');
      criticalIssues.forEach(issue => console.log(`   - ${issue}`));
    }
    
    // Generate recommendations
    if (totalFailed > 0) {
      recommendations.push('Optimize failed performance metrics');
    }
    if (criticalIssues.length > 0) {
      recommendations.push('Address critical performance issues immediately');
    }
    if (successRate < 80) {
      recommendations.push('Consider performance optimization sprint');
    }
    
    // Recommendations
    console.log('\n💡 PERFORMANCE RECOMMENDATIONS:');
    if (recommendations.length > 0) {
      recommendations.forEach(rec => console.log(`   - ${rec}`));
    } else {
      console.log('   - Performance is within acceptable ranges');
      console.log('   - Continue monitoring in production');
    }
    
    // Performance monitoring setup
    console.log('\n📊 PERFORMANCE MONITORING:');
    console.log('   - Set up continuous performance monitoring');
    console.log('   - Implement performance budgets');
    console.log('   - Regular performance audits recommended');
    
    console.log('\n✅ Performance test suite completed');
    
    return {
      totalPassed,
      totalFailed,
      totalSkipped,
      successRate,
      grade,
      duration,
      criticalIssues,
      recommendations,
      allResults
    };
    
  } catch (error) {
    console.error('💥 Performance test suite failed:', error);
    return { error: error.message };
  }
}

// Quick performance check
function quickPerformanceCheck() {
  console.log('⚡ Quick Performance Check');
  console.log('=' .repeat(40));
  
  const monitor = new PerformanceMonitor();
  const memory = monitor.measureMemoryUsage();
  const network = monitor.measureNetworkPerformance();
  const bundle = monitor.analyzeBundleSize();
  
  console.log(`Memory usage: ${memory ? (memory.used / 1024 / 1024).toFixed(1) + ' MB' : 'Not available'}`);
  console.log(`Network requests: ${network.totalRequests}`);
  console.log(`Total transfer: ${(network.totalTransferSize / 1024 / 1024).toFixed(1)} MB`);
  console.log(`JavaScript bundle: ${(bundle.bundles.javascript.size / 1024 / 1024).toFixed(1)} MB`);
  console.log(`CSS bundle: ${(bundle.bundles.css.size / 1024).toFixed(0)} KB`);
  console.log(`Page load time: ${network.pageLoad ? network.pageLoad.toFixed(0) + 'ms' : 'Not available'}`);
  
  // Quick assessment
  const issues = [];
  if (memory && memory.used > PERF_CONFIG.targetMetrics.memoryLimit) {
    issues.push('High memory usage');
  }
  if (network.totalTransferSize > PERF_CONFIG.targetMetrics.bundleSize) {
    issues.push('Large bundle size');
  }
  if (network.pageLoad && network.pageLoad > PERF_CONFIG.targetMetrics.dashboardLoad) {
    issues.push('Slow page load');
  }
  
  console.log(`Performance status: ${issues.length === 0 ? '✅ Good' : '⚠️ ' + issues.length + ' issues'}`);
  
  if (issues.length > 0) {
    console.log('Issues found:');
    issues.forEach(issue => console.log(`  - ${issue}`));
  }
  
  monitor.cleanup();
  
  return { memory, network, bundle, issues };
}

// Export performance test functions
window.performanceTests = {
  runAll: runPerformanceTests,
  quickCheck: quickPerformanceCheck,
  testLoad: testInitialLoadPerformance,
  testNavigation: testNavigationPerformance,
  testInteractive: testInteractivePerformance,
  testMemory: testMemoryPerformance,
  testNetwork: testNetworkPerformance,
  monitor: PerformanceMonitor
};

console.log('\n💡 Available performance test commands:');
console.log('   performanceTests.runAll() - Run complete performance test suite');
console.log('   performanceTests.quickCheck() - Quick performance assessment');
console.log('   performanceTests.testLoad() - Test initial load performance');
console.log('   performanceTests.testNavigation() - Test navigation performance');
console.log('   performanceTests.testInteractive() - Test interactive performance');
console.log('   performanceTests.testMemory() - Test memory performance');
console.log('   performanceTests.testNetwork() - Test network performance');

// Auto-run quick check
console.log('\n🔄 Running quick performance check...');
setTimeout(() => {
  quickPerformanceCheck();
}, 1000);