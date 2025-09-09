import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function checkBrokerSchema() {
  console.log('Checking brokers table schema...')
  
  try {
    // Get a sample broker to see the actual columns
    const { data: sampleBroker, error } = await supabase
      .from('brokers')
      .select('*')
      .limit(1)
      .single()
    
    if (error) {
      console.error('Error fetching sample broker:', error)
      return
    }
    
    console.log('\nAvailable columns in brokers table:')
    console.log('=====================================\n')
    
    Object.keys(sampleBroker).forEach(column => {
      console.log(`- ${column}: ${typeof sampleBroker[column]} (${sampleBroker[column]})`)
    })
    
    console.log('\n\nSample broker data:')
    console.log('===================')
    console.log(JSON.stringify(sampleBroker, null, 2))
    
  } catch (error) {
    console.error('Error checking schema:', error)
  }
}

checkBrokerSchema()