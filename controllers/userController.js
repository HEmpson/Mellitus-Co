const {
    createAccount,
    setStatus,
    addFriends,
    removeFriends,
    setDescription,
} = require('../models/user')

const createAccountController = async (req, res) => {
    await createAccount(req, res)
    return res.redirect('/')
}

const addNewFriendController = async (req, res) => {
    await addFriends(req, res)
    return res.redirect('/friends')
}

const removeFriendsController = async (req, res) => {
    await removeFriends(req, res)
    return res.redirect('/friends')
}

// Controller function for changing status messages
const setStatusController = async (req, res) => {
    await setStatus(req.params.id, req.user, req.body.status)
    return res.redirect('back')
}

// Controller function for changing profile descriptions
const setDescriptionController = async (req, res) => {
    await setDescription(req.params.id, req.user, req.body.description)
    return res.redirect('back')
}

module.exports = {
    createAccountController,
    addNewFriendController,
    removeFriendsController,
    setStatusController,
    setDescriptionController,
}
