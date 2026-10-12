# Misschalet Growth OS

Ton équipe marketing dans un dossier. Ton assistant IA lit ce dépôt, devient
ton **chef d'orchestre** (l'orchestrateur), apprend ta façon de travailler en
te posant des questions, puis fait travailler une équipe de spécialistes :
audit, stratégie, planning, publications, vidéos, articles de blog, SEO,
partenariats, réponses aux messages, mesure des résultats. **Tu décides et tu
valides ; rien n'est publié sans ton accord.**

> **Pour l'agent IA qui ouvre ce dépôt** : lis `AGENTS.md` (ton rôle
> d'orchestrateur), puis `state/current-priorities.md`. Parle en français avec
> Misschalet.

## Démarrer (une seule fois)
1. Ouvre ce dossier avec ton assistant (Claude Code : l'application, le
   terminal ou claude.ai/code relié à ce dépôt GitHub).
2. Écris **`/demarrage`**. L'assistant se présente et te pose des questions
   par petits groupes (environ 20 minutes la première fois ; tu peux arrêter
   et reprendre, il se souvient).
3. Il lance les audits, te montre une stratégie sur 90 jours et le planning des
   prochaines semaines. Tu valides ou tu corriges.

## Ensuite, la routine
| Quand | Tu écris | Ce qui se passe |
|---|---|---|
| chaque jour de travail (10 à 20 min) | `/journee` | le post du jour préparé, les messages à répondre, une petite action SEO ; tu valides |
| une fois par semaine (avec ton mentor) | `/semaine` | le bilan en une page et le plan de la semaine suivante |
| une fois par mois | `/mois` | la revue de la stratégie |
| à tout moment | `/point` | où on en est, ce qui attend ta validation |
| une idée | `/idee ton idée` | notée, triée au bilan de la semaine |
| une vidéo qui t'inspire | `/analyser-video le lien` | étudiée, gardée comme référence |
| une vidéo à faire | `/video ton idée` | le studio la prépare, tu vois des images avant |
| besoin d'aide | `/aide` | la liste de ce que tu peux demander |

Tu peux aussi écrire simplement ce que tu veux, avec tes mots.

## Ce qu'il y a dans le dossier
| Dossier | Contenu |
|---|---|
| `brand/` | qui tu es, ton ton, tes voyageurs, tes offres, ton style |
| `properties/` | tes biens et leurs faits **vérifiés** (`approved-claims.md` : les seules phrases que les contenus peuvent utiliser) |
| `intelligence/` | marché, concurrents, saisons, partenaires, formats vidéo qui marchent |
| `seo/` · `analytics/` | référencement et chiffres |
| `strategy/` | la stratégie 90 jours, les canaux, les piliers de contenu, les tests |
| `content/` | le planning, les idées retenues, les briefs, les textes, les contenus prêts |
| `campaigns/` · `community/` | campagnes ; FAQ, règles de réponse, cas sensibles |
| `state/` | priorités, décisions, apprentissages, réglages (dont la validation) |
| `ideas/` | toutes les idées, de tout le monde |
| `references/` | les vidéos étudiées (texte seulement) |
| `studio/` | l'atelier vidéo (moteur technique) |
| `playbooks/`, `.claude/`, `os/`, `AGENTS.md` | le fonctionnement du système (entretenu par l'agence) |

## Les règles importantes
- Rien n'est publié sans ton accord (`state/settings.md`).
- Aucun fait inventé : équipements, distances, prix, avis, adresses viennent
  de toi.
- Jamais de mot de passe ni de clé dans les fichiers ou le chat.
- Vidéos muettes par défaut (tu ajoutes un son en publiant, ou tu demandes une
  musique).
- L'agence fait évoluer le système ; ton espace de travail reste à toi
  (`os/gouvernance.md`).

Pour ton mentor : **`GUIDE-MENTOR.md`**. Pour l'avenir du système : `VISION.md`.

## Studio (pour l'agent ou l'agence)
Première fois sur un ordinateur : Node 20+, ffmpeg, puis
`npm --prefix studio install` (et `npx playwright install chromium` si
Chromium manque). Détails : `studio/README.md`.
