const passport = require('passport')
const express = require('express')
const postRouter = express.Router()
const { upload } = require('../models/index')
const { downloadFile } = require('../models/index')
const db = require('../models/db')
const mongoose = require('mongoose')


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


postRouter.post('/makePost', upload.single('file'), async (req, res) => {
    const body = req.body;
    const newPost = new db.Post({
        visibility: body.visibility,
        description: body.description,
        fileId: mongoose.Types.ObjectId(req.file.id),
    })
    await newPost.save()
    res.send(newPost)
})

postRouter.get('/download/:id', downloadFile)

module.exports = postRouter
