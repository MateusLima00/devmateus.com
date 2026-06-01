/**
 * UniversoCanvas — Fundo 3D do universo com Three.js
 *
 * Cena completa:
 *   • 3 camadas de estrelas + Via Láctea densa
 *   • 4 nebulosas com sub-nuvens deslocadas + filamentos Bezier 3D
 *   • 8 galáxias distantes com braços espirais
 *   • Sol com corona, protuberâncias e vento solar
 *   • 4 planetas com texturas procedurais de alta resolução
 *   • 600 asteroides com geometria fBm + crateras reais
 *   • 40 asteroides viajantes com cauda de fogo colorida
 *   • Buraco negro com disco, halo, jets e espiral
 *   • Scroll parallax por camada + mouse parallax
 */

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ════════════════════════════════════════════════════════
//  TEXTURAS CANVAS
// ════════════════════════════════════════════════════════

function criarSprite(corCentro = '#ffffff', tamanho = 64) {
  const c = document.createElement('canvas')
  c.width = tamanho; c.height = tamanho
  const ctx = c.getContext('2d'), cx = tamanho / 2
  const g = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx)
  g.addColorStop(0, corCentro); g.addColorStop(0.1, corCentro)
  g.addColorStop(0.4, 'rgba(180,200,255,0.3)'); g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g; ctx.fillRect(0, 0, tamanho, tamanho)
  return new THREE.CanvasTexture(c)
}

function criarTexturaChama() {
  const c = document.createElement('canvas')
  c.width = 32; c.height = 64
  const ctx = c.getContext('2d')
  const g = ctx.createLinearGradient(16, 64, 16, 0)
  g.addColorStop(0, 'rgba(255,220,100,0.9)'); g.addColorStop(0.5, 'rgba(255,150,50,0.6)')
  g.addColorStop(1, 'rgba(255,80,0,0)')
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(16, 48, 6, 16, 0, 0, Math.PI*2); ctx.fill()
  return new THREE.CanvasTexture(c)
}

function criarTexturaCauda(cor1, cor2) {
  const c = document.createElement('canvas')
  c.width = 8; c.height = 64
  const ctx = c.getContext('2d')
  const g = ctx.createLinearGradient(4, 0, 4, 64)
  g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(0.08, cor1)
  g.addColorStop(0.4, cor2 + 'aa'); g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g; ctx.fillRect(0, 0, 8, 64)
  return new THREE.CanvasTexture(c)
}

/** Textura de partícula nebulosa — elipse assimétrica com fade suave */
function criarTexturaNebulosaSuave() {
  const s = 128
  const c = document.createElement('canvas')
  c.width = s; c.height = s
  const ctx = c.getContext('2d')
  const rx = s*(0.28+Math.random()*0.18), ry = s*(0.18+Math.random()*0.14)
  const rot = Math.random()*Math.PI
  const cx = s/2+(Math.random()-0.5)*s*0.08, cy = s/2+(Math.random()-0.5)*s*0.08
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot)
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(rx,ry))
  g.addColorStop(0,    'rgba(255,255,255,0.9)')
  g.addColorStop(0.15, 'rgba(255,255,255,0.5)')
  g.addColorStop(0.4,  'rgba(255,255,255,0.15)')
  g.addColorStop(0.75, 'rgba(255,255,255,0.04)')
  g.addColorStop(1,    'rgba(0,0,0,0)')
  ctx.scale(rx/Math.max(rx,ry), ry/Math.max(rx,ry))
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, Math.max(rx,ry), 0, Math.PI*2); ctx.fill()
  ctx.restore()
  return new THREE.CanvasTexture(c)
}

