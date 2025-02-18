const express = require("express");
const mongoose = require("mongoose");
const Advertisement = require("../model/advertisementModel");
const jwt = require("jsonwebtoken");

// Create Advertisement
const createAd = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    : null;
    if (!title || !image || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAd = new Advertisement({ title, image, description });
    await newAd.save();
    res.status(201).json({ message: "Advertisement created", ad: newAd });
  } catch (error) {
    res.status(500).json({ message: "Error creating advertisement", error });
  }
};

// Get All Advertisements
const getAds = async (req, res) => {
  try {
    const ads = await Advertisement.find().sort({ createdAt: -1 });
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching advertisements", error });
  }
};

// Update Advertisement
const updateAd = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid advertisement ID' })
    }

    const { title, description, existingImage } = req.body
    const image = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      : existingImage // Keep old image if no new one is uploaded

    const updatedAd = await Advertisement.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(title && { title }),
          ...(description && { description }),
          ...(image && { image }), // Preserve existing image if not changed
        },
      },
      { new: true }
    )

    if (!updatedAd) return res.status(404).json({ message: 'Ad not found' })

    res.status(200).json({ message: 'Advertisement updated', ad: updatedAd })
  } catch (error) {
    res.status(500).json({ message: 'Error updating advertisement', error })
  }
}


// Delete Advertisement
const deleteAd = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid advertisement ID' })
    }

    const deletedAd = await Advertisement.findByIdAndDelete(id)
    if (!deletedAd) return res.status(404).json({ message: 'Ad not found' })

    res.status(200).json({ message: 'Advertisement deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting advertisement', error })
  }
}

const deleteSelectAd = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { ids } = req.query // Use `req.query` instead of `req.body`

    if (!ids) {
      return res.status(400).json({ message: 'No advertisement IDs provided' })
    }

    // Validate IDs
    const validIds = ids
      .split(',')
      .filter((id) => mongoose.Types.ObjectId.isValid(id))

    if (validIds.length === 0) {
      return res.status(400).json({ message: 'Invalid advertisement IDs' })
    }

    await Advertisement.deleteMany({ _id: { $in: validIds } })

    res
      .status(200)
      .json({ message: 'Selected advertisements deleted successfully' })
  } catch (error) {
    console.error('Error deleting advertisements:', error)
    res
      .status(500)
      .json({ message: 'Error deleting advertisements', error: error.message })
  }
}


module.exports = { createAd, getAds, updateAd, deleteAd, deleteSelectAd };
