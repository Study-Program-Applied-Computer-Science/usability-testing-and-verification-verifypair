describe('template spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3002');
  });
  it('App Testing', () => {
    cy.wait(2000);

    cy.contains('Register').click();
    cy.wait(2000);
    cy.get('[data-testid="username-input"]').type('testuser');
    cy.wait(2000);
    cy.get('[data-testid="password-input"]').type('testuser123');
    cy.wait(2000);
    cy.get('[data-testid="register-form"]').submit();
    cy.wait(2000);
    cy.url().should('include', '/login');

    cy.get('[data-testid="username-input"]').type('testuser');
    cy.wait(2000);
    cy.get('[data-testid="password-input"]').type('testuser123');
    cy.wait(2000);
    cy.get('[data-testid="login-form"]').submit();
    cy.wait(2000);
    cy.url().should('include', '/posts');

    cy.contains('button', 'Ask a Question').click();
    cy.wait(2000);
    cy.get('#title').type('How is React.js?');
    cy.wait(2000);
    cy.get('#description').type('How is React for beginners?');
    cy.wait(2000);
    cy.get('button[type="submit"]').contains('Submit Question').click();
    cy.wait(2000);
    cy.url().should('include', '/posts');
    cy.wait(2000);
    cy.get('h4.card-title').should('contain', 'How is React.js?');
    cy.wait(2000);
    cy.get('.card').first().within(() => {cy.get('button.btn-danger').click();});
    cy.get('h4.card-title').should('not.contain', 'How is React.js?');
    cy.wait(2000);
  });

})