# BÀI THỰC HÀNH 5: CHAT 1-1 REALTIME VỚI FIREBASE

Ứng dụng nhắn tin 1-1 thời gian thực xây dựng bằng **React Native CLI (không dùng Expo)**, **React Navigation v7**, **Firebase JS SDK (Authentication & Realtime Database)** và **@react-native-community/geolocation**.

---

## 📋 Danh sách tính năng và đáp ứng yêu cầu

### 1. Đăng ký / Đăng nhập
- ✅ **Firebase Authentication**: Hỗ trợ đăng ký và đăng nhập bằng tài khoản Email/Password.
- ✅ **Màn hình Đăng ký**: Gồm Họ và tên, Email, Mật khẩu (tối thiểu 6 ký tự) và Nhập lại mật khẩu. Có kiểm tra tính hợp lệ dữ liệu và thông báo lỗi chi tiết.
- ✅ **Bắt lỗi Đăng nhập**: Khi nhập sai tài khoản hoặc mật khẩu, hệ thống hiển thị thông báo lỗi thân thiện bằng tiếng Việt ("Sai tài khoản hoặc mật khẩu").
- ✅ **Màn hình Cài đặt & Đăng xuất**: Hiển thị thông tin cá nhân, UID, trạng thái hoạt động. Khi nhấn **Đăng xuất**, ứng dụng lập tức chuyển trạng thái sang offline và điều hướng quay lại màn hình **Đăng nhập**.

### 2. Danh bạ
- ✅ **Danh sách người dùng**: Lấy toàn bộ người dùng đã đăng ký trên Firebase Realtime Database (loại trừ chính bản thân).
- ✅ **Trạng thái Online/Offline Realtime**: Cập nhật tức thời chấm xanh (Trực tuyến) hoặc trạng thái ngoại tuyến kèm thời gian đăng nhập lần cuối ("Vừa mới truy cập", "Hoạt động X phút trước").
- ✅ **Ô tìm kiếm**: Tìm kiếm nhanh theo họ tên hoặc địa chỉ email.
- ✅ **Mở phòng chat**: Nhấn vào bất kỳ người dùng nào để mở ngay màn hình Chat 1-1.

### 3. Chat 1-1
- ✅ **Gửi và nhận tin nhắn tức thì**: Tin nhắn cập nhật tức thời hai chiều qua Firebase Realtime Database, không cần tải lại trang.
- ✅ **Bố cục tin nhắn**:
  - Tin của bản thân nằm **bên phải**, nền xanh dương.
  - Tin của người khác nằm **bên trái**, nền xám sáng.
  - Mỗi tin nhắn hiển thị thời gian gửi rõ ràng (`HH:mm`).
- ✅ **Chặn gửi tin nhắn rỗng**: Nút gửi bị vô hiệu hóa khi ô nhập trống hoặc chỉ chứa khoảng trắng.
- ✅ **Tự động cuộn**: Danh sách tự động cuộn xuống tin nhắn mới nhất khi nhận hoặc gửi tin nhắn.
- ✅ **Thanh tiêu đề tùy chỉnh**: Hiển thị ảnh đại diện, tên và trạng thái online/offline của đối phương theo thời gian thực.

### 4. Màn hình Home (Đoạn chat)
- ✅ **Danh sách cuộc trò chuyện**: Hiển thị ảnh đại diện, tên đối phương, nội dung tin nhắn cuối cùng và thời gian.
- ✅ **Thứ tự sắp xếp**: Cuộc trò chuyện có tin nhắn mới nhất luôn tự động đưa lên trên cùng (`b.timestamp - a.timestamp`).
- ✅ **Số tin chưa đọc**:
  - Tăng lên khi người khác gửi tin nhắn mới.
  - Tự động reset về **0** khi người dùng mở cuộc trò chuyện đó.

### 5. Yêu cầu kỹ thuật
- ✅ **React Native CLI**: Phát triển hoàn toàn trên React Native thuần (0.87.1), không phụ thuộc vào Expo Go.
- ✅ **React Navigation**: Kết hợp Bottom Tabs Navigator (Đoạn chat, Danh bạ, Thông báo, Cài đặt) và Native Stack Navigator (Đăng nhập, Đăng ký, Phòng chat 1-1).
- ✅ **Firebase JS SDK**: Sử dụng thư viện chính thức `firebase/auth` và `firebase/database`.
- ✅ **Gom code vào `src/services/`**:
  - `src/services/firebase.js`: Khởi tạo Firebase App, Auth và Realtime Database.
  - `src/services/authService.js`: Xử lý đăng ký, đăng nhập, đăng xuất và phân giải mã lỗi.
  - `src/services/userService.js`: Quản lý hồ sơ và danh sách người dùng realtime.
  - `src/services/chatService.js`: Xử lý gửi nhận tin nhắn, cuộc trò chuyện và unread count.
  - `src/services/presenceService.js`: Tự động nhận diện kết nối với `/.info/connected` và `onDisconnect`.
  - `src/services/locationService.js`: Tích hợp định vị GPS `@react-native-community/geolocation`.
  - `src/services/notificationService.js`: Quản lý danh sách thông báo.
