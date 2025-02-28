const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true }, // URL of the image
    description: { type: String, required: true },
    type: { type: String, enum: ['important', 'most-read', 'general'] }, // Categorizing news
    createdAt: { type: Date, default: Date.now },
  },{ timestamps: true })

module.exports = mongoose.model("News", newsSchema);
