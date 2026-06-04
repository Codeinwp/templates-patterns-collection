import { __ } from '@wordpress/i18n';

const untrailingSlashIt = ( str ) => str.replace( /\/$/, '' );
const trailingSlashIt = ( str ) => untrailingSlashIt( str ) + '/';

const ONBOARDING_CAT = {
	business: __( 'Business', 'templates-patterns-collection' ),
	blog: __( 'Blog', 'templates-patterns-collection' ),
	portfolio: __( 'Portfolio', 'templates-patterns-collection' ),
	education: __( 'Education', 'templates-patterns-collection' ),
	woocommerce: __( 'eCommerce', 'templates-patterns-collection' ),
	news: __( 'News', 'templates-patterns-collection' ),
	nonprofit: __( 'Non-Profit', 'templates-patterns-collection' ),
	health: __( 'Health', 'templates-patterns-collection' ),
};

// Fixed color families for the starter-site color filter. Each demo is tagged into
// the families it actually ships (derived from its neve_global_colors palettes), so a
// site may belong to several — or, like the main demo, just one. `hex` is the swatch
// dot only; it does not need to match any single palette value.
const ONBOARDING_COLORS = [
	{ key: 'blue', label: __( 'Blue', 'templates-patterns-collection' ), hex: '#2f6fed' },
	{ key: 'teal', label: __( 'Teal', 'templates-patterns-collection' ), hex: '#14b8a6' },
	{ key: 'green', label: __( 'Green', 'templates-patterns-collection' ), hex: '#22a06b' },
	{ key: 'yellow', label: __( 'Yellow', 'templates-patterns-collection' ), hex: '#eab308' },
	{ key: 'warm', label: __( 'Warm', 'templates-patterns-collection' ), hex: '#e8833a' },
	{ key: 'rose', label: __( 'Rose', 'templates-patterns-collection' ), hex: '#e11d48' },
	{ key: 'purple', label: __( 'Purple', 'templates-patterns-collection' ), hex: '#7c3aed' },
	{ key: 'neutral', label: __( 'Neutral', 'templates-patterns-collection' ), hex: '#9aa0a6' },
	{ key: 'dark', label: __( 'Dark', 'templates-patterns-collection' ), hex: '#222222' },
];

// Single-select today (picking a color replaces the prior one). Kept as a constant in
// case multi-select returns; the popover toggle treats it as 1.
const MAX_COLOR_SELECTION = 1;

const EDITOR_MAP = {
	gutenberg: {
		icon: 'gutenberg.jpg',
		niceName: 'Gutenberg',
	},
	elementor: {
		icon: 'elementor.jpg',
		niceName: 'Elementor',
	},
};

const sendPostMessage = ( data ) => {
	const frame = document.getElementById( 'ti-ss-preview' );
	if ( ! frame ) {
		return;
	}

	frame.contentWindow.postMessage(
		{
			call: 'starterTemplatePreviewDispatch',
			value: data,
		},
		'*'
	);
};

/**
 * Convert text to file URL.
 *
 * @param {string} text - Text to convert
 * @return {string} - File URL
 */
const textToFileURL = ( text ) => {
	const blob = new Blob( [ text ], { type: 'text/plain' } );
	return URL.createObjectURL( blob );
};

export {
	trailingSlashIt,
	untrailingSlashIt,
	sendPostMessage,
	EDITOR_MAP,
	ONBOARDING_CAT,
	ONBOARDING_COLORS,
	MAX_COLOR_SELECTION,
	textToFileURL,
};
