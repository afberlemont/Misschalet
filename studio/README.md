# listing-reels

One editorial motion video per property per day, from an Airbnb listing:
the photos with slow camera moves, the equipment of each room
as icons on the photos, the distances around the house, and the link to book.
Vertical 1080×1920, 30 fps, H.264: ready for Instagram Reels, TikTok,
YouTube Shorts and Stories.

The look comes from the FunctionAlps partner pages
(functionalps.ch/hotels/hospitality): paper and pine, a
tanned-wood accent, Newsreader, small spaced capitals, hairline rules,
numbered like a magazine. Each day is an "issue" (N° 001, N° 002…).

Standalone: Node scripts, an HTML template and a Python music script; nothing
to deploy. It is the **studio** of the Misschalet growth ecosystem (see
`../AGENTS.md`): the creative-production subagent works here from Creative Work
Orders. **Agents: read `CLAUDE.md` first** (the studio's rules) and
`PROVIDERS.md` (how AI video plugs in). Studied videos live in `../references/`,
the way to study them in `../playbooks/viral-video-audit.md`.

## Use

```bash
# from the repository root
npm --prefix studio install      # playwright 1.56.1 (+ `npx playwright install chromium` on a new machine)

node studio/fetch-listing.mjs airbnb.com/h/chaletlarosiere     # listing.json + photos (+ a draft property.json)
node studio/render.mjs chaletlarosiere                          # today's video
node studio/render.mjs chaletlarosiere --date 2026-10-12        # another day's issue
node studio/render.mjs --all                                    # every property, today (the daily run)
node studio/render.mjs chaletlarosiere --stills auto            # one PNG per scene, to review an issue fast
node studio/render.mjs chaletlarosiere --music track.mp3        # a soundtrack, only when asked (silent by default)
```

Needs Node 22+, `ffmpeg` on the PATH, and Python 3 with numpy + scipy for the music. `CHROMIUM_PATH` overrides the browser.
A 25-second video takes about 2½ minutes to render.

Each render writes to `out/<slug>/`:

| file | what |
|---|---|
| `<date>.mp4` | the video |
| `<date>-cover.jpg` | the cover frame, to pick as the thumbnail |
| `<date>.txt` | the caption for the post (chapters of the day, link, hashtags) |
| `<date>.plan.json` | what the issue contains (scenes, photos, timing) |

Silent by default (studio rule): a sound can be added in the Instagram /
TikTok editor when posting.

## Storyboarded reels: the demo and the short ones

Besides the daily issue, a property can have written reels in
`properties/<slug>/reels/<name>.json`, rendered with
`node studio/render.mjs <slug> --reel <name>` (or `--reel all`) into
`out/<slug>/reels/<name>.mp4`. La Rosière has four:

| reel | length | for |
|---|---|---|
| `demo` | 36 s | the whole chalet: the presentation |
| `luxe` | 10 s | premium guests: fire, embroidered linen, sauna |
| `famille` | 12 s | families: rooms for everyone, ski room, ski school and ski bus at the door |
| `couples` | 12 s | couples and friends: the table, sauna, fire, restaurant and bar on foot |

A board is a list of scenes timed in **beats** of its music, so every cut and
every arrival lands on the beat. Scene types: `hook` (three lines over the first
shot, the way a reel opens), `cover`, `montage` (shots cut on the beat;
a photo given as `{ "n": 24, "zoom": 1.7, "fx": 49, "fy": 76 }` is a close-up
cut out of it), `triptych` (three photos stacked), `grid4` (the four main rooms,
then one opens to full screen), `frame`, `bleed`, `diptych`, `spotlight`,
`nearby`, `cta` (a `facts` type still exists but is no longer used). Transitions (`enter`): `shine` (the FunctionAlps
homepage's chapter arrival: the page slides in behind a soft edge with a band
of warm light), `wipe-up`, `wipe-left`, `wipe-right`, `iris`, `cut`.
`sheen` on a cover or a booking card sends the same light across it. `grade`
is a CSS filter on every photo (the warm golden-hour look of the reference reels).

### Music

**Off by default** (studio rule, 2026-10-11: no music unless asked). A board's
`music` still sets the tempo the cuts follow. On request, `--with-music` adds
the board's track: `music/make_music.py` synthesises it (numpy + scipy, nothing
sampled, so no rights to clear): `lux` (Rhodes, pad, half-time kick), `famille`
(mallets, claps), `couples` (deep house), made once and cached in `music/out/`
(git-ignored), faded in and out. `--music file.mp3` uses a given track instead.

### Studying a reel someone sends

`../playbooks/viral-video-audit.md`: the `/watch` skill of
https://github.com/bradautomates/claude-video, contact sheets with
`studio/refs/sheet.py`, one text reference per video in `../references/`.

### Camera moves inside a photo (Veo, optional)

