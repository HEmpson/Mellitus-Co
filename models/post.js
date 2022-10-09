const mongoose = require('mongoose')
const { User } = require('./user')
const { hasCategoryEditPermissions, Category } = require('../models/category')
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
    filename: String,
    dateCreated: {
        type: Date,
        default: new Date(),
    },
})

const Post = mongoose.model('Post', postSchema, 'post')

// Gets all the posts in a list which are visible to a user
const filterVisiblePosts = async (posts, user) => {
    try {
        const filteredPosts = []
        for (let i = 0; i < posts.length; i++) {
            let currentPost = posts[i]
            let poster = await User.findOne({
                _id: currentPost.createdBy,
            }).lean()
            if (
                hasPostDownloadPermissions(currentPost, user) &&
                !poster.blocked
            ) {
                currentPost.hasEditPermissions = hasPostEditPermissions(
                    currentPost,
                    user
                )
                filteredPosts[filteredPosts.length] = currentPost
            }
        }
        return filteredPosts
    } catch (err) {
        console.log(err)
        return []
    }
}

// gets all the posts of a single user
const getUserPosts = async (user, requestingUser) => {
    let posts = await user.populate({
        path: 'posts',
        options: { lean: true },
    })
    posts = posts.toObject()

    let userPosts = posts.posts

    let filteredPosts

    // Filter visible posts and get permission status of a post
    if (requestingUser) {
        filteredPosts = await filterVisiblePosts(userPosts, requestingUser)
    } else {
        filteredPosts = await filterVisiblePosts(userPosts, user)
    }

    filteredPosts.sort((a, b) => {
        return b.dateCreated - a.dateCreated
    })

    return filteredPosts
}

// gets all the public posts
const getPublicPosts = async (user) => {
    publicPosts = await Post.find({ visibility: 'Public' }).lean()

    publicPosts = await filterVisiblePosts(publicPosts, user)

    publicPosts.sort((a, b) => {
        return b.dateCreated - a.dateCreated
    })

    return publicPosts
}

// gets a user posts + their friends posts
const getFriendsPosts = async (user, requestingUser) => {
    allPosts = await getUserPosts(user, requestingUser) // gets the logged in users posts

    // iterate over all friends add their posts into a array
    for (i = 0; i < user.friends.length; i++) {
        friend = await User.findOne({ _id: user.friends[i] })

        let posts = await friend.populate({
            path: 'posts',
            options: { lean: true },
        })
        posts = posts.toObject()

        friendPosts = posts.posts

        // now iterate through that array and check whether the logged in user can see the post
        for (j = 0; j < friendPosts.length; j++) {
            if (friendPosts[j].visibility === 'Friends') {
                allPosts.push(friendPosts[j])
            }
        }
    }

    // filter allPosts and get filename and edit permission status
    allPosts = await filterVisiblePosts(allPosts, requestingUser)

    // finally sort
    allPosts.sort((a, b) => {
        return b.dateCreated - a.dateCreated
    })

    return allPosts
}

// Removes a post from a user's post list
const delistPost = async (post) => {
    const userId = post.createdBy
    await User.updateOne({ _id: userId }, { $pull: { posts: post._id } })
}

const delistPostFromCategory = async (post) => {
    if (post.categoryId) {
        await Category.updateOne(
            { _id: post.categoryId },
            { $pull: { posts: post._id } }
        )
    }
}

// Checks if the given user has permission to edit/delete a given post
const hasPostEditPermissions = (post, user) => {
    if (user) {
        if (user._id.equals(post.createdBy) || user.role === 'Admin') {
            return true
        }
        return false
    }
    return false
}

// Checks if the given user has permission to download a given post
const hasPostDownloadPermissions = (post, user) => {
    try {
        if (post.createdBy.equals(user._id) || user.role === 'Admin') {
            return true
        } else if (post.visibility === 'Public') {
            return true
        } else if (post.visibility === 'Friends') {
            const poster = post.createdBy
            const friends = user.friends
            for (var i = 0; i < friends.length; i++) {
                if (poster.equals(friends[i])) {
                    return true
                }
            }
            return false
        } else {
            return false
        }
    } catch (err) {
        console.log(err)
        return false
    }
}

// Makes a new post
const makePost = async (req, res) => {
    const newPost = new Post({
        visibility: req.body.visibility,
        description: req.body.message,
        fileId: mongoose.Types.ObjectId(req.file.id),
        filename: await db.getFilename(req.file.id),
        createdBy: req.user._id,
        dateCreated: new Date(),
    })
    newPost.save(async (err, post) => {
        if (err) {
            console.log(err)
        } else {
            await User.updateOne(
                { _id: req.user._id },
                { $push: { posts: post._id } }
            )
            if (req.body.categoryId) {
                await Category.updateOne(
                    { _id: req.body.categoryId },
                    { $push: { posts: post._id } }
                )
            }
        }
        return res.redirect('back')
    })
}

