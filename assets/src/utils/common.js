import { __ } from '@wordpress/i18n';

const addUrlHash = ( hash ) => {
	window.location.hash = hash;
};

const getTabHash = ( tabs ) => {
	let hash = window.location.hash;

	if ( 'string' !== typeof window.location.hash ) {
		return null;
	}

	hash = hash.substring( 1 );

	if ( ! Object.keys( tabs ).includes( hash ) ) {
		return null;
	}

	return hash;
};

const untrailingSlashIt = ( str ) => str.replace( /\/$/, '' );
const trailingSlashIt = ( str ) => untrailingSlashIt( str ) + '/';

const isTabbedEditor = false;

const TAGS = [
	__( 'Business', 'templates-patterns-collection' ),
	__( 'Ecommerce', 'templates-patterns-collection' ),
	__( 'Fashion', 'templates-patterns-collection' ),
	__( 'Blogging', 'templates-patterns-collection' ),
	__( 'Photography', 'templates-patterns-collection' ),
];
const CATEGORIES = {
	all: __( 'All Categories', 'templates-patterns-collection' ),
	free: __( 'Free', 'templates-patterns-collection' ),
	business: __( 'Business', 'templates-patterns-collection' ),
	portfolio: __( 'Portfolio', 'templates-patterns-collection' ),
	woocommerce: __( 'WooCommerce', 'templates-patterns-collection' ),
	blog: __( 'Blog', 'templates-patterns-collection' ),
	personal: __( 'Personal', 'templates-patterns-collection' ),
	other: __( 'Other', 'templates-patterns-collection' ),
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

const EDITOR_MAP_ARCHIVED = {
	'beaver builder': {
		icon: 'beaver.jpg',
		niceName: (
			<>
				Beaver <span className="long-name">Builder</span>
			</>
		),
	},
	brizy: {
		icon: 'brizy.jpg',
		niceName: 'Brizy',
	},
	'divi builder': {
		icon: 'divi.jpg',
		niceName: 'Divi',
	},
	'thrive architect': {
		icon: 'thrive.jpg',
		niceName: (
			<>
				Thrive <span className="long-name">Architect</span>
			</>
		),
	},
};

/**
 * Loop through an Elementor element and apply the function.
 *
 * @param {any} element  Elementor element.
 * @param {*} applyFunc The function to apply on each child element.
 */
const loopElementorElement = ( element, applyFunc ) => {
	applyFunc( element );

	element?.elements?.forEach( ( item ) => {
		loopElementorElement( item, applyFunc );
	} );
};

/**
 * Clean the template content from unnecessary data.
 *
 * @param {any} templateContent The template content.
 * @param {Function} cleanFunc The function to apply on each element.
 * @return {any} The cleaned template content.
 */
const cleanTemplateContent = ( templateContent, cleanFunc ) => {
	if ( undefined === templateContent.content ) {
		return templateContent;
	}

	const content = templateContent.content;

	if ( Array.isArray( content ) ) {
		content.forEach( ( item ) => {
			loopElementorElement( item, cleanFunc );
		} );
	}
};

export {
	addUrlHash,
	getTabHash,
	trailingSlashIt,
	untrailingSlashIt,
	isTabbedEditor,
	CATEGORIES,
	EDITOR_MAP,
	EDITOR_MAP_ARCHIVED,
	TAGS,
	cleanTemplateContent,
};
