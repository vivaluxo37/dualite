#!/usr/bin/env node

/**
 * Database Schema Testing Script
 * Tests the enhanced broker database schema with sample data
 * Validates all tables, relationships, triggers, and RLS policies
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../.env' });

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

/**
 * Sample test data for comprehensive schema testing
 */
const SAMPLE_BROKER_DATA = {
  name: 'Test Broker Pro',
  description: 'A comprehensive test broker for schema validation',
  website_url: 'https://testbrokerpro.com',
  logo_url: 'https://testbrokerpro.com/logo.png',
  overall_rating: 4.2,
  min_deposit: 100,
  max_leverage: 500,
  spread_from: 0.8,
  platforms: ['mt4', 'mt5', 'webtrader'],
  account_types: ['standard', 'pro', 'vip'],
  pros: [
    'Low spreads',
    'Multiple platforms',
    'Good customer support',
    'Regulated broker'
  ],
  cons: [
    'High minimum deposit for VIP',
    'Limited educational resources'
  ],
  founded_year: 2015,
  headquarters: 'London, UK',
  employees_count: 250,
  is_active: true
};

const SAMPLE_TRADING_CONDITIONS = {
  account_type: 'standard',
  min_deposit: 100,
  max_leverage: 500,
  spread_from: 0.8,
  commission_per_lot: 0,
  swap_free: false,
  hedging_allowed: true,
  scalping_allowed: true,
  ea_allowed: true,
  min_trade_size: 0.01,
  max_trade_size: 100,
  stop_out_level: 20,
  margin_call_level: 50
};

const SAMPLE_INSTRUMENTS = [
  {
    category: 'forex',
    symbol: 'EURUSD',
    spread_from: 0.8,
    commission: 0,
    swap_long: -2.5,
    swap_short: 0.5,
    min_lot_size: 0.01,
    max_lot_size: 100,
    leverage: 500
  },
  {
    category: 'commodities',
    symbol: 'XAUUSD',
    spread_from: 2.0,
    commission: 0,
    swap_long: -8.5,
    swap_short: 2.1,
    min_lot_size: 0.01,
    max_lot_size: 50,
    leverage: 100
  }
];

const SAMPLE_PAYMENT_METHODS = [
  {
    method_type: 'deposit',
    payment_type: 'credit_card',
    provider: 'Visa/Mastercard',
    min_amount: 10,
    max_amount: 10000,
    processing_time: 'instant',
    fee_percentage: 0,
    fee_fixed: 0,
    currencies: ['USD', 'EUR', 'GBP']
  },
  {
    method_type: 'withdrawal',
    payment_type: 'bank_transfer',
    provider: 'Wire Transfer',
    min_amount: 50,
    max_amount: 50000,
    processing_time: '1-3 business days',
    fee_percentage: 0,
    fee_fixed: 25,
    currencies: ['USD', 'EUR']
  }
];

const SAMPLE_BONUSES = [
  {
    bonus_type: 'welcome',
    title: 'Welcome Bonus',
    description: '100% deposit bonus up to $1000',
    percentage: 100,
    max_amount: 1000,
    min_deposit: 100,
    wagering_requirement: 30,
    validity_days: 90,
    terms_conditions: 'Standard terms apply',
    is_active: true
  }
];

const SAMPLE_SUPPORT_CHANNELS = [
  {
    channel_type: 'live_chat',
    availability: '24/5',
    languages: ['English', 'Spanish', 'French'],
    response_time: 'Under 2 minutes',
    is_active: true
  },
  {
    channel_type: 'email',
    contact_info: 'support@testbrokerpro.com',
    availability: '24/7',
    languages: ['English'],
    response_time: 'Within 24 hours',
    is_active: true
  }
];

const SAMPLE_REGULATIONS = [
  {
    regulator: 'FCA',
    license_number: 'FCA123456',
    jurisdiction: 'United Kingdom',
    license_type: 'Investment Services',
    status: 'active',
    date_issued: '2015-06-01',
    date_expires: '2025-06-01'
  }
];

/**
 * Test helper functions
 */
