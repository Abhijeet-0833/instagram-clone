import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './EditProfileModal.css';

const EditProfileModal = ({ profile, isOpen, onClose, onProfileUpdated }) => {
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:5000/api/users/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ fullName, bio })
      });

      if (res.ok) {
        onProfileUpdated({ fullName, bio });
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="edit-modal-content">
        <div className="edit-modal-header">
          <h3>Edit profile</h3>
          <button className="edit-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="edit-user-preview">
            <img src={profile?.avatar} alt={profile?.username} className="edit-avatar" />
            <div className="edit-user-meta">
              <span className="edit-username">{profile?.username}</span>
              <span className="edit-subtitle">{profile?.fullName}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Name"
              required
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write your bio..."
              rows={3}
            />
          </div>

          <div className="edit-modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
