import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SearchPanel.css';

const SearchPanel = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/users/search?q=${encodeURIComponent(query)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, token]);

  if (!isOpen) return null;

  return (
    <>
      <div className="search-backdrop" onClick={onClose} />
      <div className="search-panel open">
        <div className="search-header">
          <h2>Search</h2>
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button className="clear-btn" onClick={() => setQuery('')}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="search-results">
          {loading && <div className="search-message">Searching...</div>}
          {!loading && query && results.length === 0 && (
            <div className="search-message">No results found for "{query}".</div>
          )}
          {!loading && !query && (
            <div className="search-message">Type a username or name to search users.</div>
          )}
          {results.map(user => (
            <div 
              key={user.id} 
              className="search-result-item"
              onClick={() => {
                onClose();
                navigate(`/profile/${user.username}`);
              }}
            >
              <img src={user.avatar} alt={user.username} className="result-avatar" />
              <div className="result-info">
                <span className="result-username">{user.username}</span>
                <span className="result-fullname">{user.fullName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchPanel;
