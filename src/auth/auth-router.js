const express = require('express')
const AuthService = require('./auth-service')
const { requireAuth } = require('../middleware/jwt-auth')

const authRouter = express.Router()
const jsonBodyParser = express.json()

authRouter
    .route('/login')
    .post(jsonBodyParser, postUserLogin)

authRouter
    .route('/refresh')
    .post(requireAuth, refresh)

async function postUserLogin(req, res, next) {
    try {
        const { username, user_password } = req.body
        const loginUser = { username, user_password }
    
        for (const [key, value] of Object.entries(loginUser))
        if (value == null)
            return res.status(400).json({
            error: `Missing '${key}' in request body`
            })
    
        const user = await AuthService.getUserWithUserName(
        req.app.get('db'),
        loginUser.username
        )
    
        if (!user)
        return await res.status(400).json({
            error: 'Invalid username or password',
        })
        
        let compareMatch = await AuthService.comparePasswords(loginUser.user_password, user.user_password)
    
        if (!compareMatch)
            return await res.status(400).json({
            error: 'Invalid username or password',
                })
        
        const sub = user.username
        const payload = { user_id: user.id }
            
        res.send({
        authToken: AuthService.createJwt(sub, payload),
        })
    
            
    } catch (error) {
        next(error)
        }
    }
    
async function refresh(req, res) {
    try {
        const sub = req.user.username
        const payload = { user_id: req.user.id }
        await res.send({
        authToken: AuthService.createJwt(sub, payload),
        })
    } catch {}
}
    
module.exports = authRouter