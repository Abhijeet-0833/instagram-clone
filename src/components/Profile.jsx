import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/users/${username}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
          setPosts(data.posts);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username, token]);

  const handleFollow = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${profile.id}/follow`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({
          ...profile,
          isFollowing: data.isFollowing,
          followersCount: data.isFollowing ? profile.followersCount + 1 : profile.followersCount - 1
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading profile...</div>;
  if (!profile) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>User not found</div>;

  const isOwnProfile = currentUser && currentUser.username === profile.username;

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="profile-top-mobile-wrapper">
          <div className="profile-avatar-container">
            <img src={profile.avatar} alt={profile.username} className="profile-avatar" />
          </div>
          
          <div className="profile-title-row">
            <h2 className="profile-username">{profile.username}</h2>
            {isOwnProfile ? (
              <button className="profile-action-btn">Edit profile</button>
            ) : (
              <button 
                className={`profile-action-btn ${profile.isFollowing ? '' : 'follow'}`} 
                onClick={handleFollow}
              >
                {profile.isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        <div className="profile-bio d-mobile-only">
          <div className="profile-fullname">{profile.fullName}</div>
          <div style={{ whiteSpace: 'pre-line' }}>{profile.bio}</div>
        </div>
      </header>

      <div className="profile-stats">
        <div><span className="stat-val">{profile.postsCount}</span> <span>posts</span></div>
        <div><span className="stat-val">{profile.followersCount}</span> <span>followers</span></div>
        <div><span className="stat-val">{profile.followingCount}</span> <span>following</span></div>
      </div>

      <div className="profile-tabs">
        <div className="profile-tab active">
          <Grid size={12} /> POSTS
        </div>
      </div>

      <div className="profile-grid">
        {posts.map(post => (
          <div key={post.id} className="grid-item">
            <img src={post.image.startsWith('/') ? `http://localhost:5000${post.image}` : post.image} alt="Post" className="grid-image" />
            <div className="grid-overlay">
              <div className="grid-stat">
                <Heart fill="white" size={20} />
                <span>{post.likesCount}</span>
              </div>
              <div className="grid-stat">
                <MessageCircle fill="white" size={20} />
                <span>{post.commentsCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
