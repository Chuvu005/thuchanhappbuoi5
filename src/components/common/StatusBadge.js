/**
 * StatusBadge.js - Huy hiệu trạng thái trực tuyến / ngoại tuyến
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default function StatusBadge({ isOnline, lastSeenText, compact = false }) {
  if (compact) {
    return (
      <View style={styles.compactRow}>
        <View
          style={[
            styles.dot,
            { backgroundColor: isOnline ? colors.online : colors.offline },
          ]}
        />
        <Text
          style={[
            styles.compactText,
            { color: isOnline ? colors.online : colors.textMuted },
          ]}
        >
          {isOnline ? 'Online' : 'Offline'}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: isOnline ? colors.onlineBg : colors.offlineBg,
        },
      ]}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: isOnline ? colors.online : colors.offline },
        ]}
      />
      <Text
        style={[
          styles.badgeText,
          { color: isOnline ? '#15803D' : colors.textSecondary },
        ]}
      >
        {isOnline ? 'Trực tuyến' : lastSeenText || 'Ngoại tuyến'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 6,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  compactText: {
    fontSize: 12,
    fontWeight: '500',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

