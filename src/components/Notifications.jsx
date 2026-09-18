import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Notifications.css';

const Notifications = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, token]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + 'd';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + 'h';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + 'm';
    return Math.floor(seconds) + 's';
  };

  return (
    <>
      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }} onClick={onClose} />
      )}
      <div className={`notifications-panel ${isOpen ? 'open' : ''}`}>
        <div className="notifications-header">Notifications</div>
        <div className="notifications-content">
          {notifications.length === 0 && (
            <div style={{ padding: '24px', color: 'var(--text-secondary)', textAlign: 'center' }}>
              No notifications yet.
            </div>
          )}
          {notifications.map(notif => (
            <div key={notif.id} className="notification-item">
              <img 
                src={notif.actorAvatar} 
                alt={notif.actorUsername} 
                className="notification-avatar hover-scale"
                onClick={() => { onClose(); navigate(`/profile/${notif.actorUsername}`); }}
              />
              <div className="notification-text">
                <strong onClick={() => { onClose(); navigate(`/profile/${notif.actorUsername}`); }}>
                  {notif.actorUsername}
                </strong>{' '}
                {notif.type === 'like' && 'liked your post.'}
                {notif.type === 'comment' && 'commented on your post.'}
                {notif.type === 'follow' && 'started following you.'}
                {' '}<span className="notification-time">{getTimeAgo(notif.createdAt)}</span>
              </div>
              {notif.postImage && (
                <img 
                  src={notif.postImage.startsWith('/') ? `http://localhost:5000${notif.postImage}` : notif.postImage} 
                  alt="Post" 
                  className="notification-target"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Notifications;
