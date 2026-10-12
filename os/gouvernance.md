# Gouvernance : qui peut changer quoi

Trois acteurs travaillent dans ce dépôt GitHub (`afberlemont/misschalet`).

| Qui | Rôle | Ce qu'il modifie |
|---|---|---|
| **Misschalet** (avec son agent, l'orchestrateur) | pilote son activité, décide, valide | l'espace de travail : `brand/`, `properties/`, `intelligence/`, `seo/`, `analytics/`, `strategy/`, `content/`, `campaigns/`, `community/`, `state/`, `ideas/`, `references/` |
| **Son mentor** | l'aide à tenir le rythme, relit avec elle | rien directement ; il propose, elle décide (`GUIDE-MENTOR.md`) |
| **L'agence** (orchestrateur externe) | entretient et fait grandir le système | le système : `AGENTS.md`, `CLAUDE.md`, `.claude/`, `playbooks/`, `os/`, `studio/`, `VISION.md`, `README.md` |

## Règles
1. **Au début de chaque session**, l'agent récupère les mises à jour de
   l'agence : `git pull`. En cas de conflit sur un fichier système, la version
   de l'agence gagne ; sur un fichier de l'espace de travail, celle de
   Misschalet gagne.
2. **L'agence ne réécrit pas l'espace de travail** sans le dire : elle peut y
   ajouter (un nouveau fichier modèle, une correction signalée), jamais
   effacer les décisions ou les textes de Misschalet.
3. **L'orchestrateur peut proposer** des changements du système dans
   `os/evolution.md`. Avec l'accord de Misschalet, il peut ajouter un agent
   (`playbooks/ideas.md`) ; l'agence le relit à son passage suivant.
4. **Sauvegarder** : à la fin d'un passage important, l'agent propose
   « Je sauvegarde ? » puis fait un commit (chemins précis, jamais
   `git add -A`) et un `git push` avec son accord. Jamais de `push --force`.
5. **Secrets** : aucun mot de passe, clé ou jeton dans le dépôt ni dans le
   chat. Les clés vont dans des variables d'environnement ou un fichier
   `.env` ignoré par git ; les accès aux outils passent par leurs invitations.
6. **Médias** : les vidéos rendues restent hors de git (`studio/out/`) ; pas
   d'image, de vidéo ou de son d'autres créateurs dans le dépôt.
7. **Publication** : rien n'est publié sans l'accord de Misschalet
   (`state/settings.md`).

## Messages de commit
`<zone>: <ce qui change>` en une ligne, par exemple
`contenu: planning du 3 au 9 novembre` ou `système: agent newsletter`.
