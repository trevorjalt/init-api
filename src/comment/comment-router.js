const express = require('express')
const xss = require('xss')
const CommentService = require('./comment-service')
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
            username: comment.username

        }
    });
}

/*ASK TREVOR WHERE I SHOULD RUN THE XSS ON THE COMMENT TEXT. BEFORE PUTTING IN DB??*/

commentRouter
    .route('/:post_id')
    .get(requireAuth, async (req, res, next) => {

        try {
            const comments = await CommentService.getCommentsForPost(
                req.app.get('db'),
                req.params.post_id
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
            let { text } = req.body;
            text = xss(text);

            await CommentService.insertComment(
                req.app.get('db'),
                req.user.id,
                req.params.post_id,
                text
            )

            const comm = await CommentService.getCommentsForPost(
                req.app.get('db'),
                req.params.post_id,
            )

            return res
                .status(200)
                .json(serializeComments(comm))
        }
        catch (error) {
            next(error)
        }
    })




module.exports = commentRouter;