const express = require('express')
const path = require('path')
const UserService = require('./user-service')
const { requireAuth } = require('../middleware/jwt-auth')

const userRouter = express.Router()
const jsonBodyParser = express.json()

userRouter
    .route('/')
    .post(jsonBodyParser, registerUser)

userRouter
    .route('/:user_id')
    .all(requireAuth)
    .get(requireAuth, verifyUserExists, getUser)
    

async function registerUser(req, res, next) {
    try { 
        const { user_password, email, username, nickname } = req.body

        for (const field of ['user_password', 'email', 'username'])
            if (!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
        
        const passwordError = await UserService.validatePassword(user_password)

        if (passwordError)
                return await res.status(400).json({ error: passwordError })

        const emailError = await UserService.validateEmail(email)

        if (emailError)
                return await res.status(400).json({ error: emailError })
        
        const emailRegistered = await UserService.hasUserWithUserEmail(
            req.app.get('db'),
            email
        )

        if (emailRegistered)
            return await res.status(400).json({ error: `Email is already associated with an user account` })
        
        const userRegistered = await UserService.hasUserWithUserName(
            req.app.get('db'),
            username
        )

        if (userRegistered)
            return await res.status(400).json({ error: `Username already taken` })

        const hashedPassword = await UserService.hashPassword(user_password)

        const newUser = {
            username,
            user_password: hashedPassword,
            email,
            nickname,
            date_created: 'now()',
        }

        await UserService.insertUser(
            req.app.get('db'),
            newUser
        )
            .then(user => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                    .json(UserService.serializeUser(user))
            })        
    } catch(error) {
        next(error)
    }
}

async function verifyUserExists(req, res, next) {
    try {
        const user = await UserService.getById(
            req.app.get('db'),
            req.params.user_id
        )

        if (!user)
            return await res.status(404).json({
                error: `User not found`
            })

        res.user = user
        next()
    } catch (error) {
        next(error)
    }
}

async function getUser(req, res) {
    try {
        await res.json(UserService.serializeUser(res.user))
    } catch {}
}

module.exports = userRouter