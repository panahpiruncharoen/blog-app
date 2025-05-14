const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
	author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: String,
	numLikes: Number,
	isPublished: Boolean,
	isDeleted: Boolean,
	likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { collection: 'posts' }); // Explicitly setting the collection name

const Post = mongoose.model("Post", postSchema);

module.exports = Post