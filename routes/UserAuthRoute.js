const express = require("express");
const router = express.Router();
const UserAuthController = require("../controllers/UserAuthController");

router.get("/:id", UserAuthController.getUserInfoByID);

router.post("/", UserAuthController.verifyLogin);
router.post("/signup", UserAuthController.signUp);

router.put("/userUpdate", UserAuthController.updateUserDetails);
router.put("/resetPassword", UserAuthController.resetPassword);

module.exports = router;
