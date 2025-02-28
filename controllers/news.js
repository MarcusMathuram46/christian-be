const express = require('express')
const mongoose = require('mongoose')
const News = require('../model/newsModel')
const jwt = require('jsonwebtoken')

// ---------------------------- Create News Article ----------------------------
const createNews = async (req, res) => {
  try {
    const { title, description, type } = req.body;
    const image = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      : null;

    if (!title || !image || !description) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const newArticle = new News({ title, image, description, type })
    await newArticle.save()
    res.status(201).json({ message: 'News article created', news: newArticle })
  } catch (error) {
    res.status(500).json({ message: 'Error creating news article', error })
  }
}

// ---------------------------- Get All News ----------------------------
const getNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 })
    res.status(200).json(news)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news', error })
  }
}

// ---------------------------- Get News by Type ----------------------------
const getNewsByType = async (req, res) => {
  try {
    const { type } = req.params
    if (!['important', 'most-read', 'general'].includes(type)) {
      return res.status(400).json({ message: 'Invalid news category' })
    }

    const news = await News.find({ type }).sort({ createdAt: -1 })
    res.status(200).json(news)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categorized news', error })
  }
}

// ---------------------------- Update News Article ----------------------------
const updateNews = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid news ID' })
    }

    const { title, description, type, existingImage } = req.body
    const image = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      : existingImage // Preserve existing image if not changed

    const updatedNews = await News.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(title && { title }),
          ...(description && { description }),
          ...(type && { type }),
          ...(image && { image }),
        },
      },
      { new: true }
    )

    if (!updatedNews)
      return res.status(404).json({ message: 'News article not found' })

    res.status(200).json({ message: 'News article updated', news: updatedNews })
  } catch (error) {
    res.status(500).json({ message: 'Error updating news article', error })
  }
}

// ---------------------------- Delete Single News Article ----------------------------
const deleteNews = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid news ID' })
    }

    const deletedNews = await News.findByIdAndDelete(id)
    if (!deletedNews)
      return res.status(404).json({ message: 'News article not found' })

    res.status(200).json({ message: 'News article deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting news article', error })
  }
}

// ---------------------------- Delete Multiple News Articles ----------------------------
const deleteSelectNews = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { ids } = req.body // Use `req.query` instead of `req.body`

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: 'No news IDs provided' })
    }

    // Validate IDs
    const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id))

    if (validIds.length === 0) {
      return res.status(400).json({ message: 'Invalid news IDs' })
    }
    const result = await News.deleteMany({ _id: { $in: validIds } })
    // await News.deleteMany({ _id: { $in: validIds } })

    res
      .status(200)
      .json({
      message: `${result.deletedCount} message: Selected news articles deleted successfully` })
  } catch (error) {
    console.error('Error deleting news articles:', error)
    res
      .status(500)
      .json({ message: 'Error deleting news articles', error: error.message })
  }
}

module.exports = {
  createNews,
  getNews,
  getNewsByType,
  updateNews,
  deleteNews,
  deleteSelectNews,
}
