const { deletePost } = require('../models/post')
const { downloadPost } = require('../models/post')
const { changePostname } = require('../models/post')
const { makePost } = require('../models/post')

// Makes a new post
const makePostController = async (req, res) => {
    await makePost(req, res)
    return res.redirect('/dashboard')
}

// Removes a post and returns the user back to the dashboard
const removePost = async (req, res) => {
    await deletePost(req.params.id, req.user)
    return res.redirect('/dashboard')
}

// Takes a "filename" and renames the file associated with the post
const renamePost = async (req, res) => {
    await changePostname(req.params.id, req.user, req.body.filename)
    return res.redirect('/dashboard')
}

// Downloads the file associated with a post then redirects back
const downloadPostController = async (req, res) => {
    await downloadPost(req.params.id, req.user, res)
}

module.exports = {
    removePost,
    renamePost,
    downloadPostController,
    makePostController,
}