// Deletes a post and its associated file
// checking if the associated user has permission to delete that post
const deletePost = async (postId, user) => {
    try {
        const post = await Post.findOne({ _id: postId })
        if (hasPostEditPermissions(post, user)) {
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
    } catch (err) {
        console.log(err)
    }
}

// Checks if user has permission to rename the post and renames it if so
const changePostname = async (postId, user, filename) => {
    try {
        const post = await Post.findOne({ _id: postId })
        if (hasPostEditPermissions(post, user)) {
            try {
                const fileId = post.fileId
                if (fileId) {
                    await db.renameFile(fileId, filename)
                    await Post.updateOne(
                        { _id: postId },
                        { filename: filename }
                    )
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

// Checks if user has download permissions and downloads the file if yes
const downloadPost = async (postId, user, res) => {
    try {
        const post = await Post.findOne({ _id: postId })
        if (hasPostDownloadPermissions(post, user)) {
            await db.downloadFile(post.fileId, res)
        }
    } catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}

// Assigns a post to a category, checking if the user has permission to do so
const assignToCategory = async (postId, categoryId, user) => {
    try {
        const post = await Post.findOne({ _id: postId }).lean()
        // Check if reassigning to new category or assigning to no category
        if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
            const category = await Category.findOne({ _id: categoryId }).lean()

            // Check if user has permission to edit both
            if (
                hasPostEditPermissions(post, user) &&
                hasCategoryEditPermissions(category, user)
            ) {
                // Add post to list of posts in categories
                await Category.updateOne(
                    { _id: categoryId },
                    { $push: { posts: post._id } }
                )
            }
        }

        // Change category ID field in post
        if (hasPostEditPermissions(post, user)) {
            delistPostFromCategory(post)
            if (categoryId) {
                await Post.updateOne(
                    { _id: postId },
                    { categoryId: categoryId }
                )
            } else {
                await Post.updateOne({ _id: postId }, { categoryId: null })
            }
        }
    } catch (err) {
        console.log(err)
    }
}

// Assigns a new visibility to a post
const changeVisibility = async (postId, visibility, user) => {
    try {
        const post = await Post.findOne({ _id: postId }).lean()
        if (
            visibility != 'Public' &&
            visibility != 'Friends' &&
            visibility != 'Private'
        ) {
            return
        } else if (hasPostEditPermissions(post, user)) {
            await Post.updateOne({ _id: postId }, { visibility: visibility })
        }
    } catch (err) {
        console.log(err)
    }
}

// Get all posts in the category which are visible to the user
const getPostsInCategory = async (category, user) => {
    const posts = []
    for (let i = 0; i < category.posts.length; i++) {
        const categoryPost = await Post.findOne({
            _id: category.posts[i],
        }).lean()
        posts[posts.length] = categoryPost
    }

    const filteredPosts = await filterVisiblePosts(posts, user)
    filteredPosts.sort((a, b) => {
        return b.dateCreated - a.dateCreated
    })

    return filteredPosts
}

// Deletes the category with the
//given category ID after checking user has permission
const deleteCategory = async (categoryId, user) => {
    try {
        // Find category
        const category = await Category.findOne({ _id: categoryId }).lean()

        // If user has permission to edit category, allow user to rename category
        if (hasCategoryEditPermissions(category, user)) {
            // Delete All files in the category
            for (let i = 0; i < category.posts.length; i++) {
                deletePost(category.posts[i])
            }

            // Delete the category
            await Category.deleteOne({ _id: categoryId })

            // Delist Category from User Category list
            await Category.updateOne(
                { _id: user._id },
                { $pull: { categories: categoryId } }
            )
        }
    } catch (err) {
        console.log(err)
    }
}

const NUM_RESULTS_SHOWN = 5

// Gets the posts which best match the current query of the user
const getPostsLive = async (payload, user) => {
    let search = await Post.find({
        filename: { $regex: new RegExp('^' + payload + '.*', 'i') },
    }).exec()

    // Filter out searches user does not have permissions for
    search = await filterVisiblePosts(search, user)

    // Limit search results
    search = search.slice(0, NUM_RESULTS_SHOWN)

    return search
}

module.exports = {
    Post,
    getUserPosts,
    getPublicPosts,
    deletePost,
    changePostname,
    changeVisibility,
    getFriendsPosts,
    downloadPost,
    makePost,
    assignToCategory,
    hasPostEditPermissions,
    hasPostDownloadPermissions,
    getPostsInCategory,
    getPostsLive,
    deleteCategory,
}
