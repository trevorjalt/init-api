const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const { expect } = require('chai')
const supertest = require('supertest')



describe.only('Comment endpoints', function () {
    let db;

    const { testUsers, testComments, testPosts } = helpers.makeInitFixtures()
    const testUser = testUsers[0]

    console.log('TEST COMMENTS', testComments, 'TEST POSTS', testPosts)

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

    describe('GET /api/comment/:post_id', function () {

        beforeEach('insert users', () =>
            helpers.seedUsers(
                db,
                testUsers,
            )
        )

        beforeEach('insert posts', () => {
            helpers.seedPosts(
                db,
                testPosts
            )
        })

        beforeEach('insert comments', () => {
            helpers.seedComments(
                db,
                testComments
            )
        })

        it('Responds with a 200 and an array of comments', async () => {
            let res = await supertest(app)
                .get(`/api/comment/1`)
                .set('Authorization', helpers.makeAuthHeader(testUser))

            console.log('Res Body', res.body)
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array')
            expect(res.body[0]).to.be.an('object')
            expect(res.body[0]).to.include.all.keys('text', 'user_id', 'post_id')

        })
    })

    describe('POST /api/comment/:post_id', function () {









    })


})

//teaching 12 to 14 year old talk about is the problem
//tools to solve problems

