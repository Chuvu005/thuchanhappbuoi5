/**
 * presenceService.js - Quản lý trạng thái Online/Offline Realtime với Firebase
 */
import { ref, onValue, onDisconnect, set, update, off } from 'firebase/database';
import { database } from './firebase';

/**
 * Thiết lập cơ chế tự động phát hiện online/offline khi ngắt kết nối mạng hoặc tắt app
 */
export function setupPresence(uid) {
  if (!uid) return () => {};

  const connectedRef = ref(database, '.info/connected');
  const userStatusRef = ref(database, `users/${uid}`);

  const listener = onValue(connectedRef, (snapshot) => {
    if (snapshot.val() === false) {
      return;
    }

    // Khi ngắt kết nối đột ngột: Firebase server tự động chuyển isOnline = false và ghi lastSeen
    onDisconnect(userStatusRef)
      .update({
        isOnline: false,
        lastSeen: Date.now(),
      })
      .then(() => {
        // Đang kết nối: Đặt isOnline = true
        update(userStatusRef, {
          isOnline: true,
          lastSeen: Date.now(),
        });
      })
      .catch((err) => {
        console.error('Error setting onDisconnect presence:', err);
      });
  });

  // Trả về hàm hủy đăng ký
  return () => {
    off(connectedRef, 'value', listener);
  };
}

