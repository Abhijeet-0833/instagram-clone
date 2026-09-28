import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Register = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, fullName, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        login(data.token, data.user);
        navigate('/');
      } else {
        setError(data.error);
      }
    } catch {
      setError('Something went wrong');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-logo">Instagram</h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '20px', fontWeight: '600' }}>
          Sign up to see photos and videos from your friends.
        </p>
        {error && <div className="auth-error">{error}</div>}
        <form className="auth-form" onSubmit={handleRegister}>
          <input 
            type="text" 
            placeholder="Username" 
            className="auth-input" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Full Name" 
            className="auth-input" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="auth-input" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button type="submit" className="auth-btn">Sign up</button>
        </form>
      </div>
      <div className="auth-switch">
        Have an account? <Link to="/login" className="auth-link">Log in</Link>
      </div>
    </div>
  );
};

export default Register;
