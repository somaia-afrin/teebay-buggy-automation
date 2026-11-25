import { test, expect } from '@playwright/test';
import users from '../test-data/users.json';
import { LoginPage } from '../pages/LoginPage.js';

test.describe('Login', () => {
  test('logs in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(users.valid.email, users.valid.password);

    await expect(page).toHaveURL(/\/my-products$/);
    await expect(page.getByText('My Products', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Product' })).toBeVisible();
  });
});
