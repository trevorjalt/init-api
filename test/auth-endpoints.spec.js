const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')

describe('Auth Endpoints', function () {
    let db

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


    describe('POST /api/auth/login', () => {
        beforeEach('insert users', () =>
            helpers.seedUsers(
                db,
                testUsers,
            )
        )

        const requiredFields = ['username', 'user_password']

        requiredFields.forEach(field => {
            const loginAttemptBody = {
                username: testUser.username,
                user_password: testUser.user_password,
            }

            it(`responds with 400 required error when '${field}' is missing`, () => {
                delete loginAttemptBody[field]

                return supertest(app)
                    .post('/api/auth/login')
                    .send(loginAttemptBody)
                    .expect(400, {
                        error: `Missing '${field}' in request body`,
                    })
            })

            it(`responds 400 'Invalid username or password' when bad username`, () => {
                const userInvalidUsername = { username: 'user-not', user_password: 'existy' }
                return supertest(app)
                    .post('/api/auth/login')
                    .send(userInvalidUsername)
                    .expect(400, { error: `Invalid username or password` })
            })

            it(`responds 400 'Invalid username or password' when bad password`, () => {
                const userInvalidPassword = { username: testUser.username, user_password: 'incorrect' }
                return supertest(app)
                    .post('/api/auth/login')
                    .send(userInvalidPassword)
                    .expect(400, { error: `Invalid username or password` })

            })

            it(`responds with 200 and JWT auth token using secret when valid credentials`, () => {
                const userValidCredentials = {
                    username: testUser.username,
                    user_password: testUser.user_password,
                }
                const expectedToken = jwt.sign(
                    {
                        user_id: testUser.id,
                        fullname: testUser.fullname,
                        email: testUser.email,
                        about_user: testUser.about_user,
                        user_stack: testUser.user_stack
                    },
                    process.env.JWT_SECRET,
                    {
                        subject: testUser.username,
                        expiresIn: process.env.JWT_EXPIRY,
                        algorithm: 'HS256',
                    }
                )
                return supertest(app)
                    .post('/api/auth/login')
                    .send(userValidCredentials)
                    .expect(200, {
                        authToken: expectedToken,
                    })
            })
        })
    })
})