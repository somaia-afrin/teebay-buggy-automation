export class LogoutPage {
  constructor(page) {
    this.logoutButton = page.getByText('Logout', { exact: true });
    this.confirmLogoutButton = page.getByRole('button', { name: 'Yes I am sure!', exact: true });
  }

  async logout() {
    await this.logoutButton.click();
    await this.confirmLogoutButton.click();
  }
}
