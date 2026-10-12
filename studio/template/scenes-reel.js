/* ==========================================================================
   Listing reels: the scenes of the storyboarded reels (lib/storyboard.mjs),
   taken from the Instagram reels the owner points to: a hook written over the
   first shot, a montage cut on the beat (close-ups cut out of the photos), a
   triptych of three photos stacked, the four main rooms in a grid that opens
   onto one of them. Same contract as scenes.js: builder(pg, s) → update(lt, dur).
   ========================================================================== */
(() => {
  'use strict'
  const { E, clamp, prog, h, esc, lines, rise, fadeUp, chars, icon, photo, camera, sheen } = window.REEL

  /** A label chip on a shot: small capitals on dark glass, an optional icon. */
  function chip(parent, label, iconName, cls = '') {
    if (!label) return null
    const el = h('div', `chip ${cls}`, `${iconName ? icon(iconName) : ''}<span>${esc(label)}</span>`)
    parent.appendChild(el)
    return el
  }

  Object.assign(window.REEL.builders, {
    /** The first shot with a three-line hook over it, quick, like a reel opens. */
    hook(pg, s) {
      const ph = photo(pg, 'full', s.photo, false)
      pg.appendChild(h('div', 'hook-shade'))
      const box = h('div', 'hk-box')
      const small = h('div', 'hk-small', esc(s.lines[0] || ''))
      const big = h('div', 'hk-big')
      const bl = lines(big, [s.lines[1] || ''])
      const caps = h('div', 'hk-caps')
      const cs = chars(caps, s.lines[2] || '')
      box.append(small, big, caps)
      pg.appendChild(box)
      return (lt, dur) => {
        camera(ph, lt / dur)
        fadeUp(small, lt, 0.05, 0.5, 12)
        rise(bl, lt, 0.18, 0, 0.6)
        cs.forEach((c, i) => {
          const p = prog(lt, 0.4 + i * 0.03, 0.5)
          c.style.opacity = p
          c.style.transform = `translate3d(0, ${(1 - p) * 30}px, 0)`
        })
      }
    },

    /** Shots cut on the beat; each one pushes in, a label may sit on it. */
    montage(pg, s) {
      const shots = s.shots.map((sh) => {
        const wrap = h('div', 'shot')
        pg.appendChild(wrap)
        // fit: the whole photo on the page, its caption under it (rule V13:
        // not too zoomed); otherwise full bleed with a chip
        if (sh.fit ?? s.fit) {
          wrap.classList.add('fit', 'paper')
          const col = h('div', 'fit-col')
          wrap.appendChild(col)
          const ph = photo(col, 'fit-ph', { ...sh.photo, motion: sh.photo.motion || 'slow' }, false)
          const cap = sh.label ? h('div', 'fit-cap caps', `${sh.icon ? icon(sh.icon) : ''}<span>${esc(sh.label)}</span>`) : null
          if (cap) col.appendChild(cap)
          return { ...sh, wrap, ph, c: cap, fit: true }
        }
        const ph = photo(wrap, 'full', sh.photo, false)
        const c = chip(wrap, sh.label, sh.icon, 'shot-chip')
        return { ...sh, wrap, ph, c }
      })
      // a fitted photo keeps its own proportions, at most 1180 px high
      const size = (sh) => {
        if (sh.sized || !sh.ph.img.naturalWidth) return
        const r = sh.ph.img.naturalHeight / sh.ph.img.naturalWidth
        let w = 1000, hh = w * r
        if (hh > 1180) { hh = 1180; w = hh / r }
        sh.ph.box.style.width = `${Math.round(w)}px`
        sh.ph.box.style.height = `${Math.round(hh)}px`
        sh.sized = true
      }
      return (lt) => {
        shots.forEach((sh, i) => {
          const on = lt >= sh.at && lt < sh.at + sh.dur + (sh === shots[shots.length - 1] ? 99 : 0)
          sh.wrap.style.visibility = on ? 'visible' : 'hidden'
          if (!on) return
          const st = lt - sh.at
          if (sh.fit) {
            size(sh)
            // a soft cross-fade from the previous page, no punch-in
            sh.wrap.style.opacity = i ? E.inOut(clamp(st / 0.35)) : 1
            if (i && st < 0.35) shots[i - 1].wrap.style.visibility = 'visible'
            camera(sh.ph, st / (sh.dur + 0.6))
            if (sh.c) fadeUp(sh.c, st, 0.25, 0.6, 10)
            return
          }
          // a small punch-in on the cut, then the slow push
          camera(sh.ph, st / (sh.dur + 0.6), 0.05 * (1 - E.out(clamp(st / 0.35))))
          if (sh.c) fadeUp(sh.c, st, 0.12, 0.45, 10)
        })
      }
    },

    /** Three photos stacked, each sliding in from alternate sides. */
    triptych(pg, s) {
      pg.classList.add('paper')
      const bands = s.photos.map((sp, i) => {
        const ph = photo(pg, `band b${i}`, sp, false)
        return ph
      })
      const c = chip(pg, s.label, s.icon, 'trip-chip')
      return (lt, dur) => {
        bands.forEach((ph, i) => {
          const r = prog(lt, 0.05 + i * s.step, 0.75, E.inOut)
          const q = ((1 - r) * 100).toFixed(3)
          ph.box.style.clipPath = i % 2 ? `inset(0 0 0 ${q}%)` : `inset(0 ${q}% 0 0)`
          camera(ph, lt / dur, 0.03 * (1 - r))
        })
        if (c) fadeUp(c, lt, 0.4 + 3 * s.step, 0.6, 12)
      }
    },

    /** The four main rooms, one per beat, then one tile opens to full screen. */
    grid4(pg, s) {
      pg.classList.add('paper', 'grain')
      const title = h('h2', 'title g4-title')
      const tl = lines(title, s.title)
      pg.appendChild(title)
      const tiles = s.tiles.map((t, i) => {
        const ph = photo(pg, `tile t${i}`, t.photo, false)
        const c = chip(ph.box, t.label, t.icon, 'tile-chip')
        const r = ph.box.getBoundingClientRect()
        const sr = pg.getBoundingClientRect()
        return { ph, c, rect: { x: r.left - sr.left, y: r.top - sr.top, w: r.width, h: r.height } }
      })
      const open = s.open ?? 0
      return (lt, dur) => {
        rise(tl, lt, 0.1, 0.12, 0.8)
        const go = prog(lt, s.openAt, dur - s.openAt - 0.05, E.inOut)
        title.style.opacity = 1 - go
        tiles.forEach((t, i) => {
          const r = prog(lt, 0.25 + i * s.step, 0.6, E.inOut)
          t.ph.box.style.clipPath = `inset(${((1 - r) * 100).toFixed(3)}% 0 0 0)`
          if (t.c) fadeUp(t.c, lt, 0.5 + i * s.step, 0.5, 10)
          if (i === open) {
            const R = t.rect
            t.ph.box.style.left = `${R.x * (1 - go)}px`
            t.ph.box.style.top = `${R.y * (1 - go)}px`
            t.ph.box.style.width = `${R.w + (1080 - R.w) * go}px`
            t.ph.box.style.height = `${R.h + (1920 - R.h) * go}px`
            t.ph.box.style.zIndex = 5
            if (t.c) t.c.style.opacity = Math.min(Number(t.c.style.opacity || 1), 1 - go * 2)
            // ends on the framing the next scene opens with
            t.ph.spec.motion = 'hold'
            camera(t.ph, 0, 0.06 * (1 - go))
          } else {
            camera(t.ph, lt / dur)
            t.ph.box.style.opacity = 1 - go
          }
        })
      }
    },
  })
})()
