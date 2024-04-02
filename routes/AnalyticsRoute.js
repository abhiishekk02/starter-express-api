const express = require("express");
const router = express.Router();
const AnalyticsController = require("../controllers/AnalyticsController");

router.get("/", AnalyticsController.getAnalyticsData);
module.exports = router;
