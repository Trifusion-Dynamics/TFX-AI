#!/usr/bin/env node

// Categorized Test Runner for TFX AI Calculator
// Runs tests by category: Unit, Integration, E2E

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const testCategories = [
  {
    name: 'Unit Tests',
    folder: 'unit-tests',
    files: ['test-calculator.js']
  },
  {
    name: 'Integration Tests',
    folder: 'integration-tests',
    files: ['test-enhanced-calculator.js']
  },
  {
    name: 'E2E Tests',
    folder: 'e2e-tests',
    files: ['test-loading-fix.js']
  }
];

const runTestCategory = async (category) => {
  console.log(`\n🧪 Running ${category.name}...`);
  console.log('='.repeat(50));
  
  const results = [];
  
  for (const testFile of category.files) {
    const fullPath = path.join(__dirname, '..', category.folder, testFile);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️ Test file not found: ${testFile}`);
      continue;
    }
    
    try {
      const result = await new Promise((resolve, reject) => {
        const child = exec(`node "${fullPath}"`, {
          cwd: path.join(__dirname, '..'),
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
            name: testFile,
            exitCode: code,
            stdout,
            stderr,
            passed: code === 0
          });
        });

        child.on('error', (error) => {
          reject({
            name: testFile,
            error: error.message,
            passed: false
          });
        });
      });
      
      results.push(result);
    } catch (error) {
      results.push(error);
    }
  }
  
  return {
    category: category.name,
    results
  };
};

const generateCategorizedReport = (allResults) => {
  const timestamp = new Date().toISOString();
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  
  const reportData = {
    timestamp,
    categories: allResults.map(category => {
      const categoryPassed = category.results.filter(r => r.passed).length;
      const categoryTotal = category.results.length;
      
      totalTests += categoryTotal;
      passedTests += categoryPassed;
      failedTests += categoryTotal - categoryPassed;
      
      return {
        name: category.category,
        total: categoryTotal,
        passed: categoryPassed,
        failed: categoryTotal - categoryPassed,
        status: categoryPassed === categoryTotal ? '✅ PASSED' : '❌ FAILED',
        tests: category.results.map(r => ({
          name: r.name,
          status: r.passed ? '✅ PASSED' : '❌ FAILED',
          exitCode: r.exitCode,
          error: r.error || r.stderr
        }))
      };
    }),
    summary: {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      passRate: ((passedTests / totalTests) * 100).toFixed(1)
    }
  };
  
  // Save report
  const reportPath = path.join(__dirname, '..', 'reports', 'categorized-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
  
  return reportData;
};

const main = async () => {
  console.log('🚀 TFX AI Calculator - Categorized Test Runner');
  console.log('==============================================');
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  
  const allResults = [];
  
  // Run each test category
  for (const category of testCategories) {
    const result = await runTestCategory(category);
    allResults.push(result);
  }
  
  // Generate comprehensive report
  const report = generateCategorizedReport(allResults);
  
  // Display summary
  console.log('\n🎯 Categorized Test Results Summary');
  console.log('==================================');
  
  report.categories.forEach(cat => {
    console.log(`\n📁 ${cat.name}:`);
    console.log(`   Total: ${cat.total} | Passed: ${cat.passed} | Failed: ${cat.failed}`);
    console.log(`   Status: ${cat.status}`);
    
    cat.tests.forEach(test => {
      const icon = test.status.includes('PASSED') ? '✅' : '❌';
      console.log(`   ${icon} ${test.name}`);
    });
  });
  
  console.log('\n📊 Overall Summary:');
  console.log('==================');
  console.log(`📈 Total Tests: ${report.summary.total}`);
  console.log(`✅ Passed: ${report.summary.passed}`);
  console.log(`❌ Failed: ${report.summary.failed}`);
  console.log(`📊 Pass Rate: ${report.summary.passRate}%`);
  console.log(`⏰ Completed at: ${new Date().toLocaleString()}`);
  
  // Final status
  const allPassed = report.summary.failed === 0;
  
  if (allPassed) {
    console.log('\n🎉 All categorized tests passed! System is fully functional.');
    console.log('🚀 Status: PRODUCTION READY ✅');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the specific categories above.');
    console.log('🔧 Status: NEEDS ATTENTION ⚠️');
  }
  
  console.log(`\n📄 Detailed report saved to: tests/reports/categorized-test-report.json`);
  
  // Exit with appropriate code
  process.exit(allPassed ? 0 : 1);
};

// Handle errors
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

module.exports = { runTestCategory, generateCategorizedReport };
