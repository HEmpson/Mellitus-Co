const passport = require('passport')
const express = require('express')
const fileRouter = express.Router()
const { upload } = require('../models/index')
const { downloadFile } = require('../models/index')
const db = require('../models/db')
const mongoose = require('mongoose')

fileRouter.post('/makePost', upload.single('file'), async (req, res) => {
    const body = req.body;
    const newPost = new db.Post({
        visibility: body.visibility,
        description: body.description,
        fileId: mongoose.Types.ObjectId(req.file.id),
    })
    await newPost.save()
    res.send(newPost)
})

fileRouter.get('/download/:id', downloadFile)

module.exports = fileRouter
