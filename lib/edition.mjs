/**
 * The edition of the day: property.json + listing.json + a date → the plan
 * the template plays (template/reel.js), plus the text of the post.
 *
 * Every property gets one "issue" per day, numbered from its startDate.
 * The date alone decides what changes, so a day always renders the same
 * video and the next day a different one:
 *   - the cover photo and its cover lines
 *   - three of the property's chapters (salon, table, chambres…), the
 *     photos inside them and the layout each one gets
 *   - the palette (papier / sable / nuit), the transitions, the camera moves
 *   - the photo and the distances on the neighbourhood page
 */

import { withIcons, iconFor } from './amenities.mjs'

export const PALETTES = {
  // the partner pages' paper, pine and tanned wood
  papier: {
    paper: '#F3EEE6', ink: '#1D211E', 'ink-2': '#4C504A', rule: 'rgba(29, 33, 30, .22)', accent: '#93663F',
    deep: '#273A30', 'on-deep': '#EFE9DE', 'on-deep-2': 'rgba(239, 233, 222, .72)', 'deep-accent': '#D9B590', 'rule-deep': 'rgba(239, 233, 222, .24)',
  },
  // warmer sand with clay, walnut for the dark page
  sable: {
    paper: '#ECE3D6', ink: '#261F1A', 'ink-2': '#5A4E44', rule: 'rgba(38, 31, 26, .22)', accent: '#894E34',
    deep: '#3B2A21', 'on-deep': '#F1E7D9', 'on-deep-2': 'rgba(241, 231, 217, .72)', 'deep-accent': '#E0BFA3', 'rule-deep': 'rgba(241, 231, 217, .24)',
  },
  // the night issue: pine pages, the facts on paper
  nuit: {
    paper: '#1E2E25', ink: '#EFE9DE', 'ink-2': 'rgba(239, 233, 222, .74)', rule: 'rgba(239, 233, 222, .26)', accent: '#D9B590',
    deep: '#EAE3D7', 'on-deep': '#1D211E', 'on-deep-2': '#4C504A', 'deep-accent': '#93663F', 'rule-deep': 'rgba(29, 33, 30, .22)',
  },
}

const SEASONS = { fr: ['Hiver', 'Printemps', 'Été', 'Automne'], en: ['Winter', 'Spring', 'Summer', 'Autumn'] }
const WORDS = {
  fr: { issue: 'N°', fig: 'fig.', page: 'p.', facts: 'La fiche', nearby: 'Le quartier' },
  en: { issue: 'No.', fig: 'fig.', page: 'p.', facts: 'The facts', nearby: 'The neighbourhood' },
}
const LAYOUTS = ['frame', 'bleed', 'diptych', 'spotlight']
const MAX_TAGS = { frame: 4, bleed: 4, diptych: 4, spotlight: 10 }
const ENTERS = ['wipe-up', 'wipe-left', 'iris', 'wipe-up', 'wipe-right', 'wipe-up']
const MOTIONS = ['in', 'pan-l', 'out', 'pan-r', 'up', 'in', 'pan-r', 'out']

const T = 0.8          // transition overlap, seconds
const DUR = { cover: 3.7, frame: 4.3, bleed: 4.3, diptych: 4.3, spotlight: 5.0, facts: 4.0, nearby: 4.1, cta: 4.4 }

const dayNumber = (iso) => Math.floor(Date.parse(`${iso}T00:00:00Z`) / 86400000)
const at = (arr, i) => arr[((i % arr.length) + arr.length) % arr.length]
const pad = (n, w = 3) => String(n).padStart(w, '0')

