const { NONAME } = require('dns')
const Post = require('../models/post')
const {User} = require('../models/user')
const DB = require('../models/index')

const getLoginPage = async (req, res) => {
    res.render('login.hbs', {
        pageName: 'Login',
        layout: '',
    })
}

const getDashboard = async (req, res) => {
    const posts = await Post.getUserPosts(req.user)

    const dashboardPosts = []

    for (let i=0; i < posts.length; i++) {
        let newPost = posts[i]
        console.log(newPost)
        newPost.filename = await DB.getFilename(posts[i].fileId)
        newPost.createdByName = (await User.findOne({_id: posts[i].createdBy})).displayName
        dashboardPosts[i] = newPost
    }

    console.log(dashboardPosts)

    res.render('dashboard.hbs', {
        pageName: 'Dashboard',
        posts: dashboardPosts
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

module.exports = {
    getLoginPage,
    getDashboard,
    getProfile,
    getFile,
    getFriends,
    getAllFiles,
    getCategories,
}
