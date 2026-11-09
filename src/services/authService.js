/**
 * authService.js - Quản lý Đăng nhập, Đăng ký, Đăng xuất qua Firebase Auth
 */
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';
import { saveUserRecord, setUserOffline } from './userService';

/**
 * Chuyển đổi mã lỗi Firebase sang tiếng Việt dễ hiểu
 */
export function getFriendlyErrorMessage(error) {
  if (!error) return 'Đã có lỗi xảy ra. Vui lòng thử lại!';
  const code = error.code || '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Sai tài khoản hoặc mật khẩu';
    case 'auth/invalid-email':
      return 'Địa chỉ email không đúng định dạng';
    case 'auth/email-already-in-use':
      return 'Email này đã được sử dụng bởi một tài khoản khác';
    case 'auth/weak-password':
      return 'Mật khẩu phải có tối thiểu 6 ký tự';
    case 'auth/user-disabled':
      return 'Tài khoản này đã bị tạm khóa';
    case 'auth/too-many-requests':
      return 'Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau ít phút';
    case 'auth/network-request-failed':
      return 'Lỗi kết nối mạng. Vui lòng kiểm tra lại đường truyền';
    default:
      return error.message || 'Thao tác không thành công';
  }
}

/**
 * Đăng ký tài khoản mới bằng Email và Mật khẩu
 * Đồng thời lưu thông tin họ tên vào Database /users/{uid}
 */
export async function registerUser({ fullName, email, password }) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
    const user = userCredential.user;

    // Cập nhật displayName trên Firebase Auth
    if (fullName) {
      await updateProfile(user, {
        displayName: fullName.trim(),
      });
    }

    // Lưu hồ sơ người dùng vào Realtime Database
    await saveUserRecord(user.uid, {
      uid: user.uid,
      fullName: fullName.trim(),
      email: user.email,
      photoURL: user.photoURL || '',
      isOnline: true,
      lastSeen: Date.now(),
      createdAt: Date.now(),
    });

    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      error: getFriendlyErrorMessage(error),
      code: error.code,
    };
  }
}

/**
 * Đăng nhập bằng Email và Mật khẩu
 */
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
    const user = userCredential.user;
    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      error: getFriendlyErrorMessage(error),
      code: error.code,
    };
  }
}

/**
 * Đăng xuất khỏi hệ thống
 * Đánh dấu offline trước khi thoát
 */
export async function logoutUser() {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await setUserOffline(currentUser.uid);
    }
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getFriendlyErrorMessage(error),
    };
  }
}

/**
 * Lắng nghe thay đổi trạng thái đăng nhập
 * Trả về hàm hủy lắng nghe (cleanup)
 */
export function subscribeAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Lấy người dùng hiện tại
 */
export function getCurrentUser() {
  return auth.currentUser;
}

