import { useEffect, useRef } from 'react'

export default function ConveyorAnimation({onCategoryClick}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const NS = 'http://www.w3.org/2000/svg'

    // ── Build SVG ─────────────────────────────────────────────────────────────
    const svg = document.createElementNS(NS, 'svg')
    svg.setAttribute('viewBox', '0 0 1440 560')
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    svg.style.cssText = 'width:100%;height:100%;display:block;'

    // ── Defs ──────────────────────────────────────────────────────────────────
    svg.innerHTML = `
    <defs>
      <filter id="cAmbient" x="-80%" y="-80%" width="260%" height="260%">
        <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#4A4632" flood-opacity="0.10"/>
      </filter>
      <filter id="cContact" x="-80%" y="-80%" width="260%" height="260%">
        <feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#3A3628" flood-opacity="0.16"/>
      </filter>
      <filter id="cBox" x="-90%" y="-90%" width="280%" height="280%">
        <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#000000" flood-opacity="0.30"/>
      </filter>
      <filter id="cGlow" x="-120%" y="-120%" width="340%" height="340%">
        <feGaussianBlur stdDeviation="9"/>
      </filter>
      <linearGradient id="cBeltGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#585C64"/>
        <stop offset="45%" stop-color="#40434A"/>
        <stop offset="55%" stop-color="#34363C"/>
        <stop offset="100%" stop-color="#26282D"/>
      </linearGradient>
      <linearGradient id="cBeltEdge" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2E3035"/>
        <stop offset="100%" stop-color="#17181B"/>
      </linearGradient>
      <linearGradient id="cLegGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#3A3C42"/>
        <stop offset="50%" stop-color="#54575F"/>
        <stop offset="100%" stop-color="#2C2E33"/>
      </linearGradient>
      <linearGradient id="cMachineBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#3C3F45"/>
        <stop offset="60%" stop-color="#2E3035"/>
        <stop offset="100%" stop-color="#212226"/>
      </linearGradient>
      <linearGradient id="cArmMetal" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#34363B"/>
        <stop offset="45%" stop-color="#46484F"/>
        <stop offset="100%" stop-color="#2A2C30"/>
      </linearGradient>
      <radialGradient id="cLensGrad" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stop-color="#FFE4C2"/>
        <stop offset="55%" stop-color="#F2790A"/>
        <stop offset="100%" stop-color="#D9640A"/>
      </radialGradient>
      <radialGradient id="cScanGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#F2790A" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="#F2790A" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="cBoxGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FFB25C" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#FFB25C" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="cKraftA" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#EEE2CC"/>
        <stop offset="100%" stop-color="#DBC9A6"/>
      </linearGradient>
      <linearGradient id="cKraftATop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#F7EEDD"/>
        <stop offset="100%" stop-color="#E9D8B8"/>
      </linearGradient>
      <linearGradient id="cKraftB" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#E6E1D6"/>
        <stop offset="100%" stop-color="#CFC8B7"/>
      </linearGradient>
      <linearGradient id="cKraftBTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#F1EDE3"/>
        <stop offset="100%" stop-color="#DDD6C6"/>
      </linearGradient>
      <linearGradient id="cCreamC" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#F5EFE2"/>
        <stop offset="100%" stop-color="#E6DAC2"/>
      </linearGradient>
      <linearGradient id="cCreamCTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FBF7EE"/>
        <stop offset="100%" stop-color="#EEE3CC"/>
      </linearGradient>
      <linearGradient id="cBottomShade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.22"/>
      </linearGradient>
      <clipPath id="cBeltClip">
        <rect x="20" y="360" width="1400" height="34" rx="17"/>
      </clipPath>
    </defs>

    <style>
      .c-roller { transform-box:fill-box; transform-origin:50% 50%; animation:cspin 3.6s linear infinite; }
      @keyframes cspin { to { transform:rotate(360deg); } }
      .c-led { animation:cblink 2.6s ease-in-out infinite; }
      .c-led2 { animation-delay:.75s; }
      .c-led3 { animation-delay:1.5s; }
      @keyframes cblink { 0%,100%{opacity:.22;} 50%{opacity:1;} }
      .c-tread { animation:ctread 2.1s linear infinite; }
      @keyframes ctread { from{transform:translateX(0);} to{transform:translateX(-34px);} }
      .c-scan { animation:cscan 2.6s ease-in-out infinite; }
      @keyframes cscan { 0%,100%{transform:translateY(-30px);opacity:.15;} 50%{transform:translateY(30px);opacity:.55;} }
    </style>

    <!-- floor shadow -->
    <ellipse cx="720" cy="472" rx="660" ry="24" fill="#4A4326" opacity="0.06"/>

    <!-- machine back -->
    <rect x="150" y="14" width="150" height="16" rx="8" fill="url(#cLegGrad)" filter="url(#cContact)"/>
    <rect x="205" y="26" width="28" height="26" rx="6" fill="url(#cMachineBody)" stroke="#111214" stroke-width="1"/>
    <rect x="211" y="48" width="16" height="118" rx="8" fill="url(#cArmMetal)" stroke="#111214" stroke-width="1"/>
    <rect x="209" y="96" width="20" height="8" rx="4" fill="#F2790A" opacity="0.95"/>
    <rect x="128" y="150" width="200" height="66" rx="26" fill="url(#cMachineBody)" stroke="#111214" stroke-width="1.5" filter="url(#cAmbient)"/>
    <rect x="128" y="196" width="200" height="12" rx="6" fill="#F2790A"/>
    <circle class="c-led" cx="152" cy="178" r="4.5" fill="#F2790A"/>
    <circle class="c-led c-led2" cx="168" cy="178" r="4.5" fill="#F2790A"/>
    <circle class="c-led c-led3" cx="184" cy="178" r="4.5" fill="#F2790A"/>
    <g transform="translate(255,160)">
      <rect x="0" y="0" width="56" height="34" rx="8" fill="#1C1D20" stroke="#000000" stroke-width="1"/>
      <rect id="cBar1" x="8" y="20" width="6" height="8" rx="2" fill="#F2790A" opacity="0.9" style="transform-box:fill-box;transform-origin:bottom;"/>
      <rect id="cBar2" x="18" y="14" width="6" height="14" rx="2" fill="#F2790A" opacity="0.75" style="transform-box:fill-box;transform-origin:bottom;"/>
      <rect id="cBar3" x="28" y="9" width="6" height="19" rx="2" fill="#F2790A" opacity="0.6" style="transform-box:fill-box;transform-origin:bottom;"/>
      <rect id="cBar4" x="38" y="16" width="6" height="12" rx="2" fill="#F2790A" opacity="0.45" style="transform-box:fill-box;transform-origin:bottom;"/>
    </g>

    <!-- light curtain sensor -->
    <rect x="58" y="220" width="6" height="140" rx="3" fill="url(#cArmMetal)" stroke="#111214" stroke-width="1"/>
    <rect x="58" y="220" width="6" height="8" rx="3" fill="#F2790A"/>
    <rect x="58" y="352" width="6" height="8" rx="3" fill="#F2790A"/>
    <rect class="c-scan" x="55" y="260" width="12" height="2" rx="1" fill="#F2790A"/>

    <!-- conveyor -->
    <g id="cConveyorVibrate">
      <rect x="80" y="384" width="20" height="92" rx="6" fill="url(#cLegGrad)"/>
      <rect x="1340" y="384" width="20" height="92" rx="6" fill="url(#cLegGrad)"/>
      <rect x="700" y="384" width="20" height="92" rx="6" fill="url(#cLegGrad)"/>
      <rect x="68" y="468" width="44" height="11" rx="5" fill="#2A2C31"/>
      <rect x="1328" y="468" width="44" height="11" rx="5" fill="#2A2C31"/>
      <rect x="688" y="468" width="44" height="11" rx="5" fill="#2A2C31"/>
      <rect x="20" y="356" width="1400" height="44" rx="19" fill="url(#cBeltEdge)" filter="url(#cAmbient)"/>
      <rect x="20" y="360" width="1400" height="34" rx="17" fill="url(#cBeltGrad)"/>
      <g id="cRivets" fill="#1A1B1E" opacity="0.6"></g>
      <g clip-path="url(#cBeltClip)">
        <g class="c-tread" fill="#1E2024" opacity="0.5"><g id="cTreadStripes"></g></g>
      </g>
      <g id="cRollers"></g>
    </g>

    <!-- boxes layer -->
    <g id="cBoxesLayer"></g>

    <!-- machine arm front -->
    <g id="cMachineArm">
      <rect x="203" y="204" width="34" height="34" rx="10" fill="url(#cArmMetal)" stroke="#111214" stroke-width="1" filter="url(#cContact)"/>
      <rect x="196" y="234" width="48" height="24" rx="10" fill="#26282D" stroke="#111214" stroke-width="1.5"/>
      <circle cx="220" cy="246" r="9" fill="url(#cLensGrad)"/>
      <circle cx="220" cy="246" r="9" fill="none" stroke="#B85C05" stroke-width="1" opacity="0.4"/>
      <ellipse id="cScanBeam" cx="220" cy="300" rx="42" ry="64" fill="url(#cScanGlow)" opacity="0"/>
    </g>
    `

    container.appendChild(svg)

    // ── Get elements ──────────────────────────────────────────────────────────
    const boxesLayer = svg.getElementById('cBoxesLayer')
    const rollersG   = svg.getElementById('cRollers')
    const treadG     = svg.getElementById('cTreadStripes')
    const rivetsG    = svg.getElementById('cRivets')
    const convVibe   = svg.getElementById('cConveyorVibrate')
    const scanBeam   = svg.getElementById('cScanBeam')
    const machineArm = svg.getElementById('cMachineArm')
    const bars = ['cBar1','cBar2','cBar3','cBar4'].map(id => svg.getElementById(id))

    // ── Categories ────────────────────────────────────────────────────────────
    const CATS = [
      { name:'MANUFACTURER',     tone:'cKraftA',  top:'cKraftATop',  h:132, tape:'cross',   icon:'gear'     },
      { name:'WHOLESALE',         tone:'cKraftB',  top:'cKraftBTop',  h:120, tape:'double',  icon:'stack'    },
      { name:'RETAIL SUPPLY',     tone:'cCreamC',  top:'cCreamCTop',  h:138, tape:'thin',    icon:'bag'      },
      { name:'SERVICE PROVIDERS', tone:'cKraftA',  top:'cKraftATop',  h:124, tape:'corner',  icon:'headset'  },
      { name:'TRADERS',           tone:'cCreamC',  top:'cCreamCTop',  h:130, tape:'thick',   icon:'exchange' },
      { name:'DISTRIBUTORS',      tone:'cKraftB',  top:'cKraftBTop',  h:118, tape:'cross',   icon:'truck'    },
    ]

    const SCREEN_W  = 1440
    const SPACING   = 226
    const SPEED     = 62
    const N         = 10
    const MACHINE_X = 232
    const ZONE_HALF = 100
    const BELT_TOP  = 360
    const BOX_W     = 168

    function easeOutBack(x) {
      const c1 = 1.70158, c3 = c1 + 1
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
    }
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)) }

    function toSVGPoint(evt) {
      const pt = svg.createSVGPoint()
      pt.x = evt.clientX; pt.y = evt.clientY
      const ctm = svg.getScreenCTM()
      if (!ctm) return { x: 0, y: 0 }
      return pt.matrixTransform(ctm.inverse())
    }

    // ── Rollers ───────────────────────────────────────────────────────────────
    for (let x = 60; x <= 1400; x += 96) {
      const g = document.createElementNS(NS, 'g')
      g.setAttribute('class', 'c-roller')
      g.innerHTML = `
        <circle cx="${x}" cy="398" r="9" fill="#4A4D54" stroke="#17181B" stroke-width="1.5"/>
        <line x1="${x}" y1="391" x2="${x}" y2="405" stroke="#0F1012" stroke-width="2"/>
        <line x1="${x-7}" y1="398" x2="${x+7}" y2="398" stroke="#0F1012" stroke-width="2"/>
      `
      rollersG.appendChild(g)
    }

    // ── Rivets ────────────────────────────────────────────────────────────────
    let rv = ''
    for (let x = 40; x <= 1400; x += 60) rv += `<circle cx="${x}" cy="362" r="2.2"/>`
    rivetsG.innerHTML = rv

    // ── Tread ─────────────────────────────────────────────────────────────────
    let sx = -60, th = ''
    while (sx < 1500) {
      th += `<polygon points="${sx},394 ${sx+14},394 ${sx+8},360 ${sx-6},360"/>`
      sx += 34
    }
    treadG.innerHTML = th

    // ── Icon paths ────────────────────────────────────────────────────────────
    function iconMarkup(type) {
      const s = `stroke="#B4560A" stroke-width="2.1" fill="none" stroke-linecap="round" stroke-linejoin="round"`
      switch (type) {
        case 'gear':
          return `<circle cx="17" cy="17" r="6" ${s}/><circle cx="17" cy="17" r="2" fill="#B4560A" stroke="none"/>` +
            [0,60,120,180,240,300].map(a =>
              `<line x1="${17+Math.cos(a*Math.PI/180)*8}" y1="${17+Math.sin(a*Math.PI/180)*8}" x2="${17+Math.cos(a*Math.PI/180)*11}" y2="${17+Math.sin(a*Math.PI/180)*11}" ${s}/>`
            ).join('')
        case 'stack':
          return `<rect x="8" y="10" width="18" height="5" rx="1.5" ${s}/><rect x="8" y="17" width="18" height="5" rx="1.5" ${s}/><rect x="8" y="24" width="18" height="5" rx="1.5" ${s}/>`
        case 'bag':
          return `<path d="M10 14 h14 l1.5 14 a2 2 0 0 1 -2 2 h-13 a2 2 0 0 1 -2 -2 z" ${s}/><path d="M13 14 v-2 a4 4 0 0 1 8 0 v2" ${s}/>`
        case 'headset':
          return `<path d="M9 18 a8 8 0 0 1 16 0" ${s}/><rect x="7" y="17" width="4.5" height="8" rx="2" ${s}/><rect x="22.5" y="17" width="4.5" height="8" rx="2" ${s}/>`
        case 'exchange':
          return `<path d="M9 14 h13 l-4 -4" ${s}/><path d="M25 21 h-13 l4 4" ${s}/>`
        case 'truck':
          return `<rect x="7" y="13" width="14" height="9" rx="1.5" ${s}/><path d="M21 16 h4 l3 3 v3 h-7z" ${s}/><circle cx="12" cy="24" r="2" ${s}/><circle cx="24" cy="24" r="2" ${s}/>`
        default: return ''
      }
    }

    function tapeMarkup(style, h) {
      const cx = BOX_W / 2
      switch (style) {
        case 'cross':
          return `<rect x="${cx-9}" y="-16" width="18" height="${h+16}" fill="#F2790A" opacity="0.88"/>
                  <rect x="0" y="${h/2-9}" width="${BOX_W}" height="18" fill="#F2790A" opacity="0.7"/>`
        case 'double':
          return `<rect x="0" y="10" width="${BOX_W}" height="14" fill="#F2790A" opacity="0.85"/>
                  <rect x="0" y="${h-24}" width="${BOX_W}" height="14" fill="#F2790A" opacity="0.85"/>`
        case 'thin':
          return `<rect x="${cx-6}" y="-16" width="12" height="${h+16}" fill="#F2790A" opacity="0.85"/>`
        case 'thick':
          return `<rect x="${cx-15}" y="-16" width="30" height="${h+16}" fill="#F2790A" opacity="0.85"/>`
        case 'corner':
          return `<rect x="-6" y="10" width="60" height="14" rx="3" fill="#F2790A" opacity="0.85" transform="rotate(-32 24 17)"/>`
        default: return ''
      }
    }

    // ── Box state ─────────────────────────────────────────────────────────────
    const boxes = []
    let nextCat = 0
    for (let i = 0; i < N; i++) {
      boxes.push({
        x: i * SPACING - 2 * SPACING,
        y: BELT_TOP - 130 + 6,
        cat: (nextCat++) % CATS.length,
        dragging: false, releasing: false,
        dragOffsetX: 0, dragOffsetY: 0,
        releaseFromX: 0, releaseFromY: 0, releaseStart: 0,
        angle: 0, angleVel: 0, prevX: 0, prevY: 0,
        el: null, labelEl: null, glowEl: null, particlesEl: null,
        H: 0, _wasLifted: false, _wasNearMachine: false,
      })
    }

    function buildBoxVisual(b) {
      const cfg = CATS[b.cat]
      const H = cfg.h
      const g = document.createElementNS(NS, 'g')
      g.setAttribute('filter', 'url(#cBox)')
      g.style.cursor = 'grab'

      g.innerHTML = `
        <polygon points="0,0 ${BOX_W},0 ${BOX_W-16},-16 16,-16" fill="url(#${cfg.top})"/>
        <rect x="0" y="0" width="${BOX_W}" height="${H}" rx="12" fill="url(#${cfg.tone})" stroke="#CBB795" stroke-opacity="0.5" stroke-width="1"/>
        <rect x="0" y="${H*0.5}" width="${BOX_W}" height="${H*0.5}" rx="12" fill="url(#cBottomShade)"/>
        <rect x="12" y="1.2" width="${BOX_W-24}" height="2" rx="1" fill="#FFFFFF" opacity="0.35"/>
        <polygon points="0,0 16,-16 16,0" fill="#00000012"/>
        <g>${tapeMarkup(cfg.tape, H)}</g>
        <g transform="translate(${BOX_W-40},8)">
          <circle cx="17" cy="17" r="17" fill="#FFFFFF" opacity="0.8"/>
          ${iconMarkup(cfg.icon)}
        </g>
        <ellipse class="cGlowEl" cx="${BOX_W/2}" cy="${H/2-6}" rx="90" ry="70" fill="url(#cBoxGlow)" opacity="0" filter="url(#cGlow)"/>
        <g class="cLabelEl" style="transform-box:fill-box;transform-origin:50% 50%;">
          <rect x="14" y="${H/2-25}" width="${BOX_W-28}" height="50" rx="8" fill="#FFFFFF" stroke="#ECEBE7"/>
          <text x="${BOX_W/2}" y="${H/2+3}" text-anchor="middle" font-size="14.5" font-weight="700" letter-spacing="0.3" fill="#2E2C29" font-family="-apple-system,BlinkMacSystemFont,'Inter',sans-serif">${cfg.name}</text>
          <rect x="24" y="${H/2+13}" width="28" height="4" rx="2" fill="#F2790A"/>
        </g>
        <g class="cPartsEl">
          ${[...Array(7)].map((_,p) => {
            const ang = (p/7)*Math.PI*2
            return `<circle data-ang="${ang}" cx="${BOX_W/2}" cy="${H/2-10}" r="3" fill="#F2790A" opacity="0"/>`
          }).join('')}
        </g>
      `

      b.H = H
      if (!b.dragging && !b.releasing) b.y = BELT_TOP - H + 6
      b.labelEl   = g.querySelector('.cLabelEl')
      b.glowEl    = g.querySelector('.cGlowEl')
      b.particlesEl = g.querySelector('.cPartsEl')

      let pointerDownTime = 0
      let pointerDownX = 0
      let pointerDownY = 0

      g.addEventListener('pointerdown', (e) => {
        e.preventDefault()
        pointerDownTime = Date.now()
        pointerDownX = e.clientX
        pointerDownY = e.clientY
        const p = toSVGPoint(e)
        b.dragOffsetX = p.x - b.x
        b.dragOffsetY = p.y - b.y
        b.dragging = true; b.releasing = false
        b.prevX = b.x; b.prevY = b.y
        draggedBox = b
        boxesLayer.appendChild(g)
      })

      g.addEventListener('pointerup',(e)=>{
        const elapsed = Date.now() - pointerDownTime
        const dx = Math.abs(e.clientX - pointerDownX)
        const dy = Math.abs(e.clientY - pointerDownY)
        // if it was a tap (short duration, minimal movement) treat as click
        if (elapsed < 300 && dx < 8 && dy < 8 && onCategoryClick) {
            const cfg = CATS[b.cat]
            onCategoryClick(cfg.name)
        }
      })

      return g
    }

    // ── Drag ─────────────────────────────────────────────────────────────────
    let draggedBox = null

    function onMove(e) {
      if (!draggedBox) return
      const p = toSVGPoint(e)
      draggedBox.x = p.x - draggedBox.dragOffsetX
      draggedBox.y = p.y - draggedBox.dragOffsetY
    }
    function onUp() {
      if (!draggedBox) return
      const b = draggedBox
      b.dragging = false; b.releasing = true
      b.releaseFromX = b.x; b.releaseFromY = b.y
      b.releaseStart = performance.now()
      draggedBox = null
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup',   onUp,   { passive: true })
    window.addEventListener('pointercancel', onUp, { passive: true })
    window.addEventListener('blur', onUp)

    boxes.forEach(b => {
      const g = buildBoxVisual(b)
      boxesLayer.appendChild(g)
      b.el = g
    })

    function rebuildBox(b) {
      const old = b.el
      const g = buildBoxVisual(b)
      boxesLayer.replaceChild(g, old)
      b.el = g
    }

    // ── Raf loop ──────────────────────────────────────────────────────────────
    let lastTime = null, vibeT = 0, rafId = null, destroyed = false

    function frame(ts) {
      if (destroyed) return
      if (lastTime === null) lastTime = ts
      let dt = clamp((ts - lastTime) / 1000, 0, 0.05)
      lastTime = ts
      vibeT += dt

      // move boxes
      boxes.forEach(b => { if (!b.dragging) b.x += SPEED * dt })

      // recycle off-screen boxes
      boxes.forEach(b => {
        if (b.dragging || b.releasing) return
        if (b.x > SCREEN_W + 140) {
          const minX = Math.min(...boxes.filter(o => !o.dragging && !o.releasing).map(o => o.x))
          b.x = (isFinite(minX) ? minX : b.x) - SPACING
          b.cat = (nextCat++) % CATS.length
          rebuildBox(b)
        }
      })

      // machine arm hump
      let activeT = 0
      boxes.forEach(b => {
        const bt = clamp((b.x - (MACHINE_X - ZONE_HALF)) / (2 * ZONE_HALF), 0, 1)
        if (bt > 0 && bt < 1) activeT = bt
      })
      const hump = Math.sin(Math.PI * activeT)
      machineArm.setAttribute('transform', `translate(0,${hump * 40})`)
      scanBeam.setAttribute('opacity', clamp(hump * 1.15, 0, 1) * 0.85)

      bars.forEach((bar, i) => {
        const w = 1 + Math.sin(vibeT * 1.3 + i * 1.7) * 0.18 + hump * 0.25
        bar.style.transform = `scaleY(${clamp(w, 0.5, 1.4)})`
      })

      // update each box
      boxes.forEach(b => {
        if (b.releasing) {
          const targetY = BELT_TOP - b.H + 6
          const p = clamp((performance.now() - b.releaseStart) / 400, 0, 1)
          b.y = b.releaseFromY + (targetY - b.releaseFromY) * easeOutBack(p)
          if (p >= 1) { b.releasing = false; b.y = targetY }
        } else if (!b.dragging) {
          b.y = BELT_TOP - b.H + 6
        }

        // swing
        let targetAngle = 0
        if (b.dragging && dt > 0) {
          const vx = (b.x - b.prevX) / dt
          targetAngle = clamp(-vx * 0.16, -32, 32)
        }
        b.angleVel += ((targetAngle - b.angle) * 95 - b.angleVel * 9.5) * dt
        b.angle += b.angleVel * dt
        b.prevX = b.x; b.prevY = b.y

        const scale = b.dragging ? 1.06 : 1
        const rot = Math.abs(b.angle) > 0.02
          ? `rotate(${b.angle.toFixed(2)} ${b.dragOffsetX.toFixed(1)} ${b.dragOffsetY.toFixed(1)})`
          : ''
        b.el.setAttribute('transform', `translate(${b.x},${b.y}) ${rot} scale(${scale})`)

        const lifted = b.dragging || b.releasing
        if (lifted !== b._wasLifted) {
          b.el.style.filter = lifted ? 'url(#cAmbient)' : ''
          b._wasLifted = lifted
        }

        // machine zone effects
        const nearMachine = Math.abs(b.x - MACHINE_X) < (ZONE_HALF + 40)
        if (nearMachine) {
          const t = clamp((b.x - (MACHINE_X - ZONE_HALF)) / (2 * ZONE_HALF), 0, 1)
          const localP = clamp((t - 0.42) / 0.18, 0, 1)
          const bounce = easeOutBack(localP)

          b.labelEl.style.opacity = localP > 0.001 ? 1 : 0
          b.labelEl.style.transform = `scale(${0.001 + bounce * (localP > 0.001 ? 1 : 0)})`

          const glowP = clamp(1 - Math.abs(t - 0.5) / 0.22, 0, 1)
          b.glowEl.setAttribute('opacity', (glowP * 0.75).toFixed(2))

          const partP = clamp(1 - Math.abs(t - 0.56) / 0.16, 0, 1)
          const kids = b.particlesEl.children
          for (let i = 0; i < kids.length; i++) {
            const c = kids[i]
            const ang = parseFloat(c.getAttribute('data-ang'))
            const dist = (1 - partP) * 34 + 6
            c.setAttribute('cx', BOX_W/2 + Math.cos(ang) * dist)
            c.setAttribute('cy', (b.H/2-10) + Math.sin(ang) * dist * 0.7)
            c.setAttribute('opacity', (partP * 0.9).toFixed(2))
          }
          b._wasNearMachine = true
        } else if (b._wasNearMachine) {
          b.glowEl.setAttribute('opacity', '0')
          const kids = b.particlesEl.children
          for (let i = 0; i < kids.length; i++) kids[i].setAttribute('opacity', '0')
          b._wasNearMachine = false
        }
      })

      // conveyor jitter
      convVibe.setAttribute('transform',
        `translate(${(Math.sin(vibeT*30)*0.3).toFixed(2)},${(Math.cos(vibeT*41)*0.22).toFixed(2)})`)

      rafId = requestAnimationFrame(frame)
    }

    rafId = requestAnimationFrame(frame)

    return () => {
      destroyed = true
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup',   onUp)
      window.removeEventListener('pointercancel', onUp)
      window.removeEventListener('blur', onUp)
      if (container.contains(svg)) container.removeChild(svg)
    }
  }, [onCategoryClick])

  return (
    <div
      ref={containerRef}
      className="w-full"
      style={{ height: '420px' }}
    />
  )
}