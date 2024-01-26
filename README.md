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
- The clapping / favorites functionality is done with Expo Router API routes. Look for the +api files, one to get/ set claps for individual works, and another to read them all back for the Favorites tab.
- A little bit of Reanimated, because I wanted to slow down the "clapping" due to my hacky local storage implementation.
## Prereqs
- Bun installed (https://bun.sh/docs/installation)
## How to run
1. Run `bun install`
2. Run `npx expo start`
## Caveats
- The clap data is just wired up with node-persist local data in JSON files. There's no locking of the files or anything, so you can crash it if you try. Was just trying to test routes themselves with something self-contained.
- I didn't notice this the first time, but it turns out the Museum API has been quite slow lately, so this app is a good test of loading spinners. Once you've loaded data, though, it's a good demonstration of TanStack Query's caching. I could reimplement this with their Github data store and it'd probably be fine. the CDN for images seems quite fast.
- The app works on web, but I'm getting intermittant CORS errors. Sometimes the same API call works and sometimes it doesn't.

## related Code Youngstown presentation
Not much to these slides, but if it helps, it helps.
[Slides](https://docs.google.com/presentation/d/1z1YapFTQwTC4WWe7ynMeAIypnJWJG7f7Z2wlyWvdWoo/edit?usp=sharing)

## Keith's contact info
[Bird app](https://twitter.com/llamaluvr)
[LinkedIn](https://www.linkedin.com/in/keith-kurak/)
[Discord](https://chat.expo.dev)