/** Textura de planeta — alta resolução por tipo */
function criarTexturaPlaneta(tipo) {
  const size = 1024
  const c = document.createElement('canvas')
  c.width = size; c.height = size
  const ctx = c.getContext('2d')

  if (tipo === 'jupiter') {
    ctx.fillStyle = '#c87832'; ctx.fillRect(0, 0, size, size)
    const faixas = ['#e8a040','#c06820','#f0b860','#a04810','#d89050','#b05828','#e8c878','#884010','#d07838','#c86028','#f0a848','#985020','#e09058','#b86030','#f8d088','#7a3808']
    faixas.forEach((cor, i) => {
      const y=(i/faixas.length)*size, h=size/faixas.length*1.1
      ctx.fillStyle=cor; ctx.globalAlpha=0.7+Math.random()*0.3
      ctx.beginPath(); ctx.moveTo(0,y)
      for(let x=0;x<=size;x+=8) ctx.lineTo(x, y+Math.sin(x*0.015+i*1.3)*12+Math.sin(x*0.008+i*0.7)*18)
      ctx.lineTo(size,y+h); ctx.lineTo(0,y+h); ctx.closePath(); ctx.fill()
    })
    ctx.globalAlpha=1
    const mg=ctx.createRadialGradient(size*0.35,size*0.55,0,size*0.35,size*0.55,size*0.1)
    mg.addColorStop(0,'#cc2200'); mg.addColorStop(0.4,'#aa1800'); mg.addColorStop(0.7,'#882200'); mg.addColorStop(1,'transparent')
    ctx.fillStyle=mg; ctx.beginPath(); ctx.ellipse(size*0.35,size*0.55,size*0.1,size*0.06,0.2,0,Math.PI*2); ctx.fill()
    for(let m=0;m<12;m++){const mx=Math.random()*size,my=Math.random()*size,mr=size*(0.01+Math.random()*0.025);const sm=ctx.createRadialGradient(mx,my,0,mx,my,mr);sm.addColorStop(0,'#662200');sm.addColorStop(1,'transparent');ctx.fillStyle=sm;ctx.globalAlpha=0.5+Math.random()*0.4;ctx.beginPath();ctx.ellipse(mx,my,mr,mr*0.5,Math.random()*Math.PI,0,Math.PI*2);ctx.fill()}
  }
  if (tipo === 'netuno') {
    ctx.fillStyle='#1428e8'; ctx.fillRect(0,0,size,size)
    const coresNep=['#2244ff','#0a1aff','#3366ff','#0818cc','#4488ff','#1030dd']
    coresNep.forEach((cor,i)=>{
      const y=(i/6)*size; ctx.fillStyle=cor; ctx.globalAlpha=0.5; ctx.beginPath(); ctx.moveTo(0,y)
      for(let x=0;x<=size;x+=6) ctx.lineTo(x,y+Math.sin(x*0.02+i*2)*20+Math.cos(x*0.01+i)*30)
      ctx.lineTo(size,y+size/6); ctx.lineTo(0,y+size/6); ctx.closePath(); ctx.fill()
    })
    ctx.globalAlpha=0.85; const mn=ctx.createRadialGradient(size*0.6,size*0.4,0,size*0.6,size*0.4,size*0.09)
    mn.addColorStop(0,'#000833'); mn.addColorStop(0.5,'#001066'); mn.addColorStop(1,'transparent')
    ctx.fillStyle=mn; ctx.beginPath(); ctx.ellipse(size*0.6,size*0.4,size*0.09,size*0.055,0.3,0,Math.PI*2); ctx.fill()
    for(let n=0;n<20;n++){const nx=Math.random()*size,ny=Math.random()*size,nr=size*(0.008+Math.random()*0.02);const ng=ctx.createRadialGradient(nx,ny,0,nx,ny,nr);ng.addColorStop(0,'rgba(180,210,255,0.9)');ng.addColorStop(1,'transparent');ctx.fillStyle=ng;ctx.globalAlpha=0.7;ctx.beginPath();ctx.ellipse(nx,ny,nr*2.5,nr*0.6,Math.random()*Math.PI,0,Math.PI*2);ctx.fill()}
  }
  if (tipo === 'saturno') {
    ctx.fillStyle='#d4a844'; ctx.fillRect(0,0,size,size);
    ['#e8c060','#c89030','#f0d070','#b07820','#e0b050','#c8a040'].forEach((cor,i)=>{
      const y=(i/6)*size; ctx.fillStyle=cor; ctx.globalAlpha=0.6; ctx.beginPath(); ctx.moveTo(0,y)
      for(let x=0;x<=size;x+=10) ctx.lineTo(x,y+Math.sin(x*0.01+i*1.5)*8+Math.sin(x*0.025+i)*15)
      ctx.lineTo(size,y+size/6*1.1); ctx.lineTo(0,y+size/6*1.1); ctx.closePath(); ctx.fill()
    })
    ctx.globalAlpha=0.4; ctx.strokeStyle='#aa8822'; ctx.lineWidth=size*0.008
    ctx.beginPath(); for(let h=0;h<6;h++){const ang=(h/6)*Math.PI*2-Math.PI/2;const hx=size*0.5+Math.cos(ang)*size*0.07,hy=size*0.08+Math.sin(ang)*size*0.035;h===0?ctx.moveTo(hx,hy):ctx.lineTo(hx,hy)} ctx.closePath(); ctx.stroke()
  }
  if (tipo === 'exoplaneta') {
    ctx.fillStyle='#5500aa'; ctx.fillRect(0,0,size,size)
    for(let v=0;v<35;v++){const vx=Math.random()*size,vy=Math.random()*size,vr=size*(0.015+Math.random()*0.045);const vg=ctx.createRadialGradient(vx,vy,0,vx,vy,vr);vg.addColorStop(0,'rgba(255,120,0,0.9)');vg.addColorStop(0.3,'rgba(200,40,0,0.6)');vg.addColorStop(1,'transparent');ctx.fillStyle=vg;ctx.globalAlpha=0.6+Math.random()*0.4;ctx.beginPath();ctx.arc(vx,vy,vr,0,Math.PI*2);ctx.fill()}
    ['#440088','#660099','#330077','#7700aa','#220066'].forEach((cor,i)=>{ctx.fillStyle=cor;ctx.globalAlpha=0.4;ctx.fillRect(0,(i/5)*size,size,size/5)})
    const capN=ctx.createRadialGradient(size*0.5,0,0,size*0.5,0,size*0.2); capN.addColorStop(0,'rgba(220,180,255,0.8)'); capN.addColorStop(1,'transparent'); ctx.fillStyle=capN; ctx.globalAlpha=0.7; ctx.fillRect(0,0,size,size*0.18)
  }
  ctx.globalAlpha=1
  return new THREE.CanvasTexture(c)
}

// ════════════════════════════════════════════════════════
//  POSIÇÕES
// ════════════════════════════════════════════════════════

function posicaoEsferica(raio) {
  const u=Math.random(),v=Math.random(),theta=2*Math.PI*u,phi=Math.acos(2*v-1)
  return new THREE.Vector3(raio*Math.sin(phi)*Math.cos(theta),raio*Math.sin(phi)*Math.sin(theta),raio*Math.cos(phi))
}
function posicaoViaLactea() {
  const angle=Math.random()*Math.PI*2,raio=100+Math.random()*600
  return new THREE.Vector3(Math.cos(angle)*raio,(Math.random()-0.5)*30*(1-raio/800),Math.sin(angle)*raio)
}

// ════════════════════════════════════════════════════════
//  ESTRELAS E VIA LÁCTEA
// ════════════════════════════════════════════════════════

function criarCamadaEstrelas(qtd,raio,sMin,sMax,opacity) {
  const COR=['#e8eeff','#aac8ff','#fff5e0','#ffddaa']
  const geo=new THREE.BufferGeometry(),pos=new Float32Array(qtd*3),cols=new Float32Array(qtd*3)
  for(let i=0;i<qtd;i++){const p=posicaoEsferica(raio*(0.5+Math.random()*0.5));pos[i*3]=p.x;pos[i*3+1]=p.y;pos[i*3+2]=p.z;const cor=new THREE.Color(COR[Math.floor(Math.random()*COR.length)]);cols[i*3]=cor.r;cols[i*3+1]=cor.g;cols[i*3+2]=cor.b}
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3)); geo.setAttribute('color',new THREE.BufferAttribute(cols,3))
  return new THREE.Points(geo,new THREE.PointsMaterial({size:sMin+(sMax-sMin)*0.5,sizeAttenuation:true,transparent:true,opacity,vertexColors:true,map:criarSprite('#ffffff'),alphaTest:0.01,blending:THREE.AdditiveBlending,depthWrite:false}))
}

