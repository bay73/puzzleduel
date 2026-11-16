// Runs all tests from tests.html (UI tests and checkers tests) in headless browser.
//
// Usage: node tests/run_browser_tests.js
// Browser should be installed before the first run: npx playwright install chromium
const fs = require('fs');
const http = require('http');
const path = require('path');
const {chromium} = require('playwright');

const ROOT_DIR = path.join(__dirname, '..');
const CONTENT_TYPES = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon'};
// Some tests emulate mouse clicks, so the size of the window is fixed.
const VIEWPORT = {width: 1440, height: 900};
const LOAD_TIMEOUT = 60000;
const SUITE_TIMEOUT = 20000;

function countTestFiles(dir) {
  return fs.readdirSync(path.join(__dirname, dir)).filter(file => file.endsWith('.test.js')).length;
}

// Serves files of the project: the page is opened by http as at the real site
// (when it's opened as a local file, the browser doesn't allow to process images of the puzzles).
function startServer() {
  const server = http.createServer((request, response) => {
    const file = path.join(ROOT_DIR, decodeURIComponent(new URL(request.url, 'http://localhost').pathname));
    if (!file.startsWith(ROOT_DIR + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404);
      response.end();
      return;
    }
    response.writeHead(200, {'Content-Type': CONTENT_TYPES[path.extname(file)] || 'application/octet-stream'});
    fs.createReadStream(file).pipe(response);
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

async function main() {
  // Every test file contains one suite.
  const expectedSuites = countTestFiles('ui') + countTestFiles('checkers');
  const server = await startServer();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({viewport: VIEWPORT});
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(String(error)));

    await page.goto('http://127.0.0.1:' + server.address().port + '/tests.html');
    try {
      await page.waitForFunction(
        count => typeof allTestSuites != 'undefined' && allTestSuites.length >= count,
        expectedSuites, {timeout: LOAD_TIMEOUT});
    } catch (error) {
      const loaded = await page.evaluate(() => typeof allTestSuites == 'undefined' ? 0 : allTestSuites.length);
      console.log('Only ' + loaded + ' of ' + expectedSuites + ' test suites are loaded.'
        + ' Check that all test files are listed in tests/all_tests.js.');
      pageErrors.forEach(error => console.log('  ' + error));
      return false;
    }

    // Suites are executed one by one.
    const results = await page.evaluate(async suiteTimeout => {
      const results = [];
      const suites = allTestSuites.slice().sort((suite1, suite2) => suite1.name < suite2.name ? -1 : 1);
      for (const suite of suites) {
        results.push(await new Promise(resolve => {
          const fail = error => resolve({name: suite.name, passed: 0, failed: 1, failures: [{name: 'Suite execution', error: String(error)}]});
          setTimeout(() => fail('Suite is not finished in ' + suiteTimeout + ' ms'), suiteTimeout);
          try {
            suite.exec(true, resolve);
          } catch (error) {
            fail(error);
          }
        }));
      }
      return results;
    }, SUITE_TIMEOUT);

    let passedCount = 0;
    let failedCount = 0;
    results.forEach(result => {
      passedCount += result.passed;
      failedCount += result.failed;
      if (result.failed > 0) {
        console.log(result.name + ': passed ' + result.passed + ', failed ' + result.failed);
        result.failures.forEach(failure => console.log('  ' + failure.name + ' FAILED\n    ' + failure.error));
      }
    });
    if (pageErrors.length > 0) {
      console.log('Errors at the page:');
      pageErrors.forEach(error => console.log('  ' + error));
    }
    console.log('\nSUITES: ' + results.length + ' FAILED: ' + failedCount + ' PASSED: ' + passedCount);
    return failedCount == 0 && passedCount > 0 && pageErrors.length == 0;
  } finally {
    await browser.close();
    server.close();
  }
}

main().then(
  success => { process.exitCode = success ? 0 : 1; },
  error => { console.log(error); process.exitCode = 1; });
