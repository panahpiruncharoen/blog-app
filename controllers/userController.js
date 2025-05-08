const User = require('../models/User')
const Post = require("../models/Post")
const Comment = require('../models/Comment')

exports.getUserProfile = async (req, res) => {
	if (!req.user) {
	  res.send("You are not logged in")
}
	const userPosts =  await Post.find({ author: req.user })
	const publishedPosts = await userPosts.filter((p) => { return  p.isDeleted === false && p.isPublished === true })
	const draftPosts =  await userPosts.filter((p) => { return p.isDeleted === false && p.isPublished === false })
	const deletedPosts = await userPosts.filter((p) => { return  p.isDeleted === true })
	
	const userComments = await Comment.find({ author: req.user }).populate("postId", "title")
	console.log(userComments)
	res.render("users/profile", { userPosts, publishedPosts, draftPosts, deletedPosts, userComments })
}

exports.updateUserProfile = async (req, res) => {
if (!req.user) {
	  res.send("You are not logged in")
	}
	//console.log("try to update profile")
	//console.log(req.body)
	//console.log(req.user.id)
	
	const newUsername = req.body.username
	const newFirstName = req.body.firstName
	const newLastName = req.body.lastName
	const newEmail= req.body.email
	
	await User.findByIdAndUpdate(
		req.user.id,
		{$set: {username: newUsername, firstName: newFirstName, lastName: newLastName, email: newEmail}}
	)
	
	res.redirect("/users/profile")
}