import { Heart, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './TopHeaderMobile.css';

const TopHeaderMobile = ({ onNotificationsClick }) => {
  const navigate = useNavigate();

  return (
    <header className="mobile-header">
      <div className="mobile-header-left" onClick={() => navigate('/')}>
        <span className="mobile-logo-text">Instagram</span>
      </div>
      <div className="mobile-header-right">
        <button className="mobile-icon-btn" onClick={onNotificationsClick} aria-label="Notifications">
          <Heart size={24} />
        </button>
        <button className="mobile-icon-btn" onClick={() => navigate('/direct/inbox')} aria-label="Messages">
          <MessageCircle size={24} />
        </button>
      </div>
    </header>
  );
};

export default TopHeaderMobile;
