require('dotenv').config()

const { faker } = require("@faker-js/faker")
const mongoose = require('mongoose');

const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

const avatarFiles = [
  'Multiavatar-0a8cfb1aa82ed11bfc.png',
  'Multiavatar-396dc8e5ad16fda317.png',
  'Multiavatar-51239ec171822cc676.png',
  'Multiavatar-566c550b0ace8024e3.png',
  'Multiavatar-6b13757759fb397340.png',
  'Multiavatar-7f33866c2bfef17bb9.png',
  'Multiavatar-9940031e954565d7b3.png',
  'Multiavatar-c60e71e703bd8dc49f.png',
  'Multiavatar-d4fea7d358cc2a114b.png',
  'Multiavatar-fdda1ec08ff1ab10e5.png'
]

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
			email: firstName + "." + lastName + "@gmail.com",
			profilePic: avatarFiles[Math.floor(Math.random() * avatarFiles.length)],
		})
		users.push(user)
		console.log(user)
	}
	
	const user = await User.create({
		googleId: "109407193493067603310",
		username: "PanahPiruncharoen",
		password: "1111",
		firstName: "Panah",
		lastName: "piruncharoen",
		email: "panahpirun@gmail.com" ,
	    profilePic: "Multiavatar-566c550b0ace8024e3.png",
	})
	users.push(user)
	console.log(user)
		
	for (let i = 0; i <10; i++) {
		const post = await Post.create({
			title: faker.book.title(),
			author: users[Math.floor(Math.random() * users.length)],
			text: faker.lorem.paragraphs(),
			numLikes: Math.floor(Math.random() * 100),
			isPublished: true,
			isDeleted: false,
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
