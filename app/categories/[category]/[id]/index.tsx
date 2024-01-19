import {
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FontAwesome6 } from "@expo/vector-icons";
import { Text, View, useTheme } from "@/components/Themed";

async function postFav(category: string, id: string, count: number, image: string) {
  try {
    const response = await fetch(`/categories/${category}/${id}/fav`, {
      method: "POST",
      headers: {
        Accept: "application.json",
        "Content-Type": "application/json",
      },
      cache: "default",
      body: JSON.stringify({ count, image }),
    });
    const data = await response.json();
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

  const [localFavs, setLocalFavs] = useState(0);

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
      const response = await fetch(`/categories/${category}/${id}/fav`);
      // @ts-ignore
      return await response.json();
    },
  });

  useEffect(() => {
    if (favQuery.status === "success") {
      console.log('setting local favs', favQuery.data?.favs)
      setLocalFavs(favQuery.data?.favs);
    }
  }, [favQuery.status]);

  const onPressFav = useCallback(async () => {
    console.log('localFavs', localFavs)
    setLocalFavs(localFavs + 1);
    postFav(category, id, 1, query.data?.data.images.web.url);
  }, [ localFavs ]);

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
        <View style={{ marginHorizontal: 16 }}>
          <View
            style={{
              marginBottom: 8,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.title}>{item.title}</Text>
            <View style={{ marginTop: 12, flexDirection: "row" }}>
              <TouchableOpacity onPress={onPressFav}>
                <FontAwesome6
                  name="hands-clapping"
                  size={20}
                  color={theme.tint}
                />
              </TouchableOpacity>
              {favs || localFavs ? (
                <Text
                  style={{ marginLeft: 8, fontSize: 18, color: theme.tint }}
                >
                  {localFavs > favs ? localFavs : favs}
                </Text>
              ) : null}
            </View>
          </View>
          {!query.isPlaceholderData ? (
            <Text style={{ fontStyle: "italic" }}>
              {item.tombstone.replace(`${item.title}, `, "")}
            </Text>
          ) : null}
        </View>
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
