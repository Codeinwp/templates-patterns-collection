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
