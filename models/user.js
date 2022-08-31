const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    displayName: String,
    status: String,
    role: String,
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],

    files: [
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
        // Replace password with hamesssh
        user.password = hash
        next()
    })
})


const User = mongoose.model('User', userSchema, 'user')

module.exports = {User}