import { ExpoRequest, ExpoResponse } from "expo-router/server";
import storage from "node-persist";
import { keys } from "lodash";

async function initIfNeeded() {
  // narrator: it's always needed (right now)
  await storage.init({
    dir: "./storage",
    expiredInterval: 0,
  });
}

// NOTE: this seems really prone to race conditions. We won't worry about it.

export async function GET(request: ExpoRequest) {
  await initIfNeeded();
  const favs = (await storage.getItem("favs")) || {};
  const images = (await storage.getItem("images")) || {};
  return ExpoResponse.json(
    keys(favs).map((id) => ({ id, favs: favs[id], image: images[id] }))
  );
}