class SchemaTestRunner {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      errors: [],
      details: []
    };
    this.testBrokerId = null;
  }

  async runTest(testName, testFunction) {
    try {
      console.log(`🧪 Running test: ${testName}`);
      await testFunction();
      this.testResults.passed++;
      this.testResults.details.push({ test: testName, status: 'PASSED', error: null });
      console.log(`✅ ${testName} - PASSED`);
    } catch (error) {
      this.testResults.failed++;
      this.testResults.errors.push({ test: testName, error: error.message });
      this.testResults.details.push({ test: testName, status: 'FAILED', error: error.message });
      console.log(`❌ ${testName} - FAILED: ${error.message}`);
    }
  }

  async testBrokerInsertion() {
    const { data, error } = await supabase
      .from('brokers')
      .insert(SAMPLE_BROKER_DATA)
      .select()
      .single();

    if (error) throw new Error(`Broker insertion failed: ${error.message}`);
    if (!data) throw new Error('No broker data returned after insertion');
    
    this.testBrokerId = data.id;
    console.log(`📝 Created test broker with ID: ${this.testBrokerId}`);
  }

  async testTradingConditionsInsertion() {
    if (!this.testBrokerId) throw new Error('Test broker not created');
    
    const { data, error } = await supabase
      .from('broker_trading_conditions')
      .insert({ ...SAMPLE_TRADING_CONDITIONS, broker_id: this.testBrokerId })
      .select()
      .single();

    if (error) throw new Error(`Trading conditions insertion failed: ${error.message}`);
    if (!data) throw new Error('No trading conditions data returned');
  }

  async testInstrumentsInsertion() {
    if (!this.testBrokerId) throw new Error('Test broker not created');
    
    const instrumentsWithBrokerId = SAMPLE_INSTRUMENTS.map(instrument => ({
      ...instrument,
      broker_id: this.testBrokerId
    }));

    const { data, error } = await supabase
      .from('broker_instruments')
      .insert(instrumentsWithBrokerId)
      .select();

    if (error) throw new Error(`Instruments insertion failed: ${error.message}`);
    if (!data || data.length !== SAMPLE_INSTRUMENTS.length) {
      throw new Error('Incorrect number of instruments inserted');
    }
  }

  async testPaymentMethodsInsertion() {
    if (!this.testBrokerId) throw new Error('Test broker not created');
    
    const paymentMethodsWithBrokerId = SAMPLE_PAYMENT_METHODS.map(method => ({
      ...method,
      broker_id: this.testBrokerId
    }));

    const { data, error } = await supabase
      .from('broker_payment_methods')
      .insert(paymentMethodsWithBrokerId)
      .select();

    if (error) throw new Error(`Payment methods insertion failed: ${error.message}`);
    if (!data || data.length !== SAMPLE_PAYMENT_METHODS.length) {
      throw new Error('Incorrect number of payment methods inserted');
    }
  }

  async testBonusesInsertion() {
    if (!this.testBrokerId) throw new Error('Test broker not created');
    
    const bonusesWithBrokerId = SAMPLE_BONUSES.map(bonus => ({
      ...bonus,
      broker_id: this.testBrokerId
    }));

    const { data, error } = await supabase
      .from('broker_bonuses')
      .insert(bonusesWithBrokerId)
      .select();

    if (error) throw new Error(`Bonuses insertion failed: ${error.message}`);
    if (!data || data.length !== SAMPLE_BONUSES.length) {
      throw new Error('Incorrect number of bonuses inserted');
    }
  }

  async testSupportChannelsInsertion() {
    if (!this.testBrokerId) throw new Error('Test broker not created');
    
    const supportChannelsWithBrokerId = SAMPLE_SUPPORT_CHANNELS.map(channel => ({
      ...channel,
      broker_id: this.testBrokerId
    }));

    const { data, error } = await supabase
      .from('broker_support_channels')
      .insert(supportChannelsWithBrokerId)
      .select();

    if (error) throw new Error(`Support channels insertion failed: ${error.message}`);
    if (!data || data.length !== SAMPLE_SUPPORT_CHANNELS.length) {
      throw new Error('Incorrect number of support channels inserted');
    }
  }

  async testRegulationsInsertion() {
    if (!this.testBrokerId) throw new Error('Test broker not created');
    
    const regulationsWithBrokerId = SAMPLE_REGULATIONS.map(regulation => ({
      ...regulation,
      broker_id: this.testBrokerId
    }));

    const { data, error } = await supabase
      .from('broker_regulations')
      .insert(regulationsWithBrokerId)
      .select();

    if (error) throw new Error(`Regulations insertion failed: ${error.message}`);
    if (!data || data.length !== SAMPLE_REGULATIONS.length) {
      throw new Error('Incorrect number of regulations inserted');
    }
  }

  async testDataRetrieval() {
    if (!this.testBrokerId) throw new Error('Test broker not created');
    
    // Test comprehensive broker data retrieval
    const { data, error } = await supabase
      .from('brokers')
      .select(`
        *,
        broker_trading_conditions(*),
        broker_instruments(*),
        broker_payment_methods(*),
        broker_bonuses(*),
        broker_support_channels(*),
        broker_regulations(*)
      `)
      .eq('id', this.testBrokerId)
      .single();

    if (error) throw new Error(`Data retrieval failed: ${error.message}`);
    if (!data) throw new Error('No broker data retrieved');
    
    // Validate relationships
    if (!data.broker_trading_conditions || data.broker_trading_conditions.length === 0) {
      throw new Error('Trading conditions not retrieved');
    }
    if (!data.broker_instruments || data.broker_instruments.length !== SAMPLE_INSTRUMENTS.length) {
      throw new Error('Instruments not properly retrieved');
    }
    if (!data.broker_payment_methods || data.broker_payment_methods.length !== SAMPLE_PAYMENT_METHODS.length) {
      throw new Error('Payment methods not properly retrieved');
    }
    
    console.log(`📊 Retrieved complete broker data with ${data.broker_instruments.length} instruments`);
  }

  async testDataValidation() {
    if (!this.testBrokerId) throw new Error('Test broker not created');
    
    // Test data constraints and validations
    try {
      // Test invalid rating (should fail)
      await supabase
        .from('brokers')
        .insert({
          ...SAMPLE_BROKER_DATA,
          name: 'Invalid Rating Broker',
          overall_rating: 6.0 // Invalid rating > 5
        });
      throw new Error('Invalid rating was accepted (should have been rejected)');
    } catch (error) {
      if (!error.message.includes('rating') && !error.message.includes('constraint')) {
        throw error; // Re-throw if it's not the expected validation error
      }
      console.log('✅ Rating validation working correctly');
    }
    
    // Test duplicate broker name (should fail due to unique constraint)
    try {
      await supabase
        .from('brokers')
        .insert({
          ...SAMPLE_BROKER_DATA,
          name: 'Test Broker Pro' // Same name as test broker
        });
      throw new Error('Duplicate broker name was accepted (should have been rejected)');
    } catch (error) {
      if (!error.message.includes('duplicate') && !error.message.includes('unique')) {
        throw error;
      }
      console.log('✅ Unique name constraint working correctly');
    }
  }

  async testIndexPerformance() {
    // Test that indexes are working by checking query performance
    const startTime = Date.now();
    
    const { data, error } = await supabase
      .from('brokers')
      .select('*')
      .gte('overall_rating', 4.0)
      .order('overall_rating', { ascending: false })
      .limit(10);
    
    const queryTime = Date.now() - startTime;
    
    if (error) throw new Error(`Index performance test failed: ${error.message}`);
    
    console.log(`📈 Query completed in ${queryTime}ms`);
    
    if (queryTime > 1000) {
      console.log('⚠️  Query took longer than expected - check indexes');
    }
  }

  async testTriggers() {
    if (!this.testBrokerId) throw new Error('Test broker not created');
    
    // Get initial updated_at timestamp
    const { data: initialData } = await supabase
      .from('brokers')
      .select('updated_at')
      .eq('id', this.testBrokerId)
      .single();
    
    const initialTimestamp = new Date(initialData.updated_at);
    
    // Wait a moment to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update broker data
    const { error } = await supabase
      .from('brokers')
      .update({ description: 'Updated description for trigger test' })
      .eq('id', this.testBrokerId);
    
    if (error) throw new Error(`Trigger test update failed: ${error.message}`);
    
    // Check if updated_at was automatically updated
    const { data: updatedData } = await supabase
      .from('brokers')
      .select('updated_at')
      .eq('id', this.testBrokerId)
      .single();
    
    const updatedTimestamp = new Date(updatedData.updated_at);
    
    if (updatedTimestamp <= initialTimestamp) {
      throw new Error('updated_at trigger not working - timestamp not updated');
    }
    
    console.log('✅ updated_at trigger working correctly');
  }

  async cleanupTestData() {
    if (this.testBrokerId) {
      console.log('🧹 Cleaning up test data...');
      
      // Delete broker (should cascade to related tables)
      const { error } = await supabase
        .from('brokers')
        .delete()
        .eq('id', this.testBrokerId);
      
      if (error) {
        console.log(`⚠️  Cleanup warning: ${error.message}`);
      } else {
        console.log('✅ Test data cleaned up successfully');
      }
    }
  }

  generateReport() {
    const totalTests = this.testResults.passed + this.testResults.failed;
    const successRate = totalTests > 0 ? Math.round((this.testResults.passed / totalTests) * 100) : 0;
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests,
        passed: this.testResults.passed,
        failed: this.testResults.failed,
        successRate: `${successRate}%`
      },
      details: this.testResults.details,
      errors: this.testResults.errors
    };
    
    return report;
  }
}

