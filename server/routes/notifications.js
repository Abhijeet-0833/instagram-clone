const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Get Notifications
router.get('/', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = db.prepare(`
      SELECT 
        n.id, n.type, n.postId, n.createdAt,
        u.id as actorId, u.username as actorUsername, u.avatar as actorAvatar,
        p.image as postImage
      FROM notifications n
      JOIN users u ON n.actorId = u.id
      LEFT JOIN posts p ON n.postId = p.id
      WHERE n.userId = ?
      ORDER BY n.createdAt DESC
      LIMIT 50
    `).all(userId);

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
