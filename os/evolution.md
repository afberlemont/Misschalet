# Évolution du système

Ce que le système sait faire, ce qui est prévu, et les propositions. Lu par
l'agence à chaque passage ; alimenté par l'orchestrateur (idées de type
« système », `playbooks/ideas.md`) et par l'agence.

## Prévu
| Capacité | Pourquoi | Statut |
|---|---|---|
| Mouvements de caméra IA dans une photo (Veo) | vidéos plus vivantes à partir des photos | script prêt (`studio/veo-clip.mjs`) ; attend la clé et l'accord |
| Transitions IA entre deux photos | passages d'une pièce à l'autre | à construire (`studio/PROVIDERS.md`) |
| Visite animée pièce par pièce | la visite complète en un reel | après les mouvements de caméra |
| Voix off et sous-titres mot à mot | formats qui retiennent l'attention | à construire |
| Présentateur IA (avatar) | immobilier d'abord, éventuellement l'hôte | non choisi |
| Annonces immobilières (portails) | même système pour l'immobilier | à construire dans `studio/fetch-listing.mjs` |
| Connexion GA4, Search Console, Postiz | mesure et publication | `os/integrations.md` |

## Agents candidats
| Agent | Quand le créer |
|---|---|
| `newsletter` | dès qu'une liste d'e-mails existe |
| `google-business-profile` | si le SEO local devient prioritaire |
| `paid-ads` | si un budget publicitaire est décidé |
| `real-estate` | pour un client agent immobilier |
| `listing-optimizer` | audit et réécriture des annonces Airbnb (photos, ordre, titre, texte) : fait à la main par l'agence le 2026-10-12, à transformer en agent si on le refait |

## Propositions (de l'orchestrateur ou de Misschalet)
Format : `- [date] proposition · pourquoi · bénéfice · coût · statut (proposée, acceptée, faite, refusée)`
