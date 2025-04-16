const express = require("express")
const router = express.Router()

const User = require('../models/User')
const Post = require("../models/Post")

router.get("/profile", async(req, res) => {
	if (!req.user) {
	  res.send("You are not logged in")
	}
	
	const userPosts =  await Post.find({ author: req.user })
	console.log(userPosts)
	res.render("profile/profile", { userPosts })
})

router.patch("/profile", async (req, res) => {
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
})

//register

module.exports = router