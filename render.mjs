#!/usr/bin/env node
/**
 * render.mjs: the edition of the day for one property (or all) → MP4.
 *
 *   node render.mjs chaletlarosiere                 today's video
 *   node render.mjs chaletlarosiere --date 2026-10-12
 *   node render.mjs --all                           every folder in properties/
 *   node render.mjs chaletlarosiere --stills 1,5,9  PNG frames only (review)
 *   node render.mjs chaletlarosiere --music track.mp3    a soundtrack, only when the owner asks
 *   node render.mjs chaletlarosiere --reel demo --with-music   the board's generated music, same rule
 *   node render.mjs chaletlarosiere --reel demo          a storyboarded reel (properties/<slug>/reels/demo.json)
 *   node render.mjs chaletlarosiere --reel all           every board of the property
 *
 * Writes out/<slug>/<date>.mp4 (1080×1920, 30 fps, H.264), <date>-cover.jpg
 * (the cover frame, for the thumbnail) and <date>.txt (the post caption);
 * a reel writes out/<slug>/reels/<name>.*. Silent by default (owner, 2026-10-11:
 * no music unless asked); --with-music adds the board's music (music/make_music.py,
 * generated once, cached in music/out/), faded in and out.
 *
 * How: a local static server hands template/reel.html the plan from
 * lib/edition.mjs; headless Chromium seeks the page to each frame's time,
 * takes a screenshot and pipes it to ffmpeg. Nothing plays in real time,
 * so a slow machine renders the same video, only slower.
 */
import { createServer } from 'node:http'
import { readFile, mkdir, writeFile, readdir } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { dirname, join, normalize, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { planEdition } from './lib/edition.mjs'
import { planStoryboard } from './lib/storyboard.mjs'

const ROOT = dirname(fileURLToPath(import.meta.url))
const W = 1080
const H = 1920
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' }

function parseArgs(argv) {
  const a = { slugs: [], fps: 30, crf: 19 }
  for (let i = 0; i < argv.length; i++) {
    const v = argv[i]
    if (v === '--date') a.date = argv[++i]
    else if (v === '--all') a.all = true
    else if (v === '--fps') a.fps = Number(argv[++i])
    else if (v === '--crf') a.crf = Number(argv[++i])
    else if (v === '--music') a.music = argv[++i]
    else if (v === '--stills') a.stills = argv[++i] === 'auto' ? 'auto' : argv[i].split(',').map(Number)
    else if (v === '--out') a.out = argv[++i]
    else if (v === '--reel') a.reel = argv[++i]
    else if (v === '--with-music') a.withMusic = true
    else a.slugs.push(v)
  }
  // the local date, not UTC: the edition changes at the owner's midnight
  a.date ||= new Date().toLocaleDateString('sv-SE')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a.date)) throw new Error(`--date must be YYYY-MM-DD, got ${a.date}`)
  return a
}

function serve() {
  const server = createServer(async (req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '')
    const file = join(ROOT, path)
    if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return }
    try {
      const body = await readFile(file)
      res.writeHead(200, { 'Content-Type': MIME[extname(file).toLowerCase()] || 'application/octet-stream' }).end(body)
    } catch {
      res.writeHead(404).end()
    }
  })
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)))
}

async function loadProperty(slug) {
  const dir = join(ROOT, 'properties', slug)
  const read = async (f) => JSON.parse(await readFile(join(dir, f), 'utf8'))
  return { prop: await read('property.json'), listing: await read('listing.json') }
}

function ffmpeg(args) {
  const p = spawn('ffmpeg', args, { stdio: ['pipe', 'ignore', 'pipe'] })
  let err = ''
  p.stderr.on('data', (d) => { err = (err + d).slice(-4000) })
  const done = new Promise((resolve, reject) => {
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}\n${err}`))))
  })
  return { p, done }
}

function run(cmd, argv) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, argv, { stdio: ['ignore', 'ignore', 'pipe'] })
    let err = ''
    p.stderr.on('data', (d) => { err += d })
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}\n${err.slice(-2000)}`))))
  })
}

/** The board's soundtrack, made once per style / tempo / seed / length. */
async function musicFor(m, seconds) {
  const len = Math.ceil(seconds) + 2
  const file = join(ROOT, 'music', 'out', `${m.style}-${m.bpm}-${m.seed ?? 3}-${len}s.wav`)
  try { await readFile(file); return file } catch { /* not made yet */ }
  await mkdir(dirname(file), { recursive: true })
  await run('python3', ['-I', join(ROOT, 'music', 'make_music.py'), m.style, String(len), file, '--bpm', String(m.bpm), '--seed', String(m.seed ?? 3)])
  return file
}

