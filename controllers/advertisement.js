const express = require("express")
const Advertisement = require("../model/advertisementModel")
const jwt = require("jsonwebtoken")


// Create Advertisement
const createAd = async (req, res) => {
  try {
    const { title, imageUrl, link } = req.body;
    const newAd = new Advertisement({ title, imageUrl, link });
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
const updateAd = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAd = await Advertisement.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedAd) return res.status(404).json({ message: "Ad not found" });

    res.status(200).json({ message: "Advertisement updated", ad: updatedAd });
  } catch (error) {
    res.status(500).json({ message: "Error updating advertisement", error });
  }
};

// Delete Advertisement
const deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAd = await Advertisement.findByIdAndDelete(id);
    if (!deletedAd) return res.status(404).json({ message: "Ad not found" });

    res.status(200).json({ message: "Advertisement deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting advertisement", error });
  }
};

module.exports = { createAd, getAds, updateAd, deleteAd };
