import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Messages.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const { user: currentUser, token } = useAuth();

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const fetchMessages = useCallback(async (userId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.id);
      const interval = setInterval(() => {
        fetchMessages(activeChat.id);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeChat, fetchMessages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ receiverId: activeChat.id, text: inputText })
      });
      if (res.ok) {
        const newMsg = await res.json();
        setMessages([...messages, newMsg]);
        setInputText('');
        fetchConversations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`messages-container ${activeChat ? 'chat-active' : ''}`}>
      <div className="messages-sidebar">
        <div className="messages-header">
          <span>{currentUser?.username}</span>
        </div>
        <div className="conversations-list">
          {conversations.map(conv => (
            <div 
              key={conv.id} 
              className={`conversation-item ${activeChat?.id === conv.id ? 'active' : ''}`}
              onClick={() => setActiveChat(conv)}
            >
              <img src={conv.avatar} alt="Avatar" className="conversation-avatar" />
              <div className="conversation-info">
                <span className="conversation-username">{conv.username}</span>
                <span className="conversation-preview">
                  {conv.lastMessage || 'Click to send a message'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-area">
        {activeChat ? (
          <>
            <div className="chat-header">
              <button className="chat-back-btn" onClick={() => setActiveChat(null)}>
                <ArrowLeft size={20} />
              </button>
              <img src={activeChat.avatar} alt="Avatar" className="chat-header-avatar" />
              <span className="chat-header-username">{activeChat.username}</span>
            </div>
            <div className="chat-messages">
              {messages.map(msg => (
                <div key={msg.id} className={`chat-bubble ${msg.senderId === currentUser.id ? 'mine' : 'theirs'}`}>
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-area">
              <form className="chat-input-container" onSubmit={handleSend}>
                <input 
                  type="text" 
                  placeholder="Message..." 
                  className="chat-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button type="submit" className="chat-send-btn" disabled={!inputText.trim()}>Send</button>
              </form>
            </div>
          </>
        ) : (
          <div className="empty-chat-placeholder">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
