# Calendrier éditorial

Tenu par `editorial-planner`. Statuts mis à jour par l'orchestrateur (et
`publishing-distribution` en phase 3).

Statuts : backlog · selected · briefed · in-production · review · approved ·
scheduled · published · measured · archived.

**Statut : 4 semaines proposées par l'agence (2026-10-12), du 19 octobre au
13 novembre ; à valider avec Misschalet au démarrage** (`playbooks/startup.md`).
Les légendes s'écrivent une fois les faits approuvés.

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
| 2026-10-19-collection | 2026-10-19 (lun) 18:00 | Instagram | Le chalet | Carrousel | Présenter la collection, tous chalets : La Rosière (chalet haut de gamme, sauna), Les Clématites (chalet de 3 niveaux en plein centre de Villars), Pierre Fleur (vue sur les montagnes) | 6 photos dans cet ordre : La Rosière 76 (extérieur), 4 (salon) · Les Clématites 1 (salon), 81 (extérieur, nuit sous la neige) · Pierre Fleur 42 (photos supplémentaires, chalet et vue), 2 (salon) | Hook : « Trois chalets, trois caractères » + légende après validation des faits | backlog |
| 2026-10-21-rosiere-luxe | 2026-10-21 (mer) 18:00 | Instagram | Les détails | Reel court | La Rosière : grande cheminée, linge brodé, sauna (preuves du haut de gamme) | Tableau existant `luxe` (photos 5, 4, 24, 92, 18, 1) : `node studio/render.mjs chaletlarosiere --reel luxe`, stills d'abord, muet | Hook : « Un séjour d'exception à Villars » + légende après validation des faits | backlog |
| 2026-10-23-pierrefleur-lancement | 2026-10-23 (ven) 18:00 | Instagram | Le chalet | Carrousel | Lancer Pierre Fleur : le chalet, ses terrasses et son salon (faire connaître, premiers avis à venir) | 4 photos dans cet ordre : 34 (extérieur, vue), 27 (extérieur), 4 (salon), 15 (espace repas) | Hook : « Faites connaissance avec Pierre Fleur » + légende après validation des faits | backlog |
| 2026-10-26-clematites-literie | 2026-10-26 (lun) 18:00 | Instagram | Les détails | Photo | Les Clématites : literie brodée aux couleurs du chalet, duvets de plumes | 1 photo : 43 (chambre 2, linge brodé) | Hook : « Une literie brodée aux couleurs du chalet » + légende après validation des faits | backlog |
| 2026-10-28-rosiere-decouverte | 2026-10-28 (mer) 18:00 | Instagram | Le coin | Reel court | La Rosière : une journée parfaite à Villars (les pistes, le train dans la neige, les Dents du Midi, la fondue, le feu et le sauna) | reel prêt : `studio/properties/chaletlarosiere/reels/decouverte.json` (26,5 s, muet) | Hook : « Le bus de ski gratuit à 50 m » + légende après validation des faits | backlog |
| 2026-10-30-pierrefleur-saison | 2026-10-30 (ven) 18:00 | Instagram | Réserver | Carrousel | Pierre Fleur : louer pour toute la saison d'hiver, « conditions sur demande » (à vérifier : absent de la liste Proposées, conditions à obtenir d'elle) ; dates à confirmer avec Misschalet | 4 photos dans cet ordre : 37 (photos supplémentaires, intérieur), 12 (espace repas), 7 (cuisine), 26 (extérieur) | Hook : « Tout un hiver à la montagne » + légende après validation des faits | backlog |
| 2026-11-02-clematites-centre | 2026-11-02 (lun) 18:00 | Instagram | Le coin | Photo | Les Clématites : en plein centre de Villars (restaurant à 100 m, boulangerie à 250 m, café et bar à 200 m, ski-bus gratuit à 50 m) | 1 photo : 84 (photos supplémentaires, panorama enneigé) | Hook : « Restaurant à 100 m, boulangerie à 250 m » + légende après validation des faits | backlog |
| 2026-11-04-pierrefleur-vue | 2026-11-04 (mer) 18:00 | Instagram | Le chalet | Reel court | Pierre Fleur : le séjour en famille (la vue, la chambre des enfants, le jardin, la luge) | reel prêt : `studio/properties/chaletpierrefleur/reels/en-famille.json` (26,5 s, muet) | Hook : « Une vue imprenable sur les montagnes » + légende après validation des faits | backlog |
| 2026-11-06-rosiere-reserver | 2026-11-06 (ven) 18:00 | Instagram | Réserver | Carrousel | La Rosière : pour les groupes, 14 voyageurs, 6 chambres, sauna ; dates à confirmer avec Misschalet | 5 photos dans cet ordre : 76 (extérieur), 4 (salon), 18 (espace repas), 85 (photos supplémentaires, sauna), 86 (photos supplémentaires, local à skis) | Hook : « Quatorze voyageurs, six chambres, un sauna » + légende après validation des faits | backlog |
| 2026-11-09-pierrefleur-animaux | 2026-11-09 (lun) 18:00 | Instagram | Le chalet | Carrousel | Pierre Fleur : animaux acceptés, jardin (conditions éventuelles à vérifier avec elle) | 3 photos : 29, 30, 31 (extérieur ; repérer avec elle celles du jardin, ajouter une photo avec un chien si elle en a une) | Hook : « Vos amis à quatre pattes sont bienvenus » + légende après validation des faits | backlog |
| 2026-11-11-clematites-reel | 2026-11-11 (mer) 18:00 | Instagram | Les détails | Reel court | Les Clématites : le séjour entre amis (une douche par chambre, la table pour douze, le ski, le village à pied) | reel prêt : `studio/properties/chaletlesclematites/reels/entre-amis.json` (26,5 s, muet) | Hook : « Un salon avec cheminée, une cuisine complète » + légende après validation des faits | backlog |
| 2026-11-13-pierrefleur-enfants | 2026-11-13 (ven) 18:00 | Instagram | Réserver | Carrousel | Pierre Fleur pour les familles : chambre dédiée aux enfants avec lits superposés (nombre de lits à confirmer), 11 voyageurs dont 4 enfants ; dates à confirmer avec Misschalet | 4 photos dans cet ordre : 21 (chambre 5, le dortoir à l'étage), 20 (chambre 4, balcon), 16 (chambre 1), 15 (espace repas) | Hook : « Une chambre dédiée aux enfants » + légende après validation des faits | backlog |

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
