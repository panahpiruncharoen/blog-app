const express = require("express")
const router = express.Router()

const commentController = require('../controllers/commentController.js')
const Comment = require('../models/Comment')

// DELETE = delete one post
router.delete("/:commentId", commentController.deleteOneComment)

//MANAGE COMMENTS
router.post("/manageComments", commentController.manageComments)

module.exports = router