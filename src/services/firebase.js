/**
 * firebase.js - Khởi tạo Firebase App, Authentication và Realtime Database
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from '../config/firebaseConfig';

// Khởi tạo Firebase App duy nhất
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Khởi tạo Auth với AsyncStorage để lưu phiên đăng nhập lâu dài
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // Nếu đã được khởi tạo trước đó
  auth = getAuth(app);
}

// Khởi tạo Realtime Database
const database = getDatabase(app);

export { app, auth, database };
export default app;

