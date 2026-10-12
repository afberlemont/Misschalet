#!/usr/bin/env node
/**
 * veo-clip.mjs: one listing photo → a short vertical clip where the camera
 * moves inside the room (Veo 3.1 through the Gemini API, image-to-video).
 *
 *   node veo-clip.mjs chaletlarosiere 4 --move dolly-in [--seconds 4] [--model lite|fast|full] [--dry-run]
 *
 * Writes cache/<slug>/clips/<n>-<move>.mp4 (git-ignored). Kept cheap on
 * purpose: one clip per call, 720p, 4 seconds unless asked; a clip that
 * already exists is never paid for twice.
 *
 * The key is read from GEMINI_API_KEY (environment, or tools/listing-reels/.env,
 * git-ignored) and is never printed.
 * The photo is first cut to 9:16 around its focus (property.json) so the model
 * starts from the frame the reel will show. The prompt keeps the world still:
 * the camera moves, nothing else does (a fire may burn).
 */
import { readFile, writeFile, mkdir, access } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(fileURLToPath(import.meta.url))
const API = 'https://generativelanguage.googleapis.com/v1beta'
const MODELS = { lite: 'veo-3.1-lite-generate-preview', fast: 'veo-3.1-fast-generate-preview', full: 'veo-3.1-generate-preview' }
const MOVES = {
  'dolly-in': 'The camera glides slowly forward into the room on a stabilised gimbal.',
  'dolly-out': 'The camera pulls slowly back on a stabilised gimbal, revealing more of the room.',
  'pan-right': 'The camera pans slowly from left to right on a tripod head.',
  'pan-left': 'The camera pans slowly from right to left on a tripod head.',
  'orbit': 'The camera arcs slowly around the main subject, keeping it centred.',
  'tilt-up': 'The camera tilts slowly upwards, from the floor to the ceiling beams.',
}
const STILL = 'Photorealistic interior film shot of this exact room. Only the camera moves: the furniture, objects, '
  + 'walls, windows and light stay exactly as they are; no people, no animals, nothing appears or disappears, '
  + 'nothing changes shape. Flames in a fireplace may flicker. Warm natural light, smooth cinematic motion, no cuts.'

function args(argv) {
  const a = { move: 'dolly-in', seconds: 4, model: 'lite' }
  const rest = []
  for (let i = 0; i < argv.length; i++) {
    const v = argv[i]
    if (v === '--move') a.move = argv[++i]
    else if (v === '--seconds') a.seconds = Number(argv[++i])
    else if (v === '--model') a.model = argv[++i]
    else if (v === '--dry-run') a.dry = true
    else rest.push(v)
  }
  ;[a.slug, a.n] = [rest[0], Number(rest[1])]
  if (!a.slug || !a.n || !MOVES[a.move] || !MODELS[a.model] || ![4, 6, 8].includes(a.seconds)) {
    console.error(`Usage: node veo-clip.mjs <slug> <photo n> [--move ${Object.keys(MOVES).join('|')}] [--seconds 4|6|8] [--model lite|fast|full] [--dry-run]`)
    process.exit(1)
  }
  return a
}

async function apiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY
  try {
    const env = await readFile(join(ROOT, '.env'), 'utf8')
    const m = env.match(/^GEMINI_API_KEY=(.+)$/m)
    if (m) return m[1].trim()
  } catch { /* no .env */ }
  throw new Error('GEMINI_API_KEY is not set (environment or tools/listing-reels/.env)')
}

function run(cmd, argv) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, argv, { stdio: ['ignore', 'ignore', 'pipe'] })
    let err = ''
    p.stderr.on('data', (d) => { err += d })
    p.on('close', (c) => (c === 0 ? resolve() : reject(new Error(`${cmd}: ${err.slice(-800)}`))))
  })
}

/** The photo cut to 9:16 around its focus, 720×1280 JPEG, base64. */
async function startFrame(slug, n, prop, listing) {
  const p = listing.photos.find((x) => x.n === n)
  if (!p) throw new Error(`photo ${n} is not in listing.json`)
  const [fx, fy] = prop.focus?.[n] || [50, 50]
  const src = join(ROOT, 'cache', slug, 'photos', p.file)
  const out = join(ROOT, 'cache', slug, 'clips', `${n}-start.jpg`)
  await mkdir(dirname(out), { recursive: true })
  const crop = `crop='min(iw,ih*9/16)':'min(ih,iw*16/9)':'(iw-min(iw,ih*9/16))*${fx / 100}':'(ih-min(ih,iw*16/9))*${fy / 100}',scale=720:1280`
  await run('ffmpeg', ['-v', 'error', '-y', '-i', src, '-vf', crop, '-q:v', '2', out])
  return (await readFile(out)).toString('base64')
}

async function main() {
  const a = args(process.argv.slice(2))
  const dir = join(ROOT, 'properties', a.slug)
  const prop = JSON.parse(await readFile(join(dir, 'property.json'), 'utf8'))
  const listing = JSON.parse(await readFile(join(dir, 'listing.json'), 'utf8'))
  const file = join(ROOT, 'cache', a.slug, 'clips', `${a.n}-${a.move}.mp4`)
  try { await access(file); console.log(`✓ already made: ${file}`); return } catch { /* make it */ }

  const data = await startFrame(a.slug, a.n, prop, listing)
  const body = {
    instances: [{ prompt: `${MOVES[a.move]} ${STILL}`, image: { inlineData: { mimeType: 'image/jpeg', data } } }],
    parameters: { aspectRatio: '9:16', resolution: '720p', durationSeconds: a.seconds, personGeneration: 'allow_adult', numberOfVideos: 1 },
  }
  if (a.dry) {
    console.log(JSON.stringify({ model: MODELS[a.model], ...body, instances: [{ ...body.instances[0], image: { inlineData: { mimeType: 'image/jpeg', data: `<${data.length} base64 chars>` } } }] }, null, 2))
    return
  }
  const key = await apiKey()
  const headers = { 'x-goog-api-key': key, 'Content-Type': 'application/json' }
  const start = await fetch(`${API}/models/${MODELS[a.model]}:predictLongRunning`, { method: 'POST', headers, body: JSON.stringify(body) })
  if (!start.ok) throw new Error(`Veo refused the request: HTTP ${start.status} ${(await start.text()).slice(0, 400)}`)
  const { name } = await start.json()
  console.log(`→ ${MODELS[a.model]} · photo ${a.n} · ${a.move} · ${a.seconds}s · ${name}`)
  let op
  for (let i = 0; i < 90; i++) {
    await new Promise((r) => setTimeout(r, 10000))
    op = await (await fetch(`${API}/${name}`, { headers })).json()
    if (op.done) break
    process.stdout.write('.')
  }
  if (!op?.done) throw new Error('Veo did not finish in 15 minutes')
  if (op.error) throw new Error(`Veo: ${op.error.message}`)
  const uri = op.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri
  if (!uri) throw new Error(`Veo returned no video (${JSON.stringify(op.response).slice(0, 300)})`)
  const vid = await fetch(uri, { headers: { 'x-goog-api-key': key }, redirect: 'follow' })
  if (!vid.ok) throw new Error(`download failed: HTTP ${vid.status}`)
  await writeFile(file, Buffer.from(await vid.arrayBuffer()))
  console.log(`\n✓ ${file}`)
}

main().catch((e) => {
  console.error(`✗ ${e.message}`)
  process.exit(1)
})
