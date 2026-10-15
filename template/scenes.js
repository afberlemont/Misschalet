/* ==========================================================================
   Listing reels: the scenes. Each builder lays out its page from the plan's
   scene (lib/edition.mjs) and returns update(lt, dur), which sets every style
   from the scene's local time.
   ========================================================================== */
(() => {
  'use strict'
  const { E, clamp, prog, lerp, h, esc, lines, rise, fadeUp, chars, icon, tagList, photo, project, pinsUpdate, camera, sheen, head, folio } = window.REEL

  /** A long name ("Les Clématites") set smaller so it stays on one line in the page. */
  function fitMast(el, name, size) {
    const n = String(name).length
    if (n > 11) el.style.fontSize = `${Math.round(size * 11 / n)}px`
  }

  // ---------- scenes ----------
  window.REEL.builders = {
    cover(pg, s) {
      const ph = photo(pg, 'full', s.photo, false)
      pg.appendChild(h('div', 'shade'))
      const top = h('div', 'top caps', `<span>${esc(s.issue)}</span><span class="hr"></span><span>${esc(s.season)}</span>`)
      const topHr = top.querySelector('.hr')
      const mast = h('h1', 'mast')
      const cs = chars(mast, s.name)
      fitMast(mast, s.name, 196)
      const kicker = h('div', 'kicker caps', esc(s.kicker))
      const box = h('div', 'lines')
      const big = h('div', 'big')
      const bigLines = lines(big, s.lines)
      const caps = h('div', 'caps', esc(s.caps))
      const hr = h('div', 'hr')
      box.append(big, caps, hr)
      pg.append(top, mast, kicker, box)
      const sh = s.sheen ? sheen(pg, s.sheen) : null
      return (lt, dur) => {
        camera(ph, lt / dur)
        if (sh) sh(lt, 1.15, 1.5)
        top.style.opacity = prog(lt, 0.1, 0.8)
        topHr.style.transform = `scaleX(${prog(lt, 0.15, 1.3, E.inOut)})`
        cs.forEach((c, i) => {
          const p = prog(lt, 0.2 + i * 0.045, 1.1)
          c.style.opacity = p
          c.style.transform = `translate3d(0, ${(1 - p) * 64}px, 0)`
        })
        fadeUp(kicker, lt, 0.95, 0.9, 18)
        rise(bigLines, lt, 1.2, 0.13, 1.0)
        fadeUp(caps, lt, 1.65, 0.9, 16)
        hr.style.transform = `scaleX(${prog(lt, 1.8, 1.1, E.inOut)})`
      }
    },

    frame(pg, s) {
      pg.classList.add('paper', 'grain')
      const hd = head(pg, s)
      const title = h('h2', 'title')
      const tl = lines(title, s.title)
      pg.appendChild(title)
      const ph = photo(pg, '', s.photo)
      let tg = null
      if (s.tags?.length) {
        ph.box.appendChild(h('div', 'under'))
        tg = tagList(ph.box, s.tags, 'sm row')
      }
      const cap = h('div', 'figcap', `<b>${esc(s.caption.label)}</b>${esc(s.caption.text)}`)
      pg.appendChild(cap)
      const fo = folio(pg, s.folio)
      return (lt, dur) => {
        hd(lt)
        rise(tl, lt, 0.45, 0.14)
        const r = prog(lt, 0.3, 1.35, E.inOut)
        ph.box.style.clipPath = `inset(${((1 - r) * 100).toFixed(3)}% 0 0 0)`
        camera(ph, lt / dur, 0.14 * (1 - E.out(clamp((lt - 0.3) / 1.8))))
        pinsUpdate(ph, lt, 1.2, tg ? ph.box.offsetHeight - 170 : Infinity)
        if (tg) tg(lt, 1.35)
        fadeUp(cap, lt, 1.35, 0.9, 14)
        fo(lt)
      }
    },

    spotlight(pg, s) {
      pg.classList.add('spot')
      const ph = photo(pg, 'full', s.photo)
      pg.insertBefore(h('div', 'shade'), ph.box.nextSibling)
      const hd = head(pg, s)
      const title = h('h2', 'title')
      const tl = lines(title, s.title)
      pg.appendChild(title)
      const tg = tagList(pg, s.tags, 'grid')
      return (lt, dur) => {
        camera(ph, lt / dur)
        hd(lt)
        rise(tl, lt, 0.45, 0.14)
        pinsUpdate(ph, lt, 1.0, 1110)
        tg(lt, 1.15, 0.09)
      }
    },

    bleed(pg, s) {
      const ph = photo(pg, 'full', s.photo)
      pg.appendChild(h('div', 'shade'))
      pg.classList.add('on-photo')
      const tag = h('div', 'sect caps', esc(s.tag || ''))
      const card = h('div', 'card grain')
      const eyeb = h('div', 'caps', esc(s.eyebrow))
      const title = h('h2', 'title')
      const tl = lines(title, s.title)
      const body = h('p', 'body-text', esc(s.text))
      card.append(eyeb, title, body)
      pg.append(tag, card)
      const tg = s.tags?.length ? tagList(pg, s.tags, '') : null
      return (lt, dur) => {
        camera(ph, lt / dur)
        pinsUpdate(ph, lt, 1.3, 1030)
        if (tg) tg(lt, 0.7)
        fadeUp(tag, lt, 0.4, 0.9, 12)
        const r = prog(lt, 0.55, 1.1, E.inOut)
        card.style.clipPath = `inset(${((1 - r) * 100).toFixed(3)}% 0 0 0)`
        card.style.transform = `translate3d(0, ${(1 - r) * 60}px, 0)`
        fadeUp(eyeb, lt, 0.95, 0.8, 12)
        rise(tl, lt, 1.0, 0.13)
        fadeUp(body, lt, 1.45, 0.9, 14)
      }
    },

    diptych(pg, s) {
      pg.classList.add('paper', 'grain')
      const hd = head(pg, s)
      const title = h('h2', 'title')
      const tl = lines(title, s.title)
      pg.appendChild(title)
      // the photos are narrow: chips at their foot, no pins
      const a = photo(pg, 'a', s.photos[0], false)
      const b = photo(pg, 'b', s.photos[1], false)
      const tags = s.tags || []
      const tga = tags.length ? (a.box.appendChild(h('div', 'under')), tagList(a.box, tags.slice(0, 2), 'sm')) : null
      const tgb = tags.length > 2 ? (b.box.appendChild(h('div', 'under')), tagList(b.box, tags.slice(2, 4), 'sm')) : null
      const cap = h('div', 'figcap', `<b>${esc(s.caption.label)}</b>${esc(s.caption.text)}`)
      pg.appendChild(cap)
      const fo = folio(pg, s.folio)
      return (lt, dur) => {
        hd(lt)
        rise(tl, lt, 0.45, 0.14)
        const ra = prog(lt, 0.3, 1.3, E.inOut)
        const rb = prog(lt, 0.6, 1.3, E.inOut)
        a.box.style.clipPath = `inset(${((1 - ra) * 100).toFixed(3)}% 0 0 0)`
        b.box.style.clipPath = `inset(0 0 ${((1 - rb) * 100).toFixed(3)}% 0)`
        camera(a, lt / dur, 0.12 * (1 - ra))
        camera(b, lt / dur, 0.12 * (1 - rb))
        if (tga) tga(lt, 1.2)
        if (tgb) tgb(lt, 1.5)
        fadeUp(cap, lt, 1.4, 0.9, 14)
        fo(lt)
      }
    },

    facts(pg, s) {
      pg.classList.add('deep', 'grain')
      const hd = head(pg, s)
      const title = h('h2', 'title')
      const tl = lines(title, s.title)
      const rows = h('div', 'rows')
      const rs = s.rows.map((r) => {
        const row = h('div', 'row')
        const v = h('span', 'v serif', esc(r.v))
        const l = h('span', 'l', `${r.icon ? icon(r.icon) : ''}<span>${esc(r.l)}</span>`)
        const hr = h('span', 'hr')
        row.append(v, l, hr)
        rows.appendChild(row)
        const str = String(r.v)
        const num = Number(str.replace(',', '.'))
        const dec = (str.split(/[.,]/)[1] || '').length
        return { v, l, hr, str, num, dec, comma: str.includes(',') }
      })
      const note = h('div', 'note caps', esc(s.note || ''))
      const fo = folio(pg, s.folio)
      pg.append(title, rows, note)
      return (lt) => {
        hd(lt)
        rise(tl, lt, 0.4, 0.14)
        rs.forEach((r, i) => {
          const t0 = 0.75 + i * 0.22
          r.hr.style.transform = `scaleX(${prog(lt, t0, 1.1, E.inOut)})`
          const p = prog(lt, t0, 1.25)
          if (Number.isFinite(r.num)) {
            const val = (r.num * p).toFixed(r.dec)
            r.v.textContent = r.comma ? val.replace('.', ',') : val
          }
          r.v.style.opacity = prog(lt, t0, 0.5)
          r.v.style.transform = `translate3d(0, ${(1 - p) * 40}px, 0)`
          fadeUp(r.l, lt, t0 + 0.25, 0.9, 14)
        })
        fadeUp(note, lt, 0.75 + rs.length * 0.22 + 0.4, 0.9, 12)
        fo(lt)
      }
    },

    nearby(pg, s) {
      pg.classList.add('paper', 'grain')
      const ph = photo(pg, '', s.photo, false)
      const eyeb = h('div', 'eyeb caps', esc(s.eyebrow))
      const title = h('h2', 'title')
      const tl = lines(title, s.title)
      const list = h('div', 'list')
      const items = s.items.map((it) => {
        const row = h('div', 'item', `${it.icon ? icon(it.icon) : ''}<span class="n">${esc(it.name)}</span><span class="dots"></span><span class="d">${esc(it.d)}</span>`)
        list.appendChild(row)
        return { row, dots: row.querySelector('.dots') }
      })
      const fo = folio(pg, s.folio)
      pg.append(eyeb, title, list)
      return (lt, dur) => {
        const r = prog(lt, 0.2, 1.3, E.inOut)
        ph.box.style.clipPath = `inset(0 0 ${((1 - r) * 100).toFixed(3)}% 0)`
        camera(ph, lt / dur, 0.1 * (1 - r))
        fadeUp(eyeb, lt, 0.6, 0.8, 12)
        rise(tl, lt, 0.7, 0.14)
        items.forEach((it, i) => {
          const t0 = 1.0 + i * 0.13
          fadeUp(it.row, lt, t0, 0.8, 18)
          it.dots.style.transform = `translateY(-8px) scaleX(${prog(lt, t0 + 0.1, 0.9, E.inOut)})`
        })
        fo(lt)
      }
    },

    cta(pg, s) {
      const ph = photo(pg, 'full', s.photo, false)
      pg.appendChild(h('div', 'veil'))
      const box = h('div', 'box')
      const eyeb = h('div', 'caps', esc(s.eyebrow))
      const mast = h('div', 'mast')
      const ml = lines(mast, [esc(s.name)])
      fitMast(mast, s.name, 172)
      const sub = h('div', 'sub', esc(s.sub))
      const urlWrap = h('div', '')
      const url = h('div', 'url', esc(s.url))
      urlWrap.appendChild(url)
      const stats = h('div', 'stats caps', esc(s.stats || ''))
      box.append(eyeb, mast, sub, urlWrap, stats)
      pg.appendChild(box)
      const sh = s.sheen ? sheen(pg, s.sheen) : null
      return (lt, dur) => {
        camera(ph, lt / dur)
        if (sh) sh(lt, 1.0, 1.5)
        fadeUp(eyeb, lt, 0.45, 0.9, 14)
        rise(ml, lt, 0.6, 0, 1.15)
        fadeUp(sub, lt, 0.95, 0.9, 16)
        const r = prog(lt, 1.3, 1.1, E.inOut)
        url.style.clipPath = `inset(0 ${((1 - r) * 50).toFixed(3)}% 0 ${((1 - r) * 50).toFixed(3)}%)`
        fadeUp(stats, lt, 1.75, 0.9, 12)
      }
    },
  }
})()
