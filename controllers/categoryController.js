const { Category } = require('../models/category')
const { createCategory } = require('../models/category')
const { renameCategory } = require('../models/category')
const { deleteCategory } = require('../models/category')

// Controller function for handling creation of categories
const createCategoryController = (req, res) => {
    const body = req.body
    createCategory(body.name, req.user)
    return res.redirect('/dashboard')
}

// Controller function for renaming categories
const renameCategoryController = (req, res) => {
    const body = req.body
    renameCategory(body.id, body.name, req.user)
    return res.redirect('/dashboard')
}

// Controller function for deleting categories
const deleteCategoryController = (req, res) => {
    const body = req.body
    deleteCategory(body.id, req.user)
    return res.redirect('/dashboard')
}

module.exports = {
    createCategoryController,
    renameCategoryController,
    deleteCategoryController,
}
