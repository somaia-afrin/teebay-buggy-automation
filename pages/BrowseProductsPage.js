export class BrowseProductsPage {
  constructor(page) {
    this.page = page;
    this.categoryDropdown = page.locator('[name="category"]');
    this.buyFiltersCheckbox = page.locator('[name="is_buy_filter_turned_on"]');
    this.buyMinInput = page.locator('input[name="min_buy_range"]');
    this.buyMaxInput = page.locator('input[name="max_buy_range"]');
    this.rentFiltersCheckbox = page.locator('[name="is_rent_filter_turned_on"]');
    this.rentMinInput = page.locator('input[name="min_rent_range"]');
    this.rentMaxInput = page.locator('input[name="max_rent_range"]');
    this.rentFrequencyDropdown = page.locator('[name="rent_duration_type"]');
    this.clearButton = page.getByRole('button', { name: 'Clear', exact: true });
    this.filterButton = page.getByRole('button', { name: 'Filter', exact: true });
    this.productCards = page.locator('div.ui.container');
  }

  async open() {
    await this.page.getByText('Browse Products', { exact: true }).click();
  }

  productCard(title) {
    return this.productCards.filter({ hasText: title });
  }

  productViewCount(title) {
    return this.productCard(title).getByText(/^\d+ views$/);
  }

  async openProduct(title) {
    await this.productCard(title).click();
  }

  async selectCategory(category) {
    await this.categoryDropdown.click();
    await this.categoryDropdown.getByRole('option', { name: category, exact: true }).click();
  }

  async enableBuyFilters() {
    if (!(await this.buyFiltersCheckbox.isChecked())) {
      await this.page.getByText('Buy Filters', { exact: false }).click();
    }
  }

  async fillBuyRange(min, max) {
    await this.buyMinInput.fill(String(min));
    await this.buyMaxInput.fill(String(max));
  }

  async enableRentFilters() {
    if (!(await this.rentFiltersCheckbox.isChecked())) {
      await this.page.getByText('Rent Filters', { exact: false }).click();
    }
  }

  async fillRentRange(min, max) {
    await this.rentMinInput.fill(String(min));
    await this.rentMaxInput.fill(String(max));
  }

  async selectRentFrequency(frequency) {
    await this.rentFrequencyDropdown.click();
    await this.rentFrequencyDropdown.getByRole('option', { name: frequency, exact: true }).click();
  }

  async applyFilters() {
    await this.filterButton.click();
  }

  async clearFilters() {
    await this.clearButton.click();
  }
}
