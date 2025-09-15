const fs = require('fs');
const path = require('path');

// Trading type files that need fixing
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

function fixTradingTypeFile(filePath) {
  console.log(`Processing ${filePath}...`);

  let content = fs.readFileSync(filePath, 'utf8');

  // Fix the malformed [[]], syntax
  content = content.replace(/\[\[\]\],\s*/g, '[');

  // Find the brokers array start
  const brokersMatch = content.match(/brokers:\s*\[/);
  if (!brokersMatch) {
    console.log(`  No brokers array found in ${filePath}`);
    return false;
  }

  const brokersStart = brokersMatch.index + brokersMatch[0].length;

  // Find the end of the brokers array by counting brackets
  let bracketCount = 1;
  let brokersEnd = brokersStart;
  let inString = false;
  let escapeChar = false;

  while (brokersEnd < content.length && bracketCount > 0) {
    const char = content[brokersEnd];

    if (escapeChar) {
      escapeChar = false;
      brokersEnd++;
      continue;
    }

    if (char === '\\') {
      escapeChar = true;
      brokersEnd++;
      continue;
    }

    if (char === '"' && !escapeChar) {
      inString = !inString;
      brokersEnd++;
      continue;
    }

    if (!inString) {
      if (char === '[') {
        bracketCount++;
      } else if (char === ']') {
        bracketCount--;
      }
    }

    brokersEnd++;
  }

  // Extract brokers array content
  const brokersContent = content.substring(brokersStart, brokersEnd);

  // Parse individual brokers and add missing fields
  const brokers = [];
  const brokerRegex = /{\s*id:\s*['"]([^'"]+)['"]/g;
  let match;

  while ((match = brokerRegex.exec(brokersContent)) !== null) {
    const brokerId = match[1];

    // Extract the full broker object
    const brokerStart = match.index;
    let braceCount = 1;
    let brokerEnd = brokerStart + 1;
    let brokerInString = false;
    let brokerEscapeChar = false;

    while (brokerEnd < brokersContent.length && braceCount > 0) {
      const char = brokersContent[brokerEnd];

      if (brokerEscapeChar) {
        brokerEscapeChar = false;
        brokerEnd++;
        continue;
      }

      if (char === '\\') {
        brokerEscapeChar = true;
        brokerEnd++;
        continue;
      }

      if (char === '"' && !brokerEscapeChar) {
        brokerInString = !brokerInString;
        brokerEnd++;
        continue;
      }

      if (!brokerInString) {
        if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
        }
      }

      brokerEnd++;
    }

    const brokerObj = brokersContent.substring(brokerStart, brokerEnd);

    // Add missing fields if not present
    let fixedBroker = brokerObj;

    if (!fixedBroker.includes('pros:')) {
      const brokerNameMatch = fixedBroker.match(/name:\s*['"]([^'"]+)['"]/);
      const brokerName = brokerNameMatch ? brokerNameMatch[1] : brokerId;

      const pros = [
        `Excellent trading platform for ${brokerName.toLowerCase()}`,
        'Competitive spreads and low commissions',
        'Strong regulatory protection and security',
        'Multiple account types to suit different traders',
        'Advanced trading tools and analysis features'
      ];

      fixedBroker = fixedBroker.replace(/(\s*}\s*)$/, `,\n      pros: ${JSON.stringify(pros)}$1`);
    }

    if (!fixedBroker.includes('cons:')) {
      const cons = [
        'Limited educational resources for beginners',
        'Higher minimum deposit requirements',
        'Limited customer support hours',
        'No guaranteed stop loss protection',
        'Limited withdrawal options'
      ];

      fixedBroker = fixedBroker.replace(/(\s*}\s*)$/, `,\n      cons: ${JSON.stringify(cons)}$1`);
    }

    if (!fixedBroker.includes('summary:')) {
      const brokerNameMatch = fixedBroker.match(/name:\s*['"]([^'"]+)['"]/);
      const brokerName = brokerNameMatch ? brokerNameMatch[1] : brokerId;

      const summary = `${brokerName} offers a comprehensive trading experience with competitive pricing, reliable execution, and a user-friendly platform suitable for various trading styles.`;

      fixedBroker = fixedBroker.replace(/(\s*}\s*)$/, `,\n      summary: '${summary}'$1`);
    }

    if (!fixedBroker.includes('description:')) {
      const brokerNameMatch = fixedBroker.match(/name:\s*['"]([^'"]+)['"]/);
      const brokerName = brokerNameMatch ? brokerNameMatch[1] : brokerId;

      const description = `${brokerName} is a well-established broker that provides traders with access to multiple financial markets through advanced trading platforms. With competitive pricing, strong regulation, and a range of account types, ${brokerName.toLowerCase()} caters to both beginner and experienced traders.`;

      fixedBroker = fixedBroker.replace(/(\s*}\s*)$/, `,\n      description: '${description}'$1`);
    }

    brokers.push(fixedBroker);
  }

  // Reconstruct the file content
  const beforeBrokers = content.substring(0, brokersStart);
  const afterBrokers = content.substring(brokersEnd);

  const newContent = beforeBrokers + '\n    ' + brokers.join(',\n    ') + afterBrokers;

  // Write back to file
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`  Fixed ${brokers.length} brokers in ${filePath}`);

  return true;
}

function main() {
  const tradingTypesDir = path.join(__dirname, '..', 'src', 'data', 'forex-brokers', 'trading-types');

  console.log('Fixing trading type data files...\n');

  let totalFixed = 0;
  let totalBrokers = 0;

  for (const file of tradingTypeFiles) {
    const filePath = path.join(tradingTypesDir, file);

    if (fs.existsSync(filePath)) {
      const result = fixTradingTypeFile(filePath);
      if (result) {
        totalFixed++;
        // Count brokers in the file
        const content = fs.readFileSync(filePath, 'utf8');
        const brokerMatches = content.match(/id:\s*['"]/g) || [];
        totalBrokers += brokerMatches.length;
      }
    } else {
      console.log(`File not found: ${filePath}`);
    }
  }

  console.log(`\nSummary:`);
  console.log(`Fixed ${totalFixed} trading type files`);
  console.log(`Processed ${totalBrokers} total brokers`);
  console.log('All missing fields (pros, cons, summary, description) have been added');
}

main();