const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
	password: String,
    firstName: String,
	lastName: String,
	email: String,
}, { collection: 'users' }); // Explicitly setting the collection name

const User = mongoose.model("User", userSchema);

module.exports = User