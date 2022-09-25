const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    displayName: String,
    status: String,
    description: String,
    role: String,
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

const createAccount = async (req, res) => {
    const newUser = req.body

    // checks if email is a valid email
    if (!verifyNewPatientProfile(newUser)) {
        req.flash('newAccountError', 'Invalid Email Address')
        return res.redirect('/')
    }

    // email already exists
    if (await User.findOne({ username: newUser.username })) {
        req.flash('newAccountError', 'User already exists')
        return res.redirect('/')
    }

    try {
        const newUserProfile = new User({
            username: newUser.username,
            password: newUser.password,
            displayName: newUser.displayName,
            status: ' ',
            description: ' ',
            role: 'User',
            friends: [],
            files: [],
            categories: [],
        })

        // save the new account to the DB
        await newUserProfile.save()
    } catch (err) {
        await User.deleteOne({ username: newUser.username })
        req.flash('newAccountError', 'Invalid Data Type(s) Entered')
        return res.redirect('/')
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

const addFriends = async (req, res) => {
    friendEmail = req.body.email
    friend = await User.findOne({ username: friendEmail })

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

const removeFriends = async (req, res) => {
    friendName = req.body.displayName
    friend = await User.findOne({ displayName: friendName })

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
            return res.redirect('/friends')
        }
    } catch (err) {
        console.log(err)
    }
}

const getAllFriends = async (user) => {
    friends = await user.populate({
        path: 'friends',
        options: { lean: true },
    })

    friends = friends.toObject()

    allFriends = friends.friends

    return allFriends
}

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

const setStatus = async (userId, requestingUser, status) => {
    if (hasProfileEditPermissions(userId, requestingUser)) {
        await User.updateOne({ _id: userId }, { status: status })
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
}
