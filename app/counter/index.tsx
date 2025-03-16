import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { theme } from '../../theme';
import { registerForPushNotificationsAsync } from '../../utils/push-notifications';
import { PermissionStatus } from 'expo-modules-core';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import type { Duration } from 'date-fns';
import { intervalToDuration, isBefore } from 'date-fns';
import { TimeSegment } from '../../components/TimeSegment';
import { getFromStorage, saveToStorage } from '../../utils/storage';
import * as Haptics from 'expo-haptics';
import ConfettiCannon from 'react-native-confetti-cannon';

const frequency = 10 * 1000;

export const countdownStorageKey = 'taskly-countdown';

export type PersistedCountdownState = {
  currentNotificationId: string | undefined;
  completedAtTimestamps: number[];
};

type CoundownStatus = {
  isOverdue: boolean;
  duration: Duration;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function CounterScreen() {
  const { width } = useWindowDimensions();
  const confettiRef = useRef<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [countdownState, setCountdownState] =
    useState<PersistedCountdownState>();
  const [status, setStatus] = useState<CoundownStatus>({
    isOverdue: false,
    duration: {},
  });

  const lastCompletedTimeStamp = countdownState?.completedAtTimestamps[0];

  useEffect(() => {
    const init = async () => {
      const value = await getFromStorage(countdownStorageKey);
      setCountdownState(value);
    };
    void init();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timeStamp = lastCompletedTimeStamp
        ? lastCompletedTimeStamp + frequency
        : Date.now();
      const isOverdue = isBefore(timeStamp, Date.now());
      const duration = intervalToDuration(
        isOverdue
          ? { start: timeStamp, end: Date.now() }
          : { start: Date.now(), end: timeStamp },
      );
      setStatus({ isOverdue, duration });
      setIsLoading(false);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [lastCompletedTimeStamp]);

  const scheduleNotification = async () => {
    confettiRef?.current?.start();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    let pushNotificationId;
    const result = await registerForPushNotificationsAsync();

    if (result === PermissionStatus.GRANTED) {
      pushNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Im a notification from your app!',
        },
        trigger: {
          type: SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: frequency / 1000,
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
    if (countdownState?.currentNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        countdownState?.currentNotificationId,
      );
    }

    const newCountdownState: PersistedCountdownState = {
      currentNotificationId: pushNotificationId,
      completedAtTimestamps: countdownState
        ? [Date.now(), ...countdownState.completedAtTimestamps]
        : [Date.now()],
    };

    setCountdownState(newCountdownState);
    await saveToStorage(countdownStorageKey, newCountdownState);
  };

  if (isLoading) {
    return (
      <View style={styles.activityIndicatorContainer}>
        <ActivityIndicator />
      </View>
    );
  }

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
          number={status.duration.days ?? 0}
          unit="Days"
        />
        <TimeSegment
          textStyle={status.isOverdue ? styles.whiteText : undefined}
          number={status.duration.hours ?? 0}
          unit="Hours"
        />
        <TimeSegment
          textStyle={status.isOverdue ? styles.whiteText : undefined}
          number={status.duration.minutes ?? 0}
          unit="Minutes"
        />
        <TimeSegment
          textStyle={status.isOverdue ? styles.whiteText : undefined}
          number={status.duration.seconds ?? 0}
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
      <ConfettiCannon
        ref={confettiRef}
        count={50}
        origin={{ x: width / 2, y: -20 }}
        fadeOut
        autoStart={false}
      />
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
  activityIndicatorContainer: {
    backgroundColor: theme.colorWhite,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
