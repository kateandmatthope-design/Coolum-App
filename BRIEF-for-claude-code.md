# Coolum trip app — brief for Claude Code

`coolum-trip.html` in this repo is a working single-file app with all the content
already in it. Don't rewrite the content, the categories or the look. Extend it.

## How I'm working with you

I'm steering this from my phone, in the Claude app, in a cloud session. That changes
how I need you to work:

- **Work in stages and stop between them.** Finish a stage, commit it, tell me what
  changed in a few lines, and wait. Don't run the whole brief end to end.
- **No terminal commands for me to run.** If something genuinely has to happen outside
  the session — a GitHub setting, a toggle, an account step — say so plainly and give
  me the taps, not a command. Assume I'm on an iPhone.
- **Short summaries.** I'm reading on a small screen. Don't paste diffs or long file
  contents back at me; just say what you did.
- **Ask before anything destructive.** Never force-push or rewrite history.
- **If a thing can't be done, say so early.** I'd much rather know a photo source is
  unreachable than get a silent fallback.
- I'm not a developer. Explain tradeoffs in plain terms when you need a decision from me.

## The trip, for context

Solo. Fly into Brisbane 11.30am Mon 5 Oct 2026, hire a campervan, drive to Coolum Beach
Holiday Park on the Sunshine Coast. Fly home 4.30pm Sat 10 Oct. Six days, `d1`–`d6` in
the data. Queensland has no daylight saving, so it runs an hour behind Melbourne.

---

## Stage 1 — Make it a proper PWA

Do this first: it's self-contained and it's the thing that makes the app usable offline
at the top of Mt Coolum.

- `manifest.json` with `display: standalone`, name "Coolum", icons generated from the
  dusty pink and ochre palette already in the CSS.
- Service worker caching the HTML, fonts and any images, so it works with no signal.
- With `standalone` set, external links open in the iOS in-app browser overlay rather
  than throwing me out to Safari. That's the behaviour I want.
- Don't try to build an embedded browser pane with iframes — Google, TripAdvisor and
  most booking sites block embedding, so it would just show blank boxes.

Then stop and tell me how to switch on GitHub Pages, since the service worker needs
HTTPS and won't register from a file.

## Stage 2 — Real photos, stored locally

Every item has a `place` field. For each, find a usable photo, save it to
`./img/<id>.jpg`, and add a `photo` field pointing at it. Show it at the top of the
detail sheet.

- **Only openly licensed sources.** Wikimedia Commons first — best coverage for Mt
  Coolum, Noosa National Park, Eumundi, the Glass House Mountains, Kondalilla Falls.
  Then Unsplash or Pexels. No hotlinking, no scraping Google Images, no TripAdvisor
  photos.
- Keep `CREDITS.md` with source URL, photographer and licence for each image. CC-BY
  needs attribution — show it as small text under the photo.
- Resize to max 1200px wide, compress to roughly 150KB each.
- **Expect gaps, and leave them.** Landmarks will have good coverage; individual cafes
  and boutiques probably won't. Where there's no decent licensed photo, leave `photo`
  unset and let the existing Photos button handle it. Don't substitute a generic beach
  shot for a cafe.
- Do ten or so first, show me the result, then carry on once I've seen it works.

If the session can't reach these sites, tell me straight away rather than working around it.

## Stage 3 — Pull the reading material in

For items with a `url`, and for the tour and e-bike operators, fetch the page and write
a short factual summary into the note: opening hours, rough price, how to book, where it
departs from. The point is that I shouldn't need to leave the app while standing on a
street in Coolum with patchy reception.

Flag anything stale or moved rather than quietly guessing.

---

## Things to leave alone

- The storage adapter (tries `window.storage`, falls back to `localStorage`). It works.
- The seed-version merge logic. Bump `SEED_V` whenever you change seeded content, so my
  ticks, stars and day assignments survive the update.
- Backup and restore to JSON.
- The colour palette and typography.
- Surfboard hire was removed deliberately. Don't add it back.

## Nice to have, only if straightforward

- Offline map tiles for Coolum and the immediate coast.
- A "today" view that opens straight to the current day during the trip.
- Sunrise and sunset times per day, precomputed for Coolum.
