# Outils connectés

L'état de chaque outil, comment le connecter, et quoi faire tant qu'il ne l'est
pas. **Un outil non connecté ne fournit aucune donnée : on ne l'invente
jamais**, on utilise la solution de repli. Mettre à jour le statut dès qu'un
outil est connecté (date, par qui). Aucun identifiant ici : seulement le nom
des variables d'environnement.

| Outil | Sert à | Statut | Connexion (agence) | Repli tant que non connecté |
|---|---|---|---|---|
| Google Analytics 4, MCP officiel `googleanalytics/google-analytics-mcp` | visites, sources, conversions, pages | non connecté | serveur MCP ajouté à Claude Code selon le README du dépôt (projet Google Cloud, API Analytics activées, identifiants par défaut de l'application) ; accès lecture à la propriété GA4 | Misschalet colle 3 à 5 chiffres (visites, sources, réservations) |
| Google Search Console | requêtes, pages, clics, positions | non connecté | via `iannuttall/seo` ou un serveur MCP Search Console ; accès « utilisateur restreint » à la propriété | export « Performances » (requêtes et pages, 3 mois) collé ou déposé en CSV |
| `iannuttall/seo` | audit technique, crawl, analyses SEO | non installé | installation selon le README du dépôt | audit manuel de quelques pages par `seo-search` (WebFetch) |
| `alirezarezvani/claude-skills` | compétences marketing (local-seo-manager, seo-audit, schema-markup, social-media-manager, social-content, content-strategy, copywriting, analytics-tracking, campaign-analytics, competitor-analysis, customer-research, conversion-optimization…) | non installé | copier **seulement** les compétences utiles dans `.claude/skills/` | les agents suivent leurs propres consignes |
| Postiz (`gitroomhq/postiz-app`) | programmation et publication, statistiques par canal | non connecté | compte Postiz (cloud ou auto-hébergé), comptes sociaux reliés, API ou MCP avec une clé en variable d'environnement | `publishing-distribution` prépare un dossier « à publier » ; Misschalet publie à la main |
| pendpost (`pendpost/pendpost`) | alternative à Postiz, validation d'abord | non choisi | idem | idem |
| Gemini API (Veo, et `/watch` en mode gemini) | mouvements de caméra dans une photo ; analyse vidéo avec le son | clé non fournie | `GEMINI_API_KEY` dans l'environnement ou `studio/.env` (ignoré par git) | studio sans IA ; analyse vidéo en mode local (images + sous-titres) |
| claude-video (`bradautomates/claude-video`, `/watch`) | étudier une vidéo | utilisé (mode local) | `playbooks/viral-video-audit.md` §0 | — |
| Airbnb | annonces, statistiques | lecture publique de l'annonce | `node studio/fetch-listing.mjs <lien>` | statistiques : Misschalet les colle |
| Instagram / TikTok insights | portée, enregistrements, partages, visites du profil | non connecté (Postiz le donnera en partie) | via Postiz | Misschalet colle les chiffres de la semaine |

## Ordre conseillé
1. GA4 + Search Console (la mesure d'abord), 2. Postiz (publier sans effort),
3. `iannuttall/seo` et les compétences utiles, 4. Gemini (quand les vidéos IA
sont décidées).
