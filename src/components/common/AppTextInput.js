/**
 * AppTextInput.js - Ô nhập văn bản kèm nhãn, thông báo lỗi và nút hiện/ẩn mật khẩu
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export default function AppTextInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  autoCapitalize = 'none',
  keyboardType = 'default',
  leftIcon = null,
  containerStyle,
  inputStyle,
  editable = true,
  ...rest
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          error ? styles.inputError : null,
          !editable && styles.inputDisabled,
        ]}
      >
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={editable}
          {...rest}
        />

        {isPassword && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword((prev) => !prev)}
            accessibilityLabel={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🔒'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs + 2,
  },
  inputContainer: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerLight + '22',
  },
  inputDisabled: {
    backgroundColor: colors.offlineBg,
    borderColor: colors.border,
  },
  leftIconContainer: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  eyeButton: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
  eyeIcon: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 4,
    fontWeight: '500',
  },
});

