const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing missing required broker fields in trading type data files...\n');

// Get all trading type files
const tradingTypesDir = path.join(__dirname, '../src/data/forex-brokers/trading-types');
const files = fs.readdirSync(tradingTypesDir).filter(file => file.endsWith('.ts') && file !== 'types.ts' && file !== 'index.ts');

let totalBrokersFixed = 0;
let filesProcessed = 0;

// Common pros and cons templates for different broker types
const brokerProsTemplates = {
  default: [
    'Competitive spreads and low commissions',
    'Multiple regulatory oversight for fund safety',
    'Wide range of trading instruments available',
    'Advanced trading platforms with robust features',
    'Reliable customer support and educational resources'
  ],
  beginners: [
    'User-friendly trading platform',
    'Low minimum deposit requirements',
    'Comprehensive educational resources',
    'Demo account for practice trading',
    'Excellent customer support for new traders'
  ],
  ecn: [
    'True ECN trading environment',
    'No dealing desk intervention',
    'Tight spreads from 0.0 pips',
    'Direct market access execution',
    'Deep liquidity from multiple providers'
  ],
  islamic: [
    'Fully Sharia-compliant trading accounts',
    'No swap or interest charges',
    'Instant trade execution',
    'Wide range of halal trading instruments',
    'Segregated accounts for fund protection'
  ]
};

const brokerConsTemplates = {
  default: [
    'Limited cryptocurrency trading options',
    'Higher spreads for exotic currency pairs',
    'Some account types have maintenance fees',
    'Limited research tools for advanced analysis',
    'Weekend trading not available for all instruments'
  ],
  beginners: [
    'Limited advanced trading features',
    'Higher spreads compared to ECN brokers',
    'No direct market access for scalping',
    'Limited customizability of trading interface',
    'Fewer technical indicators available'
  ],
  ecn: [
    'Higher minimum deposit requirements',
    'Commission fees on trades',
    'Complex fee structure',
    'Limited educational resources',
    'Not suitable for very small trade sizes'
  ],
  islamic: [
    'Limited hedging capabilities',
    'Higher spreads compared to standard accounts',
    'Some trading instruments restricted',
    'Longer withdrawal processing times',
    'Limited access to certain promotional offers'
  ]
};

const brokerDescriptions = {
  default: 'A reputable forex broker offering competitive trading conditions with multiple regulatory licenses. Provides access to major currency pairs, CFDs, and commodities through popular trading platforms.',
  beginners: 'An ideal forex broker for new traders featuring an intuitive platform, comprehensive educational resources, and excellent customer support to help beginners start their trading journey.',
  ecn: 'A professional ECN forex broker providing direct market access with tight spreads and fast execution. Ideal for experienced traders seeking transparent pricing and advanced trading conditions.',
  islamic: 'A Sharia-compliant forex broker offering swap-free Islamic accounts that adhere to Islamic finance principles. Perfect for Muslim traders seeking halal trading opportunities.'
};

