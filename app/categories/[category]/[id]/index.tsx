import { StyleSheet, ScrollView, useWindowDimensions, Button } from "react-native";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Text, View, useTheme } from "@/components/Themed";

async function postFav(category: string, id: string) {
  try {
    const response = await fetch(`/categories/${category}/${id}/fav`, {
      method: 'POST',
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json'
      },
      cache: 'default'
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

export default function IdScreen() {
  const theme = useTheme();

  const dimensions = useWindowDimensions();

  const { id, category }: { id: string; category: string } =
    useLocalSearchParams();

  const queryClient = useQueryClient();

  // Queries
  const query = useQuery({
    queryKey: [`id:${id}`],
    queryFn: async () => {
      const response = await fetch(
        `https://openaccess-api.clevelandart.org/api/artworks/${id}`
      );
      // @ts-ignore
      return await response.json();
    },
    placeholderData: () => {
      return {
        data: queryClient
          .getQueryData([`category:${category}`])
          // @ts-ignore
          ?.data?.find((d) => d.id == id),
      };
    },
  });

  const favQuery = useQuery({
    queryKey: [`favs:${id}`],
    queryFn: async () => {
      await fetch(`/categories/${category}/${id}/fav`);
      // @ts-ignore
      return await response.json();
    },
  });

  const item = query.data?.data;

  const favs = favQuery.data?.favs;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: item?.title,
        }}
      />

      <ScrollView>
        {item && (
          <Image
            style={{
              height: dimensions.width,
              width: dimensions.width,
              backgroundColor: "whitesmoke",
            }}
            source={{ uri: item.images.web.url }}
            contentFit="contain"
            transition={100}
          />
        )}
        {!query.isPlaceholderData ? (
          <View style={{ marginHorizontal: 16 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={{ fontStyle: "italic" }}>
              {item.tombstone.replace(`${item.title}, `, "")}
            </Text>
          </View>
        ) : null}
        {favs && <Text style={{ marginHorizontal: 16 }}>Favs: {favs}</Text>}
        <Button onPress={() => postFav(category, id)} title="Fav" />
      </ScrollView>
    </View>
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
    marginTop: 12,
    marginBottom: 4,
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
  },
});
