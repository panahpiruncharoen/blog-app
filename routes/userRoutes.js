const express = require("express")
const router = express.Router()

const userController = require('../controllers/userController.js')

router.get("/profile", userController.getUserProfile)

router.patch("/profile", userController.updateUserProfile)

//register

module.exports = router