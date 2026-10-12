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
| Reel court | 8 à 12 s, muet (elle ajoute un son dans l'appli) | `node studio/render.mjs <slug> --reel <nom>` (vidéos existantes : La Rosière luxe, famille, couples, demo, découverte ; Les Clématites entre-amis ; Pierre Fleur en-famille) |

| ID | Date | Canal | Thème | Format | Sujet | Photos / vidéo | Légende | Statut |
|---|---|---|---|---|---|---|---|---|
| 2026-10-19-collection | 2026-10-19 (lun) 18:00 | Instagram | Le chalet | Carrousel | Présenter la collection, tous chalets : La Rosière (chalet haut de gamme, sauna), Les Clématites (chalet de 3 niveaux en plein centre de Villars), Pierre Fleur (vue sur les montagnes) | 6 photos dans cet ordre : La Rosière 76 (extérieur), 3 (salon) · Les Clématites 4 (salon), 83 (extérieur, détail de la façade de nuit) · Pierre Fleur 26 (extérieur, vue aérienne), 4 (salon) ; aucune n'est une photo principale d'un reel du calendrier | Hook : « Trois chalets, trois caractères » + légende après validation des faits | backlog |
| 2026-10-21-rosiere-luxe | 2026-10-21 (mer) 18:00 | Instagram | Les détails | Reel court | La Rosière : grande cheminée, linge brodé, sauna (preuves du haut de gamme) | Tableau existant `luxe` (photos 5, 4, 24, 92, 18, 1) : `node studio/render.mjs chaletlarosiere --reel luxe`, stills d'abord, muet | Hook : « Un séjour d'exception à Villars » + légende après validation des faits | backlog |
| 2026-10-23-pierrefleur-lancement | 2026-10-23 (ven) 18:00 | Instagram | Le chalet | Carrousel | Lancer Pierre Fleur : le chalet, son balcon et son salon (faire connaître, premiers avis à venir) ; la présentation du chalet, avant le reel du 4 nov qui porte sur la vue et la famille | 3 photos dans cet ordre : 30 (extérieur, façade et balcon sculpté), 31 (extérieur, balcon), 6 (salon) | Hook : « Faites connaissance avec Pierre Fleur » + légende après validation des faits | backlog |
| 2026-10-26-clematites-cuisine | 2026-10-26 (lun) 18:00 | Instagram | Les détails | Photo | Les Clématites : la cuisine complète, noir et bois (lave-vaisselle, congélateur, four, vaisselle complète ; équipements à faire confirmer) ; une pièce que le reel du 28 oct ne montre pas | 1 photo : 12 (cuisine) | Hook : « Une cuisine pensée dans les moindres détails » + légende après validation des faits | backlog |
| 2026-10-28-clematites-entre-amis | 2026-10-28 (mer) 18:00 | Instagram | Le chalet | Reel court | Les Clématites : le séjour entre amis (six chambres, six salles de bain privatives dont trois en suite, le feu de cheminée, dîner à douze, le bus de ski gratuit à 50 m, le village à pied) | reel prêt : `studio/properties/chaletlesclematites/reels/entre-amis.json` (26,5 s, muet) | Hook : « Douze amis au cœur de Villars » + légende après validation des faits | backlog |
| 2026-10-30-pierrefleur-saison | 2026-10-30 (ven) 18:00 | Instagram | Réserver | Carrousel | Pierre Fleur : louer pour toute la saison d'hiver, « conditions sur demande » (à vérifier : absent de la liste Proposées, conditions à obtenir d'elle) ; dates à confirmer avec Misschalet | 3 photos dans cet ordre : 14 (espace repas, vue sur le séjour et le poêle), 12 (espace repas), 7 (cuisine) | Hook : « Tout un hiver à la montagne » + légende après validation des faits | backlog |
| 2026-11-02-clematites-acces | 2026-11-02 (lun) 18:00 | Instagram | Le coin | Photo | Les Clématites : Villars, une base pour les Alpes (1 h 15 en voiture depuis l'aéroport de Genève ; Verbier et les Portes du Soleil à 40 min) ; temps de trajet de l'annonce, mode de transport à vérifier ; ni le bus de ski ni le village à pied, déjà dans le reel du 28 oct | 1 photo : 59 (chambre 5, vue depuis le balcon) | Hook : « Villars, à 1 h 15 de l'aéroport de Genève » + légende après validation des faits | backlog |
| 2026-11-04-pierrefleur-en-famille | 2026-11-04 (mer) 18:00 | Instagram | Le chalet | Reel court | Pierre Fleur : le séjour en famille (une maison de famille à la vue imprenable, le feu de cheminée, le dortoir des enfants, le jardin face aux montagnes, vos amis à quatre pattes bienvenus, l'hiver à hauteur d'enfant) | reel prêt : `studio/properties/chaletpierrefleur/reels/en-famille.json` (26,5 s, muet) | Hook : « Une maison de famille à la vue imprenable » + légende après validation des faits | backlog |
| 2026-11-06-rosiere-reserver | 2026-11-06 (ven) 18:00 | Instagram | Réserver | Carrousel | La Rosière : réserver pour un grand groupe (14 voyageurs, 6 chambres, 5,5 salles de bain, local à skis et sèche-chaussures ; capacité à confirmer) ; dates à confirmer avec Misschalet ; ni le sauna ni la cheminée, déjà dans les reels `luxe` et découverte | 5 photos dans cet ordre : 33 (chambre 3), 39 (chambre 4), 16 (espace repas), 51 (salle de bain 1), 86 (photos supplémentaires, local à skis) | Hook : « Un chalet généreux, pensé pour se retrouver à quatorze » + légende après validation des faits | backlog |
| 2026-11-09-pierrefleur-chambres | 2026-11-09 (lun) 18:00 | Instagram | Le chalet | Carrousel | Pierre Fleur : quatre chambres doubles, certaines mansardées, dans l'ambiance d'un vrai chalet alpin (à vérifier avec elle : chambres mansardées, hauteur de porte de 120 cm à signaler) ; ni le jardin, ni les animaux, ni le dortoir des enfants, déjà dans le reel du 4 nov | 3 photos dans cet ordre : 20 (chambre 4, balcon), 18 (chambre 2), 19 (chambre 3) | Hook : « Quatre chambres doubles, l'ambiance d'un vrai chalet alpin » + légende après validation des faits | backlog |
| 2026-11-11-rosiere-decouverte | 2026-11-11 (mer) 18:00 | Instagram | Le coin | Reel court | La Rosière : le séjour découverte, une journée à Villars des pistes au sauna (le domaine skiable, le train à crémaillère, les Dents du Midi, la fondue, la grande cheminée, le sauna) ; placé le plus tard possible dans les 4 semaines (images d'hiver et de train) ; à vérifier avant de publier : ouverture des pistes 2026-2027 (tvgd.ch/horaires), train Bex-Villars remplacé par des bus jusqu'au 29 nov. | reel prêt : `studio/properties/chaletlarosiere/reels/decouverte.json` (26,5 s, muet) ; la photo 4 est aussi dans `luxe`, 21 jours plus tôt | Hook : « Une journée au-dessus des nuages » + légende après validation des faits | backlog |
| 2026-11-13-pierrefleur-semaine | 2026-11-13 (ven) 18:00 | Instagram | Réserver | Carrousel | Pierre Fleur : réserver une semaine de ski (séjours à la semaine pendant la saison de ski, l'autre formule après « toute la saison » du 30 oct ; 11 voyageurs, 5 chambres, 3 salles de bain) ; dates, conditions et distance aux pistes à confirmer avec Misschalet ; ni la chambre des enfants ni la grande table, déjà dans le reel du 4 nov | 3 photos dans cet ordre : 5 (salon), 17 (chambre 1), 22 (salle de bain 1) | Hook : « Votre semaine de ski à Pierre Fleur » + légende après validation des faits | backlog |

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
