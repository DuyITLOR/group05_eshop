const { defineConfig } = require('@playwright/test');

const featureId = process.env.FEATURE_ID || 'FR-05';
const featureSlug = featureId.toLowerCase();
const studentId = process.env.STUDENT_ID;
const sutBaseUrl = process.env.SUT_BASE_URL;
const browserProject = process.env.BROWSER_PROJECT || 'multi-project';

if (!studentId) {
  throw new Error('STUDENT_ID is required before Playwright execution.');
}

if (!sutBaseUrl) {
  throw new Error('SUT_BASE_URL is required before Playwright execution.');
}

const isoTimestamp = process.env.RUN_TIMESTAMP || new Date().toISOString();
const runId =
  process.env.RUN_ID ||
  `${featureId}-${isoTimestamp.replace(/[:.]/g, '-')}`;
const htmlOutputFolder =
  process.env.HTML_REPORT_DIR || `html-reports/${featureSlug}/${runId}`;
const testResultsDir =
  process.env.TEST_RESULTS_DIR || `test-results/${featureSlug}/${runId}`;
const htmlReportTitle =
  `${featureId} | Run by: ${studentId} | ${isoTimestamp} | ${runId} | Browser: ${browserProject}`;

module.exports = defineConfig({
  testDir: './tests',
  outputDir: testResultsDir,
  fullyParallel: true,
  workers: featureId === 'FR-09' || featureId === 'FR-17' ? 1 : undefined,
  retries: 0,
  use: {
    baseURL: sutBaseUrl,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off',
  },
  metadata: {
    'Run by': studentId,
    'ISO timestamp': isoTimestamp,
    'Feature ID': featureId,
    'Run ID': runId,
    'Browser project': browserProject,
  },
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: htmlOutputFolder,
        open: 'never',
        title: htmlReportTitle,
      },
    ],
  ],
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],
});
