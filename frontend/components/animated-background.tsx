"use client"

import { useEffect, useRef } from "react"

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!
    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight

    let stars:any[] = [], shooting:any[] = [], nebulae:any[] = [], particles:any[] = [], confetti:any[] = []
    let time = 0

    const init = () => {
      stars = []; nebulae = []; particles = []
      for(let i=0;i<6;i++) nebulae.push({x:Math.random()*w, y:Math.random()*h, r:300+Math.random()*200, rot:0})
      const n = Math.floor(w*h/1300)
      for(let i=0;i<n;i++) stars.push({x:Math.random()*w, y:Math.random()*h, s:Math.random()*2.5+0.5, o:Math.random()*0.7+0.3, t:Math.random()*6})
      for(let i=0;i<50;i++) particles.push({x:Math.random()*w, y:Math.random()*h, vx:(Math.random()-0.5)*0.3, vy:(Math.random()-0.5)*0.3})
    }

    const burst = (x:number,y:number) => {
      for(let i=0;i<180;i++){
        confetti.push({x,y, vx:(Math.random()-0.5)*14, vy:(Math.random()-0.9)*16, g:0.35, life:110, c:`hsl(${Math.random()*360},100%,65%)`, s:Math.random()*4+2})
      }
    }

    const resize = ()=>{ w=canvas.width=innerWidth; h=canvas.height=innerHeight; init() }
    window.addEventListener('resize', resize)
    window.addEventListener('click', e=>burst(e.clientX,e.clientY))
    window.addEventListener('confetti', (e:any)=>burst(e.detail?.x||w/2, e.detail?.y||h/2))

    const loop = () => {
      time+=0.016
      ctx.fillStyle='#050308'; ctx.fillRect(0,0,w,h)

      // nebulosas
      nebulae.forEach(n=>{ n.rot+=0.0002; ctx.save(); ctx.translate(n.x,n.y); ctx.rotate(n.rot); const g=ctx.createRadialGradient(0,0,0,0,0,n.r); g.addColorStop(0,'rgba(168,85,247,0.25)'); g.addColorStop(1,'rgba(168,85,247,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,0,n.r,0,7); ctx.fill(); ctx.restore() })

      // estrelas
      stars.forEach(s=>{ s.t+=0.02; ctx.globalAlpha=s.o*(0.6+Math.sin(s.t)*0.4); ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(s.x,s.y,s.s,0,7); ctx.fill() }); ctx.globalAlpha=1

      // cometas
      if(Math.random()<0.02 && shooting.length<5) shooting.push({x:-50,y:Math.random()*h*0.5, vx:10+Math.random()*5, vy:3, life:1})
      shooting = shooting.filter(c=>{ c.x+=c.vx; c.y+=c.vy; c.life-=0.007; ctx.strokeStyle=`rgba(255,255,255,${c.life})`; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(c.x,c.y); ctx.lineTo(c.x-100,c.y-30); ctx.stroke(); return c.life>0 })

      // confetti
      confetti = confetti.filter(p=>{ p.vy+=p.g; p.x+=p.vx; p.y+=p.vy; p.life--; ctx.fillStyle=p.c; ctx.fillRect(p.x,p.y,p.s,p.s); return p.life>0 })

      requestAnimationFrame(loop)
    }
    init(); loop()
    return ()=>{ window.removeEventListener('resize',resize) }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />
}