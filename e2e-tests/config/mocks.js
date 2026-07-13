/**
 * Shared mock payloads and page.route installers for browser-side fetches.
 *
 * Server-side PHP fetches (sites feed, license check, starter ranking,
 * content XML, attachments) are mocked by the tpc-e2e mu-plugin; page.route
 * here covers only what the browser fetches directly: the cross-origin
 * ti-demo-data endpoint, the Templates Cloud API and tracking calls.
 */
import baseDemoData from '../../tests/fixtures/data.json';
import sites from '../mu-plugins/fixtures/sites.json';

export const SITES = sites;

// Must match TPC_E2E_CONTENT_XML_URL in mu-plugins/tpc-e2e.php, which serves
// tests/fixtures/export.xml for this URL.
export const CONTENT_XML_URL =
	'https://demo.themeisle.com/neve-charity/export.xml';

const fontPair = ( heading, body ) => ( {
	headingFont: { font: heading, fontSource: 'Google', previewSize: '25px' },
	bodyFont: { font: body, fontSource: 'Google', previewSize: '17px' },
} );

export const FONT_PAIRS = {
	'roboto-lora-0': fontPair( 'Roboto', 'Lora' ),
	'playfair-display-source-sans-pro-1': fontPair(
		'Playfair Display',
		'Source Sans Pro'
	),
	'montserrat-open-sans-2': fontPair( 'Montserrat', 'Open Sans' ),
	'oswald-merriweather-3': fontPair( 'Oswald', 'Merriweather' ),
	'raleway-pt-serif-4': fontPair( 'Raleway', 'PT Serif' ),
	'prata-hanken-grotesk-5': fontPair( 'Prata', 'Hanken Grotesk' ),
};

export const PALETTES = {
	base: {
		name: 'Base',
		allowDeletion: false,
		colors: {
			'nv-primary-accent': '#0366d6',
			'nv-secondary-accent': '#0e509a',
			'nv-site-bg': '#ffffff',
			'nv-light-bg': '#ededed',
			'nv-dark-bg': '#14171c',
			'nv-text-color': '#393939',
			'nv-text-dark-bg': '#ffffff',
		},
	},
	darkMode: {
		name: 'Dark Mode',
		allowDeletion: false,
		colors: {
			'nv-primary-accent': '#26bcdb',
			'nv-secondary-accent': '#1f90a6',
			'nv-site-bg': '#121212',
			'nv-light-bg': '#1a1a1a',
			'nv-dark-bg': '#25272c',
			'nv-text-color': '#ffffff',
			'nv-text-dark-bg': '#ffffff',
		},
	},
	blackWhite: {
		name: 'Black & White',
		allowDeletion: false,
		colors: {
			'nv-primary-accent': '#000000',
			'nv-secondary-accent': '#292929',
			'nv-site-bg': '#ffffff',
			'nv-light-bg': '#ededed',
			'nv-dark-bg': '#14171c',
			'nv-text-color': '#393939',
			'nv-text-dark-bg': '#ffffff',
		},
	},
};

// Demo-data payload served to the onboarding app. Based on the PHPUnit
// fixture. One small mandatory plugin (part of the featured collection, so the
// features list stays at the static 6 cards) keeps the locked/required-card UI
// and its install path under test without pulling in a heavy plugin.
export const demoData = {
	...baseDemoData,
	slug: 'neve-charity',
	content_file: CONTENT_XML_URL,
	mandatory_plugins: { 'optimole-wp': 'Image Optimization' },
	recommended_plugins: {},
	font_pairs: FONT_PAIRS,
	theme_mods: {
		...baseDemoData.theme_mods,
		neve_global_colors: {
			activePalette: 'base',
			palettes: PALETTES,
		},
	},
};

export const MOCK_TEMPLATES = [
	{
		template_id: 'tpc-e2e-template-1',
		template_name: 'E2E Template One',
		template_thumbnail: '',
		template_type: 'gutenberg',
		link: 'https://demo.themeisle.com/neve-charity/',
	},
	{
		template_id: 'tpc-e2e-template-2',
		template_name: 'E2E Template Two',
		template_thumbnail: '',
		template_type: 'gutenberg',
		link: 'https://demo.themeisle.com/neve-charity/',
	},
];

// apiFetch sends credentialed requests, so the mocked cross-origin responses
// must echo the exact origin (a wildcard is rejected by the browser).
const corsHeaders = ( route ) => ( {
	'access-control-allow-origin':
		route.request().headers().origin || '*',
	'access-control-allow-credentials': 'true',
	'access-control-allow-headers': '*',
	'access-control-allow-methods': '*',
	'access-control-expose-headers': 'x-wp-totalpages',
} );

const fulfillJson = ( route, body, headers = {} ) => {
	if ( route.request().method() === 'OPTIONS' ) {
		return route.fulfill( { status: 200, headers: corsHeaders( route ) } );
	}
	return route.fulfill( {
		status: 200,
		contentType: 'application/json',
		headers: { ...corsHeaders( route ), ...headers },
		body: JSON.stringify( body ),
	} );
};

export async function mockOnboardingRoutes( page ) {
	await page.route( '**/wp-json/ti-demo-data/data*', ( route ) =>
		fulfillJson( route, demoData )
	);
	await page.route( '**/api.themeisle.com/tracking/**', ( route ) =>
		fulfillJson( route, { code: 'success' } )
	);
}

export async function mockTemplatesCloudRoutes( page, templates = MOCK_TEMPLATES ) {
	await page.route( '**/api.themeisle.com/templates-cloud/**', ( route ) => {
		// The library infinite-scrolls to the next page; only page 0 has items,
		// so rendered counts stay deterministic.
		const requestedPage = new URL( route.request().url() ).searchParams.get( 'page' );
		const body = requestedPage && requestedPage !== '0' ? [] : templates;
		return fulfillJson( route, body, { 'x-wp-totalpages': '1' } );
	} );
}
