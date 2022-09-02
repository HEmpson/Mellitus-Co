
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

const getFile = async (req, res) => {
    res.render("file.hbs", {
        pageName: "File",
    })
}

module.exports = {
    getLoginPage,
    getDashboard,
    getProfile, 
    getFile,
}
