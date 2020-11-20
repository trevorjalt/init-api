const express = require('express')
const fs = require('fs')
const multer = require('multer')
const path = require('path')
const AvatarService = require('./avatar-service')
// const { DB_URL } = require('../config')
const { requireAuth } = require('../middleware/jwt-auth')

const avatarRouter = express.Router()
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

avatarRouter
    .route('/upload')
    .post(requireAuth, [upload.single('imageRequest')], uploadAvatar)

avatarRouter
    .route('/download')
    .get(requireAuth, downloadAvatar)

async function uploadAvatar(req, res, next) {
    try { 
        
        console.log('REQUEST REQUEST', req)
        console.log('FILE FILE', req.file)
        
        const imgData = fs.readFileSync(req.file.path)

        const uploadData = {
            name: req.body.someText,
            img_type: req.file.mimetype,
            img_file: imgData
        }

        uploadData.user_id = req.user.id

        const rows = await AvatarService.insertAvatar(
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

async function downloadAvatar(req, res, next) {
    try {
        const rows = await AvatarService.getAvatar(
            req.app.get('db'),
            req.user.id
        )

        console.log('RESPONSE', res)
        res.json(rows)
    } catch(error) {
        next(error)
    }
}

// async function verifyAvatarExists(req, res, next) {
//     try {
//         const currentAvatar = await AvatarService.getAvatar(
//             req.app.get('db'),
//             req.user.id
//         )

//         const avatarRequest = req
//         if (!currentAvatar) {
//            next(uploadAvatar(avatarRequest))
//         }
        
//     } catch (error) {
//         next(error)
//     }
// }

// async function getUser(req, res, next) {
//     try {
//         await res.json(UserService.serializeUser(res.user))

//         next()
//     } catch (error) {
//         next(error)
//     }
// }

module.exports = avatarRouter