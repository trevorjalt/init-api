const express = require('express')
const xss = require('xss')
const CommentService = require('./follow-comment')
const { requireAuth } = require('../middleware/jwt-auth');


const commentRouter = express.Router();
const jsonParser = express.json()

const serializeComments = comments => {
    return comments.map(comment => {
        return {
            id: comment.id,
            text: xss(comment.text),
            user_id: comment.user_id,
            date_created: comment.date_created,
            avatar: comment.avatar,
            username: comment.user_name

        }
    })
}

/*ASK TREVOR WHERE I SHOULD RUN THE XSS ON THE COMMENT TEXT. BEFORE PUTTING IN DB??*/

commentRouter
    .route('/')
    .get(requireAuth, jsonParser, async (req, res, next) => {
        const { post_id } = req.body
        try {
            const comments = await CommentService.getCommentsForPost(
                req.app.get('db'),
                post_id
            )

            return res
                .status(200)
                .json(serializeComments(comments))
                .end()
        }

        catch (error) {
            next(error)

        }

    })

    .post(requireAuth, jsonParser, async (req, res, next) => {
        try {
            const { comment_text, post_id } = req.body;
            const text = xss(comment_text);

            await CommentService.insertComment(
                req.app.get('db'),
                req.user.id,
                post_id,
                text
            )

            return res
                .status(204)
                .json({ message: 'comment posted' })
                .end()
        }

        catch (error) {
            next(error)
        }
    })



