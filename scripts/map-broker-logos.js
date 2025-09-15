const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Broker logo mapping based on files found in the BrokerChooser folder
const brokerLogoMapping = {
  'FXTM': [
    'imgi_38_fxtm-review.png',
    'imgi_47_fxtm-review (1).png',
    'imgi_47_fxtm-review.png',
    'imgi_48_fxtm-review.png',
    'imgi_51_fxtm-review.png',
    'imgi_55_fxtm-review (1).png',
    'imgi_55_fxtm-review.png',
    'imgi_56_fxtm-review.png',
    'imgi_57_fxtm-review.png',
    'imgi_62_fxtm-review.png',
    'imgi_7_fxtm new transparent dark 110x40.webp'
  ],
  'IG Group': [
    'imgi_10_ig-review.png',
    'imgi_11_ig-review.png',
    'imgi_12_ig-review (1).png',
    'imgi_12_ig-review.png',
    'imgi_13_ig-review (1).png',
    'imgi_13_ig-review.png',
    'imgi_14_ig-review (1).png',
    'imgi_14_ig-review.png',
    'imgi_15_ig-review.png',
    'imgi_16_ig-review.png',
    'imgi_17_ig-review.png',
    'imgi_36_ig 110x540.webp',
    'imgi_8_ig-review.png',
    'imgi_9_ig-review.png'
  ],
  'OANDA': [
    'imgi_11_oanda (1).png',
    'imgi_11_oanda.png',
    'imgi_12_oanda.png',
    'imgi_13_oanda (1).png',
    'imgi_13_oanda.png',
    'imgi_14_oanda (1).png',
    'imgi_14_oanda.png',
    'imgi_15_oanda (1).png',
    'imgi_15_oanda.png',
    'imgi_16_oanda.png',
    'imgi_17_oanda.png',
    'imgi_18_oanda.png',
    'imgi_8_oanda.png',
    'imgi_9_oanda.png'
  ],
  'Pepperstone': [
    'imgi_10_pepperstone-review.png',
    'imgi_12_pepperstone-review.png',
    'imgi_13_pepperstone-review.png',
    'imgi_16_pepperstone-review (1).png',
    'imgi_16_pepperstone-review.png',
    'imgi_17_pepperstone-review (1).png',
    'imgi_17_pepperstone-review.png',
    'imgi_18_pepperstone-review.png',
    'imgi_19_pepperstone-review.png',
    'imgi_20_pepperstone-review.png',
    'imgi_22_pepperstone-review.png',
    'imgi_5_brokers logo 110x40pepperstone.webp'
  ],
  'IC Markets': [
    'imgi_4_eightcap_small_2.png'
  ],
  'Plus500': [
    'imgi_10_110x40plus500-trans.webp',
    'imgi_10_plus500-review.png',
    'imgi_11_plus500-review.png',
    'imgi_12_plus500-futures-review.png',
    'imgi_15_plus500-review (1).png',
    'imgi_15_plus500-review.png',
    'imgi_16_plus500-review (1).png',
    'imgi_16_plus500-review.png',
    'imgi_17_plus500-review.png',
    'imgi_18_plus500-review.png',
    'imgi_19_plus500-review.png',
    'imgi_20_plus500-review.png'
  ],
  'FP Markets': [
    'imgi_17_fp-markets-review.png',
    'imgi_18_fp-markets-review.png',
    'imgi_22_fp-markets-review.png',
    'imgi_23_fp-markets-review.png',
    'imgi_24_fp-markets-review.png',
    'imgi_26_fp-markets-review.png',
    'imgi_27_fp-markets-review.png',
    'imgi_28_fp-markets-review.png',
    'imgi_29_fp-markets-review (1).png',
    'imgi_29_fp-markets-review.png',
    'imgi_30_fp-markets-review (1).png',
    'imgi_30_fp-markets-review.png',
    'imgi_36_fp-markets-review.png'
  ],
  'Admirals': [
    'imgi_10_admirals-admiral-markets-review.png',
    'imgi_11_admirals-admiral-markets-review (1).png',
    'imgi_11_admirals-admiral-markets-review.png',
    'imgi_12_admirals-admiral-markets-review.png',
    'imgi_13_admirals-admiral-markets-review.png',
    'imgi_15_admirals-admiral-markets-review.png',
    'imgi_7_admirals-admiral-markets-review.png',
    'imgi_8_admirals-admiral-markets-review.png',
    'imgi_9_admirals-admiral-markets-review.png'
  ],
  'AvaTrade': [
    'imgi_14_110x40avatrade-new.webp',
    'imgi_16_avatrade-review.png',
    'imgi_21_avatrade-review.png',
    'imgi_28_avatrade-review.png',
    'imgi_29_avatrade-review.png',
    'imgi_30_avatrade-review.png',
    'imgi_31_avatrade-review.png',
    'imgi_34_avatrade-review (1).png',
    'imgi_34_avatrade-review.png',
    'imgi_35_avatrade-review (1).png',
    'imgi_35_avatrade-review.png',
    'imgi_36_avatrade-review (1).png',
    'imgi_36_avatrade-review.png',
    'imgi_42_avatrade-review.png'
  ],
  'Exness': [
    'imgi_37_exness 110x40 tranparent.webp',
    'imgi_37_exness-review.png',
    'imgi_40_exness-review (1).png',
    'imgi_40_exness-review.png',
    'imgi_46_exness-review (1).png',
    'imgi_46_exness-review.png'
  ],
  'XM Group': [
    'imgi_15_xm15years 110x40 transparent  (1).webp',
    'imgi_25_xm-review.png',
    'imgi_26_xm-review.png',
    'imgi_27_xm-review.png',
    'imgi_28_xm-review.png',
    'imgi_30_xm-review.png',
    'imgi_31_xm-review.png',
    'imgi_32_xm-review (1).png',
    'imgi_32_xm-review.png',
    'imgi_33_xm-review (1).png',
    'imgi_33_xm-review.png',
    'imgi_39_xm-review.png'
  ],
  'Forex.com': [
    'imgi_11_forex.com-review.png',
    'imgi_14_forex.com-review.png',
    'imgi_16_forex.com-review (1).png',
    'imgi_16_forex.com-review.png',
    'imgi_18_forex.com-review.png',
    'imgi_19_forex.com-review.png',
    'imgi_20_forex.com-review (1).png',
    'imgi_20_forex.com-review.png',
    'imgi_21_forex.com-review.png',
    'imgi_22_forex.com-review.png',
    'imgi_23_forex.com-review.png',
    'imgi_25_forex.com-review.png'
  ],
  'Saxo Bank': [
    'imgi_7_saxo-bank-review (1).png',
    'imgi_7_saxo-bank-review (2).png',
    'imgi_7_saxo-bank-review (3).png',
    'imgi_7_saxo-bank-review (4).png',
    'imgi_7_saxo-bank-review (5).png',
    'imgi_7_saxo-bank-review (6).png',
    'imgi_7_saxo-bank-review.png'
  ],
  'Tickmill': [
    'imgi_14_Tickmill-rounded.png',
    'imgi_17_Tickmill-rounded.png',
    'imgi_18_Tickmill-rounded.png',
    'imgi_20_Tickmill-rounded.png',
    'imgi_22_Tickmill-rounded (1).png',
    'imgi_22_Tickmill-rounded.png',
    'imgi_23_Tickmill-rounded (1).png',
    'imgi_23_Tickmill-rounded.png',
    'imgi_24_Tickmill-rounded.png',
    'imgi_25_Tickmill-rounded (1).png',
    'imgi_25_Tickmill-rounded.png',
    'imgi_30_Tickmill-rounded.png'
  ],
  'XM': [
    'imgi_15_xm15years 110x40 transparent  (1).webp',
    'imgi_25_xm-review.png',
    'imgi_26_xm-review.png',
    'imgi_27_xm-review.png',
    'imgi_28_xm-review.png',
    'imgi_30_xm-review.png',
    'imgi_31_xm-review.png',
    'imgi_32_xm-review (1).png',
    'imgi_32_xm-review.png',
    'imgi_33_xm-review (1).png',
    'imgi_33_xm-review.png',
    'imgi_39_xm-review.png'
  ],
  'IG Markets': [
    'imgi_10_ig-review.png',
    'imgi_11_ig-review.png',
    'imgi_12_ig-review (1).png',
    'imgi_12_ig-review.png',
    'imgi_13_ig-review (1).png',
    'imgi_13_ig-review.png',
    'imgi_14_ig-review (1).png',
    'imgi_14_ig-review.png',
    'imgi_15_ig-review.png',
    'imgi_16_ig-review.png',
    'imgi_17_ig-review.png',
    'imgi_36_ig 110x540.webp',
    'imgi_8_ig-review.png',
    'imgi_9_ig-review.png'
  ],
  'HotForex': [
    'imgi_13_vantage-markets-review.png'
  ],
  'CMC Markets': [
    'imgi_10_Markets-logo-300x300.png',
    'imgi_11_Markets-logo-300x300.png',
    'imgi_12_Markets-logo-300x300.png',
    'imgi_14_Markets-logo-300x300 (1).png',
    'imgi_14_Markets-logo-300x300.png'
  ]
};

