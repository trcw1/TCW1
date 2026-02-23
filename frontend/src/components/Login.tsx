import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import '../styles/Auth.css';

interface LoginProps {
  onLoginSuccess?: () => void;
  onShowSignUp?: () => void;
}

export const Login = ({ onLoginSuccess, onShowSignUp }: LoginProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpToken, setTotpToken] = useState('');
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        totpToken: requiresTwoFactor ? totpToken : undefined
      });

      if (response.data.success) {
        // Save token
        localStorage.setItem('tcw1_token', response.data.token);
        localStorage.setItem('tcw1_user', JSON.stringify(response.data.user));
        localStorage.setItem('isAdmin', response.data.user.isAdmin ? 'true' : 'false');
        
        onLoginSuccess?.();
        navigate('/');
      } else if (response.data.message === '2FA_REQUIRED') {
        setRequiresTwoFactor(true);
        setPassword('');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login to TCW1</h1>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          {!requiresTwoFactor ? (
            <>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
            </>
          ) : (
            <div className="form-group">
              <label>Two-Factor Code</label>
              <input
                type="text"
                value={totpToken}
                onChange={(e) => setTotpToken(e.target.value)}
                placeholder="000000"
                maxLength={6}
                required
                disabled={loading}
              />
              <p className="help-text">Enter the 6-digit code from your authenticator app</p>
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : requiresTwoFactor ? 'Verify 2FA' : 'Login'}
          </button>
        </form>

        <p className="switch-auth">
          Don't have an account?{' '}
          <button type="button" className="link-button" onClick={onShowSignUp}>
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
