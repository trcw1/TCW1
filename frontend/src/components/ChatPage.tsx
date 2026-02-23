import React, { useState } from 'react';
import ChatSidebar from './ChatSidebar';
import Chat from './Chat';
import './ChatPage.css';

// Dummy data for friends
const demoFriends = [
  { id: 'alice', name: 'Alice', avatarUrl: '/default-avatar.png', online: true },
  { id: 'bob', name: 'Bob', avatarUrl: '/default-avatar.png', online: false },
  { id: 'carol', name: 'Carol', avatarUrl: '/default-avatar.png', online: true },
];

const currentUserId = 'demo-user';

const ChatPage: React.FC = () => {
  const [friends, setFriends] = useState(demoFriends);
  const [selectedId, setSelectedId] = useState<string | null>(friends[0]?.id || null);

  const handleAddFriend = (friendId: string) => {
    if (!friends.find(f => f.id === friendId)) {
      setFriends([...friends, { id: friendId, name: friendId, avatarUrl: '/default-avatar.png', online: false }]);
    }
  };

  return (
    <div className="chat-page">
      <ChatSidebar
        friends={friends}
        currentUserId={currentUserId}
        onSelect={setSelectedId}
        onAddFriend={handleAddFriend}
        selectedId={selectedId}
      />
      <div className="chat-main-area">
        {selectedId ? (
          <Chat currentUserId={currentUserId} recipientId={selectedId} onClose={() => setSelectedId(null)} />
        ) : (
          <div className="chat-placeholder">Select a friend to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
