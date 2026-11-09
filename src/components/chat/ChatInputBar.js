/**
 * ChatInputBar.js - Thanh nhập nội dung tin nhắn và nút gửi
 * Không cho gửi tin rỗng.
 */
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export default function ChatInputBar({ onSend, disabled = false }) {
  const [text, setText] = useState('');

  const canSend = text.trim().length > 0 && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    const content = text;
    setText('');
    onSend(content);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn…"
          placeholderTextColor={colors.textMuted}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={1000}
          editable={!disabled}
        />
      </View>

      <TouchableOpacity
        style={[styles.sendButton, canSend ? styles.sendActive : styles.sendDisabled]}
        onPress={handleSend}
        disabled={!canSend}
        accessibilityRole="button"
        accessibilityLabel="Gửi tin nhắn"
      >
        <Text style={[styles.sendIcon, canSend ? styles.sendIconActive : styles.sendIconDisabled]}>
          ➤
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? spacing.sm : 4,
    minHeight: 44,
    maxHeight: 120,
    justifyContent: 'center',
  },
  input: {
    fontSize: 15,
    color: colors.text,
    padding: 0,
    margin: 0,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendActive: {
    backgroundColor: colors.primary,
  },
  sendDisabled: {
    backgroundColor: colors.border,
  },
  sendIcon: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 2,
  },
  sendIconActive: {
    color: '#FFFFFF',
  },
  sendIconDisabled: {
    color: colors.textMuted,
  },
});

