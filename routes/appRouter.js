const express = require('express')
const appRouter = express.Router()
const appController = require('../controllers/appController')

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

// put routes here

appRouter.get('/', appController.getLoginPage)
appRouter.get('/dashboard', appController.getDashboard)
appRouter.get('/profile', appController.getProfile)
appRouter.get('/files', appController.getFile)
appRouter.get('/friends', appController.getFriends)
appRouter.get('/allfiles', appController.getAllFiles)
appRouter.get('/categories', appController.getCategories)

module.exports = appRouter
