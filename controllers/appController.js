const {
    Post,
    getPublicPosts,
    getFriendsPosts,
    getUserPosts,
    hasPostDownloadPermissions,
} = require('../models/post')
const { User, getAllFriends, getUserInfo } = require('../models/user')
const { Category } = require('../models/category')
const db = require('../models/index')

const getLoginPage = async (req, res) => {
    res.render('login.hbs', {
        pageName: 'Login',
        layout: '',
    })
}

// direct to dashboard page
const getDashboard = async (req, res) => {
    const publicPosts = await getPublicPosts(req.user)
    const friendsPosts = await getFriendsPosts(req.user)

    const publicDashboardPosts = []
    const friendDashboardPosts = []

    // get all public posts
    for (let i = 0; i < publicPosts.length; i++) {
        let newPublicPost = publicPosts[i]
        newPublicPost.filename = await db.getFilename(publicPosts[i].fileId)
        newPublicPost.createdByName = (
            await User.findOne({ _id: publicPosts[i].createdBy })
        ).displayName
        publicDashboardPosts[i] = newPublicPost
    }

    // get all friends posts
    for (let i = 0; i < friendsPosts.length; i++) {
        let newFriendPost = friendsPosts[i]
        newFriendPost.filename = await db.getFilename(friendsPosts[i].fileId)
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

    if (!user) {
        req.flash('noUserError', 'No access to user')
        return res.redirect('/dashboard')
    }

    res.render('profile.hbs', {
        pageName: 'Profile',
        userInfo: user,
        user: req.user,
    })
}

// Number of Posts/Categories to display on the files screen at once
const NUM_DISPLAY_HEAD = 4

// direct to file page
const getFile = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id }).lean()
    let categories = getCategories(user)
    categories = categories.slice(0, NUM_DISPLAY_HEAD)

    const posts = getUserPosts(user)
    let filteredPosts = []
    // Filter the posts which are visible to the user
    for (let i = 0; i < posts.length; i++) {
        if (hasPostDownloadPermissions(posts[i], user)) {
            posts[i].filename = db.getFilename(posts[i])
            filteredPosts[filteredPosts.length] = posts[i]
        }
    }
    filteredPosts = filteredPosts.slice(0, NUM_DISPLAY_HEAD)

    res.render('files.hbs', {
        pageName: 'File',
        user: req.user,
        categories: categoryList,
        posts: filteredPosts,
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
    const user = await User.findOne({ _id: req.params.id }).lean()
    const categories = getCategories(user)

    res.render('categories.hbs', {
        pageName: 'Categories',
        categories: categories,
        user: req.user,
    })
}

// Gets the page for the all files page
const getAllFiles = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id }).lean()

    const posts = getUserPosts(user)

    let filteredPosts = []

    // Filter the posts which are visible to the user
    for (let i = 0; i < posts.length; i++) {
        if (hasPostDownloadPermissions(posts[i], user)) {
            posts[i].filename = db.getFilename(posts[i])
            filteredPosts[filteredPosts.length] = posts[i]
        }
    }

    res.render('allFiles.hbs', {
        pageName: 'All Files',
        posts: filteredPosts,
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
