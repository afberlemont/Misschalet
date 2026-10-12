/**
 * A first property.json drafted from listing.json, so a new listing renders
 * the day it is fetched. Everything in it is taken from the listing (rooms,
 * their equipment, the overview, the host's neighbourhood notes); the copy is
 * generic and is meant to be rewritten, the photos re-chosen, pins added.
 * fetch-listing.mjs writes it only when the property has no property.json yet.
 */
const COPY = {
  fr: {
    salon: { section: 'Le salon', title: ['Le salon,', '<em>pour se retrouver</em>'], caption: 'Le salon.' },
    cuisine: { section: 'La cuisine', title: ['Tout', '<em>pour cuisiner</em>'], caption: 'La cuisine équipée.' },
    repas: { section: 'La table', title: ['À table,', '<em>tous ensemble</em>'], caption: "L'espace repas." },
    chambres: { section: 'Les chambres', title: ['Les chambres,', '<em>au calme</em>'], caption: 'Les chambres.' },
    bains: { section: 'Les bains', title: ['Les salles', '<em>de bains</em>'], caption: 'Les salles de bains.' },
    dehors: { section: 'Dehors', title: ['Le grand', '<em>air</em>'], caption: "L'extérieur." },
    facts: ["L'essentiel", '<em>en chiffres</em>'],
    nearby: ['Tout', '<em>autour</em>'],
    cta: 'Réservez votre séjour',
    rating: (r) => `Note ${String(r.average).replace('.', ',')} / 5 · ${r.count} commentaires`,
  },
  en: {
    salon: { section: 'The living room', title: ['A room', '<em>to gather</em>'], caption: 'The living room.' },
    cuisine: { section: 'The kitchen', title: ['All you need', '<em>to cook</em>'], caption: 'The equipped kitchen.' },
    repas: { section: 'The table', title: ['Around', '<em>the table</em>'], caption: 'The dining area.' },
    chambres: { section: 'The bedrooms', title: ['Quiet', '<em>bedrooms</em>'], caption: 'The bedrooms.' },
    bains: { section: 'The bathrooms', title: ['The', '<em>bathrooms</em>'], caption: 'The bathrooms.' },
    dehors: { section: 'Outside', title: ['Fresh', '<em>air</em>'], caption: 'Outside.' },
    facts: ['The facts', '<em>in numbers</em>'],
    nearby: ['All', '<em>around</em>'],
    cta: 'Book your stay',
    rating: (r) => `Rated ${r.average} / 5 · ${r.count} reviews`,
  },
}
const ROOMS = [
  ['salon', /salon|s[ée]jour|living/i],
  ['cuisine', /cuisine|kitchen/i],
  ['repas', /repas|salle [àa] manger|dining/i],
  ['chambres', /chambre|bedroom/i],
  ['bains', /salle de bains?|bathroom|toilettes|wc/i],
  ['dehors', /ext[ée]rieur|exterior|jardin|garden|cour|yard|terrasse|patio|balcon|balcony|vue|view|piscine|pool/i],
]
// equipment every room has: not worth a chip
const DULL = /chauffage|heating|cintres|hangers|produits de base|essentials|rangement|storage|eau chaude|hot water/i

export function draftProperty(listing) {
  const lang = listing.locale === 'en' ? 'en' : 'fr'
  const c = COPY[lang]
  const parts = listing.title.replace(/^[\s\-–]+/, '').split(/\s*[-–|·]\s+|\s+[-–|·]\s*/).map((s) => s.trim()).filter(Boolean)
  const name = parts[0] || listing.city || listing.slug
  const type = (listing.propertyType || '').split(/[:：]/).pop().trim()
  const Type = type ? type[0].toUpperCase() + type.slice(1) : ''

  const chapters = []
  for (const [id, re] of ROOMS) {
    const rooms = listing.rooms.filter((r) => re.test(r.title))
    const photos = listing.photos.filter((p) => rooms.some((r) => r.title === p.room)).map((p) => p.n)
    if (!photos.length) continue
    const tags = [...new Set(rooms.flatMap((r) => r.highlights))].filter((t) => !DULL.test(t)).slice(0, 10)
    chapters.push({ id, ...c[id], text: c[id].caption, tags, photos: photos.slice(0, 8), ...(tags.length >= 7 ? { layout: 'spotlight' } : {}) })
  }

  const rows = listing.overview
    .map((s) => s.replace(/ /g, ' ').match(/^([\d.,]+)\s+(.+)$/))
    .filter(Boolean)
    .map((m) => ({ v: /[.,]/.test(m[1]) ? m[1] : Number(m[1]), l: m[2] }))
    .slice(0, 4)
  const items = listing.neighbourhood
    .map((s) => s.match(/^(.*?)\s*(?:à|at|:|-|–)?\s*([\d.,]+\s?(?:km|m))\b/i))
    .filter(Boolean)
    .map((m) => ({ name: m[1].replace(/\s*(à|at)$/i, '').trim(), d: m[2] }))
    .filter((it) => it.name)
  const caps = listing.overview.slice(0, 2).join(' · ').replace(/ /g, ' ')
  const highlight = listing.amenities.find((a) => /\bsauna\b|jacuzzi|\bspa\b|piscine|\bpool\b|hot tub|chemin[ée]e|fireplace/i.test(a))
  const firstOf = (id) => chapters.find((ch) => ch.id === id)?.photos[0]
  const covers = ['salon', 'dehors', 'chambres', 'cuisine'].map(firstOf).filter(Boolean)

  return {
    slug: listing.slug,
    lang,
    startDate: listing.fetchedAt.slice(0, 10),
    name,
    kicker: [Type, listing.city].filter(Boolean).join(' · '),
    place: listing.city || '',
    url: listing.shortUrl,
    palettes: ['papier', 'sable', 'nuit'],
    hashtags: [`#${(listing.city || '').toLowerCase().replace(/[^a-z0-9]/g, '')}`, `#${(type || 'travel').toLowerCase().replace(/[^a-z0-9]/g, '')}`, '#airbnb'].filter((h) => h.length > 1),
    focus: {},
    pins: {},
    covers: covers.length ? covers : [1],
    coverLines: [parts.slice(1).join(', ') ? [parts.slice(1).join(', '), ''] : [listing.city || '', '']].map((l) => l.filter(Boolean)),
    coverCaps: [caps, highlight].filter(Boolean).join(' · '),
    chapters,
    ...(rows.length ? { facts: { title: c.facts, rows, ...(listing.rating ? { note: c.rating(listing.rating) } : {}) } } : {}),
    ...(items.length >= 3 ? { nearby: { title: c.nearby, photos: covers.slice(1, 3).length ? covers.slice(1, 3) : covers, items } } : {}),
    cta: { eyebrow: c.cta, sub: parts.slice(1).join(', ') || listing.city || '', stats: caps, photos: covers },
  }
}
