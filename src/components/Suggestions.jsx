import './Suggestions.css';

const Suggestions = ({ currentUser, suggestions }) => {
  return (
    <div className="suggestions-wrapper">
      {currentUser && (
        <div className="current-user">
          <div className="current-user-info">
            <img src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} alt={currentUser.username} className="current-user-avatar hover-scale" />
            <div>
              <span className="current-username">{currentUser.username}</span>
              <span className="current-fullname">{currentUser.fullName}</span>
            </div>
          </div>
          <button className="switch-btn">Switch</button>
        </div>
      )}

      <div className="suggestions-header">
        <span className="suggestions-title">Suggested for you</span>
        <button className="see-all-btn">See All</button>
      </div>

      <div>
        {suggestions.map(suggestion => (
          <div key={suggestion.id} className="suggestion-item">
            <div className="suggestion-info">
              <img src={suggestion.avatar} alt={suggestion.username} className="suggestion-avatar hover-scale" />
              <div>
                <span className="suggestion-username">{suggestion.username}</span>
                <span className="suggestion-relation">{suggestion.relation}</span>
              </div>
            </div>
            <button className="follow-btn">Follow</button>
          </div>
        ))}
      </div>

      <div className="footer-links">
        <a href="#" className="footer-link hover-underline">About</a>
        <a href="#" className="footer-link hover-underline">Help</a>
        <a href="#" className="footer-link hover-underline">Press</a>
        <a href="#" className="footer-link hover-underline">API</a>
        <a href="#" className="footer-link hover-underline">Jobs</a>
        <a href="#" className="footer-link hover-underline">Privacy</a>
        <a href="#" className="footer-link hover-underline">Terms</a>
        <a href="#" className="footer-link hover-underline">Locations</a>
        <a href="#" className="footer-link hover-underline">Language</a>
      </div>

      <div className="footer-copyright">
        © 2026 INSTAGRAM CLONE BY DEEPMIND
      </div>
    </div>
  );
};

export default Suggestions;
