/**
 * chatService.js - Quản lý tin nhắn 1-1 và danh sách cuộc trò chuyện Realtime
 */
import { ref, push, set, update, onValue, off, get } from 'firebase/database';
import { database } from './firebase';

/**
 * Tạo Chat ID duy nhất giữa 2 người dùng (sắp xếp theo alphabet UID)
 * Đảm bảo cả hai bên luôn truy cập cùng một phòng chat
 */
export function getChatId(uid1, uid2) {
  if (!uid1 || !uid2) return null;
  return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
}

/**
 * Gửi tin nhắn mới 1-1
 * 1. Đẩy tin nhắn vào /chats/{chatId}/messages
 * 2. Cập nhật lastMessage & timestamp ở /userChats/{senderUid}/{chatId}
 * 3. Cập nhật lastMessage & tăng unreadCount ở /userChats/{receiverUid}/{chatId}
 */
export async function sendMessage({
  sender,
  receiver,
  text,
}) {
  if (!text || text.trim().length === 0) {
    return { success: false, error: 'Tin nhắn không được để trống' };
  }

  const chatId = getChatId(sender.uid, receiver.uid);
  if (!chatId) {
    return { success: false, error: 'Không xác định được phòng chat' };
  }

  const trimmedText = text.trim();
  const timestamp = Date.now();

  try {
    // 1. Tạo tin nhắn mới trong danh sách tin nhắn của cuộc trò chuyện
    const messagesRef = ref(database, `chats/${chatId}/messages`);
    const newMessageRef = push(messagesRef);
    const messageId = newMessageRef.key;

    const messageData = {
      id: messageId,
      senderId: sender.uid,
      senderName: sender.fullName || sender.email || 'Người dùng',
      receiverId: receiver.uid,
      text: trimmedText,
      timestamp,
      read: false,
    };

    await set(newMessageRef, messageData);

    // 2. Lấy unreadCount hiện tại của người nhận để tăng thêm 1
    const receiverChatRef = ref(database, `userChats/${receiver.uid}/${chatId}`);
    const receiverSnapshot = await get(receiverChatRef);
    let currentUnread = 0;
    if (receiverSnapshot.exists()) {
      const data = receiverSnapshot.val();
      currentUnread = typeof data.unreadCount === 'number' ? data.unreadCount : 0;
    }

    // 3. Cập nhật metadata cuộc trò chuyện cho người gửi
    const senderChatRef = ref(database, `userChats/${sender.uid}/${chatId}`);
    await set(senderChatRef, {
      chatId,
      otherUser: {
        uid: receiver.uid,
        fullName: receiver.fullName || receiver.email || 'Người dùng',
        email: receiver.email || '',
        photoURL: receiver.photoURL || '',
      },
      lastMessage: trimmedText,
      lastMessageSenderId: sender.uid,
      timestamp,
      unreadCount: 0, // Người gửi đã thấy tin của mình
    });

    // 4. Cập nhật metadata cuộc trò chuyện cho người nhận (tăng tin chưa đọc)
    await set(receiverChatRef, {
      chatId,
      otherUser: {
        uid: sender.uid,
        fullName: sender.fullName || sender.email || 'Người dùng',
        email: sender.email || '',
        photoURL: sender.photoURL || '',
      },
      lastMessage: trimmedText,
      lastMessageSenderId: sender.uid,
      timestamp,
      unreadCount: currentUnread + 1,
    });

    return { success: true, message: messageData };
  } catch (error) {
    // console.error('Error sending message:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Đánh dấu cuộc trò chuyện đã đọc (về 0 tin chưa đọc)
 */
export async function markChatAsRead(currentUid, chatId) {
  if (!currentUid || !chatId) return;

  try {
    const userChatRef = ref(database, `userChats/${currentUid}/${chatId}`);
    const snapshot = await get(userChatRef);
    if (snapshot.exists()) {
      await update(userChatRef, {
        unreadCount: 0,
      });
    }
  } catch (error) {
    console.error('Error marking chat as read:', error);
  }
}

/**
 * Lắng nghe toàn bộ tin nhắn trong phòng chat theo thời gian thực
 * Trả về hàm hủy lắng nghe (cleanup function) cho useEffect
 */
export function subscribeMessages(chatId, callback) {
  if (!chatId) return () => { };

  const messagesRef = ref(database, `chats/${chatId}/messages`);

  const listener = onValue(
    messagesRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }

      const rawMessages = snapshot.val();
      const list = Object.keys(rawMessages).map((key) => ({
        id: key,
        ...rawMessages[key],
      }));

      // Sắp xếp theo thứ tự thời gian tăng dần
      list.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

      callback(list);
    },
    (error) => {
      console.error(`Error subscribing messages for chat ${chatId}:`, error);
      callback([]);
    }
  );

  // Hủy lắng nghe trong cleanup của useEffect để tin nhắn không bị lặp
  return () => {
    off(messagesRef, 'value', listener);
  };
}

/**
 * Lắng nghe danh sách cuộc trò chuyện ở Màn hình Home theo thời gian thực
 * Cuộc trò chuyện mới nhất nằm trên cùng
 * Trả về hàm hủy lắng nghe (cleanup function) cho useEffect
 */
export function subscribeUserConversations(currentUid, callback) {
  if (!currentUid) return () => { };

  const userChatsRef = ref(database, `userChats/${currentUid}`);

  const listener = onValue(
    userChatsRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }

      const chatsObj = snapshot.val();
      const list = Object.keys(chatsObj).map((key) => ({
        ...chatsObj[key],
        chatId: key,
      }));

      // Cuộc trò chuyện mới nhất nằm trên cùng
      list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      callback(list);
    },
    (error) => {
      console.error(`Error subscribing user chats for ${currentUid}:`, error);
      callback([]);
    }
  );

  return () => {
    off(userChatsRef, 'value', listener);
  };
}

