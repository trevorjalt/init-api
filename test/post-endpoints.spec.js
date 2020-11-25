const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const { expect } = require('chai')
const supertest = require('supertest')

describe.skip('Post endpoints', function () {
    let db;

    const { testUsers } = helpers.makeInitFixtures()
    const testUser = testUsers[0]

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

    describe('GET /api/post/:post_id', function () {

        beforeEach('insert users', () =>
            helpers.seedUsers(
                db,
                testUsers,
            )
        )

        //gets post with same id as url
        //checks if post is object
        //with keys title, user_id, etc.

        //if there is no post with that id, should return 404





    })









})