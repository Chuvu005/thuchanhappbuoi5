# HƯỚNG DẪN CẤU HÌNH FIREBASE - BÀI THỰC HÀNH 5

Ứng dụng **Chat 1-1 Realtime** sử dụng **Firebase JS SDK (v11+)** với 2 dịch vụ chính:
1. **Firebase Authentication** (Phương thức Email/Password)
2. **Firebase Realtime Database** (Lưu trữ tin nhắn, người dùng, hiện diện online/offline)

---

## 1. Các bước tạo Project trên Firebase Console

### Bước 1: Tạo Firebase Project
1. Truy cập [Firebase Console](https://console.firebase.google.com/).
2. Nhấn **"Add project"** (Thêm dự án) -> Đặt tên dự án (VD: `thuchanh-chat-app`) -> Nhấn **Continue**.
3. (Tùy chọn) Tắt Google Analytics nếu không cần thiết -> Nhấn **Create project**.

---

### Bước 2: Bật Firebase Authentication (Email/Password)
1. Trong menu bên trái, chọn **Build** -> **Authentication** -> Nhấn **Get Started**.
2. Tại tab **Sign-in method**, chọn nhà cung cấp **Email/Password**.
3. Bật công tắc **Enable** ở dòng đầu tiên ("Email/Password") -> Nhấn **Save**.

---

### Bước 3: Tạo Firebase Realtime Database
1. Trong menu bên trái, chọn **Build** -> **Realtime Database** -> Nhấn **Create Database**.
2. Chọn vị trí lưu trữ (VD: `Singapore (asia-southeast1)` hoặc `United States (us-central1)`).
3. Tại bước chọn Security Rules, chọn **Start in test mode** hoặc chọn **Locked mode**.
4. Nhấn **Enable**.

---

### Bước 4: Áp dụng Luật Bảo Mật (Security Rules)
Vào tab **Rules** trong Realtime Database, dán toàn bộ nội dung từ file [`database.rules.json`](./database.rules.json):

```json
{
  "rules": {
    "users": {
      ".read": "auth != null",
      "$uid": {
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "chats": {
      "$chatId": {
        ".read": "auth != null && ($chatId.contains(auth.uid) || data.child('members/' + auth.uid).exists() || !data.exists())",
        ".write": "auth != null && ($chatId.contains(auth.uid) || newData.child('members/' + auth.uid).exists() || data.child('members/' + auth.uid).exists())",
        "messages": {
          ".read": "auth != null",
          ".write": "auth != null"
        }
      }
    },
    "userChats": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null"
      }
    },
    "presence": {
      ".read": "auth != null",
      "$uid": {
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "notifications": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null"
      }
    }
  }
}
```
Nhấn **Publish** để áp dụng.

> [!NOTE]
> Trong môi trường học tập hoặc kiểm thử nhanh, bạn cũng có thể sử dụng luật mở (Test mode):
> ```json
> {
>   "rules": {
>     ".read": "auth != null",
>     ".write": "auth != null"
>   }
> }
> ```

---

### Bước 5: Lấy thông tin cấu hình Web App đưa vào App
1. Nhấn vào biểu tượng **Cài đặt dự án** (Project settings - hình bánh răng ở góc trên bên trái).
2. Cuộn xuống mục **Your apps** -> Nhấn vào biểu tượng **Web** (`</>`).
3. Đặt nickname cho app (VD: `ChatAppWeb`) -> Nhấn **Register app**.
4. Sao chép đối tượng `firebaseConfig` được hiển thị và dán vào file [`src/config/firebaseConfig.js`](./src/config/firebaseConfig.js):

```javascript
export const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789...",
  appId: "1:123456789:web:abcdef..."
};

export default firebaseConfig;
```

---

## 2. Cấu trúc dữ liệu trong Realtime Database

- `/users/{uid}`: Lưu hồ sơ người dùng (họ tên, email, ảnh, tọa độ GPS, `isOnline`, `lastSeen`).
- `/chats/{chatId}/messages/{messageId}`: Danh sách tin nhắn theo phòng chat. `chatId` được tạo từ 2 UID (`uid1 < uid2 ? uid1_uid2 : uid2_uid1`).
- `/userChats/{uid}/{chatId}`: Danh sách các cuộc trò chuyện của từng người dùng, gồm `lastMessage`, `timestamp`, `otherUser`, và `unreadCount`.
- `/notifications/{uid}/{notifId}`: Danh sách thông báo của người dùng (kế thừa Bài 4).
- `/.info/connected`: Được quản lý tự động bởi Firebase Presence để cập nhật trạng thái online/offline khi ngắt mạng hoặc thoát ứng dụng.

