const express = require('express')
const xss = require('xss')
const FollowService = require('./follow-service')
const { requireAuth } = require('../middleware/jwt-auth')

const followRouter = express.Router()
const jsonParser = express.json()

const serializeComment = comment => {

    return {
        id: comment.id,
        text: xss(comment.text),
        post_id: comment.post_id,
        user_id: comment.user_id,
        avatar: comment.avatar,
        username: comment.user_name

    }





}

