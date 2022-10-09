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

userRouter.post('/api/createAccount', userController.createAccountController)

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
userRouter.post(
    '/blockUser/:id',
    isAuthenticated,
    userController.blockUserController
)

// Route to unblock a specific user
userRouter.post(
    '/unblockUser/:id',
    isAuthenticated,
    userController.unblockUserController
)

module.exports = userRouter
