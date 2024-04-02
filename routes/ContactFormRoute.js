const express = require("express");
const router = express.Router();
const contactFormController = require("../controllers/ContactFormController");

router.get("/", contactFormController.getAllNotifications);
router.post("/", contactFormController.postContactFormDetails);
router.put("/:id", contactFormController.updateNotification);
module.exports = router;
