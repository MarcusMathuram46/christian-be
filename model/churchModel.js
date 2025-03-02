const mongoose = require('mongoose')

const churchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    pastor: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // Store image URL
    phone: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Church', churchSchema)
