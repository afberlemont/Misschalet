#!/usr/bin/env node
/**
 * fetch-listing.mjs: an Airbnb listing link → listing.json + the photos.
 *
 *   node fetch-listing.mjs airbnb.com/h/chaletlarosiere [--locale fr] [--slug name]
 *
 * Writes  properties/<slug>/listing.json   (facts, rooms, photo tour, neighbourhood)
 *         properties/<slug>/property.json  (a first draft, only if there is none yet)
 *         cache/<slug>/photos/NN-<id>.jpg   (2560px wide, gitignored)
 *
 * The page carries everything in one JSON blob (`data-deferred-state-0`):
 * title, overview ("14 voyageurs", "6 chambres"…), amenities, the host's
 * neighbourhood notes, and the photo tour grouped by room. Nothing here logs
 * in or calls a private API: it reads the public listing page like a browser.
 */
import { mkdir, writeFile, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { draftProperty } from './lib/draft.mjs'

const ROOT = dirname(fileURLToPath(import.meta.url))
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
const PHOTO_WIDTH = 2560

function parseArgs(argv) {
  const args = { locale: 'fr' }
  const rest = []
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--locale') args.locale = argv[++i]
    else if (argv[i] === '--slug') args.slug = argv[++i]
    else rest.push(argv[i])
  }
  args.url = rest[0]
  return args
}

/** airbnb.com/h/x, https://www.airbnb.ch/rooms/123?… → { path, slug } */
function normalise(input) {
  const u = new URL(/^https?:\/\//.test(input) ? input : `https://${input}`)
  const path = u.pathname.replace(/\/+$/, '')
  const h = path.match(/^\/h\/([^/]+)/)
  const room = path.match(/^\/rooms\/(\d+)/)
  if (!h && !room) throw new Error(`Not an Airbnb listing link: ${input}`)
  return { path, slug: h ? h[1] : `room-${room[1]}`, shortUrl: `airbnb.com${path}` }
}

async function fetchState(path, locale) {
  // airbnb.com answers some regions with a domain-switch form instead of the
  // page, so try the .com link first, then the Swiss domain in that language.
  const candidates = [
    `https://www.airbnb.com${path}?locale=${locale}`,
    `https://${locale}.airbnb.ch${path}`,
    `https://www.airbnb.ch${path}?locale=${locale}`,
  ]
  for (const url of candidates) {
    const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': `${locale},en;q=0.8` } })
    if (!res.ok) continue
    const html = await res.text()
    const m = html.match(/<script[^>]*id="data-deferred-state-0"[^>]*>([\s\S]*?)<\/script>/)
    if (m) return { state: JSON.parse(m[1]), pageUrl: res.url }
  }
  throw new Error(`No listing data found for ${path} (tried ${candidates.length} URLs)`)
}

/** Depth-first search for the first object that satisfies `test`. */
function find(o, test) {
  if (!o || typeof o !== 'object') return null
  if (!Array.isArray(o) && test(o)) return o
  for (const v of Object.values(o)) {
    const hit = find(v, test)
    if (hit) return hit
  }
  return null
}

const text = (c) => c?.localizedStringWithTranslationPreference ?? c?.localizedString ?? c?.source ?? ''
const stripHtml = (s) =>
  s.replace(/<br\s*\/?>/gi, '\n').replace(/<\/?b>/gi, '').replace(/<[^>]+>/g, '')
    .replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/[ \t]{2,}/g, ' ').trim()

