# Teebay-Buggy Test Automation

## 1. Project Overview

This project focuses on automating positive functional testing scenarios of the Teebay-Buggy application using Playwright and JavaScript. The framework follows the Page Object Model (POM) design pattern to ensure code reusability, readability, and maintainability.

**Application URL:** [Teebay-Buggy](https://ehsanur-rahman-sazim.github.io/teebay-buggy/)

## 2. Tools and Technologies

| Tool / Technology       | Purpose                          |
|-------------------------|----------------------------------|
| Playwright              | Web UI test automation           |
| JavaScript              | Programming language             |
| Node.js                 | Runtime environment              |
| Page Object Model (POM) | Design pattern                   |
| JSON                    | Test data management             |
| Allure Report           | Test execution reporting         |
| Playwright HTML Report  | Built-in test reporting          |
| Git & GitHub            | Version control and code hosting |
| Visual Studio Code      | Code editor                      |

## 3. Test Coverage

| Test ID | Module           | Test Scenario                                |
|---------|------------------|----------------------------------------------|
| TC-01   | Login            | Verify successful login                      |
| TC-02   | My Products      | Verify product CRUD operations               |
| TC-03   | Browse Products  | Verify product filtering                     |
| TC-04   | Browse Products  | Verify product view count increment          |
| TC-05   | Buy Product      | Verify successful product purchase           |
| TC-06   | Rent Product     | Verify successful rental submission          |
| TC-07   | Account Settings | Verify successful account information update |
| TC-08   | Logout           | Verify successful logout                     |

## 4. Prerequisites

Ensure the following tools are installed:

- Node.js and npm
- Git
- Java (required for Java-based Allure CLI)

## 5. Installation and Setup

### Step 1: Clone the repository

```bash
git clone <repository-url>
```

### Step 2: Navigate to the project directory

```bash
cd <repository-name>
```

### Step 3: Install project dependencies

```bash
npm ci
```

### Step 4: Install Playwright Chromium browser

```bash
npx playwright install chromium
```

## 6. Clean Previous Test Results

Before starting a fresh test execution, remove previous reports and results to avoid mixing results from multiple executions.

**Windows PowerShell:**

```powershell
Remove-Item -Recurse -Force allure-results, allure-report, playwright-report, test-results -ErrorAction SilentlyContinue
```

**Windows Command Prompt (CMD):**

```cmd
for %d in (allure-results allure-report playwright-report test-results) do @if exist "%d" rmdir /s /q "%d"
```

## 7. Run Automation Tests

### Run all tests in headed mode

```bash
npx playwright test --project=chromium --headed --workers=1
```

### Run all tests in headless mode

```bash
npx playwright test --project=chromium --workers=1
```

Tests are executed sequentially using a single worker.

## 8. Test Reports

### Playwright HTML Report

Open the Playwright HTML report after test execution:

```bash
npx playwright show-report
```

Press `Ctrl+C` in the terminal to stop the report server.

### Allure Report

Generate the Allure report:

```bash
npx allure generate allure-results --clean -o allure-report
```

Open the generated Allure report:

```bash
npx allure open allure-report
```

## 9. Known Issues and Blockers

- **Registration:** User registration fails even with valid information.
- **Bought/Sold/Borrowed/Lent List:** The page is not functional.

These scenarios were excluded from automation due to application blockers. Identified defects are documented separately in the bug report.

## 10. Application Behavior

The application uses a simulated backend. Data changes persist only during the active login session and reset after logout and subsequent login.

Therefore, product CRUD operations are performed within the same login session.
