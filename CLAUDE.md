# listing-reels: rules for agents

A suite that turns a property listing (Airbnb now; real-estate portals next)
into social videos. Read `VISION.md` for where it is going, `README.md` for how
it works, `references/README.md` for the formats we study. These rules come
from the owner; they hold until he changes them.

## Owner's rules (2026-10-11)
1. **No music.** Render silent unless the owner asks for music in that request.
   `render.mjs` is silent by default; `--with-music` / `--music` only on request.
2. **No figures page.** Never schedule the "L'essentiel en chiffres" / facts
   scene. Numbers may stay on the cover line and the booking card.
3. **Do not recreate references** (or re-render videos) unless asked. When the
   owner sends a video, study it and store the reference; making a version is a
   separate request.
4. **Videos he sends: follow `SOP-VIDEO-ANALYSIS.md`**, with the `/watch` skill
   of https://github.com/bradautomates/claude-video. Every time.
5. **Spend little.** Gemini / Veo: one clip per call, 720p, 4 s, the Lite model
   first; never generate an existing clip again; ask before a batch. Read a
   video's frames as contact sheets (`refs/sheet.py`), not one by one.
6. **Only the listing's facts.** No invented claims, places, restaurant names,
   prices or reviews; if the owner wants named places, he gives them.
7. **The repo will go to a client.** Keep this folder self-contained: no
   secrets (keys in env or a git-ignored `.env`, never printed), no dependency
   on another repository, no frames, video or audio of other people's work
   committed (references are text).

## House style (until a client asks otherwise)
- 1080×1920, 30 fps; words inside y 180–1560 (the Reels / TikTok interface
  covers the rest); French by default for Swiss listings.
- The editorial look of the FunctionAlps partner pages: paper, pine, tanned
  wood, Newsreader, small spaced capitals, hairlines, square corners.
- No em dashes in anything on screen or in captions; no full stop at the end of
  a display title.
- The "shine" arrival (the FunctionAlps homepage chapter heads, `fa-ch-sweep`) for
  arriving at a new part.

## Working here
- New listing: `node fetch-listing.mjs <link>`, then curate
  `properties/<slug>/property.json` (the draft is generic).
- Check a change with `node render.mjs <slug> --stills auto` (or `--reel <name>
  --stills …`) and look at the stills before rendering a full video.
- Keep files under 500 lines. Update `README.md` when behaviour changes, and
  `VISION.md` / `references/` when the plan or the studied formats change.
- Commit explicit paths only; never push without the owner's go.
