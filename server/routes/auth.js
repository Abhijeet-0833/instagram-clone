const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development_only';

// Register User
router.post('/register', async (req, res) => {
  try {
    const { username, fullName, password, avatar } = req.body;
    
    if (!username || !fullName || !password) {
      return res.status(400).json({ error: 'Username, Full Name, and Password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const insertStmt = db.prepare('INSERT INTO users (username, fullName, password, avatar) VALUES (?, ?, ?, ?)');
    
    // Provide default avatar if not specified
    const userAvatar = avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80';
    
    const info = insertStmt.run(username, fullName, hashedPassword, userAvatar);
    
    const token = jwt.sign({ id: info.lastInsertRowid, username }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: info.lastInsertRowid, username, fullName, avatar: userAvatar }
    });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Username already exists' });
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and Password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    
    // Don't send password back
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Current User Info
const authenticateToken = require('../middleware/auth');
router.get('/me', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT id, username, fullName, avatar, createdAt FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

module.exports = router;
