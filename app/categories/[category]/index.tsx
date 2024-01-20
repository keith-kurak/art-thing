import { StyleSheet, Pressable } from "react-native";
import { useEffect } from "react";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Text,
  View,
  FlatList,
  useTheme,
  LoadingShade,
} from "@/components/Themed";

export default function CategoryScreen() {
  const theme = useTheme();

  const { category }: { category: string } = useLocalSearchParams();

  const queryClient = useQueryClient();

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

  useEffect(() => {
    if (query.status === "success") {
      query.data?.data.forEach((item: any) => {
        queryClient.setQueryData([`worksCache:${item.id}`], {
          images: { web: { url: item.images.web.url } },
        });
      });
    }
  }, [query.status]);

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
          <Link asChild href={`/works/${item.id}/`}>
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
