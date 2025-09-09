const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://efxpwrnxdorgzcqhbnfn.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAzMzIzNSwiZXhwIjoyMDcyNjA5MjM1fQ.BKmSaW8dSc6soQZOh7zZGXMNO-evJZkSbLVJzxoYSYA';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Validation rules for broker data
const validationRules = {
  required_fields: ['name', 'slug', 'country'],
  numeric_fields: ['min_deposit', 'spreads_avg', 'trust_score', 'established_year'],
  array_fields: ['platforms', 'instruments', 'regulations', 'pros', 'cons'],
  enum_fields: {
    regulation_tier: ['tier1', 'tier2', 'tier3', 'unregulated']
  },
  url_fields: ['website_url', 'affiliate_url', 'logo_url'],
  trust_score_range: [0, 100],
  year_range: [1900, new Date().getFullYear()]
};

class DataValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.stats = {
      total_brokers: 0,
      valid_brokers: 0,
      brokers_with_errors: 0,
      brokers_with_warnings: 0
    };
  }

  addError(brokerId, field, message) {
    this.errors.push({ broker_id: brokerId, field, message, type: 'error' });
  }

  addWarning(brokerId, field, message) {
    this.warnings.push({ broker_id: brokerId, field, message, type: 'warning' });
  }

  validateRequiredFields(broker) {
    validationRules.required_fields.forEach(field => {
      if (!broker[field] || broker[field].toString().trim() === '') {
        this.addError(broker.id, field, `Required field '${field}' is missing or empty`);
      }
    });
  }

  validateNumericFields(broker) {
    validationRules.numeric_fields.forEach(field => {
      if (broker[field] !== null && broker[field] !== undefined) {
        const value = parseFloat(broker[field]);
        if (isNaN(value)) {
          this.addError(broker.id, field, `Field '${field}' should be numeric but got '${broker[field]}'`);
        }
      }
    });
  }

  validateArrayFields(broker) {
    validationRules.array_fields.forEach(field => {
      if (broker[field] !== null && broker[field] !== undefined) {
        if (!Array.isArray(broker[field])) {
          this.addError(broker.id, field, `Field '${field}' should be an array but got ${typeof broker[field]}`);
        } else if (broker[field].length === 0) {
          this.addWarning(broker.id, field, `Array field '${field}' is empty`);
        }
      }
    });
  }

  validateEnumFields(broker) {
    Object.keys(validationRules.enum_fields).forEach(field => {
      if (broker[field] !== null && broker[field] !== undefined) {
        const allowedValues = validationRules.enum_fields[field];
        if (!allowedValues.includes(broker[field])) {
          this.addError(broker.id, field, `Field '${field}' has invalid value '${broker[field]}'. Allowed: ${allowedValues.join(', ')}`);
        }
      }
    });
  }

  validateUrlFields(broker) {
    validationRules.url_fields.forEach(field => {
      if (broker[field] !== null && broker[field] !== undefined) {
        try {
          new URL(broker[field]);
        } catch (e) {
          this.addError(broker.id, field, `Field '${field}' contains invalid URL: '${broker[field]}'`);
        }
      }
    });
  }

  validateTrustScore(broker) {
    if (broker.trust_score !== null && broker.trust_score !== undefined) {
      const score = parseInt(broker.trust_score);
      if (score < validationRules.trust_score_range[0] || score > validationRules.trust_score_range[1]) {
        this.addError(broker.id, 'trust_score', `Trust score ${score} is outside valid range [${validationRules.trust_score_range[0]}-${validationRules.trust_score_range[1]}]`);
      }
    }
  }

  validateEstablishedYear(broker) {
    if (broker.established_year !== null && broker.established_year !== undefined) {
      const year = parseInt(broker.established_year);
      if (year < validationRules.year_range[0] || year > validationRules.year_range[1]) {
        this.addError(broker.id, 'established_year', `Established year ${year} is outside valid range [${validationRules.year_range[0]}-${validationRules.year_range[1]}]`);
      }
    }
  }

  validateSlugUniqueness(brokers) {
    const slugs = new Set();
    const duplicates = new Set();
    
    brokers.forEach(broker => {
      if (slugs.has(broker.slug)) {
        duplicates.add(broker.slug);
      }
      slugs.add(broker.slug);
    });
    
    if (duplicates.size > 0) {
      duplicates.forEach(slug => {
        const brokersWithSlug = brokers.filter(b => b.slug === slug);
        brokersWithSlug.forEach(broker => {
          this.addError(broker.id, 'slug', `Duplicate slug '${slug}' found`);
        });
      });
    }
  }

  validateFeesStructure(broker) {
    if (broker.fees !== null && broker.fees !== undefined) {
      if (typeof broker.fees !== 'object') {
        this.addError(broker.id, 'fees', 'Fees field should be a JSON object');
      } else {
        const expectedFeeFields = ['commission', 'deposit_fee', 'withdrawal_fee', 'inactivity_fee'];
        const missingFields = expectedFeeFields.filter(field => !(field in broker.fees));
        if (missingFields.length > 0) {
          this.addWarning(broker.id, 'fees', `Missing fee fields: ${missingFields.join(', ')}`);
        }
      }
    }
  }

  validateBroker(broker) {
    this.validateRequiredFields(broker);
    this.validateNumericFields(broker);
    this.validateArrayFields(broker);
    this.validateEnumFields(broker);
    this.validateUrlFields(broker);
    this.validateTrustScore(broker);
    this.validateEstablishedYear(broker);
    this.validateFeesStructure(broker);
  }

  generateReport() {
    const brokerErrors = new Set(this.errors.map(e => e.broker_id));
    const brokerWarnings = new Set(this.warnings.map(w => w.broker_id));
    
    this.stats.brokers_with_errors = brokerErrors.size;
    this.stats.brokers_with_warnings = brokerWarnings.size;
    this.stats.valid_brokers = this.stats.total_brokers - this.stats.brokers_with_errors;
    
    return {
      stats: this.stats,
      errors: this.errors,
      warnings: this.warnings,
      summary: {
        total_errors: this.errors.length,
        total_warnings: this.warnings.length,
        validation_passed: this.errors.length === 0
      }
    };
  }
}

