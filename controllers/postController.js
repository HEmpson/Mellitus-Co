const { User } = require('../models/user')
const { Post } = require('../models/post')
const mongoose = require('mongoose')

// Makes a new post
const makePost = async (req, res) => {
    const body = req.body
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

module.exports = {
    makePost,
}
