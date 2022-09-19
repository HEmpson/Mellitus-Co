const { createAccount } = require('../models/user')
const { addFriends } = require('../models/user')

const createAccountController = async (req, res) => {
    await createAccount(req, res)
    return res.redirect('/')
}

const addNewFriendController = async (req, res) => {
    await addFriends(req, res)
    return res.redirect('/friends')
}

module.exports = {
    createAccountController,
    addNewFriendController,
}
