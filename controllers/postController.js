const Post = require('../models/Post')
const Comment = require('../models/Comment')
const User = require('../models/User')

exports.getAllPosts = async (req, res) => {
	const posts = await Post.find({ isPublished : true , isDeleted: false })
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
	const post = await Post.findById(postId).populate("author", "firstName lastName profilePic email")
											.populate("likedBy" , "profilePic")
	//console.log(post)
	// console.log(post.author.id)
	// console.log(req.user.id)
	
	if(post.isDeleted || !post.isPublished) {
	if (!req.user) {
	 	res.send("Not logged in")
	 	return
	 } else if (post.author.id !== req.user.id) {
	   res.send("You are not the owner of this post")
	 	return
	 }
   }
	
	let likedByCurrUser = false
	post.likedBy.forEach((u) => {
		// console.log(req.user)
		// console.log(u)
		// console.log(req.user.id == u.id)
		if (req.user.id == u.id) {
		  likedByCurrUser = true
	   }
	})
	
	const comments = await Comment.find({ postId }).populate("author", "firstName lastName profilePic")
	//console.log(comments)
	res.render("posts/show", { post, comments, likedByCurrUser})
}

exports.createNewPost = async (req,res) => {
	//console.log(req.body)
	const title = req.body.title
	const author = req.user.id
	const text = req.body.text
	const isPublished = req.body.action === "publish" ? true : false
	const filename = req.file.filename
	console.log(filename)
	
	// if (req.body.action === "publish") {
	//    isPublished = true
	// } else {
	//    isPublished = false
	// }
	const newPost = await Post.create({
		title: title,
		author: author,
		text: text,
		image: "/post-images/" + filename,
		profilePic: "/post-images/" + filename,
		numLikes: 0,
		isPublished: isPublished,
		isDeleted: false,
		likeBy: [],
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
	console.log(req.file)
	const filename = req.file.filename
	
	await Post.findByIdAndUpdate(
		postId,
		{$set: {title: newTitle, text: newText, image: "/post-images/" + filename}}
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
	//console.log(posts)
	await posts.forEach(async(postId) => {
	  await Comment.deleteMany({ postId })
	  await Post.findByIdAndDelete(postId) 
	})
	res.redirect("/users/profile")
}

exports.managePosts = async (req, res) => {
	let posts = req.body.posts
	if (!Array.isArray(posts)) {
		posts = [ posts ]
	}
		
	const action = req.body.action
	const destination = req.body.destination
	//console.log(action, posts, destination)
	
	if(action === "destroy") {
	   await posts.forEach(async(postId) => {
	   await Comment.deleteMany({ postId })
	   await Post.findByIdAndDelete(postId) 
	   })
	} else if (action === "publish") {
	  await posts.forEach(async(postId) => {
	  	await Post.findByIdAndUpdate(
		postId,
		{$set: { isPublished : true }}
		)	
	  })
	} else if (action === "unpublish") {
	  await posts.forEach(async(postId) => {
	  	await Post.findByIdAndUpdate(
		postId,
		{$set: { isPublished : false }}
		)	
	  })
	} else if (action === "restore") {
	  await posts.forEach(async(postId) => {
	  	await Post.findByIdAndUpdate(
		postId,
		{$set: { isDeleted : false }}
		)	
	  })
	} else if (action === "delete") {
	  await posts.forEach(async(postId) => {
	  	await Post.findByIdAndUpdate(
		postId,
		{$set: { isDeleted : true }}
		)	
	  })
	}	
	
	if (destination) {
		res.redirect("/posts")
		return
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
	const action = req.body.action
	console.log(postId, action)

	const post = await Post.findById(postId)
	
	if(action === "like" && !post.likedBy.includes(req.user.id)) {
	   post.likedBy.push(req.user)
	   post.numLikes += 1
		await post.save()
	}
	
	if(action === "unlike" && post.likedBy.includes(req.user.id)) {
	   post.likedBy = post.likedBy.filter(userId => userId.toString() !== req.user.id.toString())
	   post.numLikes -= 1
		await post.save()
	}
	res.redirect(`/posts/${postId}`)
}