const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    displayName: String,
    status: String,
    description: String,
    role: String,
    blocked: Boolean,
    profileImage: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],

    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],

    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
    ],
})

const SALT_FACTOR = 10

userSchema.methods.verifyPassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, valid) => {
        callback(err, valid)
    })
}

userSchema.pre('save', function save(next) {
    const user = this
    // Go to next if password field has not been modified
    if (!user.isModified('password')) {
    }
    // Automatically generate salt, and calculate hash
    bcrypt.hash(user.password, SALT_FACTOR, (err, hash) => {
        if (err) {
            return next(err)
        }
        // Replace password with hash
        user.password = hash
        next()
    })
})

// to create a user a new account
const createAccount = async (req, res, userType) => {
    const newUser = req.body

    // checks if email is a valid email
    if (!verifyNewPatientProfile(newUser)) {
        req.flash('newAccountError', 'Invalid Email Address')
        req.flash('newAdminAccountError', 'Invalid Email Address')
        return
    }

    // email already exists
    if (await User.findOne({ username: newUser.username })) {
        req.flash('newAccountError', 'User already exists')
        req.flash('newAdminAccountError', 'Admin already exists')
        return
    }

    try {
        const newUserProfile = new User({
            username: newUser.username,
            password: newUser.password,
            displayName: newUser.displayName,
            status: ' ',
            description: ' ',
            role: userType,
            blocked: false,
            friends: [],
            files: [],
            categories: [],
        })

        // save the new account to the DB
        await newUserProfile.save()

        return newUser
    } catch (err) {
        await User.deleteOne({ username: newUser.username })
        req.flash('newAccountError', 'Invalid Data Type(s) Entered')
        req.flash('newAdminAccountError', 'Invalid Data Type(s) Entered')
        return
    }
}

// Verify the email address of the new patient is correct
const verifyNewPatientProfile = (newUser) => {
    try {
        const email = newUser.username
        // Check email has only 1 @ symbol
        const emailTokens = email.split('@')
        if (emailTokens.length != 2) {
            return false
        }
        const recipient = emailTokens[0]
        const domain = emailTokens[1]
        // Check if either field is null
        if (recipient) {
            if (domain) {
                // Check if domain has at least 2 parts
                const domainTokens = domain.split('.')
                if (domainTokens.length < 2) {
                    return false
                }
            } else {
                return false
            }
        } else {
            return false
        }
        // If all tests passed, input is verified
        return true
    } catch {
        // Return invalid
        return false
    }
}

// function to allow a user to add friends
const addFriends = async (req, res) => {
    const friendEmail = req.body.email
    const friend = await User.findOne({ username: friendEmail })

    try {
        // if friend exists
        if (friend) {
            await User.updateOne(
                { _id: friend._id },
                { $push: { friends: req.user._id } }
            )
            await User.updateOne(
                { _id: req.user._id },
                { $push: { friends: friend._id } }
            )
        }

        // friend doesn't exist
        else {
            req.flash('noFriendError', 'Friend does not exist')
        }
    } catch (err) {
        console.log(err)
    }
}

// a function to allow a user to remove a friend
const removeFriends = async (req, res) => {
    const friendID = req.params.id
    const friend = await User.findOne({ _id: friendID })

    try {
        // if friend exists
        if (friend) {
            await User.updateOne(
                { _id: friend._id },
                { $pull: { friends: req.user._id } }
            )
            await User.updateOne(
                { _id: req.user._id },
                { $pull: { friends: friend._id } }
            )
        }

        // friend doesn't exist
        else {
            req.flash('noFriendError', 'Friend does not exist')
            return
        }
    } catch (err) {
        console.log(err)
    }
}

// gets all the friends of a user
const getAllFriends = async (user) => {
    friends = await user.populate({
        path: 'friends',
        options: { lean: true },
    })

    friends = friends.toObject()

    allFriends = friends.friends

    return allFriends
}

// gets the profile information of a user
const getUserInfo = async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.params.id }).lean()
        if (user) {
            return user
        } else {
            return undefined
        }
    } catch (err) {
        console.log(err)
    }
}

// checks if a user has permission to change the details of a profile
const hasProfileEditPermissions = (userId, requestingUser) => {
    try {
        if (
            requestingUser.role === 'Admin' ||
            requestingUser._id.equals(userId)
        ) {
            return true
        }
        return false
    } catch (err) {
        console.log(err)
        return false
    }
}

// checks if a user has the permission to block a user
const hasBlockingPermissions = (user) => {
    try {
        if (user.role === 'Admin') {
            return true
        }
        return false
    } catch (err) {
        console.log(err)
        return false
    }
}

// function to allow a user to change their password
const changePassword = async (req, res) => {
    const user = await User.findOne({ _id: req.user._id })

    // no user exists
    if (!user) {
        return res.sendStatus(404)
    }

    const oldPass = req.body.oldPass
    const newPass = req.body.newPass
    const currentPass = user.password

    bcrypt.compare(oldPass, currentPass, async (err, valid) => {
        if (!valid) {
            req.flash(
                'badPassError',
                'Old password does not match current password'
            )
            return
        }

        bcrypt.hash(newPass, 10, async (err, hash) => {
            if (err) {
                return next(err)
            }
            await User.updateOne({ _id: req.user._id }, { password: hash })
            return
        })
    })
}

// Changes the status message of a user given requesting user has permission
const setStatus = async (userId, requestingUser, status) => {
    if (hasProfileEditPermissions(userId, requestingUser)) {
        await User.updateOne({ _id: userId }, { status: status })
    }
}

const setDisplayName = async (userId, requestingUser, displayName, res) => {
    if (hasProfileEditPermissions(userId, requestingUser)) {
        await User.updateOne({ _id: userId }, { displayName: displayName })
    }
}

// Changes the profile description of a user
// given requesting user has permission
const setDescription = async (userId, requestingUser, description) => {
    if (hasProfileEditPermissions(userId, requestingUser)) {
        await User.updateOne({ _id: userId }, { description: description })
    }
}

// allows an admin to block a user
const blockUser = async (adminUser, normalUserId) => {
    if (hasBlockingPermissions(adminUser)) {
        await User.updateOne({ _id: normalUserId }, { blocked: true })
    }
}

// allows an admin to unblock a user
const unblockUser = async (adminUser, normalUserId) => {
    if (hasBlockingPermissions(adminUser)) {
        await User.updateOne({ _id: normalUserId }, { blocked: false })
    }
}

// Gets the list of all blocked users
const getAllBlockedUsers = async () => {
    const blockedUsers = await User.find({ blocked: true })
    return blockedUsers
}

// Change the profile image id on the user
const uploadProfileImage = async (imageId, user) => {
    try {
        await User.updateMany({ _id: user._id }, { profileImage: imageId })
    } catch (err) {
        console.log(err)
        return
    }
}

const User = mongoose.model('User', userSchema, 'user')

module.exports = {
    User,
    createAccount,
    verifyNewPatientProfile,
    addFriends,
    removeFriends,
    getAllFriends,
    getUserInfo,
    setStatus,
    setDescription,
    changePassword,
    hasBlockingPermissions,
    unblockUser,
    blockUser,
    getAllBlockedUsers,
    uploadProfileImage,
    setDisplayName,
}
