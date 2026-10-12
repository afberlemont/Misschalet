# Vision: a listing-to-video suite (owner, 2026-10-11)

**For whom**: Airbnb hosts and real-estate agents; first as a service, then as a
tool handed to a client (this repository, or its own repository).

**The promise**: from a listing link, every video a property needs on social
media, made every day, plus a walkthrough where the camera moves inside the
photos. And: give the tool a link to any reel, it studies it and makes the same
kind of video for a listing.

## Modules
| Module | What it does | State |
|---|---|---|
| Fetch | listing link → facts, rooms, equipment, distances, photos | Airbnb done (`fetch-listing.mjs`); real-estate portals to add |
| Plan | daily issue that changes every day; written boards (demo, personas) | done (`lib/edition.mjs`, `lib/storyboard.mjs`) |
| Render | HTML motion template → MP4 9:16, frame-exact | done (`template/`, `render.mjs`) |
| Motion | a photo → a short clip, the camera moving in the room (Veo 3.1) | script ready, waits for the Gemini key (`veo-clip.mjs`) |
| Walkthrough | the clips stitched room by room with our titles | next, after Motion |
| Analyse | a reel link → a written reference (structure, timing, hook, style) | done as an SOP (`SOP-VIDEO-ANALYSIS.md`, `references/`) |
| Recreate | a reference → a board for a listing (new hook, our content) | by hand today; to automate |
| Avatar | a presenter (agent or host) talking, from a script | not chosen (AI avatar + voice); real estate first |
| Voice and captions | script, voice, word-by-word captions synced | to build; music stays off unless asked |
| Publish | post, caption, schedule | later |

## Personas (Airbnb)
Premium stay, families (ski schools, ski bus, rooms for everyone), young couples
and friends (restaurants and bars on foot): one short reel each, from the same
listing. Real estate: the agent as an avatar leading the tour.

## Principles
- Proof of concept for clients first: small API spend, a few generated clips,
  never batches without asking.
- Only the listing's facts; the hooks may change, the facts may not.
- The repository is client-ready at any time: no secrets, no third-party media.
