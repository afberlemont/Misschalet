/* ==========================================================================
   Listing reels: the motion engine.
   window.build(plan) lays out every scene of the plan (lib/edition.mjs) and
   resolves once fonts and photos are decoded; window.seek(t) puts the page
   in its exact state at t seconds. render.mjs calls seek for each frame and
   captures it, so nothing here depends on the clock.
   Scenes overlap by plan.T seconds: the incoming one wipes in on top while
   the outgoing one is pushed away and dimmed.
   ========================================================================== */
(() => {
  'use strict'
  const { E, clamp, h, builders } = window.REEL

  // ---------- transitions ----------
  function enterStyle(kind, p) {
    const q = 1 - p
    switch (kind) {
      case 'wipe-up': return { clip: `inset(${(q * 100).toFixed(3)}% 0 0 0)`, pg: `translate3d(0, ${(q * 22).toFixed(3)}%, 0)` }
      case 'wipe-left': return { clip: `inset(0 0 0 ${(q * 100).toFixed(3)}%)`, pg: `translate3d(${(q * 28).toFixed(3)}%, 0, 0)` }
      case 'wipe-right': return { clip: `inset(0 ${(q * 100).toFixed(3)}% 0 0)`, pg: `translate3d(${(-q * 28).toFixed(3)}%, 0, 0)` }
      case 'iris': return { clip: `inset(${(q * 50).toFixed(3)}% ${(q * 50).toFixed(3)}% ${(q * 50).toFixed(3)}% ${(q * 50).toFixed(3)}%)`, pg: `scale(${(1 + q * 0.12).toFixed(5)})` }
      default: return { opacity: p }
    }
  }
  function exitStyle(kind, q) {
    switch (kind) {
      case 'wipe-up': return `translate3d(0, ${(-q * 18).toFixed(3)}%, 0)`
      case 'wipe-left': return `translate3d(${(-q * 22).toFixed(3)}%, 0, 0)`
      case 'wipe-right': return `translate3d(${(q * 22).toFixed(3)}%, 0, 0)`
      case 'iris': return `scale(${(1 - q * 0.06).toFixed(5)})`
      case 'shine': return `translate3d(${(-q * 8).toFixed(3)}%, 0, 0)`
      default: return ''
    }
  }
  /** 'shine': the FunctionAlps chapter-head arrival (chapters.css): the new page
      slides in from the left behind a soft edge, a band of warm light riding it. */
  function shineStyle(p) {
    const x = -24 + 140 * p
    return { mask: `linear-gradient(100deg, #000 ${(x - 12).toFixed(2)}%, transparent ${(x + 4).toFixed(2)}%)`, band: x - 10, pg: `translate3d(${((1 - p) * 10).toFixed(3)}%, 0, 0)` }
  }

  // ---------- engine ----------
  const stage = document.getElementById('stage')
  let scenes = []
  let T = 0.8

  window.build = async function build(plan) {
    T = plan.T
    const pal = plan.palette || {}
    for (const [k, v] of Object.entries(pal)) stage.style.setProperty(`--${k}`, v)
    if (plan.grade) stage.style.setProperty('--grade', plan.grade)
    stage.innerHTML = ''
    scenes = plan.scenes.map((s) => {
      const el = h('section', `scene ${s.type}`)
      const pg = h('div', 'pg')
      const dim = h('div', '')
      dim.style.cssText = 'position:absolute;inset:0;background:#0b0f0c;opacity:0;pointer-events:none'
      el.append(pg, dim)
      stage.appendChild(el)
      const band = s.enter === 'shine' ? h('div', 'shine-band') : null
      if (band) stage.appendChild(band)
      const update = builders[s.type](pg, s)
      return { s, el, pg, dim, band, update, tIn: s.tIn ?? T }
    })
    scenes.forEach((sc, i) => { sc.tOut = scenes[i + 1]?.tIn ?? T })
    await document.fonts.ready
    await Promise.all([
      document.fonts.load('300 100px Newsreader'), document.fonts.load('italic 300 100px Newsreader'),
      document.fonts.load('200 100px Newsreader'), document.fonts.load('500 20px "DM Sans"'), document.fonts.load('400 20px "DM Sans"'),
    ])
    // one at a time, with a second chance: twenty 2560px photos decoded at once
    // can make Chromium refuse one
    const imgs = [...stage.querySelectorAll('img')]
    for (const im of imgs) {
      try {
        await im.decode()
      } catch {
        await new Promise((r) => setTimeout(r, 200))
        await im.decode().catch(() => { throw new Error(`photo failed: ${im.src}`) })
      }
    }
    window.seek(0)
    return { scenes: scenes.length, photos: imgs.length }
  }

  window.seek = function seek(t) {
    for (let i = 0; i < scenes.length; i++) {
      const sc = scenes[i]
      const { start, dur, enter, exit } = sc.s
      const lt = t - start
      const last = i === scenes.length - 1
      const on = lt >= 0 && (lt < dur || (last && lt <= dur + 1e-6))
      sc.el.classList.toggle('on', on)
      if (!on) continue
      // enter: a mask over this scene, its page pushed in behind the mask
      let clip = 'none', pgT = '', op = 1, mask = ''
      if (sc.band) sc.band.style.opacity = 0
      if (enter && enter !== 'cut' && lt < sc.tIn) {
        const p = E.inOut(clamp(lt / sc.tIn))
        if (enter === 'shine') {
          const st = shineStyle(p)
          mask = st.mask
          pgT = st.pg
          sc.band.style.left = `${st.band.toFixed(2)}%`
          sc.band.style.opacity = Math.min(1, p / 0.1, (1 - p) / 0.15)
        } else {
          const st = enterStyle(enter, p)
          if (st.clip) clip = st.clip
          if (st.pg) pgT = st.pg
          if (st.opacity != null) op = st.opacity
        }
      }
      // exit: pushed away and dimmed while the next scene comes over it
      let dim = 0
      if (exit && exit !== 'cut' && lt > dur - sc.tOut) {
        const q = E.inOut(clamp((lt - (dur - sc.tOut)) / sc.tOut))
        pgT = exitStyle(exit, q)
        dim = q * (exit === 'shine' ? 0.3 : 0.45)
      }
      sc.el.style.clipPath = clip
      sc.el.style.webkitMaskImage = mask
      sc.el.style.maskImage = mask
      sc.el.style.opacity = op
      sc.pg.style.transform = pgT
      sc.dim.style.opacity = dim
      sc.update(lt, dur)
    }
  }
})()
