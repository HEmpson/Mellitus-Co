const { NONAME } = require('dns')
const Post = require('../models/post')
const { User } = require('../models/user')
const DB = require('../models/index')

const getLoginPage = async (req, res) => {
    res.render('login.hbs', {
        pageName: 'Login',
        layout: '',
    })
}

const getDashboard = async (req, res) => {
    const publicPosts = await Post.getUserPosts(req.user)
    

    const dashboardPosts = []

    for (let i = 0; i < publicPosts.length; i++) {
        let newPost = publicPosts[i]
        newPost.filename = await DB.getFilename(publicPosts[i].fileId)
        newPost.createdByName = (
            await User.findOne({ _id: publicPosts[i].createdBy })
        ).displayName
        dashboardPosts[i] = newPost
    }

    res.render('dashboard.hbs', {
        pageName: 'Dashboard',
        publicPosts: dashboardPosts,
    })
}

const getProfile = async (req, res) => {
    res.render('profile.hbs', {
        pageName: 'Profile',
    })
}

const getFile = async (req, res) => {
    res.render('files.hbs', {
        pageName: 'File',
    })
}

const getFriends = async (req, res) => {
    res.render('friends.hbs', {
        pageName: 'Friends',
    })
}

const getCategories = async (req, res) => {
    res.render('categories.hbs', {
        pageName: 'Categories',
    })
}

const getAllFiles = async (req, res) => {
    res.render('allFiles.hbs', {
        pageName: 'All Files',
    })
}

const getRegistration = async (req, res) => {
    res.render('registration.hbs', {
        pageName: 'Registration',
        layout: '',
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
    getRegistration,
}