- ✅ **Hủy lắng nghe (Cleanup) trong `useEffect`**:
  - Mọi hàm lắng nghe realtime (`onValue`) đều trả về hàm cleanup gọi `off()` trong `useEffect` để tránh rò rỉ bộ nhớ và hiện lặp tin nhắn.
- ✅ **Màn hình Thông báo (giữ như Bài 4)**: Cung cấp đầy đủ tab Thông báo với phân loại Tất cả / Chưa đọc, đánh dấu đã đọc và hiển thị thời gian.

---

## 📂 Cấu trúc thư mục

```
thuchanhapp5/
├── android/                   # Cấu hình Native Android
├── ios/                       # Cấu hình Native iOS
├── database.rules.json        # Luật bảo mật Firebase Realtime Database
├── FIREBASE_SETUP.md          # Hướng dẫn chi tiết tạo và cấu hình Firebase
├── App.js                     # Root Component
├── index.js                   # Entry point
├── package.json
└── src/
    ├── config/
    │   └── firebaseConfig.js  # Thông tin cấu hình Firebase Project
    ├── services/              # Tầng tương tác Firebase & Services độc lập
    │   ├── firebase.js
    │   ├── authService.js
    │   ├── userService.js
    │   ├── chatService.js
    │   ├── presenceService.js
    │   ├── locationService.js
    │   └── notificationService.js
    ├── context/               # Quản lý state toàn cục (Auth & Chat)
    │   ├── AuthContext.js
    │   └── ChatContext.js
    ├── navigation/            # Cấu hình điều hướng React Navigation
    │   ├── routes.js
    │   ├── AppNavigator.js
    │   ├── AuthStack.js
    │   └── MainTabs.js
    ├── screens/
    │   ├── auth/
    │   │   ├── LoginScreen.js
    │   │   └── RegisterScreen.js
    │   ├── home/
    │   │   └── HomeScreen.js
    │   ├── contacts/
    │   │   └── ContactsScreen.js
    │   ├── chat/
    │   │   └── ChatScreen.js
    │   ├── notifications/
    │   │   └── NotificationsScreen.js
    │   └── settings/
    │       └── SettingsScreen.js
    ├── components/
    │   ├── common/
    │   │   ├── AppButton.js
    │   │   ├── AppTextInput.js
    │   │   ├── Avatar.js
    │   │   ├── StatusBadge.js
    │   │   ├── EmptyState.js
    │   │   └── LoadingView.js
    │   └── chat/
    │       ├── ChatMessageItem.js
    │       ├── ChatInputBar.js
    │       └── ConversationItem.js
    ├── theme/
    │   ├── colors.js
    │   ├── spacing.js
    │   └── typography.js
    └── utils/
        ├── dateUtils.js
        └── validators.js
```

---

## 🚀 Hướng dẫn cài đặt và chạy ứng dụng

### 1. Cấu hình Firebase
Mở file [`src/config/firebaseConfig.js`](./src/config/firebaseConfig.js) và điền thông tin project Firebase của bạn (xem hướng dẫn chi tiết tại [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md)):
```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef..."
};
```

### 2. Khởi chạy Metro Bundler
Mở một cửa sổ Terminal tại thư mục `thuchanhapp5`:
```bash
npm start
```

### 3. Chạy ứng dụng trên Android
Mở một cửa sổ Terminal khác:
```bash
npm run android
```
*(Hoặc `npx react-native run-android`)*

---

## 🧪 Kịch bản kiểm thử (Demo 2 người dùng)

1. **Đăng ký tài khoản A**:
   - Nhập: Nguyễn Văn A, `userA@ptit.edu.vn`, mật khẩu `123456`.
   - Vào ứng dụng, kiểm tra trạng thái Online trong Cài đặt.
2. **Đăng ký tài khoản B** (trên máy ảo khác, điện thoại thật hoặc mở trình duyệt web song song):
   - Nhập: Trần Thị B, `userB@ptit.edu.vn`, mật khẩu `123456`.
3. **Kiểm tra Danh bạ**:
   - Ở máy A: Danh bạ hiển thị người dùng "Trần Thị B" có chấm xanh trực tuyến.
   - Thử tìm kiếm theo tên "Trần" hoặc "userB".
4. **Chat 1-1 Realtime**:
   - Bấm vào "Trần Thị B", tiêu đề hiện tên và trạng thái "Đang hoạt động".
   - Người A gửi: "Xin chào bạn B!".
   - Tin nhắn hiển thị bên phải màn hình của A kèm giờ phút.
   - Ngay lập tức màn hình của B xuất hiện tin nhắn bên trái.
   - Thử bấm nút gửi khi ô nhập trống -> Nút gửi bị vô hiệu hóa.
5. **Màn hình Home & Số tin chưa đọc**:
   - Người B thoát ra màn hình Home -> Thấy cuộc trò chuyện với A nằm trên cùng.
   - Người A gửi thêm 2 tin nhắn -> Huy hiệu đỏ của B tăng lên `2`.
   - Người B nhấn mở cuộc trò chuyện -> Huy hiệu lập tức về `0`.
6. **Đăng xuất**:
   - Vào tab Cài đặt -> Nhấn "Đăng xuất" -> Ứng dụng đưa về màn hình Đăng nhập.
   - Trạng thái của tài khoản đó trên máy đối phương tự động chuyển sang "Ngoại tuyến".

