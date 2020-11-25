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

            let isFollowing = await FollowService.isFollowing(
                req.app.get('db'),
                following_id,
                req.user.id
            )

            if (isFollowing) {
                return res
                    .status(400)
                    .json({ error: 'user is already following' })
            }

            else {
                await FollowService.addFollow(
                    req.app.get('db'),
                    req.user.id,
                    following_id
                )

                const following = await FollowService.getAllFollows(
                    req.app.get('db'),
                    req.user.id)

                return res
                    .status(200)
                    .json(following)


            }
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

            }

            const isFollowing = await FollowService.isFollowing(
                req.app.get('db'),
                following_id,
                req.user.id
            )

            if (!isFollowing) {
                return res
                    .status(400)
                    .end()
            }

            else {
                await FollowService.removeFollow(
                    req.app.get('db'),
                    following_id,
                    req.user.id
                )
                const following = await FollowService.getAllFollows(
                    req.app.get('db'),
                    req.user.id)


                return res
                    .status(200)
                    .json(serializeFollow(following))

            }
        }
        catch (error) {

            next(error)
        }
    })





module.exports = followRouter;
