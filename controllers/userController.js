const {createAccount} = require('../models/user')

const createAccountController = async (req, res) => {
    await createAccount(req, res)
    return res.redirect('/')
}

module.exports = {
    createAccountController,
}