`node studio/veo-clip.mjs <slug> <photo n> --move dolly-in|dolly-out|pan-left|pan-right|orbit|tilt-up [--seconds 4|6|8] [--model lite|fast|full]`
turns one photo into a short vertical clip through the Gemini API (Veo 3.1,
image-to-video, 720p): the photo is cut to 9:16 around its focus, the prompt
keeps the room still (only the camera moves, a fire may burn). One clip per
call, never made twice (`cache/<slug>/clips/`). Needs `GEMINI_API_KEY` in the
environment or in `studio/.env` (git-ignored, never printed).
`--dry-run` shows the request without calling the API. Using the clips in the
reels is the next step.

### Images of the region

A board may use a photo of the region instead of a listing photo:
`{ "region": "villars-pistes-ski.jpg", "fx": 50 }` (served from
`cache/region/`, git-ignored). Every image is listed with its licence and
the place it truly shows in `region/sources.json`; a place is named on screen
only if the image shows that very place (`../wiki/images-et-lieux.md`).

## Images for basic posts

`node studio/post-photos.mjs <slug> <post id> <n[:fx,fy]>… [--format 4:5|1:1|9:16]`
cuts listing photos to a post's format around their focus (`n:fx,fy` in
percent, else `property.json → focus`, else the centre), in the given order:
`out/<slug>/posts/<id>/01-<n>.jpg`… A photo post is one number, a carousel
3 to 6, a story one number with `--format 9:16`. No text is drawn on them:
the words go in the caption (and a story's sticker in the app).

## A new property

1. `node studio/fetch-listing.mjs <airbnb link>` writes `properties/<slug>/listing.json`
   and, the first time only, a **draft** `property.json`: chapters by room
   (living room, kitchen, dining, bedrooms, bathrooms, outside), each room's
   equipment as icon tags, the overview as facts, the host's distances as the
   neighbourhood page. It renders as it is.
2. Make it good: rewrite the titles and captions, choose the photos
   (numbers are the photo tour order, `listing.json → photos[].n`), set a crop
   `focus` for the photos that matter, add `pins`. Only write what the listing says.

### property.json

| key | |
|---|---|
| `name`, `kicker`, `place`, `url` | masthead, the line under it, the town, the link shown at the end |
| `startDate` | the date of issue N° 001 |
| `palettes` | rotated daily: `papier`, `sable`, `nuit` |
| `covers`, `coverLines`, `coverCaps` | cover photos and lines, rotated daily |
| `chapters[]` | `section`, `title` (2 lines, `<em>` for the italic), `text`, `caption`, `tags`, `photos`, optional `layout: "spotlight"` |
| `focus` | `{ "<photo n>": [x%, y%] }`: where to crop a landscape photo into the vertical frame |
| `pins` | `{ "<photo n>": [{ "x": 75, "y": 40, "label": "Four" }] }`: a dot on an object of the photo, with its label; it follows the camera |
| `facts` | big numbers (`rows`) and a `note`; not shown any more |
| `nearby` | `items` of `{ name, d }`, five shown a day, nearest first |
| `cta` | `eyebrow`, `sub`, `stats`, `photos` |

Tags and pins take `"label"` alone; the icon is found from the words
(`lib/amenities.mjs`: "Lave-vaisselle" → dishwasher, "Sauna" → sauna…).
Give `"icon"` to force one (names in `template/icons.js`).

## How a day changes

`lib/edition.mjs` turns the property and a date into the plan of the issue.
The date alone decides, so a day always renders the same video:

- cover photo and cover lines,
- three of the chapters (two steps apart, so two days in a row share few),
  the photo inside each, and its layout: `frame` (photo set in the page),
  `bleed` (full photo with a paper card), `diptych` (two photos), `spotlight`
  (full photo with all its equipment listed on it; one per issue at most),
- the palette, the transitions, the camera moves, five of the distances.

Scenes: cover › chapter › chapter › chapter › neighbourhood › booking. No
facts page (studio rule, 2026-10-11): the numbers stay on the cover line and the
booking card.

## How it renders

`template/reel.html` is a 1080×1920 page: `kit.js` (easing, type in masks,
icon chips, photos and their camera, close-ups, pins projected through the
camera, the light sweep), `scenes.js` and `scenes-reel.js` (one builder per
scene type), `reel.js` (transitions, `build(plan)` and
`seek(t)`, which sets every style from the time alone: no CSS animation, no clock). `render.mjs` serves the folder on
localhost, opens the page in headless Chromium, seeks each frame, screenshots
it and pipes the JPEGs into ffmpeg. Words stay in y 180–1560, clear of the
Reels / TikTok interface.

Icons: Lucide (ISC), plus a few drawn in the same style (oven, dishwasher,
kettle, toaster, blender, sauna, stairs, ski boot…), in `template/icons.js`.
Fonts: Newsreader and DM Sans (OFL), self-hosted in `template/fonts/`.
