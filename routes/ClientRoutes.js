const express = require("express");
const router = express.Router();
const clientController = require("../controllers/ClientControllers");
router.get("/", clientController.getAllClientDetails);
router.post("/", clientController.postClientDetails);
router.delete("/:id", clientController.deleteClientDetails);
router.put("/:id", clientController.updateClientDetails);
router.get(
  "/getUpcomingReCertifications",
  clientController.getAllReClientDetails
);

router.get("/getFirstSurveillanceDate", clientController.getFirstSurveillance);
router.get(
  "/getSecondSurveillanceDate",
  clientController.getSecondSurveillance
);

module.exports = router;
