const { createAccount } = require('../models/user')
const { addFriends } = require('../models/user')
const { removeFriends } = require('../models/user')

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

module.exports = {
    createAccountController,
    addNewFriendController,
    removeFriendsController,
}
