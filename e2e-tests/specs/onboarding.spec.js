/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe('Onboarding', () => {
    const ONBOARDING_URL = 'themes.php?page=neve-onboarding';

    test('Sub-menu in Admin page', async ({ page, admin }) => {
        await admin.visitAdminPage('/');

        await page.getByRole('link', { name: 'Appearance' }).click();
        await page.getByRole('link', { name: 'Starter Templates' }).click();

        const currentURL = page.url();
        expect(currentURL).toContain(ONBOARDING_URL);
    });

    test('Site Listing Page Rendering', async ({ page, admin }) => {
        await admin.visitAdminPage(ONBOARDING_URL);

        await expect(page.locator('#ob-search-ss')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Builder Logo' })).toBeVisible(); // Check editor selector.
        await expect(page.locator('.components-button').first()).toBeVisible(); // Check logo.
        await expect(page.getByRole('button', { name: 'Exit to dashboard' })).toBeVisible();
        expect(await page.locator('.ob-cat-wrap button').count()).toBeGreaterThan(0);

        // Check if we have Starter Sites listed. And some of the are PRO.
        expect(await page.locator('.ss-card-wrap').count()).toBeGreaterThan(0);
        expect(await page.locator('.ss-card .ss-badge').count()).toBeGreaterThan(0);

        // 'All' and 'Free' should show after you select a category.
        await page.locator('.ob-cat-wrap').first().click();
        await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Free' })).toBeVisible();

        // Check card structure.
        const firstListedSiteCard = page.locator('.ss-card-wrap').first();
        await expect(firstListedSiteCard.locator('.ss-image')).toBeVisible();
        const bgImage = await firstListedSiteCard
            .locator('.ss-image')
            .evaluate((el) => window.getComputedStyle(el).getPropertyValue('background-image'));
        expect(bgImage).not.toBe('none');
        await expect(firstListedSiteCard.locator('.ss-title')).not.toBeEmpty();
    });

    test('Site Import Customization Rendering', async ({ page, admin }) => {
        await admin.visitAdminPage(ONBOARDING_URL);

        await page.locator('.ss-card-wrap').first().click();

        await page.waitForSelector('.ob-site-settings.fetching', { state: 'hidden' });

        // Customize design step.
        await expect(page.getByRole('button', { name: 'Select or upload image' })).toBeVisible();

        await expect(page.getByRole('heading', { name: 'Color Palette' })).toBeVisible();
        expect(await page.locator('.ob-palette').count()).toBeGreaterThan(0); // Check if we have some color pallet available.

        await expect(page.getByRole('heading', { name: 'Typography' })).toBeVisible();
        expect(await page.locator('.ob-ctrl-wrap.font button').count()).toBe(7); // Check if we have some font family options available.

        // Check if the first option is selected, select another option, reset and check again
        const firstPalletColorOption = page.locator('.ob-palette').first();
        await expect(firstPalletColorOption).toHaveClass(/ob-active/);

        const secondPalletColorOption = page.locator('.ob-palette').nth(1);
        await secondPalletColorOption.click();
        await expect(secondPalletColorOption).toHaveClass(/ob-active/);

        let resetButton = page.locator('.ob-ctrl-head > .components-button').first();
        await resetButton.click();
        await expect(firstPalletColorOption).toHaveClass(/ob-active/);

        const firstFontFamilyOption = page.locator('.ob-ctrl-wrap.font button').first();
        await expect(firstFontFamilyOption).toHaveClass(/ob-active/);

        const secondFontFamilyOption = page.locator('.ob-ctrl-wrap.font button').nth(1);
        await secondFontFamilyOption.click();
        await expect(secondFontFamilyOption).toHaveClass(/ob-active/);

        resetButton = page
            .locator('div')
            .filter({ hasText: /^Typography$/ })
            .getByRole('button');
        await resetButton.click();
        await expect(firstFontFamilyOption).toHaveClass(/ob-active/);
    });

    test('Site Import Plugins Rendering', async ({ page, admin }) => {
        await admin.visitAdminPage(ONBOARDING_URL);
        await page.locator('.ss-card-wrap').first().click();
        await page.waitForSelector('.ob-site-settings.fetching', { state: 'hidden' });
        await page.getByRole('button', { name: 'Continue' }).click();

        expect(await page.locator('.ob-feature-card').count()).toBe(6);
        expect(
            await page.locator('.ob-feature-card.ob-disabled[aria-checked="true"]').count(),
        ).toBeGreaterThan(0); // We have some required plugin that are active by default.

        // Check if we can select a plugin to install.
        const cachePlugin = page.getByRole('checkbox', { name: 'Caching Supercharge your site' });
        await cachePlugin.click();
        await expect(cachePlugin).toHaveAttribute('aria-checked', 'true');

        await page.getByRole('button', { name: 'Import Website' }).click();

        await expect(page.getByRole('button', { name: 'Start Import' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();

        await page.getByRole('button', { name: 'Cancel' }).click();
        await expect(page.getByRole('button', { name: 'Start Import' })).toBeHidden();
    });

    test('Site Import Process', async ({ page, admin }) => {
        await admin.visitAdminPage(ONBOARDING_URL);
        await page.locator('.ss-card-wrap').first().click();
        await page.waitForSelector('.ob-site-settings.fetching', { state: 'hidden' });
        await page.getByRole('button', { name: 'Continue' }).click();
        const cachePlugin = page.getByRole('checkbox', { name: 'Caching Supercharge your site' });
        await cachePlugin.click();
        await page.getByRole('button', { name: 'Import Website' }).click();

        await page.getByRole('button', { name: 'Start Import' }).click();

        await expect(
            page.getByRole('heading', { name: 'We are importing your new' }),
        ).toBeVisible();

        await page.waitForSelector('.ob-import-done', { timeout: 60000 });

        await expect(page.getByRole('textbox', { name: 'Enter your email' })).toBeVisible();
        await expect(page.locator('#inspector-select-control-0')).toBeVisible(); // User experience selector.
        await expect(page.locator('#inspector-select-control-1')).toBeVisible(); // Reason the build selector.

        await expect(page.getByRole('button', { name: 'Submit and view site' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Skip and view site' })).toBeVisible();

        await page.getByRole('button', { name: 'Skip and view site' }).click();

        await page.waitForURL((url) => !url.toString().includes(ONBOARDING_URL));
        expect(page.url()).not.toContain(ONBOARDING_URL);
    });

    test( 'Back Button navigation', async ({ page, admin }) => {
        await admin.visitAdminPage(ONBOARDING_URL);
        await page.locator('.ss-card-wrap').first().click();
        await page.waitForSelector('.ob-site-settings.fetching', { state: 'hidden' });
        await page.getByRole('button', { name: 'Continue' }).click();

        await page.getByRole('button', { name: 'Go back' }).click();
        await page.getByRole('button', { name: 'Go back' }).click();

        await expect( page.getByRole('heading', { name: 'Choose a design' }) ).toBeVisible();
    });

    test( 'Exit from Site Import Steps', async ({ page, admin }) => {
        await admin.visitAdminPage(ONBOARDING_URL);
        await page.locator('.ss-card-wrap').first().click();
        await page.waitForSelector('.ob-site-settings.fetching', { state: 'hidden' });
        await page.getByRole('button', { name: 'Continue' }).click();

        await page.locator('button:has(span.dashicons-no-alt)' ).click();
        await expect( page.getByRole('heading', { name: 'Choose a design' }) ).toBeVisible();
    });
});
