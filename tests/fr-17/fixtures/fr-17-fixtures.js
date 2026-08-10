const { test: base, expect } = require('@playwright/test');
const { installAdminSession } = require('../helpers/auth');
const { createIsolatedDbFixture } = require('../helpers/db-fixture');

const test = base.extend({
  adminSession: async ({ page, request }, use) => {
    const user = await installAdminSession(page, request);
    await use({ page, user });
  },
  isolatedDb: async ({}, use) => {
    await use(createIsolatedDbFixture());
  },
});

module.exports = { expect, test };