function criarViaLactea() {
  const grupo=new THREE.Group()
  const geo=new THREE.BufferGeometry(),pos=new Float32Array(18000*3)
  for(let i=0;i<18000;i++){const p=posicaoViaLactea();pos[i*3]=p.x;pos[i*3+1]=p.y;pos[i*3+2]=p.z}
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3))
  grupo.add(new THREE.Points(geo,new THREE.PointsMaterial({size:0.07,sizeAttenuation:true,transparent:true,opacity:0.55,color:0xdce6ff,blending:THREE.AdditiveBlending,depthWrite:false})))
  const cGeo=new THREE.BufferGeometry(),cPos=new Float32Array(4000*3)
  for(let i=0;i<4000;i++){const a=Math.random()*Math.PI*2,r=Math.random()*120;cPos[i*3]=Math.cos(a)*r;cPos[i*3+1]=(Math.random()-0.5)*10*(1-r/120);cPos[i*3+2]=Math.sin(a)*r}
  cGeo.setAttribute('position',new THREE.BufferAttribute(cPos,3))
  grupo.add(new THREE.Points(cGeo,new THREE.PointsMaterial({size:0.1,sizeAttenuation:true,transparent:true,opacity:0.7,color:0xfff0cc,blending:THREE.AdditiveBlending,depthWrite:false})))
  const hGeo=new THREE.BufferGeometry(),hPos=new Float32Array(5000*3)
  for(let i=0;i<5000;i++){const a=Math.random()*Math.PI*2,r=200+Math.random()*400;hPos[i*3]=Math.cos(a)*r;hPos[i*3+1]=(Math.random()-0.5)*60;hPos[i*3+2]=Math.sin(a)*r}
  hGeo.setAttribute('position',new THREE.BufferAttribute(hPos,3))
  grupo.add(new THREE.Points(hGeo,new THREE.PointsMaterial({size:0.05,sizeAttenuation:true,transparent:true,opacity:0.25,color:0xaabbee,blending:THREE.AdditiveBlending,depthWrite:false})))
  grupo.rotation.z=Math.PI*0.15; return grupo
}

// ════════════════════════════════════════════════════════
//  NEBULOSAS — sub-nuvens + filamentos Bezier 3D
// ════════════════════════════════════════════════════════

function reconstruirNebulosaCompleta(grupo, { cor1, cor2, cor3, spread }) {
  while (grupo.children.length > 0) {
    const child = grupo.children[0]
    child.geometry?.dispose(); child.material?.dispose(); grupo.remove(child)
  }

  // Sub-nuvens em posições deslocadas — forma orgânica real
  const subNuvens = [
    { ox:0,            oy:0,            oz:0,            raio:spread*0.4, qty:1200, size:6,  op:0.22, cor:cor1 },
    { ox:spread*0.35,  oy:spread*0.1,   oz:-spread*0.2,  raio:spread*0.3, qty:900,  size:8,  op:0.16, cor:cor2 },
    { ox:-spread*0.3,  oy:spread*0.2,   oz:spread*0.15,  raio:spread*0.35,qty:900,  size:9,  op:0.15, cor:cor1 },
    { ox:spread*0.15,  oy:-spread*0.3,  oz:spread*0.25,  raio:spread*0.25,qty:700,  size:10, op:0.12, cor:cor2 },
    { ox:-spread*0.25, oy:-spread*0.15, oz:-spread*0.3,  raio:spread*0.3, qty:700,  size:11, op:0.11, cor:cor3 },
    { ox:0,            oy:0,            oz:0,            raio:spread*0.9, qty:600,  size:22, op:0.05, cor:cor3 },
    { ox:spread*0.2,   oy:spread*0.3,   oz:-spread*0.1,  raio:spread*0.5, qty:500,  size:16, op:0.07, cor:cor2 },
    { ox:-spread*0.4,  oy:-spread*0.1,  oz:spread*0.35,  raio:spread*0.45,qty:500,  size:14, op:0.08, cor:cor3 },
  ]

  subNuvens.forEach(nv => {
    const positions=[], colors=[], sigma=nv.raio*0.38
    for(let i=0;i<nv.qty;i++){
      const u=Math.max(1e-6,Math.random()),v=Math.random()
      const g1=Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)
      const g2=Math.sqrt(-2*Math.log(u))*Math.sin(2*Math.PI*v)
      const g3=Math.sqrt(-2*Math.log(Math.max(1e-6,Math.random())))*Math.cos(2*Math.PI*Math.random())
      positions.push(nv.ox+g1*sigma, nv.oy+g2*sigma*0.35, nv.oz+g3*sigma)
      const col=new THREE.Color(nv.cor); col.offsetHSL((Math.random()-0.5)*0.06,(Math.random()-0.5)*0.15,(Math.random()-0.5)*0.12)
      colors.push(col.r,col.g,col.b)
    }
    const geo=new THREE.BufferGeometry()
    geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3))
    geo.setAttribute('color',   new THREE.Float32BufferAttribute(colors,3))
    const mat=new THREE.PointsMaterial({size:nv.size,vertexColors:true,transparent:true,opacity:nv.op,map:criarTexturaNebulosaSuave(),sizeAttenuation:true,blending:THREE.AdditiveBlending,depthWrite:false})
    mat.userData={opBase:nv.op}; grupo.add(new THREE.Points(geo,mat))
  })

  // Filamentos 3D — curvas Bezier de gás
  const c0col=new THREE.Color(cor1), c1col=new THREE.Color(cor3)
  for(let f=0;f<22;f++){
    const angBase=(f/22)*Math.PI*2, dist=spread*(0.08+Math.random()*0.55)
    const p0=new THREE.Vector3(Math.cos(angBase)*spread*0.08,(Math.random()-0.5)*spread*0.1,Math.sin(angBase)*spread*0.08)
    const cp=new THREE.Vector3(Math.cos(angBase+0.4)*dist*0.5+(Math.random()-0.5)*spread*0.2,(Math.random()-0.5)*spread*0.25,Math.sin(angBase+0.4)*dist*0.5+(Math.random()-0.5)*spread*0.2)
    const p1=new THREE.Vector3(Math.cos(angBase+(Math.random()-0.5)*0.8)*dist,(Math.random()-0.5)*spread*0.3,Math.sin(angBase+(Math.random()-0.5)*0.8)*dist)
    const pts=[]; const nPts=24
    for(let t=0;t<=1;t+=1/nPts){const mt=1-t;pts.push(new THREE.Vector3(mt*mt*p0.x+2*mt*t*cp.x+t*t*p1.x,mt*mt*p0.y+2*mt*t*cp.y+t*t*p1.y,mt*mt*p0.z+2*mt*t*cp.z+t*t*p1.z))}
    const filColors=[]
    pts.forEach((_,ti)=>{const tc=ti/pts.length;const cf=new THREE.Color().lerpColors(c0col,c1col,tc);filColors.push(cf.r,cf.g,cf.b)})
    const geo=new THREE.BufferGeometry().setFromPoints(pts)
    geo.setAttribute('color',new THREE.Float32BufferAttribute(filColors,3))
    grupo.add(new THREE.Line(geo,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:0.12+Math.random()*0.18,blending:THREE.AdditiveBlending,depthWrite:false})))
  }

  // Estrelas jovens embutidas
  const posEst=[],corEst=[]
  for(let e=0;e<80;e++){
    const r=spread*Math.random()*0.6,t=Math.random()*Math.PI*2,p=Math.random()*Math.PI
    posEst.push(r*Math.sin(p)*Math.cos(t),r*Math.cos(p)*0.3,r*Math.sin(p)*Math.sin(t))
    const ec=new THREE.Color('#ffffff').lerp(new THREE.Color(cor1),Math.random()*0.3); corEst.push(ec.r,ec.g,ec.b)
  }
  const geoEst=new THREE.BufferGeometry()
  geoEst.setAttribute('position',new THREE.Float32BufferAttribute(posEst,3))
  geoEst.setAttribute('color',   new THREE.Float32BufferAttribute(corEst,3))
  grupo.add(new THREE.Points(geoEst,new THREE.PointsMaterial({size:1.8,vertexColors:true,transparent:true,opacity:0.95,map:criarSprite('#ffffff',32),sizeAttenuation:true,blending:THREE.AdditiveBlending,depthWrite:false})))
}

