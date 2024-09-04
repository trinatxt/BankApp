// cypress/e2e/home_spec.js

describe('Home Page', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('http://localhost:3000/')
  })

  it('should display the Hero component', () => {
    // Check if the Hero component is visible using class name
    cy.get('[data-testid="hero"]').should('be.visible')
  })

  it('should display the Partners component', () => {
    // Check if the Partners component is visible using class name
    cy.get('[data-testid="partners"]').should('be.visible')
  })
})
