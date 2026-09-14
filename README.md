# Alpha

A real-profile-style feed for Alpha — no navigation, no sections, just the profile and its posts. Built as three plain files with no framework or build step, so it can scale from 22 posts to thousands without a rewrite.

## Files

- `index.html` — structural markup only (avatar, name, bio, empty feed container, stopwatch container)
- `style.css` — all visual styling and responsive behavior
- `script.js` — the post database, feed rendering, gallery logic, and stopwatch
- `README.md` — this file

## How the feed works

All content lives in one array, `POSTS`, near the top of `script.js`. On load, the script walks the array once and builds the DOM for every post with a document fragment (a single append to the page instead of thousands of individual inserts). Every `<img>` uses native `loading="lazy"` and `decoding="async"` except the first couple of images in the first few posts, which load eagerly so the top of the feed appears instantly. The browser handles deferring off-screen images — no scroll-tracking JavaScript is needed for that part.

## Adding a new post

Open `script.js` and add one object to the `POSTS` array. Nothing else needs to change — no HTML, no CSS.

**Text only:**
```js
{ text: "Hello world" }
```

**Text with one photo:**
```js
{
  text: "Hello world",
  images: ["new/photo.jpg"]
}
```

**Photo only (no text):**
```js
{ images: ["new/photo.jpg"] }
```

**Multiple photos (becomes a horizontal scroll gallery automatically):**
```js
{
  text: "My new photos",
  images: [
    "new/1.jpg",
    "new/2.jpg",
    "new/3.jpg"
  ]
}
```

A post with one image renders as a normal full-width photo. A post with two or more images automatically becomes a horizontally-scrollable gallery with a `1 / 3 · 2 left` counter and a thin progress bar underneath, both of which update as the visitor scrolls. Each photo keeps its own natural aspect ratio — nothing is cropped or force-resized.

## GitHub raw image URLs

GitHub file page URLs (the ones with `/blob/` in them, e.g. `https://github.com/mdimrankhanalpha/Alpha/blob/main/photo.jpg`) are **not** direct image links and will not render in an `<img>` tag. `script.js` includes a small `toRaw()` function that automatically rewrites any `github.com/.../blob/...` URL into its `raw.githubusercontent.com` equivalent at render time. This means you can paste normal GitHub links straight into `POSTS` — you never need to convert them by hand.

If you'd rather store the raw URL directly (e.g. `https://raw.githubusercontent.com/mdimrankhanalpha/Alpha/main/photo.jpg`), that also works — `toRaw()` leaves already-raw URLs untouched.

## The stopwatch

The element at the bottom of the page shows time elapsed since **14 September 2026, 00:00:00 Bangladesh time (UTC+06:00)**. It works by comparing the current time to that fixed timestamp on every tick — it never stores or increments a counter — so refreshing the page, closing the tab, or coming back days later never resets or drifts it. There are no start/stop/pause/reset controls; it simply runs.

## Broken images

If an image URL 404s or fails to load, that single image quietly replaces itself with a small "Image unavailable" placeholder. It never breaks the rest of the feed, shifts other posts, or stops other images from loading.

## Deploying to GitHub Pages

1. Push `index.html`, `style.css`, and `script.js` to the root of a repository (or a `/docs` folder, or a dedicated branch — whatever you point Pages at).
2. In the repository's **Settings → Pages**, set the source to that branch/folder.
3. GitHub will publish the site at `https://<username>.github.io/<repo>/`.

Since all images are already referenced via `raw.githubusercontent.com`, they'll load correctly regardless of which repo hosts the site itself, as long as the image repo (`mdimrankhanalpha/Alpha`) stays public.
