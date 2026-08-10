const fs = require('node:fs');
const path = require('node:path');

const DATA_PATH = path.resolve(__dirname, '..', '..', '..', 'test-data', 'fr-17.json');

function loadFr17Data() {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
}

function getDataset(data, dataId) {
  const dataset = data.datasets.find((item) => item.dataId === dataId);
  if (!dataset) throw new Error(`Missing external FR-17 dataset: ${dataId}`);
  return dataset;
}

function requireRunSuffix() {
  const source = process.env.FR17_RUN_ID || process.env.RUN_ID;
  if (!source) {
    throw new Error('FR17_RUN_ID or RUN_ID is required for deterministic owned coupon codes.');
  }
  const suffix = source.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!suffix) throw new Error('FR17 run ID does not contain a usable deterministic suffix.');
  return suffix;
}

function buildOwnedCoupon(dataset, testCaseId) {
  if (!dataset.codePrefix) {
    throw new Error(`${dataset.dataId} does not define an owned codePrefix.`);
  }
  const testSuffix = testCaseId.replace('FR17-TC-', 'TC');
  return { ...dataset, code: `${dataset.codePrefix}-${testSuffix}-${requireRunSuffix()}` };
}

module.exports = { buildOwnedCoupon, getDataset, loadFr17Data };
