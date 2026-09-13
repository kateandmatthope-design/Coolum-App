# Coolum

A single-page trip app for six days on the Sunshine Coast, 5–10 October 2026.
Installable to the iPhone home screen and works with no signal.

Live at **https://kateandmatthope-design.github.io/Coolum-App/** once GitHub Pages
is switched on.

## Turning on GitHub Pages

On the phone, in the GitHub app or github.com:

1. Open the **Coolum-App** repository → **Settings**
2. **Pages** in the left/side menu
3. Under *Build and deployment*, set **Source** to **Deploy from a branch**
4. Branch: **claude/brief-for-claude-code-abmntw**, folder: **/ (root)** → **Save**

Pointing Pages at the working branch means each stage appears at the same
address as soon as it is pushed. Switch the branch to **main** once the work is
merged there.

It takes a minute or two, then the address above works. A service worker only
runs over HTTPS, so the offline caching does nothing until this is done.

## Installing it on the iPhone

Open the address in **Safari** (it has to be Safari, not Chrome), tap the
**Share** button, then **Add to Home Screen**. Opening it from the home screen
icon runs it standalone — no browser chrome, and external links open in an
overlay you can dismiss rather than throwing you out to Safari.

## What's in here

| File | What it is |
| --- | --- |
| `index.html` | The whole app — content, styles and logic in one file |
| `manifest.json` | Makes it installable: name, colours, icons, standalone display |
| `sw.js` | Service worker. Caches the page, icons and fonts for offline use |
| `icons/` | App icons, generated from the app's own palette |
| `img/` | Place photos, stored locally rather than hotlinked. `<id>.jpg` is the
one on the detail sheet; `<id>-2.jpg` onwards are the gallery; `img/t/` holds the
small list thumbnails |
| `CREDITS.md` | Photographer, licence and source URL for every photo |

## Notes for later changes

- Bump `SEED_V` in `index.html` whenever seeded content changes, so ticks, stars
  and day assignments survive the update.
- Bump `VERSION` in `sw.js` whenever the precached file list changes.
- Photos are open-licenced from Wikimedia Commons. Adding one means adding the
  row to `CREDITS.md` too — CC BY and CC BY-SA both require attribution.
- Items carry `pin` (verified lat,lng), `addr`, `spot` and `links`. A `pin` is
  only ever added when the coordinate was confirmed against a named map feature
  or two independent sources; otherwise use `addr` alone and say so in the note.
- `route` draws a path on Google Maps: `{m,f,t,v,l}` for mode, from, to,
  pipe-separated waypoints and a label.
- The Map tab is pinch-zoomable: land and sea are SVG, markers and labels are
  HTML laid over the top so they keep a constant size on screen while the
  ground scales. No tiles, no library, so it works offline. `pin` shows a
  solid marker, `mappin` a dashed one meaning the position is approximate.
  Markers sit at their true positions and simply spread out as you zoom in;
  a place's name appears once nothing else is crowding it. Places sharing an
  exact coordinate get a small fixed ring so each stays tappable.
