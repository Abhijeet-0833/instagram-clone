const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Get Conversations List
router.get('/conversations', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = db.prepare(`
      SELECT 
        u.id, u.username, u.avatar, u.fullName,
        (
          SELECT text FROM messages 
          WHERE (senderId = u.id AND receiverId = ?) OR (senderId = ? AND receiverId = u.id)
          ORDER BY createdAt DESC LIMIT 1
        ) as lastMessage
      FROM users u
      WHERE u.id IN (
        SELECT senderId FROM messages WHERE receiverId = ?
        UNION
        SELECT receiverId FROM messages WHERE senderId = ?
      )
      OR u.id IN (
        SELECT followingId FROM follows WHERE followerId = ?
      )
      LIMIT 30
    `).all(userId, userId, userId, userId, userId);

    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Messages with specific user
router.get('/:otherUserId', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    const messages = db.prepare(`
      SELECT id, senderId, receiverId, text, createdAt
      FROM messages
      WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?)
      ORDER BY createdAt ASC
    `).all(userId, otherUserId, otherUserId, userId);

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send a message
router.post('/', authenticateToken, (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ error: 'Receiver ID and text are required' });
    }

    const info = db.prepare('INSERT INTO messages (senderId, receiverId, text) VALUES (?, ?, ?)')
                   .run(senderId, receiverId, text);

    const message = db.prepare('SELECT id, senderId, receiverId, text, createdAt FROM messages WHERE id = ?')
                      .get(info.lastInsertRowid);

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
