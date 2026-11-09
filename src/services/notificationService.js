/**
 * notificationService.js - Quản lý thông báo trong ứng dụng (kế thừa từ Bài 4)
 */
import { ref, push, set, onValue, off, update, remove } from 'firebase/database';
import { database } from './firebase';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_welcome',
    title: 'Chào mừng bạn đến với Chat Realtime!',
    body: 'Bạn đã đăng nhập thành công. Hãy vào mục Danh bạ để tìm bạn bè và bắt đầu trò chuyện nhé.',
    type: 'system',
    timestamp: Date.now() - 3600000,
    read: false,
  },
  {
    id: 'notif_firebase',
    title: 'Kết nối Firebase Realtime',
    body: 'Trạng thái kết nối cơ sở dữ liệu thời gian thực đã sẵn sàng.',
    type: 'system',
    timestamp: Date.now() - 7200000,
    read: true,
  },
  {
    id: 'notif_geo',
    title: 'Cập nhật tính năng định vị',
    body: 'Ứng dụng đã tích hợp định vị GPS @react-native-community/geolocation.',
    type: 'feature',
    timestamp: Date.now() - 86400000,
    read: true,
  },
];

/**
 * Lắng nghe danh sách thông báo của người dùng
 */
export function subscribeNotifications(uid, callback) {
  if (!uid) {
    callback(INITIAL_NOTIFICATIONS);
    return () => {};
  }

  const notifRef = ref(database, `notifications/${uid}`);

  const listener = onValue(
    notifRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        // Khởi tạo các thông báo mẫu ban đầu cho người dùng mới
        callback(INITIAL_NOTIFICATIONS);
        return;
      }

      const data = snapshot.val();
      const list = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));

      list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      callback(list);
    },
    (error) => {
      console.warn('Error subscribing notifications:', error);
      callback(INITIAL_NOTIFICATIONS);
    }
  );

  return () => {
    off(notifRef, 'value', listener);
  };
}

/**
 * Đánh dấu một thông báo đã đọc
 */
export async function markNotificationAsRead(uid, notifId) {
  if (!uid || !notifId) return;
  try {
    const itemRef = ref(database, `notifications/${uid}/${notifId}`);
    await update(itemRef, { read: true });
  } catch (e) {
    console.warn('Error marking notification as read:', e);
  }
}

/**
 * Đánh dấu tất cả thông báo là đã đọc
 */
export async function markAllNotificationsAsRead(uid, notificationsList) {
  if (!uid || !notificationsList) return;
  try {
    const updates = {};
    notificationsList.forEach((n) => {
      updates[`notifications/${uid}/${n.id}/read`] = true;
    });
    await update(ref(database), updates);
  } catch (e) {
    console.warn('Error marking all notifications as read:', e);
  }
}

/**
 * Gửi thông báo mới tới người dùng
 */
export async function sendNotification(uid, { title, body, type = 'message' }) {
  if (!uid) return;
  try {
    const notifRef = ref(database, `notifications/${uid}`);
    const newRef = push(notifRef);
    await set(newRef, {
      title,
      body,
      type,
      timestamp: Date.now(),
      read: false,
    });
  } catch (e) {
    console.warn('Error sending notification:', e);
  }
}

