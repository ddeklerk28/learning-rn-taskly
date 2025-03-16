import { FlatList, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';
import { useEffect, useState } from 'react';
import { countdownStorageKey, PersistedCountdownState } from './index';
import { getFromStorage } from '../../utils/storage';
import { format } from 'date-fns';

const fullDateFormat = 'LLL d yyyy, h:mm aaa';

export default function HistoryScreen() {
  const [countdownState, setCountdownState] =
    useState<PersistedCountdownState>();

  useEffect(() => {
    const init = async () => {
      const value = await getFromStorage(countdownStorageKey);
      setCountdownState(value);
    };

    void init();
  }, []);

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.contentContainer}
      data={countdownState?.completedAtTimestamps}
      renderItem={({ item }) => {
        return (
          <View style={styles.listItem}>
            <Text>{format(item, fullDateFormat)}</Text>
          </View>
        );
      }}
      ListEmptyComponent={
        <View style={styles.listEmptyContainer}>
          <Text>Your shopping list is empty</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: theme.colorWhite,
  },
  contentContainer: {
    marginTop: 8,
  },
  listItem: {
    backgroundColor: theme.colorLightGrey,
    marginHorizontal: 8,
    marginBottom: 8,
    padding: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  listEmptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 18,
  },
});
