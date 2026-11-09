/**
 * HomeScreen.js - Màn hình Trang chủ (Danh sách cuộc trò chuyện)
 * 1. Hiển thị các cuộc trò chuyện đã có, gồm ảnh đại diện, tên, tin nhắn cuối và thời gian.
 * 2. Cuộc trò chuyện mới nhất nằm trên cùng.
 * 3. Số tin chưa đọc tăng ngay khi có tin mới, và về 0 khi mở cuộc trò chuyện.
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import ConversationItem from '../../components/chat/ConversationItem';
import EmptyState from '../../components/common/EmptyState';
import LoadingView from '../../components/common/LoadingView';
import Avatar from '../../components/common/Avatar';
import { useAuth } from '../../context/AuthContext';
import { subscribeUserConversations } from '../../services/chatService';
import { subscribeAllUsers } from '../../services/userService';
import { ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function HomeScreen({ navigation }) {
  const { currentUser, userProfile } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [onlineMap, setOnlineMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 1. Lắng nghe danh sách cuộc trò chuyện Realtime
  useEffect(() => {
    if (!currentUser?.uid) return;

    setLoading(true);

    // subscribeUserConversations tự động sắp xếp cuộc trò chuyện mới nhất lên trên
    const unsubscribeConversations = subscribeUserConversations(
      currentUser.uid,
      (list) => {
        setConversations(list);
        setLoading(false);
        setRefreshing(false);
      }
    );

    // 2. Lắng nghe trạng thái online/offline của tất cả người dùng để hiển thị chấm xanh realtime
    const unsubscribeUsers = subscribeAllUsers(currentUser.uid, (usersList) => {
      const map = {};
      usersList.forEach((u) => {
        map[u.uid] = !!u.isOnline;
      });
      setOnlineMap(map);
    });

    // Cleanup trong useEffect để hủy lắng nghe khi unmount
    return () => {
      unsubscribeConversations();
      unsubscribeUsers();
    };
  }, [currentUser?.uid]);

  const handleOpenChat = (conversation) => {
    const otherUser = conversation.otherUser || {};
    navigation.navigate(ROUTES.CHAT, {
      otherUser,
    });
  };

  const renderConversation = ({ item }) => {
    const otherUid = item.otherUser?.uid;
    const isOnline = !!onlineMap[otherUid];

    return (
      <ConversationItem
        conversation={item}
        isOnline={isOnline}
        onPress={() => handleOpenChat(item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Header chào mừng người dùng */}
      <View style={styles.header}>
        <View style={styles.headerUserInfo}>
          <Avatar
            name={userProfile?.fullName || currentUser?.displayName || currentUser?.email}
            photoURL={userProfile?.photoURL || currentUser?.photoURL}
            size={42}
            showStatus
            isOnline={true}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.greetingText}>Xin chào,</Text>
            <Text style={styles.headerUserName} numberOfLines={1}>
              {userProfile?.fullName || currentUser?.displayName || 'Bạn'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.newChatButton}
          onPress={() => navigation.navigate(ROUTES.CONTACTS_TAB)}
          accessibilityLabel="Bắt đầu đoạn chat mới"
        >
          <Text style={styles.newChatIcon}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách các cuộc trò chuyện */}
      {loading && conversations.length === 0 ? (
        <LoadingView message="Đang tải các đoạn chat…" />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.chatId}
          renderItem={renderConversation}
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
              icon="💬"
              title="Chưa có cuộc trò chuyện nào"
              description="Hãy mở Danh bạ để tìm bạn bè và gửi tin nhắn đầu tiên nhé!"
              actionLabel="Mở Danh bạ"
              onAction={() => navigation.navigate(ROUTES.CONTACTS_TAB)}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTextContainer: {
    marginLeft: spacing.sm + 2,
    flex: 1,
  },
  greetingText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  headerUserName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  newChatButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newChatIcon: {
    fontSize: 16,
  },
  listContent: {
    flexGrow: 1,
  },
});

