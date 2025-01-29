const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: String,
  content: String,
  imageUrl: String,
  type: { type: String, enum: ["important", "most-read", "general"] }, // Categorizing news
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("News", newsSchema);
