import React, { useState } from 'react';
import './ChatSidebar.css';

interface Friend {
  id: string;
  name: string;
  avatarUrl?: string;
  online?: boolean;
}

interface ChatSidebarProps {
  friends: Friend[];
  onSelect: (friendId: string) => void;
  onAddFriend: (friendId: string) => void;
  selectedId: string | null;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ friends, onSelect, onAddFriend, selectedId }) => {
  const [search, setSearch] = useState('');
  const [addId, setAddId] = useState('');

  const filtered = friends.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="chat-sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">chats</span>
        <button title="Settings" className="sidebar-icon-btn">
          <svg fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 8.6 15a1.65 1.65 0 0 0-1.82-.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 15 8.6a1.65 1.65 0 0 0 1.82.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 15z"/></svg>
        </button>
        <button title="Add" className="sidebar-icon-btn">
          <svg fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
        </button>
        <button title="Call" className="sidebar-icon-btn">
          <svg fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.05.37 2.06.72 3a2 2 0 0 1-.45 2.11l-.27.27a16 16 0 0 0 6.29 6.29l.27-.27a2 2 0 0 1 2.11-.45c.94.35 1.95.59 3 .72A2 2 0 0 1 22 16.92z"/></svg>
        </button>
      </div>
      <input
        className="sidebar-search"
        type="text"
        placeholder="Search friends..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="sidebar-friends">
        {filtered.map(friend => (
          <div
            key={friend.id}
            className={`sidebar-friend${selectedId === friend.id ? ' selected' : ''}`}
            onClick={() => onSelect(friend.id)}
          >
            <img
              src={friend.avatarUrl || '/default-avatar.png'}
              alt={friend.name}
              className={`friend-avatar${friend.online ? ' online' : ''}`}
            />
            <span className="friend-name">{friend.name}</span>
            {friend.online && <span className="friend-status online-dot" />}
          </div>
        ))}
      </div>
      <div className="sidebar-add">
        <input
          className="add-input"
          type="text"
          placeholder="Add friend by ID..."
          value={addId}
          onChange={e => setAddId(e.target.value)}
        />
        <button className="add-btn" onClick={() => { if (addId) { onAddFriend(addId); setAddId(''); } }}>
          Add
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;
