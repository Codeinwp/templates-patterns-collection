# Agent Workflow

## Project Overview

Templates Patterns Collection is a WordPress plugin that powers ThemeIsle's starter sites, page templates, block patterns, and onboarding flows for Neve. It combines PHP import/orchestration code with multiple React-based admin/editor integrations for Gutenberg, Elementor, Beaver Builder, and onboarding.

## Build & Development Commands

### Setup

```bash
composer install
yarn install --frozen-lockfile
```

### Production Build

```bash
# Full build: JS/CSS bundles + RTL files + POT generation
yarn run build
```

`yarn run build` includes `build:makepot`, which requires Docker/WordPress CLI. If Docker is unavailable, build the assets only:

```bash
yarn run build:js
yarn run build:onboarding
yarn run build:editor
yarn run build:elementor
yarn run build:beaver
yarn run rtlcss:app
yarn run rtlcss:onboarding
yarn run rtlcss:editor
yarn run rtlcss:elementor
yarn run rtlcss:beaver
```

### Development

```bash
yarn run dev

# Individual watch targets
yarn run watch:js
yarn run watch:onboarding
yarn run watch:editor
yarn run watch:elementor
yarn run watch:beaver
```

## Linting & Formatting

```bash
# JavaScript
yarn run lint
yarn run lint:onboarding
yarn run format

# PHP
composer run lint
composer run format
composer run phpstan
```

## Testing

```bash
# PHP. Prerequisites: MySQL, the WordPress test suite, and the PHPUnit Polyfills.
# Neither PHPUnit nor the Polyfills are composer deps here: GitHub-hosted runners
# ship PHPUnit preinstalled globally, and setup-php adds the Polyfills
# (tools: phpunit-polyfills); copilot-setup-steps.yml installs both. Tests target the
# CI PHP version (7.4); newer local PHP (8.x) can abort mid-run. Install the suite once:
bash bin/install-wp-tests.sh wordpress_test root root 127.0.0.1
phpunit                       # phpunit is NOT a composer dep here; use the global one (CI/copilot-setup provide it)

# E2E
yarn run ci:e2e
```

`yarn run ci:e2e` reinstalls `e2e-tests` dependencies, starts the wp-env test environment, installs Playwright Chromium, and runs the browser suite.

### E2E suite (Playwright)

Local iteration (needs Docker and Node >= 20; the root repo can stay on an older Node):

```bash
cd e2e-tests
npm install
npm run wp-env start
npm run test:playwright                                # full suite
npm run test:playwright -- specs/onboarding.spec.js    # one spec
```

How the suite works — read this before adding specs:

- **No live ThemeIsle APIs.** All external calls are mocked at two layers:
  - Server-side PHP fetches (sites feed, license check, starter ranking, demo content XML, import attachments) are short-circuited by the test-only mu-plugin `e2e-tests/mu-plugins/tpc-e2e.php` via `pre_http_request`, mounted through `.wp-env.json` and gated by the `TPC_E2E` constant. Fixtures: `e2e-tests/mu-plugins/fixtures/sites.json` (starter-sites feed) and the shared PHPUnit fixtures in `tests/fixtures/`.
  - Browser-side fetches (`ti-demo-data`, Templates Cloud list/import, tracking) are mocked with `page.route` installers from `e2e-tests/config/mocks.js`. Cross-origin mocks must echo the request origin (credentialed CORS) — reuse the helpers there instead of hand-rolling `route.fulfill`.
- **Only wordpress.org traffic is real** (Neve theme + plugin installs during the import test) — that install path is itself under test.
- **Site state is toggled per spec** via the mu-plugin's `tpc-e2e/v1` REST namespace, called with `requestUtils.rest()`:
  - `POST /legacy-tc { enabled }` — the Templates Cloud dashboard (`admin.php?page=tiob-plugin`) and the editor integration only exist in "legacy TC" mode; the onboarding surface behaves differently there. Mutually exclusive states: always reset in `afterAll`/`afterEach`.
  - `POST /api-mode { mode: '' | 'down' | 'invalid' }` — ThemeIsle API failure scenarios (see `specs/error-states.spec.js`). Switching flushes cached license/ranking data.
- **Assertions derive from fixtures or independent literals** — never recompute an expected value the same way the mock computes its response. Site/font counts come from the fixture inputs; hardcoded counts belong to remote data and will rot.
- `workers: 1` is required, not incidental: the state toggles above are site-global options and parallel workers would race on them.

Known gaps (deferred, see `e2e-tests/README.md`): Elementor/Beaver template libraries, the dashboard starter-sites grid (needs the Neve theme installed), the Zelle migration flow, and the editor header "Templates Cloud" button (its portal target `.edit-post-header__center` no longer exists in current WordPress).

### Testing practices (TDD)

When adding or changing tests in this repo, follow these rules:

