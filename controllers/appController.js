const DB = require('../models/db')
const bcrypt = require('bcryptjs')

const getTestPage = async (req, res) => {
    res.render('login.hbs')
}
module.exports = {
    getTestPage
}