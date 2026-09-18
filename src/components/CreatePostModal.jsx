import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './CreatePostModal.css';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { token } = useAuth();

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleShare = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('caption', caption);
    formData.append('location', location);

    try {
      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        onPostCreated();
        handleClose();
      } else {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setCaption('');
    setLocation('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ width: 24 }}></div>
          <span>Create new post</span>
          <X className="modal-close" onClick={handleClose} />
        </div>
        
        <div className="modal-body">
          <div className="image-preview-container">
            {preview ? (
              <img src={preview} alt="Preview" className="image-preview" />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <ImageIcon size={48} />
                <button className="custom-file-btn" onClick={() => fileInputRef.current.click()}>
                  Select from computer
                </button>
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="file-input" 
            accept="image/*" 
            onChange={handleFileChange}
          />

          {preview && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <textarea 
                className="caption-input" 
                placeholder="Write a caption..." 
                value={caption}
                onChange={e => setCaption(e.target.value)}
                rows={3}
              />
              <input 
                className="caption-input" 
                placeholder="Add location" 
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>
          )}
        </div>

        {preview && (
          <div className="modal-footer">
            <button className="share-btn" onClick={handleShare} disabled={loading}>
              {loading ? 'Sharing...' : 'Share'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePostModal;
