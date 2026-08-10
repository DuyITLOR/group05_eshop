const { expect } = require('@playwright/test');
const { getAdminBaseUrl, requireEnvironment } = require('./runtime-guard');

async function loginForRole(request, { emailEnv, passwordEnv, expectedRole, roleMatcher }) {
  const response = await request.post(`${requireEnvironment('SUT_API_BASE_URL')}/api/login`, {
    data: { email: requireEnvironment(emailEnv), password: requireEnvironment(passwordEnv) },
  });
  if (!response.ok()) throw new Error(`FR-17 ${expectedRole} login failed with HTTP ${response.status()}.`);
  const body = await response.json();
  if (!body.token || !body.user?.role) throw new Error('FR-17 login response did not include a token and user role.');
  if (!roleMatcher(body.user.role)) throw new Error(`FR-17 identity verification failed: expected ${expectedRole}, received ${body.user.role}.`);
  return body;
}

async function installAdminSession(page, request) {
  const session = await loginForRole(request, {
    emailEnv: 'FR17_TEST_ADMIN_EMAIL',
    passwordEnv: 'FR17_TEST_ADMIN_PASSWORD',
    expectedRole: 'admin',
    roleMatcher: (role) => role === 'admin',
  });
  await page.addInitScript((token) => window.localStorage.setItem('adminToken', token), session.token);
  return session.user;
}

async function installNonAdminSession(page, request) {
  const session = await loginForRole(request, {
    emailEnv: 'FR17_TEST_USER_EMAIL',
    passwordEnv: 'FR17_TEST_USER_PASSWORD',
    expectedRole: 'non-admin',
    roleMatcher: (role) => role !== 'admin',
  });
  await page.addInitScript((token) => window.localStorage.setItem('adminToken', token), session.token);
  return session.user;
}

async function openAdmin(page) {
  await page.goto(getAdminBaseUrl());
  await expect(page.getByRole('heading', { name: 'EShop Admin', exact: true })).toBeVisible();
}

module.exports = { installAdminSession, installNonAdminSession, openAdmin };
