/**
 * AppButton.js - Nút bấm tùy chỉnh đồng bộ phong cách toàn ứng dụng
 */
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export default function AppButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger'
  style,
  textStyle,
  icon = null,
}) {
  const isInteractive = !loading && !disabled;

  const getContainerStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineContainer;
      case 'secondary':
        return styles.secondaryContainer;
      case 'danger':
        return styles.dangerContainer;
      case 'primary':
      default:
        return styles.primaryContainer;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineText;
      case 'secondary':
        return styles.secondaryText;
      case 'danger':
        return styles.dangerText;
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={!isInteractive}
      style={[
        styles.base,
        getContainerStyle(),
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? colors.primary : '#FFFFFF'}
        />
      ) : (
        <>
          {icon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
  },
  primaryContainer: {
    backgroundColor: colors.primary,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryContainer: {
    backgroundColor: colors.secondary,
  },
  secondaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  outlineText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  dangerContainer: {
    backgroundColor: colors.danger,
  },
  dangerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});