async function validateBrokerData() {
  console.log('=== Broker Data Validation ===\n');
  
  try {
    // Fetch all broker data
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching broker data:', error);
      return;
    }
    
    if (!brokers || brokers.length === 0) {
      console.log('No broker data found in database.');
      return;
    }
    
    console.log(`Found ${brokers.length} brokers to validate...\n`);
    
    // Initialize validator
    const validator = new DataValidator();
    validator.stats.total_brokers = brokers.length;
    
    // Validate each broker
    brokers.forEach(broker => {
      validator.validateBroker(broker);
    });
    
    // Validate uniqueness constraints
    validator.validateSlugUniqueness(brokers);
    
    // Generate and display report
    const report = validator.generateReport();
    
    console.log('=== VALIDATION SUMMARY ===');
    console.log(`Total Brokers: ${report.stats.total_brokers}`);
    console.log(`Valid Brokers: ${report.stats.valid_brokers}`);
    console.log(`Brokers with Errors: ${report.stats.brokers_with_errors}`);
    console.log(`Brokers with Warnings: ${report.stats.brokers_with_warnings}`);
    console.log(`Total Errors: ${report.summary.total_errors}`);
    console.log(`Total Warnings: ${report.summary.total_warnings}`);
    console.log(`Validation Status: ${report.summary.validation_passed ? '✅ PASSED' : '❌ FAILED'}\n`);
    
    // Display errors
    if (report.errors.length > 0) {
      console.log('=== ERRORS ===');
      report.errors.forEach(error => {
        const broker = brokers.find(b => b.id === error.broker_id);
        console.log(`❌ ${broker?.name || 'Unknown'} (${error.field}): ${error.message}`);
      });
      console.log('');
    }
    
    // Display warnings
    if (report.warnings.length > 0) {
      console.log('=== WARNINGS ===');
      report.warnings.forEach(warning => {
        const broker = brokers.find(b => b.id === warning.broker_id);
        console.log(`⚠️  ${broker?.name || 'Unknown'} (${warning.field}): ${warning.message}`);
      });
      console.log('');
    }
    
    // Display broker details
    console.log('=== BROKER DETAILS ===');
    brokers.forEach(broker => {
      const brokerErrors = report.errors.filter(e => e.broker_id === broker.id);
      const brokerWarnings = report.warnings.filter(w => w.broker_id === broker.id);
      const status = brokerErrors.length > 0 ? '❌' : brokerWarnings.length > 0 ? '⚠️' : '✅';
      
      console.log(`${status} ${broker.name}:`);
      console.log(`   Slug: ${broker.slug}`);
      console.log(`   Country: ${broker.country}`);
      console.log(`   Trust Score: ${broker.trust_score}`);
      console.log(`   Regulation Tier: ${broker.regulation_tier}`);
      console.log(`   Min Deposit: ${broker.min_deposit}`);
      console.log(`   Platforms: ${broker.platforms?.length || 0} listed`);
      console.log(`   Instruments: ${broker.instruments?.length || 0} listed`);
      console.log(`   Regulations: ${broker.regulations?.length || 0} listed`);
      if (brokerErrors.length > 0) {
        console.log(`   Errors: ${brokerErrors.length}`);
      }
      if (brokerWarnings.length > 0) {
        console.log(`   Warnings: ${brokerWarnings.length}`);
      }
      console.log('');
    });
    
    return report;
    
  } catch (error) {
    console.error('Unexpected error during validation:', error);
  }
}

async function main() {
  const report = await validateBrokerData();
  
  if (report) {
    console.log('=== VALIDATION COMPLETE ===');
    if (report.summary.validation_passed) {
      console.log('🎉 All broker data passed validation!');
    } else {
      console.log('⚠️  Some issues found. Please review errors above.');
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateBrokerData, DataValidator };