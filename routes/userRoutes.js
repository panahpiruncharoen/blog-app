const express = require("express")
const router = express.Router()
const upload = require('../middlewares/upload');

const userController = require('../controllers/userController.js')

router.get("/profile", userController.getUserProfile)

router.patch("/profile", userController.updateUserProfile)

router.patch("/updateProfilePic", userController.updateProfilePic)

router.get("/:userId", userController.getPublicProfile)

router.post('/upload-profile-pic', upload.single('profilePic'), userController.uploadProfilePic);

module.exports = router