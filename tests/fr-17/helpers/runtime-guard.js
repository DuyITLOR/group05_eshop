const fs = require('node:fs');
const path = require('node:path');

const WORKSPACE_DB_PATH = path.resolve(__dirname, '..', '..', '..', 'backend', 'database.sqlite');

function requireEnvironment(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required for FR-17 automation.`);
  return value;
}

function resolveIsolatedDbPath() {
  if (process.env.FR17_ISOLATED_DB !== 'true') {
    throw new Error('FR17_ISOLATED_DB=true is required before any FR-17 stateful operation.');
  }
  const isolatedPath = path.resolve(requireEnvironment('FR17_TEST_DB_PATH'));
  if (isolatedPath.toLowerCase() === WORKSPACE_DB_PATH.toLowerCase()) {
    throw new Error('AUTOMATION_SETUP_OR_CLEANUP_RISK: FR17_TEST_DB_PATH must not target workspace backend/database.sqlite.');
  }
  if (!fs.existsSync(isolatedPath)) {
    throw new Error(`AUTOMATION_SETUP_OR_CLEANUP_RISK: isolated FR-17 database does not exist: ${isolatedPath}`);
  }
  return isolatedPath;
}

function getAdminBaseUrl() {
  return requireEnvironment('FR17_ADMIN_BASE_URL');
}

module.exports = { WORKSPACE_DB_PATH, getAdminBaseUrl, requireEnvironment, resolveIsolatedDbPath };
