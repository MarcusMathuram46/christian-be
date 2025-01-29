const express = require("express");
const { createNews, getNews, getNewsByType, updateNews, deleteNews } = require("../controllers/news");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createNews); // Create News
router.get("/", getNews); // Get All News
router.get("/:type", getNewsByType); // Get News by Type (important, most-read, general)
router.put("/:id", authMiddleware, updateNews); // Update News
router.delete("/:id", authMiddleware, deleteNews); // Delete News

module.exports = router;