- **Red before green.** Write one failing test first, then only enough code to pass it. One seam, one test, one minimal implementation per cycle — don't write all tests up front and then all implementation (bulk-written tests verify imagined behavior and go stale).
- **Test at seams (public interfaces), never internals.** Here the seams are: admin pages and the editor canvas (via Playwright locators), the `ti-sites-lib/v1` REST endpoints (via `requestUtils.rest()`), and PHP class public methods (PHPUnit). A good test survives an internal refactor; if it breaks when behavior didn't change, it's coupled to implementation.
- **Prefer role/text locators** (`getByRole`, `getByText`) over CSS classes; use classes only where the UI offers no accessible handle (existing `.ss-card-wrap`-style locators are the ceiling, not the target).
- **No tautological assertions.** The expected value must come from an independent source (a literal, the fixture *input*, the spec) — never recomputed the same way the code or mock computes it. Example in this repo: `starter_order` asserts literal slugs, not `Object.keys(fixture)`.
- **Mock only at system boundaries** — external HTTP (ThemeIsle APIs), never the plugin's own classes/modules or internal collaborators. Don't assert on call counts or internal wiring; assert observable behavior (content in the canvas, a page created, an option's effect in the UI).
- **One logical assertion per test**, name tests as WHAT-statements ("importing a template inserts its blocks into the post"), not HOW.

## Architecture

### Bootstrap & Runtime

- `templates-patterns-collection.php`: plugin bootstrap, constants, Composer autoload, activation/onboarding hooks.
- `includes/Main.php`: main runtime coordinator and singleton entry point.
- `includes/Rest_Server.php`: plugin REST API routes.
- `includes/Admin.php`: wp-admin screens, onboarding triggers, AJAX endpoints, notices, logs.

The plugin uses the `TIOB\*` namespace from `includes/`.

### Import / Template Domain

- `includes/Importers/`: core import pipeline for content, plugins, widgets, theme mods, cleanup, and WordPress WXR parsing.
- `includes/Importers/WP/`: customized WordPress importer internals and builder-specific meta handlers.
- `includes/Importers/Helpers/`: import support utilities and mapping logic.
- `migration/`: migration code for legacy site/template data.

### Editor & Builder Integrations

- `includes/Editor.php`: Gutenberg/editor registration and editor-side bootstrapping.
- `includes/Elementor.php`: Elementor editor integration.
- `includes/TI_Beaver.php`: Beaver Builder integration and AJAX handlers.
- `editor/`: Gutenberg/site editor React app.
- `elementor/`: Elementor React app/assets.
- `beaver/`: Beaver Builder React app/assets.

### UI Apps

- `assets/`: main templates library/admin app.
- `onboarding/`: first-run onboarding React app.
- `shared/`: shared JS helpers consumed across apps.

Each app follows a `src/` -> `build/` pipeline powered by `@wordpress/scripts`, with separate RTL generation.

## Folder/Subfolder Search Map

| Path | What lives here | Start here when... |
|---|---|---|
| `templates-patterns-collection.php` | Bootstrap, constants, plugin startup, activation hooks | You need to trace plugin boot order |
| `includes/Main.php` | Main singleton wiring for runtime services | You are following how features are registered |
| `includes/Admin.php` | Admin UI wiring, notices, AJAX handlers, onboarding gates | A wp-admin flow or notice is broken |
| `includes/Rest_Server.php` | REST routes used by imports and UI apps | A React flow fails on API calls |
| `includes/Editor.php` | Gutenberg/block editor integration | Site editor or block editor behavior needs changes |
| `includes/Elementor.php` | Elementor integration hooks | The issue only appears in Elementor |
| `includes/TI_Beaver.php` | Beaver Builder integration and AJAX actions | The issue only appears in Beaver Builder |
| `includes/Importers/` | Import pipeline for templates, content, plugins, widgets, cleanup | Imported content or starter-site setup is wrong |
| `includes/Importers/WP/` | WXR importer internals and builder-specific content parsing | You are debugging low-level import parsing |
| `assets/src/` | Main templates library React app source | The primary template browser/import UI needs changes |
| `assets/build/` | Compiled main app assets | You are verifying generated output |
| `onboarding/src/` | Onboarding UI source | First-run user journey needs changes |
| `editor/src/` | Gutenberg/site editor app source | Editor insertion/import UX needs changes |
| `elementor/src/` | Elementor app source | Elementor-side template UI needs changes |
| `beaver/src/` | Beaver Builder app source | Beaver-side template UI needs changes |
| `shared/` | Shared utilities/modules used by multiple apps | Logic is duplicated across apps or shared state is involved |
| `migration/` | Legacy migration scripts | You are handling upgrades or data carry-forward |
| `languages/` | Translation assets and generated POT file | Work touches strings or i18n packaging |
| `tests/` | PHPUnit tests, fixtures, PHP test support | You are adding or updating automated coverage |
| `e2e-tests/` | Browser tests and wp-env config | You need end-to-end verification |
| `bin/` | Distribution/build helpers | You are adjusting packaging/release behavior |

## Notes & Gotchas

- `yarn run build` is not purely a frontend build; it also tries to generate translations through Docker.
- Asset builds generate paired RTL files explicitly through `rtlcss:*` scripts.
- REST and AJAX are both used in this plugin, so editor/import bugs may cross PHP and React boundaries.
- Builder-specific behavior is split between PHP integration classes in `includes/` and separate app folders (`editor/`, `elementor/`, `beaver/`, `onboarding/`, `assets/`).
