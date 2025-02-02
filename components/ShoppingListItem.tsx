import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../theme";

type IShoppingListItemProps = {
  name: string;
};

export const ShoppingListItem: React.FC<IShoppingListItemProps> = ({
  name,
}) => {
  const handleDelete = () => {
    Alert.alert(
      `Are you sure you want to delete ${name}?`,
      "It Will be gone for good",
      [
        {
          text: "Yes",
          onPress: () => console.log("ok, deletign"),
          style: "destructive",
        },
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  return (
    <View style={styles.item}>
      <Text style={styles.itemText}>{name}</Text>
      <TouchableOpacity
        onPress={handleDelete}
        style={styles.button}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: theme.colorWhite,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  itemText: { fontSize: 18, fontWeight: 200 },
});
