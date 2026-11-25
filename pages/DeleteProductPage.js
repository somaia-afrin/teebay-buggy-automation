import { expect } from '@playwright/test';

export class DeleteProductPage {
  constructor(page) {
    this.page = page;
    this.deleteConfirmation = page.getByText('Are you sure you want to delete this product?', { exact: true });
    this.confirmDeleteButton = page.getByRole('button', { name: 'Yes, delete', exact: true });
  }

  productCard(title) {
    return this.page.getByText(title, { exact: true }).first().locator('xpath=../../..');
  }

  async deleteProduct(title) {
    await this.productCard(title).getByRole('button').click();
    await expect(this.deleteConfirmation).toBeVisible();
    await this.confirmDeleteButton.click();
  }

  async expectProductRemoved(title) {
    await expect(this.page.getByText(title, { exact: true })).toHaveCount(0);
  }
}
