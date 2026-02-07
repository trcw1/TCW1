import { useState } from 'react';
import { api } from '../services/api';
import { useToast } from './Toast';
import TwoFactorSetup from './TwoFactorSetup';
import '../styles/AccountSettings.css';

const AccountSettings = () => {
  const { showToast } = useToast();
  const token = localStorage.getItem('tcw1_token') || '';
  const user = JSON.parse(localStorage.getItem('tcw1_user') || '{}');

  const [activeTab, setActiveTab] = useState<'password' | 'security'>('password');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user.twoFactorEnabled || false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        '/auth/change-password',
        { oldPassword: currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showToast('Password changed successfully', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(response.data.message || 'Password change failed', 'error');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Password change failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!window.confirm('Are you sure? You\'ll need to enter your password.')) {
      return;
    }

    const password = prompt('Enter your password to disable 2FA:');
    if (!password) return;

    setLoading(true);

    try {
      const response = await api.post(
        '/auth/2fa/disable',
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setTwoFactorEnabled(false);
        showToast('2FA disabled successfully', 'success');
      } else {
        showToast(response.data.message || '2FA disable failed', 'error');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || '2FA disable failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handle2FASuccess = () => {
    setTwoFactorEnabled(true);
    showToast('2FA enabled successfully', 'success');
  };

  return (
    <div className="account-settings">
      <div className="settings-container">
        <h1>Account Settings</h1>

        <div className="user-info">
          <h2>{user.firstName} {user.lastName}</h2>
          <p>{user.email}</p>
        </div>

        <div className="tabs">
          <button
            onClick={() => setActiveTab('password')}
            className={`tab ${activeTab === 'password' ? 'active' : ''}`}
          >
            Change Password
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`tab ${activeTab === 'security' ? 'active' : ''}`}
          >
            Security
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="password-form">
              <h3>Change Your Password</h3>

              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                />
                <p className="help-text">At least 8 characters</p>
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}

          {activeTab === 'security' && (
            <div className="security-settings">
              <h3>Two-Factor Authentication</h3>

              <div className={`security-item ${twoFactorEnabled ? 'enabled' : 'disabled'}`}>
                <div className="security-info">
                  <h4>Two-Factor Authentication (2FA)</h4>
                  <p>
                    {twoFactorEnabled
                      ? '✓ 2FA is enabled on your account'
                      : 'Add an extra layer of security to your account'}
                  </p>
                </div>

                <button
                  onClick={() => twoFactorEnabled ? handleDisable2FA() : setShow2FASetup(true)}
                  disabled={loading}
                  className={`btn-security ${twoFactorEnabled ? 'disable' : 'enable'}`}
                >
                  {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                </button>
              </div>

              <div className="security-tips">
                <h4>Security Tips:</h4>
                <ul>
                  <li>Use a strong, unique password</li>
                  <li>Enable 2FA for extra protection</li>
                  <li>Never share your backup codes</li>
                  <li>Review login activity regularly</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <TwoFactorSetup
        isOpen={show2FASetup}
        token={token}
        onClose={() => setShow2FASetup(false)}
        onSuccess={handle2FASuccess}
      />
    </div>
  );
};

export default AccountSettings;
