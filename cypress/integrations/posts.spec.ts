describe('GET POSTS', () =>{    
    it('Get all posts', () => {
        cy.request('https://gorest.co.in/public/v2/posts').as('posts');
        cy.get('@posts').its('status').should('equal', 200);
    });

    it('Get posts created by user', () => {
        cy.request('https://gorest.co.in/public/v2/users/100/posts').as('posts');
        cy.get('@posts').its('status').should('equal', 200);
    });
});