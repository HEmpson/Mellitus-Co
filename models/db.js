const mongoose = require('mongoose')

// add schemas

const userSchema = new mongoose.Schema({
    userFirstName: String,
    userLastName: String,
    displayName: String, // idk if we are doing a display name??
    email: String,
    status: String,
    bio: String,
    friends: [userSchema],
    files: [postSchema],

})

const postSchema = new mongoose.Schema({

})

module.exports = {}
