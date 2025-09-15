const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://efxpwrnxdorgzcqhbnfn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMzMyMzUsImV4cCI6MjA3MjYwOTIzNX0.q2qAWQgNE1lTCTA8MBdzeNCm5rtL5a_7o4E1Hf_tmzQ'
);

async function checkBrokerLogos() {
  try {
    const { data, error } = await supabase
      .from('brokers')
      .select('name, logo_url, website_url');
    
    if (error) {
      console.error('Error fetching brokers:', error);
      return;
    }
    
    console.log('Current Broker Logo Status:');
    console.log('==========================');
    
    data.forEach(broker => {
      const hasLogo = broker.logo_url ? '✅' : '❌';
      console.log(`${hasLogo} ${broker.name}: ${broker.logo_url || 'No logo URL'}`);
    });
    
    console.log('\nSummary:');
    const withLogos = data.filter(b => b.logo_url).length;
    const withoutLogos = data.filter(b => !b.logo_url).length;
    console.log(`Brokers with logos: ${withLogos}`);
    console.log(`Brokers without logos: ${withoutLogos}`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkBrokerLogos();