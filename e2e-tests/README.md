### How to run Playwright E2E tests locally

-   First, ensure you have Node.js installed on your system.

-   Install dependencies by running in this folder:

    ```bash
    npm install
    ```

-   Start the WordPress test environment:

    ```bash
    npm run wp-env start
    ```

-   To run the tests, you have several options:

    -   Run all tests: `npm run test:playwright`
    -   Run tests in debug mode: `npm run test:playwright:debug`
    -   Run tests with UI mode: `npm run test:playwright:ui`

-   For additional test options, you can run:
    ```bash
    npm run test:playwright:help
    ```
