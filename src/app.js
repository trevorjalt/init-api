const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const authRouter = require('./auth/auth-router')
const avatarRouter = require('./avatar/avatar-router')
const userRouter = require('./user/user-router')
const followRouter = require('./follow/follow-router')
const commentRouter = require('./comment/comment-router')

const app = express()
// const bodyParser = require('body-parser')

// app.use(bodyParser.json({limit: '10mb', extended: true}))
// app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test',
}))
app.use(cors())
app.use(helmet())

app.use('/api/auth', authRouter)
app.use('/api/avatar', avatarRouter)
app.use('/api/user', userRouter)
app.use('/api/follow', followRouter)
app.use('/api/comment', commentRouter)

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { messages: 'server error' } };
    } else {
        console.error(error)
        response = { message: error.message, error };
    }
    res.status(500).json(response);
})

module.exports = app