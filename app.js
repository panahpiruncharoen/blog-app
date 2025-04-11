require('dotenv').config()

const express = require("express")
const methodOverride = require("method-override")
const connectDB = require('./config/db');  // Import the database connection function

const session = require('express-session');
const passport = require('passport');
require('./config/passport'); // make sure to import your passport config

const postRoutes = require('./routes/postRoutes')
const commentRoutes = require('./routes/commentRoutes')
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')

const User = require("./models/User")
// const userRoutes = require('routes/userRoutes')

const app = express()
connectDB()

// set view engine
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true}))
app.use(methodOverride('_method'))
app.use(express.urlencoded({}))
	
app.use(session({
  secret: 'your secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.get("/", (req, res) => {
	res.redirect("/posts")
})

app.use("/posts", postRoutes)
app.use("/comments", commentRoutes)
app.use("/users", userRoutes)
app.use("/auth", authRoutes)

app.get("/profile", (req, res) => {
	if (!req.user) {
	  res.send("You are not logged in")
	}
	
	res.render("profile/profile")
})

app.patch("/profile", async (req, res) => {
	if (!req.user) {
	  res.send("You are not logged in")
	}
	//console.log("try to update profile")
	//console.log(req.body)
	//console.log(req.user.id)
	
	const newUsername = req.body.username
	const newFirstName = req.body.firstName
	const newLastName = req.body.lastName
	const newEmail= req.body.email
	
	await User.findByIdAndUpdate(
		req.user.id,
		{$set: {username: newUsername, firstName: newFirstName, lastName: newLastName, email: newEmail}}
	)
	
	res.redirect("/profile")
})
// app.use("/users", userRoutes)

app.listen(3000, () => {
	console.log("SEVER IS RUNNING")
})


// POST Routes
// INDEX -> GET /posts
// SHOW -> GET /posts/:postId
// NEW -> GET /posts/new
// CREATE -> POST /posts
// EDIT -> GET /posts/:postID/edit
// UPDATE -> PATCH /posts/:postId
// DELETE -> DELETE /posts/:postId

// COMMENT Routes
// CREATE -> POST /posts/:postID/comments