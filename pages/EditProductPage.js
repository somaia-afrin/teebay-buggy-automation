import { AddProductPage } from './AddProductPage.js';

export class EditProductPage extends AddProductPage {
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'EDIT PRODUCT' });
    this.selectedCategories = this.categoryDropdown.locator('a.ui.label');
    this.currentRentFrequency = this.rentFrequencyDropdown.locator('[role="alert"]');
  }

  async open(productTitle) {
    await this.page.getByText(productTitle, { exact: true }).first().click();
  }

  async updateProduct(product) {
    await this.fillProductDetails(product);
    await this.addProductButton.click();
  }

  async returnToProductList() {
    await this.page.getByText('My Products', { exact: true }).click();
  }
}
