const express = require("express");
const router = express.Router();
const showcaseController = require("../controllers/ShowCaseController");

router.get("/", showcaseController.getAllImages);
router.get("/archive", showcaseController.getAllArchiveImages);
router.post("/", showcaseController.createImage);
router.put("/:id", showcaseController.updateImage);
router.delete("/:id", showcaseController.deleteImage);
router.post("/archive/:id", showcaseController.archiveImage);
router.post("/unarchive/:id", showcaseController.unArchiveImage);

module.exports = router;
