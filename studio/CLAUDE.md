# studio: the Creative Production Agent's workshop

The video engine of the ecosystem: a property listing becomes vertical social
videos (1080×1920). The **creative-production** subagent works here from a
Creative Work Order (`../playbooks/creative-work-order.md`); it does not set
strategy. `README.md` explains how the engine works; `PROVIDERS.md` how AI
video (Gemini / Veo) plugs in.

## Studio rules (set by the agency, 2026-10-11)
1. **No music.** Render silent unless Misschalet or the agency asks for music in
   that request. `render.mjs` is silent by default; `--with-music` / `--music`
   only on request.
2. **No figures page.** Never schedule the "L'essentiel en chiffres" / facts
   scene. Numbers may stay on the cover line and the booking card.
3. **Do not recreate references** (studied videos in `../references/`) unless a
   work order asks for it.
4. **Videos to study** go through `../playbooks/viral-video-audit.md` (the
   viral-video-analyst's job), not here.
5. **Spend little.** Gemini / Veo: one clip per call, 720p, 4 s, the Lite model
   first; never generate an existing clip again; ask before a batch. Always
   check stills (`--stills auto`) before rendering a full video.
6. **Only approved facts.** On-screen words come from the work order and
   `../properties/<slug>/approved-claims.md`; places of the region and
   addresses only from `../intelligence/destination-opportunities.md`
   (sourced). Nothing invented: no places, restaurant names, prices, reviews.
7. **Self-contained.** No secrets in files (keys in env or a git-ignored
   `.env`, never printed); no frames, video or audio of other people's work
   committed; rendered media stay out of git (`out/`, `cache/`).
8. **The rulebook wins.** Read `../wiki/regles-videos.md` before every board
   or render: Misschalet's and the agency's rules override the defaults
   below. Her feedback goes through `../playbooks/feedback.md`.
9. **Places are shown exactly.** A place named on screen gets an image of that
   very place, beautiful and licensed for ads (`region/sources.json`,
   `../wiki/images-et-lieux.md`); otherwise do not name the place.

## House style (until Misschalet asks otherwise)
- 1080×1920, 30 fps; words inside y 180–1560 (the Reels / TikTok interface
  covers the rest); French by default.
- Editorial look: paper, pine, tanned wood, Newsreader, small spaced capitals,
  hairlines, square corners. No em dashes on screen or in captions; no full
  stop at the end of a display title.
- The "shine" arrival (`enter: "shine"`, with its `sheen`) **once per video
  at most**, on the cover (rule V10); every other scene enters with a wipe
  or a cut.

## Working here (commands run from the repository root)
- New listing: `node studio/fetch-listing.mjs <link>`, then curate
  `studio/properties/<slug>/property.json` (the draft is generic).
- Images for a basic post (photo, carousel, story):
  `node studio/post-photos.mjs <slug> <post id> <n[:fx,fy]>… [--format 4:5|1:1|9:16]`.
- Review: `node studio/render.mjs <slug> --reel <name> --stills auto`, look at
  the stills, then render: `node studio/render.mjs <slug> --reel <name>`.
- First time on a machine: `npm --prefix studio install` (+ `npx playwright
  install chromium` if Chromium is missing) and ffmpeg on the PATH.
- Keep files under 500 lines; update `README.md` when behaviour changes.
