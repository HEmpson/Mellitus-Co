const mongoose = require('mongoose')
const { User } = require('./user')
const DB = require('./index')

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

// gets all the public posts
const getPublicPosts = async () => {
    publicPosts = Post.find({ visibility: 'Public' })

    publicPosts.sort((a, b) => {
        return b.dateCreated - a.dateCreated
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

// Removes a post from a user's post list
const delistPost = async (post) => {
    const userId = post.createdBy
    await User.updateOne({ _id: userId }, { $pull: { posts: post._id } })
}

// Checks if the given user has permission to edit/delete a given post
const hasEditPermissions = (post, user) => {
    if (user) {
        console.log(post.createdBy)
        if (user._id.equals(post.createdBy) || user.role === 'Admin') {
            return true
        }
        return false
    }
    return false
}

// Deletes a post and its associated file, checking if the associated user has permission to delete that post
const deletePost = async (postId, user) => {
    try {
        const post = await Post.findOne({ _id: postId })
        if (hasEditPermissions(post, user)) {
            try {
                const fileId = post.fileId
                if (fileId) {
                    await DB.deleteFile(fileId)
                    await Post.deleteOne({ _id: postId })
                    await delistPost(post)
                } else {
                    console.log('Error: Failed to find post')
                }
            } catch (err) {
                console.log('Error: Failed to delete post')
            }
        }
    } catch (err) {
        console.log(err)
    }
}

// Checks if user has permission to rename the post and renames it if so
const changePostname = async (postId, user, filename) => {
    try {
        const post = await Post.findOne({ _id: postId })
        if (hasEditPermissions(post, user)) {
            try {
                const fileId = post.fileId
                if (fileId) {
                    await DB.renameFile(fileId, filename)
                } else {
                    console.log('Error: Failed to find post')
                }
            } catch (err) {
                console.log('Error: Failed to rename post')
            }
        }
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    Post,
    getUserPosts,
    getPublicPosts,
    deletePost,
    changePostname,
}
