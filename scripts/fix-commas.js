const fs = require('fs');
const path = require('path');

// Trading type files that need comma fixing
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

function fixCommas(filePath) {
  console.log(`Fixing commas in ${filePath}...`);

  let content = fs.readFileSync(filePath, 'utf8');

  // Fix comma issues after broker objects and before closing braces
  content = content.replace(/pros:\s*\[[^\]]*\],\s*cons:\s*\[[^\]]*\],\s*summary:\s*'[^']*'\s*,\s*description:\s*'[^']*'\s*}(\s*},)/g, 'pros: $2,\n      cons: $3,\n      summary: \'$4\',\n      description: \'$5\'\n    }$6');

  // More specific pattern matching
  const brokerPattern = /(\s+)(\w+):\s*'([^']*)'/g;

  // Fix the issue where the last broker in array might have trailing comma
  content = content.replace(/(\s+)(\w+):\s*'([^']*)'\s*,\s*}(?=\s*[\],}])/g, '$1$2: \'$3\'\n    }');

  // Remove trailing commas before closing braces in objects
  content = content.replace(/,(\s*})/g, '$1');

  // Fix specific issue with commas before closing brackets in arrays
  content = content.replace(/,(\s*\])/g, '$1');

  // Fix comma issues in the last broker object
  content = content.replace(/(\s+)(\w+):\s*'([^']*)'\s*,\s*}(?=\s*\])/g, '$1$2: \'$3\'\n    }');

  // Fix comma issues in arrays
  content = content.replace(/,\s*]/g, ']');

  // Fix issues where objects have trailing commas before closing
  content = content.replace(/,\s*}/g, '}');

  // Write back to file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  Fixed commas in ${filePath}`);

  return true;
}

function main() {
  const tradingTypesDir = path.join(__dirname, '..', 'src', 'data', 'forex-brokers', 'trading-types');

  console.log('Fixing comma issues in trading type data files...\n');

  let totalFixed = 0;

  for (const file of tradingTypeFiles) {
    const filePath = path.join(tradingTypesDir, file);

    if (fs.existsSync(filePath)) {
      const result = fixCommas(filePath);
      if (result) {
        totalFixed++;
      }
    } else {
      console.log(`File not found: ${filePath}`);
    }
  }

  console.log(`\nSummary:`);
  console.log(`Fixed comma issues in ${totalFixed} trading type files`);
}

main();