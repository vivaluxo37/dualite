require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Logo directory path
const logoDir = 'c:\\Users\\LENOVO\\Desktop\\dualite\\Broker reviews │ BrokerChooser';

// Manual mapping for high-confidence matches
const manualMappings = {
  // Exact matches we can be confident about
  'imgi_10_admirals-admiral-markets-review.png': 'Admirals',
  'imgi_11_forex.com-review.png': 'Forex.com',
  'imgi_12_webull-review.png': 'Webull',
  'imgi_13_plus500-review.png': 'Plus500',
  'imgi_14_etoro-review.png': 'eToro',
  'imgi_15_ig-review.png': 'IG Markets',
  'imgi_16_pepperstone-review.png': 'Pepperstone',
  'imgi_17_oanda-review.png': 'OANDA',
  'imgi_18_xm-review.png': 'XM',
  'imgi_19_avatrade-review.png': 'AvaTrade',
  'imgi_20_fxtm-review.png': 'FXTM',
  'imgi_21_ic-markets-review.png': 'IC Markets',
  'imgi_22_fxpro-review.png': 'FxPro',
  'imgi_23_hotforex-review.png': 'HotForex',
  'imgi_24_exness-review.png': 'Exness',
  'imgi_25_tickmill-review.png': 'Tickmill',
  'imgi_26_fbs-review.png': 'FBS',
  'imgi_27_alpari-review.png': 'Alpari',
  'imgi_28_ironfx-review.png': 'IronFX',
  'imgi_29_instaforex-review.png': 'Insta',
  'imgi_30_libertex-review.png': 'Libertex',
  'imgi_31_roboforex-review.png': 'Robo',
  'imgi_32_markets.com-review.png': 'Markets.com',
  'imgi_33_xtb-review.png': 'XTB',
  'imgi_34_saxo-bank-review.png': 'Saxo Bank',
  'imgi_35_interactive-brokers-review.png': 'Interactive s',
  'imgi_36_td-ameritrade-review.png': 'TD Ameritrade',
  'imgi_37_charles-schwab-review.png': 'Charles Schwab',
  'imgi_38_fidelity-review.png': 'Fidelity',
  'imgi_39_e-trade-review.png': 'E Trade',
  'imgi_40_robinhood-review.png': 'Robinhood',
  'imgi_41_questrade-review.png': 'Questrade',
  'imgi_42_trading212-review.png': 'Trading 212',
  'imgi_43_degiro-review.png': 'DEGIRO',
  'imgi_44_swissquote-review.png': 'Swissquote',
  'imgi_45_revolut-review.png': 'Revolut',
  'imgi_46_vanguard-review.png': 'Vanguard',
  'imgi_47_kraken-review.png': 'Kraken',
  'imgi_48_coinbase-review.png': 'Coinbase',
  'imgi_49_binance-review.png': 'Binance',
  'imgi_50_bitfinex-review.png': 'Bitfinex'
};

// Function to extract broker name from filename
function extractBrokerName(filename) {
  // Check manual mapping first
  if (manualMappings[filename]) {
    return manualMappings[filename];
  }
  
  // Remove file extension
  let name = filename.replace(/\.(png|jpg|jpeg|webp)$/i, '');
  
  // Remove common prefixes
  name = name.replace(/^imgi_\d+_/, '');
  
  // Remove common suffixes
  name = name.replace(/-review.*$/, '');
  name = name.replace(/-logo.*$/, '');
  name = name.replace(/\s+\(\d+\)$/, ''); // Remove (1), (2) etc.
  
  // Convert dashes and underscores to spaces
  name = name.replace(/[-_]/g, ' ');
  
  // Clean up multiple spaces
  name = name.replace(/\s+/g, ' ').trim();
  
  // Capitalize words
  name = name.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
  
  return name;
}

