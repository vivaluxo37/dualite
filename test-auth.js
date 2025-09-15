// Test script to create a test user for dashboard testing
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ggqjqjqjqjqjqjqjqjqj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdncWpxanFqcWpxanFqcWpxanFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1OTI4MDAsImV4cCI6MjA1MjE2ODgwMH0.123456789abcdefghijklmnopqrstuvwxyz'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createTestUser() {
  try {
    // Create test user
    const { data, error } = await supabase.auth.signUp({
      email: 'test@brokeranalysis.com',
      password: 'testpass123',
      options: {
        data: {
          display_name: 'Test User'
        }
      }
    })
    
    if (error) {
      console.error('Error creating test user:', error.message)
    } else {
      console.log('Test user created successfully:', data)
    }
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

// Run the test
createTestUser()

console.log('Test credentials:')
console.log('Email: test@brokeranalysis.com')
console.log('Password: testpass123')