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

### Mocking

The suite runs offline and deterministic — no live ThemeIsle APIs are hit. Two layers:

-   **Server-side (PHP)**: the `mu-plugins/tpc-e2e.php` mu-plugin (mounted via `.wp-env.json`, gated by the `TPC_E2E` constant) short-circuits `pre_http_request` for:
    -   the starter-sites feed (`api.themeisle.com/sites/...`) → `mu-plugins/fixtures/sites.json`
    -   the Templates Cloud license check → always a valid license
    -   the starter-ranking AI workflow → fixed order, no polling
    -   the demo content XML → `../tests/fixtures/export.xml` (shared with PHPUnit)
    -   demo attachment downloads → a 1×1 GIF
-   **Browser-side (Playwright)**: `config/mocks.js` provides `page.route` installers for the cross-origin `ti-demo-data` fetch, the Templates Cloud templates list, and tracking calls.

The mu-plugin also exposes a `tpc-e2e/v1/legacy-tc` REST route: the Templates Cloud dashboard (`admin.php?page=tiob-plugin`) and the block-editor integration only load for "legacy TC" installs (`tiob_tc_removed` option), while the onboarding surface behaves differently in that mode — specs toggle it per suite.

Only the wordpress.org plugin/theme installs triggered by the import flow (Neve theme, caching plugin, the fixture's mandatory plugin) still use the network, as the install path is itself under test.

Not covered yet (deferred): the Elementor and Beaver Builder template libraries (need those plugins in wp-env), the starter-sites grid on the dashboard page (hidden unless the Neve theme is installed; the same grid is covered on the onboarding page), the Zelle migration flow, and the editor's header "Templates Cloud" button (its portal target `.edit-post-header__center` no longer exists in current WordPress).
