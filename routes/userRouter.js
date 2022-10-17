const passport = require('passport')
const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/userController')
const { upload } = require('../models/index')
const postRouter = require('./postRouter')

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

// route to create a user account
userRouter.post('/api/createAccount', userController.createAccountController)

userRouter.post(
    '/api/createAdminAccount',
    userController.createAdminAccountController
)

// route to log into the application
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

//Logout Route
userRouter.get('/logout', isAuthenticated, (req, res) => {
    req.logOut((err) => {
        return res.redirect('/')
    })
})

// Route to change status message
userRouter.post(
    '/changeStatus/:id',
    isAuthenticated,
    userController.setStatusController
)

// Route to change display name
userRouter.post(
    '/changeDisplayName/:id',
    isAuthenticated,
    userController.setDisplayNameController
)

// Route to change profile description
userRouter.post(
    '/changeDescription/:id',
    isAuthenticated,
    userController.setDescriptionController
)

// Route to add new friends
userRouter.post(
    '/addNewFriend',
    isAuthenticated,
    userController.addNewFriendController
)

// Route to remove friends
userRouter.get(
    '/removeFriend/:id',
    isAuthenticated,
    userController.removeFriendsController
)

// Route to change password
userRouter.post(
    '/changePassword',
    isAuthenticated,
    userController.changePasswordController
)

// Route to block a specific user
userRouter.get(
    '/blockUser/:id',
    isAuthenticated,
    userController.blockUserController
)

// Route to unblock a specific user
userRouter.get(
    '/unblockUser/:id',
    isAuthenticated,
    userController.unblockUserController
)

// Post Route for uploading profile image
userRouter.post(
    '/uploadProfileImage',
    upload.single('file'),
    userController.uploadImageController
)

// Get Route for profile images
userRouter.get('/profileImage/:id', userController.getImageController)

module.exports = userRouter
