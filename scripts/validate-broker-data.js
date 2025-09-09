#!/usr/bin/env node

/**
 * Broker Data Validation Script
 * Validates extracted broker data for quality, completeness, and consistency
 * before inserting into the Supabase database
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../.env' });

/**
 * Validation rules and thresholds
 */
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
  },
  
  minDeposit: {
    required: false,
    min: 0,
    max: 100000,
    type: 'number'
  },
  
  maxLeverage: {
    required: false,
    min: 1,
    max: 3000,
    type: 'number'
  },
  
  spreadFrom: {
    required: false,
    min: 0,
    max: 10,
    type: 'number'
  },
  
  platforms: {
    required: false,
    type: 'array',
    allowedValues: ['mt4', 'mt5', 'ctrader', 'webtrader', 'tradingview', 'proprietary', 'mobile']
  },
  
  websiteUrl: {
    required: false,
    pattern: /^https?:\/\/.+\..+/
  }
};

/**
 * Quality score thresholds
 */
const QUALITY_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 75,
  ACCEPTABLE: 60,
  POOR: 40
};

/**
 * Validate individual broker data
 */
function validateBrokerData(brokerData) {
  const validation = {
    isValid: true,
    errors: [],
    warnings: [],
    qualityScore: 0,
    completeness: 0
  };
  
  let totalFields = 0;
  let completedFields = 0;
  let qualityPoints = 0;
  let maxQualityPoints = 0;
  
  // Validate broker name (critical)
  if (!brokerData.name) {
    validation.errors.push('Broker name is required');
    validation.isValid = false;
  } else if (brokerData.name.length < VALIDATION_RULES.brokerName.minLength) {
    validation.errors.push(`Broker name too short (min ${VALIDATION_RULES.brokerName.minLength} characters)`);
    validation.isValid = false;
  } else if (!VALIDATION_RULES.brokerName.pattern.test(brokerData.name)) {
    validation.warnings.push('Broker name contains unusual characters');
  } else {
    qualityPoints += 20; // High weight for valid name
  }
  maxQualityPoints += 20;
  totalFields++;
  if (brokerData.name) completedFields++;
  
  // Validate rating
  if (brokerData.overall_rating !== undefined) {
    totalFields++;
    if (typeof brokerData.overall_rating === 'number') {
      completedFields++;
      if (brokerData.overall_rating >= VALIDATION_RULES.rating.min && 
          brokerData.overall_rating <= VALIDATION_RULES.rating.max) {
        qualityPoints += 10;
      } else {
        validation.warnings.push(`Rating out of range (${VALIDATION_RULES.rating.min}-${VALIDATION_RULES.rating.max})`);
      }
    } else {
      validation.warnings.push('Rating should be a number');
    }
  }
  maxQualityPoints += 10;
  
  // Validate minimum deposit
  if (brokerData.min_deposit !== undefined) {
    totalFields++;
    if (typeof brokerData.min_deposit === 'number') {
      completedFields++;
      if (brokerData.min_deposit >= VALIDATION_RULES.minDeposit.min && 
          brokerData.min_deposit <= VALIDATION_RULES.minDeposit.max) {
        qualityPoints += 8;
      } else {
        validation.warnings.push(`Minimum deposit out of reasonable range ($${VALIDATION_RULES.minDeposit.min}-$${VALIDATION_RULES.minDeposit.max})`);
      }
    } else {
      validation.warnings.push('Minimum deposit should be a number');
    }
  }
  maxQualityPoints += 8;
  
  // Validate maximum leverage
  if (brokerData.max_leverage !== undefined) {
    totalFields++;
    if (typeof brokerData.max_leverage === 'number') {
      completedFields++;
      if (brokerData.max_leverage >= VALIDATION_RULES.maxLeverage.min && 
          brokerData.max_leverage <= VALIDATION_RULES.maxLeverage.max) {
        qualityPoints += 8;
      } else {
        validation.warnings.push(`Maximum leverage out of reasonable range (${VALIDATION_RULES.maxLeverage.min}:1-${VALIDATION_RULES.maxLeverage.max}:1)`);
      }
    } else {
      validation.warnings.push('Maximum leverage should be a number');
    }
  }
  maxQualityPoints += 8;
  
  // Validate spread
  if (brokerData.spread_from !== undefined) {
    totalFields++;
    if (typeof brokerData.spread_from === 'number') {
      completedFields++;
      if (brokerData.spread_from >= VALIDATION_RULES.spreadFrom.min && 
          brokerData.spread_from <= VALIDATION_RULES.spreadFrom.max) {
        qualityPoints += 6;
      } else {
        validation.warnings.push(`Spread from out of reasonable range (${VALIDATION_RULES.spreadFrom.min}-${VALIDATION_RULES.spreadFrom.max} pips)`);
      }
    } else {
      validation.warnings.push('Spread from should be a number');
    }
  }
  maxQualityPoints += 6;
  
  // Validate platforms
  if (brokerData.platforms && Array.isArray(brokerData.platforms)) {
    totalFields++;
    completedFields++;
    const validPlatforms = brokerData.platforms.filter(platform => 
      VALIDATION_RULES.platforms.allowedValues.includes(platform.toLowerCase())
    );
    
    if (validPlatforms.length > 0) {
      qualityPoints += Math.min(validPlatforms.length * 2, 8); // Max 8 points
    }
    
    if (validPlatforms.length < brokerData.platforms.length) {
      validation.warnings.push('Some platforms are not recognized');
    }
  }
  maxQualityPoints += 8;
  
  // Validate website URL
  if (brokerData.website_url) {
    totalFields++;
    if (VALIDATION_RULES.websiteUrl.pattern.test(brokerData.website_url)) {
      completedFields++;
      qualityPoints += 5;
    } else {
      validation.warnings.push('Website URL format is invalid');
    }
  }
  maxQualityPoints += 5;
  
  // Validate regulation data
  if (brokerData.regulations && Array.isArray(brokerData.regulations) && brokerData.regulations.length > 0) {
    totalFields++;
    completedFields++;
    qualityPoints += 10; // High value for regulation info
  }
  maxQualityPoints += 10;
  
  // Validate pros and cons
  if (brokerData.pros && Array.isArray(brokerData.pros) && brokerData.pros.length > 0) {
    totalFields++;
    completedFields++;
    qualityPoints += 5;
  }
  maxQualityPoints += 5;
  
  if (brokerData.cons && Array.isArray(brokerData.cons) && brokerData.cons.length > 0) {
    totalFields++;
    completedFields++;
    qualityPoints += 5;
  }
  maxQualityPoints += 5;
  
  // Calculate scores
  validation.completeness = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  validation.qualityScore = maxQualityPoints > 0 ? Math.round((qualityPoints / maxQualityPoints) * 100) : 0;
  
  return validation;
}

