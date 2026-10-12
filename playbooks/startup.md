# Playbook: startup, phase 1 (`/demarrage`)

Phase 1 is deliberately basic: **a schedule and simple posts, published
regularly.** No audit, no SEO, no analytics, no tools to connect, no web
research. You are here to direct and focus: understand what she wants, choose
for her what to post and when, prepare it, and keep her on rhythm. Phases:
`os/phases.md`.

One session of about 20 minutes. If it stops halfway, save what you have and
note the step in `state/current-priorities.md`; the next session resumes there.

## 1. Hello (orchestrator)
In French, 3 lines: you will ask a few questions, then prepare her posting
plan for the next 4 weeks and the posts of the first week; she validates; she
posts them herself.

## 2. The essentials (2 batches of questions)
Only the questions marked ★ in `playbooks/interview-questions-fr.md`. Propose
what you already know (La Rosière is imported) and let her correct. Write the
answers at once, briefly: `brand/brand-context.md` (goal), `brand/target-guests.md`,
`brand/offers.md` (the booking link), `brand/tone-of-voice.md`,
`state/settings.md` (channels, posts per week, approval, day of the weekly
point).

## 3. The facts we may say
Show her the "Proposées" list of `properties/<slug>/approved-claims.md` and
the 2 or 3 questions of `facts.md` → "À clarifier". What she confirms moves to
"Approuvées" (with the date); what she corrects is corrected. A new property:
`node studio/fetch-listing.mjs <link>`, then `research-intelligence` prepares
the files (everything `à confirmer`).

## 4. The schedule (delegate to `editorial-planner`)
Brief: the next 4 weeks in `content/calendar.md` (phase 1 table), her rhythm
(default 3 posts a week), the 4 phase-1 themes and formats (in that file),
the season, only approved claims. Then the captions of week 1 in
`content/copy/<id>.md`. Return at most 10 lines.

## 5. The posts of week 1 (delegate to `creative-production`)
Brief: for each post of week 1, the images or the short video named in the
calendar: photos with `node studio/post-photos.mjs`, reels from the existing
boards (stills first). Packages in `content/approved/<id>/README.md`, status
`review`. Return at most 10 lines.

## 6. Validation (with her)
Show week 1 post by post: image(s) or stills, caption, day. She says oui /
modifie / non. Approved → status `approved`. Explain how to post (save the
images or the video, paste the caption, add a sound in the app if she wants).

## 7. Close
`state/current-priorities.md` → Onboarding: fait (date), phase 1, the focus
of the next 4 weeks in one line; `state/last-run.md`. End with **one** next
action for her (e.g. "lundi : publie le post 1") and the routine:
`/semaine` once a week to prepare the next week in one go, `/journee` on
posting days. Offer to save (`os/gouvernance.md`).
