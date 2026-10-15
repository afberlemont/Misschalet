#!/usr/bin/env node
/**
 * carousel.mjs: an Instagram carousel from a property's photos → JPEG slides.
 *
 *   node carousel.mjs pierrefleur hiver        properties/pierrefleur/carousels/hiver.json
 *
 * Writes out/<slug>/carousels/<name>/01.jpg, 02.jpg… (1080×1350, 4:5, the
 * tallest Instagram shows in the feed) and caption.txt. Same look as the reels:
 * template/carousel.css. A board is a list of slides:
 *   cover  { photo, title, sub }                  the photo full, the title low
 *   bleed  { photo, eyebrow, title, text }        the photo full, a paper card
 *   frame  { photo, eyebrow, title, text }        a paper page, the photo set in it
 *   grid   { photos: [2 to 4], eyebrow, title }   a paper page, several photos together
 *   cta    { photo, eyebrow, name, sub, stats, note }   the booking page, with the link
 * A photo is its number in listing.json, or { n, fx, fy, zoom } to crop it, or
 * { file } for a photo the owner gave, in properties/<slug>/photos/.
 * Every slide carries the board's `mark` (the name) in its running head.
 */
import { createServer } from 'node:http'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, normalize, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { PALETTES } from './lib/edition.mjs'

const ROOT = dirname(fileURLToPath(import.meta.url))
const W = 1080
const H = 1350
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.png': 'image/png' }

function serve() {
  const server = createServer(async (req, res) => {
    const file = join(ROOT, normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, ''))
    if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return }
    try {
      res.writeHead(200, { 'Content-Type': MIME[extname(file).toLowerCase()] || 'application/octet-stream' }).end(await readFile(file))
    } catch {
      res.writeHead(404).end()
    }
  })
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)))
}

const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
/** Title lines may carry <em> for the italic; nothing else is let through. */
const title = (lines = []) => lines.map((l) => esc(l).replace(/&lt;(\/?)em&gt;/g, '<$1em>')).join('<br>')

function slideHtml(s, i, n, ctx) {
  const { photo, mark, icon } = ctx
  const ph = s.photo != null ? photo(s.photo, s.type === 'cover' || s.type === 'bleed' ? 'full' : '') : ''
  const head = `<div class="c-head">${icon ? `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${icon}</svg>` : ''}<span>${esc(mark)}</span><span class="hr"></span><span>${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}</span></div>`
  const swipe = i < n - 1 ? `<div class="c-swipe"><span>${esc(ctx.swipe)}</span><span class="ar"></span></div>` : ''
  switch (s.type) {
    case 'cover':
      return { cls: 'c-cover on-photo', html: `${ph}<div class="c-shade"></div>${head}<h1 class="c-title">${title(s.title)}</h1><div class="c-sub">${esc(s.sub)}</div>${swipe}` }
    case 'bleed':
      return { cls: 'c-bleed on-photo', html: `${ph}<div class="c-shade"></div>${head}<div class="c-card grain"><div class="caps">${esc(s.eyebrow)}</div><h2 class="c-title">${title(s.title)}</h2><p>${esc(s.text)}</p></div>${swipe}` }
    case 'frame':
      return { cls: 'c-frame grain', html: `${head}<div class="c-text"><div class="caps">${esc(s.eyebrow)}</div><h2 class="c-title">${title(s.title)}</h2><p>${esc(s.text)}</p></div>${ph}${swipe}` }
    case 'grid': {
      // 2 photos side by side, 3 (one wide over two), or 4 (two by two), under the title
      const [x, y, w, h, g] = [64, 400, 952, 830, 16]
      const half = (w - g) / 2
      const boxes = {
        2: [[x, y, half, h], [x + half + g, y, half, h]],
        3: [[x, y, w, 470], [x, y + 470 + g, half, h - 470 - g], [x + half + g, y + 470 + g, half, h - 470 - g]],
        4: [[x, y, half, (h - g) / 2], [x + half + g, y, half, (h - g) / 2], [x, y + (h + g) / 2, half, (h - g) / 2], [x + half + g, y + (h + g) / 2, half, (h - g) / 2]],
      }[s.photos.length]
      if (!boxes) throw new Error(`slide ${i + 1}: a grid takes 2, 3 or 4 photos`)
      const phs = s.photos.map((r, k) => photo(r, '', boxes[k])).join('')
      return { cls: 'c-frame c-grid grain', html: `${head}<div class="c-text"><div class="caps">${esc(s.eyebrow)}</div><h2 class="c-title">${title(s.title)}</h2></div>${phs}${swipe}` }
    }
    case 'cta':
      return { cls: 'c-cta deep', html: `${ph}${head}<div class="c-body"><div class="caps">${esc(s.eyebrow)}</div><div class="c-name">${esc(s.name)}</div><div class="c-sub">${esc(s.sub)}</div><div class="c-url">${esc(ctx.url)}</div><div class="c-stats">${esc(s.stats)}</div>${s.note ? `<div class="c-note">${esc(s.note)}</div>` : ''}</div>` }
    default:
      throw new Error(`slide ${i + 1}: unknown type ${s.type}`)
  }
}

