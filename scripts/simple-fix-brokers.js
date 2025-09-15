const fs = require('fs');
const path = require('path');

// Simple template for brokers array
const simpleBrokersTemplate = `  brokers: [
    {
      id: '{type}-icmarkets',
      name: 'IC Markets',
      logo: 'IC',
      rating: 4.8,
      maxRating: 5,
      regulation: ['ASIC', 'CySEC', 'FSA'],
      minDeposit: '$200',
      spread: '0.0 pips',
      leverage: '1:500',
      platforms: ['MT4', 'MT5', 'cTrader'],
      features: ['Raw spreads', 'ECN trading', 'Fast execution'],
      websiteUrl: 'https://www.icmarkets.com',
      pros: ['True ECN trading', 'Ultra-low spreads'],
      cons: ['Higher minimum deposit', 'Limited educational content'],
      summary: 'IC Markets is a top choice for traders.',
      description: 'IC Markets provides superior trading conditions.'
    }
  ],`;

const filesToFix = [
  'stock-trading.ts',
  'scalping.ts',
  'mt4.ts',
  'low-spread.ts',
  'islamic.ts',
  'high-leverage.ts',
  'ecn.ts',
  'demo-accounts.ts',
  'copy-trading.ts'
];

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, '..', 'src', 'data', 'forex-brokers', 'trading-types', file);

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace only the specific corrupted pattern
    const typeMatch = file.replace('.ts', '');
    content = content.replace(/brokers:\s*\[\[\]\],?/g, simpleBrokersTemplate.replace('{type}', typeMatch));

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${file}`);
  } catch (error) {
    console.error(`Error fixing ${file}:`, error.message);
  }
});

console.log('Finished fixing brokers arrays');