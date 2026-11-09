/**
 * AppNavigator.js - Điều hướng gốc của toàn bộ ứng dụng
 * Tự động chuyển đổi giữa AuthStack (Đăng nhập/Đăng ký) và MainStack (Chat/Danh bạ/Cài đặt)
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from './routes';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import ChatScreen from '../screens/chat/ChatScreen';
import LoadingView from '../components/common/LoadingView';
import colors from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingView message="Đang khởi tạo ứng dụng…" />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      {!currentUser ? (
        // Người dùng chưa đăng nhập -> AuthStack
        <Stack.Screen
          name="Auth"
          component={AuthStack}
          options={{ headerShown: false }}
        />
      ) : (
        // Người dùng đã đăng nhập -> MainTabs & ChatScreen
        <>
          <Stack.Screen
            name={ROUTES.MAIN_TABS}
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={ROUTES.CHAT}
            component={ChatScreen}
            options={{
              headerShown: true,
              headerBackTitle: 'Trở lại',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

