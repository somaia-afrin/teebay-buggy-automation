export class AddProductPage {
  constructor(page) {
    this.page = page;
    this.titleInput = page.locator('input[name="title"]');
    this.categoryDropdown = page.locator('[name="categories"]');
    this.descriptionInput = page.locator('textarea[name="description"]');
    this.purchasePriceInput = page.locator('input[name="purchase_price"]');
    this.rentPriceInput = page.locator('input[name="rent_price"]');
    this.rentFrequencyDropdown = page.locator('[name="rent_duration_type"]');
    this.addProductButton = page.getByRole('button', { name: 'Add Product', exact: true });
  }

  async open() {
    await this.addProductButton.click();
  }

  async fillProductDetails(product) {
    await this.titleInput.fill(product.title);
    const selectedCategories = this.categoryDropdown.locator('a.ui.label');
    while (await selectedCategories.count()) {
      await selectedCategories.first().locator('i.delete.icon').click();
    }
    await this.categoryDropdown.click();
    await this.categoryDropdown.getByRole('option', { name: product.category, exact: true }).click();
    await this.descriptionInput.fill(product.description);
    await this.purchasePriceInput.fill(product.purchasePrice);
    await this.rentPriceInput.fill(product.rentPrice);
    await this.rentFrequencyDropdown.click();
    await this.rentFrequencyDropdown.getByRole('option', { name: product.rentFrequency, exact: true }).click();
  }

  async createProduct(product) {
    await this.fillProductDetails(product);
    await this.addProductButton.click();
  }
}
