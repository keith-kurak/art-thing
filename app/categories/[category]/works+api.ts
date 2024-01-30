import { ExpoRequest, ExpoResponse } from "expo-router/server";

export async function GET(request: ExpoRequest) {
  const category = request.expoUrl.searchParams.get('category')
  const response = await fetch(
    `https://openaccess-api.clevelandart.org/api/artworks?has_image=1&type=${category}&limit=20&fields=id,title,images,creation_date_earliest,creation_date_latest`
  );
  const responseJson = await response.json();
  return ExpoResponse.json(responseJson);
}