// ════════════════════════════════════════════════════════
//  GALÁXIAS
// ════════════════════════════════════════════════════════

function criarGalaxia({ posicao, raio, quantidade, inclinacao, angulo, corNucleo, corBraco }) {
  const grupo=new THREE.Group()
  const nPos=[]
  for(let i=0;i<quantidade*0.3;i++){const r=Math.random()*raio*0.2,t=Math.random()*Math.PI*2,p=(Math.random()-0.5)*0.4;nPos.push(r*Math.cos(t),r*Math.sin(p)*0.3,r*Math.sin(t))}
  const nGeo=new THREE.BufferGeometry(); nGeo.setAttribute('position',new THREE.Float32BufferAttribute(nPos,3))
  grupo.add(new THREE.Points(nGeo,new THREE.PointsMaterial({size:0.12,color:new THREE.Color(corNucleo),transparent:true,opacity:0.9,map:criarSprite(corNucleo),sizeAttenuation:true,blending:THREE.AdditiveBlending,depthWrite:false})))
  for(let braco=0;braco<2;braco++){
    const bPos=[],bCols=[],N=Math.floor(quantidade*0.35)
    for(let i=0;i<N;i++){const t=i/N,ae=t*Math.PI*4+braco*Math.PI,r=raio*0.15+t*raio*0.85,e=(Math.random()-0.5)*raio*0.12*(1+t);bPos.push((r+e)*Math.cos(ae),(Math.random()-0.5)*raio*0.04,(r+e)*Math.sin(ae));const cor=new THREE.Color().lerpColors(new THREE.Color(corNucleo),new THREE.Color(corBraco),t);bCols.push(cor.r,cor.g,cor.b)}
    const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.Float32BufferAttribute(bPos,3)); geo.setAttribute('color',new THREE.Float32BufferAttribute(bCols,3))
    grupo.add(new THREE.Points(geo,new THREE.PointsMaterial({size:0.08,vertexColors:true,transparent:true,opacity:0.75,map:criarSprite('#ffffff'),sizeAttenuation:true,blending:THREE.AdditiveBlending,depthWrite:false})))
  }
  const hPos=[]; for(let i=0;i<quantidade*0.05;i++){const r=raio*(0.6+Math.random()*0.6),t=Math.random()*Math.PI*2,p=(Math.random()-0.5)*0.8;hPos.push(r*Math.cos(t),r*Math.sin(p)*0.3,r*Math.sin(t))}
  const hGeo=new THREE.BufferGeometry(); hGeo.setAttribute('position',new THREE.Float32BufferAttribute(hPos,3))
  grupo.add(new THREE.Points(hGeo,new THREE.PointsMaterial({size:0.15,color:new THREE.Color(corBraco),transparent:true,opacity:0.3,blending:THREE.AdditiveBlending,depthWrite:false})))
  grupo.rotation.x=inclinacao; grupo.rotation.z=angulo; grupo.position.set(...posicao); return grupo
}

// ════════════════════════════════════════════════════════
//  ASTEROIDES — fBm noise + crateras
// ════════════════════════════════════════════════════════

function hash(n) { return Math.abs(Math.sin(n)*43758.5453) % 1 }

function noise3(x, y, z) {
  const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z)
  const fx=x-ix,fy=y-iy,fz=z-iz
  const ux=fx*fx*fx*(fx*(fx*6-15)+10), uy=fy*fy*fy*(fy*(fy*6-15)+10), uz=fz*fz*fz*(fz*(fz*6-15)+10)
  const n000=hash(ix+iy*57+iz*131),     n100=hash(ix+1+iy*57+iz*131)
  const n010=hash(ix+(iy+1)*57+iz*131), n110=hash(ix+1+(iy+1)*57+iz*131)
  const n001=hash(ix+iy*57+(iz+1)*131), n101=hash(ix+1+iy*57+(iz+1)*131)
  const n011=hash(ix+(iy+1)*57+(iz+1)*131), n111=hash(ix+1+(iy+1)*57+(iz+1)*131)
  return n000*(1-ux)*(1-uy)*(1-uz)+n100*ux*(1-uy)*(1-uz)+n010*(1-ux)*uy*(1-uz)+n110*ux*uy*(1-uz)+n001*(1-ux)*(1-uy)*uz+n101*ux*(1-uy)*uz+n011*(1-ux)*uy*uz+n111*ux*uy*uz
}

function fbm(x, y, z, oitavas=5) {
  let valor=0, amplitude=0.5, frequencia=1, max=0
  for(let i=0;i<oitavas;i++){valor+=noise3(x*frequencia,y*frequencia,z*frequencia)*amplitude;max+=amplitude;amplitude*=0.5;frequencia*=2.1}
  return valor/max
}

function criarGeometriaAsteroide(raioBase, semente=Math.random()*1000) {
  const geo=new THREE.SphereGeometry(raioBase,14,10)
  const pos=geo.attributes.position
  const escalaX=0.45+Math.random()*0.85, escalaY=0.35+Math.random()*0.65, escalaZ=0.55+Math.random()*0.90
  for(let i=0;i<pos.count;i++){
    let x=pos.getX(i)*escalaX, y=pos.getY(i)*escalaY, z=pos.getZ(i)*escalaZ
    const len=Math.sqrt(x*x+y*y+z*z)+1e-9
    const nx=x/len,ny=y/len,nz=z/len
    const n=fbm(nx*2.8+semente, ny*2.8+semente*0.7, nz*2.8+semente*1.3, 6)
    const d=0.65+n*0.8; pos.setXYZ(i,x*d,y*d,z*d)
  }
  // Crateras
  const numCrateras=2+Math.floor(Math.random()*5)
  for(let c=0;c<numCrateras;c++){
    const theta=Math.random()*Math.PI*2, phi=Math.random()*Math.PI
    const cx=Math.sin(phi)*Math.cos(theta), cy=Math.cos(phi), cz=Math.sin(phi)*Math.sin(theta)
    const raioImpacto=0.2+Math.random()*0.45, profundidade=0.15+Math.random()*0.3
    for(let i=0;i<pos.count;i++){
      const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i)
      const len=Math.sqrt(x*x+y*y+z*z)+1e-9
      const dot=x/len*cx+y/len*cy+z/len*cz
      const dist=Math.acos(Math.max(-1,Math.min(1,dot)))
      if(dist<raioImpacto){const t=dist/raioImpacto,perfil=Math.pow(t,2)*2-profundidade*(1-Math.pow(t,2)),escala=1+perfil*0.3;pos.setXYZ(i,x*escala,y*escala,z*escala)}
    }
  }
  pos.needsUpdate=true; geo.computeVertexNormals(); return geo
}

