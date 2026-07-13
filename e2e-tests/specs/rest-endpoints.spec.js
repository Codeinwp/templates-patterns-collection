/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies
 */
import baseDemoData from '../../tests/fixtures/data.json';

const API = '/ti-sites-lib/v1';
const SOURCE_URL = 'https://demo.themeisle.com/neve-charity/';

// Request-level smoke tests. All external calls behind these endpoints are
// served by the tpc-e2e mu-plugin, so responses are deterministic.
// /install_plugins and /import_content are exercised end-to-end by the
// onboarding import spec and skipped here.
test.describe('ti-sites-lib REST endpoints', () => {
    test('refresh_sites_data returns the mocked sites feed', async ({ requestUtils }) => {
        const res = await requestUtils.rest({
            path: `${API}/refresh_sites_data`,
            method: 'GET',
        });

        expect(res.success).toBe(true);
        expect(JSON.stringify(res.data)).toContain('neve-charity');
    });

    test('starter_order returns the personalized order', async ({ requestUtils }) => {
        const res = await requestUtils.rest({
            path: `${API}/starter_order`,
            method: 'GET',
            params: { builder: 'gutenberg' },
        });

        expect(res.success).toBe(true);
        expect(res.builder).toBe('gutenberg');
        // Independent literals (the mu-plugin derives its response from the
        // same fixture, so deriving the expectation from it too would be
        // tautological). Must match mu-plugins/fixtures/sites.json.
        expect(res.order).toEqual([
            'neve-charity',
            'neve-web-agency',
            'neve-restaurant',
        ]);
    });

    test('starter_search returns an order for a query', async ({ requestUtils }) => {
        const res = await requestUtils.rest({
            path: `${API}/starter_search`,
            method: 'GET',
            params: { q: 'charity', builder: 'gutenberg' },
        });

        expect(res.success).toBe(true);
        expect(Array.isArray(res.order)).toBe(true);
        expect(res.order.length).toBeGreaterThan(0);
    });

    test('import_theme_mods imports theme mods', async ({ requestUtils }) => {
        const res = await requestUtils.rest({
            path: `${API}/import_theme_mods`,
            method: 'POST',
            data: {
                source_url: SOURCE_URL,
                theme_mods: baseDemoData.theme_mods,
            },
        });

        expect(res.success).toBe(true);
    });

    test('import_widgets imports widgets', async ({ requestUtils }) => {
        const res = await requestUtils.rest({
            path: `${API}/import_widgets`,
            method: 'POST',
            data: {
                source_url: SOURCE_URL,
                widgets: baseDemoData.widgets,
            },
        });

        expect(res.success).toBe(true);
    });

    test('dismiss_migration sets the dismissal theme mod', async ({ requestUtils }) => {
        const res = await requestUtils.rest({
            path: `${API}/dismiss_migration`,
            method: 'POST',
            data: { theme_mod: 'zelle_frontpage_was_imported' },
        });

        expect(res.success).toBe(true);
    });

    test('import_single_templates creates a published page from a template', async ({ requestUtils }) => {
        const res = await requestUtils.rest({
            path: `${API}/import_single_templates`,
            method: 'POST',
            data: [
                {
                    template_id: 'tpc-e2e-import',
                    template_name: 'E2E Imported Page',
                    template_type: 'gutenberg',
                    content:
                        '<!-- wp:paragraph --><p>Imported by e2e</p><!-- /wp:paragraph -->',
                },
            ],
        });

        expect(res.success).toBe(true);
        expect(res.pages).toHaveLength(1);
        expect(res.pages[0].title).toBe('E2E Imported Page');

        // The page really exists on the site.
        const pages = await requestUtils.rest({
            path: '/wp/v2/pages',
            method: 'GET',
            params: { search: 'E2E Imported Page' },
        });
        expect(pages.length).toBeGreaterThan(0);
    });

    test('cleanup runs successfully', async ({ requestUtils }) => {
        const res = await requestUtils.rest({
            path: `${API}/cleanup`,
            method: 'POST',
        });

        expect(res.success).toBe(true);
    });
});
