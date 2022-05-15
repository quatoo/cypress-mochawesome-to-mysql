interface Window { userId: any; }

describe('GET USERS data', () => {

    it('Get users', () => {
        cy.request('https://gorest.co.in/public/v2/users')
            .then((response) => {
                expect(response).property('status').to.equal(200);
                const body = (response.body)

                window.userId = body[0]["id"];
        });
    });

    it('Get user data', () => {
        cy.request(`https://gorest.co.in/public/v2/users/${window.userId}`).as('user');
        cy.get('@user').its('status').should('equal', 200);
    });
    
});
