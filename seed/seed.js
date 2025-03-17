require('dotenv').config()

const { faker } = require("@faker-js/faker")
const mongoose = require('mongoose');

const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');


const seedDB = async () => {
	const uri = process.env.MONGODB_URI
	await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
	
    //clear database	
	await Post.deleteMany({})
	await Comment.deleteMany({})
	await User.deleteMany({})
	
	//generate users
	const users = []
	for (let i = 0; i <5; i++){
		const firstName = faker.person.firstName()
		const lastName = faker.person.lastName()
		const user = await User.create({
			username: firstName + lastName,
			password: "1111",
			firstName: firstName,
			lastName: lastName,
			email: firstName + "." + lastName + "@gmail.com"
		})
		users.push(user)
		console.log(user)
	}
	
	const user = await User.create({
		username: "PanahPiruncharoen",
		password: "1111",
		firstName: "Panah",
		lastName: "piruncharoen",
		email: "pirun@gmail.com" ,
	})
	users.push(user)
	console.log(user)
		
	for (let i = 0; i <10; i++) {
		const post = await Post.create({
			title: faker.book.title(),
			author: users[Math.floor(Math.random() * users.length)],
			text: faker.lorem.paragraphs(),
			numLikes: Math.floor(Math.random() * 100),
		})

		for (let i = 0; i <5; i++) {
			await Comment.create({
				postId: post.id,
				author: users[Math.floor(Math.random() * users.length)],
				text: faker.lorem.paragraphs(),
			})
 		}
	}

	
	mongoose.connection.close()
}

seedDB()
