const Comment = require('../models/Comment')

exports.deleteOneComment = async (req, res) => {
	const commentId = req.params.commentId
	const deletedComment = await Comment.findByIdAndDelete(commentId) 
	console.log(deletedComment)
	res.redirect(`/posts/${deletedComment.postId}`)
}