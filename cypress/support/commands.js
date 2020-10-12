Cypress.Cookies.defaults( {
	preserve: /wordpress_.*/,
} );

Cypress.Commands.add( 'login', ( nextRoute = null ) => {
	//console.log(cy.getCookies());

	const cookies = cy.getCookies( { log: true } ).then( function ( cookies ) {
		let isLoggedIn = false;
		cookies.forEach( function ( value ) {
			if ( value.name.includes( 'wordpress_' ) ) {
				isLoggedIn = true;
			}
		} );

		if ( isLoggedIn ) {
			if ( nextRoute !== null ) {
				cy.visit( nextRoute );
			}
			return;
		}
		cy.visit( '/wp-admin' );
		cy.wait( 500 );
		cy.get( '#user_login' ).type( Cypress.config().user );
		cy.get( '#user_pass' ).type( Cypress.config().password );
		cy.get( '#wp-submit' ).click();
		if ( nextRoute === null ) {
			return;
		}
		cy.visit( nextRoute );
	} );
} );
