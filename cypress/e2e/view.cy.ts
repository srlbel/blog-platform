describe('Blog Platform', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('renders the form and table container', () => {
    cy.get('form#blog-form').should('exist');
    cy.get('#table-container').should('exist');
    cy.contains('Create a New Blog');
  });

  it('validates required fields in the form', () => {
    cy.get('#form-button').click();
    cy.get('#title:invalid').should('exist');
    cy.get('#description:invalid').should('exist');
    cy.get('#slug:invalid').should('exist');
    cy.get('#creator:invalid').should('exist');
  });

  it('creates a new blog post', () => {
    const blog = {
      title: 'Cypress Test Blog',
      description: 'This is a blog post created by Cypress.',
      slug: 'cypress-blog',
      creator: 'CypressBot',
    };

    cy.get('#title').type(blog.title);
    cy.get('#description').type(blog.description);
    cy.get('#slug').type(blog.slug);
    cy.get('#creator').type(blog.creator);

    cy.get('#form-button').click();

    // Check that the new blog appears in the table
    cy.contains('td', blog.title).should('exist');
    cy.contains('td', blog.description).should('exist');
    cy.contains('td', blog.creator).should('exist');
  });

  it('edits an existing blog post', () => {
    cy.contains('button', 'Edit').first().click();

    cy.get('#title').clear().type('Updated Blog Title');

    cy.get('#form-button').click();

    cy.contains('td', 'Updated Blog Title').should('exist');
  });

  it('deletes a blog post', () => {
    cy.contains('button', 'Delete').first().click();

    // Optional: add a wait or confirmation check if your backend is slow
    cy.wait(500);

    cy.contains('td', 'Updated Blog Title').should('not.exist');
  });
});
