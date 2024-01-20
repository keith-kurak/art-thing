# Art Thing
A demo of Expo Router v3 with API Routes using the Cleveland Museum of Art Open Access API
![screenshot](/assets/screenshot.png "Screenshot")
![another screenshot](/assets/screenshot2.png "Another Screenshot")
## Stuff it does
- Lists categories of artwork
- Lists artwork in each category with a thumbnail
- Loads individual works with their tombstones
- Lets you "clap" for the artwork
- "Clapped" artwork shows up on the Favorites tab
## Stuff inside
- The works of art themselves are pulled from the [Cleveland Museum of Art Open Access API](https://openaccess-api.clevelandart.org/), retrieved using TanStack query, with some use of the query client to cache the image mapping for quick partial loading
- The clapping / favorites functionality is done with Expo Router API routes. They're just wired up with node-persist local data in JSON files. There's no locking of the files or anything, so you can crash it if you try.
## Prereqs
- Bun installed (https://bun.sh/docs/installation)
## How to run
1. Run `bun install`
2. Run `npx expo start`
## TODO
- Rate limit the clapping so it isn't so likely to crash, or just put it somewhere else like Firebase
- Screen transitions and the navbar don't look quite right on Android on dark mode, need to look at background colors.
