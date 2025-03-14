const express = require("express")
const router = express.Router()

const postController = require('../controllers/postController.js')

// INDEX - show all posts
router.get("/", postController.getAllPosts)

// NEW - show new post form
router.get("/new", postController.getNewPostForm)

// CREATE - creates a new post
router.post("/", postController.createNewPost)

// SHOW - show one post
router.get("/:postId", postController.getOnePost)

// EDIT - show form to edit post
router.get("/:postId/edit", postController.getEditPostForm)

// UPDATE - updates one post
router.patch("/:postId", postController.updatePost)

// DELETE = delete one post
router.delete("/:postId", postController.deleteOnePost)

//CREATE - creates a new comments
router.post("/:postId/comments", postController.createComment)

module.exports = router