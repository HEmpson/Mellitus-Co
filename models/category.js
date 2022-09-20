const mongoose = require('mongoose')
const { User } = require('./user')

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
const hasCategoryEditPermission = (category, user) => {
    try {
        if (user.role === 'Admin' || user.categories.includes(category._id)) {
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

// Renames the category with the given category ID
const renameCategory = async (categoryId, name, user) => {
    try {
        // Find category
        const category = await Category.findOne({ _id: categoryId }).lean()

        // If user has permission to edit category, allow user to rename category
        if (hasCategoryEditPermission(category, user)) {
            // Rename the category
            await Category.updateOne({ _id: categoryId }, { name: name })
        }
    } catch (err) {
        console.log(err)
    }
}

const deleteCategory = () => {}

const getAllInCategory = () => {}

module.exports = {
    Category,
    createCategory,
    renameCategory,
    hasCategoryEditPermission,
}
