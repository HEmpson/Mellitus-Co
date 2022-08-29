const DB = require('../models/db')

const getTestPage = async (req, res) => {
    res.render('login.hbs')
}
module.exports = {
    getTestPage,
}
