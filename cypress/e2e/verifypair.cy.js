describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3002');
  });
  beforeEach(() => {
    cy.visit('http://localhost:3002');
  });


})