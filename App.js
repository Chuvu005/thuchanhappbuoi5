/**
 * App.js - Điểm khởi đầu chính của Ứng dụng Chat Realtime 1-1 với Firebase
 * Bài thực hành 5 - Lập trình ứng dụng di động
 */
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { ChatProvider } from './src/context/ChatContext';
import AppNavigator from './src/navigation/AppNavigator';
import colors from './src/theme/colors';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.surface}
      />
      <AuthProvider>
        <ChatProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </ChatProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

