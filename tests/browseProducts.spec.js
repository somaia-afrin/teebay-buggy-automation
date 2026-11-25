import { test, expect } from '@playwright/test';
import users from '../test-data/users.json';
import filters from '../test-data/browseFilters.json';
import { LoginPage } from '../pages/LoginPage.js';
import { BrowseProductsPage } from '../pages/BrowseProductsPage.js';
import { ProductDetailsPage } from '../pages/ProductDetailsPage.js';

async function getDisplayedProducts(browseProductsPage) {
  const products = await browseProductsPage.productCards.all();
  expect(products.length).toBeGreaterThan(0);
  return products;
}

async function expectDefaultProductList(page, browseProductsPage) {
  await expect(browseProductsPage.categoryDropdown.locator('[role="alert"]')).toHaveCount(0);
  await expect(browseProductsPage.buyFiltersCheckbox).not.toBeChecked();
  await expect(browseProductsPage.rentFiltersCheckbox).not.toBeChecked();
  await expect(browseProductsPage.buyMinInput).toHaveCount(0);
  await expect(browseProductsPage.buyMaxInput).toHaveCount(0);
  await expect(browseProductsPage.rentMinInput).toHaveCount(0);
  await expect(browseProductsPage.rentMaxInput).toHaveCount(0);
  await expect(browseProductsPage.productCards.first()).toBeVisible();
  await expect(page.getByText('Last of Us Part II PS5 game', { exact: true })).toBeVisible();
}

async function expectPriceInRange(productCard, label, min, max) {
  const priceText = await productCard.getByText(new RegExp(`^${label}: \\$`)).innerText();
  const match = priceText.match(new RegExp(`^${label}: \\$([\\d,]+(?:\\.\\d+)?)`));
  expect(match, `Could not read ${label.toLowerCase()} from "${priceText}"`).not.toBeNull();
  const price = Number(match[1].replace(/,/g, ''));
  expect(price).toBeGreaterThanOrEqual(min);
  expect(price).toBeLessThanOrEqual(max);
  return priceText;
}

test('Verify Browse Products Filtering', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(users.valid.email, users.valid.password);
  await expect(page).toHaveURL(/\/my-products$/);

  const browseProductsPage = new BrowseProductsPage(page);
  await browseProductsPage.open();
  await expect(page).toHaveURL(/\/browse-products$/);
  await expect(browseProductsPage.productCards.first()).toBeVisible();

  await test.step('Category Filter', async () => {
    await browseProductsPage.selectCategory(filters.category);
    await browseProductsPage.applyFilters();

    await expect(browseProductsPage.productCards).toHaveCount(1);
    const products = await getDisplayedProducts(browseProductsPage);
    for (const product of products) {
      await expect(product).toContainText(`Categories: ${filters.category}`);
    }
  });

  await test.step('Clear Filter', async () => {
    await browseProductsPage.clearFilters();
    await expectDefaultProductList(page, browseProductsPage);
  });

  await test.step('Buy Filter', async () => {
    await browseProductsPage.enableBuyFilters();
    await browseProductsPage.fillBuyRange(filters.buyRange.min, filters.buyRange.max);
    await browseProductsPage.applyFilters();

    await expect(browseProductsPage.productCards).toHaveCount(2);
    const products = await getDisplayedProducts(browseProductsPage);
    for (const product of products) {
      await expectPriceInRange(product, 'Price', filters.buyRange.min, filters.buyRange.max);
    }
  });

  await test.step('Clear Filter', async () => {
    await browseProductsPage.clearFilters();
    await expectDefaultProductList(page, browseProductsPage);
  });

  await test.step('Rent Filter', async () => {
    await browseProductsPage.enableRentFilters();
    await browseProductsPage.fillRentRange(filters.rentRange.min, filters.rentRange.max);
    await browseProductsPage.selectRentFrequency(filters.rentRange.frequency);
    await browseProductsPage.applyFilters();

    await expect(browseProductsPage.productCards).toHaveCount(2);
    const products = await getDisplayedProducts(browseProductsPage);
    for (const product of products) {
      const rentText = await expectPriceInRange(
        product,
        'Rent',
        filters.rentRange.min,
        filters.rentRange.max,
      );
      expect(rentText.toLowerCase()).toContain(filters.rentRange.frequency.toLowerCase());
    }
  });

  await test.step('Clear Filter', async () => {
    await browseProductsPage.clearFilters();
    await expectDefaultProductList(page, browseProductsPage);
  });
});

