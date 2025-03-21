require('dotenv').config()

const express = require("express")
const methodOverride = require("method-override")
const connectDB = require('./config/db');  // Import the database connection function

const postRoutes = require('./routes/postRoutes')
const commentRoutes = require('./routes/commentRoutes')
// const userRoutes = require('routes/userRoutes')

const app = express()
connectDB()

// set view engine
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true}))
app.use(methodOverride('_method'))
app.use(express.urlencoded({}))
	
app.get("/", (req, res) => {
	res.redirect("/posts")
})

app.use("/posts", postRoutes)
app.use("/comments", commentRoutes)
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