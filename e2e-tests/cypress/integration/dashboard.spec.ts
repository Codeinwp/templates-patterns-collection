describe('Dashboard Page - Default', function () {
  const EDITORS = ['gutenberg', 'elementor'];
  const CATEGORIES = {
    all: 'All Categories',
    free: 'Free',
    business: 'Business',
    portfolio: 'Portfolio',
    woocommerce: 'WooCommerce',
    blog: 'Blog',
    personal: 'Personal',
    other: 'Other',
  };

  before(function () {
    cy.visit('/');
  });

  beforeEach(function () {
    cy.visit('/wp-admin/admin.php?page=tiob-starter-sites');
  });

  it('Preview Works', function () {
    cy.get('.starter-site-card').first().as('firstCard');
    cy.get('@firstCard').realHover();
    cy.get('@firstCard').find('button').should('have.length', 3);
    cy.get('@firstCard').find('button').contains('Preview').click();

    cy.get('.ob-preview').as('previewWrap');
    cy.get('@previewWrap').find('button').contains('Import').click();
    cy.findByRole('dialog');
    cy.findByRole('button', {
      name: /i want to import just the templates/i,
    });
    cy.findByRole('button', {
      name: /import entire site/i,
    });
    cy.findByRole('button', {
      name: /close/i,
    }).click();

    cy.findByRole('button', {
      name: /previous/i,
    });

    cy.findByRole('button', {
      name: /next/i,
    });
    cy.findByRole('button', {
      name: /close/i,
    }).click();
    cy.url().should('contain', '/wp-admin/admin.php?page=tiob-starter-sites');
  });

  it('Infinite Scroll', function () {
    cy.get('.starter-site-card').should('have.length', 9);
    cy.scrollTo('bottom').wait(100);
    cy.get('.starter-site-card').should('have.length', 18);
    cy.scrollTo('top');
  });

  it('No Results Search & Tags Functionality', function () {
    const TAG = 'Photography';
    cy.get('.header-form:not(.in-sticky) .search input').type('$');
    cy.get('.no-results').should('exist');
    cy.get('.no-results .tag').should('have.length', 5);
    cy.get('.no-results .tag').contains(TAG).click();
    cy.get('.header-form:not(.in-sticky) .search input').should('have.value', TAG);
    cy.get('.header-form:not(.in-sticky) .search input').clear();
  });

  it('Categories Tabs Functionality', function () {
    cy.get('.tab.all').should('have.class', 'active');
    Object.keys(CATEGORIES).map((category) => {
      cy.get(`.tab.${category}`).as('tab');
      cy.get('@tab').click();
      cy.get('@tab').should('have.class', 'active');
    });
    cy.get('.tab.all').click().should('have.class', 'active');
  });
  it('Editor Functionality', function () {
    const GTB = 'Gutenberg';
    cy.get('.categories-selector button').last().as('dropdown');

    EDITORS.map((editor) => {
      const editorName = editor.charAt(0).toUpperCase() + editor.slice(1);
      if (editorName === GTB) {
        return;
      }
      cy.get('@dropdown').click({ force: true });
      cy.wait(250);
      cy.get('.categories-selector li').contains(editorName).click({ force: true });
      cy.get('.categories-selector button').should('contain', editorName);
    });
    cy.get('@dropdown').click({ force: true });
    cy.wait(250);
    cy.get('.categories-selector li').contains(GTB).click({ force: true });
    cy.get('.categories-selector button').should('contain', GTB);
  });

  it('Sticky Nav Works', function () {
    cy.scrollTo('top');
    const CATEGORY = 'Blog';
    const EDITOR = 'Elementor';
    cy.get('.sticky-nav').should('exist');
    cy.get('.header-form .search input').last().type(CATEGORY);
    cy.get('.categories-selector button').last().click({ force: true });
    cy.get('.categories-selector li').contains(EDITOR).click({ force: true });

    cy.scrollTo('bottom').wait(100).scrollTo('bottom').wait(100);

    cy.get('.sticky-nav').should('exist').and('be.visible');

    cy.get('.sticky-nav input').should('have.value', CATEGORY);
    cy.get('.sticky-nav .categories-selector button').should('contain', EDITOR);
  });
});

describe('Dashboard Page - Onboarding', function () {
  before(function () {
    cy.visit('/');
    cy.visit('/wp-admin/admin.php?page=tiob-starter-sites&onboarding=yes');
  });

  it('Onboarding Works Properly', function () {
    cy.get('.content-wrap.starter-sites').should('have.class', 'is-onboarding');
    cy.get('.content-wrap').scrollTo('bottom').wait(100).scrollTo('bottom');
    cy.get('button.close-onboarding').should('exist').click();
    cy.get('.content-wrap.starter-sites').should('not.have.class', 'is-onboarding');
  });
});

describe('Importer Works', function () {
  before(function () {
    cy.visit('/');
    cy.visit('/wp-admin/admin.php?page=tiob-starter-sites');
  });

  it('Imports Site', function () {
    cy.intercept(
      'GET',
      'https://api.themeisle.com/sites/web-agency-gb/wp-json/ti-demo-data/data?license=*',
    ).as('getModalData');

    cy.intercept('POST', '**install_plugins*').as('installPlugins');
    cy.intercept('POST', '**import_content*').as('importContent');
    cy.intercept('POST', '**import_theme_mods*').as('importCustomizer');
    cy.intercept('POST', '**import_widgets*').as('importWidgets');

    cy.get('.starter-site-card').first().as('firstCard');
    cy.get('@firstCard').trigger('mouseover');
    cy.get('@firstCard').find('button').should('have.length', 3);
    cy.get('@firstCard').find('button').contains('Import').click();

    cy.wait('@getModalData').then((req) => {
      expect(req.response.statusCode).to.equal(200);
      expect(req.response.body).to.have.all.keys(
        'content_file',
        'theme_mods',
        'wp_options',
        'widgets',
        'recommended_plugins',
        'mandatory_plugins',
        'default_off_recommended_plugins',
        'front_page',
        'shop_pages',
      );
    });

    cy.get('.ob-import-modal').wait(1000).find('button').contains('Import entire site').click();

    cy.wait('@installPlugins', { timeout: 20000 }).then((req) => {
      console.log( req.response.statusCode );
      expect(req.response.statusCode).to.equal(200);
    });

    cy.wait('@importContent', { timeout: 20000 }).then((req) => {
      expect(req.response.statusCode).to.equal(200);
    });

    cy.wait('@importCustomizer', { timeout: 20000 }).then((req) => {
      expect(req.response.statusCode).to.equal(200);
    });

    cy.wait('@importWidgets', { timeout: 20000 }).then((req) => {
      expect(req.response.statusCode).to.equal(200);
    });
  });
});
