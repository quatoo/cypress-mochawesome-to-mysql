describe('GET COMMENTS', () =>{    
    it('Get all comments', () => {
        cy.request('https://gorest.co.in/public/v2/comments').as('comments');
        cy.get('@comments').its('status').should('equal', 200);
    });

    it('Get comments in a post', () => {
        cy.request('https://gorest.co.in/public/v2/posts/100/comments').as('comments');
        cy.get('@comments').its('status').should('equal', 200);
    });
});