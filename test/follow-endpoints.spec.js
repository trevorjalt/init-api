const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')
const { expect } = require('chai')
const supertest = require('supertest')

describe.only('Follow Endpoints', function () {
    let db;

    const { testUsers } = helpers.makeInitFixtures()
    const testUser = testUsers[0]

    const { testFollowers } = helpers.makeInitFixtures()

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


    describe(`GET /api/follow`, () => {

        beforeEach('insert users', () =>
            helpers.seedUsers(
                db,
                testUsers,
            )
        )

        describe('Given that a user has no followers and is following no users', function () {
            it(`Responds with 200 and an object with two X Y with empty arrays for values`, async () => {
                let res = await supertest(app)
                    .get(`/api/follow`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                expect(res.status).to.equal(200);
                expect(res.body).to.be.an('object')
                expect(res.body).to.include.all.keys('followedByUser', 'followingUser')
                expect(res.body.followedByUser).to.be.an('array')
                expect(res.body.followingUser).to.be.an('array')

            })
        })

        describe('Given that a user has followers and is following other users', function () {
            beforeEach('Seed followers', () => helpers.seedFollowers(db, testFollowers))

            it(`Responds with 200 and an object with keys followedByUser and followingUser with an array of objects as values`, async () => {
                let res = await supertest(app)
                    .get(`/api/follow`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                expect(res.status).to.equal(200);
                expect(res.body).to.be.an('object')
                expect(res.body).to.include.all.keys('followedByUser', 'followingUser')
                expect(res.body.followedByUser).to.be.an('array')
                expect(res.body.followedByUser[0]).to.be.an('object')
                expect(res.body.followedByUser[0]).to.include.all.keys('id', 'username', 'fullname')
                expect(res.body.followingUser).to.be.an('array')
                expect(res.body.followingUser[0]).to.be.an('object')
                expect(res.body.followingUser[0]).to.include.all.keys('id', 'username', 'fullname')


            })
        })
    })

    describe(`POST /api/follow`, () => {
        //beforeEach
        //seed users, following, followers

        //responds with 400 if user_id == id

        //user [0] follows user [1]
        //responds with 200 if not following
        //if follower is valid user and not following
        //and adds line to followers table

        //user [0] follows user [1]
        //responds with 400 if user already follows

    })

    describe(`DELETE /api/follow`, () => {
        //beforeEEach
        //seed users, followers, following
        //make fake followers table
        //have actual followers



        //responds with 400 if user is not following user
        //user [0] does not follow user[2]

        //user [0] follows usr [1]
        //responds with 200 if user is following
        //removes line from table





    })

})