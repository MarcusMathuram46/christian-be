const express = require("express");
const {
  createNews,
  getNews,
  getNewsByType,
  updateNews,
  deleteNews,
  deleteSelectNews,
} = require('../controllers/news')
const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

router.post("/",  upload.single("image"),verifyToken, createNews); // Create News
router.get("/", getNews); // Get All News
router.get("/:type", getNewsByType); // Get News by Type (important, most-read, general)
router.patch("/:id",  upload.single("image"),verifyToken, updateNews); // Update News
router.delete("/:id", verifyToken, deleteNews); // Delete News

router.delete("/", verifyToken, deleteSelectNews); // Delete selected News

module.exports = router;
