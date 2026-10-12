# Calendrier éditorial

Tenu par `editorial-planner`. Statuts mis à jour par l'orchestrateur (et
`publishing-distribution` en phase 3).

Statuts : backlog · selected · briefed · in-production · review · approved ·
scheduled · published · measured · archived.

**Statut : vide** (rempli au démarrage, `playbooks/startup.md`).

## Phase 1 : simple
4 semaines planifiées à l'avance, une ligne par post.

**Rythme par défaut** : 3 posts par semaine (par exemple lundi, mercredi,
vendredi vers 18 h), selon `state/settings.md`. Jamais deux posts le même jour
pour rattraper un retard.

**4 thèmes, en alternance** (jamais deux fois le même d'affilée) :
1. **Le chalet** : donner envie (une pièce, une ambiance, la lumière).
2. **Les détails** : la preuve (cheminée, sauna, literie, cuisine, local à skis).
3. **Le coin** : la destination, avec seulement les distances approuvées et
   les adresses qu'elle donne.
4. **Réserver** : pour qui, quand, comment (lien de réservation), dates à remplir.

**4 formats de base** :
| Format | Ce que c'est | Fabriqué par |
|---|---|---|
| Photo | 1 photo 4:5 + légende | `node studio/post-photos.mjs <slug> <id> <n>` |
| Carrousel | 3 à 6 photos 4:5 dans l'ordre + légende | `node studio/post-photos.mjs <slug> <id> <n> <n> …` |
| Story | 1 photo 9:16, une phrase ou un sondage ajouté dans l'appli | `… --format 9:16` |
| Reel court | 8 à 12 s, muet (elle ajoute un son dans l'appli) | `node studio/render.mjs <slug> --reel <nom>` (tableaux existants : luxe, famille, couples, demo) |

| ID | Date | Canal | Thème | Format | Sujet | Photos / vidéo | Légende | Statut |
|---|---|---|---|---|---|---|---|---|

## Phase 2 et suivantes : format complet
Chaque post planifié contient (en YAML dans `content/briefs/<id>.md`) :

```yaml
id: 2026-11-03-rosiere-famille
date: 2026-11-03 18:00
platform: instagram
campaign: hiver-familles
content_pillar: experience
audience: familles
objective: demandes de réservation pour les vacances de février
funnel_stage: considération
topic:
hook:
format: reel 12 s
seo_or_social_signal:
cta:
property: chaletlarosiere
destination: Villars-sur-Ollon
creative_required: oui, bon de commande content/briefs/<id>-video.md
status: backlog
owner: editorial-planner
measurement:
```
