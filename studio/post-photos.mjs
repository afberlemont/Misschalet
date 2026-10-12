#!/usr/bin/env node
/**
 * post-photos.mjs: listing photos → the images of a basic post (a photo post,
 * a carousel or a story), cut to the platform's format around each photo's
 * focus. No text is added: the words go in the caption.
 *
 *   node studio/post-photos.mjs chaletlarosiere 2026-11-03-salon 4 18:55,30 24 [--format 4:5|1:1|9:16]
 *
 * Photos are numbers of the photo tour (listing.json → photos[].n), in the
 * carousel's order; `n:fx,fy` sets the focus (percent), otherwise
 * property.json → focus, otherwise the centre. Writes
 * out/<slug>/posts/<id>/01-<n>.jpg … (git-ignored).
 */
import { readFile, mkdir, access } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(fileURLToPath(import.meta.url))
const FORMATS = { '4:5': [1080, 1350], '1:1': [1080, 1080], '9:16': [1080, 1920] }

function args(argv) {
  const a = { format: '4:5', photos: [] }
  const rest = []
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--format') a.format = argv[++i]
    else rest.push(argv[i])
  }
  ;[a.slug, a.id, ...a.photos] = rest
  if (!a.slug || !a.id || !a.photos.length || !FORMATS[a.format] || a.photos.some((p) => !/^\d+(:\d+,\d+)?$/.test(p))) {
    console.error('Usage: node studio/post-photos.mjs <slug> <post id> <n[:fx,fy]>… [--format 4:5|1:1|9:16]')
    process.exit(1)
  }
  return a
}

function run(cmd, argv) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, argv, { stdio: ['ignore', 'ignore', 'pipe'] })
    let err = ''
    p.stderr.on('data', (d) => { err += d })
    p.on('close', (c) => (c === 0 ? resolve() : reject(new Error(`${cmd}: ${err.slice(-800)}`))))
  })
}

async function main() {
  const a = args(process.argv.slice(2))
  const dir = join(ROOT, 'properties', a.slug)
  const listing = JSON.parse(await readFile(join(dir, 'listing.json'), 'utf8'))
  const prop = JSON.parse(await readFile(join(dir, 'property.json'), 'utf8').catch(() => '{}'))
  const [w, h] = FORMATS[a.format]
  const r = `${w}/${h}`
  const outDir = join(ROOT, 'out', a.slug, 'posts', a.id)
  await mkdir(outDir, { recursive: true })

  for (const [i, spec] of a.photos.entries()) {
    const [ns, fs] = spec.split(':')
    const n = Number(ns)
    const p = listing.photos.find((x) => x.n === n)
    if (!p) throw new Error(`photo ${n} is not in listing.json`)
    const src = join(ROOT, 'cache', a.slug, 'photos', p.file)
    await access(src).catch(() => {
      throw new Error(`photo ${n} is not downloaded: run node studio/fetch-listing.mjs <listing link>`)
    })
    const [fx, fy] = fs ? fs.split(',').map(Number) : prop.focus?.[n] || [50, 50]
    const out = join(outDir, `${String(i + 1).padStart(2, '0')}-${n}.jpg`)
    const crop = `crop='min(iw,ih*${r})':'min(ih,iw/(${r}))':'(iw-min(iw,ih*${r}))*${fx / 100}':'(ih-min(ih,iw/(${r})))*${fy / 100}',scale=${w}:${h}`
    await run('ffmpeg', ['-v', 'error', '-y', '-i', src, '-vf', crop, '-q:v', '2', out])
  }
  console.log(`✓ ${a.photos.length} image(s) ${a.format} → ${outDir}`)
}

main().catch((e) => { console.error(e.message); process.exit(1) })