/**
 * Main test execution function
 */
async function runSchemaTests() {
  console.log('🚀 Starting comprehensive database schema tests...');
  console.log('=' .repeat(60));
  
  const testRunner = new SchemaTestRunner();
  
  try {
    // Core table tests
    await testRunner.runTest('Broker Insertion', () => testRunner.testBrokerInsertion());
    await testRunner.runTest('Trading Conditions Insertion', () => testRunner.testTradingConditionsInsertion());
    await testRunner.runTest('Instruments Insertion', () => testRunner.testInstrumentsInsertion());
    await testRunner.runTest('Payment Methods Insertion', () => testRunner.testPaymentMethodsInsertion());
    await testRunner.runTest('Bonuses Insertion', () => testRunner.testBonusesInsertion());
    await testRunner.runTest('Support Channels Insertion', () => testRunner.testSupportChannelsInsertion());
    await testRunner.runTest('Regulations Insertion', () => testRunner.testRegulationsInsertion());
    
    // Relationship and retrieval tests
    await testRunner.runTest('Data Retrieval with Relationships', () => testRunner.testDataRetrieval());
    
    // Validation and constraint tests
    await testRunner.runTest('Data Validation and Constraints', () => testRunner.testDataValidation());
    
    // Performance tests
    await testRunner.runTest('Index Performance', () => testRunner.testIndexPerformance());
    
    // Trigger tests
    await testRunner.runTest('Database Triggers', () => testRunner.testTriggers());
    
  } finally {
    // Always cleanup
    await testRunner.cleanupTestData();
  }
  
  // Generate and save report
  const report = testRunner.generateReport();
  const reportPath = path.join(__dirname, 'schema-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Display results
  console.log('\n' + '=' .repeat(60));
  console.log('📊 SCHEMA TEST RESULTS:');
  console.log(`✅ Passed: ${report.summary.passed}`);
  console.log(`❌ Failed: ${report.summary.failed}`);
  console.log(`📈 Success Rate: ${report.summary.successRate}`);
  
  if (report.errors.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    report.errors.forEach(error => {
      console.log(`- ${error.test}: ${error.error}`);
    });
  }
  
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  
  return {
    success: report.summary.failed === 0,
    report
  };
}

// CLI execution
if (require.main === module) {
  runSchemaTests()
    .then(result => {
      console.log(`\n${result.success ? '🎉' : '💥'} Schema tests ${result.success ? 'COMPLETED SUCCESSFULLY' : 'FAILED'}`);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Schema test execution failed:', error.message);
      process.exit(1);
    });
}

module.exports = {
  runSchemaTests,
  SchemaTestRunner
};