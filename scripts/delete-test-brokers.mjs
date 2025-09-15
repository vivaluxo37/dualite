import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function deleteTestBrokers() {
  console.log('🗑️ Deleting brokers with "test" in name...')
  
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
    
    // Delete each broker individually
    for (const broker of currentBrokers) {
      console.log(`🗑️ Deleting: ${broker.name} (ID: ${broker.id})`)
      
      const { error } = await supabase
        .from('brokers')
        .delete()
        .eq('id', broker.id)
      
      if (error) {
        console.error(`❌ Error deleting ${broker.name}:`, error)
      } else {
        console.log(`✅ Successfully deleted ${broker.name}`)
      }
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
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

deleteTestBrokers()