# Playbook: feedback and learning (`/retour`, and any reaction she gives)

The system gets better by remembering what Misschalet (and the agency) say
about each creation. Run this every time she reacts to a video, a post, a
caption or a plan: "trop long", "j'aime cette fin", "pas cette photo", even
in passing. The memory is the French wiki: `wiki/regles-videos.md`,
`wiki/regles-posts.md`, `wiki/journal-des-retours.md`.

## 1. Understand
Turn her words into one concrete change. If it is vague, ask **one**
multiple-choice question in French (e.g. "Plus courte comment ? 15 s · 20 s ·
juste enlever une scène"). Never ask for technical terms.

| She says | What changes in a board (`studio/properties/<slug>/reels/<name>.json`) |
|---|---|
| trop long / trop court | total beats (2 beats = 1 s at 120 bpm): remove or add a scene, shorten `beats` |
| trop rapide / trop lent | `beats` per montage shot (2 → 3) or per scene |
| la transition | `enter`: `shine`, `wipe-up`, `wipe-left`, `wipe-right`, `iris`, `cut`; `tIn` for its speed |
| je ne lis pas | fewer words, longer scene, shorter title lines |
| pas cette photo | another `n` (or a region image), or a different crop (`fx`, `fy`, `zoom`) |
| plus clair / sombre / chaud | `palette` (`papier`, `nuit`, `sable`) or `grade` |
| plus de région / plus de chalet | swap scenes between region images and chalet photos |
| a post (caption, tone, hashtags) | `content/copy/<id>.md`, via `editorial-planner` |

## 2. Apply it now
Delegate the change (`creative-production` for media, `editorial-planner`
for words), stills first, and show her the result. One round, then ask
whether it is right.

## 3. Propose to remember
Always ask, in French: **« Je garde ça pour les prochaines vidéos ? »** with
the choices: oui, pour toutes · seulement pour ce chalet · seulement pour ce
type de vidéo · non, juste cette fois. A taste that keeps coming back (twice)
deserves the question even if she did not ask.

## 4. Record
- Always: one line at the top of `wiki/journal-des-retours.md` (date, who,
  on what, her words, what was done, rule number or "non").
- If she says yes: a new row in `wiki/regles-videos.md` (V..) or
  `wiki/regles-posts.md` (P..): the rule in plain French, why (her words),
  source and date, scope. If it contradicts an active rule, move the old one
  to "Règles remplacées" (struck through, with the new number). A change to
  the "Réglages actuels" is just an edit of that list.
- Agency directions follow the same path, source "agence".

## 5. Use
`creative-production` and `editorial-planner` read the two rulebooks before
every job; the rules win over the studio defaults (`studio/CLAUDE.md`). In
the monthly review, read the rules with her: merge duplicates, drop the ones
she no longer wants.
