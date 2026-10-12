# Playbook: daily routine (`/journee`)

Every working day, 10 to 20 minutes of Misschalet's time. Reference:
`os/PROPERTY_GROWTH_ORCHESTRATOR.md` section 9. If onboarding is not done,
offer `/demarrage` instead.

## 1. Read state (small reads only)
`state/current-priorities.md`, `state/last-run.md`, the next 7 days of
`content/calendar.md`, the latest file in `analytics/weekly/` (summary only).
Read `strategy/growth-strategy.md` only if today's work touches strategy.

## 2. Live signals (only what is connected, see `os/integrations.md`)
Delegate in parallel, each returning at most 5 lines:
- `analytics-measurement`: anything unusual since yesterday (GA4, Search
  Console). Nothing connected → skip, do not guess.
- `social-community`: comments, DMs and reviews she pastes or that a connected
  tool shows, classified by `playbooks/community.md`.
- `publishing-distribution`: the queue (what is scheduled, what failed).
Do not react to one noisy day.

## 3. Choose today's work (the smallest set with the biggest impact)
Usually: **1 main post**, optional story, community replies, and at most one
SEO or content task (an article section, a page fix, a FAQ). Prefer what the
calendar already says; change it only for a real signal (a question asked 3
times, a sudden gap in bookings, an event).

## 4. Brief (delegate to `editorial-planner`)
The post brief in `content/briefs/<id>.md`: objective, audience, angle, hook,
story, caption, CTA, platform, visual concept, source material, must-show
details, on-screen words, duration, format, references, exact claims,
deadline. Only claims from `properties/<slug>/approved-claims.md`.

## 5. Creative (if a video or visual is needed)
Write the work order (`playbooks/creative-work-order.md`), delegate to
`creative-production`. Stills first; full render after you checked them.

## 6. Review what comes back
Brand fit, accuracy, no invented facts, readability, pace, safe area, platform
fit, CTA. If something is off, a precise revision brief (what, where, why).

## 7. Approval (with Misschalet, in French)
Package: the video or visual, the caption, the date and time, the channel.
Status `review` in the calendar. She says oui / modifie / non; record it
(`state/decisions.md` only if it sets a rule for the future).

## 8. Schedule
Approved → `publishing-distribution` schedules (Postiz when connected;
otherwise it prepares a ready-to-post package and she posts it by hand) and
records platform, time, post ID, final caption, file, campaign.

## 9. Community
`social-community` drafts replies for A and B messages (she sends or
approves), logs C as ideas, escalates D to her at once.

## 10. Log
`state/last-run.md` (5 lines: date, what was done, what waits for her).
A learning goes to `state/learnings.md` only if it changes future decisions.
Reply to her with the run summary of `AGENTS.md`, short.
