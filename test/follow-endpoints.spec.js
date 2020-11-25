const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const { expect } = require('chai')
const supertest = require('supertest')

describe('Follow Endpoints', function () {
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
            it(`Responds with 200 and an object with two keys, followedByUser and followingUser, with empty arrays for values`, async () => {
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

            //if someone is actually following
        })
    })

    describe(`POST /api/follow`, () => {

        beforeEach('insert users', () =>
            helpers.seedUsers(
                db,
                testUsers,
            )
        )

        describe('Given that a user is not already following another user', () => {

            it('Responds with a 200 and creates new row in followers table', () => {
                return supertest(app)
                    .post(`/api/follow`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .send({ following_id: testUsers[2].id })
                    .expect(200)
                    .catch(err => console.log(err))
            })
        })

        describe('Given that a user is already following a user', () => {

            beforeEach('Seed followers', () => helpers.seedFollowers(db, testFollowers))

            it('Responds with a 400', () => {
                return supertest(app)
                    .post(`/api/follow`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .send({ following_id: testUsers[1].id })
                    .expect(400)
                    .catch(err => console.log(err))
            })
        })

    })

    describe(`DELETE /api/follow`, () => {
        beforeEach('insert users', () =>
            helpers.seedUsers(
                db,
                testUsers,
            )
        )

        describe('Given that one user is following another', () => {

            beforeEach('Seed followers', () => helpers.seedFollowers(db, testFollowers))

            it('Responds with 201 and removes row from table', () => {
                return supertest(app)
                    .delete(`/api/follow`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .send({ following_id: testUsers[1].id })
                    .expect(200)
            })
        })

        describe('Given that a user is not following another user', () => {

            it('Responds with 400', () => {
                return supertest(app)
                    .delete(`/api/follow`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .send({ following_id: 5 })
                    .expect(400)
            })
        })

    })

})