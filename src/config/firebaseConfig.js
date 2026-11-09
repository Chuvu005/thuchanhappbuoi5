/**
 * firebaseConfig.js - Cấu hình Firebase Project
 * 
 * Hướng dẫn:
 * 1. Vào https://console.firebase.google.com/
 * 2. Tạo một project mới (hoặc chọn project có sẵn).
 * 3. Vào Project settings -> Add app -> Web app (</>) để lấy thông tin config.
 * 4. Bật Authentication (chọn phương thức Email/Password).
 * 5. Bật Realtime Database (chọn Start in test mode hoặc áp dụng database.rules.json).
 * 6. Điền các giá trị bên dưới:
 */

export const firebaseConfig = {
  apiKey: "AIzaSyDeI90rCPe57a3VYZhMNp3E_Q1JmnWxfhk",
  authDomain: "chatapp-e2b14.firebaseapp.com",
  databaseURL: "https://chatapp-e2b14-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chatapp-e2b14",
  storageBucket: "chatapp-e2b14.firebasestorage.app",
  messagingSenderId: "538377267851",
  appId: "1:538377267851:web:4e2ed1653c5f85e10f828e"
};


export default firebaseConfig;

