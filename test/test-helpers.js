const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
    return [
        {
            id: 1,
            fullname: 'tester1',
            username: 'test-user-1',
            user_password: 'password',
            email: 'email@email.com',
            about_user: 'test the things',
            user_stack: 'Backend',
            date_created: new Date().toISOString(),
        },
        {
            id: 2,
            fullname: 'tester2',
            username: 'test-user-2',
            user_password: 'password',
            email: 'email2@email.com',
            about_user: 'test the things',
            user_stack: 'Frontend',
            date_created: new Date().toISOString(),
        },
        {
            id: 3,
            fullname: 'tester3',
            username: 'test-user-3',
            user_password: 'password',
            email: 'email3@email.com',
            about_user: 'test the things',
            user_stack: 'Full Stack',
            date_created: new Date().toISOString(),
        }
    ]
}

function makeInitFixtures() {
    const testUsers = makeUsersArray()
    return { testUsers }
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.username,
        algorithm: 'HS256',
    })
    return `Bearer ${token}`
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        user_password: bcrypt.hashSync(user.user_password, 1)
    }))
    return db.into('user_information').insert(preppedUsers)
        .then(() =>
            db.raw(
                `SELECT setval('user_information_id_seq', ?)`,
                [users[users.length - 1].id],
            )
        )
}

// function seedInitTables(db, users, workouts, exercises, exercise_sets) {
//     // use a transaction to group the queries and auto rollback on any failure
//     return db.transaction(async trx => {
//         await seedUsers(trx, users)
//         await trx.into('benchmark_workout').insert(workouts)
//         // update the auto sequence to match the forced id values
//         await trx.raw(
//             `SELECT setval('benchmark_workout_id_seq', ?)`,
//             [workouts[workouts.length - 1].id],
//         )
//         //only insert exercises if there are some, also update the sequence counter
//         if (exercises) {
//             await trx.into('benchmark_exercise').insert(exercises)
//             await trx.raw(
//                 `SELECT setval('benchmark_exercise_id_seq', ?)`,
//                 [exercises[exercises.length -1].id],
//             )
//         }
//         //only insert sets if there are some, also update the sequence counter
//         if (exercise_sets) {
//             await trx.into('benchmark_set').insert(exercise_sets)
//             await trx.raw(
//                 `SELECT setval('benchmark_set_id_seq', ?)`,
//                 [exercise_sets[exercise_sets.length -1].id],
//             )
//         }
//     })
// }

function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(
            `TRUNCATE
                user_information,
                user_avatar,
                init_posts,
                following
            `
        )
        .then(() =>
            Promise.all([
                trx.raw(`ALTER SEQUENCE user_information_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE user_avatar_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE init_posts_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE following_id_seq minvalue 0 START WITH 1`),
                trx.raw(`SELECT setval('user_information_id_seq', 0)`),
                trx.raw(`SELECT setval('user_avatar_id_seq', 0)`),
                trx.raw(`SELECT setval('init_posts_id_seq', 0)`),
                trx.raw(`SELECT setval('following_id_seq', 0)`),
            ])
        )
    )
}

module.exports = {
    makeUsersArray,
    makeInitFixtures,
    makeAuthHeader,

    seedUsers,
    cleanTables,   
}