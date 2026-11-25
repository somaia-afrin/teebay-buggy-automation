import { test, expect } from '@playwright/test';
import users from '../test-data/users.json';
import { LoginPage } from '../pages/LoginPage.js';
import { AccountSettingsPage } from '../pages/AccountSettingsPage.js';

test('Verify Successful Account Information Update', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const accountSettingsPage = new AccountSettingsPage(page);

  await test.step('Log in and open Account Settings', async () => {
    await loginPage.open();
    await loginPage.login(users.valid.email, users.valid.password);
    await accountSettingsPage.open();
  });

  await test.step('Update account information', async () => {
    await accountSettingsPage.updateInformation(users.accountUpdate);
  });

  await test.step('Verify successful update', async () => {
    await expect(accountSettingsPage.successMessage).toBeVisible();
  });
});
