import { __ } from '@wordpress/i18n';

const untrailingSlashIt = ( str ) => str.replace( /\/$/, '' );
const trailingSlashIt = ( str ) => untrailingSlashIt( str ) + '/';

const TAGS = [
	__( 'Business', 'templates-patterns-collection' ),
	__( 'Ecommerce', 'templates-patterns-collection' ),
	__( 'Fashion', 'templates-patterns-collection' ),
	__( 'Blogging', 'templates-patterns-collection' ),
	__( 'Photography', 'templates-patterns-collection' ),
];
const CATEGORIES = {
	all: __( 'All Categories' ),
	free: __( 'Free' ),
	business: __( 'Business' ),
	portfolio: __( 'Portfolio' ),
	woocommerce: __( 'WooCommerce' ),
	blog: __( 'Blog' ),
	personal: __( 'Personal' ),
	other: __( 'Other' ),
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

export { trailingSlashIt, untrailingSlashIt, CATEGORIES, EDITOR_MAP, TAGS };
