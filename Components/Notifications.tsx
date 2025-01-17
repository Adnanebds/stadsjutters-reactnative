import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const projectId = 'd0952d92-ffb7-4577-b5ee-d2ee06ef586d'; // Your Expo project ID

export const registerForPushNotifications = async (userId: string) => {
  if (Device.isDevice) {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }

      // Get the push token
      const token = (await Notifications.getExpoPushTokenAsync({
        projectId, // Explicitly pass the projectId here
      })).data;

      console.log('Push token:', token);
      console.log('User ID:', userId);

      // Send push token to your server
      const response = await fetch('https://ece3-86-93-44-129.ngrok-free.app/api/push-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, pushToken: token }),
      });

      const data = await response.json();
      console.log('Server response:', data);

    } catch (error) {
      console.error('Error in registerForPushNotifications:', error);
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
};