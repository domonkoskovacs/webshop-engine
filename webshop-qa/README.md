# Quality assurance

This module contains all test automation for the Webshop project. It includes:
- UI tests using **Selenide + JUnit 5**
- Performance/load testing with **Gatling**
- Reporting via **Allure**

> Both the frontend and backend must be running before executing tests.

---

## Test Types

### UI Tests
- Built with Selenide and JUnit 5
- Page Object Model structure under `ui.page`
- Failed screenshots saved to `target/screenshots/`

### Performance Tests (Gatling)
- Gatling test classes in `performance.simulation`
- Modular architecture with packages:
  - `endpoint` – request definitions
  - `injection` – user injection profiles
  - `scenario` – scenario chains
  - `assertion` – custom assertions

### Reporting
- **Allure**: Generates test reports from JUnit results (output in `target/allure-results/`)
- **Gatling**: HTML reports are generated to `target/gatling`

---

## Running Tests

Make sure Docker and both frontend/backend services are up and running.

Then run:

```bash
mvn clean verify
```

This will:
- Run all JUnit UI tests
- Generate screenshots on failure
- Run all Gatling simulations
- Generate Allure and Gatling reports

---

## Project Structure

```
src/test/java/hu/webshop/engine/webshopqa/
├── configuration/       # Global test config
├── performance/
│   ├── assertion/       # Custom assertions
│   ├── endpoint/        # Request definitions
│   ├── injection/       # Load profiles
│   ├── scenario/        # Reusable scenario steps
│   └── simulation/      # Gatling simulations (entry points)
└── ui/
    ├── base/            # Base test classes
    ├── page/            # Page Object Model (selectors, actions)
    └── test/            # UI test cases
```

---

## Output

After test execution, the following will be available in `/target`:

- `screenshots/`       | Screenshots of failed Selenide tests 
- `gatling/`           | Performance test reports              
- `allure-results/`    | Allure report data                    

To open the Allure report:

```bash
allure serve target/allure-results
```

---

## Requirements

- Java 23+
- Maven 3.9+
- Docker (for backend/frontend containers)
- Web browser (for Selenide UI tests)

---

## Notes

- The test suite is automatically triggered in the `verify` phase.
- Selenide uses a real browser.
- Gatling is configured via `gatling-maven-plugin`, and uses `highcharts` reports.

## Configuration Options

The QA module supports flexible configuration via a properties file and system property overrides.

### `test-config.properties` (in `src/test/resources/`)

This file defines environment-dependent test URLs and UI test credentials.

### Overriding with system properties

All values can be overridden via `-D` flags when running tests:

```bash
mvn test -Dui.user.email=my@email.com -Dperformance.testType=capacity
```

System properties take precedence over the values in the `test-config.properties` file.