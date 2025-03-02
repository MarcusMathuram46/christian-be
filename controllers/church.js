const express = require('express')
const mongoose = require('mongoose')
const Church = require("../model/churchModel")
const jwt = require('jsonwebtoken')

const createChurch=async(req,res)=>{
  try {
    const { name, pastor, description, phone, location, address } =
      req.body;
      const image = req.file
        ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
        : null;
        if (!name || !pastor ||!phone ||!address || !image || !description) {
          return res.status(400).json({ message: 'All fields are required' })
        }
    const newChurch = new Church({
      name,
      pastor,
      description,
      image,
      phone,
      location,
      address,
    })
    await newChurch.save()
    res.status(201).json(newChurch)
  } catch (error) {
    res.status(500).json({ error: 'Failed to add church' })
  }
}


const getAllChurch=async(req, res)=>{
  try {
    const churches = await Church.find()
    res.json(churches)
  } catch (error) {
    console.error('Error fetching churches:', error) // Log the actual error
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
// ✅ Update Church (Preserve existing image if not changed)
const updateChurch = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid church ID' })
    }

    const { name, location, description, existingImage } = req.body
    const image = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      : existingImage // Keep old image if no new one is uploaded

    const updatedChurch = await Church.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(name && { name }),
          ...(location && { location }),
          ...(description && { description }),
          ...(image && { image }),
        },
      },
      { new: true }
    )

    if (!updatedChurch) return res.status(404).json({ message: 'Church not found' })

    res.status(200).json({ message: 'Church updated', church: updatedChurch })
  } catch (error) {
    res.status(500).json({ message: 'Error updating church', error })
  }
}

// ✅ Delete Single Church
const deleteChurch = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid church ID' })
    }

    const deletedChurch = await Church.findByIdAndDelete(id)
    if (!deletedChurch) return res.status(404).json({ message: 'Church not found' })

    res.status(200).json({ message: 'Church deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting church', error })
  }
}

// ✅ Bulk Delete Selected Churches
const deleteSelectedChurches = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { ids } = req.body // Expect an array of church IDs

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: 'Invalid church IDs' })
    }

    const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id))

    if (validIds.length === 0) {
      return res.status(400).json({ message: 'No valid church IDs provided' })
    }

    const result = await Church.deleteMany({ _id: { $in: validIds } })

    res.status(200).json({
      message: `${result.deletedCount} churches deleted successfully`,
    })
  } catch (error) {
    console.error('Error deleting churches:', error)
    res.status(500).json({ message: 'Error deleting churches', error: error.message })
  }
}

module.exports = {
  createChurch,
  updateChurch,
  getAllChurch,
  deleteChurch,
  deleteSelectedChurches,
}