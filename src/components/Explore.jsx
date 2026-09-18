import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Explore.css';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExplore = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/posts/explore', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExplore();
  }, [token]);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await fetch(`http://localhost:5000/api/users/search?q=${encodeURIComponent(searchQuery)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const timer = setTimeout(() => {
      fetchSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, token]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>Loading...</div>;

  return (
    <div className="explore-container">
      <div style={{ marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="Search for users..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            outline: 'none'
          }}
        />
        {searchResults.length > 0 && (
          <div style={{
            marginTop: '10px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px',
            padding: '10px'
          }}>
            {searchResults.map(user => (
              <div 
                key={user.id} 
                onClick={() => navigate(`/profile/${user.username}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  cursor: 'pointer'
                }}
                className="hover-scale"
              >
                <img src={user.avatar} alt="Avatar" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                <span style={{ color: 'white', fontWeight: 600 }}>{user.username}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="explore-grid">
        {posts.map(post => (
          <div key={post.id} className="explore-item" onClick={() => navigate(`/profile/${post.user.username}`)}>
            <img 
              src={post.image.startsWith('/') ? `http://localhost:5000${post.image}` : post.image} 
              alt="Explore" 
              className="explore-image" 
            />
            <div className="explore-overlay">
              <div className="explore-stat">
                <Heart fill="white" size={20} />
                <span>{post.likes}</span>
              </div>
              <div className="explore-stat">
                <MessageCircle fill="white" size={20} />
                <span>{post.comments.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {posts.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '50px' }}>
          No new posts to explore right now.
        </div>
      )}
    </div>
  );
};

export default Explore;
