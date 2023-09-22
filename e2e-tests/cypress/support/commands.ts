import 'cypress-file-upload';
import '@percy/cypress';
import 'cypress-nv-commands/index';
import 'cypress-localstorage-commands';
import '@testing-library/cypress/add-commands';
import 'cypress-real-events';

Cypress.Commands.add('loginToWp', ({ userName, password }) => {
  cy.session([userName, password], () => {
    cy.request({
      method: 'POST',
      url: '/wp-login.php',
      body: {
        log: userName,
        pwd: password,
      },
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.include('Dashboard');
    });
  });
});
