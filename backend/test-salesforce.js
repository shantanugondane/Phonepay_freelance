/**
 * Standalone script to test Salesforce API connection
 * Run: node test-salesforce.js
 */
require('dotenv').config();
const salesforceService = require('./services/salesforce');

async function test() {
  console.log('Testing Salesforce API connection...\n');
  
  try {
    // Test authentication
    console.log('1. Authenticating with Salesforce...');
    await salesforceService.authenticate();
    console.log('   ✓ Authentication successful\n');

    // Test fetching cases
    console.log('2. Fetching cases from Salesforce...');
    const result = await salesforceService.getCases();
    console.log(`   ✓ Fetched ${result.totalSize} cases\n`);

    // Show sample
    if (result.cases.length > 0) {
      console.log('3. Sample case (first record):');
      console.log(JSON.stringify(result.cases[0], null, 2));
    }

    console.log('\n✅ Salesforce API is working correctly!');
  } catch (error) {
    console.error('\n❌ Salesforce API test failed:');
    console.error(error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

test();
