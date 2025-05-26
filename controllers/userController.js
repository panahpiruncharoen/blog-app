const User = require('../models/User')
const Post = require("../models/Post")
const Comment = require('../models/Comment')

const path = require('path')
const fs = require('fs').promises

exports.getUserProfile = async (req, res) => {
	if (!req.user) {
	  res.send("You are not logged in")
}
	const userPosts =  await Post.find({ author: req.user })
	const publishedPosts = await userPosts.filter((p) => { return  p.isDeleted === false && p.isPublished === true })
	const draftPosts =  await userPosts.filter((p) => { return p.isDeleted === false && p.isPublished === false })
	const deletedPosts = await userPosts.filter((p) => { return  p.isDeleted === true })
	
	const avatarsPath = path.join(__dirname, '..', 'public', 'avatars');
	let avatarFiles = await fs.readdir(avatarsPath)
	avatarFiles = avatarFiles.filter(fname => fname !== req.user.profilePic)
	// console.log(avatarFiles)
	
	const userComments = await Comment.find({ author: req.user }).populate("postId", "title")
	//console.log(userComments)
	res.render("users/profile", { userPosts, publishedPosts, draftPosts, deletedPosts, userComments, avatarFiles })
}

exports.updateUserProfile = async (req, res) => {
if (!req.user) {
	  res.send("You are not logged in")
	}
	
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

exports.updateProfilePic = async (req, res) => {
if (!req.user) {
	  res.send("You are not logged in")
	}
	
	const newProfilePic = req.body.profilePic
	
	await User.findByIdAndUpdate(
		req.user.id,
		{$set: { profilePic: newProfilePic}}
	)
	
	res.redirect("/users/profile")
}

exports.getPublicProfile = async (req, res) => {
	const userId = req.params.userId
	const targetUser = await User.findById(userId)
	
	const userPosts = await Post.find({ author: targetUser })
	const publishedPosts = await userPosts.filter((p) => { return  p.isDeleted === false && p.isPublished === true })
	
	res.render("users/publicProfile", { targetUser, publishedPosts })
}
