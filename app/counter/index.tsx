import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../theme';
import { registerForPushNotificationsAsync } from '../../utils/push-notifications';
import { PermissionStatus } from 'expo-modules-core';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { useEffect, useState } from 'react';
import type { Duration } from 'date-fns';
import { intervalToDuration, isBefore } from 'date-fns';
import { TimeSegment } from '../../components/TimeSegment';

const timestamp = Date.now() + 10 * 1000;

type CoundownStatus = {
  isOverdue: boolean;
  distance: Duration;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function CounterScreen() {
  const [status, setStatus] = useState<CoundownStatus>({
    isOverdue: false,
    distance: {},
  });
  console.log('status', status);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const isOverdue = isBefore(timestamp, Date.now());
      const distance = intervalToDuration(
        isOverdue
          ? { start: timestamp, end: Date.now() }
          : { start: Date.now(), end: timestamp },
      );
      setStatus({ isOverdue, distance });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const scheduleNotification = async () => {
    const result = await registerForPushNotificationsAsync();

    if (result === PermissionStatus.GRANTED) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Im a notification from your app!',
        },
        trigger: {
          type: SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 3,
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
    <View
      style={[styles.container, status.isOverdue ? styles.containerLate : '']}
    >
      <Text style={[styles.heading, status.isOverdue ? styles.whiteText : '']}>
        {status.isOverdue ? 'Thing Overdue By' : 'Thing due in'}
      </Text>
      <View style={styles.row}>
        <TimeSegment
          textStyle={status.isOverdue ? styles.whiteText : undefined}
          number={status.distance.days ?? 0}
          unit="Days"
        />
        <TimeSegment
          textStyle={status.isOverdue ? styles.whiteText : undefined}
          number={status.distance.hours ?? 0}
          unit="Hours"
        />
        <TimeSegment
          textStyle={status.isOverdue ? styles.whiteText : undefined}
          number={status.distance.minutes ?? 0}
          unit="Minutes"
        />
        <TimeSegment
          textStyle={status.isOverdue ? styles.whiteText : undefined}
          number={status.distance.seconds ?? 0}
          unit="Seconds"
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={scheduleNotification}
      >
        <Text style={styles.buttonText}>Schedule Notification</Text>
      </TouchableOpacity>
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
  containerLate: {
    backgroundColor: theme.colorRed,
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
  row: {
    flexDirection: 'row',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  whiteText: {
    color: theme.colorWhite,
  },
});
