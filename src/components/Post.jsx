import { useState, useRef } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Post.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Post = ({ post, showToast }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isSaved, setIsSaved] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const commentInputRef = useRef(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleLikeToggle = async (forceLike = false) => {
    const nextLikedState = forceLike ? true : !isLiked;
    if (nextLikedState === isLiked && !forceLike) return;

    setIsLiked(nextLikedState);
    setLikesCount(prev => (nextLikedState ? prev + (isLiked ? 0 : 1) : prev - 1));

    try {
      await fetch(`${API_BASE_URL}/api/posts/${post.id}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Like failed', error);
      setIsLiked(isLiked);
      setLikesCount(prev => (isLiked ? prev + 1 : prev - 1));
    }
  };

  const handleDoubleTap = () => {
    setShowHeartPop(true);
    if (!isLiked) {
      handleLikeToggle(true);
    }
    setTimeout(() => {
      setShowHeartPop(false);
    }, 900);
  };

  const handleShareClick = () => {
    const postUrl = `${window.location.origin}/profile/${post.user.username}`;
    navigator.clipboard.writeText(postUrl);
    if (showToast) {
      showToast('Link copied to clipboard!');
    }
  };

  const handleBookmarkToggle = () => {
    setIsSaved(!isSaved);
    if (showToast) {
      showToast(isSaved ? 'Removed from saved' : 'Saved to collection');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/posts/${post.id}/comment`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ text: commentText })
      });
      if (res.ok) {
        const data = await res.json();
        setComments([...comments, data.comment]);
        setCommentText('');
        if (showToast) {
          showToast('Comment posted!');
        }
      }
    } catch (error) {
      console.error('Comment failed', error);
    }
  };

  return (
    <article className="post-container">
      {/* Post Header */}
      <div className="post-header">
        <div className="post-user-info" onClick={() => navigate(`/profile/${post.user.username}`)}>
          <div className="avatar-story-ring">
            <img src={post.user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} alt={post.user.username} className="post-avatar" />
          </div>
          <div className="flex flex-col">
            <span className="post-username">{post.user.username} <span className="post-time">• {new Date(post.timestamp).toLocaleDateString()}</span></span>
            {post.location && <span className="post-location">{post.location}</span>}
          </div>
        </div>
        <MoreHorizontal className="post-more" size={20} onClick={() => setShowMoreMenu(true)} />
      </div>

      {/* Post Image Container with Double Tap Animation */}
      <div className="post-image-container" onDoubleClick={handleDoubleTap}>
        <img 
          src={post.image.startsWith('/') ? `${API_BASE_URL}${post.image}` : post.image} 
          alt="Post content" 
          className="post-image" 
        />
        {showHeartPop && (
          <div className="heart-pop-animation">
            <Heart size={100} fill="#ff3040" color="#ff3040" />
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="post-actions">
        <div className="action-left">
          <Heart 
            className={`action-icon heart-btn ${isLiked ? 'liked heart-pop' : ''}`} 
            size={24} 
            onClick={() => handleLikeToggle()}
            fill={isLiked ? "#ff3040" : "none"}
            color={isLiked ? "#ff3040" : "currentColor"}
          />
          <MessageCircle 
            className="action-icon hover-scale" 
            size={24} 
            onClick={() => commentInputRef.current?.focus()}
          />
          <Send 
            className="action-icon hover-scale" 
            size={24} 
            onClick={handleShareClick}
          />
        </div>
        <div className="action-right">
          <Bookmark 
            className={`action-icon ${isSaved ? 'saved-pop' : ''}`} 
            size={24} 
            onClick={handleBookmarkToggle}
            fill={isSaved ? "currentColor" : "none"}
          />
        </div>
      </div>

      {/* Likes Count */}
      <div className="post-likes">
        {likesCount.toLocaleString()} likes
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="post-caption">
          <span className="post-username" onClick={() => navigate(`/profile/${post.user.username}`)}>{post.user.username}</span> {post.caption}
        </div>
      )}

      {/* Comments */}
      {comments.length > 2 && (
        <div className="post-comments-count">
          View all {comments.length} comments
        </div>
      )}

      {comments.slice(-2).map(comment => (
        <div key={comment.id} className="post-comment">
          <span className="post-username" onClick={() => navigate(`/profile/${comment.username}`)}>{comment.username}</span> {comment.text}
        </div>
      ))}

      {/* Comment Input */}
      <form className="add-comment" onSubmit={handleCommentSubmit}>
        <input 
          ref={commentInputRef}
          type="text" 
          placeholder="Add a comment..." 
          className="comment-input" 
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button type="submit" className="post-btn" disabled={!commentText.trim()}>Post</button>
      </form>

      {/* More Options Modal */}
      {showMoreMenu && (
        <div className="modal-overlay" onClick={() => setShowMoreMenu(false)}>
          <div className="post-more-menu" onClick={e => e.stopPropagation()}>
            <button className="more-menu-item text-danger" onClick={() => { setShowMoreMenu(false); handleShareClick(); }}>
              Copy link
            </button>
            <button className="more-menu-item" onClick={() => { setShowMoreMenu(false); navigate(`/profile/${post.user.username}`); }}>
              Go to profile
            </button>
            <button className="more-menu-item" onClick={() => setShowMoreMenu(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </article>
  );
};

export default Post;