export function planEdition(prop, listing, date) {
  const lang = prop.lang || 'fr'
  const w = WORDS[lang] || WORDS.fr
  const issue = Math.max(1, dayNumber(date) - dayNumber(prop.startDate || date) + 1)
  const k = issue - 1 // what rotates: issue N° 001 opens on the first photo of each list
  const issueLabel = `${w.issue} ${pad(issue)}`
  const month = Number(date.slice(5, 7))
  const season = `${(SEASONS[lang] || SEASONS.fr)[Math.floor((month % 12) / 3)]} ${date.slice(0, 4)}`

  const byN = new Map(listing.photos.map((p) => [p.n, p]))
  const used = new Set()
  let motionI = k
  const photo = (n, motion) => {
    const p = byN.get(n)
    if (!p) throw new Error(`${prop.slug}: photo ${n} is not in listing.json (${listing.photos.length} photos)`)
    used.add(n)
    const [fx, fy] = prop.focus?.[n] || [50, 50]
    const pins = withIcons(prop.pins?.[n])
    return { n, src: `/cache/${prop.slug}/photos/${p.file}`, fx, fy, pins, motion: motion || at(MOTIONS, motionI++) }
  }
  /** the first photo of `list` not shown yet, starting at `offset` */
  const fresh = (list, offset) => {
    for (let i = 0; i < list.length; i++) {
      const n = at(list, offset + i)
      if (!used.has(n)) return n
    }
    return at(list, offset)
  }

  const scenes = []
  let page = 1
  const folio = () => [`${prop.name} · ${issueLabel}`, `${w.page} ${++page}`]

  // cover
  scenes.push({
    type: 'cover', issue: issueLabel, season, name: prop.name, kicker: prop.kicker,
    lines: at(prop.coverLines, k), caps: prop.coverCaps,
    photo: photo(at(prop.covers, k), 'out'),
  })

  // three chapters, two steps apart so consecutive days share few of them
  const n = prop.chapters.length
  const picksOf = (d) => [...new Set([...[...Array(n).keys()].map((j) => at(prop.chapters, d + 2 * j)), ...prop.chapters])].slice(0, 3)
  const picks = picksOf(k)
  // each time a chapter comes back it opens on its next photo
  const seen = new Map(picks.map((c) => [c, 0]))
  for (let d = 0; d < k; d++) for (const c of picksOf(d)) if (seen.has(c)) seen.set(c, seen.get(c) + 1)
  // one spotlight per edition at most: two full-photo lists in a row read as a catalogue
  let spotUsed = picks.some((c) => c.layout === 'spotlight')
  const chapterScene = (c, j) => {
    // a chapter may ask for its layout (the kitchen wants room for all its appliances);
    // the others rotate, on a 3-day cycle shifted so the palette and the layouts drift apart
    let layout = c.layout || at(LAYOUTS, k + j + Math.floor(k / 3))
    if (!c.layout && layout === 'spotlight') {
      if (spotUsed) layout = at(LAYOUTS, k + j + Math.floor(k / 3) + 1)
      spotUsed = true
    }
    const no = pad(j + 1, 2)
    const first = photo(fresh(c.photos, seen.get(c)), layout === 'spotlight' ? 'slow' : undefined)
    const tags = withIcons(c.tags).slice(0, MAX_TAGS[layout])
    const base = { no, section: c.section, end: prop.name, title: c.title, folio: folio(), tags }
    const caption = { label: `${w.fig} ${pad(j + 1, 2)}`, text: c.caption }
    if (layout === 'spotlight') return { type: 'spotlight', ...base, photo: first }
    if (layout === 'frame') return { type: 'frame', ...base, photo: first, caption }
    if (layout === 'bleed') return { type: 'bleed', tag: `${no} · ${c.section}`, eyebrow: prop.place, title: c.title, text: c.text, photo: first, tags }
    return { type: 'diptych', ...base, photos: [first, photo(fresh(c.photos, seen.get(c) + 1))], caption: { ...caption, text: c.text } }
  }
  scenes.push(chapterScene(picks[0], 0))
  if (picks[1]) scenes.push(chapterScene(picks[1], 1))

  // no facts page in the issues (owner, 2026-10-11): the numbers stay on the
  // cover line and the booking card
  if (picks[2]) scenes.push(chapterScene(picks[2], 2))

  // the neighbourhood: five distances, a window that moves each day, nearest first
  const items = prop.nearby?.items || []
  if (items.length) {
    const shown = items.length <= 5 ? items : Array.from({ length: 5 }, (_, i) => at(items, k + i))
    // a distance sorts nearest first; a word ("Hiver", "Été") goes last, in its order
    const dist = (d) => (/\d/.test(d) ? (/km/.test(d) ? 1000 : 1) * Number(d.replace(',', '.').replace(/[^\d.]/g, '')) : Infinity)
    scenes.push({
      type: 'nearby', eyebrow: `${w.nearby} · ${prop.place}`, title: prop.nearby.title,
      items: [...new Set(shown)].sort((a, b) => dist(a.d) - dist(b.d)).map((it) => ({ ...it, icon: it.icon || iconFor(it.name) })),
      photo: photo(fresh(prop.nearby.photos, k), 'in'), folio: folio(),
    })
  }

  // the call to action
  scenes.push({
    type: 'cta', eyebrow: prop.cta.eyebrow, name: prop.name, sub: prop.cta.sub, url: prop.url, stats: prop.cta.stats,
    photo: photo(fresh(prop.cta.photos, k), 'in'),
  })

  // timing: each scene overlaps the previous by T while it wipes in
  let t = 0
  scenes.forEach((s, i) => {
    s.dur = DUR[s.type]
    s.start = i === 0 ? 0 : t - T
    t = s.start + s.dur
    s.enter = i === 0 ? null : at(ENTERS, k + i)
  })
  scenes.forEach((s, i) => { s.exit = scenes[i + 1]?.enter ?? null })
  const duration = Number(t.toFixed(3))

  // shifted every 6 days so a cover photo does not always come with the same palette
  const paletteName = at(prop.palettes || ['papier'], k + Math.floor(k / 6))
  const plan = { slug: prop.slug, date, issue, T, duration, palette: PALETTES[paletteName], paletteName, scenes }
  return { plan, post: postText(prop, picks, issueLabel) }
}

function postText(prop, picks, issueLabel) {
  const strip = (s) => s.replace(/<[^>]+>/g, '')
  const lines = [
    `${prop.name} · ${issueLabel}`,
    '',
    ...picks.map((c) => `${c.section} : ${strip(c.title.join(' '))}. ${c.text}`),
    '',
    `${prop.kicker}. ${prop.coverCaps}.`,
    `${prop.cta.eyebrow} : ${prop.url}`,
    '',
    (prop.hashtags || []).join(' '),
  ]
  return lines.join('\n') + '\n'
}
