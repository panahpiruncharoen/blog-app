const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	googleId: {
		type: String,
		unique: true,
	},
    username: String,
	password: String,
    firstName: String,
	lastName: String,
	email: String,
	profilePic: String,
}, { collection: 'users' }); // Explicitly setting the collection name

const User = mongoose.model("User", userSchema);

module.exports = User