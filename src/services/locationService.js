/**
 * locationService.js - Dịch vụ định vị GPS sử dụng @react-native-community/geolocation
 */
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';

/**
 * Yêu cầu quyền truy cập vị trí trên Android
 */
export async function requestLocationPermission() {
  if (Platform.OS === 'ios') {
    Geolocation.requestAuthorization();
    return true;
  }

  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Quyền truy cập vị trí',
          message:
            'Ứng dụng cần quyền vị trí để chia sẻ tọa độ và hiển thị vị trí trong Cài đặt',
          buttonNeutral: 'Hỏi lại sau',
          buttonNegative: 'Từ chối',
          buttonPositive: 'Đồng ý',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Location permission error:', err);
      return false;
    }
  }

  return true;
}

/**
 * Lấy tọa độ hiện tại của thiết bị
 */
export function getCurrentLocation() {
  return new Promise(async (resolve, reject) => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      reject(new Error('Quyền truy cập vị trí bị từ chối'));
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        console.warn('Geolocation getCurrentPosition error:', error.message);
        reject(error);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
    );
  });
}

