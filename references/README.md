# References

Reels the owner sent as models, studied with `../SOP-VIDEO-ANALYSIS.md`
(the `/watch` skill of https://github.com/bradautomates/claude-video). Text
only: no frames or media of other people's work in this repository. **Not to
be recreated unless the owner asks**; they are the catalogue of formats the
tool should learn to make: for Airbnb (our photos, new hooks and content) and
for real estate (possibly fully AI avatars).

| Reference | Who | Length | Format |
|---|---|---|---|
| [instagram-DTITUt3jNVr](instagram-DTITUt3jNVr.md) | travel creator, Airbnb | 29 s | POV hook, one-second detail cuts, triptych, logo on sunset |
| [instagram-DXeU5dDkeXe](instagram-DXeU5dDkeXe.md) | agent (27k likes) | 61 s | agent talks, warp fly-through room by room, contact card, aerial |
| [instagram-DaNYpI2xw1M](instagram-DaNYpI2xw1M.md) | agent (15k likes) | 62 s | "under contract in 4 days", agent in every room, light leaks, spinning aerial |
| [instagram-DYkldISP8PN](instagram-DYkldISP8PN.md) | luxury agent | 36 s | walk-and-talk, FPV, single big words, aerials |
| [instagram-DaKnrcQxQ_u](instagram-DaKnrcQxQ_u.md) | videographer (15k likes) | 32 s | pitch, kinetic type behind the presenter, collages, DM call to action |
| [instagram-Ddy4a4RR7H6](instagram-Ddy4a4RR7H6.md) | real-estate media | 17 s | one take, "YOU NEED THIS HOUSE", address card |
| [instagram-DHwuiAbyFgw](instagram-DHwuiAbyFgw.md) | luxury media | 49 s | presenter, golden hour to twilight, flares, key-word captions, logo |

## Patterns across them (2026-10-11)
1. **A person leads** in 6 of 7: the agent talks to the camera or walks through
   the house. For real estate that is the AI avatar; for Airbnb, the host as an
   avatar, or no person (the Seaera format).
2. **Captions word by word**, centred, white; or single big words on the beat.
3. **Fly-through with motion-blur whips** (zoom, spin, speed ramps), light leaks
   and white flashes as transitions; cuts about every second.
4. **Endings**: contact card (photo, name, phone), address in spaced capitals,
   brand logo on a twilight exterior.
5. **Hooks**: curiosity ("another of those Airbnb"), result ("under contract in
   4 days"), command ("You need this house"), argument ("what your money buys").
6. **Light**: bright and airy, or golden hour to twilight.
7. The post caption carries the facts (price, beds, checklist, link); the video
   carries the feeling.

## What the tool can and cannot do yet
| Element | Status |
|---|---|
| Hook over the first shot, beat cuts, close-ups from photos, triptych, grid, end card, logo, warm grade | done (`template/`) |
| Big single words on beats | possible now (timed text in a board) |
| Whip / zoom / spin blur transitions, light leaks, flares, white flash | to build in the template |
| Word-by-word caption track synced to a voice | to build (needs a script and its timing) |
| Contact card pill, address card, DM call to action | to build (HTML, easy) |
| Camera moving inside a room, fly-through feel | Veo (`veo-clip.mjs`, waits for the Gemini key) |
| Aerials, FPV | the owner's footage, or Veo with limits |
| A presenter talking (agent, host) | AI avatar + voice: not chosen yet |
| Type behind a person | needs a person matte on video: later |
