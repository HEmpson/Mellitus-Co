const passport = require('passport')
const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/userController')

userRouter.post('/api/createAccount', userController.createAccountController)
userRouter.post('/addNewFriend', userController.addNewFriendController)

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
