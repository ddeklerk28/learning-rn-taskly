import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../theme';

type IShoppingListItemProps = {
  name: string;
  isCompleted?: boolean;
};

export const ShoppingListItem: React.FC<IShoppingListItemProps> = ({
  name,
  isCompleted,
}) => {
  const handleDelete = () => {
    Alert.alert(
      `Are you sure you want to delete ${name}?`,
      'It Will be gone for good',
      [
        {
          text: 'Yes',
          onPress: () => console.log('ok, deletign'),
          style: 'destructive',
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  };

  return (
    <View style={[styles.item, isCompleted ? styles.completedItem : undefined]}>
      <Text
        style={[
          styles.itemText,
          isCompleted ? styles.completedButtonText : undefined,
        ]}
      >
        {name}
      </Text>
      <TouchableOpacity
        onPress={handleDelete}
        style={[
          styles.button,
          isCompleted ? styles.completedButton : undefined,
        ]}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colorCerulean,
    paddingHorizontal: 8,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: theme.colorWhite,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemText: { fontSize: 18, fontWeight: 200 },
  completedItem: {
    backgroundColor: theme.colorLightGrey,
    borderBottomColor: theme.colorLightGrey,
  },
  completedButton: {
    backgroundColor: theme.colorGrey,
  },
  completedButtonText: {
    textDecorationLine: 'line-through',
    color: theme.colorGrey,
    textDecorationColor: theme.colorGrey,
  },
});
