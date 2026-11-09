/**
 * NotificationsScreen.js - Màn hình Thông báo (giữ như Bài 4)
 * 1. Hiển thị danh sách thông báo hệ thống, tin nhắn và tính năng.
 * 2. Bộ lọc thông báo (Tất cả / Chưa đọc).
 * 3. Đánh dấu đã đọc và Đánh dấu tất cả đã đọc.
 */
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import EmptyState from '../../components/common/EmptyState';
import LoadingView from '../../components/common/LoadingView';
import { useAuth } from '../../context/AuthContext';
import {
  subscribeNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../../services/notificationService';
import { formatConversationTime } from '../../utils/dateUtils';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function NotificationsScreen() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Lắng nghe danh sách thông báo
  useEffect(() => {
    if (!currentUser?.uid) return;

    setLoading(true);
    const unsubscribe = subscribeNotifications(currentUser.uid, (list) => {
      setNotifications(list);
      setLoading(false);
      setRefreshing(false);
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser?.uid]);

  const filteredList = useMemo(() => {
    if (filter === 'unread') {
      return notifications.filter((item) => !item.read);
    }
    return notifications;
  }, [notifications, filter]);

  const unreadCount = useMemo(() => {
    return notifications.filter((item) => !item.read).length;
  }, [notifications]);

  const handleMarkAllRead = async () => {
    if (!currentUser?.uid) return;
    await markAllNotificationsAsRead(currentUser.uid, notifications);
  };

  const handleItemPress = async (item) => {
    if (!item.read && currentUser?.uid) {
      await markNotificationAsRead(currentUser.uid, item.id);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return '💬';
      case 'feature':
        return '🚀';
      case 'system':
      default:
        return '🔔';
    }
  };

  const renderNotificationItem = ({ item }) => {
    const isUnread = !item.read;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.itemContainer, isUnread && styles.itemUnread]}
        onPress={() => handleItemPress(item)}
      >
        <View style={styles.iconCircle}>
          <Text style={styles.typeIcon}>{getNotificationIcon(item.type)}</Text>
        </View>

        <View style={styles.itemContent}>
          <View style={styles.itemTopRow}>
            <Text
              style={[styles.itemTitle, isUnread && styles.itemTitleUnread]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text style={styles.itemTime}>
              {formatConversationTime(item.timestamp)}
            </Text>
          </View>

          <Text style={styles.itemBody} numberOfLines={3}>
            {item.body}
          </Text>
        </View>

        {isUnread && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Thanh bộ lọc và nút đánh dấu tất cả đã đọc */}
      <View style={styles.filterBar}>
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === 'all' && styles.filterChipTextActive,
              ]}
            >
              Tất cả ({notifications.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filter === 'unread' && styles.filterChipActive]}
            onPress={() => setFilter('unread')}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === 'unread' && styles.filterChipTextActive,
              ]}
            >
              Chưa đọc ({unreadCount})
            </Text>
          </TouchableOpacity>
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllRead} style={styles.readAllBtn}>
            <Text style={styles.readAllText}>Đã đọc tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Danh sách thông báo */}
      {loading && notifications.length === 0 ? (
        <LoadingView message="Đang tải thông báo…" />
      ) : (
        <FlatList
          data={filteredList}
          keyExtractor={(item) => item.id}
          renderItem={renderNotificationItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => setRefreshing(true)}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="🔔"
              title={
                filter === 'unread'
                  ? 'Không có thông báo chưa đọc'
                  : 'Chưa có thông báo nào'
              }
              description={
                filter === 'unread'
                  ? 'Tuyệt vời! Bạn đã xem toàn bộ thông báo.'
                  : 'Các thông báo mới về tin nhắn và hệ thống sẽ xuất hiện tại đây.'
              }
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  readAllBtn: {
    paddingVertical: 4,
  },
  readAllText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  listContent: {
    flexGrow: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemUnread: {
    backgroundColor: '#F0F9FF',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  typeIcon: {
    fontSize: 18,
  },
  itemContent: {
    flex: 1,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.sm,
  },
  itemTitleUnread: {
    fontWeight: '700',
    color: colors.text,
  },
  itemTime: {
    fontSize: 11,
    color: colors.textMuted,
  },
  itemBody: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginLeft: spacing.sm,
  },
});

