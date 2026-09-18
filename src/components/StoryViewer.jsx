import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import './StoryViewer.css';

const StoryViewer = ({ groupedStory, onClose, onNextUser, onPrevUser }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const items = groupedStory?.items || [];
  const currentItem = items[currentIndex];

  useEffect(() => {
    if (!currentItem) return;

    setProgress(0);
    const duration = 5000;
    const intervalTime = 50;
    const step = (100 / (duration / intervalTime));

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev + step >= 100) {
          clearInterval(timer);
          handleNext();
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentIndex, currentItem]);

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onNextUser();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      onPrevUser();
    }
  };

  if (!groupedStory || !currentItem) return null;

  return (
    <div className="story-viewer-overlay">
      <button className="story-close" onClick={onClose}>
        <X size={30} color="white" />
      </button>

      <div className="story-viewer-content">
        <div className="story-progress-container">
          {items.map((item, idx) => (
            <div key={item.id} className="story-progress-bar">
              <div 
                className="story-progress-fill"
                style={{ 
                  width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%' 
                }}
              />
            </div>
          ))}
        </div>

        <div className="story-header">
          <img src={groupedStory.user.avatar} alt="Avatar" className="story-header-avatar" />
          <span className="story-header-username">{groupedStory.user.username}</span>
        </div>

        <img src={`http://localhost:5000${currentItem.image}`} alt="Story" className="story-media" />

        <div className="story-nav left" onClick={handlePrev}>
          <ChevronLeft color="white" size={40} />
        </div>
        <div className="story-nav right" onClick={handleNext}>
          <ChevronRight color="white" size={40} />
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
