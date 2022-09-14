const express = require('express')
const appRouter = express.Router()
const appController = require('../controllers/appController')

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

// put routes here

appRouter.get('/', appController.getLoginPage)
appRouter.get('/dashboard', isAuthenticated, appController.getDashboard)
appRouter.get('/profile', isAuthenticated, appController.getProfile)
appRouter.get('/files', isAuthenticated, appController.getFile)
appRouter.get('/friends', isAuthenticated, appController.getFriends)
appRouter.get('/allfiles', isAuthenticated, appController.getAllFiles)
appRouter.get('/categories', isAuthenticated, appController.getCategories)
appRouter.get('/registration', appController.getRegistration)

module.exports = appRouter
