const express = require('express')
const mongoose = require('mongoose')
const News = require('../model/newsModel')
const jwt = require('jsonwebtoken')

const createChurch=async(req,res)=>{
  try {
    const { name, pastor, description, image, phone, location, address } =
      req.body
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
    res.status(500).json({ error: 'Failed to fetch churches' })
  }
}
const updateChurch= async(req, res)=>{
  try {
    const updatedChurch = await Church.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json(updatedChurch)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update church' })
  }
}
const deleteChurch = async(req,res)=>{
  try {
    await Church.findByIdAndDelete(req.params.id)
    res.json({ message: 'Church deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete church' })
  }
}

module.exports = { createChurch, updateChurch, getAllChurch, deleteChurch }