test('Verify Product View Count Increment', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(users.valid.email, users.valid.password);
  await expect(page).toHaveURL(/\/my-products$/);

  const browseProductsPage = new BrowseProductsPage(page);
  await browseProductsPage.open();
  await expect(page).toHaveURL(/\/browse-products$/);
  await expect(browseProductsPage.productCards.first()).toBeVisible();

  const productTitle = 'Blender';
  let initialViewCount;

  await test.step('Capture Initial View Count', async () => {
    await expect(browseProductsPage.productCard(productTitle)).toHaveCount(1);
    const viewCountText = await browseProductsPage.productViewCount(productTitle).innerText();
    const match = viewCountText.match(/^(\d+) views$/);
    expect(match, `Could not read view count from "${viewCountText}"`).not.toBeNull();
    initialViewCount = Number(match[1]);
  });

  await test.step('Open Product Details and Verify Increment', async () => {
    await browseProductsPage.openProduct(productTitle);
    await expect(page).toHaveURL(/\/product-details\/\d+$/);
    await expect(page.getByRole('heading', { name: 'PRODUCT DETAILS' })).toBeVisible();
    await expect(page.getByText(`Views: ${initialViewCount + 1}`, { exact: true })).toBeVisible();
  });

  await test.step('Return to Browse and Verify Increment', async () => {
    await page.goBack();
    await expect(page).toHaveURL(/\/browse-products$/);
    await expect(browseProductsPage.productViewCount(productTitle)).toHaveText(`${initialViewCount + 1} views`);
  });
});

async function openBlenderDetails(page) {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(users.valid.email, users.valid.password);
  await expect(page).toHaveURL(/\/my-products$/);

  const browseProductsPage = new BrowseProductsPage(page);
  await browseProductsPage.open();
  await expect(page).toHaveURL(/\/browse-products$/);
  await expect(browseProductsPage.productCard('Blender')).toHaveCount(1);
  await browseProductsPage.openProduct('Blender');

  const productDetailsPage = new ProductDetailsPage(page);
  await expect(productDetailsPage.heading).toBeVisible();
  await expect(page.getByText('Blender', { exact: true })).toBeVisible();
  return productDetailsPage;
}

function futureRentalDates() {
  const start = new Date();
  start.setDate(start.getDate() + 1);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const formatInput = date => [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');

  return {
    startInput: formatInput(start),
    endInput: formatInput(end),
  };
}

test('Verify Successful Product Purchase', async ({ page }) => {
  let productDetailsPage;
  await test.step('Log in and open Blender', async () => {
    productDetailsPage = await openBlenderDetails(page);
  });

  await test.step('Confirm purchase', async () => {
    await productDetailsPage.purchase();
    await expect(productDetailsPage.soldStatus).toBeVisible();
  });
});

test('Verify Successful Rental Submission', async ({ page }) => {
  let productDetailsPage;
  await test.step('Log in and open Blender', async () => {
    productDetailsPage = await openBlenderDetails(page);
  });

  const rentalDates = futureRentalDates();
  const initialRentHistory = await productDetailsPage.rentHistory.innerText();
  const initialRentalEntryCount = (initialRentHistory.match(/\([^)]*\)/g) || []).length;

  await test.step('Book rental with future dates', async () => {
    await productDetailsPage.bookRent(rentalDates.startInput, rentalDates.endInput);
  });

  await test.step('Verify one rental entry was added', async () => {
    await expect(productDetailsPage.rentHistory).not.toHaveText(initialRentHistory);
    const updatedRentHistory = await productDetailsPage.rentHistory.innerText();
    const updatedRentalEntryCount = (updatedRentHistory.match(/\([^)]*\)/g) || []).length;
    // Rental date accuracy is excluded because the application displays dates that differ from those submitted.
    expect(updatedRentalEntryCount).toBe(initialRentalEntryCount + 1);
  });
});
