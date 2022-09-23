const mongoose = require('mongoose')
const { Post, hasPostDownloadPermissions } = require('./post')
const { User } = require('./user')
const db = require('./index')

const categorySchema = new mongoose.Schema({
    name: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
})

const Category = mongoose.model('Category', categorySchema, 'category')

// Checks if User has permission to make changes to a category
const hasCategoryEditPermissions = (category, user) => {
    try {
        let inCategoriesList = false
        for (let i = 0; i < user.categories.length; i++) {
            if (user.categories[i].equals(category._id)) {
                inCategoriesList = true
            }
        }
        if (user.role === 'Admin' || inCategoriesList) {
            return true
        }
        return false
    } catch (err) {
        console.log(err)
        return false
    }
}

// Creates a new category with the given name and adds it to the list of the user's created categories
const createCategory = async (name, user) => {
    try {
        const newCategory = new Category({
            name: name,
            posts: [],
        })

        newCategory.save(async (err, category) => {
            await User.updateOne(
                { _id: user._id },
                { $push: { categories: category._id } }
            )
        })
    } catch (err) {
        console.log(err)
    }
}

// Renames the category with the given category ID after checking user has permission
const renameCategory = async (categoryId, name, user) => {
    try {
        // Find category
        const category = await Category.findOne({ _id: categoryId }).lean()

        // If user has permission to edit category, allow user to rename category
        if (hasCategoryEditPermissions(category, user)) {
            // Rename the category
            await Category.updateOne({ _id: categoryId }, { name: name })
        }
    } catch (err) {
        console.log(err)
    }
}

// Deletes the category with the given category ID after checking user has permission
const deleteCategory = async (categoryId, user) => {
    try {
        // Find category
        const category = await Category.findOne({ _id: categoryId }).lean()

        // If user has permission to edit category, allow user to rename category
        if (hasCategoryEditPermissions(category, user)) {
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

// Gets all the categories created by a user
const getCategories = async (user) => {
    const categories = []
    // Get all categories made by a user
    for (let i = 0; i < categories.length; i++) {
        let category = await Category.findOne({ _id: categoryIds[i] })
        category.documentCount = category.posts.length
        categories[i] = category
    }
    return categories
}

// Get all posts in the category which are visible to the user
const getPostsInCategory = async (category, user) => {
    const posts = []
    for (let i = 0; i < category.posts.length; i++) {
        const categoryPost = await Post.findOne({
            _id: category.posts[i],
        }).lean()
        if (hasPostDownloadPermissions(categoryPost, user)) {
            categoryPost.filename = db.getFilename(categoryPost)
            posts[posts.length] = categoryPost
        }
    }
    return posts
}

module.exports = {
    Category,
    createCategory,
    renameCategory,
    deleteCategory,
    getCategories,
    getPostsInCategory,
    hasCategoryEditPermissions,
}
