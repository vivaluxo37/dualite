import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function deleteTestBrokersWithAdmin() {
  console.log('🗑️ Deleting brokers with "test" in name using SERVICE ROLE KEY...')
  
  try {
    // First, let's see what we have
    console.log('📋 Current brokers with "test" in name:')
    const { data: currentBrokers, error: checkError } = await supabase
      .from('brokers')
      .select('id, name, slug')
      .ilike('name', '%test%')
    
    if (checkError) {
      console.error('❌ Error checking brokers:', checkError)
      return
    }
    
    console.log('Found brokers:', currentBrokers)
    
    if (currentBrokers.length === 0) {
      console.log('✅ No brokers with "test" in name found!')
      return
    }
    
    // Delete all test brokers in one operation
    console.log('🗑️ Deleting all test brokers...')
    const { data: deleteResult, error: deleteError } = await supabase
      .from('brokers')
      .delete()
      .ilike('name', '%test%')
      .select()
    
    if (deleteError) {
      console.error('❌ Error deleting test brokers:', deleteError)
    } else {
      console.log('✅ Delete result:', deleteResult)
    }
    
    // Verify deletion
    console.log('\n🔍 Verifying deletion...')
    const { data: remainingBrokers, error: verifyError } = await supabase
      .from('brokers')
      .select('id, name')
      .ilike('name', '%test%')
    
    if (verifyError) {
      console.error('❌ Error verifying deletion:', verifyError)
    } else {
      console.log('📊 Remaining brokers with "test" in name:', remainingBrokers)
      if (remainingBrokers.length === 0) {
        console.log('🎉 All test brokers successfully deleted!')
      } else {
        console.log(`⚠️  ${remainingBrokers.length} test brokers remain`)
      }
    }
    
    // Show all remaining brokers for verification
    console.log('\n📋 All remaining brokers:')
    const { data: allBrokers, error: allError } = await supabase
      .from('brokers')
      .select('id, name, slug')
      .order('name')
    
    if (allError) {
      console.error('❌ Error getting all brokers:', allError)
    } else {
      console.log(`📊 Total brokers remaining: ${allBrokers.length}`)
      allBrokers.forEach(broker => {
        console.log(`  - ${broker.name} (${broker.slug})`)
      })
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

deleteTestBrokersWithAdmin()