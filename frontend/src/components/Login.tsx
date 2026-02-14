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

  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    window.location.href = `${backendUrl}/api/auth/google`;
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

        <div className="divider">
          <span>OR</span>
        </div>

        <button 
          type="button" 
          className="google-login-btn" 
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </g>
          </svg>
          Sign in with Google
        </button>

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
