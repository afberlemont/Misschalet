# AI video providers (how generated video plugs into the studio)

The studio renders everything deterministically from photos (HTML motion,
frame-exact, free). Generated video is an **optional layer** for what photos
cannot do: a camera moving inside a room, a transition from one room to the
next, a presenter. Each provider is a small script; the template treats its
output as one more clip. Spend rules: `CLAUDE.md` rule 5 (one clip per call,
720p, 4 s, cheapest model first, never twice, ask before a batch).

## Contract for any provider script
- Lives in `studio/`, named `<provider>-<purpose>.mjs` (e.g. `veo-clip.mjs`).
- Input: `<slug>` + photo number(s) from `properties/<slug>/listing.json`
  (`photos[].n`) + a few named options; never free prompts from content.
- Output: an MP4 in `cache/<slug>/clips/` named from its inputs, so the same
  request is never paid twice; a JSON sidecar with the request (no key).
- Key from the environment or `studio/.env` (git-ignored), never printed;
  `--dry-run` prints the request without calling.
- The prompt keeps the property true: no added furniture, people, views or
  objects; only the camera moves (and a fire may burn).
- Document it here (status, cost per clip, limits).

## Providers
| Provider | Script | What | Status |
|---|---|---|---|
| Google Veo 3.1 (Gemini API) | `veo-clip.mjs` | one photo → a 4/6/8 s vertical camera move (`dolly-in`, `dolly-out`, `pan-left`, `pan-right`, `orbit`, `tilt-up`), models `lite` (default), `fast`, `full` | ready; needs `GEMINI_API_KEY` and approval |
| Google Veo 3.1, first and last frame | `veo-transition.mjs` (to write) | two photos → a transition clip from one room to the next | planned; check the current Gemini API docs for the first/last-frame parameters before building |
| Avatar / voice | to choose | a presenter speaking a script; voice-over | not chosen |

## Using clips in reels (next step)
A `clip` shot type for boards (`{ "clip": "<file>", "beats": n }`) that the
renderer plays frame by frame like a photo, with the same titles, icons and
transitions on top. Until it exists, clips are reviewed on their own.
