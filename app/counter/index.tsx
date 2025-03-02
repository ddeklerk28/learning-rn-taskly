import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../theme';
import { registerForPushNotificationsAsync } from '../../utils/push-notifications';

export default function CounterScreen() {
  const handleRequestPermission = async () => {
    const result = await registerForPushNotificationsAsync();

    console.log(result);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={handleRequestPermission}
      >
        <Text style={styles.buttonText}>Request Permission</Text>
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
