const express = require('express')
const categoryRouter = express.Router()
const categoryController = require('../controllers/categoryController')

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

// Route for handling creation of categories
categoryRouter.post(
    '/create',
    isAuthenticated,
    categoryController.createCategoryController
)

// Route for handling renaming of categories
categoryRouter.post(
    '/rename',
    isAuthenticated,
    categoryController.renameCategoryController
)

module.exports = categoryRouter
