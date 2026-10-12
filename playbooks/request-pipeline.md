# Playbook: every request (the pipeline)

Misschalet writes the way she talks: several subjects in one message, plain
words, half ideas. Your job as orchestrator is to **untangle, elevate and
route**, then **check everything twice** before she sees it.

## The flow
1. **Intake** (always, first): `intake-router` splits her message into work
   items, checks what already exists, spots gaps, writes the plan to
   `content/demandes/<date>-<n>.md`.
2. **You review the plan** (orchestrator): is the split right? Is the order
   right for bookings? Does each item fit the phase? Are the questions really
   needed (ask only what blocks)?
3. **Reformulate to her, in French**, short and encouraging: « J'ai compris
   trois choses : 1) … 2) … 3) …. Je commence par la 1 ? » Use the premium
   wording from `brand-voice` when you restate an idea, so she sees her idea
   already elevated. Several subjects → one at a time; the others are noted
   (calendar, `ideas/inbox.md`), never lost.
4. **Run each item's pipeline** (table below). Independent items run in
   parallel; steps inside a pipeline run in order.
5. **Quality gate**: `quality-reviewer` on every finished piece. Fixes → the
   agent concerned corrects → review again (at most 2 rounds; then tell her
   what is blocking).
6. **Present** to her (stills first for video), ask oui / modifie / non,
   then the learning loop (`playbooks/feedback.md`).
7. **Record**: the piece in `content/registre.md`; the calendar status; the
   request file closed ("fait", "en attente de …"); `state/last-run.md`.
   End the session by saving (commit + push with her OK): what is not pushed,
   the agency cannot see.

## Pipelines (adaptable: add a row when a new kind of work appears)
| Work item | Chain of agents |
|---|---|
| **Post** (photo, carrousel, story) | `brand-voice` (angle, accroche, légende) → `photo-librarian` (images, new image if needed) → `creative-production` (`post-photos.mjs` exports) → `quality-reviewer` |
| **Video / reel** | `brand-voice` (hook, on-screen words, caption) → `photo-librarian` → `creative-production` (board, stills) → `quality-reviewer` → her OK on stills → render |
| **Idea** | `brand-voice` (an impactful title and one line) → `ideas/inbox.md` (`playbooks/ideas.md`) |
| **Feedback** | `playbooks/feedback.md` (apply → ask to remember → rulebook) |
| **Fact about a chalet** | `research-intelligence` (update `properties/<slug>/`) → her confirmation → `approved-claims.md` |
| **Planning** (dates, rhythm) | `editorial-planner` → `quality-reviewer` (duplicates, balance) |
| **Message to answer** (comment, DM, review) | `social-community` → `brand-voice` → her |
| **Place or address to feature** | `research-intelligence` (sourced facts, account) → `photo-librarian` (exact image) → then as a post |
| **Ads** (phase 2) | `meta-ads` → `brand-voice` → `quality-reviewer` |

Small request (one caption tweak)? Same chain, just shorter briefs: still
`brand-voice` for the words and `quality-reviewer` at the end.

## Briefing the agents (token economy)
Paths, not pasted content; the request file as the shared context; "return
at most 10 lines + files changed". Read their summaries, open a file only
when you must decide on it.

## Growing the pipelines
A new kind of request that comes back → a new row here, with the agents it
needs; a missing skill → a new agent (`playbooks/ideas.md`, "Growing the
team") and a line in `os/evolution.md`.
