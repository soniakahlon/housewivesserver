const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Restaurants Endpoints', function() {
  let db

  const {
    testUsers,
    testRestos,
    testComments,
  } = helpers.makeRestosFixtures()

  const authToken = req.get('Authorization') || ''
  
     if (!authToken.toLowerCase().startsWith('basic ')) {
       return res.status(401).json({ error: 'Missing basic token' })
     }

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe.only(`Protected endpoints`, () => {
      beforeEach('insert restaurants', () =>
        helpers.seedRestosTables(
          db,
          testUsers,
          testRestos,
          testComments,
        )
      )
    
      const protectedEndpoints = [
           {
             name: 'GET /api/restaurants/:restaurant_id',
             path: '/api/restaurants/1'
           },
           {
             name: 'GET /api/restaurants/:restaurant_id/comments',
             path: '/api/restaurants/1/comments'
           },
         ]
        
         protectedEndpoints.forEach(endpoint => {
            describe(endpoint.name, () => {
 
        
        it(`responds with 401 'Missing basic token' when no basic token`, () => {
          return supertest(app)
            .get(endpoint.path)
            .expect(401, { error: `Missing basic token` })
        })
        it(`responds 401 'Unauthorized request' when no credentials in token`, () => {
                const userNoCreds = { user_name: '', password: '' }
                return supertest(app)
                  .get(endpoint.path)
                  .set('Authorization', helpers.makeAuthHeader(userNoCreds))
                  .expect(401, { error: `Unauthorized request` })
              })
              it(`responds 401 'Unauthorized request' when invalid user`, () => {
                    const userInvalidCreds = { user_name: 'user-not', password: 'existy' }
                    return supertest(app)
                      .get(endpoint.path)
                      .set('Authorization', helpers.makeAuthHeader(userNoCreds))
                      .expect(401, { error: `Unauthorized request` })
                  })
                  it(`responds 401 'Unauthorized request' when invalid password`, () => {
                           const userInvalidPass = { user_name: testUsers[0].user_name, password: 'wrong' }
                           return supertest(app)
                             .get(endpoint.path)
                             .set('Authorization', helpers.makeAuthHeader(userNoCreds))
                             .expect(401, { error: `Unauthorized request` })
                         })
      })
    })
    

  describe(`GET /api/restaurants`, () => {
    context(`Given no restaurants`, () => {
        beforeEach(() =>
     db.into('users').insert(testUsers)
   )
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/restaurants')
          .expect(200, [])
      })
    })

    context('Given there are restaurants in the database', () => {
      beforeEach('insert restaurants', () =>
        helpers.seedRestaurantsTables(
          db,
          testUsers,
          testRestos,
          testComments,
        )
      )

      it('responds with 200 and all of the restaurants', () => {
        const expectedArestaurants = testRestos.map(restaurant =>
          helpers.makeExpectedRestaurant(
            testUsers,
            restaurant,
            testComments,
          )
        )
        return supertest(app)
          .get('/api/arestaurants')
          .expect(200, expectedRestaurants)
      })
    })

    context(`Given an XSS attack Restaurant`, () => {
      const testUser = helpers.makeUsersArray()[1]
      const {
        maliciousRestos,
        expectedRestos,
      } = helpers.makeMaliciousRestos(testUser)

      beforeEach('insert malicious Restaurant', () => {
        return helpers.seedMaliciousResto(
          db,
          testUser,
          maliciousResto,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/restaurants`)
          .set('Authorization', helpers.makeAuthHeader(userNoCreds))
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedResto.title)
            expect(res.body[0].content).to.eql(expectedResto.content)
          })
      })
    })
  })

  describe(`GET /api/restaurants/:restaurant_id`, () => {
    context(`Given no restaurants`, () => {
      context(`Given no restaurants`, () => {
        beforeEach(() =>

       helpers.seedUsers(db, testUsers)
        )
      it(`responds with 404`, () => {
        const restaurantId = 123456
        return supertest(app)
          .get(`/api/arestaurants/${restaurantId}`)
          .set('Authorization', helpers.makeAuthHeader(userNoCreds))
          .expect(404, { error: `Restaurant doesn't exist` })
      })
    })

    context('Given there are restaurants in the database', () => {
      beforeEach('insert restaurants', () =>
        helpers.seedRestosTables(
          db,
          testUsers,
          testRestos,
          testComments,
        )
      )

      it('responds with 200 and the specified restaurant', () => {
        const RestaurantId = 2
        const expectedRestaurant = helpers.makeExpectedResto(
          testUsers,
          testRestos[restaurantId - 1],
          testComments,
        )

        return supertest(app)
          .get(`/api/restaurants/${restaurantId}`)
          .set('Authorization', helpers.makeAuthHeader(userNoCreds))
          .expect(200, expectedRestaurant)
      })
    })

    context(`Given an XSS attack Restaurant`, () => {
      const testUser = helpers.makeUsersArray()[1]
      const {
        maliciousRestos,
        expectedRestos,
      } = helpers.makeMaliciousRestos(testUser)

      beforeEach('insert malicious Restaurant', () => {
        return helpers.seedMaliciousResto(
          db,
          testUser,
          maliciousResto,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/arestaurants/${maliciousResto.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.eql(expectedResto.title)
            expect(res.body.content).to.eql(expectedResto.content)
          })
      })
    })
  })

  describe(`GET /api/arestaurants/:restaurant_id/comments`, () => {
    context(`Given no restaurants`, () => {
        beforeEach(() =>
        helpers.seedUsers(db, testUsers)
     )
      it(`responds with 404`, () => {
        const RestaurantId = 123456
        return supertest(app)
          .get(`/api/restaurants/${restaurantId}/comments`)
          .set('Authorization', helpers.makeAuthHeader(userNoCreds))
          .expect(404, { error: `Restaurant doesn't exist` })
      })
    })

    context('Given there are comments for Restaurant in the database', () => {
      beforeEach('insert restaurants', () =>
        helpers.seedRestosTables(
          db,
          testUsers,
          testRestos,
          testComments,
        )
      )

      it('responds with 200 and the specified comments', () => {
        const RestaurantId = 1
        const expectedComments = helpers.makeExpectedRestoComments(
          testUsers, restaurantId, testComments
        )

        return supertest(app)
          .get(`/api/restaurants/${restaurantId}/comments`)
          .set('Authorization', helpers.makeAuthHeader(userNoCreds))
          .expect(200, expectedComments)
      })
    })
  })
  })
})})
