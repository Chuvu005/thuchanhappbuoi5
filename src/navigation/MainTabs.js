/**
 * MainTabs.js - Thanh Tab điều hướng chính của ứng dụng
 * 4 Tabs: Home (Đoạn chat), Danh bạ (Contacts), Thông báo (Bài 4), Cài đặt
 */
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ROUTES } from './routes';
import HomeScreen from '../screens/home/HomeScreen';
import ContactsScreen from '../screens/contacts/ContactsScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import { useChat } from '../context/ChatContext';
import colors from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { totalUnreadCount } = useChat();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name={ROUTES.HOME_TAB}
        component={HomeScreen}
        options={{
          title: 'Đoạn chat',
          tabBarLabel: 'Đoạn chat',
          tabBarBadge: totalUnreadCount > 0 ? totalUnreadCount : undefined,
          tabBarBadgeStyle: styles.badgeStyle,
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>💬</Text>
          ),
        }}
      />

      <Tab.Screen
        name={ROUTES.CONTACTS_TAB}
        component={ContactsScreen}
        options={{
          title: 'Danh bạ',
          tabBarLabel: 'Danh bạ',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>👥</Text>
          ),
        }}
      />

      <Tab.Screen
        name={ROUTES.NOTIFICATIONS_TAB}
        component={NotificationsScreen}
        options={{
          title: 'Thông báo',
          tabBarLabel: 'Thông báo',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>🔔</Text>
          ),
        }}
      />

      <Tab.Screen
        name={ROUTES.SETTINGS_TAB}
        component={SettingsScreen}
        options={{
          title: 'Cài đặt',
          tabBarLabel: 'Cài đặt',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>⚙️</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: colors.surface,
    elevation: 1,
    shadowOpacity: 0.05,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitleStyle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  tabBar: {
    backgroundColor: colors.tabBackground,
    borderTopColor: colors.border,
    minHeight: 60,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabIcon: {
    fontSize: 20,
  },
  badgeStyle: {
    backgroundColor: colors.badgeBg,
    color: colors.badgeText,
    fontSize: 10,
    fontWeight: '700',
  },
});