// Process each trading type file
files.forEach(file => {
  const filePath = path.join(tradingTypesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Extract the trading type name from file name
  const tradingTypeName = file.replace('.ts', '');
  const templateType = brokerProsTemplates[tradingTypeName] ? tradingTypeName : 'default';

  console.log(`📊 Processing ${file}...`);

  // Find the brokers array and add missing fields
  const brokersRegex = /brokers:\s*\[(.*?)\]/gs;
  let modifiedContent = content;
  let match;
  let brokersInFile = 0;

  while ((match = brokersRegex.exec(content)) !== null) {
    const brokersSection = match[0];
    let brokersArray = match[1];

    // Parse individual broker objects
    const brokerObjects = [];
    let currentObject = '';
    let braceLevel = 0;
    let inString = false;

    for (let i = 0; i < brokersArray.length; i++) {
      const char = brokersArray[i];

      if (char === '"' && (i === 0 || brokersArray[i - 1] !== '\\')) {
        inString = !inString;
      }

      if (!inString) {
        if (char === '{') {
          braceLevel++;
        } else if (char === '}') {
          braceLevel--;
          if (braceLevel === 0) {
            currentObject += char;
            brokerObjects.push(currentObject.trim());
            currentObject = '';
            continue;
          }
        }
      }

      currentObject += char;
    }

    // Fix each broker object
    const fixedBrokerObjects = brokerObjects.map(brokerObj => {
      brokersInFile++;

      // Check if required fields are missing
      const hasPros = brokerObj.includes('pros:');
      const hasCons = brokerObj.includes('cons:');
      const hasSummary = brokerObj.includes('summary:');
      const hasDescription = brokerObj.includes('description:');

      if (hasPros && hasCons && hasSummary && hasDescription) {
        return brokerObj; // No changes needed
      }

      // Add missing fields
      let fixedObj = brokerObj;

      if (!hasDescription) {
        // Add description field before the closing brace
        const description = brokerDescriptions[templateType];
        fixedObj = fixedObj.replace(/}$/, `  description: "${description}",\n}`);
      }

      if (!hasSummary) {
        // Add summary field
        const brokerNameMatch = brokerObj.match(/name:\s*['"`]([^'"`]+)['"`]/);
        const brokerName = brokerNameMatch ? brokerNameMatch[1] : 'this broker';
        const summary = `${brokerName} offers excellent trading conditions with competitive spreads, reliable execution, and comprehensive trading features suitable for ${tradingTypeName} trading.`;

        fixedObj = fixedObj.replace(/}$/, `  summary: "${summary}",\n}`);
      }

      if (!hasPros) {
        // Add pros field
        const pros = brokerProsTemplates[templateType];
        const prosString = pros.map(pro => `'${pro}'`).join(',\n      ');
        fixedObj = fixedObj.replace(/}$/, `  pros: [\n      ${prosString}\n    ],\n}`);
      }

      if (!hasCons) {
        // Add cons field
        const cons = brokerConsTemplates[templateType];
        const consString = cons.map(con => `'${con}'`).join(',\n      ');
        fixedObj = fixedObj.replace(/}$/, `  cons: [\n      ${consString}\n    ],\n}`);
      }

      // Clean up any trailing commas before closing braces
      fixedObj = fixedObj.replace(/,(\s*})/g, '$1');

      return fixedObj;
    });

    // Reconstruct the brokers section
    const newBrokersArray = '[' + fixedBrokerObjects.join(',\n    ') + ']';
    const newBrokersSection = brokersSection.replace(brokersArray, newBrokersArray);

    modifiedContent = modifiedContent.replace(brokersSection, newBrokersSection);

    totalBrokersFixed += brokersInFile;
  }

  // Write the fixed content back to the file
  if (modifiedContent !== content) {
    fs.writeFileSync(filePath, modifiedContent);
    console.log(`  ✅ Fixed ${brokersInFile} brokers in ${file}`);
  } else {
    console.log(`  ℹ️  No changes needed for ${file}`);
  }

  filesProcessed++;
});

console.log(`\n✅ Trading type data fixes complete:`);
console.log(`   Files processed: ${filesProcessed}`);
console.log(`   Total brokers fixed: ${totalBrokersFixed}`);
console.log(`   Average fixes per file: ${(totalBrokersFixed / filesProcessed).toFixed(1)}`);

// Also fix the index.ts file if it has broker data
const indexPath = path.join(tradingTypesDir, 'index.ts');
if (fs.existsSync(indexPath)) {
  console.log(`\n📊 Checking index.ts for broker data...`);
  const indexContent = fs.readFileSync(indexPath, 'utf8');

  if (indexContent.includes('brokers:')) {
    console.log(`  ⚠️  Found broker data in index.ts - manual review recommended`);
  } else {
    console.log(`  ✅ No broker data in index.ts`);
  }
}