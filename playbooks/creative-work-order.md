# Playbook: creative work order (`/video`)

How the orchestrator (or `editorial-planner`) asks `creative-production` for a
video or a visual, and how it comes back. **Phase 1 needs no work order**: the
basic posts are made straight from the calendar line and its caption
(`.claude/agents/creative-production.md`, "Phase 1"). Use a work order for a
new video (a new board, a new format) or from phase 2. Reference:
`os/PROPERTY_GROWTH_ORCHESTRATOR.md` section 10. The creative agent never
invents a fact and never redefines the strategy.

## 1. Write the order
One file per piece: `content/briefs/<id>-video.md` (id = the calendar id,
e.g. `2026-11-03-rosiere-famille`), in French, from this template:

```markdown
# Bon de commande créatif

## ID
## Objectif            (ce que la personne doit penser, ressentir ou faire)
## Plateforme          (Instagram, TikTok, Facebook, Pinterest, YouTube Shorts…)
## Format              (reel, story, carrousel, image, motion)
## Public              (le persona, en une ligne)
## Message central     (une phrase)
## Accroche            (texte exact des 1 à 2 premières secondes)
## Déroulé
1.
2.
3.
## Bien et photos      (slug ; numéros de photos ou « au choix du studio »)
## Faits autorisés     (copiés de properties/<slug>/approved-claims.md, rien d'autre)
## Textes à l'écran    (exacts)
## Appel à l'action    (exact, et le lien)
## Règles de marque    (rappels utiles de brand/visual-guidelines.md)
## Technique
- ratio : 9:16 (1080×1920)
- durée :
- moteur : studio (par défaut) | édition du jour | mouvement de caméra IA (Veo, accord requis) | autre (voir studio/PROVIDERS.md)
- sous-titres :
- son : muet (par défaut) | musique demandée par Misschalet
- export : MP4 H.264
## Références          (références/ ou anciennes publications)
## À ne pas faire
## Livraison           (vidéo + 3 images de contrôle + légende + notes)
```

## 2. How the studio turns it into a video (creative-production)
- **A short reel or a presentation** → a board
  `studio/properties/<slug>/reels/<id>.json` (scenes timed in beats; scene
  types, transitions and close-ups in `studio/README.md`). Start from the
  nearest existing board (`demo`, `luxe`, `famille`, `couples`): reuse before
  recreate.
- **The daily issue** (an editorial "magazine" video that changes every day)
  → `node studio/render.mjs <slug>` with no board.
- **A camera move inside a photo** (AI video) → only if the order says so and
  Misschalet approved the spend: `studio/PROVIDERS.md`.
- **Something the studio cannot do yet** (avatar, voice-over, a new
  transition): say so, propose the closest thing it can do, and add the
  capability to `os/evolution.md` for the agency.

Words on screen come from the order; facts from `approved-claims.md` only. A
missing fact → ask, never fill the gap.

## 3. Check before rendering
`node studio/render.mjs <slug> --reel <id> --stills auto` → look at the stills
(safe area y 180–1560, readability, no em dash, no full stop on titles, the
right photos, the facts exact). Fix, then render the full video:
`node studio/render.mjs <slug> --reel <id>`.

## 4. Deliver
Write `content/approved/<id>/README.md` (status `review`): the video path
(`studio/out/...`, not committed), 3 stills, the caption and hashtags in French,
production notes. Return to the orchestrator in at most 10 lines. The
orchestrator reviews (`playbooks/daily.md` step 6) and asks Misschalet.

Rendered videos stay out of git (`studio/out/`); share them through the channel
Misschalet uses (her drive, a message), never committed.
