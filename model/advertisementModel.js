const mongoose = require("mongoose")

const adSchema = new mongoose.Schema({
    title: String,
    imageUrl: String,
    link: String,
    createdAt: { type: Date, default: Date.now } 
})

module.exports = mongoose.model("Advertisement", adSchema);