import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>History</Text>
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
  text: {
    fontSize: 24,
  },
});
