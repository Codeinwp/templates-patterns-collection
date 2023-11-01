/* global Blob */
import { __ } from '@wordpress/i18n';

const untrailingSlashIt = ( str ) => str.replace( /\/$/, '' );
const trailingSlashIt = ( str ) => untrailingSlashIt( str ) + '/';

const ONBOARDING_CAT = {
	business: __( 'Business', 'templates-patterns-collection' ),
	personal: __( 'Personal', 'templates-patterns-collection' ),
	blog: __( 'Blogging', 'templates-patterns-collection' ),
	portfolio: __( 'Portfolio', 'templates-patterns-collection' ),
	woocommerce: __( 'E-Shop', 'templates-patterns-collection' ),
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
