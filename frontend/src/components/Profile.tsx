import React from 'react';
import './Profile.css';

const user = {
  name: 'demo user',
  email: 'demo@tcw1.org',
  avatar: '/logo.svg',
  bio: 'minimal crypto & wallet user',
};

const Profile: React.FC = () => {
  return (
    <div className="profile-page">
      <div className="profile-header">
        <img src={user.avatar} alt="profile avatar" className="profile-avatar" />
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p className="profile-email">{user.email}</p>
          <p className="profile-bio">{user.bio}</p>
        </div>
      </div>
      <div className="profile-section">
        <h3>settings</h3>
        <ul className="profile-settings">
          <li>change username</li>
          <li>change password</li>
          <li>update email</li>
          <li>change profile picture</li>
          <li>2fa setup</li>
          <li>logout</li>
        </ul>
      </div>
      <div className="profile-section">
        <h3>privacy</h3>
        <ul className="profile-settings">
          <li>blocked users</li>
          <li>hidden users</li>
        </ul>
      </div>
      <div className="profile-section">
        <h3>profile picture</h3>
        <button className="profile-upload-btn">upload new picture</button>
      </div>
    </div>
  );
};

export default Profile;
