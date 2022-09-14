const express = require('express')
const postRouter = express.Router()
const { upload } = require('../models/index')
const { downloadFile } = require('../models/index')
const postController = require('../controllers/postController')

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.redirect('/')
    }
    // Otherwise, proceed to next middleware function
    return next()
}

// Set up role based authentication
const hasRole = (thisRole) => {
    return (req, res, next) => {
        if (req.user.role === thisRole) {
            return next()
        } else {
            res.redirect('/')
        }
    }
}

postRouter.post('/makePost', upload.single('file'), postController.makePost)

// Deletes a given post (provided the user has significant permissions)
postRouter.post('/removePost/:id', isAuthenticated, postController.removePost)

postRouter.post('/renamePost/:id', isAuthenticated, postController.renamePost)

postRouter.get(
    '/download/:id',
    isAuthenticated,
    postController.downloadPostController
)

module.exports = postRouter
