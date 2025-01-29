const express = require("express");
const { createAd, getAds, updateAd, deleteAd } = require("../controllers/advertisement");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createAd); // Create Advertisement
router.get("/", getAds); // Get All Advertisements
router.put("/:id", authMiddleware, updateAd); // Update Advertisement
router.delete("/:id", authMiddleware, deleteAd); // Delete Advertisement

module.exports = router;
