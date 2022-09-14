const mongoose = require('mongoose')
const { User } = require('../models/user')

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
        options: { lean: true },
    })
    posts = posts.toObject()

    userPosts = posts.posts

    userPosts.sort((a, b) => {
        return b.dateCreated- a.dateCreated
    })

    return userPosts
}

// gets all the public posts
const getPublicPosts = async () => {
    
    publicPosts = Post.find({visibility: 'Public'})

    publicPosts.sort((a, b) => {
        return b.dateCreated- a.dateCreated
    })  
    
    return publicPosts
}
/*
// gets a user posts + their friends posts
const getFriendsPosts = async (user) => {
    
    for (i = 0; i < user.friends.length; i++){
        friend = user.friends[i]
        posts = await friend.populate({
            path: 'posts',
            options: { lean: true },
        })
        posts = posts.toObject()

        friendPosts = posts.posts



    }
}

*/
const Post = mongoose.model('Post', postSchema, 'post')

module.exports = {
    Post,
    getUserPosts,
    getPublicPosts,
    getFriendsPosts,
}
