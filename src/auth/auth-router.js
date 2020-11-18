const express = require('express')
const AuthService = require('./auth-service')
const { requireAuth } = require('../middleware/jwt-auth')

const authRouter = express.Router()
const jsonBodyParser = express.json()

authRouter
    .route('/login')
    .post(jsonBodyParser, async (req, res, next) => {
        const { username, user_password } = req.body
        const loginUser = { username, user_password }

        for (const [key, value] of Object.entries(loginUser))
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })

        try {
            const dbUser = await AuthService.getUserWithUserName(
                req.app.get('db'),
                loginUser.username
            )

          if (!dbUser)
              return res.status(400).json({
                  error: 'Invalid username or password',
              })

          const compareMatch = await AuthService.comparePasswords(
              loginUser.user_password,
              dbUser.user_password
          )

          if (!compareMatch)
              return res.status(400).json({
                  error: 'Invalid username or password',
              })

          const sub = dbUser.username
          const payload = {
              user_id: dbUser.id,
              fullname: dbUser.fullname,
              email: dbUser.email,
            //   profile_photo: dbUser.profile_photo,
              about_user: dbUser.about_user,
              user_stack: dbUser.user_stack
          }
          res.send({
              authToken: AuthService.createJwt(sub, payload),
          })
        } catch (error) {
            next(error)
        }
    })

    .put(requireAuth, (req, res) => {
        const sub = req.user.username
        const payload = {
            user_id: req.user.id,
            fullname: req.user.fullname,
            email: req.user.email,
            // profile_photo: req.user.profile_photo,
            about_user: req.user.about_user,
            user_stack: req.user.user_stack
        }
        res.send({
            authToken: AuthService.createJwt(sub, payload),
        })
    })

module.exports = authRouter