const fs = require('fs');
const path = require('path');

// Load enhanced broker data
const enhancedDataPath = path.join(__dirname, '../enhanced-broker-data.json');
const enhancedData = JSON.parse(fs.readFileSync(enhancedDataPath, 'utf8'));

console.log('🔧 Fixing data consistency issues...\n');

let fixedBrokers = 0;

// Fix each broker
enhancedData.brokers.forEach((broker, index) => {
  let hasChanges = false;

  // Fix 1: Normalize ratings to 0-5 scale
  if (broker.rating > 5) {
    console.log(`📊 Broker ${index + 1} (${broker.name}): Normalizing rating from ${broker.rating} to ${(broker.rating / 2).toFixed(1)}`);
    broker.rating = parseFloat((broker.rating / 2).toFixed(1));
    broker.avg_rating = parseFloat((broker.avg_rating / 2).toFixed(1));
    broker.trust_score = parseFloat((broker.trust_score / 2).toFixed(1));
    hasChanges = true;
  }

  // Fix 2: Ensure regulation is a valid array
  if (broker.regulation && !Array.isArray(broker.regulation)) {
    console.log(`📊 Broker ${index + 1} (${broker.name}): Fixing regulation format`);
    broker.regulation = Array.isArray(broker.regulations) ? broker.regulations : [];
    hasChanges = true;
  }

  // Fix 3: Ensure platforms is a valid array
  if (broker.platforms && !Array.isArray(broker.platforms)) {
    console.log(`📊 Broker ${index + 1} (${broker.name}): Fixing platforms format`);
    broker.platforms = Array.isArray(broker.platforms_available) ? broker.platforms_available : [];
    hasChanges = true;
  }

  // Fix 4: Remove duplicate regulation arrays
  if (broker.regulations && Array.isArray(broker.regulations) &&
      JSON.stringify(broker.regulation) === JSON.stringify(broker.regulations)) {
    delete broker.regulations;
    hasChanges = true;
  }

  // Fix 5: Remove duplicate platform arrays
  if (broker.platforms_available && Array.isArray(broker.platforms_available) &&
      JSON.stringify(broker.platforms) === JSON.stringify(broker.platforms_available)) {
    delete broker.platforms_available;
    hasChanges = true;
  }

  if (hasChanges) {
    fixedBrokers++;
  }
});

// Save fixed data
const fixedDataPath = path.join(__dirname, '../enhanced-broker-data-fixed.json');
fs.writeFileSync(fixedDataPath, JSON.stringify(enhancedData, null, 2));

console.log(`\n✅ Data consistency fixes complete:`);
console.log(`   Fixed ${fixedBrokers} brokers`);
console.log(`   Total brokers processed: ${enhancedData.brokers.length}`);
console.log(`   Fixed data saved to: ${fixedDataPath}`);

// Replace original file
fs.writeFileSync(enhancedDataPath, JSON.stringify(enhancedData, null, 2));
console.log(`   Original file updated: ${enhancedDataPath}`);