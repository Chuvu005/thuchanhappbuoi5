/**
 * LoginScreen.js - Màn hình Đăng nhập bằng Firebase Auth
 * Khi sai tài khoản hoặc mật khẩu thì hiển thị thông báo lỗi.
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
import { validateEmail, validatePassword } from '../../utils/validators';
import { ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleLogin = async () => {
    // Reset lỗi
    setGeneralError('');
    setFieldErrors({});

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (emailErr || passErr) {
      setFieldErrors({
        email: emailErr,
        password: passErr,
      });
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      // Khi sai tài khoản hoặc mật khẩu thì hiển thị thông báo lỗi
      setGeneralError(result.error);
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
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>💬</Text>
          </View>
          <Text style={styles.title}>Đăng Nhập</Text>
          <Text style={styles.subtitle}>
            Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục trò chuyện realtime.
          </Text>
        </View>

        {/* Thông báo lỗi tổng quát */}
        {generalError ? (
          <View style={styles.errorAlert}>
            <Text style={styles.errorAlertIcon}>⚠️</Text>
            <Text style={styles.errorAlertText}>{generalError}</Text>
          </View>
        ) : null}

        <View style={styles.formCard}>
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

          <AppTextInput
            label="Mật khẩu"
            placeholder="Nhập mật khẩu của bạn"
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

          <AppButton
            title="Đăng Nhập"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginBtn}
          />

          <View style={styles.registerRow}>
            <Text style={styles.registerPrompt}>Chưa có tài khoản? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.REGISTER)}
            >
              <Text style={styles.registerLink}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerNote}>
          <Text style={styles.noteTitle}>💡 Lưu ý cấu hình Firebase:</Text>
          <Text style={styles.noteText}>
            Nếu chưa kết nối project Firebase của riêng bạn, cấu hình tại file{' '}
            <Text style={styles.codeText}>src/config/firebaseConfig.js</Text>.
          </Text>
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
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  logoIcon: {
    fontSize: 34,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
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
  loginBtn: {
    marginTop: spacing.sm,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  registerPrompt: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  footerNote: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  codeText: {
    fontWeight: '700',
    color: colors.primaryDark,
  },
});

