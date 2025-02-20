import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export default function IdeaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Idea</Text>
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
