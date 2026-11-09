/**
 * ChatContext.js - Quản lý số lượng tin nhắn chưa đọc toàn ứng dụng
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscribeUserConversations } from '../services/chatService';
import { useAuth } from './AuthContext';

const ChatContext = createContext({
  conversations: [],
  totalUnreadCount: 0,
});

export function ChatProvider({ children }) {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      setConversations([]);
      setTotalUnreadCount(0);
      return;
    }

    const unsubscribe = subscribeUserConversations(currentUser.uid, (list) => {
      setConversations(list);

      // Tính tổng số tin nhắn chưa đọc
      const unreadTotal = list.reduce((sum, item) => sum + (item.unreadCount || 0), 0);
      setTotalUnreadCount(unreadTotal);
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        totalUnreadCount,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}

export default ChatContext;

