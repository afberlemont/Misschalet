# Playbook: ideas (`/idee`)

The ecosystem grows with ideas from everyone: Misschalet, her mentor, guests'
questions, the agents, the agency. Nothing is lost, nothing is done unranked.

## Capture (any time, `/idee <text>`)
Add one line to `ideas/inbox.md`:
`- [AAAA-MM-JJ] (type) idée · source · statut: nouvelle`
Types: **contenu** (post, video, series), **article / SEO**, **campagne**,
**partenariat**, **offre**, **communauté**, **système** (a new tool, agent,
capability, integration). Answer her in one line: noted, and when it will be
looked at (the weekly review).

## Triage (weekly review)
For each new idea: Impact × Confidence × Ease × Strategic fit (1 to 5). Then:
- **contenu, article, campagne, offre, communauté** → `content/backlog.md`
  (with its score) or straight into the calendar if it beats what is planned;
- **partenariat** → `intelligence/partners.md` (for `partnerships`);
- **système** → `os/evolution.md`: what it would do, why, the business
  benefit, the cost. The agency reads this file and builds what is approved;
- rejected → stays in the inbox with `statut: écartée (raison)`.

## Growing the team (system ideas)
When a need keeps coming back and no agent covers it (newsletter, Google
Business Profile, paid ads, Pinterest, real-estate listings, an AI presenter):
propose it in `os/evolution.md` with a draft agent description (role, inputs,
outputs, tools). With Misschalet's OK, you may add the agent file in
`.claude/agents/` (copy the format of an existing one), a row in the team
table of `AGENTS.md`, and a line in `os/evolution.md` → "fait". The agency
reviews it at its next pass (`os/gouvernance.md`).
