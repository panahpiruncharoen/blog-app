const express = require("express")
const router = express.Router()

const searchController = require('../controllers/searchController.js')

router.get("/", searchController.searchUserOrPost)

module.exports = router