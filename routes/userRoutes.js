const express = require("express")
const router = express.Router()

const userController = require('../controllers/userController.js')

router.get("/profile", userController.getUserProfile)

router.patch("/profile", userController.updateUserProfile)

router.patch("/updateProfilePic", userController.updateProfilePic)


//register

module.exports = router