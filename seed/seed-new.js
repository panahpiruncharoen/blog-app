require('dotenv').config()
const path = require('path')
const fs = require('fs').promises

const { faker } = require("@faker-js/faker")
const mongoose = require('mongoose');

const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const disconnectDB = async () => {
  await mongoose.disconnect()
}

const clearDB = async ()  => {
	await Comment.deleteMany({})
	await Post.deleteMany({})
	await User.deleteMany({})
}     
const createUsers = async (numUsers) => {
  const avatarsPath = path.join(__dirname, '..', 'public', 'avatars');
  const avatarFiles = await fs.readdir(avatarsPath)
	
  console.time("Create Users")
  const userPromises = Array.from({ length: numUsers }).map(() => {
    const firstName = faker.person.firstName()
	const lastName = faker.person.lastName()
	return User.create({
	   googleId: Math.floor(Math.random() * 1000000000000),
	   username: firstName + lastName,
	   password: "1111",
	   firstName: firstName,
	   lastName: lastName,
       email: firstName + "." + lastName + "@gmail.com",
	   profilePic: avatarFiles[Math.floor(Math.random() * avatarFiles.length)],
	 })
  })
  const users = await Promise.all(userPromises)
  
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
	
  console.timeEnd("Create Users")
  console.log(`${users.length} posts created`)
  return users
}


const createPosts = async (minPosts, maxPosts, users) => {
  console.time("Create Posts")
  const postPromises = []
  for (const u of users) {
	const numPosts = Math.floor(Math.random() * (maxPosts - minPosts + 1)) + minPosts
	for (let i = 0; i < numPosts; i++) {
	  const post = Post.create({
		title: faker.book.title(),
		author: users[Math.floor(Math.random() * users.length)],
		text: faker.lorem.paragraphs(),
		numLikes: 0,
		isPublished: true,
		isDeleted: false,
		likedBy: [],
	  })
	  postPromises.push(post)
	}
  }
  const posts = await Promise.all(postPromises)
  console.timeEnd("Create Posts")
  console.log(`${posts.length} posts created`)
  return posts
}

const createComments = async (minComments, maxComments, users, posts) => {
  console.time("Create Comments")
  const commentPromises = []
  for (const p of posts) {
	const numComments = Math.floor(Math.random() * (maxComments - minComments + 1)) + minComments
	for (let i = 0; i < numComments; i++) {
	  const comment = Comment.create({
		postId: p.id,
		author: users[Math.floor(Math.random() * users.length)],
		text: faker.lorem.sentence(),
	   })
	  commentPromises.push(comment)
	}
  }
  const comments = await Promise.all(commentPromises)
  console.timeEnd("Create Comments")
  console.log(`${comments.length} comments created`)
  return comments
}

const createLikes = async (minLikes, maxLikes, users, posts) => { 
  console.time("Create Likes") 
  const LikePromises = [] 
  for (const p of posts) { 
	const numLikes = Math.floor(Math.random() * (maxLikes - minLikes + 1)) + minLikes
	
  for (let i = users.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [users[i], users[j]] = [users[j], users[i]];
  }
	  
	for (let i = 0; i < numLikes; i++) { 
	   p.likedBy.push(users[i])
	   p.numLikes += 1
	}
	  
	   const like = p.save()
	   LikePromises.push(like) 
	} 
  const likes = await Promise.all(LikePromises) 
  console.timeEnd("Create Likes") 
  console.log(`${likes.length} likes created`) 
  return likes
}

const run = async () => {
  await connectDB()
	await clearDB()
  const users = await createUsers(50)
  const posts = await createPosts(3, 6, users)
  const comments = await createComments(3, 6, users, posts)
  const likes = await createLikes(3, 6, users, posts)
  await disconnectDB()
}

run()