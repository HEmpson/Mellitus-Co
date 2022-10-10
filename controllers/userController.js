const {
    createAccount,
    setStatus,
    addFriends,
    removeFriends,
    setDescription,
    blockUser,
    unblockUser,
    changePassword,
} = require('../models/user')
const bcrypt = require('bcryptjs')

// to create a new account for a user
const createAccountController = async (req, res) => {
    let user = await createAccount(req, res)
    if (user) {
        return res.redirect('/')
    } else {
        return res.redirect('/registration')
    }
}

// for a user to add a new friend
const addNewFriendController = async (req, res) => {
    await addFriends(req, res)
    return res.redirect('/friends')
}

// to allow a user to remove a friend
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

// Controller function for a user to change their password
const changePasswordController = async (req, res) => {
    await changePassword(req, res)
    return res.redirect('back')
}

// Controller function for an admin to block a user
const blockUserController = async (req, res) => {
    await blockUser(req.user, req.params.id)
    return res.redirect('back')
}

// Controller function for an admin to unblock a user
const unblockUserController = async (req, res) => {
    await unblockUser(req.user, req.params.id)
    return res.redirect('back')
}

module.exports = {
    createAccountController,
    addNewFriendController,
    removeFriendsController,
    setStatusController,
    setDescriptionController,
    changePasswordController,
    blockUserController,
    unblockUserController,
}
