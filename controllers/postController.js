const {
    deletePost,
    changeVisibility,
    updatePostNames,
} = require('../models/post')
const { downloadPost } = require('../models/post')
const { changePostname } = require('../models/post')
const { makePost } = require('../models/post')
const { assignToCategory } = require('../models/post')

// Makes a new post
const makePostController = async (req, res) => {
    if (req.file.id) {
        await makePost(req, res)
    } else {
        return res.redirect('back')
    }
}

// Removes a post and returns the user back to the dashboard
const removePostController = async (req, res) => {
    await deletePost(req.params.id, req.user)
    return res.redirect('back')
}

// Takes a "filename" and renames the file associated with the post
const renamePostController = async (req, res) => {
    await changePostname(req.params.id, req.user, req.body.filename)
    return res.redirect('back')
}

// Downloads the file associated with a post then redirects back
const downloadPostController = async (req, res) => {
    await downloadPost(req.params.id, req.user, res)
}

// Controller function to assign/change a post's category
const assignToCategoryController = async (req, res) => {
    await assignToCategory(req.params.id, req.body.categoryId, req.user)
    return res.redirect('back')
}

// Changes the visibility status of a post
const changeVisibilityController = async (req, res) => {
    await changeVisibility(req.params.id, req.body.visibility, req.user)
    return res.redirect('back')
}

module.exports = {
    removePostController,
    renamePostController,
    downloadPostController,
    assignToCategoryController,
    changeVisibilityController,
    makePostController,
}