/**
 * Get quality level based on score
 */
function getQualityLevel(score) {
  if (score >= QUALITY_THRESHOLDS.EXCELLENT) return 'EXCELLENT';
  if (score >= QUALITY_THRESHOLDS.GOOD) return 'GOOD';
  if (score >= QUALITY_THRESHOLDS.ACCEPTABLE) return 'ACCEPTABLE';
  if (score >= QUALITY_THRESHOLDS.POOR) return 'POOR';
  return 'VERY_POOR';
}

/**
 * Validate array of broker data
 */
function validateBrokerDataArray(brokerDataArray) {
  const results = {
    totalBrokers: brokerDataArray.length,
    validBrokers: 0,
    invalidBrokers: 0,
    averageQuality: 0,
    averageCompleteness: 0,
    qualityDistribution: {
      EXCELLENT: 0,
      GOOD: 0,
      ACCEPTABLE: 0,
      POOR: 0,
      VERY_POOR: 0
    },
    validationResults: [],
    summary: {
      criticalErrors: 0,
      warnings: 0,
      recommendations: []
    }
  };
  
  let totalQuality = 0;
  let totalCompleteness = 0;
  
  brokerDataArray.forEach((brokerData, index) => {
    const validation = validateBrokerData(brokerData);
    validation.brokerName = brokerData.name || `Broker ${index + 1}`;
    validation.index = index;
    
    results.validationResults.push(validation);
    
    if (validation.isValid) {
      results.validBrokers++;
    } else {
      results.invalidBrokers++;
      results.summary.criticalErrors += validation.errors.length;
    }
    
    results.summary.warnings += validation.warnings.length;
    totalQuality += validation.qualityScore;
    totalCompleteness += validation.completeness;
    
    const qualityLevel = getQualityLevel(validation.qualityScore);
    results.qualityDistribution[qualityLevel]++;
  });
  
  results.averageQuality = results.totalBrokers > 0 ? Math.round(totalQuality / results.totalBrokers) : 0;
  results.averageCompleteness = results.totalBrokers > 0 ? Math.round(totalCompleteness / results.totalBrokers) : 0;
  
  // Generate recommendations
  if (results.averageQuality < QUALITY_THRESHOLDS.ACCEPTABLE) {
    results.summary.recommendations.push('Overall data quality is below acceptable threshold. Consider improving extraction patterns.');
  }
  
  if (results.averageCompleteness < 70) {
    results.summary.recommendations.push('Data completeness is low. Review extraction logic for missing fields.');
  }
  
  if (results.invalidBrokers > results.totalBrokers * 0.2) {
    results.summary.recommendations.push('High number of invalid brokers. Check data source quality.');
  }
  
  return results;
}

/**
 * Clean and normalize broker data
 */