function criarMaterialAsteroide(tipo) {
  if(tipo==='C') return new THREE.MeshStandardMaterial({color:new THREE.Color(0x1a1a16),roughness:0.97,metalness:0.02,emissive:new THREE.Color(0x030302),emissiveIntensity:0.08})
  if(tipo==='S') return new THREE.MeshStandardMaterial({color:new THREE.Color(0x3d2a18),roughness:0.90,metalness:0.06,emissive:new THREE.Color(0x0a0602),emissiveIntensity:0.12})
  if(tipo==='M') return new THREE.MeshStandardMaterial({color:new THREE.Color(0x4a4a44),roughness:0.55,metalness:0.70,emissive:new THREE.Color(0x080808),emissiveIntensity:0.05})
  return new THREE.MeshStandardMaterial({color:new THREE.Color(0x2a1a14),roughness:0.93,metalness:0.03,emissive:new THREE.Color(0x120402),emissiveIntensity:0.18})
}

// ════════════════════════════════════════════════════════
//  BURACO NEGRO
// ════════════════════════════════════════════════════════

function criarBuracoNegro() {
  const grupo=new THREE.Group(); grupo.position.set(0,-50,-450)
  grupo.add(new THREE.Mesh(new THREE.SphereGeometry(4,32,32),new THREE.MeshBasicMaterial({color:0x000000})))
  const cfgs=[{i:5,o:7,cor:0xff8800,op:0.9},{i:7,o:9,cor:0xff4400,op:0.7},{i:9,o:12,cor:0xcc2200,op:0.5},{i:12,o:16,cor:0x661100,op:0.3},{i:16,o:22,cor:0x330800,op:0.15}]
  const aneis=cfgs.map(({i,o,cor,op})=>{const m=new THREE.Mesh(new THREE.RingGeometry(i,o,64),new THREE.MeshBasicMaterial({color:cor,transparent:true,opacity:op,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));m.rotation.x=Math.PI*0.25;grupo.add(m);return m})
  const halo=new THREE.Mesh(new THREE.SphereGeometry(30,32,32),new THREE.MeshBasicMaterial({color:0x1a0033,transparent:true,opacity:0.06,side:THREE.BackSide,depthWrite:false})); grupo.add(halo)
  const jMat=new THREE.MeshBasicMaterial({color:0x4488ff,transparent:true,opacity:0.25,blending:THREE.AdditiveBlending,depthWrite:false})
  const jT=new THREE.Mesh(new THREE.ConeGeometry(0.3,25,8),jMat); jT.position.y=12
  const jB=new THREE.Mesh(new THREE.ConeGeometry(0.3,25,8),jMat.clone()); jB.position.y=-12; jB.rotation.z=Math.PI; grupo.add(jT,jB)
  const QS=300,sGeo=new THREE.BufferGeometry(),sPos=new Float32Array(QS*3),sAng=new Float32Array(QS),sRai=new Float32Array(QS)
  for(let i=0;i<QS;i++){sAng[i]=Math.random()*Math.PI*2;sRai[i]=15+Math.random()*20;sPos[i*3]=Math.cos(sAng[i])*sRai[i];sPos[i*3+2]=Math.sin(sAng[i])*sRai[i]}
  sGeo.setAttribute('position',new THREE.BufferAttribute(sPos,3))
  const spiral=new THREE.Points(sGeo,new THREE.PointsMaterial({size:0.4,sizeAttenuation:true,transparent:true,opacity:0.7,color:0xff6600,blending:THREE.AdditiveBlending,depthWrite:false})); grupo.add(spiral)
  return {grupo,aneis,halo,spiral,sAng,sRai}
}

// ════════════════════════════════════════════════════════
//  COMPONENTE
// ════════════════════════════════════════════════════════

function UniversoCanvas() {
  const mountRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false})
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderer.setSize(window.innerWidth,window.innerHeight)
    renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=0.8
    el.appendChild(renderer.domElement)

    const scene=new THREE.Scene(); scene.background=new THREE.Color(0x00000a)
    const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,2000)
    camera.position.set(0,8,50); camera.lookAt(0,0,0)

    const SOL_POS=new THREE.Vector3(80,60,-120)
    const luzSol=new THREE.PointLight(0xfff5cc,8.0,800); luzSol.position.copy(SOL_POS); scene.add(luzSol)
    const luzFill=new THREE.PointLight(0x1a2a4a,2.5,1000); luzFill.position.set(-200,-80,-200); scene.add(luzFill)
    const luzBorda=new THREE.PointLight(0x0044aa,3.0,600); luzBorda.position.set(-100,200,-50); scene.add(luzBorda)
    scene.add(new THREE.AmbientLight(0x111122,0.8))

    const camada1=criarCamadaEstrelas(12000,800,0.08,0.18,0.60)
    const camada2=criarCamadaEstrelas(5000,400,0.15,0.35,0.85)
    const camada3=criarCamadaEstrelas(800,150,0.3,0.9,1.0)
    const viaLactea=criarViaLactea()
    scene.add(camada1,camada2,camada3,viaLactea)

    // Nebulosas com sub-nuvens + filamentos
    const nebConfigs=[
      {pos:[-80,30,-100],  cfg:{cor1:'#8a28dc',cor2:'#5010a0',cor3:'#280860',spread:100}},
      {pos:[100,-20,-200], cfg:{cor1:'#1488ff',cor2:'#0840cc',cor3:'#021060',spread:120}},
      {pos:[-60,-80,-300], cfg:{cor1:'#e05010',cor2:'#a02808',cor3:'#500800',spread:110}},
      {pos:[80,-150,-380], cfg:{cor1:'#00cc78',cor2:'#007040',cor3:'#003020',spread:100}},
    ]
    const nebulosas=nebConfigs.map(({pos,cfg})=>{
      const g=new THREE.Group(); g.position.set(...pos)
      reconstruirNebulosaCompleta(g,cfg); scene.add(g); return g
    })

    const GDEFS=[
      {posicao:[-300,80,-600],raio:35,quantidade:4000,inclinacao:0.3,angulo:0.8,corNucleo:'#ffe8aa',corBraco:'#aac8ff'},
      {posicao:[400,-60,-700],raio:18,quantidade:2500,inclinacao:1.1,angulo:0.2,corNucleo:'#ffcc88',corBraco:'#ffaa66'},
      {posicao:[-500,-100,-550],raio:28,quantidade:3500,inclinacao:0.05,angulo:1.4,corNucleo:'#88ccff',corBraco:'#4488ff'},
      {posicao:[250,150,-650],raio:22,quantidade:2800,inclinacao:Math.PI*0.48,angulo:0.6,corNucleo:'#ffddaa',corBraco:'#aaaaff'},
      {posicao:[-200,-200,-800],raio:14,quantidade:1800,inclinacao:0.4,angulo:2.1,corNucleo:'#ffeecc',corBraco:'#88aaff'},
      {posicao:[600,100,-750],raio:20,quantidade:2200,inclinacao:0.7,angulo:3.5,corNucleo:'#ffaa88',corBraco:'#ff8866'},
      {posicao:[-450,200,-900],raio:40,quantidade:5000,inclinacao:0.15,angulo:1.9,corNucleo:'#fff5cc',corBraco:'#99bbff'},
      {posicao:[350,-250,-850],raio:25,quantidade:3000,inclinacao:0.9,angulo:0.3,corNucleo:'#aaddff',corBraco:'#6699ff'},
    ]
    const galaxias=GDEFS.map(d=>{const g=criarGalaxia(d);scene.add(g);return g})

    const sol=new THREE.Mesh(new THREE.SphereGeometry(6,64,64),new THREE.MeshBasicMaterial({color:0xffee44})); sol.position.copy(SOL_POS)
    const corona1=new THREE.Mesh(new THREE.SphereGeometry(7.5,32,32),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.25,side:THREE.BackSide,depthWrite:false}))
    const corona2=new THREE.Mesh(new THREE.SphereGeometry(9,32,32),  new THREE.MeshBasicMaterial({color:0xffcc44,transparent:true,opacity:0.14,side:THREE.BackSide,depthWrite:false}))
    const corona3=new THREE.Mesh(new THREE.SphereGeometry(12,32,32), new THREE.MeshBasicMaterial({color:0xff8800,transparent:true,opacity:0.07,side:THREE.BackSide,depthWrite:false}))
    corona1.scale.setScalar(1.35); corona2.scale.setScalar(1.65); corona3.scale.setScalar(2.2)
    sol.add(corona1,corona2,corona3)
    const texChama=criarTexturaChama()
    const protuberancias=Array.from({length:12},(_,i)=>{
      const s=new THREE.Sprite(new THREE.SpriteMaterial({map:texChama,transparent:true,opacity:0.4+Math.random()*0.3,blending:THREE.AdditiveBlending,depthWrite:false}))
      const ang=(i/12)*Math.PI*2; s.position.set(Math.cos(ang)*6.5,Math.sin(ang)*6.5,(Math.random()-0.5)*2); s.scale.set(3+Math.random()*4,3+Math.random()*4,1); sol.add(s); return s
    })
    const raioPts=[]
    for(let i=0;i<8;i++){const ang=(i/8)*Math.PI*2,comp=25+Math.random()*15;raioPts.push(0,0,0,Math.cos(ang)*comp,Math.sin(ang)*comp,0)}
    const raioGeo=new THREE.BufferGeometry(); raioGeo.setAttribute('position',new THREE.Float32BufferAttribute(raioPts,3))
    sol.add(new THREE.LineSegments(raioGeo,new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:0.06}))); scene.add(sol)
    const VS_QTD=2000,vsGeo=new THREE.BufferGeometry(),vsPos=new Float32Array(VS_QTD*3),vsVel=new Float32Array(VS_QTD*3)
    for(let i=0;i<VS_QTD;i++){const p=posicaoEsferica(5+Math.random()*30);vsPos[i*3]=SOL_POS.x+p.x;vsPos[i*3+1]=SOL_POS.y+p.y;vsPos[i*3+2]=SOL_POS.z+p.z;vsVel[i*3]=p.x*0.008;vsVel[i*3+1]=p.y*0.008;vsVel[i*3+2]=p.z*0.008}
    vsGeo.setAttribute('position',new THREE.BufferAttribute(vsPos,3))
    const ventoSolar=new THREE.Points(vsGeo,new THREE.PointsMaterial({size:0.08,sizeAttenuation:true,transparent:true,opacity:0.4,color:0xfffacc,blending:THREE.AdditiveBlending,depthWrite:false})); scene.add(ventoSolar)

    const p1=new THREE.Mesh(new THREE.SphereGeometry(14,64,64),new THREE.MeshStandardMaterial({map:criarTexturaPlaneta('jupiter'),roughness:0.55,metalness:0.0,emissive:new THREE.Color(0x331500),emissiveIntensity:0.35})); p1.position.set(130,35,-160)
    const torusJ=new THREE.Mesh(new THREE.TorusGeometry(18,0.4,8,128),new THREE.MeshBasicMaterial({color:0xaa8855,transparent:true,opacity:0.35,side:THREE.DoubleSide,depthWrite:false})); torusJ.rotation.x=0.28; p1.add(torusJ)
    p1.add(new THREE.Mesh(new THREE.SphereGeometry(15.2,32,32),new THREE.MeshBasicMaterial({color:0xd08040,transparent:true,opacity:0.12,side:THREE.FrontSide,depthWrite:false}))); scene.add(p1)
    const p2=new THREE.Mesh(new THREE.SphereGeometry(9,64,64),new THREE.MeshStandardMaterial({map:criarTexturaPlaneta('netuno'),roughness:0.4,metalness:0.05,emissive:new THREE.Color(0x000833),emissiveIntensity:0.55})); p2.position.set(-160,-55,-260)
    const nuvensNet=new THREE.Mesh(new THREE.SphereGeometry(9.15,32,32),new THREE.MeshBasicMaterial({color:0x6699ff,transparent:true,opacity:0.08,depthWrite:false}))
    p2.add(new THREE.Mesh(new THREE.SphereGeometry(10.2,32,32),new THREE.MeshBasicMaterial({color:0x2255ff,transparent:true,opacity:0.22,side:THREE.FrontSide,depthWrite:false})),nuvensNet); scene.add(p2)
    const p3=new THREE.Mesh(new THREE.SphereGeometry(11,64,64),new THREE.MeshStandardMaterial({map:criarTexturaPlaneta('saturno'),roughness:0.5,metalness:0.0,emissive:new THREE.Color(0x221100),emissiveIntensity:0.3})); p3.position.set(200,-100,-350)
    ;[{i:14,o:17,op:0.7,cor:0xcc9933},{i:17,o:20,op:0.5,cor:0xbbaa55},{i:20,o:22,op:0.35,cor:0xccaa44},{i:23,o:25,op:0.2,cor:0xaa8833},{i:26,o:28,op:0.12,cor:0x887722}].forEach(({i,o,op,cor})=>{const rm=new THREE.Mesh(new THREE.RingGeometry(i,o,64),new THREE.MeshBasicMaterial({color:cor,transparent:true,opacity:op,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));rm.rotation.x=Math.PI*0.42;p3.add(rm)}); scene.add(p3)
    const p4=new THREE.Mesh(new THREE.SphereGeometry(7,64,64),new THREE.MeshStandardMaterial({map:criarTexturaPlaneta('exoplaneta'),roughness:0.35,metalness:0.15,emissive:new THREE.Color(0x220044),emissiveIntensity:0.7})); p4.position.set(-120,80,-200)
    p4.add(new THREE.Mesh(new THREE.SphereGeometry(8.5,32,32),new THREE.MeshBasicMaterial({color:0xaa00ff,transparent:true,opacity:0.28,side:THREE.FrontSide,depthWrite:false}))); scene.add(p4)
    const lua1=new THREE.Mesh(new THREE.SphereGeometry(1.2,16,16),new THREE.MeshStandardMaterial({color:0x888888,roughness:0.9}))
    const lua2=new THREE.Mesh(new THREE.SphereGeometry(0.8,16,16),new THREE.MeshStandardMaterial({color:0x8899aa,roughness:0.9}))
    const lua3=new THREE.Mesh(new THREE.SphereGeometry(0.6,16,16),new THREE.MeshStandardMaterial({color:0x555566,roughness:0.9}))
    scene.add(lua1,lua2,lua3); let angLua1=0,angLua2=0,angLua3=Math.PI

    // Cinturão de asteroides com geometria fBm
    const TIPOS=['C','C','C','S','S','S','M','V']
    const asteroides=[]
    for(let i=0;i<600;i++){
      const r=50+Math.random()*30,ang=Math.random()*Math.PI*2
      const tipo=TIPOS[Math.floor(Math.random()*TIPOS.length)]
      const ast=new THREE.Mesh(criarGeometriaAsteroide(0.2+Math.random()*0.7,i*137.5),criarMaterialAsteroide(tipo))
      ast.position.set(Math.cos(ang)*r+SOL_POS.x,SOL_POS.y+(Math.random()-0.5)*8,Math.sin(ang)*r+SOL_POS.z)
      ast.rotation.set(Math.random()*Math.PI*2,Math.random()*Math.PI*2,Math.random()*Math.PI*2)
      ast.userData={vx:(Math.random()-0.5)*0.006,vy:(Math.random()-0.5)*0.009,vz:(Math.random()-0.5)*0.004,angOrbital:ang,raioOrbital:r,velOrbital:0.002/Math.sqrt(r/50)}
      scene.add(ast); asteroides.push(ast)
    }

    // Asteroides viajantes com cauda de fogo
    const CORES_AST=[
      {rocha:0xff4400,cauda:'#ff6600',cauda2:'#ffaa00'},{rocha:0x00aaff,cauda:'#0088ff',cauda2:'#44ddff'},
      {rocha:0xffcc00,cauda:'#ffee00',cauda2:'#ffffff'},{rocha:0xff00aa,cauda:'#ff44cc',cauda2:'#ffaaee'},
      {rocha:0x44ff88,cauda:'#00ff66',cauda2:'#aaffcc'},{rocha:0xff2200,cauda:'#ff0000',cauda2:'#ff8844'},
      {rocha:0x8844ff,cauda:'#aa66ff',cauda2:'#ddbbff'},{rocha:0x00ffee,cauda:'#00ddcc',cauda2:'#aaffff'},
    ]
    const astViajantes=Array.from({length:40},(_,i)=>{
      const side=i%2===0?1:-1,speed=0.3+Math.random()*1.1,paleta=CORES_AST[i%CORES_AST.length]
      const mesh=new THREE.Mesh(criarGeometriaAsteroide(0.3+Math.random()*1.6,i*73.1),new THREE.MeshStandardMaterial({color:paleta.rocha,roughness:0.8,metalness:0.1,emissive:new THREE.Color(paleta.rocha),emissiveIntensity:0.4}))
      const numPart=12+Math.floor(Math.random()*8)
      const caudaSprites=Array.from({length:numPart},(_,k)=>{
        const s=new THREE.Sprite(new THREE.SpriteMaterial({map:criarTexturaCauda(paleta.cauda,paleta.cauda2),transparent:true,opacity:0.9-(k/numPart)*0.85,blending:THREE.AdditiveBlending,depthWrite:false,rotation:Math.PI/2}))
        const scl=(1-k/numPart)*(0.8+Math.random()*0.6); s.scale.set(scl*0.4,scl*3.5,1); scene.add(s); return {sprite:s,offset:(k+1)*1.5}
      })
      mesh.position.set(side*(200+Math.random()*300),(Math.random()-0.5)*250,-30-Math.random()*450)
      mesh.userData={vx:-side*speed,vy:(Math.random()-0.5)*0.12,vz:(Math.random()-0.5)*0.08,rx:(Math.random()-0.5)*0.03,ry:(Math.random()-0.5)*0.03,side,caudaSprites}
      scene.add(mesh); return mesh
    })

    const {grupo:bnGrupo,aneis:bnAneis,halo:bnHalo,spiral:bnSpiral,sAng:bnAng,sRai:bnRaios}=criarBuracoNegro(); scene.add(bnGrupo)

    let scrollAlvo=0,scrollAtual=0,targetX=0,targetY=0
    const onScroll=()=>{scrollAlvo=window.scrollY/Math.max(1,document.body.scrollHeight-window.innerHeight)}
    const onMouseMove=(e)=>{targetX=(e.clientX/window.innerWidth-0.5)*2*0.06;targetY=(e.clientY/window.innerHeight-0.5)*2*0.04}
    const onResize=()=>{camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight)}
    window.addEventListener('scroll',onScroll,{passive:true}); window.addEventListener('mousemove',onMouseMove,{passive:true}); window.addEventListener('resize',onResize)

    let time=0,frameId
    const animate=()=>{
      frameId=requestAnimationFrame(animate); time+=0.01
      scrollAtual+=(scrollAlvo-scrollAtual)*0.04; camera.position.z=50-scrollAtual*480
      camada1.position.z=scrollAtual*20; camada2.position.z=scrollAtual*60; camada3.position.z=scrollAtual*120; viaLactea.position.z=scrollAtual*30
      camada1.rotation.y=time*0.00008; camada2.rotation.y=time*0.00015; camada3.rotation.y=time*0.0003; viaLactea.rotation.y=time*0.00005
      galaxias.forEach((g,i)=>{g.rotation.y+=0.00003*(i%2===0?1:-1)})
      nebulosas.forEach((neb,i)=>{
        neb.rotation.y+=0.000025*(i%2===0?1:-1); neb.rotation.z+=0.000012
        neb.scale.setScalar(1+Math.sin(time*0.06+i*1.3)*0.018)
        neb.children.forEach((cam,j)=>{if(cam.material){const b=cam.userData.opBase||cam.material.opacity;if(!cam.userData.opBase)cam.userData.opBase=b;cam.material.opacity=b*(0.88+Math.sin(time*0.1+j*0.7+i)*0.12)}})
      })
      sol.scale.setScalar(1+Math.sin(time*2.5)*0.012)
      corona1.scale.setScalar(1.35+Math.sin(time*1.8+0.5)*0.025); corona2.scale.setScalar(1.65+Math.sin(time*1.2+1.0)*0.04); corona3.scale.setScalar(2.2+Math.sin(time*0.9+1.5)*0.06)
      protuberancias.forEach((p,i)=>{p.scale.y=1+Math.sin(time*(1.5+i*0.3)+i)*0.5;p.material.opacity=0.4+Math.sin(time*(2+i*0.2))*0.25})
      luzSol.intensity=8.0+Math.sin(time*1.8)*0.5
      const vsAttr=ventoSolar.geometry.attributes.position
      for(let i=0;i<VS_QTD;i++){vsPos[i*3]+=vsVel[i*3];vsPos[i*3+1]+=vsVel[i*3+1];vsPos[i*3+2]+=vsVel[i*3+2];const dx=vsPos[i*3]-SOL_POS.x,dy=vsPos[i*3+1]-SOL_POS.y,dz=vsPos[i*3+2]-SOL_POS.z;if(dx*dx+dy*dy+dz*dz>6400){const p=posicaoEsferica(5+Math.random()*8);vsPos[i*3]=SOL_POS.x+p.x;vsPos[i*3+1]=SOL_POS.y+p.y;vsPos[i*3+2]=SOL_POS.z+p.z;vsVel[i*3]=p.x*0.008;vsVel[i*3+1]=p.y*0.008;vsVel[i*3+2]=p.z*0.008}vsAttr.setXYZ(i,vsPos[i*3],vsPos[i*3+1],vsPos[i*3+2])}
      vsAttr.needsUpdate=true
      p1.rotation.y+=0.0006; p2.rotation.y+=0.0004; nuvensNet.rotation.y+=0.0006; p3.rotation.y+=0.0003; p4.rotation.y+=0.0009
      angLua1+=0.008; lua1.position.set(p1.position.x+Math.cos(angLua1)*22,p1.position.y,p1.position.z+Math.sin(angLua1)*22)
      angLua2+=0.012; lua2.position.set(p4.position.x+Math.cos(angLua2)*12,p4.position.y,p4.position.z+Math.sin(angLua2)*12)
      angLua3+=0.007; lua3.position.set(p4.position.x+Math.cos(angLua3)*16,p4.position.y+Math.sin(angLua3)*Math.sin(0.4)*16,p4.position.z+Math.sin(angLua3)*Math.cos(0.4)*16)
      asteroides.forEach(ast=>{ast.rotation.x+=ast.userData.vx;ast.rotation.y+=ast.userData.vy;ast.rotation.z+=ast.userData.vz;ast.userData.angOrbital+=ast.userData.velOrbital;ast.position.x=Math.cos(ast.userData.angOrbital)*ast.userData.raioOrbital+SOL_POS.x;ast.position.z=Math.sin(ast.userData.angOrbital)*ast.userData.raioOrbital+SOL_POS.z})
      astViajantes.forEach(ast=>{ast.position.x+=ast.userData.vx;ast.position.y+=ast.userData.vy;ast.position.z+=ast.userData.vz;ast.rotation.x+=ast.userData.rx;ast.rotation.y+=ast.userData.ry;const dirX=ast.userData.vx>0?-1:1;ast.userData.caudaSprites.forEach(({sprite,offset})=>{sprite.position.set(ast.position.x+dirX*offset,ast.position.y-ast.userData.vy*offset*0.5,ast.position.z-ast.userData.vz*offset*0.5)});const limit=500;if((ast.userData.side===1&&ast.position.x<-limit)||(ast.userData.side===-1&&ast.position.x>limit)){ast.position.x=ast.userData.side*(200+Math.random()*300);ast.position.y=(Math.random()-0.5)*250;ast.position.z=-30-Math.random()*450}})
      bnAneis.forEach((a,i)=>{a.rotation.z+=[0.003,0.002,0.0015,0.001,0.0007][i]}); bnHalo.scale.setScalar(1+Math.sin(time*0.5)*0.02)
      const spAttr=bnSpiral.geometry.attributes.position
      for(let i=0;i<bnRaios.length;i++){bnAng[i]+=0.015/bnRaios[i];bnRaios[i]-=0.001;if(bnRaios[i]<5){bnRaios[i]=25+Math.random()*15;bnAng[i]=Math.random()*Math.PI*2}spAttr.setXYZ(i,Math.cos(bnAng[i])*bnRaios[i],(Math.random()-0.5)*0.3,Math.sin(bnAng[i])*bnRaios[i])}
      spAttr.needsUpdate=true
      camera.rotation.y+=(targetX-camera.rotation.y)*0.025; camera.rotation.x+=(-targetY-camera.rotation.x)*0.025
      renderer.render(scene,camera)
    }
    animate()

    return ()=>{
      window.removeEventListener('scroll',onScroll); window.removeEventListener('mousemove',onMouseMove); window.removeEventListener('resize',onResize)
      cancelAnimationFrame(frameId); renderer.dispose()
      if(el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  },[])

  return (
    <>
      <div ref={mountRef} className="universo-canvas" aria-hidden="true" style={{position:'fixed',inset:0,zIndex:0}} />
      <div className="universo-overlay" aria-hidden="true" />
    </>
  )
}

export default UniversoCanvas
