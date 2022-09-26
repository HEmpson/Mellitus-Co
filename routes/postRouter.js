const express = require('express')
const postRouter = express.Router()
const { upload } = require('../models/index')
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

postRouter.post(
    '/makePost',
    upload.single('file'),
    postController.makePostController
)

// Deletes a given post (provided the user has significant permissions)
postRouter.post(
    '/removePost/:id',
    isAuthenticated,
    postController.removePostController
)

// Post Route for renaming posts/files
postRouter.post(
    '/renamePost/:id',
    isAuthenticated,
    postController.renamePostController
)

// Post Route for assigning posts to a category/deassigning a post
postRouter.post(
    '/assignToCategory/:id',
    isAuthenticated,
    postController.assignToCategoryController
)

// Post Route for changing the visibility of a post
postRouter.post(
    '/changeVisibility/:id',
    isAuthenticated,
    postController.changeVisibilityController
)

// Post route for post search bar
postRouter.post(
    '/getPosts',
    isAuthenticated,
    postController.getPostsLiveController
)

// Get route for downloading the files
postRouter.get(
    '/download/:id',
    isAuthenticated,
    postController.downloadPostController
)

module.exports = postRouter
