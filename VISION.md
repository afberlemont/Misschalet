# Vision: Misschalet Growth OS (agency, 2026-10-12)

**What it is**: a marketing team in a repository. Misschalet opens it with her
AI agent; the agent reads `AGENTS.md`, becomes the orchestrator, learns her
strategy by asking her questions in French, audits her market, SEO, analytics,
social accounts and the video formats that work, builds a 90-day strategy and
a schedule, then runs it every day with specialist subagents: posts, videos,
articles, partnerships, community, measurement. She approves; her mentor helps
her keep the rhythm; the agency maintains and extends it from outside.

**Start basic** (`os/phases.md`): phase 1 is only a schedule and basic posts
published regularly, the agent directing and keeping her focused; phase 2
adds the growth audit, strategy, SEO, blog and partnerships; phase 3 the
connected tools (GA4, Search Console, Postiz, AI video).

**For whom next**: other Airbnb hosts and real-estate agents (the same system,
a new workspace).

## Layers
| Layer | Where | State |
|---|---|---|
| Orchestrator | `AGENTS.md`, `CLAUDE.md`, `playbooks/`, `os/PROPERTY_GROWTH_ORCHESTRATOR.md` | done; learns her strategy at `/demarrage` |
| Specialists | `.claude/agents/` (10) | done; more as needs appear (`os/evolution.md`) |
| Workspace (her business memory, in French) | `brand/`, `properties/`, `intelligence/`, `seo/`, `analytics/`, `strategy/`, `content/`, `campaigns/`, `community/`, `state/`, `ideas/` | skeleton; filled at onboarding |
| Video formats | `references/`, `playbooks/viral-video-audit.md`, `intelligence/video-formats.md` | 7 reels studied; audit routine done |
| Studio (Creative Production) | `studio/` | listing → daily issue and storyboarded reels; silent by default |
| Integrations | `os/integrations.md` | to connect: GA4, Search Console, SEO tools, Postiz, Gemini |

## Studio modules
| Module | What it does | State |
|---|---|---|
| Fetch | listing link → facts, rooms, equipment, distances, photos | Airbnb done; real-estate portals to add |
| Plan | daily issue; written boards (demo, personas) | done |
| Post images | listing photos cut for a photo post, carousel or story (`post-photos.mjs`) | done |
| Render | HTML motion template → MP4 9:16, frame-exact | done |
| Motion | a photo → a camera move inside the room (Veo 3.1) | script ready, waits for the Gemini key and approval |
| Transitions | AI transitions between two photos (first / last frame) | planned (`studio/PROVIDERS.md`) |
| Walkthrough | clips stitched room by room with our titles | after Motion |
| Recreate | a reference → a board for a listing (new hook, our content) | by hand from a work order; to automate |
| Avatar | a presenter (host or agent) talking from a script | not chosen; real estate first |
| Voice and captions | script, voice, word-by-word captions | to build; music stays off unless asked |
| Publish | Postiz scheduling from approved packages | when connected |

## Principles
- Business before vanity: bookings and direct bookings first.
- Her facts only; hooks may change, facts may not.
- Spend little: subagents on small models, one AI clip at a time, stills
  before renders, nothing in batches without asking.
- One source of truth per fact; everything she writes stays hers.
- Client-ready at any time: no secrets, no third-party media committed.
