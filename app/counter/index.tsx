import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../theme';
import { registerForPushNotificationsAsync } from '../../utils/push-notifications';
import { PermissionStatus } from 'expo-modules-core';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function CounterScreen() {
  const scheduleNotification = async () => {
    const result = await registerForPushNotificationsAsync();

    if (result === PermissionStatus.GRANTED) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'I\'m a notification from your app! 📨',
        },
        trigger: {
          seconds: 60,
        },
      });
    } else {
      if (Device.isDevice) {
        Alert.alert(
          'Unable to schedule notification',
          'Enable the notification permission for Expo Go in Settings',
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={scheduleNotification}
      >
        <Text style={styles.buttonText}>Schedule Notification</Text>
      </TouchableOpacity>
      <Text style={styles.text}>Counter</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: theme.colorWhite,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  text: {
    fontSize: 24,
  },
});
