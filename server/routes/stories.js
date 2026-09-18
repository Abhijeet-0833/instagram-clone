const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Get stories from the last 24 hours
router.get('/', authenticateToken, (req, res) => {
  try {
    // We group stories by user. For SQLite, datetime('now', '-1 day') is used.
    const stories = db.prepare(`
      SELECT s.id, s.image, s.createdAt, u.id as userId, u.username, u.avatar
      FROM stories s
      JOIN users u ON s.userId = u.id
      WHERE s.createdAt >= datetime('now', '-1 day')
      ORDER BY s.createdAt ASC
    `).all();

    // Group by user
    const groupedStories = {};
    stories.forEach(story => {
      if (!groupedStories[story.userId]) {
        groupedStories[story.userId] = {
          user: {
            id: story.userId,
            username: story.username,
            avatar: story.avatar
          },
          items: []
        };
      }
      groupedStories[story.userId].items.push({
        id: story.id,
        image: story.image,
        createdAt: story.createdAt
      });
    });

    res.json(Object.values(groupedStories));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload a new story
router.post('/', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const imagePath = '/uploads/' + req.file.filename;
    
    const info = db.prepare('INSERT INTO stories (userId, image) VALUES (?, ?)').run(req.user.id, imagePath);

    res.status(201).json({ id: info.lastInsertRowid, image: imagePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
