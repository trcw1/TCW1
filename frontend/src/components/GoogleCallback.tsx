import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loading from './Loading';
import '../styles/Auth.css';

export const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = () => {
      const token = searchParams.get('token');
      const userStr = searchParams.get('user');
      const error = searchParams.get('error');

      if (error) {
        console.error('Google authentication failed:', error);
        navigate('/login?error=google_auth_failed');
        return;
      }

      if (token && userStr) {
        try {
          const user = JSON.parse(decodeURIComponent(userStr));
          
          // Save authentication data
          localStorage.setItem('tcw1_token', token);
          localStorage.setItem('tcw1_user', JSON.stringify(user));
          localStorage.setItem('isAdmin', user.isAdmin ? 'true' : 'false');
          
          // Redirect to dashboard
          navigate('/');
        } catch (err) {
          console.error('Failed to parse user data:', err);
          navigate('/login?error=invalid_response');
        }
      } else {
        navigate('/login?error=missing_data');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="auth-container">
      <Loading />
    </div>
  );
};

export default GoogleCallback;
