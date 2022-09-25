const {
    createAccount,
    setStatus,
    addFriends,
    removeFriends,
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

const setStatusController = async (req, res) => {
    await setStatus(req.params.id, req.user, req.body.status)
    return res.redirect('back')
}

module.exports = {
    createAccountController,
    addNewFriendController,
    removeFriendsController,
    setStatusController,
}
