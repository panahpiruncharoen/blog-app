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

const createUsers = async (numUsers) => {
  console.time("Create Users")
  const userPromises = Array.from({ length: numUsers }).map(() => {
    const firstName = faker.person.firstName()
	const lastName = faker.person.lastName()
	return User.create({
	   username: firstName + lastName,
	   password: "1111",
	   firstName: firstName,
	   lastName: lastName,
       email: firstName + "." + lastName + "@gmail.com",
	   profilePic: "default.png",
	 })
  })
  const users = await Promise.all(userPromises)
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

const run = async () => {
  await connectDB()
  const users = await createUsers(100)
  const posts = await createPosts(3, 8, users)
  const comments = await createComments(3, 6, users, posts)
  await disconnectDB()
}

run()