# Playbook: startup (`/demarrage`)

The first run on a new project, and the one to re-run when the business
changes a lot (new property, new season strategy, new channel). Goal: in a few
sessions, go from nothing to an audited, prioritized 90-day strategy, a 30-day
calendar, a 7-day plan and the first creative work orders, all approved by
Misschalet. Reference: `os/PROPERTY_GROWTH_ORCHESTRATOR.md` sections 6 to 8.

It can take several sessions: **save every answer as soon as she gives it**,
and keep `state/current-priorities.md` → "Onboarding" up to date (which phase,
what is missing), so the next session resumes without asking again.

## Phase 0: where are we?
Read `state/current-priorities.md` and `state/last-run.md`. If onboarding is
done, ask her (in French) whether she wants a full restart, an update of one
part (a new property, a new channel), or the daily routine instead.

## Phase 1: context, the interview (orchestrator, with Misschalet)
1. Say in two sentences what will happen (questions, audits, then a plan to
   validate) and how long the first session takes (about 20 minutes).
2. Ask the questions in `playbooks/interview-questions-fr.md`, block by block,
   3 to 5 questions per message, multiple choice when possible. Skip what the
   files already answer; propose what you can infer and let her correct it.
3. While she answers, prefill her properties cheaply: for an Airbnb link,
   `node studio/fetch-listing.mjs <link>` (from the repo root), then delegate
   to `research-intelligence`: "turn `studio/properties/<slug>/listing.json`
   into `properties/<slug>/` (facts, amenities, location, faq, reviews) with
   every fact marked *à confirmer*". She confirms; confirmed facts go to
   `approved-claims.md`. Nothing reaches content before that.
4. Write as you go: `brand/` (5 files), `properties/property-index.md`,
   `state/settings.md` (rhythm, channels, approval), `os/integrations.md`
   (which accesses exist; never a password or key in a file).

Do not start Phase 2 before you know: her goals, her properties, her guests,
her booking path (Airbnb only, or a direct site too) and her channels.

## Phase 2: audits in parallel (subagents, one message, several Agent calls)
Brief each one with paths, not content; each returns at most 10 lines.

| Agent | Brief | Writes |
|---|---|---|
| `seo-search` | audit the direct site (crawl, indexability, metadata, local SEO), Search Console if connected, first keyword and intent map | `seo/audit.md`, `seo/keyword-map.md`, `seo/technical-backlog.md` |
| `analytics-measurement` | GA4 quality and baseline if connected; otherwise a measurement plan and what to set up | `analytics/measurement-plan.md`, `analytics/baseline.md` |
| `social-community` | audit her profiles and recent posts (what she shares, what works), 3 to 5 competitor or inspiration accounts | `strategy/channel-strategy.md` (draft), `community/faq.md` |
| `research-intelligence` | guests and their questions, competitors, seasonality, destination demand | `intelligence/*.md` |
| `viral-video-analyst` | the formats that work for chalets / Airbnb / the destination; the reels she likes (one by one, `playbooks/viral-video-audit.md`) | `intelligence/video-formats.md`, `references/` |
| `partnerships` | local partners worth approaching (only real places she names or confirms) | `intelligence/partners.md` |

Skip an agent when its input is missing (no site → no SEO crawl, keyword map
only) and say so. No data a tool would have given is ever made up.

## Phase 3: synthesis (orchestrator)
Read the summaries (and only the sections you need). Write the top of
`strategy/growth-strategy.md` ("Diagnostic"): current state, the 3 biggest
constraints, the 3 biggest opportunities, quick wins, medium-term bets,
experiments, measurement. Rank with Impact × Confidence × Ease × Strategic fit
(1 to 5 each); keep the 10 best, the rest goes to `content/backlog.md` or
`ideas/inbox.md`.

## Phase 4: 90-day strategy
Orchestrator writes `strategy/growth-strategy.md`: commercial objectives,
audiences, positioning, primary channels, SEO and social priorities, content
pillars, conversion priorities, experiments, KPIs, weekly cadence. In
parallel: `social-community` finalizes `strategy/channel-strategy.md`,
`editorial-planner` writes `strategy/content-pillars.md` (the 7 pillars of the
spec, adapted to her), orchestrator writes `strategy/experiments.md`.

Show her a one-screen summary in French and ask for her OK or changes before
planning. Record her decision in `state/decisions.md`.

## Phase 5: schedule
In parallel:
- `editorial-planner`: campaigns for the season (`campaigns/<name>/`), the
  30-day calendar and the 7-day plan in `content/calendar.md` (format in that
  file), with the rhythm from `state/settings.md`.
- `blog-writer`: the article plan from `seo/keyword-map.md` (titles, intent,
  dates) into the calendar's blog lines; no article written yet unless asked.
- `partnerships`: 3 partnership ideas with a first message draft (sent only by
  her).

## Phase 6: first creative work orders
For the first 1 to 3 videos of the 7-day plan, write work orders
(`playbooks/creative-work-order.md`). Delegate to `creative-production`:
**stills only** first. Show her the stills; full renders after her OK.

## Phase 7: approval and close
Present in French, short: the strategy in 5 lines, the week ahead, the first
videos, and **what she must validate**. Then: `state/current-priorities.md`
→ Onboarding: fait (date); priorities for the next 2 weeks;
`state/last-run.md`; the run summary format of `AGENTS.md`. Remind her of the
daily routine (`/journee`) and that her mentor can follow `GUIDE-MENTOR.md`.
