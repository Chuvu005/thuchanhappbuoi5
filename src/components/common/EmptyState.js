/**
 * EmptyState.js - Trạng thái trống thân thiện
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from './AppButton';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export default function EmptyState({
  icon = '💬',
  title = 'Chưa có dữ liệu',
  description = '',
  actionLabel,
  onAction,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionLabel && onAction ? (
        <AppButton
          title={actionLabel}
          onPress={onAction}
          variant="outline"
          style={styles.actionBtn}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  actionBtn: {
    marginTop: spacing.sm,
    minWidth: 160,
  },
});

