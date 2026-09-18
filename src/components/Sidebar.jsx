import React from 'react';
import { Home, Search, Compass, Film, MessageCircle, Heart, PlusSquare, Menu, Camera, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Notifications from './Notifications';
import SearchPanel from './SearchPanel';
import './Sidebar.css';

const Sidebar = ({ 
  user, 
  onCreateClick, 
  isNotificationsOpen, 
  setIsNotificationsOpen,
  isSearchOpen,
  setIsSearchOpen 
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="sidebar-container">
        <div className="logo-container" onClick={() => navigate('/')}>
          <span className="logo-text">Instagram</span>
          <Camera className="logo-icon hover-scale" style={{ display: 'none' }} size={24} />
        </div>

        <div className="nav-links">
          <a 
            className={`nav-item ${isActive('/') ? 'active-nav' : ''}`} 
            onClick={() => navigate('/')}
          >
            <Home size={24} strokeWidth={isActive('/') ? 2.8 : 2} />
            <span className={`nav-text ${isActive('/') ? 'bold' : ''}`}>Home</span>
          </a>

          <a 
            className="nav-item nav-item-hide-mobile"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search size={24} />
            <span className="nav-text">Search</span>
          </a>

          <a 
            className={`nav-item ${isActive('/explore') ? 'active-nav' : ''}`} 
            onClick={() => navigate('/explore')}
          >
            <Compass size={24} strokeWidth={isActive('/explore') ? 2.8 : 2} />
            <span className={`nav-text ${isActive('/explore') ? 'bold' : ''}`}>Explore</span>
          </a>

          <a 
            className={`nav-item ${isActive('/reels') ? 'active-nav' : ''}`}
            onClick={() => navigate('/reels')}
          >
            <Film size={24} strokeWidth={isActive('/reels') ? 2.8 : 2} />
            <span className={`nav-text ${isActive('/reels') ? 'bold' : ''}`}>Reels</span>
          </a>

          <a 
            className={`nav-item nav-item-hide-mobile ${isActive('/direct/inbox') ? 'active-nav' : ''}`} 
            onClick={() => navigate('/direct/inbox')}
          >
            <MessageCircle size={24} strokeWidth={isActive('/direct/inbox') ? 2.8 : 2} />
            <span className={`nav-text ${isActive('/direct/inbox') ? 'bold' : ''}`}>Messages</span>
          </a>

          <a 
            className="nav-item nav-item-hide-mobile" 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <Heart size={24} />
            <span className="nav-text">Notifications</span>
          </a>

          <a className="nav-item" onClick={onCreateClick}>
            <PlusSquare size={24} />
            <span className="nav-text">Create</span>
          </a>

          <a 
            className={`nav-item ${isActive(`/profile/${user?.username}`) ? 'active-nav' : ''}`} 
            onClick={() => navigate(`/profile/${user?.username}`)}
          >
            <img 
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
              alt="Profile" 
              className={`avatar-small ${isActive(`/profile/${user?.username}`) ? 'avatar-active' : ''}`} 
            />
            <span className={`nav-text ${isActive(`/profile/${user?.username}`) ? 'bold' : ''}`}>Profile</span>
          </a>
        </div>

        <div className="more-menu">
          <a className="nav-item" onClick={logout}>
            <LogOut size={24} />
            <span className="nav-text">Logout</span>
          </a>
          <a className="nav-item" onClick={logout}>
            <Menu size={24} />
            <span className="nav-text">More</span>
          </a>
        </div>

        <SearchPanel isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        <Notifications isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
      </div>
    </>
  );
};

export default Sidebar;
