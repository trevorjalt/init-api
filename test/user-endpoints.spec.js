// const knex = require('knex')
// const bcrypt = require('bcryptjs')
// const app = require('../src/app')
// const helpers = require('./test-helpers')
// const { expect } = require('chai')
// const supertest = require('supertest')

// describe.skip('Users Endpoints', function() {
//     let db

//     const { testUsers } = helpers.makeWorkoutsFixtures()
//     const testUser = testUsers[0]

//     before('make knex instance', () => {
//         db = knex({
//             client: 'pg',
//             connection: process.env.TEST_DB_URL,
//         })
//         app.set('db', db)
//     })

//     after('disconnect from db', () => db.destroy())

//     before('cleanup', () => helpers.cleanTables(db))

//     afterEach('cleanup', () => helpers.cleanTables(db))

//     describe(`POST /api/user`, () => {
//         context(`User Validation`, () => {
//             beforeEach('insert users', () =>
//                 helpers.seedUsers(
//                     db,
//                     testUsers,
//                 )
//             )
            
//             const requiredFields = ['username', 'user_password', 'email']

//             requiredFields.forEach(field => {
//                 const registerAttemptBody = {
//                     username: 'test username',
//                     user_password: 'test password',
//                     email: 'email@email.com',
//                     nickname: 'test nickname',
//                 }

//                 it(`responds with 400 required error when '${field}' is missing`, () => {
//                     delete registerAttemptBody[field]
    
//                     return supertest(app)
//                         .post('/api/user')
//                         .send(registerAttemptBody)
//                         .expect(400, {
//                             error: `Missing '${field}' in request body`,
//                         })
//                 })
//             })

//             it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
//                 const userShortPassword = {
//                     username: 'test username',
//                     user_password: '1234567',
//                     email: 'test@test.com',
//                 }
//                 return supertest(app)
//                     .post('/api/user')
//                     .send(userShortPassword)
//                     .expect(400, { error: `Password must be longer than 8 characters` })
//             })
    
//             it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
//                 const userLongPassword = {
//                     username: 'test username',
//                     user_password: '*'.repeat(73),
//                     email: 'test@test.com',
//                 }
//                 return supertest(app)
//                     .post('/api/user')
//                     .send(userLongPassword)
//                     .expect(400, { error: `Password must be less than 72 characters` })
//             })
    
//             it(`responds 400 error when password starts with spaces`, () => {
//                 const userPasswordStartsSpaces = {
//                     username: 'test username',
//                     user_password: ' 1Aa!2Bb@',
//                     email: 'test@test.com',
//                 }
//                 return supertest(app)
//                     .post('/api/user')
//                     .send(userPasswordStartsSpaces)
//                     .expect(400, { error: `Password must not start or end with empty spaces` })
//             })
    
//             it(`responds 400 error when password ends with spaces`, () => {
//                 const userPasswordEndsSpaces = {
//                     username: 'test username',
//                     user_password: '1Aa!2Bb@ ',
//                     email: 'test@test.com',
//                 }
//                 return supertest(app)
//                     .post('/api/user')
//                     .send(userPasswordEndsSpaces)
//                     .expect(400, { error: `Password must not start or end with empty spaces` })
//             })
    
//             it(`responds 400 error when password isn't complex enough`, () => {
//                 const userPasswordNotComplex = {
//                     username: 'test username',
//                     user_password: '11AAaabb',
//                     email: 'test@test.com',
//                 }
//                 return supertest(app)
//                     .post('/api/user')
//                     .send(userPasswordNotComplex)
//                     .expect(400, { error: `Password must contain 1 upper case, lower case, number and special character` })
//             })

//             it(`responds 400 error when email is not a valid address`, () => {
//                 const emailInvalidFormat = {
//                     username: 'test username',
//                     user_password: '11AAaab!',
//                     email: 'incorrect',
//                 }
//                 return supertest(app)
//                     .post('/api/user')
//                     .send(emailInvalidFormat)
//                     .expect(400, { error: `Email must be a valid address`})

//             })
    
//             it(`responds 400 'Username already taken' when username isn't unique`, () => {
//                 const duplicateUser = {
//                     username: testUser.username,
//                     user_password: '11AAaa!!',
//                     email: 'test@test.com',
//                 }
//                 return supertest(app)
//                     .post('/api/user')
//                     .send(duplicateUser)
//                     .expect(400, { error: `Username already taken` })
//             })

//             it(`responds 400 'Email is already associated with an user account' when email isn't unique`, () => {
//                 const duplicateUser = {
//                     username: 'test username',
//                     user_password: '11AAaa!!',
//                     email: testUser.email,
//                 }
//                 return supertest(app)
//                     .post('/api/user')
//                     .send(duplicateUser)
//                     .expect(400, { error: `Email is already associated with an user account` })
//             })

//             context(`Happy path`, () => {
//                 it(`responds 201, serialized user, storing bcryped password`, () => {
//                     const newUser = {
//                         username: 'test user_name',
//                         user_password: '11AAaa!!',
//                         email: 'test@test.com',
//                     }
//                     return supertest(app)
//                         .post('/api/user')
//                         .send(newUser)
//                         .expect(201)
//                         .expect(res => {
//                             expect(res.body).to.have.property('id')
//                             expect(res.body.username).to.eql(newUser.username)
//                             expect(res.body.email).to.eql(newUser.email)
//                             expect(res.body.nickname).to.eql('')
//                             expect(res.body).to.not.have.property('user_password')
//                             expect(res.headers.location).to.eql(`/api/user/${res.body.id}`)
//                             const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
//                             const actualDate = new Date(res.body.date_created).toLocaleString()
//                             expect(actualDate).to.eql(expectedDate)
//                         })
//                         .expect(res =>
//                             db
//                                 .from('benchmark_user')
//                                 .select('*')
//                                 .where({ id: res.body.id })
//                                 .first()
//                                 .then(row => {
//                                     expect(row.username).to.eql(newUser.username)
//                                     expect(row.email).to.eql(newUser.email)
//                                     expect(row.nickname).to.eql(null)
//                                     const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
//                                     const actualDate = new Date(row.date_created).toLocaleString()
//                                     expect(actualDate).to.eql(expectedDate)
    
//                                     return bcrypt.compare(newUser.user_password, row.user_password)
//                                 })
//                                 .then(compareMatch => {
//                                     expect(compareMatch).to.be.true
//                                 })
//                             )
//                 })
//             })
//         })
//     })
// })