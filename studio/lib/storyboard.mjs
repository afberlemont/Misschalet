/**
 * A storyboarded reel: properties/<slug>/reels/<name>.json + the property →
 * the plan template/reel.js plays, timed in beats of its music so every cut
 * and every arrival lands on the beat.
 *
 * Unlike the daily issue (lib/edition.mjs), nothing here rotates: the board
 * says which scenes, which photos, which words. A photo is its number in the
 * listing, or { n, zoom, fx, fy, motion } for a close-up cut out of it.
 * Scene timing: `beats` is the time until the next scene starts; a scene with
 * an `enter` transition wipes in over `tIn` seconds from that beat while the
 * previous one is pushed away. `enter: "cut"` (or none) is a straight cut.
 */
import { withIcons, iconFor } from './amenities.mjs'
import { PALETTES } from './edition.mjs'

const T = 0.8

export function planStoryboard(prop, listing, board) {
  const bpm = board.music?.bpm || 120
  const beat = 60 / bpm
  const byN = new Map(listing.photos.map((p) => [p.n, p]))

  const photo = (ref, motion) => {
    const r = typeof ref === 'number' ? { n: ref } : { ...ref }
    // a photo of the region (cache/region/, licences in region/sources.json)
    if (r.region) {
      return {
        n: r.region, src: `/cache/region/${r.region}`, fx: r.fx ?? 50, fy: r.fy ?? 50,
        zoom: r.zoom || 1, motion: r.motion || motion || 'in', pins: [],
      }
    }
    const p = byN.get(r.n)
    if (!p) throw new Error(`${board.name}: photo ${r.n} is not in listing.json`)
    const [fx, fy] = prop.focus?.[r.n] || [50, 50]
    return {
      n: r.n, src: `/cache/${prop.slug}/photos/${p.file}`,
      fx: r.fx ?? fx, fy: r.fy ?? fy, zoom: r.zoom || 1,
      motion: r.motion || motion || 'in',
      pins: r.pins === false || r.zoom > 1 ? [] : withIcons(prop.pins?.[r.n]),
    }
  }
  const sec = (b) => Number((b * beat).toFixed(4))

  const scenes = board.scenes.map((src) => {
    const s = { ...src }
    if (s.photo != null) s.photo = photo(s.photo, s.motion)
    if (s.photos) s.photos = s.photos.map((r) => photo(r))
    if (s.tags) s.tags = withIcons(s.tags)
    switch (s.type) {
      case 'cover':
        Object.assign(s, { name: s.name || prop.name, kicker: s.kicker || prop.kicker, issue: s.issue || '', season: s.season || prop.place })
        s.lines ||= prop.coverLines?.[0] || []
        s.caps ||= prop.coverCaps || ''
        break
      case 'montage': {
        let at = 0
        s.shots = s.shots.map((sh) => {
          const out = { ...sh, photo: photo(sh.photo), at: sec(at), dur: sec(sh.beats || 2), icon: sh.icon || (sh.label ? iconFor(sh.label) : null) }
          at += sh.beats || 2
          return out
        })
        break
      }
      case 'triptych':
        s.step = sec(s.step ?? 1)
        if (s.label) s.icon ||= iconFor(s.label)
        break
      case 'grid4':
        s.tiles = s.tiles.map((t) => ({ ...t, photo: photo(t.photo), icon: t.icon || iconFor(t.label) }))
        s.step = sec(s.step ?? 1)
        s.openAt = sec(s.openAt ?? s.beats - 2)
        break
      case 'facts': {
        const f = prop.facts || {}
        s.title ||= f.title
        s.note ??= f.note
        s.rows = (s.rows || f.rows || []).map((r) => ({ ...r, icon: r.icon || iconFor(r.l) }))
        s.section ||= 'La fiche'
        s.end ||= prop.place
        s.no ??= ''
        break
      }
      case 'nearby':
        s.items = (s.items || prop.nearby?.items || []).map((it) => ({ ...it, icon: it.icon || iconFor(it.name) }))
        s.title ||= prop.nearby?.title
        s.eyebrow ||= `Le quartier · ${prop.place}`
        break
      case 'cta':
        Object.assign(s, { name: s.name || prop.name, url: s.url || prop.url })
        s.eyebrow ||= prop.cta?.eyebrow
        s.sub ||= prop.cta?.sub
        s.stats ??= prop.cta?.stats
        break
    }
    s.tIn = !s.enter || s.enter === 'cut' ? 0 : s.tIn ?? T
    return s
  })

  // on the beat grid: a scene starts when the previous one's beats are over,
  // and stays until the next one has finished coming in over it
  let t = 0
  scenes.forEach((s, i) => {
    s.start = sec(t)
    t += s.beats
    const next = scenes[i + 1]
    s.dur = sec(s.beats) + (next ? next.tIn : 0)
    s.exit = next ? next.enter || 'cut' : null
  })
  const duration = sec(t)
  const paletteName = board.palette || 'papier'
  const plan = { slug: prop.slug, name: board.name, T, duration, palette: PALETTES[paletteName], paletteName, grade: board.grade || null, scenes }
  const post = [...(board.caption || []), '', `${prop.cta?.eyebrow || 'Réservez'} : ${prop.url}`, '', (board.hashtags || prop.hashtags || []).join(' ')].join('\n') + '\n'
  return { plan, post, music: board.music ? { ...board.music, bpm } : null }
}
