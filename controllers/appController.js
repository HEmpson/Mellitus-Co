const { NONAME } = require("dns")
const Post = require('../models/post')

const getLoginPage = async (req, res) => {
    res.render('login.hbs',{
        pageName : "Login",
        layout : "",
    })
}

const getDashboard = async (req, res) => {
    
    //Post.getUserPosts(req.user)
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
    res.render("files.hbs", {
        pageName: "File",
    })
}

const getFriends = async (req, res) => {
    res.render("friends.hbs", {
        pageName: "Friends",
    })
}


const getCategories = async (req, res) => {
    res.render("categories.hbs", {
        pageName: "Categories",
    })
}


const getAllFiles = async (req, res) => {
    res.render("allFiles.hbs", {
        pageName: "All Files",
    })
}


module.exports = {
    getLoginPage,
    getDashboard,
    getProfile, 
    getFile,
    getFriends,
    getAllFiles,
    getCategories,
}
