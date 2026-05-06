#!/usr/bin/env node

// Master Test Runner for TFX AI Calculator
// Runs all test scripts and generates a comprehensive report

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const testFiles = [
  { name: 'Basic Calculator', file: 'test-calculator.js' },
  { name: 'Enhanced Features', file: 'test-enhanced-calculator.js' },
  { name: 'Loading Fix', file: 'test-loading-fix.js' }
];

const runTest = (testFile) => {
  return new Promise((resolve, reject) => {
    console.log(`\n🧪 Running ${testFile.name}...`);
    
    const child = exec(`node ${testFile.file}`, {
      cwd: __dirname,
      stdio: 'pipe'
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
      process.stdout.write(data);
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
      process.stderr.write(data);
    });

    child.on('close', (code) => {
      resolve({
        name: testFile.name,
        file: testFile.file,
        exitCode: code,
        stdout,
        stderr,
        passed: code === 0
      });
    });

    child.on('error', (error) => {
      reject({
        name: testFile.name,
        file: testFile.file,
        error: error.message,
        passed: false
      });
    });
  });
};

const generateReport = (results) => {
  const timestamp = new Date().toISOString();
  const report = {
    timestamp,
    summary: {
      total: results.length,
      passed: results.filter(r => r.passed).length,
      failed: results.filter(r => !r.passed).length
    },
    results: results.map(r => ({
      name: r.name,
      file: r.file,
      status: r.passed ? '✅ PASSED' : '❌ FAILED',
      exitCode: r.exitCode,
      error: r.error || r.stderr
    }))
  };

  // Save report to file
  const reportPath = path.join(__dirname, 'test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  return report;
};

const main = async () => {
  console.log('🚀 TFX AI Calculator - Master Test Runner');
  console.log('==========================================');
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  
  const results = [];
  
  // Run all tests
  for (const testFile of testFiles) {
    try {
      const result = await runTest(testFile);
      results.push(result);
    } catch (error) {
      results.push(error);
    }
  }

  // Generate report
  const report = generateReport(results);

  // Display summary
  console.log('\n🎯 Test Results Summary');
  console.log('=======================');
  console.log(`📊 Total Tests: ${report.summary.total}`);
  console.log(`✅ Passed: ${report.summary.passed}`);
  console.log(`❌ Failed: ${report.summary.failed}`);
  console.log(`⏰ Completed at: ${new Date().toLocaleString()}`);

  // Display individual results
  console.log('\n📋 Individual Test Results:');
  console.log('==========================');
  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.name}: ${result.passed ? 'PASSED' : 'FAILED'}`);
    if (!result.passed && result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });

  // Final status
  const allPassed = report.summary.failed === 0;
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! Calculator is ready for production.');
    console.log('🚀 Status: PRODUCTION READY ✅');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the errors above.');
    console.log('🔧 Status: NEEDS ATTENTION ⚠️');
  }

  // Save detailed report
  console.log(`\n📄 Detailed report saved to: tests/test-report.json`);

  // Exit with appropriate code
  process.exit(allPassed ? 0 : 1);
};

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});

// Run the tests
if (require.main === module) {
  main();
}

module.exports = { runTest, generateReport };
