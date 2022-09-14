const passport = require('passport')
const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/userController')

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

userRouter.post('/api/createAccount', userController.createAccount)

userRouter.post(
    '/login',
    passport.authenticate('local', {
        failureRedirect: '/',
        failureFlash: true,
    }),
    (req, res) => {
        res.redirect('/dashboard')
    }
)

module.exports = userRouter
