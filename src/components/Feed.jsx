import { useState, useEffect, useCallback } from 'react';
import Stories from './Stories';
import Post from './Post';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Feed = ({ stories, refreshKey }) => {
  const [posts, setPosts] = useState([]);
  const { token } = useAuth();

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Failed to fetch posts', error);
    }
  }, [token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, refreshKey]);

  return (
    <div style={{ width: '100%', maxWidth: '470px', margin: '0 auto' }}>
      <Stories stories={stories} />
      <div>
        {posts.length > 0 ? (
          posts.map(post => (
            <Post key={post.id} post={post} />
          ))
        ) : (
          <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-secondary)' }}>
            No posts yet. Be the first to post!
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
