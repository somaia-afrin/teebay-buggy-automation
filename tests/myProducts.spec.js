import { test, expect } from '@playwright/test';
import users from '../test-data/users.json';
import products from '../test-data/products.json';
import { LoginPage } from '../pages/LoginPage.js';
import { AddProductPage } from '../pages/AddProductPage.js';
import { EditProductPage } from '../pages/EditProductPage.js';
import { DeleteProductPage } from '../pages/DeleteProductPage.js';

async function expectProductInList(page, product) {
  const productCard = page.getByText(product.title, { exact: true }).first().locator('xpath=../../..');
  await expect(productCard).toBeVisible();
  await expect(productCard).toContainText(`Categories: ${product.category}`);
  await expect(productCard).toContainText(`Description: ${product.description}`);
  await expect(productCard).toContainText(`Price: $${product.purchasePrice}`);
  await expect(productCard).toContainText(`Rent: $${product.rentPrice} ${product.rentFrequency.toLowerCase()}`);
}

test('Verify My Products CRUD Workflow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(users.valid.email, users.valid.password);

  await expect(page).toHaveURL(/\/my-products$/);
  await expect(page.getByText('My Products', { exact: true })).toBeVisible();

  const addProductPage = new AddProductPage(page);
  await test.step('Create Product', async () => {
    await addProductPage.open();
    await expect(page.getByRole('heading', { name: 'ADD PRODUCT' })).toBeVisible();
    await addProductPage.createProduct(products.valid);

    await expect(page).toHaveURL(/\/my-products$/);
    await expectProductInList(page, products.valid);
  });

  const editProductPage = new EditProductPage(page);
  await test.step('Update Product', async () => {
    await editProductPage.open(products.valid.title);
    await expect(page).toHaveURL(/\/edit-product\/\d+$/);
    await expect(editProductPage.heading).toBeVisible();
    await expect(editProductPage.titleInput).toHaveValue(products.valid.title);
    await expect(editProductPage.selectedCategories).toContainText(products.valid.category);
    await expect(editProductPage.descriptionInput).toHaveValue(products.valid.description);
    await expect(editProductPage.purchasePriceInput).toHaveValue(products.valid.purchasePrice);
    await expect(editProductPage.rentPriceInput).toHaveValue(products.valid.rentPrice);
    await expect(editProductPage.currentRentFrequency).toHaveText(products.valid.rentFrequency);

    await editProductPage.updateProduct(products.updated);
    await editProductPage.returnToProductList();
    await expect(page).toHaveURL(/\/my-products$/);
    await expectProductInList(page, products.updated);
  });

  const deleteProductPage = new DeleteProductPage(page);
  await test.step('Delete Product', async () => {
    await deleteProductPage.deleteProduct(products.updated.title);
  });

  await test.step('Verify Product Deletion', async () => {
    await deleteProductPage.expectProductRemoved(products.updated.title);
  });
});