// Function to find broker by name or slug
function findBroker(extractedName, brokers) {
  // Exact name match
  let broker = brokers.find(b => b.name.toLowerCase() === extractedName.toLowerCase());
  if (broker) return broker;
  
  // Partial name match
  broker = brokers.find(b => 
    b.name.toLowerCase().includes(extractedName.toLowerCase()) ||
    extractedName.toLowerCase().includes(b.name.toLowerCase())
  );
  if (broker) return broker;
  
  // Slug match
  const slugName = extractedName.toLowerCase().replace(/\s+/g, '-');
  broker = brokers.find(b => b.slug.includes(slugName) || slugName.includes(b.slug.replace(/-year$/, '')));
  if (broker) return broker;
  
  return null;
}

async function uploadBrokerLogos() {
  try {
    console.log('Fetching brokers from database...');
    
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('id, name, slug, logo_url')
      .order('name');

    if (error) {
      console.error('Error fetching brokers:', error);
      return;
    }

    console.log(`Found ${brokers.length} brokers in database`);
    console.log('Processing logo files...');
    
    // Read logo directory
    const files = fs.readdirSync(logoDir)
      .filter(file => /\.(png|jpg|jpeg|webp)$/i.test(file))
      .sort();
    
    console.log(`Found ${files.length} logo files`);
    
    let uploaded = 0;
    let skipped = 0;
    let errors = 0;
    const results = [];
    
    for (const file of files) {
      try {
        const extractedName = extractBrokerName(file);
        const broker = findBroker(extractedName, brokers);
        
        if (!broker) {
          console.log(`❌ No match found for: ${file} (extracted: "${extractedName}")`);
          skipped++;
          continue;
        }
        
        // Check if broker already has a real logo (not default)
        if (broker.logo_url && broker.logo_url.trim() !== '' && !broker.logo_url.includes('default-logo.png')) {
          console.log(`⏭️  Skipping ${broker.name} - already has real logo: ${broker.logo_url}`);
          skipped++;
          continue;
        }
        
        // Read the file
        const filePath = path.join(logoDir, file);
        const fileBuffer = fs.readFileSync(filePath);
        const fileExt = path.extname(file).toLowerCase();
        const fileName = `${broker.slug}${fileExt}`;
        
        console.log(`📤 Uploading logo for ${broker.name}...`);
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('broker-logos')
          .upload(fileName, fileBuffer, {
            contentType: `image/${fileExt.replace('.', '')}`,
            upsert: true
          });
        
        if (uploadError) {
          console.error(`❌ Upload error for ${broker.name}:`, uploadError);
          errors++;
          continue;
        }
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('broker-logos')
          .getPublicUrl(fileName);
        
        const logoUrl = urlData.publicUrl;
        
        // Update broker record
        const { error: updateError } = await supabase
          .from('brokers')
          .update({ logo_url: logoUrl })
          .eq('id', broker.id);
        
        if (updateError) {
          console.error(`❌ Database update error for ${broker.name}:`, updateError);
          errors++;
          continue;
        }
        
        console.log(`✅ Successfully uploaded logo for ${broker.name}`);
        uploaded++;
        
        results.push({
          broker: broker.name,
          file: file,
          logoUrl: logoUrl,
          status: 'success'
        });
        
      } catch (fileError) {
        console.error(`❌ Error processing ${file}:`, fileError);
        errors++;
      }
    }
    
    console.log('\n=== UPLOAD SUMMARY ===');
    console.log(`Total files processed: ${files.length}`);
    console.log(`Successfully uploaded: ${uploaded}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Errors: ${errors}`);
    
    if (results.length > 0) {
      console.log('\n=== SUCCESSFUL UPLOADS ===');
      results.forEach((result, index) => {
        console.log(`${index + 1}. ${result.broker} - ${result.file}`);
      });
    }
    
    // Check remaining brokers without logos
    const { data: remainingBrokers, error: remainingError } = await supabase
      .from('brokers')
      .select('name, slug')
      .or('logo_url.is.null,logo_url.eq.')
      .order('name');
    
    if (!remainingError && remainingBrokers.length > 0) {
      console.log(`\n=== BROKERS STILL WITHOUT LOGOS (${remainingBrokers.length}) ===`);
      remainingBrokers.forEach((broker, index) => {
        console.log(`${index + 1}. ${broker.name} (${broker.slug})`);
      });
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

uploadBrokerLogos();