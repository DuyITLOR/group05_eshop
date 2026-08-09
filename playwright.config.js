const { defineConfig } = require('@playwright/test');

const featureId = 'FR-05';
const studentId = process.env.STUDENT_ID;
const sutBaseUrl = process.env.SUT_BASE_URL;

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
  process.env.HTML_REPORT_DIR || `html-reports/fr-05/${runId}`;
const htmlReportTitle =
  `${featureId} | Run by: ${studentId} | ${isoTimestamp} | ${runId}`;

module.exports = defineConfig({
  testDir: './tests',
  outputDir: 'test-results/fr-05',
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: sutBaseUrl,
  },
  metadata: {
    'Run by': studentId,
    'ISO timestamp': isoTimestamp,
    'Feature ID': featureId,
    'Run ID': runId,
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
