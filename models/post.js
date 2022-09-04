const mongoose = require('mongoose')
const {User} = require('../models/user')

const postSchema = new mongoose.Schema({
    visibility: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null,
    },
    description: String,
    fileId: mongoose.Schema.Types.ObjectId,
    dateCreated: {
        type: Date,
        default: new Date(),
    },
})

// gets all the posts of a single user
const getUserPosts = async (user) => {
    
    posts = await user.populate({
        path: 'posts',
        options: { lean: true}
    })
    posts = posts.toObject()

    userPosts = posts.posts

    return userPosts

}


// gets all the posts of a single user and posts of all their friends
const getAllPosts = async (user) => {
    allPosts = []

    allPosts.push(user.posts)

    for (var i = 0; i < user.friends.length; i++){
        allPosts.push(getUserPosts(user.friends[i]))
    }

}

const Post = mongoose.model('Post', postSchema, 'post')

module.exports = {
    Post,
    getUserPosts,
    getAllPosts,
}