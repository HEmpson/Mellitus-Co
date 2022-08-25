const passport = require('passport')
const express = require('express')
const fileRouter = express.Router()
const { upload } = require('../models/index')
const { downloadFile } = require('../models/index')

fileRouter.post('/upload', upload.single('file'), (req, res) => {
    return res.status(200).send('File uploaded successfully')
})

fileRouter.get('/download/:id', downloadFile)

module.exports = fileRouter
