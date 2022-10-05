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
appRouter.get('/profile/:id', isAuthenticated, appController.getProfile)
appRouter.get('/files/:id', isAuthenticated, appController.getFile)
appRouter.get('/categoryContents/:id', isAuthenticated, appController.getCategoryFiles)
appRouter.get('/friends', isAuthenticated, appController.getFriends)
appRouter.get('/allfiles/:id', isAuthenticated, appController.getAllFiles)
appRouter.get('/categories/:id', isAuthenticated, appController.getCategories)
appRouter.get('/registration', appController.getRegistration)
appRouter.get('/editProfile', appController.getEditProfile)

module.exports = appRouter
