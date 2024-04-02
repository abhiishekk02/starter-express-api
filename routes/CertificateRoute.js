// routes/certificateRouter.js
const express = require("express");
const router = express.Router();
const certificateController = require("../controllers/CertificateController");

// Define routes for certificate-related operations
router.get("/verify/:id", certificateController.getCertificateByUID);

router.get("/", certificateController.getAllCertificates);
router.post("/", certificateController.createCertificate);
router.put("/:id", certificateController.updateCertificate);
router.delete("/:id", certificateController.deleteCertificate);

module.exports = router;
