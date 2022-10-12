const { Category } = require('../models/category')
const { createCategory } = require('../models/category')
const { renameCategory } = require('../models/category')
const { deleteCategory } = require('../models/post')

// Controller function for handling creation of categories
const createCategoryController = (req, res) => {
    const body = req.body
    createCategory(body.name, req.user, res)
}

// Controller function for renaming categories
const renameCategoryController = (req, res) => {
    const body = req.body
    renameCategory(req.params.id, body.name, req.user, res)
}

// Controller function for deleting categories
const deleteCategoryController = (req, res) => {
    deleteCategory(req.params.id, req.user, res)
}

module.exports = {
    createCategoryController,
    renameCategoryController,
    deleteCategoryController,
}
