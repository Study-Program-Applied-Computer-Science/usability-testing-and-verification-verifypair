describe('template spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3002');
  });
  it('Questions Testing', () => {
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
    cy.get('.card').first().within(() => { cy.get('button.btn-danger').click(); });
    cy.get('h4.card-title').should('not.contain', 'How is React.js?');
    cy.wait(2000);
  });



  it('should navigate to answer componenet', () => {
    cy.get('[data-testid="username-input"]').type('manu');
    cy.wait(2000);
    cy.get('[data-testid="password-input"]').type('Test@123');
    cy.wait(2000);
    cy.get('[data-testid="login-form"]').submit();
    cy.wait(2000);
    cy.url().should('include', '/posts');
    cy.wait(1500);
    cy.get('[data-testid="answer-button"]').first().click();
    cy.url().should('include', '/answer/1');
    cy.get('[data-testid="question_title_in_detail"]').should('be.visible');

    cy.wait(1500);
    cy.get('[data-testid="post-answer-textarea"]').type('This is a test answer for the question.');
    cy.wait(1500);
    cy.get('[data-testid="post-answer-button"]').click();
    cy.wait(1500);
    cy.get(`[class="mb-4"]`).should('contain', 'This is a test answer for the question.');
    cy.wait(1500);
    cy.get('[ data-testid="upvote-button"]').last().click();

    cy.wait(1500);
    cy.get('[data-testid="edit-button"]').last().click();

    cy.get('[data-testid="edit-textarea-after-click"]').clear().type('This is an edited answer for the question.');
    cy.wait(1500);
    cy.get('[data-testid="update-button-textarea"]').click();
    cy.wait(1500);
    cy.get(`[class="mb-4"]`).should('contain', 'This is an edited answer for the question.');

    cy.wait(1500);
    cy.get('[data-testid="delete-button"]').last().click();
    cy.wait(1500);
    cy.get(`[class="mb-4"]`).should('not.contain', 'This is an edited answer for the question.');

  });

})