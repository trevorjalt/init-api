const express = require('express')
const xss = require('xss')
const FollowService = require('./follow-service')

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

followRouter
    .route('/')

    .get(async (req, res, next) => {
        try {
            const followedByUser = await FollowService.getAllFollows(
                req.app.get('db'), 1)

            const followingUser = await FollowService.getAllFollowing(
                req.app.get('db'), 1)

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

    .post(jsonParser, async (req, res, next) => {
        try {
            const { follower_id, user_id } = req.body

            await FollowService.addFollower(
                req.app.get('db'),
                follower_id,
                user_id
            )

            return res
                .status(204)
                .end()
        }
        catch (error) {
            next(error)
        }
    })

    .delete(async (req, res, next) => {
        try {
            const { follower_id, user_id } = req.body

            await FollowService.addFollower(
                req.app.get('db'),
                follower_id,
                user_id
            )
            return res
                .status(201)
                .end()
        }
        catch (error) {
            next(error)
        }
    })





module.exports = followRouter;