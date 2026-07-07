import { useEffect, useRef } from 'react'

export default function IndiaNetworkAnimation() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // ── India polygon ────────────────────────────────────────────────────────
    const INDIA_POLY = [
      [108.8,35.5],[99.6,46.5],[99.6,52.0],[118.0,64.8],[112.5,77.6],[114.3,105.1],[134.5,118.0],[129.0,145.5],
      [83.1,202.3],[64.8,198.6],[50.2,216.9],[59.3,226.1],[61.2,238.9],[68.5,242.6],[74.0,260.9],[39.2,264.6],
      [30.0,275.6],[42.8,288.4],[41.0,299.4],[64.8,323.2],[75.8,325.1],[90.5,317.7],[101.5,321.4],[101.5,352.5],
      [112.5,403.9],[151.0,484.5],[163.8,523.0],[176.6,532.2],[191.3,515.7],[205.9,513.8],[202.3,502.8],[213.3,497.3],
      [213.3,469.8],[220.6,453.3],[218.8,411.2],[249.9,396.5],[257.3,381.9],[304.9,341.6],[314.1,339.7],[325.1,326.9],
      [326.9,312.2],[358.0,310.4],[352.5,264.6],[347.1,260.9],[347.1,253.6],[356.2,246.3],[347.1,238.9],[347.1,231.6],
      [369.0,235.3],[370.9,248.1],[405.7,249.9],[407.5,259.1],[391.0,275.6],[396.5,286.6],[409.4,284.7],[414.9,303.1],
      [420.4,303.1],[425.9,271.9],[438.7,271.9],[453.3,226.1],[471.7,211.4],[484.5,215.1],[490.0,196.8],[477.2,189.4],
      [469.8,172.9],[458.8,178.4],[446.0,174.8],[413.0,202.3],[398.4,202.3],[402.0,209.6],[398.4,220.6],[361.7,220.6],
      [356.2,216.9],[350.7,196.8],[343.4,200.4],[339.7,226.1],[297.6,220.6],[281.1,207.8],[264.6,209.6],[242.6,200.4],
      [220.6,185.8],[220.6,171.1],[231.6,158.3],[196.8,134.5],[196.8,121.6],[207.8,116.1],[200.4,90.5],[215.1,75.8],
      [218.8,57.5],[200.4,52.0],[176.6,59.3],[141.8,30.0]
    ]
    const INDIA_ISLANDS = [[416.3,466.3],[428.9,538.9]]
    const POLY_W = 520, POLY_H = 562.2

    const CITIES = {
      mumbai:    { x: 96,  y: 322, name: 'Mumbai' },
      kolkata:   { x: 392, y: 262, name: 'Kolkata' },
      delhi:     { x: 210, y: 150, name: 'Delhi' },
      bangalore: { x: 230, y: 433, name: 'Bangalore' },
      chennai:   { x: 283, y: 475, name: 'Chennai' },
    }
    const ROUTES = [
      ['mumbai','kolkata'],
      ['delhi','bangalore'],
      ['chennai','delhi'],
      ['kolkata','bangalore'],
    ]
    const PALETTE = ['#FF6A00','#FF8C42','#FFA94D','#FFD166']

    function hexToRgb(h) {
      h = h.replace('#','')
      return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]
    }
    const PALETTE_RGB = PALETTE.map(hexToRgb)

    function pointInPoly(x, y, poly) {
      let inside = false
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1]
        const intersect = ((yi > y) !== (yj > y)) && (x < (xj-xi)*(y-yi)/(yj-yi)+xi)
        if (intersect) inside = !inside
      }
      return inside
    }

    // ── Canvas setup ─────────────────────────────────────────────────────────
    const canvas = document.createElement('canvas')
    const off = document.createElement('canvas')
    const flowCanvas = document.createElement('canvas')

    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;transition:transform 1.1s cubic-bezier(.65,0,.35,1),opacity .55s ease;transform-origin:50% 50%;'
    flowCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;'

    container.style.position = 'relative'
    container.style.overflow = 'hidden'
    container.style.background = 'radial-gradient(ellipse 80% 60% at 50% 8%,rgba(255,209,102,.10),transparent 60%),radial-gradient(ellipse 70% 50% at 50% 100%,rgba(255,106,0,.06),transparent 60%),#ffffff'
    container.appendChild(canvas)
    container.appendChild(flowCanvas)

    const ctx = canvas.getContext('2d')
    const octx = off.getContext('2d')
    const fctx = flowCanvas.getContext('2d')

    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let cssW = 0, cssH = 0, wScale = 1, offX = 0, offY = 0
    let animFrameId = null
    let destroyed = false

    function resize() {
      const rect = container.getBoundingClientRect()
      cssW = rect.width; cssH = rect.height
      if (!cssW || !cssH) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      ;[canvas, off, flowCanvas].forEach(c => {
        c.width = cssW * dpr; c.height = cssH * dpr
        c.style.width = cssW + 'px'; c.style.height = cssH + 'px'
      })
      ctx.setTransform(dpr,0,0,dpr,0,0)
      octx.setTransform(dpr,0,0,dpr,0,0)
      fctx.setTransform(dpr,0,0,dpr,0,0)
      const pad = 0.8
      wScale = Math.min(cssW/POLY_W, cssH/POLY_H) * pad
      offX = (cssW - POLY_W*wScale)/2
      offY = (cssH - POLY_H*wScale)/2 - cssH*0.015
      recomputeDotTargets()
    }

    function worldToScreen(wx, wy) { return { x: offX + wx*wScale, y: offY + wy*wScale } }

    // ── Dots ─────────────────────────────────────────────────────────────────
    let dots = []
    function buildDots() {
      dots = []
      const step = 6.2
      let id = 0
      for (let gx = 0; gx < POLY_W; gx += step) {
        for (let gy = 0; gy < POLY_H; gy += step) {
          const px = gx + Math.random()*step*0.85
          const py = gy + Math.random()*step*0.85
          if (pointInPoly(px, py, INDIA_POLY)) pushDot(px, py, id++)
        }
      }
      INDIA_ISLANDS.forEach(isl => {
        for (let k = 0; k < 14; k++) {
          const ang = Math.random()*Math.PI*2
          const r = Math.random()*7
          pushDot(isl[0]+Math.cos(ang)*r, isl[1]+Math.sin(ang)*r*1.8, id++)
        }
      })
    }
    function pushDot(px, py, id) {
      const c = PALETTE_RGB[(Math.random()*PALETTE_RGB.length)|0]
      dots.push({
        id, px, py, x:0, y:0, tx:0, ty:0, sx:0, sy:0,
        size: 1.0+Math.random()*1.9,
        baseAlpha: 0.45+Math.random()*0.5,
        color: c,
        phase: Math.random()*Math.PI*2,
        pulseSpeed: 0.6+Math.random()*0.5,
        startDelay: Math.random()*900,
        duration: 900+Math.random()*900,
        highlightUntil: 0,
        highlightStrength: 0,
      })
    }
    function recomputeDotTargets() {
      dots.forEach(d => { const p = worldToScreen(d.px,d.py); d.tx=p.x; d.ty=p.y })
    }
    function nearestDot(px, py) {
      let best=null, bd=Infinity
      for (const d of dots) {
        const dx=d.px-px, dy=d.py-py, dist=dx*dx+dy*dy
        if (dist<bd) { bd=dist; best=d }
      }
      return best
    }

    let neighborPairs = []
    function buildNeighborPairs() {
      neighborPairs = []
      const grid = new Map()
      const cell = 14
      dots.forEach((d,i) => {
        const key = ((d.px/cell)|0)+','+((d.py/cell)|0)
        if (!grid.has(key)) grid.set(key,[])
        grid.get(key).push(i)
      })
      dots.forEach((d,i) => {
        const cx=(d.px/cell)|0, cy=(d.py/cell)|0
        for (let ox=-1;ox<=1;ox++) for (let oy=-1;oy<=1;oy++) {
          const arr = grid.get((cx+ox)+','+(cy+oy))
          if (!arr) continue
          for (const j of arr) {
            if (j<=i) continue
            const dx=dots[j].px-d.px, dy=dots[j].py-d.py
            const dist = Math.sqrt(dx*dx+dy*dy)
            if (dist>0 && dist<11 && Math.random()<0.10) neighborPairs.push([i,j])
          }
        }
      })
    }

    // ── Animation state ───────────────────────────────────────────────────────
    let nowT = 0, startTime = performance.now()
    let phase = 'boot'
    let ripples = [], activeConns = [], nationalGlow = [], highlightedCities = []
    let ambientParticles = []

    function initAmbientParticles() {
      ambientParticles = []
      for (let i=0;i<70;i++) ambientParticles.push({
        x: Math.random()*cssW, y: Math.random()*cssH,
        vx: (Math.random()-.5)*.12, vy: (Math.random()-.5)*.12,
        size: 0.6+Math.random()*1.4, alpha: 0.08+Math.random()*0.18
      })
    }

    const easeOutCubic = t => 1-Math.pow(1-t,3)
    const lerp = (a,b,t) => a+(b-a)*t
    const clamp = (v,a,b) => Math.max(a,Math.min(b,v))
    const sleep = ms => new Promise(r => setTimeout(r, ms))

    // ── Draw ─────────────────────────────────────────────────────────────────
    function drawCurvedLine(x1,y1,x2,y2,color,width) {
      const mx=(x1+x2)/2, my=(y1+y2)/2
      const dx=x2-x1, dy=y2-y1
      const nx=-dy, ny=dx
      const len = Math.sqrt(nx*nx+ny*ny)||1
      const bend = Math.min(60, len*.16)
      const cx = mx+(nx/len)*bend*.35
      const cy = my+(ny/len)*bend*.35
      octx.beginPath()
      octx.moveTo(x1,y1)
      octx.quadraticCurveTo(cx,cy,x2,y2)
      octx.strokeStyle=color; octx.lineWidth=width; octx.stroke()
    }

    function drawFrame(t) {
      if (destroyed) return
      nowT = t
      octx.clearRect(0,0,cssW,cssH)

      if (phase==='assembling') {
        let allDone = true
        for (const d of dots) {
          const local = clamp((nowT-startTime-d.startDelay)/d.duration,0,1)
          if (local<1) allDone=false
          const e = easeOutCubic(local)
          d.x = lerp(d.sx,d.tx,e); d.y = lerp(d.sy,d.ty,e)
        }
        if (allDone) { phase='idle'; onAssembled() }
      } else {
        for (const d of dots) { d.x=d.tx; d.y=d.ty }
      }

      if ((phase==='idle'||phase.startsWith('busy')) && Math.random()<.045 && neighborPairs.length) {
        const pair = neighborPairs[(Math.random()*neighborPairs.length)|0]
        activeConns.push({i:pair[0],j:pair[1],t0:nowT,dur:1400+Math.random()*1200})
      }
      activeConns = activeConns.filter(c => nowT-c.t0 < c.dur)

      for (const nc of nationalGlow) {
        const a=dots[nc.i], b=dots[nc.j]
        drawCurvedLine(a.x,a.y,b.x,b.y,'rgba(255,138,66,0.16)',1)
      }
      for (const c of activeConns) {
        const a=dots[c.i], b=dots[c.j]
        const lt=(nowT-c.t0)/c.dur
        const fade=lt<.5?lt*2:(1-lt)*2
        drawCurvedLine(a.x,a.y,b.x,b.y,`rgba(255,140,60,${0.22*fade})`,1)
      }

      for (const d of dots) {
        let alpha=d.baseAlpha, extraSize=0
        if (phase!=='assembling') {
          const pulse = Math.sin(nowT/1000*d.pulseSpeed+d.phase)*.18+.9
          alpha *= pulse
        }
        if (d.highlightUntil>nowT) {
          const hl=(d.highlightUntil-nowT)/d.highlightStrength
          alpha=Math.min(1,alpha+hl*.9); extraSize=hl*1.6
        }
        const [r,g,b]=d.color
        octx.beginPath()
        octx.fillStyle=`rgba(${r},${g},${b},${clamp(alpha,0,1)})`
        octx.arc(d.x,d.y,d.size+extraSize,0,Math.PI*2)
        octx.fill()
      }

      for (const d of highlightedCities) {
        const grad = octx.createRadialGradient(d.x,d.y,0,d.x,d.y,26)
        grad.addColorStop(0,'rgba(255,106,0,0.45)')
        grad.addColorStop(1,'rgba(255,106,0,0)')
        octx.beginPath(); octx.fillStyle=grad
        octx.arc(d.x,d.y,26,0,Math.PI*2); octx.fill()
      }

      ripples = ripples.filter(rp => nowT-rp.t0 < rp.dur)
      for (const rp of ripples) {
        const lt=(nowT-rp.t0)/rp.dur
        const radius=lerp(4,90,easeOutCubic(lt))
        const alpha=(1-lt)*.55
        octx.beginPath(); octx.strokeStyle=`rgba(255,106,0,${alpha})`; octx.lineWidth=2
        octx.arc(rp.x,rp.y,radius,0,Math.PI*2); octx.stroke()
        octx.beginPath(); octx.strokeStyle=`rgba(255,180,90,${alpha*.7})`; octx.lineWidth=1.2
        octx.arc(rp.x,rp.y,radius*.6,0,Math.PI*2); octx.stroke()
      }

      for (const p of ambientParticles) {
        p.x+=p.vx; p.y+=p.vy
        if (p.x<0) p.x=cssW; if (p.x>cssW) p.x=0
        if (p.y<0) p.y=cssH; if (p.y>cssH) p.y=0
        octx.beginPath()
        octx.fillStyle=`rgba(255,170,90,${p.alpha})`
        octx.arc(p.x,p.y,p.size,0,Math.PI*2); octx.fill()
      }

      ctx.clearRect(0,0,cssW,cssH)
      ctx.save(); ctx.filter='blur(7px)'; ctx.globalAlpha=.55
      ctx.drawImage(off,0,0,cssW,cssH); ctx.restore()
      ctx.filter='none'; ctx.globalAlpha=1
      ctx.drawImage(off,0,0,cssW,cssH)

      animFrameId = requestAnimationFrame(drawFrame)
    }

    // ── Flow particles ────────────────────────────────────────────────────────
    function bezierPoint(x1,y1,x2,y2,t) {
      const mx=(x1+x2)/2, my=(y1+y2)/2-Math.abs(x2-x1)*.16
      const u=1-t
      return { x:u*u*x1+2*u*t*mx+t*t*x2, y:u*u*y1+2*u*t*my+t*t*y2 }
    }

    function runFlowBurst(fromRect, toRect, color, count) {
      return new Promise(resolve => {
        const heroRect = container.getBoundingClientRect()
        const x1=fromRect.left-heroRect.left+fromRect.width/2
        const y1=fromRect.top-heroRect.top+fromRect.height*.28
        const x2=toRect.left-heroRect.left+toRect.width/2
        const y2=toRect.top-heroRect.top+toRect.height*.28
        const [r,g,bl] = hexToRgb(color)
        const particles = []
        let spawned=0
        const timer = setInterval(()=>{
          if (spawned>=count) { clearInterval(timer); return }
          particles.push({t:0, speed:.011+Math.random()*.006, size:1.6+Math.random()*1.8, alpha:.85})
          spawned++
        },90)
        function frame() {
          fctx.clearRect(0,0,cssW,cssH)
          for (let i=particles.length-1;i>=0;i--) {
            const p=particles[i]; p.t+=p.speed
            if (p.t>=1) { particles.splice(i,1); continue }
            const pos=bezierPoint(x1,y1,x2,y2,p.t)
            const grad=fctx.createRadialGradient(pos.x,pos.y,0,pos.x,pos.y,p.size*4)
            grad.addColorStop(0,`rgba(${r},${g},${bl},${p.alpha})`)
            grad.addColorStop(1,`rgba(${r},${g},${bl},0)`)
            fctx.beginPath(); fctx.fillStyle=grad
            fctx.arc(pos.x,pos.y,p.size*4,0,Math.PI*2); fctx.fill()
            fctx.beginPath(); fctx.fillStyle=`rgba(${r},${g},${bl},${p.alpha})`
            fctx.arc(pos.x,pos.y,p.size,0,Math.PI*2); fctx.fill()
          }
          if (spawned<count||particles.length>0) requestAnimationFrame(frame)
          else { fctx.clearRect(0,0,cssW,cssH); resolve() }
        }
        requestAnimationFrame(frame)
      })
    }

    // ── Overlay UI elements ───────────────────────────────────────────────────
    const overlay = document.createElement('div')
    overlay.style.cssText='position:absolute;inset:0;pointer-events:none;z-index:5;'
    container.appendChild(overlay)

    function makeWidget(pos, labelText, valueId, staticValue) {
      const w = document.createElement('div')
      w.style.cssText=`position:absolute;background:rgba(255,255,255,0.88);backdrop-filter:blur(16px);border:1px solid rgba(255,138,66,0.28);border-radius:14px;box-shadow:0 16px 40px -18px rgba(255,106,0,.28);padding:10px 14px;opacity:0;transition:opacity .8s ease,transform .8s ease;font-family:inherit;transform:translateY(10px);z-index:5;${pos}`
      const lbl = document.createElement('div')
      lbl.style.cssText='color:#6b5a4f;font-weight:600;font-size:9px;letter-spacing:.04em;text-transform:uppercase;margin-bottom:3px;'
      lbl.textContent=labelText
      const val = document.createElement('div')
      val.style.cssText='font-weight:700;font-size:15px;color:#20140c;display:flex;align-items:center;gap:6px;'
      val.textContent=staticValue||''
      if (valueId) val.id=valueId
      w.appendChild(lbl); w.appendChild(val)
      overlay.appendChild(w)
      return w
    }

    const wTl = makeWidget('top:8%;left:4%;','Processed today','wTlVal','₹2,40,000')
    const wTr = makeWidget('top:10%;right:4%;','Weekly growth',null,'+18.4% ▲')
    const wBl = makeWidget('bottom:10%;left:5%;','Active businesses','wBlVal','3,240')
    const wBr = makeWidget('bottom:9%;right:5%;','Invoice #INV-4471',null,'Paid ✓')
    wTr.querySelector('div:last-child').style.color='#1a8a4a'
    wBr.querySelector('div:last-child').style.color='#1a8a4a'
    const allWidgets=[wTl,wTr,wBl,wBr]

    const wTlVal = container.querySelector('#wTlVal')
    const wBlVal = container.querySelector('#wBlVal')

    let txnTotal=240000, activeBiz=3240
    function formatINR(n){ return '₹'+Math.round(n).toLocaleString('en-IN') }
    function tickCounters(){
      txnTotal+=1400+Math.random()*2600; activeBiz+=(Math.random()<.4)?1:0
      if(wTlVal) wTlVal.textContent=formatINR(txnTotal)
      if(wBlVal) wBlVal.textContent=activeBiz.toLocaleString('en-IN')
    }
    const counterInterval = setInterval(tickCounters, 700)

    function showWidgets(){ allWidgets.forEach(w=>{ w.style.opacity='1'; w.style.transform='translateY(0)' }) }
    function hideWidgets(){ allWidgets.forEach(w=>{ w.style.opacity='0' }) }

    const caption = document.createElement('div')
    caption.style.cssText='position:absolute;bottom:18px;left:50%;transform:translateX(-50%);font-size:10px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#6b5a4f;opacity:0;transition:opacity 1s ease;pointer-events:none;white-space:nowrap;'
    caption.textContent='Live nationwide business network'
    overlay.appendChild(caption)

    // ── Transaction panel ─────────────────────────────────────────────────────
    const txnPanel = document.createElement('div')
    txnPanel.style.cssText='position:absolute;inset:0;z-index:8;display:flex;align-items:center;justify-content:center;gap:5%;opacity:0;pointer-events:none;transition:opacity .55s ease;padding:0 5%;'
    container.appendChild(txnPanel)

    function makeGlassCard() {
      const c = document.createElement('div')
      c.style.cssText='position:relative;z-index:2;background:linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.72));backdrop-filter:blur(18px);border:1px solid rgba(255,138,66,0.28);border-radius:18px;box-shadow:0 20px 60px -20px rgba(255,106,0,.35);padding:16px 18px;opacity:0;transform:scale(.9) translateY(8px);transition:opacity .5s cubic-bezier(.2,.8,.2,1),transform .5s cubic-bezier(.2,.8,.2,1);width:220px;flex-shrink:0;font-family:inherit;'
      return c
    }

    const cardOrigin = makeGlassCard()
    const cardDest = makeGlassCard()
    txnPanel.appendChild(cardOrigin)
    txnPanel.appendChild(cardDest)

    function buildCard(card, eyebrowText, iconSvg, iconGrad) {
      card.innerHTML=`
        <div style="font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#FF6A00;display:flex;align-items:center;gap:6px;margin-bottom:10px;">
          <span style="width:5px;height:5px;border-radius:50%;background:#FF6A00;display:inline-block;"></span>
          ${eyebrowText}
        </div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
          <div style="width:32px;height:32px;border-radius:9px;background:${iconGrad};display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 6px 16px -4px rgba(255,106,0,.5);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconSvg}</svg>
          </div>
          <div>
            <div class="cn" style="font-weight:700;font-size:13px;line-height:1.2;"></div>
            <div class="cs" style="font-size:10px;color:#6b5a4f;font-weight:500;"></div>
          </div>
        </div>
        <div class="ct" style="font-size:11.5px;color:#6b5a4f;font-weight:500;border-top:1px dashed rgba(255,138,66,0.3);margin-top:8px;padding-top:8px;">&nbsp;</div>
        <div class="ca" style="font-size:20px;font-weight:700;background:linear-gradient(135deg,#FF6A00,#FF8C42);-webkit-background-clip:text;background-clip:text;color:transparent;margin-top:2px;">&nbsp;</div>
      `
    }

    buildCard(cardOrigin,'Quote generated','<path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"/>','linear-gradient(135deg,#FF6A00,#FFA94D)')
    buildCard(cardDest,'Quote received','<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>','linear-gradient(135deg,#FFA94D,#FFD166)')

    const btnAccept = document.createElement('button')
    btnAccept.textContent='Accept quote'
    btnAccept.style.cssText='margin-top:12px;width:100%;border:none;padding:9px 14px;border-radius:10px;background:linear-gradient(135deg,#FF6A00,#FF8C42);color:#fff;font-family:inherit;font-weight:700;font-size:12px;cursor:pointer;box-shadow:0 10px 22px -8px rgba(255,106,0,.55);'
    cardDest.appendChild(btnAccept)

    const acceptedDiv = document.createElement('div')
    acceptedDiv.style.cssText='display:none;align-items:center;gap:8px;margin-top:12px;font-size:12px;font-weight:700;color:#1a8a4a;'
    acceptedDiv.innerHTML='<span style="width:18px;height:18px;border-radius:50%;background:#1a8a4a;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><svg width="10" height="10" viewBox="0 0 24 24"><path d="M4 12l5 5L20 6" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg></span>Accepted · payment initiated'
    cardDest.appendChild(acceptedDiv)

    const payChip = document.createElement('div')
    payChip.style.cssText='display:none;align-items:center;gap:8px;margin-top:12px;font-size:11px;font-weight:700;color:#1a8a4a;background:rgba(26,138,74,0.08);border:1px solid rgba(26,138,74,0.25);border-radius:10px;padding:8px 10px;'
    payChip.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1a8a4a" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>Payment received'
    cardOrigin.appendChild(payChip)

    const txnStatusEl = document.createElement('div')
    txnStatusEl.style.cssText='position:absolute;top:12%;left:50%;transform:translateX(-50%);font-size:9.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#FF6A00;opacity:0;transition:opacity .4s ease;z-index:2;display:flex;align-items:center;gap:7px;white-space:nowrap;'
    txnStatusEl.innerHTML='<span style="width:6px;height:6px;border-radius:50%;background:#FF6A00;box-shadow:0 0 8px #FF6A00;animation:blink 1.4s ease-in-out infinite;display:inline-block;"></span><span class="stxt">Generating quote</span>'
    txnPanel.appendChild(txnStatusEl)

    const styleEl = document.createElement('style')
    styleEl.textContent='@keyframes blink{0%,100%{opacity:1;}50%{opacity:.35;}}'
    document.head.appendChild(styleEl)

    function setStatus(txt) { txnStatusEl.querySelector('.stxt').textContent=txt }
    function showTxnPanel() { txnPanel.style.opacity='1'; txnPanel.style.pointerEvents='auto' }
    function hideTxnPanel() { txnPanel.style.opacity='0'; txnPanel.style.pointerEvents='none' }
    function showCard(c) { c.style.opacity='1'; c.style.transform='scale(1) translateY(0)' }
    function hideCard(c) { c.style.opacity='0'; c.style.transform='scale(.9) translateY(8px)' }

    async function typeText(el, text, speed) {
      el.innerHTML=''
      let out=''
      for (let i=0;i<text.length;i++) {
        out+=text[i]
        el.innerHTML=out+'<span style="display:inline-block;width:2px;height:11px;background:#FF6A00;margin-left:2px;vertical-align:middle;animation:blink .8s steps(1) infinite;"></span>'
        await sleep(speed)
      }
      el.innerHTML=out
    }

    async function flipOut() {
      setTimeout(()=>{ canvas.style.opacity='0' },520)
      canvas.style.transform='scale(0.94) rotateY(180deg)'; await sleep(1100)
    }
    async function flipIn() {
      setTimeout(()=>{ canvas.style.opacity='1' },520)
      canvas.style.transform='scale(1) rotateY(360deg)'; await sleep(1100)
      canvas.style.transition='none'; canvas.style.transform='scale(1) rotateY(0deg)'
      void canvas.offsetHeight
      canvas.style.transition='transform 1.1s cubic-bezier(.65,0,.35,1),opacity .55s ease'
    }

    function scatterStart(d) {
      const angle=Math.random()*Math.PI*2
      const radius=Math.max(cssW,cssH)*(.55+Math.random()*.5)
      d.sx=cssW/2+Math.cos(angle)*radius; d.sy=cssH/2+Math.sin(angle)*radius
    }
    function highlightDot(d,ms) { d.highlightUntil=nowT+ms; d.highlightStrength=ms }
    function ripplesAt(d) {
      ripples.push({x:d.x,y:d.y,t0:nowT,dur:900}); highlightDot(d,900)
      for (const other of dots) {
        const dx=other.px-d.px, dy=other.py-d.py
        if (Math.sqrt(dx*dx+dy*dy)<16) highlightDot(other,700)
      }
    }

    const cityDotCache = {}
    function cityDot(key) {
      if (cityDotCache[key]) return cityDotCache[key]
      const c=CITIES[key]; const d=nearestDot(c.x,c.y)
      cityDotCache[key]=d; return d
    }

    function addNationalConnections(n) {
      for (let k=0;k<n;k++) {
        const keys=Object.keys(CITIES)
        const a=cityDot(keys[(Math.random()*keys.length)|0])
        const b=cityDot(keys[(Math.random()*keys.length)|0])
        if (a&&b&&a!==b) {
          const ia=dots.indexOf(a), ib=dots.indexOf(b)
          if (ia>=0&&ib>=0) nationalGlow.push({i:ia,j:ib})
        }
      }
      if (nationalGlow.length>10) nationalGlow.splice(0,nationalGlow.length-10)
    }

    function waitForAcceptOrTimeout(ms) {
      return new Promise(resolve=>{
        let done=false
        const handler=()=>{ if(done)return; done=true; btnAccept.removeEventListener('click',handler); resolve(true) }
        btnAccept.addEventListener('click',handler)
        setTimeout(()=>{ if(!done){done=true;btnAccept.removeEventListener('click',handler);resolve(false)} },ms)
      })
    }

    async function runStory(originKey, destKey) {
      const originDot=cityDot(originKey), destDot=cityDot(destKey)
      if (!originDot||!destDot) return

      ripplesAt(originDot); await sleep(650); await flipOut()

      // Set card content
      cardOrigin.querySelector('.cn').textContent = CITIES[originKey]?.name || 'Hub'
      cardOrigin.querySelector('.cs').textContent = CITIES[originKey]?.name || ''
      cardDest.querySelector('.cn').textContent = CITIES[destKey]?.name || 'Hub'
      cardDest.querySelector('.cs').textContent = CITIES[destKey]?.name || ''
      cardDest.querySelector('.ct').textContent = 'Fabric supply · 500 units'
      cardDest.querySelector('.ca').textContent = '₹1,84,500'

      btnAccept.style.display='block'
      acceptedDiv.style.display='none'
      payChip.style.display='none'
      cardOrigin.querySelector('.ct').innerHTML='&nbsp;'
      cardOrigin.querySelector('.ca').innerHTML='&nbsp;'
      hideCard(cardDest)

      showTxnPanel()
      txnStatusEl.style.opacity='.85'
      setStatus('Generating quote')
      showCard(cardOrigin)
      await sleep(200)
      await typeText(cardOrigin.querySelector('.ct'),'Cotton fabric rolls · 500 units',22)
      cardOrigin.querySelector('.ca').textContent='₹1,84,500'
      await sleep(700)

      setStatus('Sending to '+CITIES[destKey].name)
      const oRect=cardOrigin.getBoundingClientRect(), dRect=cardDest.getBoundingClientRect()
      await runFlowBurst(oRect,dRect,'#FF6A00',22)
      showCard(cardDest)
      setStatus('Awaiting response')
      await sleep(1400)

      await waitForAcceptOrTimeout(2400)
      btnAccept.style.display='none'
      acceptedDiv.style.display='flex'
      setStatus('Quote accepted')
      await sleep(900)

      setStatus('Processing payment')
      const oRect2=cardOrigin.getBoundingClientRect(), dRect2=cardDest.getBoundingClientRect()
      await runFlowBurst(dRect2,oRect2,'#FFA94D',22)
      payChip.style.display='flex'
      setStatus('Payment complete')
      await sleep(1300)

      hideTxnPanel(); await sleep(500); await flipIn()
      highlightedCities.push(originDot,destDot)
      addNationalConnections(6)
      highlightDot(originDot,3000); highlightDot(destDot,3000)
      await sleep(2600)
    }

    function onAssembled() {
      buildNeighborPairs()
      caption.style.opacity='.55'
      sleep(1200).then(()=>autoLoop())
    }

    let routeIdx=0, loopRunning=false
    async function autoLoop() {
      if (loopRunning) return
      loopRunning=true
      while (!destroyed) {
        const [oKey,dKey]=ROUTES[routeIdx%ROUTES.length]; routeIdx++
        await runStory(oKey,dKey)
        showWidgets()
        await sleep(5000)
      }
    }

    // ── Boot ─────────────────────────────────────────────────────────────────
    resize()
    buildDots()
    recomputeDotTargets()
    dots.forEach(scatterStart)
    initAmbientParticles()
    phase='assembling'
    startTime=performance.now()
    animFrameId=requestAnimationFrame(drawFrame)

    const resizeObserver = new ResizeObserver(()=>{ resize() })
    resizeObserver.observe(container)

    return () => {
      destroyed=true
      if (animFrameId) cancelAnimationFrame(animFrameId)
      clearInterval(counterInterval)
      resizeObserver.disconnect()
      styleEl.remove()
      while (container.firstChild) container.removeChild(container.firstChild)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-lg overflow-hidden"
      style={{ minHeight: '320px', cursor: 'pointer' }}
    />
  )
}