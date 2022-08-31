const DB = require('../models/db')

const getTestPage = async (req, res) => {
    res.render('login.hbs')
}


const getDashboard = async(req, res) => {
    res.render('dashboard.hbs', {
        pageName: 'Dashboard'
    })
}

module.exports = {
    getTestPage,
    getDashboard,
}
