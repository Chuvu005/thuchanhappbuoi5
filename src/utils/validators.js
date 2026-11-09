/**
 * validators.js - Kiểm tra tính hợp lệ dữ liệu nhập
 */

export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return 'Vui lòng nhập địa chỉ email';
  }
  const trimmed = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return 'Địa chỉ email không đúng định dạng';
  }
  return null;
}

export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return 'Vui lòng nhập mật khẩu';
  }
  if (password.length < 6) {
    return 'Mật khẩu phải có tối thiểu 6 ký tự';
  }
  return null;
}

export function validateFullName(name) {
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return 'Vui lòng nhập họ và tên';
  }
  if (name.trim().length < 2) {
    return 'Họ tên quá ngắn';
  }
  return null;
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) {
    return 'Vui lòng nhập lại mật khẩu';
  }
  if (password !== confirmPassword) {
    return 'Mật khẩu nhập lại không khớp';
  }
  return null;
}

