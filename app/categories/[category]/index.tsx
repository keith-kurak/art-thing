import { StyleSheet, Pressable } from "react-native";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Text, View, FlatList, useTheme, LoadingShade } from "@/components/Themed";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function CategoryScreen() {
  const theme = useTheme();

  const { category }: { category: string } = useLocalSearchParams();

  // Queries
  const query = useQuery({
    queryKey: [`category:${category}`],
    queryFn: async () => {
      const response = await fetch(
        `https://openaccess-api.clevelandart.org/api/artworks?has_image=1&type=${category}&limit=20&fields=id,title,images,creation_date_earliest,creation_date_latest`
      );
      return await response.json();
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: category,
        }}
      />
      <FlatList
        data={query.data?.data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link asChild href={`/categories/${category}/${item.id}`}>
            <Pressable>
              <View style={{ flexDirection: "row", paddingHorizontal: 16 }}>
                <View style={{ flex: 1, justifyContent: "flex-start" }}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={{ fontStyle: "italic" }}>
                    {item.creation_date_earliest !== item.creation_date_latest
                      ? `${item.creation_date_earliest}-${item.creation_date_latest}`
                      : `${item.creation_date_earliest}`}
                  </Text>
                </View>
                <Image
                  style={{ height: 100, width: 100 }}
                  source={{ uri: item.images.web.url }}
                  placeholder={blurhash}
                  contentFit="contain"
                  transition={1000}
                />
              </View>
            </Pressable>
          </Link>
        )}
        ItemSeparatorComponent={() => (
          <View
            style={[styles.separator, { backgroundColor: theme.backgroundDim }]}
          />
        )}
      />
      <LoadingShade isLoading={query.isPending} />
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
