import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';
import Sidebar from './components/Sidebar';
import TopHeaderMobile from './components/TopHeaderMobile';
import Feed from './components/Feed';
import Suggestions from './components/Suggestions';
import Login from './components/Login';
import Register from './components/Register';
import CreatePostModal from './components/CreatePostModal';
import Profile from './components/Profile';
import Explore from './components/Explore';
import Messages from './components/Messages';
import Reels from './components/Reels';
import Toast from './components/Toast';
import { stories, suggestions } from './data/mockData';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center h-full" style={{ minHeight: '100vh', color: 'var(--text-secondary)' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

const Home = ({ refreshKey }) => {
  const { user } = useAuth();
  return (
    <div className="home-layout">
      <div className="feed-container">
        <Feed stories={stories} refreshKey={refreshKey} />
      </div>
      <div className="suggestions-container">
        <Suggestions currentUser={user} suggestions={suggestions} />
      </div>
    </div>
  );
};

const MainLayout = ({ children }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const handlePostCreated = () => {
    setRefreshKey(prev => prev + 1);
    showToast('Post created successfully!');
  };

  return (
    <div className="app-container">
      {/* Top Header for Mobile */}
      <TopHeaderMobile onNotificationsClick={() => setIsNotificationsOpen(prev => !prev)} />

      {/* Main Sidebar & Mobile Bottom Nav */}
      <Sidebar 
        user={user} 
        onCreateClick={() => setIsModalOpen(true)}
        isNotificationsOpen={isNotificationsOpen}
        setIsNotificationsOpen={setIsNotificationsOpen}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      />
      
      {/* Content wrapper with responsive margins */}
      <div className="content-wrapper">
        <main className="main-content">
          {React.cloneElement(children, { refreshKey, showToast })}
        </main>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPostCreated={handlePostCreated} 
      />

      {/* Action Toast Feedback */}
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/reels" element={
            <ProtectedRoute>
              <MainLayout>
                <Reels />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/profile/:username" element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/explore" element={
            <ProtectedRoute>
              <MainLayout>
                <Explore />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/direct/inbox" element={
            <ProtectedRoute>
              <MainLayout>
                <Messages />
              </MainLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
