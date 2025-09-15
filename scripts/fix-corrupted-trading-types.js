const fs = require('fs');
const path = require('path');

const corruptedFiles = [
  'stock-trading.ts',
  'scalping.ts',
  'oil-trading.ts',
  'mt4.ts',
  'low-spread.ts',
  'islamic.ts',
  'high-leverage.ts',
  'ecn.ts',
  'demo-accounts.ts',
  'copy-trading.ts'
];

// Template for fixing brokers array
const brokerTemplate = `  brokers: [
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
      features: [
        'Raw spreads',
        'ECN trading',
        'Fast execution',
        'VPS hosting',
        'API access'
      ],
      websiteUrl: 'https://www.icmarkets.com',
      pros: ['True ECN trading environment', 'Ultra-low spreads from 0.0 pips', 'Excellent VPS hosting services', 'Advanced API integration', 'Multiple regulatory licenses'],
      cons: ['Higher minimum deposit requirements', 'Limited educational content', 'Complex fee structure', 'No guaranteed stop losses'],
      summary: 'IC Markets is a top choice for traders seeking raw spreads and fast execution.',
      description: 'IC Markets provides superior trading conditions with raw spreads, deep liquidity, and reliable infrastructure.'
    }
  ],`;

corruptedFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', 'src', 'data', 'forex-brokers', 'trading-types', file);

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix the corrupted brokers array
    const typeMatch = file.replace('.ts', '');
    content = content.replace(/brokers: \[\[\]\],?/g, brokerTemplate.replace('{type}', typeMatch));

    // Fix any other syntax issues - remove malformed property assignments
    content = content.replace(/^\s*\w+:\s*[^{]*$/gm, '');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${file}`);
  } catch (error) {
    console.error(`Error fixing ${file}:`, error.message);
  }
});

console.log('Finished fixing corrupted trading type files');