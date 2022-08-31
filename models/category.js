const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
})


const Category = mongoose.model('Category', categorySchema, 'category')

module.exports = {Category}