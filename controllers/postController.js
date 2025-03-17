const Post = require('../models/Post')
const Comment = require('../models/Comment')
const User = require('../models/User')

exports.getAllPosts = async (req, res) => {
	const posts = await Post.find({})
	res.render("posts/index", { posts})
}

exports.getNewPostForm = async (req,res) => {
	const users = await User.find({})
	res.render("posts/new", { users })
}

exports.getOnePost = async (req, res) => {
	const postId = req.params.postId
	const post = await Post.findById(postId).populate("author", "firstName lastName")
	const comments = await Comment.find({ postId }).populate("author", "firstName lastName")
	const users = await User.find({})
	res.render("posts/show", { post, comments, users })
}

exports.createNewPost = async (req,res) => {
	const title = req.body.title
	const author = req.body.author
	const text = req.body.text
	
	
	const newPost = await Post.create({
		title: title,
		text: text,
		author: author,
		numLikes: 0,
	})
	
	res.redirect("/")
}

exports.getEditPostForm = async (req, res) => {
	const postId = req.params.postId
	const post = await Post.findById(postId)
	const users = await User.find({})
	res.render("posts/edit", { post, users })
}

exports.updatePost = async (req, res) => {
	const postId = req.params.postId
	const newTitle = req.body.title
	const newAuthor = req.body.author
	const newText = req.body.text
	
	await Post.findByIdAndUpdate(
		postId,
		{$set: {title: newTitle, author: newAuthor, text: newText}}
	)
	
	res.redirect(`/posts/${postId}`)
}

exports.deleteOnePost = async (req, res) => {
	const postId = req.params.postId
	await Comment.deleteMany({ postId })
	await Post.findByIdAndDelete(postId) 
	res.redirect("/posts")
}

exports.createComment = async (req,res) => {
	const postId = req.params.postId
	const author = req.body.author
	const text = req.body.text
	
	const newComment = await Comment.create({
		postId: postId,
		author: author,
		text: text,
	})
	
	res.redirect(`/posts/${postId}`)
 }

exports.updateNumLikes = async (req, res) => {
	const postId = req.params.postId
	
	await Post.findByIdAndUpdate(
		postId,
		{$inc: { numLikes: 1 }}
	)
	
	res.redirect(`/posts/${postId}`)
}