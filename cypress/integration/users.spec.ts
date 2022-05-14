describe('GET USERS data', () =>{    
    it('Get users', () => {
        cy.request('https://gorest.co.in/public/v2/users').as('user');
        cy.get('@user').its('status').should('equal', 200);
    });

    it('Get user data', () => {
        cy.request('https://gorest.co.in/public/v2/users/100').as('user');
        cy.get('@user').its('status').should('equal', 200);
    });
});