// Select the best logo for each broker (prefer .webp files for better compression, then PNG files)
const selectedLogos = {};
Object.keys(brokerLogoMapping).forEach(broker => {
  const logos = brokerLogoMapping[broker];
  // Prefer .webp files, then use the first available PNG
  const webpLogo = logos.find(logo => logo.endsWith('.webp'));
  const pngLogo = logos.find(logo => logo.endsWith('.png'));
  selectedLogos[broker] = webpLogo || pngLogo || logos[0];
});

console.log('Selected Logos for Brokers:');
console.log('========================');
Object.entries(selectedLogos).forEach(([broker, logo]) => {
  console.log(`${broker}: ${logo}`);
});

// Function to copy selected logos to a new directory
function copySelectedLogos() {
  const sourceDir = "C:/Users/LENOVO/Desktop/dualite/Broker reviews │ BrokerChooser/";
  const targetDir = "C:/Users/LENOVO/Desktop/dualite/public/broker-logos/";
  
  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  Object.entries(selectedLogos).forEach(([broker, logoFile]) => {
    if (logoFile) {
      const sourcePath = path.join(sourceDir, logoFile);
      const targetPath = path.join(targetDir, `${broker.toLowerCase().replace(/\s+/g, '-')}${path.extname(logoFile)}`);
      
      try {
        if (fs.existsSync(sourcePath)) {
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`✅ Copied ${broker} logo to ${targetPath}`);
        } else {
          console.log(`❌ Source file not found: ${sourcePath}`);
        }
      } catch (error) {
        console.error(`❌ Error copying ${broker} logo:`, error.message);
      }
    }
  });
}

// Copy the logos
copySelectedLogos();

console.log('\nLogo files have been copied to public/broker-logos/');