import 'whatwg-fetch';

describe( 'Dashboard Page - Default', () => {
	const EDITORS = [
		'gutenberg',
		'elementor',
		'brizy',
		'beaver',
		'divi',
		'thrive',
	];
	const CATEGORIES = [
		'All Categories',
		'Free',
		'Business',
		'Portfolio',
		'WooCommerce',
		'Blog',
		'Personal',
		'Other',
	];
	const BEFORE = () => {
		cy.login();
		cy.visit( '/wp-admin/themes.php?page=tiob-starter-sites' );
	};

	const BEFORE_EACH = () => {
		cy.scrollTo( 'top' ).wait( 100 );
	};

	beforeEach( () => BEFORE_EACH() );
	before( () => BEFORE() );

	it( 'Preview Works', () => {
		cy.get( '.starter-site-card' ).first().as( 'firstCard' );
		cy.get( '@firstCard' ).trigger( 'mouseover' );
		cy.get( '@firstCard' ).find( 'button' ).should( 'have.length', 3 );
		cy.get( '@firstCard' ).find( 'button' ).contains( 'Preview' ).click();

		cy.get( '.ob-preview' ).as( 'previewWrap' );
		cy.get( '@previewWrap' ).find( 'button' ).contains( 'Import' ).click();
		cy.get( '.ob-import-modal.install-modal' ).as( 'modal' );
		cy.get( '@modal' ).should( 'exist' );
		cy.get( '@modal' ).find( '.actions button' ).should( 'have.length', 2 );
		cy.get( '@modal' ).find( 'button' ).contains( 'Close' ).click();
		cy.get( '@previewWrap' ).find( 'button.close' ).click();
	} );

	it( 'Infinite Scroll', () => {
		cy.get( '.starter-site-card' ).should( 'have.length', 9 );
		cy.scrollTo( 'bottom' ).wait( 100 );
		cy.get( '.starter-site-card' ).should( 'have.length', 18 );
		cy.scrollTo( 'top' );
	} );

	it( 'No Results Search & Tags Functionality', () => {
		const TAG = 'Photography';
		cy.get( '.header-form:not(.in-sticky) .search input' ).type( '$' );
		cy.get( '.no-results' ).should( 'exist' );
		cy.get( '.no-results .tag' ).should( 'have.length', 5 );
		cy.get( '.no-results .tag' ).contains( TAG ).click();
		cy.get( '.header-form:not(.in-sticky) .search input' ).should(
			'have.value',
			TAG
		);
		cy.get( '.header-form:not(.in-sticky) .search input' ).clear();
	} );

	it( 'Editor Tabs Functionality', () => {
		cy.get( '.tab.gutenberg' ).should( 'have.class', 'active' );
		EDITORS.map( ( editor ) => {
			cy.get( `.tab.${ editor }` ).as( 'tab' );
			cy.get( '@tab' ).click();
			cy.get( '@tab' ).should( 'have.class', 'active' );
		} );
		cy.get( '.tab.gutenberg' ).click().should( 'have.class', 'active' );
	} );
	it( 'Categories Functionality', () => {
		const ALL = 'All Categories';
		cy.get( '.categories-selector button' ).last().as( 'dropdown' );

		CATEGORIES.map( ( category ) => {
			if ( category === ALL ) {
				return;
			}
			cy.get( '@dropdown' ).click( { force: true } );
			cy.get( '.categories-selector li' ).contains( category ).click();
			cy.get( '.categories-selector button' ).should(
				'contain',
				category
			);
		} );
		cy.get( '@dropdown' ).click( { force: true } );
		cy.get( '.categories-selector li' ).contains( ALL ).click();
		cy.get( '.categories-selector button' ).should( 'contain', ALL );
	} );

	it( 'Sticky Nav Works', () => {
		cy.scrollTo( 'top' );
		const CATEGORY = 'Blog';
		cy.get( '.sticky-nav' ).should( 'exist' );
		cy.get( '.header-form .search input' ).last().type( CATEGORY );
		cy.get( '.categories-selector button' ).last().click( { force: true } );
		cy.get( '.categories-selector li' )
			.contains( CATEGORY )
			.click( { force: true } );

		cy.scrollTo( 'bottom' ).wait( 100 ).scrollTo( 'bottom' ).wait( 100 );

		cy.get( '.sticky-nav' ).should( 'exist' ).and( 'be.visible' );

		cy.get( '.sticky-nav input' ).should( 'have.value', CATEGORY );
		cy.get( '.sticky-nav .categories-selector button' ).should(
			'contain',
			CATEGORY
		);
	} );
} );

