/* ==========================================================================
   Listing reels: the toolkit the scenes are made of (template/scenes.js) and
   the engine plays (template/reel.js): easing, type in masks, icon chips,
   photos with their camera, pins projected through the camera.
   ========================================================================== */
(() => {
  'use strict'

  // ---------- easing ----------
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by
    const fx = (t) => ((ax * t + bx) * t + cx) * t
    const fy = (t) => ((ay * t + by) * t + cy) * t
    const dx = (t) => (3 * ax * t + 2 * bx) * t + cx
    return (x) => {
      if (x <= 0) return 0
      if (x >= 1) return 1
      let t = x
      for (let i = 0; i < 8; i++) {
        const e = fx(t) - x
        if (Math.abs(e) < 1e-6) break
        const d = dx(t)
        if (Math.abs(d) < 1e-6) break
        t -= e / d
      }
      return fy(Math.min(1, Math.max(0, t)))
    }
  }
  const E = {
    out: bezier(0.2, 0.7, 0.2, 1),       // the partner pages' reveal curve
    inOut: bezier(0.7, 0, 0.25, 1),      // wipes and rules
    soft: bezier(0.45, 0, 0.55, 1),      // slow camera moves
  }
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
  const prog = (t, start, dur, ease = E.out) => ease(clamp((t - start) / dur))
  const lerp = (a, b, p) => a + (b - a) * p

  // ---------- dom helpers ----------
  function h(tag, cls, html) {
    const el = document.createElement(tag)
    if (cls) el.className = cls
    if (html != null) el.innerHTML = html
    return el
  }
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

  /** Lines of type, each in a mask: [{el, inner}] (lines may carry <em>). */
  function lines(parent, arr) {
    return arr.map((line) => {
      const ln = h('span', 'ln')
      const inner = h('span', 'in', line)
      ln.appendChild(inner)
      parent.appendChild(ln)
      return inner
    })
  }
  function rise(inners, lt, t0, stagger, dur = 1.0) {
    inners.forEach((el, i) => {
      const p = prog(lt, t0 + i * stagger, dur)
      el.style.transform = `translate3d(0, ${(1 - p) * 108}%, 0)`
    })
  }
  function fadeUp(el, lt, t0, dur = 0.9, dist = 26) {
    const p = prog(lt, t0, dur)
    el.style.opacity = p
    el.style.transform = `translate3d(0, ${(1 - p) * dist}px, 0)`
  }
  function chars(parent, text) {
    return [...text].map((c) => {
      const s = h('span', 'ch', c === ' ' ? '&nbsp;' : esc(c))
      parent.appendChild(s)
      return s
    })
  }

  const icon = (name) =>
    `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${(window.ICONS || {})[name] || (window.ICONS || {}).sparkles || ''}</svg>`

  /** Glass chips, icon + words: [{icon, label}] → update(lt, t0, stagger). */
  function tagList(parent, tags, cls) {
    const box = h('div', `tags ${cls || ''}`)
    const els = (tags || []).map((t) => {
      const el = h('span', 'tag', `${icon(t.icon)}<span>${esc(t.label)}</span>`)
      box.appendChild(el)
      return el
    })
    parent.appendChild(box)
    return (lt, t0, stagger = 0.11) => {
      els.forEach((el, i) => {
        const p = prog(lt, t0 + i * stagger, 0.85)
        el.style.opacity = p
        el.style.transform = `translate3d(${(1 - p) * -28}px, 0, 0)`
      })
    }
  }

  function photo(parent, cls, spec, withPins = true) {
    const box = h('div', `ph ${cls || ''}`)
    const img = new Image()
    img.decoding = 'sync'
    img.src = spec.src
    box.appendChild(img)
    parent.appendChild(box)
    const ph = { box, img, spec, cam: { x: spec.fx ?? 50, y: spec.fy ?? 50, k: 1 }, pins: [] }
    if (withPins) {
      ph.pins = (spec.pins || []).map((p) => {
        const el = h('div', 'pin')
        el.innerHTML = `<span class="ring"></span><span class="dot"></span><span class="stem"></span><span class="tag">${icon(p.icon)}<span>${esc(p.label)}</span></span>`
        box.appendChild(el)
        return { p, el, ring: el.querySelector('.ring'), dot: el.querySelector('.dot'), stem: el.querySelector('.stem'), tag: el.querySelector('.tag'), side: null }
      })
    }
    return ph
  }

  /** Where a point of the photo (u, v in %) lands in its box, given the camera. */
  function project(ph, u, v) {
    const W = ph.box.offsetWidth, H = ph.box.offsetHeight
    const iw = ph.img.naturalWidth, ih = ph.img.naturalHeight
    const s = Math.max(W / iw, H / ih)
    const dw = iw * s, dh = ih * s
    const x = (W - dw) * (ph.cam.x / 100) + (u / 100) * dw
    const y = (H - dh) * (ph.cam.y / 100) + (v / 100) * dh
    return { x: W / 2 + (x - W / 2) * ph.cam.k, y: H / 2 + (y - H / 2) * ph.cam.k, W, H }
  }

  /** Pins stay on their object while the camera moves; they appear one by one from t0. */
  function pinsUpdate(ph, lt, t0, maxY = Infinity) {
    ph.pins.forEach((pn, i) => {
      const at = project(ph, pn.p.x, pn.p.y)
      if (!pn.side) pn.side = at.x > at.W * 0.56 ? 'l' : 'r'
      pn.el.className = `pin ${pn.side}`
      const inside = at.x > 20 && at.x < at.W - 20 && at.y > 20 && at.y < Math.min(at.H - 20, maxY)
      pn.el.style.visibility = inside ? 'visible' : 'hidden'
      pn.el.style.transform = `translate3d(${at.x.toFixed(2)}px, ${at.y.toFixed(2)}px, 0)`
      const start = t0 + i * 0.32
      const d = prog(lt, start, 0.6)
      pn.dot.style.transform = `scale(${d})`
      pn.dot.style.opacity = d
      // a ring that breathes out from the dot, once a second
      const r = lt < start ? 0 : ((lt - start) % 1.2) / 1.2
      pn.ring.style.opacity = lt < start ? 0 : (1 - r) * 0.9
      pn.ring.style.transform = `scale(${1 + r * 1.8})`
      pn.stem.style.transform = `scaleX(${prog(lt, start + 0.2, 0.6, E.inOut)})`
      const c = prog(lt, start + 0.45, 0.7)
      pn.tag.style.opacity = c
      pn.tag.style.transform = `translate3d(0, -50%, 0) scale(${0.94 + 0.06 * c})`
    })
  }
  /** The camera on a photo: p runs 0→1 over the scene; extra is a zoom added on reveal. */
  function camera(ph, p, extra = 0) {
    const s = ph.spec
    if (s.zoom > 1) return detail(ph, p, extra)
    const fx = s.fx ?? 50, fy = s.fy ?? 50
    const q = E.soft(clamp(p))
    let x = fx, y = fy, k = 1.06
    switch (s.motion) {
      case 'in': k = lerp(1.02, 1.09, q); break
      case 'out': k = lerp(1.1, 1.02, q); break
      case 'pan-l': x = fx + lerp(9, -9, q); k = 1.07; break
      case 'pan-r': x = fx + lerp(-9, 9, q); k = 1.07; break
      case 'up': y = fy + lerp(8, -8, q); k = lerp(1.08, 1.12, q); break
      case 'down': y = fy + lerp(-8, 8, q); k = lerp(1.08, 1.12, q); break
      case 'slow': k = lerp(1.01, 1.05, q); break
      case 'hold': k = 1.02; break
      default: k = lerp(1.04, 1.1, q)
    }
    ph.cam = { x: clamp(x, 0, 100), y: clamp(y, 0, 100), k: k * (1 + extra) }
    ph.img.style.objectPosition = `${ph.cam.x}% ${ph.cam.y}%`
    ph.img.style.transform = `scale(${ph.cam.k.toFixed(5)})`
  }

  /** A close-up cut out of a photo: the point (fx, fy) brought to the centre of
      the box at `zoom` times the cover size, pushing in slowly, never past the
      photo's edges. The photos are 2560px wide: keep zoom under about 1.8. */
  function detail(ph, p, extra = 0) {
    const s = ph.spec
    const W = ph.box.offsetWidth, H = ph.box.offsetHeight
    const iw = ph.img.naturalWidth, ih = ph.img.naturalHeight
    const fx = (s.fx ?? 50) / 100, fy = (s.fy ?? 50) / 100
    const s0 = Math.max(W / iw, H / ih), dw = iw * s0, dh = ih * s0
    const ox = (W - dw) * fx, oy = (H - dh) * fy
    const q = E.soft(clamp(p))
    const S = s.zoom * (s.motion === 'out' ? lerp(1.1, 1, q) : lerp(1, 1.1, q)) * (1 + extra)
    // the photo only exists inside the img box (object-fit clips it there),
    // so the scaled box must keep covering the frame
    const Fx = ox + fx * dw, Fy = oy + fy * dh
    const a = clamp(W / 2 - S * Fx, W - S * W, 0)
    const b = clamp(H / 2 - S * Fy, H - S * H, 0)
    ph.cam = null
    ph.img.style.objectPosition = `${fx * 100}% ${fy * 100}%`
    ph.img.style.transformOrigin = '0 0'
    ph.img.style.transform = `translate(${a.toFixed(2)}px, ${b.toFixed(2)}px) scale(${S.toFixed(5)})`
  }

  /** The FunctionAlps chapter-head sweep (chapters.css, fa-ch-sweep): a skewed
      band of warm light crossing the frame in 1.5 s, fading in and out. */
  function sheen(parent, strength = 1) {
    const el = h('div', 'sheen')
    el.style.setProperty('--sheen', strength)
    parent.appendChild(el)
    return (lt, t0, dur = 1.5) => {
      const x = (lt - t0) / dur
      if (x <= 0 || x >= 1) { el.style.opacity = 0; return }
      el.style.left = `${lerp(-30, 110, E.inOut(x)).toFixed(3)}%`
      el.style.opacity = x < 0.12 ? x / 0.12 : x > 0.88 ? (1 - x) / 0.12 : 1
    }
  }

  function head(parent, s) {
    const el = h('div', 'head')
    const no = h('span', 'no', esc(s.no || ''))
    const sec = h('span', 'sec caps', esc(s.section || ''))
    const hr = h('span', 'hr')
    const end = h('span', 'end caps', esc(s.end || ''))
    el.append(no, sec, hr, end)
    parent.appendChild(el)
    return (lt) => {
      el.style.opacity = prog(lt, 0.25, 0.8)
      hr.style.transform = `scaleX(${prog(lt, 0.3, 1.2, E.inOut)})`
    }
  }
  function folio(parent, pair) {
    if (!pair) return () => {}
    const el = h('div', 'folio', `<span>${esc(pair[0])}</span><span>${esc(pair[1])}</span>`)
    parent.appendChild(el)
    return (lt) => { el.style.opacity = 0.8 * prog(lt, 0.6, 0.8) }
  }

  window.REEL = { E, clamp, prog, lerp, h, esc, lines, rise, fadeUp, chars, icon, tagList, photo, project, pinsUpdate, camera, sheen, head, folio }
})()
