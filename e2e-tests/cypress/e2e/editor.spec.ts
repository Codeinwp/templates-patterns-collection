describe( 'Gutenberg Editor', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.visit('/wp-admin/post-new.php');
    });

    it( 'Add a navigation block', () => {
        cy.window().then( win => {
            const navBlock = win.wp.blocks.createBlock( 'core/navigation' );
            win.wp.data.dispatch( 'core/block-editor' ).insertBlocks( navBlock );
        } );

        cy.intercept({
            method: 'OPTIONS',
            url: '/wp-json/wp/v2/navigation/**'
        }).as('getNavigation');

        cy.wait('@getNavigation') // Wait for navigation to pull its data.
        .then(() => {
            // We should have no rendering warning.
            cy.get('.block-editor-warning__message').should('not.exist');
        });
    } );
});
