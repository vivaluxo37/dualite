require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function validateEnrichment() {
  console.log('🔍 Running validation...');
  
  try {
    const { data, error } = await supabase
      .from('brokers')
      .select('id, name, established_year, trust_score, pros, cons, min_deposit');
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    const nullCounts = {
      established_year: 0,
      trust_score: 0,
      pros: 0,
      cons: 0,
      min_deposit: 0
    };
    
    data.forEach(broker => {
      if (!broker.established_year) nullCounts.established_year++;
      if (!broker.trust_score) nullCounts.trust_score++;
      if (!broker.pros) nullCounts.pros++;
      if (!broker.cons) nullCounts.cons++;
      if (!broker.min_deposit) nullCounts.min_deposit++;
    });
    
    console.log('📈 Validation Summary:');
    console.log(`   - Total brokers: ${data.length}`);
    console.log(`   - Missing established year: ${nullCounts.established_year}`);
    console.log(`   - Missing trust score: ${nullCounts.trust_score}`);
    console.log(`   - Missing pros: ${nullCounts.pros}`);
    console.log(`   - Missing cons: ${nullCounts.cons}`);
    console.log(`   - Missing min deposit: ${nullCounts.min_deposit}`);
    
    const completionRate = ((data.length - nullCounts.established_year) / data.length * 100).toFixed(1);
    console.log(`✅ Established year completion rate: ${completionRate}%`);
    
    // Show some examples of enriched data
    const enrichedBrokers = data.filter(b => b.established_year && b.trust_score && b.pros && b.cons).slice(0, 5);
    console.log('\n📊 Sample enriched brokers:');
    enrichedBrokers.forEach(broker => {
      console.log(`   - ${broker.name}: Est. ${broker.established_year}, Trust: ${broker.trust_score}`);
    });
    
  } catch (error) {
    console.error('Validation failed:', error);
  }
}

validateEnrichment();