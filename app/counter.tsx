import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export default function CounterScreen() {
  return (
    <View style={styles.container}>
      <Text>Counter</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    justifyContent: 'center',
  },
});