describe( 'Dashboard Page - Onboarding', () => {
	const BEFORE = () => {
		cy.login();
		cy.visit(
			'/wp-admin/themes.php?page=tiob-starter-sites&onboarding=yes'
		);
	};
	before( () => BEFORE() );

	it( 'Onboarding Works Properly', () => {
		cy.get( '.content-wrap.starter-sites' ).should(
			'have.class',
			'is-onboarding'
		);
		cy.get( '.content-wrap' )
			.scrollTo( 'bottom' )
			.wait( 100 )
			.scrollTo( 'bottom' );
		cy.get( 'button.close-onboarding' ).should( 'exist' ).click();
		cy.get( '.content-wrap.starter-sites' ).should(
			'not.have.class',
			'is-onboarding'
		);
	} );
} );

describe( 'Importer Works', () => {
	const BEFORE = () => {
		// Polyfill Fetch as cypress doesn't handle it.
		Cypress.on( 'window:before:load', ( win ) => {
			delete win.fetch;
		} );
		cy.login();
		cy.visit( '/wp-admin/themes.php?page=tiob-starter-sites' );
	};

	const ALIAS_ROUTES = () => {
		cy.server();
		cy.route( 'POST', '/wp-admin/admin-ajax.php' ).as( 'installTheme' );
		cy.route(
			'GET',
			'/wp-admin/themes.php?action=activate&stylesheet=neve&_wpnonce=*'
		).as( 'activateTheme' );
		cy.route(
			'GET',
			'https://api.themeisle.com/sites/web-agency-gb/wp-json/ti-demo-data/data?license=*'
		).as( 'getModalData' );

		cy.route( 'POST', 'install_plugins' ).as( 'installPlugins' );
		cy.route( 'POST', 'import_content' ).as( 'importContent' );
		cy.route( 'POST', 'import_theme_mods' ).as( 'importCustomizer' );
		cy.route( 'POST', 'import_widgets' ).as( 'importWidgets' );
	};

	before( () => BEFORE() );

	it( 'Installs & Activates Theme', () => {
		ALIAS_ROUTES();
		cy.get( '.starter-site-card' ).first().as( 'firstCard' );
		cy.get( '@firstCard' ).trigger( 'mouseover' );
		cy.get( '@firstCard' ).find( 'button' ).should( 'have.length', 3 );
		cy.get( '@firstCard' ).find( 'button' ).contains( 'Import' ).click();

		cy.get( '.ob-import-modal.install-modal' )
			.find( 'button' )
			.contains( 'Install and Activate' )
			.click();

		cy.wait( '@installTheme', { responseTimeout: '20000' } ).then( ( req ) => {
			expect( req.response.body.success ).to.be.true;
			expect( req.status ).to.equal( 200 );
		} );

		cy.wait( '@activateTheme' ).then( ( req ) => {
			expect( req.status ).to.equal( 200 );
		} );
		cy.wait( '@getModalData' ).then( ( req ) => {
			expect( req.status ).to.equal( 200 );
		} );
		cy.get( '.ob-import-modal .components-modal__header' )
			.find( 'button' )
			.click();
	} );

	it( 'Imports Site', () => {
		ALIAS_ROUTES();
		cy.get( '.starter-site-card' ).first().as( 'firstCard' );
		cy.get( '@firstCard' ).trigger( 'mouseover' );
		cy.get( '@firstCard' ).find( 'button' ).should( 'have.length', 3 );
		cy.get( '@firstCard' ).find( 'button' ).contains( 'Import' ).click();

		cy.wait( '@getModalData' ).then( ( req ) => {
			expect( req.status ).to.equal( 200 );
		} );

		cy.get( '.ob-import-modal' )
			.find( 'button' )
			.contains( 'Import entire site' )
			.click();

		cy.wait( '@installPlugins' ).then( ( req ) => {
			expect( req.status ).to.equal( 200 );
		} );
		cy.wait( '@importContent' ).then( ( req ) => {
			expect( req.status ).to.equal( 200 );
		} );
		cy.wait( '@importCustomizer' ).then( ( req ) => {
			expect( req.status ).to.equal( 200 );
		} );
		cy.wait( '@importWidgets' ).then( ( req ) => {
			expect( req.status ).to.equal( 200 );
		} );
	} );
} );
