const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
	author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: String,
}, { collection: 'comments' }); // Explicitly setting the collection name

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;