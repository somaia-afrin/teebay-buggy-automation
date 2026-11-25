import { test, expect } from '@playwright/test';
import users from '../test-data/users.json';
import { LoginPage } from '../pages/LoginPage.js';
import { LogoutPage } from '../pages/LogoutPage.js';

test('Verify Successful Logout', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const logoutPage = new LogoutPage(page);

  await test.step('Log in with valid credentials', async () => {
    await loginPage.open();
    await loginPage.login(users.valid.email, users.valid.password);
  });

  await test.step('Log out', async () => {
    await logoutPage.logout();
  });

  await test.step('Verify Login page is displayed', async () => {
    await expect(page).toHaveURL(/\/signin$/);
    await expect(loginPage.signInButton).toBeVisible();
  });
});
