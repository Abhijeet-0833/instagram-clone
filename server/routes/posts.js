const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Get all posts (Feed)
router.get('/', authenticateToken, (req, res) => {
  try {
    const currentUserId = req.user.id;
    
    // In a real app, this would only fetch from followed users. 
    // Here we fetch all posts for simplicity, ordered by newest.
    const postsQuery = db.prepare(`
      SELECT 
        p.id, p.image, p.caption, p.location, p.createdAt,
        u.id as userId, u.username as userUsername, u.avatar as userAvatar,
        (SELECT COUNT(*) FROM likes WHERE postId = p.id) as likesCount,
        EXISTS(SELECT 1 FROM likes WHERE postId = p.id AND userId = ?) as isLiked
      FROM posts p
      JOIN users u ON p.userId = u.id
      ORDER BY p.createdAt DESC
    `);
    
    const postsRaw = postsQuery.all(currentUserId);
    
    // Fetch comments for each post
    const posts = postsRaw.map(post => {
      const comments = db.prepare(`
        SELECT c.id, c.text, u.username 
        FROM comments c 
        JOIN users u ON c.userId = u.id 
        WHERE c.postId = ? 
        ORDER BY c.createdAt ASC
      `).all(post.id);
      
      return {
        id: post.id,
        image: post.image,
        caption: post.caption,
        location: post.location,
        timestamp: post.createdAt,
        likes: post.likesCount,
        isLiked: post.isLiked === 1,
        user: {
          id: post.userId,
          username: post.userUsername,
          avatar: post.userAvatar
        },
        comments
      };
    });
    
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Explore posts (random or non-followed)
router.get('/explore', authenticateToken, (req, res) => {
  try {
    const currentUserId = req.user.id;
    
    // SQLite uses RANDOM() instead of RAND()
    const postsQuery = db.prepare(`
      SELECT 
        p.id, p.image, p.caption, p.location, p.createdAt,
        u.id as userId, u.username as userUsername, u.avatar as userAvatar,
        (SELECT COUNT(*) FROM likes WHERE postId = p.id) as likesCount,
        EXISTS(SELECT 1 FROM likes WHERE postId = p.id AND userId = ?) as isLiked
      FROM posts p
      JOIN users u ON p.userId = u.id
      WHERE p.userId != ? 
        AND p.userId NOT IN (SELECT followingId FROM follows WHERE followerId = ?)
      ORDER BY RANDOM()
      LIMIT 30
    `);
    
    const postsRaw = postsQuery.all(currentUserId, currentUserId, currentUserId);
    
    const posts = postsRaw.map(post => {
      const comments = db.prepare(`
        SELECT c.id, c.text, u.username 
        FROM comments c 
        JOIN users u ON c.userId = u.id 
        WHERE c.postId = ? 
        ORDER BY c.createdAt ASC
      `).all(post.id);
      
      return {
        id: post.id,
        image: post.image,
        caption: post.caption,
        location: post.location,
        timestamp: post.createdAt,
        likes: post.likesCount,
        isLiked: post.isLiked === 1,
        user: {
          id: post.userId,
          username: post.userUsername,
          avatar: post.userAvatar
        },
        comments
      };
    });
    
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new post
router.post('/', authenticateToken, upload.single('image'), (req, res) => {
  try {
    const { caption, location } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const insertStmt = db.prepare('INSERT INTO posts (userId, image, caption, location) VALUES (?, ?, ?, ?)');
    const info = insertStmt.run(req.user.id, imageUrl, caption || '', location || '');
    
    res.status(201).json({
      message: 'Post created successfully',
      post: {
        id: info.lastInsertRowid,
        image: imageUrl,
        caption,
        location
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle Like
router.post('/:id/like', authenticateToken, (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    
    // Check if post exists
    const post = db.prepare('SELECT id, userId FROM posts WHERE id = ?').get(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    const existingLike = db.prepare('SELECT id FROM likes WHERE postId = ? AND userId = ?').get(postId, userId);
    
    if (existingLike) {
      db.prepare('DELETE FROM likes WHERE postId = ? AND userId = ?').run(postId, userId);
      res.json({ message: 'Post unliked', isLiked: false });
    } else {
      db.prepare('INSERT INTO likes (postId, userId) VALUES (?, ?)').run(postId, userId);
      // Create notification
      if (post.userId !== userId) {
        db.prepare('INSERT INTO notifications (userId, actorId, type, postId) VALUES (?, ?, ?, ?)')
          .run(post.userId, userId, 'like', postId);
      }
      res.json({ message: 'Post liked', isLiked: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add Comment
router.post('/:id/comment', authenticateToken, (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { text } = req.body;
    
    if (!text) return res.status(400).json({ error: 'Comment text is required' });
    
    const post = db.prepare('SELECT id, userId FROM posts WHERE id = ?').get(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    const insertStmt = db.prepare('INSERT INTO comments (postId, userId, text) VALUES (?, ?, ?)');
    const info = insertStmt.run(postId, userId, text);
    
    // Create notification
    if (post.userId !== userId) {
      db.prepare('INSERT INTO notifications (userId, actorId, type, postId) VALUES (?, ?, ?, ?)')
        .run(post.userId, userId, 'comment', postId);
    }
    
    // Get username for response
    const user = db.prepare('SELECT username FROM users WHERE id = ?').get(userId);
    
    res.status(201).json({
      message: 'Comment added',
      comment: {
        id: info.lastInsertRowid,
        text,
        username: user.username
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
