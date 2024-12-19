import { __ } from '@wordpress/i18n';

const untrailingSlashIt = ( str ) => str.replace( /\/$/, '' );
const trailingSlashIt = ( str ) => untrailingSlashIt( str ) + '/';

const ONBOARDING_CAT = {
	business: __( 'Business', 'templates-patterns-collection' ),
	education: __( 'Education', 'templates-patterns-collection' ),
	woocommerce: __( 'eCommerce', 'templates-patterns-collection' ),
	news: __( 'News', 'templates-patterns-collection' ),
	nonprofit: __( 'Non-Profit', 'templates-patterns-collection' ),
	health: __( 'Health', 'templates-patterns-collection' ),
};

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
	textToFileURL,
};
