/**
 * RegisterScreen.js - Màn hình Đăng ký tài khoản
 * Gồm: Họ tên, Email, Mật khẩu (tối thiểu 6 ký tự), Nhập lại mật khẩu.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AppTextInput from '../../components/common/AppTextInput';
import AppButton from '../../components/common/AppButton';
import { useAuth } from '../../context/AuthContext';
import {
  validateFullName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '../../utils/validators';
import { ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleRegister = async () => {
    setGeneralError('');
    setFieldErrors({});

    const nameErr = validateFullName(fullName);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(password, confirmPassword);

    if (nameErr || emailErr || passErr || confirmErr) {
      setFieldErrors({
        fullName: nameErr,
        email: emailErr,
        password: passErr,
        confirmPassword: confirmErr,
      });
      return;
    }

    setLoading(true);
    const result = await register({
      fullName,
      email,
      password,
    });
    setLoading(false);

    if (!result.success) {
      setGeneralError(result.error);
    } else {
      Alert.alert('Thành công', 'Đăng ký tài khoản thành công!');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Tạo Tài Khoản</Text>
          <Text style={styles.subtitle}>
            Điền đầy đủ thông tin để bắt đầu kết nối và nhắn tin realtime
          </Text>
        </View>

        {generalError ? (
          <View style={styles.errorAlert}>
            <Text style={styles.errorAlertIcon}>⚠️</Text>
            <Text style={styles.errorAlertText}>{generalError}</Text>
          </View>
        ) : null}

        <View style={styles.formCard}>
          {/* 1. Họ và tên */}
          <AppTextInput
            label="Họ và tên"
            placeholder="Nguyễn Văn A"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              if (fieldErrors.fullName) {
                setFieldErrors((prev) => ({ ...prev, fullName: null }));
              }
              if (generalError) setGeneralError('');
            }}
            error={fieldErrors.fullName}
            leftIcon={<Text style={styles.inputIcon}>👤</Text>}
          />

          {/* 2. Email */}
          <AppTextInput
            label="Địa chỉ Email"
            placeholder="example@ptit.edu.vn"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (fieldErrors.email) {
                setFieldErrors((prev) => ({ ...prev, email: null }));
              }
              if (generalError) setGeneralError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={fieldErrors.email}
            leftIcon={<Text style={styles.inputIcon}>✉️</Text>}
          />

          {/* 3. Mật khẩu (tối thiểu 6 ký tự) */}
          <AppTextInput
            label="Mật khẩu (tối thiểu 6 ký tự)"
            placeholder="Nhập ít nhất 6 ký tự"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (fieldErrors.password) {
                setFieldErrors((prev) => ({ ...prev, password: null }));
              }
              if (generalError) setGeneralError('');
            }}
            secureTextEntry
            error={fieldErrors.password}
            leftIcon={<Text style={styles.inputIcon}>🔑</Text>}
          />

          {/* 4. Nhập lại mật khẩu */}
          <AppTextInput
            label="Nhập lại mật khẩu"
            placeholder="Xác nhận lại mật khẩu"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (fieldErrors.confirmPassword) {
                setFieldErrors((prev) => ({ ...prev, confirmPassword: null }));
              }
              if (generalError) setGeneralError('');
            }}
            secureTextEntry
            error={fieldErrors.confirmPassword}
            leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
          />

          <AppButton
            title="Đăng Ký Tài Khoản"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerBtn}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.LOGIN)}>
              <Text style={styles.loginLink}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  backIcon: {
    fontSize: 22,
    color: colors.text,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerLight,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.danger,
    gap: spacing.sm,
  },
  errorAlertIcon: {
    fontSize: 18,
  },
  errorAlertText: {
    flex: 1,
    fontSize: 14,
    color: colors.danger,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputIcon: {
    fontSize: 16,
  },
  registerBtn: {
    marginTop: spacing.sm,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  loginPrompt: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});

