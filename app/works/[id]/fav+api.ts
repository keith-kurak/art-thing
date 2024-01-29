import { ExpoRequest, ExpoResponse } from "expo-router/server";
import storage from "node-persist";

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
  const params = request.expoUrl.searchParams;
  const id = params.get("id")!;
  const favs = (await storage.getItem("favs")) || {};
  return ExpoResponse.json({ favs: favs[id] || 0 });
}

export async function POST(request: ExpoRequest) {
  await initIfNeeded();
  const body = await request.json();
  const params = request.expoUrl.searchParams;
  const id = params.get("id")!;
  const favs = (await storage.getItem("favs")) || {};
  const images = (await storage.getItem("images")) || {};
  if (!favs[id]) {
    favs[id] = body.count;
  } else {
    favs[id] += body.count;
  }
  images[id] = body.image;
  await storage.setItem("favs", favs);
  await storage.setItem("images", images);
  return ExpoResponse.json({ favs: favs[id] });
}
