import React, { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import StoryViewer from './StoryViewer';
import { useAuth } from '../context/AuthContext';
import './Stories.css';

const Stories = ({ refreshKey }) => {
  const [groupedStories, setGroupedStories] = useState([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const { user: currentUser, token } = useAuth();
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchStories();
  }, [token, refreshKey]);

  const fetchStories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/stories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGroupedStories(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStoryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('http://localhost:5000/api/stories', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        fetchStories();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNextUser = () => {
    if (selectedUserIndex < groupedStories.length - 1) {
      setSelectedUserIndex(selectedUserIndex + 1);
    } else {
      setSelectedUserIndex(null);
    }
  };

  const handlePrevUser = () => {
    if (selectedUserIndex > 0) {
      setSelectedUserIndex(selectedUserIndex - 1);
    } else {
      setSelectedUserIndex(null);
    }
  };

  const hasMyStory = groupedStories.some(g => g.user.id === currentUser.id);

  return (
    <div className="stories-container">
      {!hasMyStory && (
        <div className="story-item hover-scale" onClick={() => fileInputRef.current.click()}>
          <div className="story-avatar-container">
            <div className="story-avatar-inner">
              <img src={currentUser.avatar} alt="Your Story" className="story-avatar" />
              <div className="add-story-btn">
                <Plus size={14} color="white" />
              </div>
            </div>
          </div>
          <span className="story-username">Your story</span>
        </div>
      )}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*" 
        onChange={handleStoryUpload} 
      />

      {groupedStories.map((group, index) => (
        <div 
          key={group.user.id} 
          className="story-item hover-scale" 
          onClick={() => setSelectedUserIndex(index)}
        >
          <div className="story-avatar-container viewed">
            <div className="story-avatar-inner">
              <img src={group.user.avatar} alt={group.user.username} className="story-avatar" />
            </div>
          </div>
          <span className="story-username">{group.user.id === currentUser.id ? 'Your story' : group.user.username}</span>
        </div>
      ))}

      {selectedUserIndex !== null && (
        <StoryViewer 
          groupedStory={groupedStories[selectedUserIndex]} 
          onClose={() => setSelectedUserIndex(null)}
          onNextUser={handleNextUser}
          onPrevUser={handlePrevUser}
        />
      )}
    </div>
  );
};

export default Stories;
