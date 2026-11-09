/**
 * ChatScreen.js - Màn hình Chat 1-1 Realtime
 * 1. Gửi và nhận tin nhắn ngay lập tức, không cần tải lại màn hình.
 * 2. Tin của mình nằm bên phải, tin của người kia nằm bên trái, mỗi tin có thời gian.
 * 3. Không cho gửi tin rỗng. Danh sách tự cuộn xuống tin mới nhất.
 * 4. Thanh tiêu đề hiển thị tên và trạng thái online của người đang chat.
 * 5. Hủy lắng nghe trong cleanup của useEffect để tin nhắn không bị hiện lặp.
 * 6. Đưa số tin chưa đọc về 0 khi mở cuộc trò chuyện.
 */
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Avatar from '../../components/common/Avatar';
import StatusBadge from '../../components/common/StatusBadge';
import ChatMessageItem from '../../components/chat/ChatMessageItem';
import ChatInputBar from '../../components/chat/ChatInputBar';
import EmptyState from '../../components/common/EmptyState';
import LoadingView from '../../components/common/LoadingView';
import { useAuth } from '../../context/AuthContext';
import {
  getChatId,
  sendMessage,
  subscribeMessages,
  markChatAsRead,
} from '../../services/chatService';
import { subscribeUserById } from '../../services/userService';
import { formatLastSeen } from '../../utils/dateUtils';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export default function ChatScreen({ route, navigation }) {
  const { otherUser: initialOtherUser } = route.params || {};
  const { currentUser, userProfile } = useAuth();

  const [otherUser, setOtherUser] = useState(initialOtherUser || {});
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const flatListRef = useRef(null);

  const chatId = getChatId(currentUser?.uid, otherUser?.uid);

  // 1. Lắng nghe trạng thái online/offline realtime của người đang chat
  useEffect(() => {
    if (!otherUser?.uid) return;

    const unsubscribeUser = subscribeUserById(otherUser.uid, (updatedUser) => {
      if (updatedUser) {
        setOtherUser((prev) => ({
          ...prev,
          ...updatedUser,
        }));
      }
    });

    return () => {
      unsubscribeUser();
    };
  }, [otherUser?.uid]);

  // 2. Tùy chỉnh thanh tiêu đề: hiển thị tên và trạng thái online của người đang chat
  useLayoutEffect(() => {
    const name = otherUser?.fullName || otherUser?.email || 'Người dùng';
    const isOnline = !!otherUser?.isOnline;
    const statusText = formatLastSeen(isOnline, otherUser?.lastSeen);

    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerName} numberOfLines={1}>
            {name}
          </Text>
          <View style={styles.headerStatusRow}>
            <View
              style={[
                styles.headerStatusDot,
                { backgroundColor: isOnline ? colors.online : colors.offline },
              ]}
            />
            <Text style={styles.headerStatusText} numberOfLines={1}>
              {statusText}
            </Text>
          </View>
        </View>
      ),
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <Avatar
            name={name}
            photoURL={otherUser?.photoURL}
            size={36}
            showStatus
            isOnline={isOnline}
          />
        </View>
      ),
    });
  }, [navigation, otherUser]);

  // 3. Lắng nghe tin nhắn Realtime & reset tin chưa đọc về 0 khi mở cuộc trò chuyện
  useEffect(() => {
    if (!chatId || !currentUser?.uid) return;

    setLoading(true);

    // Đưa số tin chưa đọc về 0 khi vừa mở cuộc trò chuyện
    markChatAsRead(currentUser.uid, chatId);

    // Lắng nghe tin nhắn theo thời gian thực
    const unsubscribeMessages = subscribeMessages(chatId, (msgList) => {
      setMessages(msgList);
      setLoading(false);

      // Đánh dấu đã đọc khi có tin mới tới trong lúc đang mở màn hình chat
      markChatAsRead(currentUser.uid, chatId);

      // Tự động cuộn xuống tin nhắn mới nhất
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    // QUAN TRỌNG: Hủy lắng nghe trong cleanup của useEffect để tin nhắn không bị hiện lặp
    return () => {
      unsubscribeMessages();
      markChatAsRead(currentUser.uid, chatId);
    };
  }, [chatId, currentUser?.uid]);

  // 4. Xử lý gửi tin nhắn mới
  const handleSend = async (text) => {
    if (!text || text.trim().length === 0 || sending) return;

    setSending(true);

    const senderInfo = {
      uid: currentUser.uid,
      fullName: userProfile?.fullName || currentUser.displayName || currentUser.email,
      email: currentUser.email,
      photoURL: userProfile?.photoURL || currentUser.photoURL || '',
    };

    const result = await sendMessage({
      sender: senderInfo,
      receiver: otherUser,
      text,
    });

    setSending(false);

    if (result.success) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  };

  const renderMessageItem = ({ item }) => {
    const isMe = item.senderId === currentUser?.uid;
    return <ChatMessageItem message={item} isMe={isMe} />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.chatBody}>
          {loading && messages.length === 0 ? (
            <LoadingView message="Đang tải tin nhắn…" />
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessageItem}
              contentContainerStyle={styles.messagesList}
              onContentSizeChange={() => {
                flatListRef.current?.scrollToEnd({ animated: false });
              }}
              onLayout={() => {
                flatListRef.current?.scrollToEnd({ animated: false });
              }}
              ListEmptyComponent={
                <EmptyState
                  icon="👋"
                  title="Bắt đầu cuộc trò chuyện"
                  description={`Gửi lời chào đầu tiên tới ${
                    otherUser?.fullName || 'bạn bè'
                  }!`}
                />
              }
            />
          )}

          {/* Thanh nhập tin nhắn */}
          <ChatInputBar onSend={handleSend} disabled={sending} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  chatBody: {
    flex: 1,
    justifyContent: 'space-between',
  },
  messagesList: {
    flexGrow: 1,
    paddingVertical: spacing.md,
  },
  headerTitleContainer: {
    justifyContent: 'center',
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  headerStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  headerStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  headerStatusText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  headerRightContainer: {
    marginRight: spacing.sm,
  },
});

