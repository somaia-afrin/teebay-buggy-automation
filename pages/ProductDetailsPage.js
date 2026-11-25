import { expect } from '@playwright/test';

export class ProductDetailsPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'PRODUCT DETAILS' });
    this.buyButton = page.getByRole('button', { name: 'Buy', exact: true });
    this.buyConfirmation = page.getByText('Are you sure you want to buy this product?', { exact: true });
    this.confirmPurchaseButton = page.getByRole('button', { name: 'Yes!', exact: true });
    this.rentButton = page.getByRole('button', { name: 'Rent', exact: true });
    this.startDateInput = page.locator('input[name="start_date"]');
    this.endDateInput = page.locator('input[name="end_date"]');
    this.bookRentButton = page.getByRole('button', { name: 'Book rent', exact: true });
    this.rentHistory = page.getByText(/^Rent history:/);
    this.soldStatus = page.getByText('SOLD', { exact: true });
  }

  async purchase() {
    await this.buyButton.click();
    await expect(this.buyConfirmation).toBeVisible();
    await this.confirmPurchaseButton.click();
  }

  async bookRent(startDate, endDate) {
    await this.rentButton.click();
    await expect(this.startDateInput).toBeVisible();
    await expect(this.endDateInput).toBeVisible();
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
    await this.bookRentButton.click();
  }
}
