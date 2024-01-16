import { ExpoRequest, ExpoResponse } from 'expo-router/server';

let favs = {};
console.log('reset')

export async function GET(request: ExpoRequest) {
  const id = request.expoUrl.pathname.split('/')[3];
  return ExpoResponse.json({ favs: favs[id] || 0 });
}

export async function POST(request: ExpoRequest) {
  const id = request.expoUrl.pathname.split('/')[3];
  if (!favs[id]) {
    favs[id] = 1;
  } else {
    favs[id] += 1;
  }
  console.log(favs)
  return ExpoResponse.json({ favs: favs[id] });
}