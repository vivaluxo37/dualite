import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function testBrokerPages() {
  console.log('🧪 Testing Broker Data in Database...')
  console.log('==================================')
  
  try {
    // Test a few key brokers to verify data was updated
    const testBrokers = ['admirals', 'avatrade', 'pepperstone', 'ig-group', 'oanda']
    
    for (const brokerSlug of testBrokers) {
      console.log(`\n🔍 Testing: ${brokerSlug}`)
      
      const { data: broker, error } = await supabase
        .from('brokers')
        .select('*')
        .eq('slug', brokerSlug)
        .single()
      
      if (error) {
        console.log(`❌ Error: ${error.message}`)
        continue
      }
      
      if (broker) {
        console.log(`✅ Found: ${broker.name}`)
        console.log(`   - Founded: ${broker.established_year}`)
        console.log(`   - Headquarters: ${broker.headquarters_location}`)
        console.log(`   - Min Deposit: $${broker.min_deposit}`)
        console.log(`   - Trust Score: ${broker.trust_score}`)
        console.log(`   - Regulations: ${broker.regulations ? broker.regulations.join(', ') : 'NULL'}`)
        console.log(`   - Platforms: ${broker.platforms ? broker.platforms.slice(0, 3).join(', ') : 'NULL'}...`)
        console.log(`   - Instruments: ${broker.trading_instruments ? broker.trading_instruments.slice(0, 3).join(', ') : 'NULL'}...`)
        
        // Check if key fields are populated
        const hasData = broker.established_year && broker.headquarters_location && 
                       broker.regulations && broker.platforms && broker.trading_instruments
        console.log(`   - Data Status: ${hasData ? '✅ Complete' : '❌ Incomplete'}`)
      }
    }
    
    console.log('\n📊 Overall Database Status:')
    const { data: allBrokers, error: allError } = await supabase
      .from('brokers')
      .select('id, name, slug, established_year, headquarters_location, trust_score')
    
    if (allError) {
      console.error('❌ Error getting all brokers:', allError)
      return
    }
    
    const completeBrokers = allBrokers.filter(b => b.established_year && b.headquarters_location)
    const incompleteBrokers = allBrokers.filter(b => !b.established_year || !b.headquarters_location)
    
    console.log(`✅ Complete records: ${completeBrokers.length}`)
    console.log(`❌ Incomplete records: ${incompleteBrokers.length}`)
    console.log(`📊 Total brokers: ${allBrokers.length}`)
    
    if (incompleteBrokers.length > 0) {
      console.log('\n⚠️  Incomplete brokers:')
      incompleteBrokers.forEach(broker => {
        console.log(`   - ${broker.name} (${broker.slug})`)
      })
    }
    
    console.log('\n✅ Database verification completed!')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

testBrokerPages()