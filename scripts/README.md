# Broker Data Enhancement Scripts

This directory contains a comprehensive suite of scripts for enhancing the Supabase database schema and extracting broker data from scraped HTML files. The scripts are designed to work together to create a robust broker information system for the Broker Analysis platform.

## 📁 Files Overview

### Core Scripts

1. **`extract-broker-data.js`** - Main data extraction script
2. **`validate-broker-data.js`** - Data validation and cleaning
3. **`test-schema.js`** - Database schema testing
4. **`package.json`** - Node.js dependencies and scripts

### Database Migrations

- **`../supabase/migrations/20250115_comprehensive_broker_schema.sql`** - Enhanced schema
- **`../supabase/migrations/20250115_broker_data_extraction.sql`** - Data extraction functions

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v16 or higher)
2. **Supabase project** with proper environment variables
3. **Scraped HTML data** in the daily forex directory

### Environment Setup

1. Install dependencies:
```bash
cd scripts
npm install
```

2. Create `.env` file in the project root:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

3. Apply database migrations:
```bash
# Apply the enhanced schema
supabase db push

# Or manually apply migrations
psql -h your_db_host -U postgres -d postgres -f ../supabase/migrations/20250115_comprehensive_broker_schema.sql
psql -h your_db_host -U postgres -d postgres -f ../supabase/migrations/20250115_broker_data_extraction.sql
```

## 📋 Usage Guide

### Step 1: Test Database Schema

Before extracting data, verify that the database schema is working correctly:

```bash
npm run test:schema
# or
node test-schema.js
```

**What it does:**
- Tests all new database tables and relationships
- Validates constraints and triggers
- Checks index performance
- Generates a comprehensive test report

**Expected Output:**
```
🚀 Starting comprehensive database schema tests...
✅ Broker Insertion - PASSED
✅ Trading Conditions Insertion - PASSED
✅ Instruments Insertion - PASSED
...
📊 SCHEMA TEST RESULTS:
✅ Passed: 11
❌ Failed: 0
📈 Success Rate: 100%
```

### Step 2: Extract Broker Data

Extract broker information from the scraped HTML files:

```bash
npm run extract
# or
node extract-broker-data.js
```

**What it does:**
- Scans HTML files in the daily forex directory
- Extracts broker names, ratings, and key information
- Processes comparison pages for detailed data
- Generates structured JSON output
- Creates extraction report with statistics

**Configuration Options:**
```javascript
// In extract-broker-data.js
const CONFIG = {
  htmlDirectory: 'C:\\Users\\LENOVO\\Desktop\\dualite\\daily forex\\www.dailyforex.com',
  outputFile: 'broker-extraction-report.json',
  batchSize: 50,
  maxConcurrency: 5
};
```

**Expected Output:**
```
🚀 Starting broker data extraction...
📁 Found 1,247 HTML files to process
📊 Processing batch 1/25...
✅ Extracted data for 156 brokers
📄 Report saved to: broker-extraction-report.json
```

### Step 3: Validate and Clean Data

Validate the extracted data for quality and consistency:

```bash
npm run validate
# or
node validate-broker-data.js broker-extraction-report.json
```

**What it does:**
- Validates data against predefined rules
- Checks for required fields and data types
- Calculates quality and completeness scores
- Cleans and normalizes data
- Generates validation report with recommendations

**Validation Rules:**
- Broker names: 2-100 characters, alphanumeric + spaces
- Ratings: 1.0-5.0 range
- Minimum deposits: $0-$100,000
- Leverage: 1:1 to 3000:1
- Platforms: Predefined list (MT4, MT5, cTrader, etc.)

**Expected Output:**
```
🔍 Starting broker data validation...
📊 Validating 156 broker records...
📋 VALIDATION RESULTS:
✅ Valid brokers: 142/156 (91%)
📈 Average quality score: 78%
📊 Average completeness: 65%
⚠️  Total warnings: 23
❌ Critical errors: 14
```

### Step 4: Import to Database

Import the validated data into Supabase:

```bash
npm run import
# or
node extract-broker-data.js --import broker-data-cleaned.json
```

**What it does:**
- Connects to Supabase database
- Inserts broker data into enhanced schema
- Creates related records (trading conditions, instruments, etc.)
- Handles duplicates and conflicts
- Provides import statistics

## 📊 Data Structure

### Enhanced Broker Schema

The enhanced schema includes the following tables:

#### Core Tables
- **`brokers`** - Main broker information
- **`broker_trading_conditions`** - Account types and trading terms
- **`broker_instruments`** - Available trading instruments
- **`broker_payment_methods`** - Deposit/withdrawal options
- **`broker_bonuses`** - Promotional offers
- **`broker_support_channels`** - Customer support options
- **`broker_regulations`** - Regulatory information

