/**
 * dateUtils.js - Tiện ích định dạng thời gian cho Chat và Presence
 */

/**
 * Định dạng giờ phút tin nhắn (VD: 14:35)
 */
export function formatMessageTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Định dạng thời gian cho cuộc trò chuyện ở HomeScreen
 * Hôm nay -> 14:05
 * Hôm qua -> Hôm qua
 * Cũ hơn -> 12/03
 */
export function formatConversationTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return 'Hôm qua';
  }

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
}

/**
 * Định dạng trạng thái hoạt động (Last Seen)
 */
export function formatLastSeen(isOnline, lastSeenTimestamp) {
  if (isOnline) {
    return 'Đang hoạt động';
  }

  if (!lastSeenTimestamp) {
    return 'Ngoại tuyến';
  }

  const date = new Date(lastSeenTimestamp);
  if (isNaN(date.getTime())) return 'Ngoại tuyến';

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMinutes < 1) {
    return 'Vừa mới truy cập';
  }
  if (diffMinutes < 60) {
    return `Hoạt động ${diffMinutes} phút trước`;
  }
  if (diffHours < 24) {
    return `Hoạt động ${diffHours} giờ trước`;
  }

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `Hoạt động ngày ${day}/${month}`;
}

