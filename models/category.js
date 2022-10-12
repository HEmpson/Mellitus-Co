const mongoose = require('mongoose')
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

// Gets the name of a category from its id
const getCategoryName = async (categoryId) => {
    try {
        return await Category.findOne({ _id: categoryId }).name
    } catch (err) {
        return 'None'
    }
}

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
const createCategory = async (name, user, res) => {
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
            return res.redirect('back')
        })
    } catch (err) {
        console.log(err)
    }
}

// Renames the category with the given category ID after checking user has permission
const renameCategory = async (categoryId, name, user, res) => {
    try {
        // Find category
        const category = await Category.findOne({ _id: categoryId }).lean()

        // If user has permission to edit category, allow user to rename category
        if (hasCategoryEditPermissions(category, user)) {
            // Rename the category
            await Category.updateOne({ _id: categoryId }, { name: name })
        }
        return res.redirect('back')
    } catch (err) {
        console.log(err)
    }
}

// Gets all the categories created by a user
const retriveCategories = async (user, requestingUser) => {
    const categories = []
    try {
        // Get all categories made by a user
        for (let i = 0; i < user.categories.length; i++) {
            let category = await Category.findOne({ _id: user.categories[i] })
            category.documentCount = category.posts.length
            if (requestingUser) {
                category.hasEditPermissions = hasCategoryEditPermissions(
                    category,
                    requestingUser
                )
            } else {
                category.hasEditPermissions = true
            }
            categories[i] = category
        }
        return categories
    } catch (err) {
        console.log(err)
        return []
    }
}

module.exports = {
    Category,
    createCategory,
    renameCategory,
    retriveCategories,
    getCategoryName,
    hasCategoryEditPermissions,
}
