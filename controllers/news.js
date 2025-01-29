const express = require("express")
const News = require("../model/newsModel");
const jwt = require("jsonwebtoken")

// Create News Article
const createNews = async (req, res) => {
  try {
    const { title, content, imageUrl, type } = req.body;
    const newArticle = new News({ title, content, imageUrl, type });
    await newArticle.save();
    res.status(201).json({ message: "News article created", news: newArticle });
  } catch (error) {
    res.status(500).json({ message: "Error creating news article", error });
  }
};

// Get All News
const getNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: "Error fetching news", error });
  }
};

// Get News by Type (Important, Most Read, General)
const getNewsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const news = await News.find({ type }).sort({ createdAt: -1 });
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categorized news", error });
  }
};

// Update News Article
const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedNews = await News.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedNews) return res.status(404).json({ message: "News article not found" });

    res.status(200).json({ message: "News article updated", news: updatedNews });
  } catch (error) {
    res.status(500).json({ message: "Error updating news article", error });
  }
};

// Delete News Article
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNews = await News.findByIdAndDelete(id);
    if (!deletedNews) return res.status(404).json({ message: "News article not found" });

    res.status(200).json({ message: "News article deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting news article", error });
  }
};

module.exports = { createNews, getNews, getNewsByType, updateNews, deleteNews };
