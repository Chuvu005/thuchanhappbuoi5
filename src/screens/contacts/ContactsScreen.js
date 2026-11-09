/**
 * ContactsScreen.js - Màn hình Danh bạ người dùng
 * 1. Lấy danh sách người dùng đã đăng ký từ Firebase (không gồm bản thân).
 * 2. Hiển thị trạng thái online/offline cập nhật theo thời gian thực.
 * 3. Có ô tìm kiếm. Nhấn vào một người để mở màn hình Chat.
 */
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import Avatar from '../../components/common/Avatar';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import LoadingView from '../../components/common/LoadingView';
import { useAuth } from '../../context/AuthContext';
import { subscribeAllUsers } from '../../services/userService';
import { ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import { formatLastSeen } from '../../utils/dateUtils';

export default function ContactsScreen({ navigation }) {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Lắng nghe danh sách người dùng Realtime từ Firebase
  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);
    // subscribeAllUsers loại trừ currentUser.uid và lắng nghe realtime
    const unsubscribe = subscribeAllUsers(currentUser.uid, (usersList) => {
      setUsers(usersList);
      setLoading(false);
      setRefreshing(false);
    });

    // Cleanup trong useEffect để hủy lắng nghe khi unmount
    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  // Lọc danh sách theo ô tìm kiếm (tìm theo tên hoặc email)
  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;

    return users.filter((u) => {
      const name = (u.fullName || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [users, searchQuery]);

  // Nhấn vào một người để mở màn hình Chat 1-1
  const handleSelectUser = (otherUser) => {
    navigation.navigate(ROUTES.CHAT, {
      otherUser,
    });
  };

  const renderUserItem = ({ item }) => {
    const name = item.fullName || item.email || 'Người dùng';
    const lastSeenText = formatLastSeen(item.isOnline, item.lastSeen);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.userItem}
        onPress={() => handleSelectUser(item)}
      >
        <Avatar
          name={name}
          photoURL={item.photoURL}
          size={50}
          showStatus
          isOnline={item.isOnline}
        />

        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {item.email}
          </Text>
          <View style={styles.statusRow}>
            <StatusBadge
              isOnline={item.isOnline}
              lastSeenText={lastSeenText}
              compact
            />
            {item.location && (
              <Text style={styles.locationTag}>📍 Đã bật vị trí</Text>
            )}
          </View>
        </View>

        <View style={styles.chatActionBtn}>
          <Text style={styles.chatActionIcon}>💬</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Ô tìm kiếm người dùng */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm theo họ tên hoặc email…"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Danh sách người dùng */}
      {loading && users.length === 0 ? (
        <LoadingView message="Đang tải danh bạ người dùng…" />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.uid}
          renderItem={renderUserItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => setRefreshing(true)}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon={searchQuery ? '🔎' : '👥'}
              title={
                searchQuery
                  ? 'Không tìm thấy người dùng phù hợp'
                  : 'Chưa có người dùng nào khác'
              }
              description={
                searchQuery
                  ? `Không có kết quả nào cho "${searchQuery}". Hãy thử tìm kiếm bằng từ khóa khác.`
                  : 'Hãy đăng ký thêm tài khoản trên thiết bị khác hoặc trình duyệt để trải nghiệm chat 1-1 realtime!'
              }
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchSection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    paddingVertical: 0,
  },
  clearIcon: {
    fontSize: 14,
    color: colors.textMuted,
    padding: spacing.xs,
  },
  listContent: {
    flexGrow: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  userName: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 2,
  },
  userEmail: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  locationTag: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '500',
  },
  chatActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatActionIcon: {
    fontSize: 18,
  },
});

