import { FlatList, StyleSheet, TextInput, View, Text } from 'react-native';
import { theme } from '../theme';
import { ShoppingListItem } from '../components/ShoppingListItem';
import { useState } from 'react';

type TShoppingListItemType = {
  id: string;
  name: string;
  completedAtTimestamp?: number;
  lastUpdatedTimestamp: number;
};

const initialList: TShoppingListItemType[] = [
  { id: '1', name: 'Coffee', lastUpdatedTimestamp: 1 },
  { id: '2', name: 'Tea', lastUpdatedTimestamp: 2 },
  { id: '3', name: 'Sugar', lastUpdatedTimestamp: 3 },
  {
    id: '4',
    name: 'Turbo long shopping list item name, so this should be handled with a special case',
    lastUpdatedTimestamp: 4,
  },
];

export default function App() {
  const [shoppingList, setShoppingList] =
    useState<TShoppingListItemType[]>(initialList);
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value) {
      const newShoppingList: TShoppingListItemType[] = [
        {
          id: new Date().toTimeString(),
          name: value,
          lastUpdatedTimestamp: Date.now(),
        },
        ...shoppingList,
      ];

      setShoppingList(newShoppingList);
      setValue('');
    }
  };

  const handleDelete = (id: string) => {
    const updatedShoppingList = shoppingList.filter((item) => id !== item.id);

    setShoppingList(updatedShoppingList);
  };

  const handleToggleComplete = (id: string) => {
    const updatedShoppingList = shoppingList.map((item) => {
      if (id === item.id) {
        return {
          ...item,
          completedAtTimestamp: item.completedAtTimestamp
            ? undefined
            : Date.now(),
          lastUpdatedTimestamp: Date.now(),
        };
      }
      return item;
    });

    setShoppingList(updatedShoppingList);
  };

  return (
    <FlatList
      data={orderShoppingList(shoppingList)}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      stickyHeaderIndices={[0]}
      ListEmptyComponent={
        <View style={styles.listEmptyContainer}>
          <Text>You shopping list is empty</Text>
        </View>
      }
      ListHeaderComponent={
        <TextInput
          placeholder="E.g. Coffee"
          style={styles.textInput}
          value={value}
          onChangeText={setValue}
          keyboardType="default"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
      }
      renderItem={({ item }) => {
        return (
          <ShoppingListItem
            name={item.name}
            onDelete={() => handleDelete(item.id)}
            onToggleComplete={() => handleToggleComplete(item.id)}
            isCompleted={item.completedAtTimestamp}
          />
        );
      }}
    />
  );
}

function orderShoppingList(shoppingList: TShoppingListItemType[]) {
  return shoppingList.sort((item1, item2) => {
    if (item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return item2.completedAtTimestamp - item1.completedAtTimestamp;
    }

    if (item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return 1;
    }

    if (!item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return -1;
    }

    if (!item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return item2.lastUpdatedTimestamp - item1.lastUpdatedTimestamp;
    }

    return 0;
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    paddingVertical: 12,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  textInput: {
    borderColor: theme.colorLightGrey,
    borderWidth: 2,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    fontSize: 18,
    borderRadius: 50,
    backgroundColor: theme.colorWhite,
  },
  listEmptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 18,
  },
});
