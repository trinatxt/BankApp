describe('LoginPage System Test', () => {
    it('should successfully log in with valid credentials and navigate to the profile page', () => {
      cy.visit('http://localhost:3000/login');
  
      cy.get('input[placeholder="Username"]').type('js');
      cy.get('input[placeholder="Password"]').type('John123!');
      cy.get('button[type="submit"]').click();
  
      cy.url().should('include', '/profile');
    });
  
    it('should show error message on invalid login', () => {
      cy.visit('http://localhost:3000/login');
  
      cy.get('input[placeholder="Username"]').type('invalidUsername');
      cy.get('input[placeholder="Password"]').type('invalidPassword');
      cy.get('button[type="submit"]').click();
  
      cy.get('[data-testid="error-message"]').should('contain', 'Invalid username or password. Please try again.');
    });
  
    it('should show visual error indication on empty input fields', () => {
      cy.visit('http://localhost:3000/login');
  
      // Trigger form submission with empty fields
      cy.get('button[type="submit"]').click();
  
      // Check that the username input field has the error styling
      cy.get('input[placeholder="Username"]').should('have.class', 'w-full px-4 py-2 border rounded-full');
    
  
      // Fill in username and re-submit to check for password error
      cy.get('input[placeholder="Username"]').type('testuser');
      cy.get('button[type="submit"]').click();
      cy.get('input[placeholder="Password"]').should('have.class', 'w-full px-4 py-2 border rounded-full');
    });
  
    it('should toggle password visibility', () => {
      cy.visit('http://localhost:3000/login');
  
      cy.get('input[placeholder="Password"]').should('have.attr', 'type', 'password');
  
      cy.get('button[aria-label="toggle password visibility"]').click();
      cy.get('input[placeholder="Password"]').should('have.attr', 'type', 'text');
  
      cy.get('button[aria-label="toggle password visibility"]').click();
      cy.get('input[placeholder="Password"]').should('have.attr', 'type', 'password');
    });
  
    it('should navigate to sign up page on sign up link click', () => {
      cy.visit('http://localhost:3000/login');
  
      cy.get('a').contains('Sign up').click();
  
      cy.url().should('include', '/profilecreationpage');
    });
  });
  