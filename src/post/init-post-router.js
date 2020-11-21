const express = require('express');
const InitPostService = require('./init-post-service');

const { requireAuth } = require('../middleware/jwt-auth')
const initPostRouter = express.Router();
const jsonBodyParser = express.json();


const serializePost = (post) => {


    return {
        post_id: post.id,
        title: post.post_title,
        live_link: post.post_live_link,
        repository: post.post_repository,
        tech_stack: post.tech_stack,
        user_id: post.user_id,
        username: post.username,
        fullname: post.fullname
    }
}

initPostRouter
    .route('/')
    .get((req, res) => {
        const knexInstance = req.app.get('db');
        InitPostService.getAllPosts(knexInstance)
            .then(initPosts => {

                //START Pagination!!! Will convert this to a Helper Function so it can be used throughout the Server, if it will help
                //Page determines where to begin our query, limit is how many items to return
                const page = parseInt(req.query.page);
                const limit = parseInt(req.query.limit);

                //We use these for exactly what you may imagine, to determine the beginning and ending of the query
                const startIndex = (page - 1) * limit;
                const endIndex = page * limit;

                //This begins empty, eventually it will be populated by only the data we are seeking
                const results = {};

                //results.next tells us what the next page# is, but it won't be returned if we are at the end of the data
                if (endIndex < initPosts.length) {
                    results.next = {
                        page: page + 1,
                        limit: limit,
                    };
                };

                //results.previous tells us what the previous page# is, but it won't be returned if we are on the first page
                if (startIndex > 0) {
                    results.previous = {
                        page: page - 1,
                        limit: limit,
                    };
                };

                //Here's the most important bit. 
                //It slices everything and populates our results with only what we seek, i.e. the index we start at and what our limit is
                results.results = initPosts.slice(startIndex, endIndex);
                //END Pagination
                res.json(results);
            })
    });

initPostRouter
    .route('/:post_id')
    .get(requireAuth, async (req, res, next) => {

        try {
            const post = await InitPostService.getPostById(
                req.app.get('db'),
                req.params.post_id
            )

            return res
                .status(200)
                .json(serializePost(post))
                .end()

        }
        catch (error) {
            next(error)
        }



    })


module.exports = initPostRouter;