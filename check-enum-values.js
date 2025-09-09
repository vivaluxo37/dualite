import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function checkEnumValues() {
  console.log('Checking regulation_tier enum values...')
  
  try {
    // Get current brokers to see what regulation_tier values exist
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('name, regulation_tier')
      .limit(10)
    
    if (error) {
      console.error('Error fetching brokers:', error)
      return
    }
    
    console.log('\nCurrent regulation_tier values in database:')
    const uniqueValues = [...new Set(brokers.map(b => b.regulation_tier))]
    uniqueValues.forEach(value => {
      console.log(`- "${value}"`)
    })
    
    console.log('\nAll brokers with their regulation_tier:')
    brokers.forEach(broker => {
      console.log(`- ${broker.name}: "${broker.regulation_tier}"`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  }
}

checkEnumValues()