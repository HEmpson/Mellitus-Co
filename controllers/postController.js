const { User } = require('../models/user')
const { Post } = require('../models/post')
const mongoose = require('mongoose')

const makePost = async (req, res) => {
    const body = req.body
    const newPost = new Post({
        visibility: body.visibility,
        description: body.description,
        fileId: mongoose.Types.ObjectId(req.file.id),
    })
    await newPost.save(async (err, post) => {
        await User.updateOne(
            { _id: req.user._id },
            { $push: { posts: post._id } }
        )
    })

    res.send(newPost)
}

module.exports = {
    makePost,
}
