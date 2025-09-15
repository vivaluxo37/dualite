const fs = require('fs');
const path = require('path');

// Trading type files that need final comma fixing
const tradingTypeFiles = [
  'auto-trading.ts',
  'beginners.ts',
  'copy-trading.ts',
  'demo-accounts.ts',
  'ecn.ts',
  'high-leverage.ts',
  'islamic.ts',
  'low-spread.ts',
  'mt4.ts',
  'oil-trading.ts',
  'scalping.ts',
  'stock-trading.ts'
];

function fixFinalCommas(filePath) {
  console.log(`Fixing final commas in ${filePath}...`);

  let content = fs.readFileSync(filePath, 'utf8');

  // Add comma after brokers array closing bracket if missing
  content = content.replace(/(\s+}\s*\]\s*)(conclusion|faqs|keyFeatures|features|gettingStarted|recommendations|seo)/g, '$1,$2');

  // Add comma after conclusion object
  content = content.replace(/(\s+}\s*\})(\s*(faqs|keyFeatures|features|gettingStarted|recommendations|seo))/g, '$1,$2');

  // Add comma after faqs array
  content = content.replace(/(\s+]\s*\})(\s*(conclusion|keyFeatures|features|gettingStarted|recommendations|seo))/g, '$1,$2');

  // Add comma before final closing brace of main object
  content = content.replace(/(\s+(conclusion|recommendations|seo):\s*\{[^}]*\s*\})(\s*\})/gs, '$1,$3');

  // Write back to file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  Fixed final commas in ${filePath}`);

  return true;
}

function main() {
  const tradingTypesDir = path.join(__dirname, '..', 'src', 'data', 'forex-brokers', 'trading-types');

  console.log('Fixing final comma issues in trading type data files...\n');

  let totalFixed = 0;

  for (const file of tradingTypeFiles) {
    const filePath = path.join(tradingTypesDir, file);

    if (fs.existsSync(filePath)) {
      const result = fixFinalCommas(filePath);
      if (result) {
        totalFixed++;
      }
    } else {
      console.log(`File not found: ${filePath}`);
    }
  }

  console.log(`\nSummary:`);
  console.log(`Fixed final comma issues in ${totalFixed} trading type files`);
}

main();