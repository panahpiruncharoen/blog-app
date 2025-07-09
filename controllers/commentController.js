const Comment = require('../models/Comment')
const Post = require('../models/Post')
const User = require('../models/User')

exports.manageComments = async (req, res) => {
	let comments = req.body.comments
	if (!Array.isArray(comments)) {
		comments = [ comments ]
	}
		
	const action = req.body.action
	const destination = req.body.destination
	//console.log(action, comments, destination)
	
	if(action === "destroy") {
	   await comments.forEach(async(commentId) => {
	   await Comment.findByIdAndDelete(commentId) 
	   })
	}
	// } else if (action === "publish") {
	//   await posts.forEach(async(postId) => {
	//   	await Post.findByIdAndUpdate(
	// 	postId,
	// 	{$set: { isPublished : true }}
	// 	)	
	//   })
	// } else if (action === "unpublish") {
	//   await posts.forEach(async(postId) => {
	//   	await Post.findByIdAndUpdate(
	// 	postId,
	// 	{$set: { isPublished : false }}
	// 	)	
	//   })
	// } else if (action === "restore") {
	//   await posts.forEach(async(postId) => {
	//   	await Post.findByIdAndUpdate(
	// 	postId,
	// 	{$set: { isDeleted : false }}
	// 	)	
	//   })
	// } else if (action === "delete") {
	//   await posts.forEach(async(postId) => {
	//   	await Post.findByIdAndUpdate(
	// 	postId,
	// 	{$set: { isDeleted : true }}
	// 	)	
	//   })
	// }	
	
	// if (destination) {
	// 	res.redirect("/posts")
	// 	return
	// }
	
	
	res.redirect("/users/profile")
}
exports.deleteOneComment = async (req, res) => {
	const commentId = req.params.commentId
	const deletedComment = await Comment.findByIdAndDelete(commentId) 
	// console.log(deletedComment)
	res.redirect(`/posts/${deletedComment.postId}`)
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

exports.updateNumLikes = async (req, res) => {
	const commentId = req.params.commentId
	const action = req.body.action
	console.log(commentId, action)

	const comment = await Comment.findById(commentId)
	
	 if(action === "like" && !comment.likedBy.includes(req.user.id)) {
	    comment.likedBy.push(req.user)
	    comment.numLikes += 1
	 	await comment.save()
	 }
	
	 if(action === "unlike" && comment.likedBy.includes(req.user.id)) {
	    comment.likedBy = comment.likedBy.filter(userId => userId.toString() !== req.user.id.toString())
	    comment.numLikes -= 1
	 	await comment.save()
	 }
	
	res.redirect(`/posts/${comment.postId}`)
}