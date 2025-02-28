const express = require("express");
const {
  createAd,
  getAds,
  getAdsByType,
  updateAd,
  deleteAd,
  deleteSelectAd,
} = require('../controllers/advertisement')
const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

// Advertisement Routes
router.post("/", upload.single("image"),verifyToken, createAd); // Create Advertisement (Protected)
router.get("/", getAds); // Get All Advertisements (Public)
router.get("/:type", getAdsByType); // Get Advertisement by Type (important, most-read, general) (Public)
router.patch("/:id", upload.single("image"),verifyToken, updateAd); // Update Advertisement (Protected)
router.delete("/:id", verifyToken, deleteAd); // Delete Advertisement (Protected)
router.delete("/", verifyToken, deleteSelectAd);

module.exports = router;