#### Sample Data Structure
```json
{
  "name": "Example Broker",
  "overall_rating": 4.2,
  "min_deposit": 100,
  "max_leverage": 500,
  "spread_from": 0.8,
  "platforms": ["mt4", "mt5", "webtrader"],
  "pros": ["Low spreads", "Good support"],
  "cons": ["High minimum deposit"],
  "trading_conditions": [
    {
      "account_type": "standard",
      "min_deposit": 100,
      "max_leverage": 500
    }
  ],
  "instruments": [
    {
      "category": "forex",
      "symbol": "EURUSD",
      "spread_from": 0.8
    }
  ]
}
```

## 🔧 Configuration

### Extraction Configuration

```javascript
// extract-broker-data.js
const CONFIG = {
  // Source directory for HTML files
  htmlDirectory: 'C:\\Users\\LENOVO\\Desktop\\dualite\\daily forex\\www.dailyforex.com',
  
  // Output files
  outputFile: 'broker-extraction-report.json',
  logFile: 'extraction.log',
  
  // Processing settings
  batchSize: 50,
  maxConcurrency: 5,
  
  // Supabase settings
  insertToDatabase: false, // Set to true for direct insertion
  
  // Extraction patterns
  patterns: {
    brokerName: /class="broker-name"[^>]*>([^<]+)/gi,
    rating: /rating["']?[\s]*:[\s]*["']?([0-9.]+)/gi,
    minDeposit: /min[\s-]*deposit["']?[\s]*:[\s]*["']?\$?([0-9,]+)/gi
  }
};
```

### Validation Configuration

```javascript
// validate-broker-data.js
const VALIDATION_RULES = {
  brokerName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-\.&]+$/
  },
  rating: {
    required: false,
    min: 1.0,
    max: 5.0,
    type: 'number'
  }
};

const QUALITY_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 75,
  ACCEPTABLE: 60,
  POOR: 40
};
```

## 📈 Monitoring and Reports

### Generated Reports

1. **`broker-extraction-report.json`** - Raw extraction results
2. **`broker-validation-report.json`** - Data quality analysis
3. **`broker-data-cleaned.json`** - Cleaned and validated data
4. **`schema-test-report.json`** - Database schema test results

### Key Metrics

- **Extraction Rate**: Percentage of HTML files successfully processed
- **Data Quality Score**: Average quality score across all brokers
- **Completeness Score**: Percentage of fields populated
- **Validation Rate**: Percentage of brokers passing validation

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Errors
```bash
Error: Invalid API key or URL
```
**Solution**: Check your `.env` file and ensure Supabase credentials are correct.

#### 2. HTML Parsing Errors
```bash
Error: Cannot read property 'match' of null
```
**Solution**: HTML structure may have changed. Update extraction patterns in the configuration.

#### 3. Validation Failures
```bash
Warning: Rating out of range (1-5)
```
**Solution**: Review validation rules and adjust thresholds if needed.

#### 4. Memory Issues
```bash
Error: JavaScript heap out of memory
```
**Solution**: Reduce batch size in configuration or increase Node.js memory limit:
```bash
node --max-old-space-size=4096 extract-broker-data.js
```

### Debug Mode

Enable debug logging by setting environment variable:
```bash
DEBUG=true node extract-broker-data.js
```

## 🔄 Maintenance

### Regular Tasks

1. **Weekly Data Updates**:
   ```bash
   npm run extract && npm run validate && npm run import
   ```

2. **Monthly Schema Tests**:
   ```bash
   npm run test:schema
   ```

3. **Quarterly Data Quality Review**:
   - Review validation reports
   - Update extraction patterns if needed
   - Adjust validation rules based on data trends

### Performance Optimization

1. **Database Indexes**: Ensure proper indexes are in place for query performance
2. **Batch Processing**: Adjust batch sizes based on system resources
3. **Caching**: Implement caching for frequently accessed broker data

## 📚 API Reference

### extract-broker-data.js

```javascript
// Extract data from HTML files
const extractor = new BrokerDataExtractor(config);
const results = await extractor.extractFromDirectory(htmlDirectory);

// Insert data to database
const importer = new SupabaseImporter(supabaseClient);
const importResults = await importer.importBrokerData(brokerData);
```

### validate-broker-data.js

```javascript
// Validate single broker
const validation = validateBrokerData(brokerData);

// Validate array of brokers
const results = validateBrokerDataArray(brokerDataArray);

// Clean data
const cleanedData = cleanBrokerData(brokerData);
```

### test-schema.js

```javascript
// Run all schema tests
const testRunner = new SchemaTestRunner();
const results = await testRunner.runSchemaTests();

// Run specific test
await testRunner.runTest('Broker Insertion', () => testRunner.testBrokerInsertion());
```

## 🤝 Contributing

When modifying these scripts:

1. **Test thoroughly** with sample data before production use
2. **Update validation rules** when adding new data fields
3. **Maintain backward compatibility** with existing data
4. **Document changes** in this README
5. **Follow error handling patterns** established in existing code

## 📄 License

These scripts are part of the Broker Analysis platform and are subject to the project's license terms.

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Broker Analysis Development Team