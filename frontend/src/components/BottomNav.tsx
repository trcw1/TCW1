import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BottomNav.css';

const navItems = [
  { label: 'profile', icon: (
    <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.3137 3.134-6 8-6s8 2.6863 8 6"/></svg>
  ) },
  { label: 'wallet', icon: (
    <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="4"/><path d="M16 11h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2"/></svg>
  ) },
  { label: 'chat', icon: (
    <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  ) },
  { label: 'settings', icon: (
    <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  ) },
];

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const handleNav = (label: string) => {
    if (label === 'profile') navigate('/profile');
    else if (label === 'wallet') navigate('/');
    // Add more navigation as needed for other buttons
  };
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.label}
          className="bottom-nav-item"
          aria-label={item.label}
          onClick={() => handleNav(item.label)}
        >
          {item.icon}
          <span className="bottom-nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