function extract(state, meta) {
  const pp = find(state, (o) => o.__typename?.startsWith('DemandStayListingPdpPresentation') || ('overview' in o && 'amenities' in o && 'quality' in o))
  const tour = find(state, (o) => Array.isArray(o.mediaItems) && Array.isArray(o.roomTourLayoutInfos))
  if (!pp || !tour) throw new Error('Listing JSON changed shape: pdpPresentation or photo tour not found')

  const rooms = (tour.roomTourLayoutInfos[0]?.roomTourItems ?? []).map((r) => ({
    title: r.title,
    highlights: (r.highlights ?? []).map((h) => h.title),
    imageIds: r.imageIds ?? [],
  }))
  const roomOf = new Map()
  for (const r of rooms) for (const id of r.imageIds) roomOf.set(id, r.title)

  const photos = tour.mediaItems
    .filter((m) => m.baseUrl)
    .map((m, i) => ({
      n: i + 1,
      id: m.id,
      room: roomOf.get(m.id) ?? (m.accessibilityLabel || '').replace(/\s+image\s+\d+$/i, ''),
      label: m.accessibilityLabel,
      caption: m.imageMetadata?.localizedCaption || m.imageMetadata?.caption || null,
      orientation: m.orientation,
      aspect: Number(m.aspectRatio?.toFixed(4)),
      url: m.baseUrl,
      file: `${String(i + 1).padStart(2, '0')}-${m.id}.jpg`,
    }))

  const rating = pp.quality?.listingRatingStats?.overallRatingStats
  const neighbourhood = (pp.location?.previewLocationDetails ?? [])
    .map((d) => text(d.content?.content)).join('\n').split('\n').map((s) => s.trim()).filter(Boolean)

  return {
    slug: meta.slug,
    shortUrl: meta.shortUrl,
    pageUrl: meta.pageUrl,
    fetchedAt: new Date().toISOString(),
    locale: meta.locale,
    title: text(pp.title?.content),
    titleSource: pp.title?.content?.source ?? null,
    propertyType: pp.sharingConfig?.propertyType ?? null,
    city: pp.localizedLocation ?? null,
    region: pp.location?.subtitle ?? null,
    capacity: pp.personCapacity ?? null,
    overview: pp.overview?.items ?? [],
    rating: rating ? { average: rating.ratingAverage, count: Number(rating.ratingCount) } : null,
    description: stripHtml(text(pp.descriptions?.longDescriptionHtml)),
    highlights: (pp.highlights ?? []).map((h) => ({ headline: h.headline?.localizedContent, body: h.body?.localizedContent })),
    amenities: (pp.amenities?.previewAmenitiesGroups ?? []).flatMap((g) => g.amenities.filter((a) => a.available).map((a) => a.title)),
    neighbourhood,
    rooms: rooms.map(({ title, highlights }) => ({ title, highlights })),
    photos,
  }
}

async function exists(p) {
  try { await access(p); return true } catch { return false }
}

async function downloadPhotos(photos, dir) {
  await mkdir(dir, { recursive: true })
  let done = 0
  const queue = [...photos]
  async function worker() {
    while (queue.length) {
      const p = queue.shift()
      const dest = join(dir, p.file)
      if (!(await exists(dest))) {
        const res = await fetch(`${p.url}?im_w=${PHOTO_WIDTH}`, { headers: { 'User-Agent': UA } })
        if (!res.ok) throw new Error(`Photo ${p.n} → HTTP ${res.status}`)
        await writeFile(dest, Buffer.from(await res.arrayBuffer()))
      }
      done++
      if (done % 10 === 0 || done === photos.length) process.stdout.write(`  photos ${done}/${photos.length}\n`)
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker))
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (!args.url) {
    console.error('Usage: node fetch-listing.mjs <airbnb link> [--locale fr|en] [--slug name]')
    process.exit(1)
  }
  const { path, slug: autoSlug, shortUrl } = normalise(args.url)
  const slug = args.slug || autoSlug
  console.log(`→ ${shortUrl}`)
  const { state, pageUrl } = await fetchState(path, args.locale)
  const listing = extract(state, { slug, shortUrl, pageUrl, locale: args.locale })

  const propDir = join(ROOT, 'properties', slug)
  await mkdir(propDir, { recursive: true })
  await writeFile(join(propDir, 'listing.json'), JSON.stringify(listing, null, 2) + '\n')
  console.log(`  ${listing.title} · ${listing.city} · ${listing.overview.join(' · ')}`)
  console.log(`  ${listing.photos.length} photos, ${listing.rooms.length} rooms → properties/${slug}/listing.json`)
  const propFile = join(propDir, 'property.json')
  if (!(await exists(propFile))) {
    await writeFile(propFile, JSON.stringify(draftProperty(listing), null, 2) + '\n')
    console.log(`  draft → properties/${slug}/property.json (rewrite the copy, choose photos, add pins)`)
  }

  await downloadPhotos(listing.photos, join(ROOT, 'cache', slug, 'photos'))
  console.log(`✓ cache/${slug}/photos`)
}

main().catch((e) => {
  console.error(`✗ ${e.message}`)
  process.exit(1)
})
