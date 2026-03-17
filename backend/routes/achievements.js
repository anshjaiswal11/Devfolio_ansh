const express = require('express')
const router = express.Router()
const Achievement = require('../models/Achievement')
const { protect, adminOnly } = require('../middleware/auth')

// @route   GET /api/achievements
// @desc    Get all achievements
// @access  Public
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ order: 1, createdAt: -1 })
    res.json({ achievements })
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching achievements', error: err.message })
  }
})

// @route   GET /api/achievements/:id
// @desc    Get single achievement by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id)
    if (!achievement) return res.status(404).json({ message: 'Achievement not found' })
    res.json({ achievement })
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Achievement not found' })
    }
    res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/achievements
// @desc    Create an achievement
// @access  Private
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const achievement = new Achievement(req.body)
    const saved = await achievement.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: 'Error creating achievement', error: err.message })
  }
})

// @route   PUT /api/achievements/:id
// @desc    Update an achievement
// @access  Private
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const updated = await Achievement.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
    if (!updated) return res.status(404).json({ message: 'Achievement not found' })
    res.json(updated)
  } catch (err) {
    res.status(400).json({ message: 'Error updating achievement', error: err.message })
  }
})

// @route   DELETE /api/achievements/:id
// @desc    Delete an achievement
// @access  Private
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id)
    if (!achievement) return res.status(404).json({ message: 'Achievement not found' })

    await achievement.deleteOne()
    res.json({ message: 'Achievement removed' })
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Achievement not found' })
    }
    res.status(500).json({ message: 'Server error' })
  }
})



module.exports = router
