const mongoose = require('mongoose')
const { User } = require('./user')
const db = require('./index')

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

const Post = mongoose.model('Post', postSchema, 'post')

// gets all the posts of a single user
const getUserPosts = async (user) => {
    posts = await user.populate({
        path: 'posts',
        options: { lean: true },
    })
    posts = posts.toObject()

    userPosts = posts.posts

    userPosts.sort((a, b) => {
        return b.dateCreated - a.dateCreated
    })

    return userPosts
}

// gets all the posts of a single user and posts of all their friends
const getPublicPosts = async () => {
    publicPosts = Post.find({ visibility: 'Public' })

    publicPosts.sort((a, b) => {
        return b.dateCreated - a.dateCreated
    })

    return publicPosts
}

// Removes a post from a user's post list
const delistPost = async (post) => {
    const userId = post.createdBy
    await User.updateOne({ _id: userId }, { $pull: { posts: post._id } })
}

// Deletes a post and its associated file
const deletePost = async (postId) => {
    const post = await Post.findOne({ _id: postId })
    try {
        const fileId = post.fileId
        if (fileId) {
            await db.deleteFile(fileId)
            await Post.deleteOne({ _id: postId })
            await delistPost(post)
        } else {
            console.log('Error: Failed to find post')
        }
    } catch (err) {
        console.log('Error: Failed to delete post')
    }
}

module.exports = {
    Post,
    getUserPosts,
    getPublicPosts,
    deletePost,
}
