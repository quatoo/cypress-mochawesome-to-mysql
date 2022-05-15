
describe('GET TODO list', () => {    
    it('Get values', () => {
        cy.request('https://gorest.co.in/public/v2/todos').as('todo-list');
        cy.get('@todo-list').its('status').should('equal', 200);
    });

    it('should fail', () => {
        cy.request('https://gorest.co.in/public/v2/error').as('error');
        cy.get('@todo-list').its('status').should('equal', 200);
    });
});
