const Post = require('../models/Post')
const Comment = require('../models/Comment')
const User = require('../models/User')

exports.getAllPosts = async (req, res) => {
	const posts = await Post.find({ isPublished : true })
	res.render("posts/index", { posts})
}

exports.getNewPostForm = async (req,res) => {
	if (req.user) {
	res.render("posts/new")
	} else {
		res.redirect("/auth/google")
	}
}

exports.getOnePost = async (req, res) => {
	const postId = req.params.postId
	const post = await Post.findById(postId).populate("author", "firstName lastName")
	const comments = await Comment.find({ postId }).populate("author", "firstName lastName")
	console.log(post.author.id)
	console.log(req.user.id)
	
	if (!req.user) {
		res.send("Not logged in")
		return
	} else if (post.author.id === !req.user.id) {
	  res.send("You are not the owner of this post")
		return
	}
	res.render("posts/show", { post, comments })
}

exports.createNewPost = async (req,res) => {
	console.log(req.body)
	const title = req.body.title
	const author = req.user.id
	const text = req.body.text
	const isPublished = req.body.action === "publish" ? true : false
	
	
	// if (req.body.action === "publish") {
	//    isPublished = true
	// } else {
	//    isPublished = false
	// }
	const newPost = await Post.create({
		title: title,
		text: text,
		author: author,
		numLikes: 0,
		isPublished: isPublished
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
	const newText = req.body.text
	
	await Post.findByIdAndUpdate(
		postId,
		{$set: {title: newTitle, text: newText}}
	)
	
	res.redirect(`/posts/${postId}`)
}

exports.deleteOnePost = async (req, res) => {
	const postId = req.params.postId
	await Comment.deleteMany({ postId })
	await Post.findByIdAndDelete(postId) 
	res.redirect("/posts")
}

exports.deleteManyPosts = async (req, res) => {
	const posts = req.body.posts
	console.log(posts)
	await posts.forEach(async(postId) => {
	  await Comment.deleteMany({ postId })
	  await Post.findByIdAndDelete(postId) 
	})
	res.redirect("/users/profile")
}

exports.handlePublishedPosts = async (req, res) => {
	let posts = req.body.posts
	if (!Array.isArray(posts)) {
		posts = [ posts ]
	}
		
	const action = req.body.action
	console.log(action, posts)
	
	if(action === "delete") {
	  await posts.forEach(async(postId) => {
	  await Comment.deleteMany({ postId })
	  await Post.findByIdAndDelete(postId) 
	  })
	} else {
	  await posts.forEach(async(postId) => {
	  	await Post.findByIdAndUpdate(
		postId,
		{$set: { isPublished : false }}
		)	
	  })
	}		
	res.redirect("/users/profile")
}

exports.handleDraftPosts = async (req, res) => {
	let posts = req.body.posts
	if (!Array.isArray(posts)) {
		posts = [ posts ]
	}
		
	const action = req.body.action
	console.log(action, posts)
	
	if(action === "delete") {
	  await posts.forEach(async(postId) => {
	  await Comment.deleteMany({ postId })
	  await Post.findByIdAndDelete(postId) 
	  })
	} else {
	  await posts.forEach(async(postId) => {
	  	await Post.findByIdAndUpdate(
		postId,
		{$set: { isPublished : true }}
		)	
	  })
	}		
	res.redirect("/users/profile")
}

exports.createComment = async (req,res) => {
	const postId = req.params.postId
	const author = req.user.id
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