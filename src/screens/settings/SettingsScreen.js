/**
 * SettingsScreen.js - Màn hình Cài đặt
 * 1. Hiển thị thông tin người dùng (Họ tên, email, UID, trạng thái).
 * 2. Đăng xuất ở màn hình Cài đặt thì quay về màn hình Đăng nhập.
 * 3. Tích hợp định vị GPS @react-native-community/geolocation để cập nhật vị trí.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import Avatar from '../../components/common/Avatar';
import AppButton from '../../components/common/AppButton';
import { useAuth } from '../../context/AuthContext';
import { getCurrentLocation } from '../../services/locationService';
import { updateUserLocation, setUserOnline, setUserOffline } from '../../services/userService';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function SettingsScreen() {
  const { currentUser, userProfile, logout } = useAuth();

  const [locationLoading, setLocationLoading] = useState(false);
  const [currentCoords, setCurrentCoords] = useState(userProfile?.location || null);
  const [isManualOnline, setIsManualOnline] = useState(userProfile?.isOnline !== false);

  // Xử lý đăng xuất -> Quay về màn hình Đăng nhập
  const handleLogout = () => {
    Alert.alert(
      'Xác nhận đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await logout();
            // AuthContext sẽ cập nhật currentUser = null và Navigator tự chuyển sang LoginScreen
          },
        },
      ]
    );
  };

  // Cập nhật vị trí GPS bằng @react-native-community/geolocation
  const handleGetLocation = async () => {
    try {
      setLocationLoading(true);
      const coords = await getCurrentLocation();
      setCurrentCoords(coords);

      if (currentUser?.uid) {
        await updateUserLocation(currentUser.uid, coords);
      }

      Alert.alert(
        'Định vị thành công',
        `Tọa độ hiện tại:\nVĩ độ: ${coords.latitude.toFixed(5)}\nKinh độ: ${coords.longitude.toFixed(5)}`
      );
    } catch (error) {
      Alert.alert(
        'Không thể lấy vị trí',
        error.message || 'Vui lòng kiểm tra quyền truy cập vị trí và bật GPS.'
      );
    } finally {
      setLocationLoading(false);
    }
  };

  // Chuyển đổi trạng thái online/offline thủ công
  const handleToggleOnline = async (value) => {
    setIsManualOnline(value);
    if (!currentUser?.uid) return;

    if (value) {
      await setUserOnline(currentUser.uid);
    } else {
      await setUserOffline(currentUser.uid);
    }
  };

  const name = userProfile?.fullName || currentUser?.displayName || 'Người dùng';
  const email = currentUser?.email || 'Chưa cập nhật';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Thẻ thông tin cá nhân */}
      <View style={styles.profileCard}>
        <Avatar
          name={name}
          photoURL={userProfile?.photoURL || currentUser?.photoURL}
          size={72}
          showStatus
          isOnline={isManualOnline}
        />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
        <View style={styles.uidBadge}>
          <Text style={styles.uidLabel}>UID: </Text>
          <Text style={styles.uidText} numberOfLines={1}>
            {currentUser?.uid}
          </Text>
        </View>
      </View>

      {/* Cài đặt trạng thái hoạt động */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Trạng thái hoạt động</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Hiển thị trực tuyến</Text>
            <Text style={styles.settingSubtitle}>
              Cho phép người khác thấy bạn đang online
            </Text>
          </View>
          <Switch
            value={isManualOnline}
            onValueChange={handleToggleOnline}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={isManualOnline ? colors.primary : '#FFFFFF'}
          />
        </View>
      </View>

      {/* Mục định vị GPS (@react-native-community/geolocation) */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Vị trí & Địa lý</Text>
        <View style={styles.locationCard}>
          <View style={styles.locationHeaderRow}>
            <Text style={styles.locationTitle}>📍 Tọa độ GPS hiện tại</Text>
            {locationLoading && <ActivityIndicator size="small" color={colors.primary} />}
          </View>

          {currentCoords ? (
            <View style={styles.coordsBox}>
              <Text style={styles.coordText}>
                Vĩ độ (Lat): <Text style={styles.coordValue}>{currentCoords.latitude}</Text>
              </Text>
              <Text style={styles.coordText}>
                Kinh độ (Lng): <Text style={styles.coordValue}>{currentCoords.longitude}</Text>
              </Text>
            </View>
          ) : (
            <Text style={styles.locationPlaceholder}>
              Chưa có tọa độ vị trí. Nhấn nút bên dưới để lấy tọa độ từ thiết bị.
            </Text>
          )}

          <AppButton
            title="Cập nhật vị trí GPS"
            onPress={handleGetLocation}
            loading={locationLoading}
            variant="outline"
            style={styles.locationBtn}
          />
        </View>
      </View>

      {/* Thông tin bài thực hành */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Thông tin ứng dụng</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Bài thực hành</Text>
          <Text style={styles.infoValue}>Bài 5 - Chat 1-1 Realtime</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Cơ sở dữ liệu</Text>
          <Text style={styles.infoValue}>Firebase Realtime Database</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Xác thực</Text>
          <Text style={styles.infoValue}>Firebase Auth (Email/Pass)</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nền tảng</Text>
          <Text style={styles.infoValue}>React Native CLI</Text>
        </View>
      </View>

      {/* Nút Đăng xuất */}
      <View style={styles.logoutSection}>
        <AppButton
          title="Đăng Xuất"
          onPress={handleLogout}
          variant="danger"
          style={styles.logoutBtn}
          icon={<Text style={styles.logoutIcon}>🚪</Text>}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  profileCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  name: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.sm,
  },
  email: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  uidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: spacing.sm,
    maxWidth: '90%',
  },
  uidLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  uidText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  settingTitle: {
    ...typography.bodyBold,
    color: colors.text,
  },
  settingSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  locationCard: {
    paddingTop: spacing.xs,
  },
  locationHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  locationTitle: {
    ...typography.bodyBold,
    color: colors.text,
  },
  locationPlaceholder: {
    ...typography.caption,
    color: colors.textMuted,
    marginVertical: spacing.xs,
  },
  coordsBox: {
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: 8,
    marginVertical: spacing.xs,
    gap: 4,
  },
  coordText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  coordValue: {
    fontWeight: '700',
    color: colors.primary,
  },
  locationBtn: {
    marginTop: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typography.bodyBold,
    color: colors.text,
  },
  logoutSection: {
    marginTop: spacing.sm,
  },
  logoutBtn: {
    minHeight: 50,
  },
  logoutIcon: {
    fontSize: 18,
  },
});

