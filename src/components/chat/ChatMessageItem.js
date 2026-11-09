/**
 * ChatMessageItem.js - Bong bóng tin nhắn Chat 1-1
 * Tin của mình nằm bên phải, tin của người kia nằm bên trái, mỗi tin có thời gian.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import { formatMessageTime } from '../../utils/dateUtils';

export default function ChatMessageItem({ message, isMe }) {
  const timeString = formatMessageTime(message.timestamp);

  return (
    <View style={[styles.row, isMe ? styles.rowMe : styles.rowOther]}>
      <View
        style={[
          styles.bubble,
          isMe ? styles.bubbleMe : styles.bubbleOther,
        ]}
      >
        <Text style={[styles.messageText, isMe ? styles.textMe : styles.textOther]}>
          {message.text}
        </Text>
        <Text style={[styles.timeText, isMe ? styles.timeMe : styles.timeOther]}>
          {timeString}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginVertical: 4,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
  },
  rowMe: {
    justifyContent: 'flex-end',
  },
  rowOther: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: 18,
  },
  bubbleMe: {
    backgroundColor: colors.myBubble,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: colors.otherBubble,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  textMe: {
    color: colors.myBubbleText,
  },
  textOther: {
    color: colors.otherBubbleText,
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timeMe: {
    color: colors.myBubbleTime,
  },
  timeOther: {
    color: colors.otherBubbleTime,
  },
});

