import { StyleSheet } from "react-native";

import { Text, View, FlatList, useTheme } from "@/components/Themed";

const categories = require("@/data/categories.json");

export default function TabOneScreen() {
  const theme = useTheme();

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <View key={item}>
          <Text style={styles.title}>{item}</Text>
        </View>
      )}
      ItemSeparatorComponent={() => (
        <View
          style={[styles.separator, { backgroundColor: theme.backgroundDim }]}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 12,
    marginHorizontal: 16,
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
  },
});
