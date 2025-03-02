const express = require('express')
const {
  createEnquiry,
  getAllEnquiries,
  deleteSelectedEnquiries,
} = require('../controllers/enquiry')

const router = express.Router()

router.post('/', createEnquiry)
router.get('/', getAllEnquiries)
router.delete('/', deleteSelectedEnquiries)

module.exports = router
