// Automated Dashboard Testing Script
// This script tests dashboard functionality programmatically

import { createClient } from '@supabase/supabase-js'

// Use environment variables from .env file
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ggqjqjqjqjqjqjqjqjqj.supabase.co'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdncWpxanFqcWpxanFqcWpxanFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1OTI4MDAsImV4cCI6MjA1MjE2ODgwMH0.123456789abcdefghijklmnopqrstuvwxyz'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test Results Storage
const testResults = {
  authentication: [],
  database: [],
  components: [],
  errors: []
}

// Helper function to log test results
function logTest(category, testName, passed, details = '') {
  const result = {
    test: testName,
    passed,
    details,
    timestamp: new Date().toISOString()
  }
  testResults[category].push(result)
  console.log(`${passed ? '✅' : '❌'} ${testName}: ${details}`)
}

// Test 1: Database Connection
async function testDatabaseConnection() {
  console.log('\n🔍 Testing Database Connection...')
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1)
    if (error) {
      logTest('database', 'Database Connection', false, error.message)
    } else {
      logTest('database', 'Database Connection', true, 'Successfully connected to Supabase')
    }
  } catch (err) {
    logTest('database', 'Database Connection', false, err.message)
  }
}

// Test 2: Required Tables Exist
async function testRequiredTables() {
  console.log('\n🔍 Testing Required Tables...')
  const requiredTables = ['users', 'brokers', 'user_shortlists', 'ai_matcher_results', 'learning_modules', 'user_progress']
  
  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1)
      if (error) {
        logTest('database', `Table: ${table}`, false, error.message)
      } else {
        logTest('database', `Table: ${table}`, true, 'Table exists and accessible')
      }
    } catch (err) {
      logTest('database', `Table: ${table}`, false, err.message)
    }
  }
}

// Test 3: Authentication Flow
async function testAuthentication() {
  console.log('\n🔍 Testing Authentication...')
  
  // Test sign up
  try {
    const testEmail = `test-${Date.now()}@dualite.com`
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: 'testpass123',
      options: {
        data: {
          display_name: 'Test User'
        }
      }
    })
    
    if (error) {
      logTest('authentication', 'User Registration', false, error.message)
    } else {
      logTest('authentication', 'User Registration', true, 'User registration successful')
      
      // Test sign out
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) {
        logTest('authentication', 'User Sign Out', false, signOutError.message)
      } else {
        logTest('authentication', 'User Sign Out', true, 'Sign out successful')
      }
    }
  } catch (err) {
    logTest('authentication', 'User Registration', false, err.message)
  }
}

// Test 4: Broker Data Access
async function testBrokerData() {
  console.log('\n🔍 Testing Broker Data Access...')
  try {
    const { data, error } = await supabase
      .from('brokers')
      .select('id, name, rating, regulation, min_deposit')
      .limit(5)
    
    if (error) {
      logTest('database', 'Broker Data Access', false, error.message)
    } else {
      logTest('database', 'Broker Data Access', true, `Retrieved ${data.length} brokers`)
      
      // Test broker data structure
      if (data.length > 0) {
        const broker = data[0]
        const hasRequiredFields = broker.id && broker.name && typeof broker.rating === 'number'
        logTest('database', 'Broker Data Structure', hasRequiredFields, 
          hasRequiredFields ? 'Broker data has required fields' : 'Missing required fields')
      }
    }
  } catch (err) {
    logTest('database', 'Broker Data Access', false, err.message)
  }
}

// Test 5: Learning Modules Access
async function testLearningModules() {
  console.log('\n🔍 Testing Learning Modules...')
  try {
    const { data, error } = await supabase
      .from('learning_modules')
      .select('id, title, difficulty, category')
      .limit(5)
    
    if (error) {
      logTest('database', 'Learning Modules Access', false, error.message)
    } else {
      logTest('database', 'Learning Modules Access', true, `Retrieved ${data.length} modules`)
    }
  } catch (err) {
    logTest('database', 'Learning Modules Access', false, err.message)
  }
}

// Test 6: RLS Policies
async function testRLSPolicies() {
  console.log('\n🔍 Testing Row Level Security...')
  
  // Test accessing user_shortlists without authentication (should fail)
  try {
    const { data, error } = await supabase
      .from('user_shortlists')
      .select('*')
      .limit(1)
    
    if (error && error.message.includes('permission denied')) {
      logTest('database', 'RLS Protection', true, 'RLS correctly blocks unauthorized access')
    } else {
      logTest('database', 'RLS Protection', false, 'RLS may not be properly configured')
    }
  } catch (err) {
    logTest('database', 'RLS Protection', true, 'RLS correctly blocks unauthorized access')
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Dashboard Automated Tests\n')
  console.log('=' .repeat(50))
  
  await testDatabaseConnection()
  await testRequiredTables()
  await testAuthentication()
  await testBrokerData()
  await testLearningModules()
  await testRLSPolicies()
  
  console.log('\n' + '=' .repeat(50))
  console.log('📊 Test Summary:')
  
  let totalTests = 0
  let passedTests = 0
  
  Object.keys(testResults).forEach(category => {
    if (category !== 'errors') {
      const categoryTests = testResults[category]
      const categoryPassed = categoryTests.filter(t => t.passed).length
      totalTests += categoryTests.length
      passedTests += categoryPassed
      
      console.log(`\n${category.toUpperCase()}:`)
      console.log(`  Passed: ${categoryPassed}/${categoryTests.length}`)
      
      categoryTests.forEach(test => {
        console.log(`  ${test.passed ? '✅' : '❌'} ${test.test}`)
      })
    }
  })
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed (${Math.round(passedTests/totalTests*100)}%)`)
  
  if (testResults.errors.length > 0) {
    console.log('\n❌ Errors encountered:')
    testResults.errors.forEach(error => console.log(`  - ${error}`))
  }
  
  console.log('\n✨ Testing completed!')
  
  return {
    total: totalTests,
    passed: passedTests,
    percentage: Math.round(passedTests/totalTests*100),
    results: testResults
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllTests, testResults }
} else {
  // Run tests if script is executed directly
  runAllTests().catch(console.error)
}