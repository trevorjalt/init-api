const express = require('express')
const fs = require('fs')
const multer = require('multer')
const path = require('path')
const InitPostService = require('./init-post-service');
// const { DB_URL } = require('../config')
const { requireAuth } = require('../middleware/jwt-auth')

const initPostRouter = express.Router();
// const jsonBodyParser = express.json()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/uploads`);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + new Date().toISOString());
    }
})
  
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1 // allowed image size, set to 1MB
    }
})

initPostRouter
    .route('/upload')
    .post(requireAuth, [upload.single('imageRequest')], uploadPost)

initPostRouter
    .route('/download')
    .get(requireAuth, downloadPost)

const serializePost = (post) => {

    return {
        post_id: post.id,
        title: post.post_title,
        live_link: post.post_live_link,
        repository: post.post_repository,
        tech_stack: post.tech_stack,
        user_id: post.user_id,
        username: post.username,
        fullname: post.fullname,
        description: post.post_description
    }
}

async function uploadPost(req, res, next) {
    try { 
        
        // console.log('REQUEST REQUEST', req)
        // console.log('FILE FILE', req.file)
        console.log('BODY', req.body)
        
        const imgData = fs.readFileSync(req.file.path)

        const uploadData = {
            username: req.user.username,
            post_title: req.body.post_title,
            post_description: req.body.post_description,
            post_live_link: req.body.post_live_link,
            post_repository: req.body.post_repository,
            post_image_file: imgData,
            post_image_type: req.file.mimetype,
            tech_stack: req.body.tech_stack,
            date_created: req.body.date_created,           
        }

        uploadData.user_id = req.user.id

        const rows = await InitPostService.insertPost(
            req.app.get('db'),
            uploadData
        )

        console.log(rows[0]);

        fs.unlink(req.file.path, function(err) {
            if (err) {
                next(err)
                return
            }
            console.log('Temp Image Deleted')
            res.sendStatus(201)
        })
    } catch(error) {
        next(error)
    }
}

async function downloadPost(req, res, next) {
    try {
        const rows = await InitPostService.getUserPosts(
            req.app.get('db'),
            req.user.id
        )

        console.log('Page', req.query.page)
        console.log('Limit', req.query.limit)
        // START Pagination!!! Will convert this to a Helper Function so it can be used throughout the Server, if it will help
        // Page determines where to begin our query, limit is how many items to return
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        //We use these for exactly what you may imagine, to determine the beginning and ending of the query
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        //This begins empty, eventually it will be populated by only the data we are seeking
        const results = {};
        console.log('Rows', rows)
        //results.next tells us what the next page# is, but it won't be returned if we are at the end of the data
        if (endIndex < rows.length) {
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
        results.results = rows.slice(startIndex, endIndex);
        //END Pagination
        console.log('RESULTS', results)
        res.json(results);
    } catch(error) {
        next(error)
    }
}

// initPostRouter
//     .route('/')
//     .get((req, res) => {
//         const knexInstance = req.app.get('db');
//         InitPostService.getAllPosts(knexInstance)
//             .then(initPosts => {

//                 //START Pagination!!! Will convert this to a Helper Function so it can be used throughout the Server, if it will help
//                 //Page determines where to begin our query, limit is how many items to return
//                 const page = parseInt(req.query.page);
//                 const limit = parseInt(req.query.limit);

//                 //We use these for exactly what you may imagine, to determine the beginning and ending of the query
//                 const startIndex = (page - 1) * limit;
//                 const endIndex = page * limit;

//                 //This begins empty, eventually it will be populated by only the data we are seeking
//                 const results = {};

//                 //results.next tells us what the next page# is, but it won't be returned if we are at the end of the data
//                 if (endIndex < initPosts.length) {
//                     results.next = {
//                         page: page + 1,
//                         limit: limit,
//                     };
//                 };

//                 //results.previous tells us what the previous page# is, but it won't be returned if we are on the first page
//                 if (startIndex > 0) {
//                     results.previous = {
//                         page: page - 1,
//                         limit: limit,
//                     };
//                 };

//                 //Here's the most important bit. 
//                 //It slices everything and populates our results with only what we seek, i.e. the index we start at and what our limit is
//                 results.results = initPosts.slice(startIndex, endIndex);
//                 //END Pagination
//                 res.json(results);
//             })
//     });

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