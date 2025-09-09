const { createClient } = require('@supabase/supabase-js');
const fs = require('fs/promises');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function generateBrokerPages() {
  try {
    console.log('Fetching broker data from Supabase...');
    
    // Fetch all active brokers
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching brokers:', error);
      return;
    }

    console.log(`Found ${brokers.length} active brokers`);

    // Create pages directory if it doesn't exist
    const pagesDir = path.join(process.cwd(), 'src', 'pages', 'brokers');
    await fs.mkdir(pagesDir, { recursive: true });

    // Generate a page for each broker
    for (const broker of brokers) {
      const fileName = `${broker.slug}.tsx`;
      const filePath = path.join(pagesDir, fileName);
      
      const pageContent = generateBrokerPageContent(broker);
      
      await fs.writeFile(filePath, pageContent, 'utf8');
      console.log(`Generated page for ${broker.name}: ${fileName}`);
    }

    console.log(`Successfully generated ${brokers.length} broker pages`);
    
  } catch (error) {
    console.error('Error generating broker pages:', error);
  }
}

function generateBrokerPageContent(broker) {
  return `import React from 'react';
import { EnhancedBrokerProfilePage } from '../EnhancedBrokerProfilePage';

const ${broker.name.replace(/[^a-zA-Z0-9]/g, '')}Page: React.FC = () => {
  return <EnhancedBrokerProfilePage brokerId="${broker.id}" />;
};

export default ${broker.name.replace(/[^a-zA-Z0-9]/g, '')}Page;
`;
}

// Run the script
generateBrokerPages();