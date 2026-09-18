import React, { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, Music, Volume2, VolumeX, MoreVertical } from 'lucide-react';
import './Reels.css';

const sampleReels = [
  {
    id: 1,
    username: 'alex_adventures',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1187-large.mp4',
    coverImage: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=800',
    caption: 'Breathtaking mountain sunset views! 🌄✨ #nature #adventure #travel',
    musicTrack: 'Original Audio - alex_adventures • Mountain Chill Beats',
    likes: '42.8K',
    comments: '892',
    isLiked: false
  },
  {
    id: 2,
    username: 'tech_insider',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-a-coder-working-on-his-laptop-computer-41584-large.mp4',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    caption: 'Building React 19 apps in 2026! 🚀💻 #coding #webdev #reactjs',
    musicTrack: 'Cyberpunk Lo-Fi - Code Beats',
    likes: '128.4K',
    comments: '3.4K',
    isLiked: true
  },
  {
    id: 3,
    username: 'foodie_delights',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-cup-of-hot-coffee-41005-large.mp4',
    coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
    caption: 'Freshly brewed morning artisan espresso ☕🥐 #coffeetime #foodie',
    musicTrack: 'Morning Jazz - Cafe Vibez',
    likes: '89.1K',
    comments: '1.2K',
    isLiked: false
  }
];

const Reels = () => {
  const [reelsState, setReelsState] = useState(sampleReels);
  const [muted, setMuted] = useState(false);
  const [doubleTapHeart, setDoubleTapHeart] = useState(null);

  const handleLikeToggle = (id) => {
    setReelsState(prev => prev.map(reel => {
      if (reel.id === id) {
        return {
          ...reel,
          isLiked: !reel.isLiked,
        };
      }
      return reel;
    }));
  };

  const handleDoubleTap = (id) => {
    setDoubleTapHeart(id);
    setReelsState(prev => prev.map(reel => {
      if (reel.id === id) {
        return { ...reel, isLiked: true };
      }
      return reel;
    }));
    setTimeout(() => {
      setDoubleTapHeart(null);
    }, 850);
  };

  return (
    <div className="reels-feed-container">
      {reelsState.map((reel) => (
        <div key={reel.id} className="reel-card">
          {/* Reel Media / Video Player */}
          <div className="reel-video-wrapper" onDoubleClick={() => handleDoubleTap(reel.id)}>
            <video
              src={reel.videoUrl}
              poster={reel.coverImage}
              className="reel-video"
              loop
              autoPlay
              muted={muted}
              playsInline
            />

            {/* 2D Heart Pop Animation on Double-Tap */}
            {doubleTapHeart === reel.id && (
              <div className="reel-heart-pop">
                <Heart size={110} fill="#ff3040" color="#ff3040" />
              </div>
            )}

            {/* Audio Mute Toggle Indicator */}
            <button className="reel-mute-btn" onClick={() => setMuted(!muted)}>
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>

          {/* Reel Right Action Sidebar */}
          <div className="reel-actions-column">
            <button 
              className="reel-action-btn" 
              onClick={() => handleLikeToggle(reel.id)}
            >
              <Heart 
                size={28} 
                fill={reel.isLiked ? "#ff3040" : "none"} 
                color={reel.isLiked ? "#ff3040" : "white"} 
                className={reel.isLiked ? "heart-pop" : ""}
              />
              <span className="reel-action-count">{reel.likes}</span>
            </button>

            <button className="reel-action-btn">
              <MessageCircle size={28} color="white" />
              <span className="reel-action-count">{reel.comments}</span>
            </button>

            <button className="reel-action-btn">
              <Send size={28} color="white" />
            </button>

            <button className="reel-action-btn">
              <Bookmark size={28} color="white" />
            </button>

            <button className="reel-action-btn">
              <MoreVertical size={24} color="white" />
            </button>

            {/* 2D Rotating Vinyl Music Disc */}
            <div className="spinning-vinyl-disc">
              <img src={reel.userAvatar} alt="Audio Disc" className="disc-image" />
            </div>
          </div>

          {/* Reel Bottom Overlay Info */}
          <div className="reel-bottom-info">
            <div className="reel-user-row">
              <img src={reel.userAvatar} alt={reel.username} className="reel-user-avatar" />
              <span className="reel-username">{reel.username}</span>
              <button className="reel-follow-btn">Follow</button>
            </div>

            <p className="reel-caption">{reel.caption}</p>

            <div className="reel-audio-ticker">
              <Music size={14} className="ticker-icon" />
              <span className="ticker-text">{reel.musicTrack}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reels;
