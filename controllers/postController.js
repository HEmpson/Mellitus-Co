const { User } = require('../models/user')
const { Post } = require('../models/post')
const { deletePost } = require('../models/post')
const { downloadPost } = require('../models/post')
const { changePostname } = require('../models/post')
const DB = require('../models/index')
const mongoose = require('mongoose')

// Makes a new post
const makePost = async (req, res) => {
    const body = req.body
    console.log(req.user)
    console.log(body)
    const newPost = new Post({
        visibility: req.body.visibility,
        description: req.body.message,
        fileId: mongoose.Types.ObjectId(req.file.id),
        createdBy: req.user._id,
    })
    await newPost.save(async (err, post) => {
        await User.updateOne(
            { _id: req.user._id },
            { $push: { posts: post._id } }
        )
        return res.redirect('/dashboard')
    })
}

// Removes a post and returns the user back to the dashboard
const removePost = async (req, res) => {
    await deletePost(req.params.id, req.user)
    return res.redirect('/dashboard')
}

// Takes a "filename" and renames the file associated with the post
const renamePost = async (req, res) => {
    await changePostname(req.params.id, req.user, req.body.filename)
    return res.redirect('/dashboard')
}

// Downloads the file associated with a post then redirects back
const downloadPostController = async (req, res) => {
    await downloadPost(req.params.id, req.user)
    return res.redirect('/dashboard')
}

module.exports = {
    makePost,
    removePost,
    renamePost,
    downloadPostController,
}
