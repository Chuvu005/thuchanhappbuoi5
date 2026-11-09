/**
 * ConversationItem.js - Thẻ cuộc trò chuyện trên Màn hình Home
 * Hiển thị ảnh đại diện, tên, tin nhắn cuối, thời gian và số tin chưa đọc.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Avatar from '../common/Avatar';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import { formatConversationTime } from '../../utils/dateUtils';

export default function ConversationItem({ conversation, onPress, isOnline = false }) {
  const otherUser = conversation.otherUser || {};
  const name = otherUser.fullName || otherUser.email || 'Người dùng';
  const lastMessage = conversation.lastMessage || '';
  const timeText = formatConversationTime(conversation.timestamp);
  const unreadCount = conversation.unreadCount || 0;
  const hasUnread = unreadCount > 0;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.container, hasUnread && styles.containerUnread]}
      onPress={onPress}
    >
      <Avatar
        name={name}
        photoURL={otherUser.photoURL}
        size={52}
        showStatus
        isOnline={isOnline}
      />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text
            style={[styles.name, hasUnread && styles.nameBold]}
            numberOfLines={1}
          >
            {name}
          </Text>
          <Text
            style={[styles.time, hasUnread && styles.timeUnread]}
          >
            {timeText}
          </Text>
        </View>

        <View style={styles.bottomRow}>
          <Text
            style={[
              styles.lastMessage,
              hasUnread ? styles.lastMessageUnread : styles.lastMessageRead,
            ]}
            numberOfLines={1}
          >
            {lastMessage}
          </Text>

          {hasUnread ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  containerUnread: {
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.sm,
  },
  nameBold: {
    fontWeight: '700',
    color: colors.text,
  },
  time: {
    fontSize: 12,
    color: colors.textMuted,
  },
  timeUnread: {
    color: colors.primary,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
    marginRight: spacing.sm,
  },
  lastMessageRead: {
    color: colors.textSecondary,
  },
  lastMessageUnread: {
    color: colors.text,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: colors.badgeBg,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: colors.badgeText,
    fontSize: 11,
    fontWeight: '700',
  },
});

