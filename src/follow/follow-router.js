const express = require('express')
const xss = require('xss')
const FollowService = require('./follow-service')
const { requireAuth } = require('../middleware/jwt-auth')

const followRouter = express.Router()
const jsonParser = express.json()

const serializeFollow = arr => {

    return arr.map(follow => {
        return {
            fullname: follow.fullname,
            username: follow.username,
            id: follow.id
        }
    })
}

//image type
//image file

followRouter
    .route('/')

    .get(requireAuth, async (req, res, next) => {
        try {
            const followedByUser = await FollowService.getAllFollows(
                req.app.get('db'), req.user.id)

            const followingUser = await FollowService.getAllFollowing(
                req.app.get('db'), req.user.id)

            return await res
                .status(200)
                .json({
                    followedByUser: serializeFollow(followedByUser),
                    followingUser: serializeFollow(followingUser)
                })
                .end()
        }
        catch (error) {
            next(error)
        }

    })

    .post(requireAuth, jsonParser, async (req, res, next) => {
        try {

            const { following_id } = req.body

            if (following_id === req.user.id) {
                return res
                    .status(400)
                    .json({ error: 'A user cannot follow themself' })

            }

            await FollowService.addFollow(
                req.app.get('db'),
                req.user.id,
                following_id

            )

            return res
                .status(204)
                .json({ message: `User ${req.user.id} followed ${following_id}` })
                .end()

        }
        catch (error) {
            next(error)
        }
    })

    .delete(requireAuth, jsonParser, async (req, res, next) => {

        try {

            const { following_id } = req.body

            if (following_id === req.user.id) {
                return res
                    .status(400)
                    .json({ error: 'A user cannot unfollow themself' })
                    .end()
            }

            await FollowService.removeFollow(
                req.app.get('db'),
                following_id,
                req.user.id
            )

            return res
                .status(201)
                .json({ message: `${req.user.id} unfollowed ${following_id}` })
                .end()
        }
        catch (error) {
            next(error)
        }
    })





module.exports = followRouter;