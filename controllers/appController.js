
const getLoginPage = async (req, res) => {
    res.render('login.hbs')
}

const getDashboard = async (req, res) => {
 //   getUserPosts(req.body.user)
    res.render('dashboard.hbs', {
        pageName: 'Dashboard',
    })
}

const getProfile = async (req, res) => {
    res.render('profile.hbs', {
        pageName: "Profile",
    })
}

const getShareDrive = async (req, res) => {
    res.render("sharedrive.hbs", {
        pageName: "Sharedrive",
    })
}

module.exports = {
    getLoginPage,
    getDashboard,
    getProfile, 
    getShareDrive,
}
