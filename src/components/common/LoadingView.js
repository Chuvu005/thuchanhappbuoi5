/**
 * LoadingView.js - Màn hình đang tải
 */
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export default function LoadingView({ message = 'Đang tải dữ liệu…', style }) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  text: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});

