/**
 * Avatar.js - Component hiển thị ảnh đại diện hoặc chữ cái đầu kèm chấm trạng thái
 */
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import colors from '../../theme/colors';

const AVATAR_COLORS = [
  '#2563EB', '#7C3AED', '#DB2777', '#EA580C',
  '#059669', '#0891B2', '#4F46E5', '#D97706',
];

function getInitials(name = '') {
  if (!name) return '?';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getColorForName(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export default function Avatar({
  name = '',
  photoURL = null,
  size = 48,
  showStatus = false,
  isOnline = false,
  style,
}) {
  const initials = getInitials(name);
  const bgColor = getColorForName(name);

  const containerSize = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const badgeSize = Math.max(10, Math.floor(size * 0.28));
  const badgeOffset = Math.max(0, Math.floor(size * 0.02));

  return (
    <View style={[styles.wrapper, containerSize, style]}>
      {photoURL ? (
        <Image
          source={{ uri: photoURL }}
          style={[styles.image, containerSize]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.fallbackContainer, containerSize, { backgroundColor: bgColor }]}>
          <Text style={[styles.initialsText, { fontSize: Math.floor(size * 0.4) }]}>
            {initials}
          </Text>
        </View>
      )}

      {showStatus && (
        <View
          style={[
            styles.statusDot,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              bottom: badgeOffset,
              right: badgeOffset,
              backgroundColor: isOnline ? colors.online : colors.offline,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  image: {
    backgroundColor: colors.border,
  },
  fallbackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  statusDot: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});

