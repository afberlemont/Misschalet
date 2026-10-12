# Images et lieux

## La règle (V05)
**Quand on cite un lieu, l'image montre exactement ce lieu**, et c'est une
belle image : lumière, cadrage, saison. Si on n'a pas d'image exacte, on ne
nomme pas le lieu (on dit « dans la région ») ou on attend la bonne image.
Une image d'ambiance (du ski, une fondue) est possible sans nom de lieu.

## D'où viennent les images
1. **Les photos des chalets** (annonces Airbnb, ou les siennes).
2. **Ses propres photos** de la région (les meilleures : elles sont à elle).
3. **Images libres pour la publicité** : Unsplash, Pexels, domaine public.
   Chaque image est notée dans `../studio/region/sources.json` : ce qu'elle
   montre, le lieu vérifié (et comment), l'auteur, la licence, le lien.
4. **Partenaires** (office du tourisme, bains, restaurants) : seulement avec
   leur accord écrit, noté dans `sources.json`.

Jamais : une image trouvée sur Google, Instagram ou un site sans licence
claire, ni une image d'un autre endroit légendée avec le nom d'un lieu.

## La banque d'images de la région
Liste à jour : `../studio/region/sources.json` (les fichiers sont dans
`studio/cache/region/`, hors du dépôt). Recherche du 2026-10-12 : 16 images,
licence Unsplash (publicité permise, pas d'attribution obligatoire).

| Image | Ce qu'on peut écrire dessus |
|---|---|
| `villars-pistes-ski` | Villars, les pistes (deux skieurs reconnaissables : pas en publicité sans recadrage) |
| `chamossaire-hiver` | Le Chamossaire, au-dessus de la mer de brouillard |
| `gryon-train-neige` | Le train de montagne, à Gryon (ne pas nommer la ligne) |
| `gryon-chalet-neige` | Gryon, un balcon sous la neige (format vertical) |
| `bex-haute-pointe-hiver` | Au-dessus de Bex, en hiver (ne pas nommer le sommet) |
| `grand-muveran-lune` | Le Grand Muveran (peu de neige) |
| `dents-du-midi-depuis-villars-nb` | Les Dents du Midi depuis Villars (noir et blanc) |
| `dents-du-midi-mer-de-brouillard` | Les Dents du Midi (photo prise à Leysin : ne pas écrire « depuis Villars ») |
| `dents-du-midi-ciel-rose`, `dents-du-midi-foret-hiver` | Les Dents du Midi (point de vue inconnu) |
| `generique-*` (poudreuse, fondue, feu et vin, luge en famille, forêt au soleil, bain chaud) | **aucun nom de lieu** ; ne pas laisser croire que c'est un des chalets |

**Lieux sans belle image exacte (à trouver, ou à demander)** :
- **Les Bains de Lavey** : aucune image libre ; demander aux Bains
  (@lesbainsdelavey) des photos pour partenaires, ou en faire sur place.
- **Le village de Villars en hiver**, **la télécabine du Roc d'Orsay** : rien
  de libre ; les photos de Misschalet seraient idéales.
- **Raclette, raquettes au coucher du soleil** : rien de beau en libre.
- **Les restaurants** : seulement avec leur accord (leurs photos sont à eux).
