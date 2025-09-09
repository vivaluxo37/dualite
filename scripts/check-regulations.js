const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://efxpwrnxdorgzcqhbnfn.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAzMzIzNSwiZXhwIjoyMDcyNjA5MjM1fQ.BKmSaW8dSc6soQZOh7zZGXMNO-evJZkSbLVJzxoYSYA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRegulations() {
  try {
    console.log('🔍 Analyzing broker regulation data...');
    
    // Get all brokers with their regulation info
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('id, name, regulations')
      .order('name');
    
    if (error) {
      console.error('❌ Error fetching brokers:', error);
      return;
    }
    
    console.log(`📊 Total brokers: ${brokers.length}`);
    
    // Analyze regulation patterns
    const regulationPatterns = {};
    const emptyRegulations = [];
    const shortRegulations = [];
    const suspiciousRegulations = [];
    
    brokers.forEach(broker => {
      const reg = String(broker.regulations || '').trim();
      
      // Count empty or very short regulations
      if (!reg || reg.length === 0) {
        emptyRegulations.push(broker.name);
      } else if (reg.length < 10) {
        shortRegulations.push({ name: broker.name, regulation: reg });
      }
      
      // Check for suspicious patterns
      if (reg.includes('Unknown') || reg.includes('N/A') || reg.includes('TBD') || reg.includes('None')) {
        suspiciousRegulations.push({ name: broker.name, regulation: reg });
      }
      
      // Count regulation patterns
      const regKey = reg.substring(0, 50); // First 50 chars
      regulationPatterns[regKey] = (regulationPatterns[regKey] || 0) + 1;
    });
    
    console.log('\n📈 Regulation Analysis:');
    console.log(`   ❌ Empty regulations: ${emptyRegulations.length}`);
    console.log(`   ⚠️ Very short regulations: ${shortRegulations.length}`);
    console.log(`   🚨 Suspicious regulations: ${suspiciousRegulations.length}`);
    
    if (emptyRegulations.length > 0) {
      console.log('\n❌ Brokers with empty regulations:');
      emptyRegulations.slice(0, 10).forEach(name => console.log(`   - ${name}`));
      if (emptyRegulations.length > 10) {
        console.log(`   ... and ${emptyRegulations.length - 10} more`);
      }
    }
    
    if (shortRegulations.length > 0) {
      console.log('\n⚠️ Brokers with very short regulations:');
      shortRegulations.slice(0, 10).forEach(item => {
        console.log(`   - ${item.name}: "${item.regulation}"`);
      });
      if (shortRegulations.length > 10) {
        console.log(`   ... and ${shortRegulations.length - 10} more`);
      }
    }
    
    if (suspiciousRegulations.length > 0) {
      console.log('\n🚨 Brokers with suspicious regulations:');
      suspiciousRegulations.slice(0, 10).forEach(item => {
        console.log(`   - ${item.name}: "${item.regulation}"`);
      });
      if (suspiciousRegulations.length > 10) {
        console.log(`   ... and ${suspiciousRegulations.length - 10} more`);
      }
    }
    
    // Show most common regulation patterns
    console.log('\n📋 Most common regulation patterns:');
    const sortedPatterns = Object.entries(regulationPatterns)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    sortedPatterns.forEach(([pattern, count]) => {
      if (count > 1) {
        console.log(`   ${count}x: "${pattern}${pattern.length === 50 ? '...' : ''}"`);
      }
    });
    
    // Sample of good regulations
    console.log('\n🌟 Sample of well-regulated brokers:');
    const wellRegulated = brokers
      .filter(b => b.regulations && b.regulations.length > 50 && !b.regulations.includes('Unknown'))
      .slice(0, 5);
    
    wellRegulated.forEach(broker => {
      const shortReg = broker.regulations.substring(0, 80) + (broker.regulations.length > 80 ? '...' : '');
      console.log(`   📈 ${broker.name}: ${shortReg}`);
    });
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

checkRegulations();