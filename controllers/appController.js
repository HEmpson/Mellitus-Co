const Post = require('../models/post')
const { User, getAllFriends, getUserInfo } = require('../models/user')
const DB = require('../models/index')
const { Category } = require('../models/category')

const getLoginPage = async (req, res) => {
    res.render('login.hbs', {
        pageName: 'Login',
        layout: '',
    })
}

// direct to dashboard page
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

// direct to profile page
const getProfile = async (req, res) => {
    let user = await getUserInfo(req, res)
    
    if (!user){
        req.flash('noUserError', 'No access to user')
        return res.redirect('/dashboard')
    }

    res.render('profile.hbs', {
        pageName: 'Profile',
        userInfo: user,
        user: req.user,
    })
}

const NUM_DISPLAY_HEAD = 4

// direct to file page
const getFile = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id }).lean()
    const categoryIds = user.categories
    const categoryList = []

    // Get head of categories
    for (let i = 0; i < categories.length && i < NUM_DISPLAY_HEAD; i++) {
        let category = await Category.findOne({ _id: categoryIds[i] })
        categoryList[i] = {
            _id: categoryIds[i],
            name: category.name,
            documentCount: category.posts.length,
        }
    }

    // Find all files in latest order
    const postIds = user.posts
    const postList = []
    for (let i = 0; i < posts.length && i < NUM_DISPLAY_HEAD; i++) {
        let post = await Post.findOne({ _id: postIds[i] })
        post.filename = DB.getFilename(post._id)
        postList[i] = post
    }

    const filteredPostList = []

    // Filter posts
    for (let i = 0; i < postList.length; i++) {
        if (Post.hasPostDownloadPermissions(postList[i])) {
            filteredPostList[filteredPostList.length] = postList[i]
        }
    }
    res.render('files.hbs', {
        pageName: 'File',
        user: req.user,
        categories: categoryList,
        posts: filteredPostList.slice(0, NUM_DISPLAY_HEAD),
    })
}

// direct to friends page
const getFriends = async (req, res) => {
    friends = await getAllFriends(req.user)
    res.render('friends.hbs', {
        pageName: 'Friends',
        friends: friends,
        user: req.user,
    })
}

// direct to categories page
const getCategories = async (req, res) => {
    res.render('categories.hbs', {
        pageName: 'Categories',
        user: req.user,
    })
}

// Gets the page for the all files page
const getAllFiles = async (req, res) => {
    res.render('allFiles.hbs', {
        pageName: 'All Files',
        user: req.user,
    })
}

// direct to registration page
const getRegistration = async (req, res) => {
    res.render('registration.hbs', {
        pageName: 'Registration',
        layout: '',
        user: req.user,
    })
}

// export the functions
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
