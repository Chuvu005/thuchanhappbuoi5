/**
 * userService.js - Quản lý thông tin người dùng trong Realtime Database
 */
import { ref, set, get, update, onValue, off, serverTimestamp } from 'firebase/database';
import { database } from './firebase';

/**
 * Lưu bản ghi người dùng mới vào /users/{uid}
 */
export async function saveUserRecord(uid, userData) {
  const userRef = ref(database, `users/${uid}`);
  await set(userRef, {
    ...userData,
    updatedAt: Date.now(),
  });
}

/**
 * Lấy thông tin 1 người dùng theo UID
 */
export async function getUserRecord(uid) {
  try {
    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user record:', error);
    return null;
  }
}

/**
 * Cập nhật thông tin người dùng (tên, avatar, bio...)
 */
export async function updateUserProfile(uid, data) {
  const userRef = ref(database, `users/${uid}`);
  await update(userRef, {
    ...data,
    updatedAt: Date.now(),
  });
}

/**
 * Cập nhật trạng thái trực tuyến của người dùng
 */
export async function setUserOnline(uid) {
  if (!uid) return;
  const userRef = ref(database, `users/${uid}`);
  await update(userRef, {
    isOnline: true,
    lastSeen: Date.now(),
  });
}

export async function setUserOffline(uid) {
  if (!uid) return;
  const userRef = ref(database, `users/${uid}`);
  await update(userRef, {
    isOnline: false,
    lastSeen: Date.now(),
  });
}

/**
 * Cập nhật tọa độ vị trí (Geolocation) của người dùng
 */
export async function updateUserLocation(uid, coords) {
  if (!uid || !coords) return;
  const userRef = ref(database, `users/${uid}`);
  await update(userRef, {
    location: {
      latitude: coords.latitude,
      longitude: coords.longitude,
      updatedAt: Date.now(),
    },
  });
}

/**
 * Lắng nghe danh sách tất cả người dùng đã đăng ký (trừ bản thân) theo thời gian thực
 * Trả về hàm hủy lắng nghe (cleanup function) cho useEffect
 */
export function subscribeAllUsers(currentUid, callback) {
  const usersRef = ref(database, 'users');

  const listener = onValue(
    usersRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }

      const usersObj = snapshot.val();
      const usersList = [];

      Object.keys(usersObj).forEach((uid) => {
        // Loại bỏ chính bản thân người dùng đăng nhập
        if (uid !== currentUid) {
          usersList.push({
            uid,
            ...usersObj[uid],
          });
        }
      });

      // Sắp xếp: Ai đang online lên trước, sau đó theo tên
      usersList.sort((a, b) => {
        if (a.isOnline === b.isOnline) {
          const nameA = (a.fullName || a.email || '').toLowerCase();
          const nameB = (b.fullName || b.email || '').toLowerCase();
          return nameA.localeCompare(nameB);
        }
        return a.isOnline ? -1 : 1;
      });

      callback(usersList);
    },
    (error) => {
      console.error('Error subscribing users:', error);
      callback([]);
    }
  );

  // Trả về hàm hủy đăng ký (cleanup)
  return () => {
    off(usersRef, 'value', listener);
  };
}

/**
 * Lắng nghe thông tin 1 người dùng theo thời gian thực (để cập nhật online/offline)
 */
export function subscribeUserById(uid, callback) {
  if (!uid) return () => { };
  const userRef = ref(database, `users/${uid}`);

  const listener = onValue(
    userRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback({ uid, ...snapshot.val() });
      } else {
        callback(null);
      }
    },
    (error) => {
      // console.error(`Error subscribing user ${uid}:`, error);
      callback(null);
    }
  );

  return () => {
    off(userRef, 'value', listener);
  };
}

