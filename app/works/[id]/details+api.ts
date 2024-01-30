import { ExpoRequest, ExpoResponse } from "expo-router/server";

export async function GET(request: ExpoRequest) {
  const id = request.expoUrl.searchParams.get('id')
  const response = await fetch(
    `https://openaccess-api.clevelandart.org/api/artworks/${id}`
  );
  const responseJson = await response.json();
  return ExpoResponse.json(responseJson);
}