/** What to render: today's issue, or the property's storyboarded reels. */
async function jobsFor(slug, args) {
  const { prop, listing } = await loadProperty(slug)
  if (!args.reel) {
    const { plan, post } = planEdition(prop, listing, args.date)
    return [{ plan, post, dir: args.out || join(ROOT, 'out', slug), base: args.date, coverAt: 2.9, music: args.music, label: args.date }]
  }
  const boardsDir = join(ROOT, 'properties', slug, 'reels')
  const names = args.reel === 'all'
    ? (await readdir(boardsDir)).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''))
    : args.reel.split(',')
  const jobs = []
  for (const name of names) {
    const board = JSON.parse(await readFile(join(boardsDir, `${name}.json`), 'utf8'))
    board.name ||= name
    const { plan, post, music } = planStoryboard(prop, listing, board)
    jobs.push({
      plan, post, dir: args.out || join(ROOT, 'out', slug, 'reels'), base: name, coverAt: board.coverAt ?? 2.0, label: `reel ${name}`,
      music: args.music || (music && args.withMusic ? await musicFor(music, plan.duration) : null),
    })
  }
  return jobs
}

async function renderOne(page, port, slug, args) {
  for (const job of await jobsFor(slug, args)) await renderJob(page, port, slug, args, job)
}

async function renderJob(page, port, slug, args, job) {
  const { plan, post, dir: outDir } = job
  await mkdir(outDir, { recursive: true })

  await page.goto(`http://127.0.0.1:${port}/template/reel.html`)
  const info = await page.evaluate((p) => window.build(p), plan)
  console.log(`→ ${slug} ${job.label} · ${plan.paletteName} · ${plan.scenes.map((s) => s.type).join(' › ')} · ${plan.duration}s · ${info.photos} photos`)

  if (args.stills) {
    // auto: one frame per scene, once its words and chips have landed
    const times = args.stills === 'auto' ? plan.scenes.map((s) => Number((s.start + Math.min(s.dur - 0.85, 3.2)).toFixed(2))) : args.stills
    for (const t of times) {
      await page.evaluate((x) => window.seek(x), t)
      await page.screenshot({ path: join(outDir, `${job.base}-t${String(t).replace('.', '_')}.png`) })
    }
    console.log(`✓ ${times.length} stills → ${outDir}`)
    return
  }

  // the cover frame, once everything on it has landed
  await page.evaluate((x) => window.seek(x), job.coverAt)
  await page.screenshot({ path: join(outDir, `${job.base}-cover.jpg`), type: 'jpeg', quality: 92 })

  const file = join(outDir, `${job.base}.mp4`)
  const frames = Math.round(plan.duration * args.fps)
  const input = ['-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(args.fps), '-i', '-']
  const audio = job.music
    ? ['-i', job.music, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-af', `afade=t=in:d=0.3,afade=t=out:st=${(plan.duration - 1.6).toFixed(2)}:d=1.6`, '-shortest']
    : []
  const video = ['-c:v', 'libx264', '-preset', 'slow', '-crf', String(args.crf), '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', String(args.fps), '-movflags', '+faststart']
  const ff = ffmpeg([...input, ...audio, ...video, file])

  const t0 = Date.now()
  for (let i = 0; i < frames; i++) {
    await page.evaluate((x) => window.seek(x), i / args.fps)
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 })
    if (!ff.p.stdin.write(buf)) await new Promise((r) => ff.p.stdin.once('drain', r))
    if ((i + 1) % 90 === 0 || i + 1 === frames) process.stdout.write(`  frame ${i + 1}/${frames}\r`)
  }
  ff.p.stdin.end()
  await ff.done
  await writeFile(join(outDir, `${job.base}.txt`), post)
  await writeFile(join(outDir, `${job.base}.plan.json`), JSON.stringify(plan, null, 2) + '\n')
  console.log(`\n✓ ${file} (${((Date.now() - t0) / 1000).toFixed(0)}s)`)
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const slugs = args.all
    ? (await readdir(join(ROOT, 'properties'), { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name)
    : args.slugs
  if (!slugs.length) {
    console.error('Usage: node render.mjs <slug…> | --all  [--date YYYY-MM-DD] [--reel name|all] [--stills t,t|auto] [--music file]')
    process.exit(1)
  }
  const server = await serve()
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--font-render-hinting=none', '--force-color-profile=srgb', '--hide-scrollbars'],
  })
  try {
    const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
    page.on('pageerror', (e) => console.error(`  page error: ${e.message}`))
    for (const slug of slugs) await renderOne(page, server.address().port, slug, args)
  } finally {
    await browser.close()
    server.close()
  }
}

main().catch((e) => {
  console.error(`✗ ${e.message}`)
  process.exit(1)
})