function cleanBrokerData(brokerData) {
  const cleaned = { ...brokerData };
  
  // Clean broker name
  if (cleaned.name) {
    cleaned.name = cleaned.name
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^a-zA-Z0-9\s\-\.&]/g, '')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  // Normalize platforms
  if (cleaned.platforms && Array.isArray(cleaned.platforms)) {
    cleaned.platforms = cleaned.platforms
      .map(platform => platform.toLowerCase().trim())
      .filter(platform => VALIDATION_RULES.platforms.allowedValues.includes(platform))
      .filter((platform, index, arr) => arr.indexOf(platform) === index); // Remove duplicates
  }
  
  // Ensure numeric values are properly typed
  ['overall_rating', 'min_deposit', 'max_leverage', 'spread_from'].forEach(field => {
    if (cleaned[field] !== undefined && cleaned[field] !== null) {
      const num = parseFloat(cleaned[field]);
      if (!isNaN(num)) {
        cleaned[field] = num;
      } else {
        delete cleaned[field];
      }
    }
  });
  
  // Clean arrays
  ['pros', 'cons'].forEach(field => {
    if (cleaned[field] && Array.isArray(cleaned[field])) {
      cleaned[field] = cleaned[field]
        .filter(item => item && typeof item === 'string' && item.trim().length > 0)
        .map(item => item.trim())
        .slice(0, 5); // Limit to 5 items
    }
  });
  
  return cleaned;
}

/**
 * Generate validation report
 */
function generateValidationReport(validationResults) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: validationResults.summary,
    statistics: {
      totalBrokers: validationResults.totalBrokers,
      validBrokers: validationResults.validBrokers,
      invalidBrokers: validationResults.invalidBrokers,
      validationRate: validationResults.totalBrokers > 0 ? 
        Math.round((validationResults.validBrokers / validationResults.totalBrokers) * 100) : 0,
      averageQuality: validationResults.averageQuality,
      averageCompleteness: validationResults.averageCompleteness
    },
    qualityDistribution: validationResults.qualityDistribution,
    detailedResults: validationResults.validationResults.map(result => ({
      brokerName: result.brokerName,
      isValid: result.isValid,
      qualityScore: result.qualityScore,
      qualityLevel: getQualityLevel(result.qualityScore),
      completeness: result.completeness,
      errorCount: result.errors.length,
      warningCount: result.warnings.length,
      errors: result.errors,
      warnings: result.warnings
    }))
  };
  
  return report;
}

/**
 * Main validation function
 */
async function validateExtractedData(inputFile) {
  try {
    console.log('🔍 Starting broker data validation...');
    
    // Read extracted data
    const extractedData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    const brokerDataArray = extractedData.extracted_data || extractedData;
    
    console.log(`📊 Validating ${brokerDataArray.length} broker records...`);
    
    // Clean data first
    const cleanedData = brokerDataArray.map(cleanBrokerData);
    
    // Validate data
    const validationResults = validateBrokerDataArray(cleanedData);
    
    // Generate report
    const report = generateValidationReport(validationResults);
    
    // Save validation report
    const reportPath = path.join(__dirname, 'broker-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Save cleaned data
    const cleanedDataPath = path.join(__dirname, 'broker-data-cleaned.json');
    fs.writeFileSync(cleanedDataPath, JSON.stringify({
      validation_timestamp: new Date().toISOString(),
      total_brokers: cleanedData.length,
      validation_summary: report.summary,
      cleaned_data: cleanedData
    }, null, 2));
    
    // Display results
    console.log('\n📋 VALIDATION RESULTS:');
    console.log(`✅ Valid brokers: ${report.statistics.validBrokers}/${report.statistics.totalBrokers} (${report.statistics.validationRate}%)`);
    console.log(`📈 Average quality score: ${report.statistics.averageQuality}%`);
    console.log(`📊 Average completeness: ${report.statistics.averageCompleteness}%`);
    console.log(`⚠️  Total warnings: ${report.summary.warnings}`);
    console.log(`❌ Critical errors: ${report.summary.criticalErrors}`);
    
    console.log('\n🏆 QUALITY DISTRIBUTION:');
    Object.entries(report.qualityDistribution).forEach(([level, count]) => {
      if (count > 0) {
        console.log(`${level}: ${count} brokers`);
      }
    });
    
    if (report.summary.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      report.summary.recommendations.forEach(rec => console.log(`- ${rec}`));
    }
    
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    console.log(`🧹 Cleaned data saved to: ${cleanedDataPath}`);
    
    return {
      isValid: report.statistics.validationRate >= 80,
      report,
      cleanedData
    };
    
  } catch (error) {
    console.error('❌ Validation failed:', error);
    throw error;
  }
}

// CLI execution
if (require.main === module) {
  const inputFile = process.argv[2] || path.join(__dirname, 'broker-extraction-report.json');
  
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Input file not found: ${inputFile}`);
    console.log('Usage: node validate-broker-data.js [input-file.json]');
    process.exit(1);
  }
  
  validateExtractedData(inputFile)
    .then(result => {
      console.log(`\n${result.isValid ? '✅' : '❌'} Validation ${result.isValid ? 'PASSED' : 'FAILED'}`);
      process.exit(result.isValid ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Validation error:', error.message);
      process.exit(1);
    });
}

module.exports = {
  validateBrokerData,
  validateBrokerDataArray,
  cleanBrokerData,
  generateValidationReport,
  validateExtractedData
};