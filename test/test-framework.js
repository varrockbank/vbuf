// Simple test framework
class TestRunner {
  constructor() {
    this.suites = [];
    this.currentSuite = null;
  }

  describe(name, fn) {
    const suite = { name, tests: [], beforeEach: null, afterEach: null };
    this.suites.push(suite);
    this.currentSuite = suite;
    fn();
    this.currentSuite = null;
  }

  it(name, fn, description = '') {
    if (!this.currentSuite) throw new Error('it() must be called inside describe()');
    this.currentSuite.tests.push({ name, fn, description, status: 'pending' });
  }

  xit(name, fn, description = '') {
    if (!this.currentSuite) throw new Error('xit() must be called inside describe()');
    this.currentSuite.tests.push({ name, fn, description, status: 'skipped' });
  }

  beforeEach(fn) {
    if (!this.currentSuite) throw new Error('beforeEach() must be called inside describe()');
    this.currentSuite.beforeEach = fn;
  }

  async run() {
    const results = { total: 0, passed: 0, failed: 0, skipped: 0 };

    for (const suite of this.suites) {
      const suiteResults = [];

      for (const test of suite.tests) {
        results.total++;

        if (test.status === 'skipped') {
          results.skipped++;
          suiteResults.push(test);
          continue;
        }

        try {
          if (suite.beforeEach) suite.beforeEach();
          await test.fn();

          test.status = 'pass';
          results.passed++;
        } catch (error) {
          test.status = 'fail';
          test.error = error;
          results.failed++;
        }

        suiteResults.push(test);
      }

      suite.results = suiteResults;
    }

    return results;
  }
}

// Assertion helpers
function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`);
      }
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`);
      }
    },
    toHaveLength(expected) {
      if (actual.length !== expected) {
        throw new Error(`Expected length: ${expected}\nActual length: ${actual.length}\nActual value: ${JSON.stringify(actual)}`);
      }
    }
  };
}
