import React, { useState } from 'react';
import '../styles/SignUp.css';

interface SignUpProps {
  onSignUp: (username: string, email: string) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onSignUp(username, email);
    }, 1000);
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-header">
          <h1 className="signup-title">TCW1</h1>
          <p className="signup-subtitle">Create Your Account</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              disabled={loading}
            />
          </div>

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="demo-section">
          <p>Or try as a demo user:</p>
          <div className="demo-buttons">
            <button 
              onClick={() => onSignUp('user-001', 'user001@tcw1.demo')}
              className="demo-btn"
            >
              User 001
            </button>
            <button 
              onClick={() => onSignUp('user-002', 'user002@tcw1.demo')}
              className="demo-btn"
            >
              User 002
            </button>
            <button 
              onClick={() => onSignUp('user-003', 'user003@tcw1.demo')}
              className="demo-btn"
            >
              User 003
            </button>
          </div>
        </div>

        <div className="signup-footer">
          <p className="disclaimer">
            💡 Demo Application - Not for production use. All transactions are simulated.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
