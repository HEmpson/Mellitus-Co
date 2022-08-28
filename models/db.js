const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
	visibility: String, 
	createdBy: {
		type:mongoose.Schema.Types.ObjectId,
		ref: 'User',
    default: null
	},
	categoryId: {
		type:mongoose.Schema.Types.ObjectId,
		ref: 'Category',
    default: null
	},
	description: String,
	fileId: mongoose.Schema.Types.ObjectId
})

const userSchema = new mongoose.Schema({
    username: String,
    displayName: String, 
    email: String,
    status: String,
    role: String,
    friends: [
      {
        	type:mongoose.Schema.Types.ObjectId,
        	ref: 'User',
      },
    ],

    files: [
		{
		type:mongoose.Schema.Types.ObjectId,
		ref: 'Post',
	}
	],

	categories: [
		{
		type:mongoose.Schema.Types.ObjectId,
		ref: 'Category',
	}
	]

})

const categorySchema = new mongoose.Schema({
	name: String,
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
		}
	]
})


const User = mongoose.model('User', userSchema, 'user')
const Post = mongoose.model('Post', postSchema, 'post')
const Category = mongoose.model('Category', categorySchema, 'category')

module.exports = {
  User,
  Post,
  Category,
}
