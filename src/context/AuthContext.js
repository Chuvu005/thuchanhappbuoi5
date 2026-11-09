/**
 * AuthContext.js - Quản lý trạng thái xác thực và thông tin người dùng toàn app
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  subscribeAuthState,
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
} from '../services/authService';
import {
  getUserRecord,
  setUserOnline,
  setUserOffline,
  subscribeUserById,
} from '../services/userService';
import { setupPresence } from '../services/presenceService';

const AuthContext = createContext({
  currentUser: null,
  userProfile: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lắng nghe trạng thái Auth từ Firebase
  useEffect(() => {
    let presenceCleanup = () => {};
    let profileCleanup = () => {};

    const unsubscribeAuth = subscribeAuthState(async (user) => {
      // Hủy presence và profile cũ nếu có
      presenceCleanup();
      profileCleanup();

      if (user) {
        setCurrentUser(user);

        // Thiết lập trạng thái trực tuyến tự động (presence)
        presenceCleanup = setupPresence(user.uid);

        // Lấy thông tin chi tiết và lắng nghe cập nhật realtime của chính mình
        profileCleanup = subscribeUserById(user.uid, (profile) => {
          if (profile) {
            setUserProfile(profile);
          } else {
            // Trường hợp tài khoản mới chưa kịp ghi
            setUserProfile({
              uid: user.uid,
              fullName: user.displayName || user.email,
              email: user.email,
              photoURL: user.photoURL,
              isOnline: true,
            });
          }
        });
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      presenceCleanup();
      profileCleanup();
    };
  }, []);

  const login = async (email, password) => {
    const res = await loginUser(email, password);
    if (res.success && res.user) {
      await setUserOnline(res.user.uid);
    }
    return res;
  };

  const register = async ({ fullName, email, password }) => {
    return await registerUser({ fullName, email, password });
  };

  const logout = async () => {
    if (currentUser) {
      await setUserOffline(currentUser.uid);
    }
    return await logoutUser();
  };

  const refreshProfile = async () => {
    if (currentUser) {
      const data = await getUserRecord(currentUser.uid);
      if (data) {
        setUserProfile(data);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

