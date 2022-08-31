

const getLoginPage = async (req, res) => {
    res.render('login.hbs')
}

const getDashboard = async (req, res) => {
    res.render('dashboard.hbs', {
        pageName: 'Dashboard',
    })
}

const getProfile = async (req, res) => {
    res.render('profile.hbs', {
        pageName: "Profile",
    })
}

module.exports = {
    getLoginPage,
    getDashboard,
    getProfile, 
}
