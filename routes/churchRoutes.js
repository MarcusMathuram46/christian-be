const express = require('express')
const { createChurch, updateChurch, getAllChurch, deleteChurch } = require("../controllers/church")
const verifyToken = require('../middleware/verifyToken')
const upload = require('../middleware/uploadMiddleware')
const router = express.Router()

router.post('/', upload.single('image'), verifyToken, createChurch) // Create Church (Protected)
router.get('/', getAllChurch) // Get All Advertisements (Public)
// router.get('/:type', getAdsByType) // Get Advertisement by Type (important, most-read, general) (Public)
router.patch('/:id', upload.single('image'), verifyToken, updateChurch) // Update Advertisement (Protected)
router.delete('/:id', verifyToken, deleteChurch) // Delete Advertisement (Protected)
// router.delete('/', verifyToken, deleteSelectAd)

module.exports = router