async function main() {
  const [slug, name] = process.argv.slice(2)
  if (!slug || !name) {
    console.error('Usage: node carousel.mjs <slug> <name>   (properties/<slug>/carousels/<name>.json)')
    process.exit(1)
  }
  const dir = join(ROOT, 'properties', slug)
  const read = async (f) => JSON.parse(await readFile(join(dir, f), 'utf8'))
  const [prop, listing, board] = [await read('property.json'), await read('listing.json'), await read(`carousels/${name}.json`)]
  const byN = new Map(listing.photos.map((p) => [p.n, p]))
  const photo = (ref, cls = '', box = null) => {
    const r = typeof ref === 'number' ? { n: ref } : ref
    // { file } is a photo the owner gave, kept in properties/<slug>/photos/
    const p = r.file ? null : byN.get(r.n)
    if (!r.file && !p) throw new Error(`photo ${r.n} is not in listing.json`)
    const src = r.file ? `/properties/${slug}/photos/${r.file}` : `/cache/${slug}/photos/${p.file}`
    const [fx, fy] = [r.fx ?? prop.focus?.[r.n]?.[0] ?? 50, r.fy ?? prop.focus?.[r.n]?.[1] ?? 50]
    const z = r.zoom || 1
    const at = box ? ` style="left:${box[0]}px;top:${box[1]}px;width:${box[2]}px;height:${box[3]}px"` : ''
    return `<div class="ph ${cls}"${at}><img src="${src}" style="object-position:${fx}% ${fy}%;transform-origin:${fx}% ${fy}%;transform:scale(${z})"></div>`
  }
  const outDir = join(ROOT, 'out', slug, 'carousels', name)
  await mkdir(outDir, { recursive: true })

  const server = await serve()
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--font-render-hinting=none', '--force-color-profile=srgb', '--hide-scrollbars'] })
  try {
    const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
    page.on('pageerror', (e) => console.error(`  page error: ${e.message}`))
    await page.goto(`http://127.0.0.1:${server.address().port}/template/carousel.html`)
    const icon = board.icon ? await page.evaluate((k) => window.ICONS[k] || '', board.icon) : ''
    const ctx = { photo, mark: board.mark || prop.name, icon, url: prop.url, swipe: board.swipe || 'Glissez' }
    const pal = PALETTES[board.palette || 'papier']
    await page.evaluate(({ pal, grade }) => {
      const el = document.getElementById('slide')
      for (const [k, v] of Object.entries(pal)) el.style.setProperty(`--${k}`, v)
      if (grade) el.style.setProperty('--grade', grade)
    }, { pal, grade: board.grade || null })
    await page.evaluate(() => document.fonts.ready)
    for (const [i, s] of board.slides.entries()) {
      const { cls, html } = slideHtml(s, i, board.slides.length, ctx)
      await page.evaluate(({ cls, html }) => {
        const el = document.getElementById('slide')
        el.className = cls
        el.innerHTML = html
      }, { cls, html })
      await page.evaluate(async () => {
        await document.fonts.ready
        await Promise.all([...document.images].map((im) => im.decode()))
      })
      const file = join(outDir, `${String(i + 1).padStart(2, '0')}.jpg`)
      await page.locator('#slide').screenshot({ path: file, type: 'jpeg', quality: 92 })
    }
  } finally {
    await browser.close()
    server.close()
  }
  const caption = [...(board.caption || []), '', `${prop.cta?.eyebrow || 'Réservez'} : ${prop.url}`, '', (board.hashtags || prop.hashtags || []).join(' ')].join('\n') + '\n'
  await writeFile(join(outDir, 'caption.txt'), caption)
  console.log(`✓ ${board.slides.length} slides → ${outDir}`)
}

main().catch((e) => {
  console.error(`✗ ${e.message}`)
  process.exit(1)
})
