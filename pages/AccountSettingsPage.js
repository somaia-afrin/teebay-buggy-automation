export class AccountSettingsPage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.locator('input[name="first_name"]');
    this.lastNameInput = page.locator('input[name="last_name"]');
    this.addressInput = page.locator('input[name="address"]');
    this.emailInput = page.locator('input[name="email"]');
    this.phoneNumberInput = page.locator('input[name="phone_number"]');
    this.updateButton = page.getByRole('button', { name: 'Update', exact: true });
    this.successMessage = page.getByRole('alert').getByText('User updated!', { exact: true });
  }

  async open() {
    await this.page.getByText('Account Settings', { exact: true }).click();
  }

  async updateInformation(account) {
    await this.firstNameInput.fill(account.firstName);
    await this.lastNameInput.fill(account.lastName);
    await this.addressInput.fill(account.address);
    await this.emailInput.fill(account.email);
    await this.phoneNumberInput.fill(account.phoneNumber);
    await this.updateButton.click();
  }
}
