const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Search Users
router.get('/search', authenticateToken, (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    
    const users = db.prepare(`
      SELECT id, username, fullName, avatar 
      FROM users 
      WHERE username LIKE ? OR fullName LIKE ?
      LIMIT 10
    `).all(`%${q}%`, `%${q}%`);
    
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Profile Info and Posts
router.get('/:username', authenticateToken, (req, res) => {
  try {
    const { username } = req.params;
    const currentUserId = req.user.id;

    const user = db.prepare('SELECT id, username, fullName, bio, avatar, createdAt FROM users WHERE username = ?').get(username);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Get social stats
    const postsCount = db.prepare('SELECT COUNT(*) as count FROM posts WHERE userId = ?').get(user.id).count;
    const followersCount = db.prepare('SELECT COUNT(*) as count FROM follows WHERE followingId = ?').get(user.id).count;
    const followingCount = db.prepare('SELECT COUNT(*) as count FROM follows WHERE followerId = ?').get(user.id).count;

    // Check if current user is following this profile
    const isFollowing = db.prepare('SELECT 1 FROM follows WHERE followerId = ? AND followingId = ?').get(currentUserId, user.id);

    // Get user's posts
    const posts = db.prepare(`
      SELECT 
        p.id, p.image, p.caption, p.location, p.createdAt,
        (SELECT COUNT(*) FROM likes WHERE postId = p.id) as likesCount,
        (SELECT COUNT(*) FROM comments WHERE postId = p.id) as commentsCount
      FROM posts p
      WHERE p.userId = ?
      ORDER BY p.createdAt DESC
    `).all(user.id);

    res.json({
      profile: {
        ...user,
        postsCount,
        followersCount,
        followingCount,
        isFollowing: !!isFollowing
      },
      posts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle Follow
router.post('/:id/follow', authenticateToken, (req, res) => {
  try {
    const followingId = req.params.id;
    const followerId = req.user.id;

    if (followingId == followerId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const existingFollow = db.prepare('SELECT 1 FROM follows WHERE followerId = ? AND followingId = ?').get(followerId, followingId);

    if (existingFollow) {
      db.prepare('DELETE FROM follows WHERE followerId = ? AND followingId = ?').run(followerId, followingId);
      res.json({ message: 'Unfollowed', isFollowing: false });
    } else {
      db.prepare('INSERT INTO follows (followerId, followingId) VALUES (?, ?)').run(followerId, followingId);
      // Create notification
      db.prepare('INSERT INTO notifications (userId, actorId, type) VALUES (?, ?, ?)')
        .run(followingId, followerId, 'follow');
        
      res.json({ message: 'Followed', isFollowing: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Edit Profile (Bio)
router.post('/edit', authenticateToken, (req, res) => {
  try {
    const { bio, fullName } = req.body;
    db.prepare('UPDATE users SET bio = ?, fullName = ? WHERE id = ?').run(bio || '', fullName, req.user.id);
    res.json({ message: 'Profile updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
