const bcrypt = require('bcrypt');
const db = require('./db');

async function seed() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  
  if (userCount === 0) {
    console.log('Seeding initial demo database content...');
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const insertUser = db.prepare('INSERT INTO users (username, fullName, password, bio, avatar) VALUES (?, ?, ?, ?, ?)');
    const alex = insertUser.run('alex_design', 'Alex Morgan', hashedPassword, 'UI/UX Designer & Creator ✨\nSan Francisco, CA 📍', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
    const sarah = insertUser.run('sarah_travels', 'Sarah Jenkins', hashedPassword, 'Wanderlust ✈️ | Exploring the world one city at a time', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80');
    const john = insertUser.run('john_doe', 'John Doe', hashedPassword, 'Developer & Tech Enthusiast 💻', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80');
    
    const insertPost = db.prepare('INSERT INTO posts (userId, image, caption, location) VALUES (?, ?, ?, ?)');
    const p1 = insertPost.run(alex.lastInsertRowid, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', 'Exploring abstract minimal 3D design concepts 🎨', 'San Francisco, California');
    const p2 = insertPost.run(sarah.lastInsertRowid, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80', 'Breathtaking views from high up in the mountains 🏔️✨', 'Swiss Alps');
    const p3 = insertPost.run(john.lastInsertRowid, 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80', 'Late night coding sessions & fresh coffee ☕💻', 'Seattle, WA');
    
    const insertLike = db.prepare('INSERT INTO likes (postId, userId) VALUES (?, ?)');
    insertLike.run(p1.lastInsertRowid, sarah.lastInsertRowid);
    insertLike.run(p1.lastInsertRowid, john.lastInsertRowid);
    insertLike.run(p2.lastInsertRowid, alex.lastInsertRowid);

    const insertComment = db.prepare('INSERT INTO comments (postId, userId, text) VALUES (?, ?, ?)');
    insertComment.run(p1.lastInsertRowid, sarah.lastInsertRowid, 'This aesthetic is incredible! 🔥');
    insertComment.run(p2.lastInsertRowid, alex.lastInsertRowid, 'Wish I was there right now!');

    const insertStory = db.prepare('INSERT INTO stories (userId, image) VALUES (?, ?)');
    insertStory.run(alex.lastInsertRowid, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500');
    insertStory.run(sarah.lastInsertRowid, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500');

    console.log('Seed completed successfully!');
  } else {
    console.log(`Database already has ${userCount} users, skipping seed.`);
  }
}

seed().catch(console.error);
