global.test = (description, testFn) => {
  try {
    testFn();
    console.log(`✅ ${description}`);
  } catch (error) {
    console.error(`❌ ${description}: ${error.message}`);
    global.testResults = global.testResults || {};
    global.testResults.failed = (global.testResults.failed || 0) + 1;
  }
};

global.assert = (condition, message = 'Assertion failed') => {
  if (!condition) {
    throw new Error(message);
  }
};

global.testResults = { passed: 0, failed: 0 };

async function runTests() {
  console.log('🚀 Starting pInk test suite...\n');

  try {
    const testFiles = [
      './__tests__/constants.test.js',
      './__tests__/state.test.js',
      './__tests__/api-utils.test.js',
      './__tests__/filters.test.js'
    ];

    for (const testFile of testFiles) {
      console.log(`📄 Running ${testFile}...`);
      await import(testFile);
      console.log('');
    }

  } catch (error) {
    console.error(`❌ Error running tests: ${error.message}`);
    process.exit(1);
  }

  const { passed, failed } = global.testResults;
  console.log('📊 Test Summary:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Total: ${passed + failed}`);

  if (failed > 0) {
    console.log('\n💥 Some tests failed!');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { runTests };
