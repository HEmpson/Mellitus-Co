const express = require('express')
const postRouter = express.Router()
const { upload } = require('../models/index')
const { downloadFile } = require('../models/index')
const postController = require('../controllers/postController')

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
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
            res.redirect('/login')
        }
    }
}

postRouter.post('/makePost', upload.single('file'), postController.makePost)

postRouter.get('/download/:id', downloadFile)

module.exports = postRouter
