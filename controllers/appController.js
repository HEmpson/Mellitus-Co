const Post = require('../models/post')
const { User, getAllFriends } = require('../models/user')
const DB = require('../models/index')

const getLoginPage = async (req, res) => {
    res.render('login.hbs', {
        pageName: 'Login',
        layout: '',
    })
}

const getDashboard = async (req, res) => {
    const publicPosts = await Post.getPublicPosts(req.user)
    const friendsPosts = await Post.getFriendsPosts(req.user)

    const publicDashboardPosts = []
    const friendDashboardPosts = []

    // get all public posts
    for (let i = 0; i < publicPosts.length; i++) {
        let newPublicPost = publicPosts[i]
        newPublicPost.filename = await DB.getFilename(publicPosts[i].fileId)
        newPublicPost.createdByName = (
            await User.findOne({ _id: publicPosts[i].createdBy })
        ).displayName
        publicDashboardPosts[i] = newPublicPost
    }

    // get all friends posts
    for (let i = 0; i < friendsPosts.length; i++) {
        let newFriendPost = friendsPosts[i]
        newFriendPost.filename = await DB.getFilename(friendsPosts[i].fileId)
        newFriendPost.createdByName = (
            await User.findOne({ _id: friendsPosts[i].createdBy })
        ).displayName
        friendDashboardPosts[i] = newFriendPost
    }
    res.render('dashboard.hbs', {
        pageName: 'Dashboard',
        publicPosts: publicDashboardPosts,
        friendsPosts: friendDashboardPosts,
        user: req.user,
    })
}

const getProfile = async (req, res) => {
    res.render('profile.hbs', {
        pageName: 'Profile',
        user: req.user,
    })
}

const getFile = async (req, res) => {
    res.render('files.hbs', {
        pageName: 'File',
        user: req.user,
    })
}

const getFriends = async (req, res) => {
    friends = getAllFriends(req.user)
    res.render('friends.hbs', {
        pageName: 'Friends',
        friends: friends,
        user: req.user,
    })
}

const getCategories = async (req, res) => {
    res.render('categories.hbs', {
        pageName: 'Categories',
        user: req.user,
    })
}

const getAllFiles = async (req, res) => {
    res.render('allFiles.hbs', {
        pageName: 'All Files',
        user: req.user,
    })
}

const getRegistration = async (req, res) => {
    res.render('registration.hbs', {
        pageName: 'Registration',
        layout: '',
        user: req.user,
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
