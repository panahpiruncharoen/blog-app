const Post = require('../models/Post')
const User = require('../models/User')

exports.searchUserOrPost = async (req, res) => {
	const query = req.query.q
	
	//search posts by title
	const postResult = await Post.find({ title: { $regex: query, $options: "i" } }).select("_id title")
	console.log(postResult)
	
	// search users by username, first name, or last name
	const userResult = await User.find({
		$or: [
		  { username: { $regex: query, $options: "i" }} ,
		  { firstName: { $regex: query, $options: "i" }} ,
		  { lastName: { $regex: query, $options: "i" }} ,
		]
	}).select("_id firstName lastName")
	console.log(userResult)
	
	res.render("search/postOrUser", { postResult, userResult })
 }