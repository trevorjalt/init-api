const express = require('express');
const InitPostService = require('./init-post-service');

const initPostRouter = express.Router();
const jsonBodyParser = express.json();

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
    
module.exports = initPostRouter;