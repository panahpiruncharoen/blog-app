require('dotenv').config()

const { faker } = require("@faker-js/faker")
const mongoose = require('mongoose');

const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

const path = require('path')
const fs = require('fs').promises

const seedDB = async () => {
	//load avata pic file name
	const avatarsPath = path.join(__dirname, '..', 'public', 'avatars');
	let avatarFiles = await fs.readdir(avatarsPath)

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
	
	for (let i = 0; i < avatarFiles.length -1; i++){
		const firstName = faker.person.firstName()
		const lastName = faker.person.lastName()
		const user = await User.create({
			username: firstName + lastName,
			password: "1111",
			firstName: firstName,
			lastName: lastName,
			email: firstName + "." + lastName + "@gmail.com",
			profilePic: avatarFiles[i],
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
	    profilePic: avatarFiles[avatarFiles.length-1]
	})
	users.push(user)
	console.log(user)
	//generate post like and comments
	for (const u of users) {
		const numPosts = Math.floor(Math.random() * 6)
		for (let i = 0; i < numPosts; i++) {
			//create new post
			const post = await Post.create({
				title: faker.book.title(),
				author: users[Math.floor(Math.random() * users.length)],
				text: faker.lorem.paragraphs(),
				numLikes: 0,
				isPublished: true,
				isDeleted: false,
				likedBy: [],
			})
			// create like by user
			for (let i = 0; i <100; i++) {
			   const user = users[Math.floor(Math.random() * users.length)]
			   if(!post.likedBy.includes(user.id)) {
				  post.likedBy.push(user.id)
				  post.numLikes += 1
				  await post.save()
				}
			}
			const numComments = Math.floor(Math.random() * 9) + 2
			for (let i = 0; i < numComments; i++) {
				await Comment.create({
					postId: post.id,
					author: users[Math.floor(Math.random() * users.length)],
					text: faker.lorem.paragraphs(),
				})
			}
		}
	}
	
	mongoose.connection.close()
}

seedDB()
