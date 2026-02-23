import React, { useState, useEffect } from 'react';
import './ChatSidebar.css';

interface Friend {
  id: string;
  name: string;
  avatarUrl?: string;
  online?: boolean;
}

interface ChatSidebarProps {
  friends: Friend[];
  currentUserId: string;
  onSelect: (friendId: string) => void;
  onAddFriend: (friendId: string) => void;
  selectedId: string | null;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ friends, currentUserId, onSelect, onAddFriend, selectedId }) => {
  const [search, setSearch] = useState('');
  const [addId, setAddId] = useState('');

  const filtered = friends.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="chat-sidebar">
      <div className="sidebar-header">
        <h2>Chats</h2>
        <input
          className="sidebar-search"
          type="text"
          placeholder="Search friends..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
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
