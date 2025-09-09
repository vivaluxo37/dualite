const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkNullFields() {
  try {
    console.log('Checking for NULL/empty fields in broker data...');
    
    const { data, error } = await supabase
      .from('brokers')
      .select('*');
    
    if (error) {
      console.error('Error fetching brokers:', error);
      return;
    }
    
    console.log(`Total brokers: ${data.length}`);
    
    const nullCounts = {};
    const sampleNulls = {};
    
    // Check each broker for null/empty fields
    data.forEach((broker, index) => {
      Object.keys(broker).forEach(field => {
        const value = broker[field];
        if (value === null || value === undefined || value === '' || 
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === 'object' && value !== null && Object.keys(value).length === 0)) {
          nullCounts[field] = (nullCounts[field] || 0) + 1;
          if (!sampleNulls[field]) {
            sampleNulls[field] = broker.name || broker.slug || `Broker ${index + 1}`;
          }
        }
      });
    });
    
    console.log('\n=== NULL/EMPTY FIELD ANALYSIS ===');
    
    if (Object.keys(nullCounts).length === 0) {
      console.log('✅ No NULL or empty fields found!');
      return;
    }
    
    // Sort by count (highest first)
    const sortedFields = Object.entries(nullCounts)
      .sort((a, b) => b[1] - a[1]);
    
    console.log('\nFields with NULL/empty values:');
    sortedFields.forEach(([field, count]) => {
      const percentage = ((count / data.length) * 100).toFixed(1);
      console.log(`📊 ${field}: ${count} nulls (${percentage}%) - Sample: ${sampleNulls[field]}`);
    });
    
    // Focus on critical fields
    const criticalFields = [
      'year_founded', 'min_deposit', 'spreads', 'leverage', 
      'trust_score', 'fees', 'pros', 'cons'
    ];
    
    console.log('\n=== CRITICAL FIELDS STATUS ===');
    criticalFields.forEach(field => {
      const count = nullCounts[field] || 0;
      const percentage = ((count / data.length) * 100).toFixed(1);
      const status = count === 0 ? '✅' : '❌';
      console.log(`${status} ${field}: ${count} nulls (${percentage}%)`);
    });
    
    // Sample data for fields with issues
    console.log('\n=== SAMPLE DATA FOR PROBLEMATIC FIELDS ===');
    const problemFields = criticalFields.filter(field => nullCounts[field] > 0);
    
    if (problemFields.length > 0) {
      const sampleBroker = data.find(broker => 
        problemFields.some(field => 
          broker[field] === null || broker[field] === undefined || broker[field] === ''
        )
      );
      
      if (sampleBroker) {
        console.log(`\nSample broker with issues: ${sampleBroker.name}`);
        problemFields.forEach(field => {
          console.log(`  ${field}: ${JSON.stringify(sampleBroker[field])}`);
        });
      }
    }
    
  } catch (error) {
    console.error('Script error:', error);
  }
}

checkNullFields();