// Ported from the Claude Design "Portfolio.dc.html" (Maze 3D) prototype.
// Original animation/physics logic is preserved near-verbatim; only the
// component lifecycle (mount/unmount/state) was adapted from the Claude
// Design runtime to plain React refs + state.
import * as THREE from 'three';
import { PILE_LABELS, PILE_EMOJIS, TESTIMONIALS } from './heroData';

const DEFAULT_PROPS = {
  pileGravity: 0.55,
  pileBounce: 0.32,
  pileScatter: 3.2,
  pileScatterRadius: 150,
  mazeDensity: 0.6,
  wallHeight: 15,
  warmth: 0.95,
  fogAmount: 0.35,
  brightness: 0.9,
  saturation: 1.25,
  hueShift: 0,
  contrast: 1.2,
  sceneOpacity: 1,
};

class MazeController {
  constructor({ onStateChange, ...props } = {}) {
    this.props = { ...DEFAULT_PROPS, ...props };
    this.state = { audioOn: false, navVisible: false, darkMode: false };
    this.onStateChange = onStateChange;
    this._alive = false;
  }

  setState(patch) {
    Object.assign(this.state, patch);
    if (this.onStateChange) this.onStateChange(this.state);
  }

  forceUpdate() {}


  mount(refs) {
    this._alive = true;
    this.mountEl = refs.mountEl;
    this.mazeEl = refs.mazeEl;
    this.hintEl = refs.hintEl;
    this.gardenEl = refs.gardenEl;
    this.pileEl = refs.pileEl;
    this.caseEl = refs.caseEl;
    this.contactSceneEl = refs.contactSceneEl;
    this.pileRefs = refs.pileRefs;
    this.testimonialRefs = refs.testimonialRefs;

    this.init();
    this.initTestimonials();
    if (this.pileEl) this.initPile();
    if (this.contactSceneEl) this.renderContactScene();

    if (location.hash) {
      const id = location.hash.slice(1);
      this.setState({ navVisible: true });
      const jump = () => {
        if (!this._alive) return;
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.offsetTop, behavior: 'auto' });
      };
      requestAnimationFrame(jump);
      [150, 400, 900, 1600].forEach((t) => setTimeout(jump, t));
    }
  }

  initTestimonials() {
    if (this._testInit) return;
    this._testInit = true;
    this.testimonialData = TESTIMONIALS;
    this.testimonialOrder = this.testimonialData.map((_, i) => i);
    this.drag = null;
    this.layoutTestimonials(true);
  }

  layoutTestimonials(instant) {
    const fan = [
      { x: 0, y: 0, rot: 0, scale: 1, opacity: 1 },
      { x: -34, y: 22, rot: -9, scale: 0.94, opacity: 0.85 },
      { x: 34, y: 22, rot: 9, scale: 0.94, opacity: 0.85 },
      { x: -54, y: 40, rot: -15, scale: 0.88, opacity: 0.55 }
    ];
    this.testimonialOrder.forEach((dataIdx, stackPos) => {
      const el = this.testimonialRefs[dataIdx].current;
      if (!el) return;
      const f = fan[stackPos] || fan[fan.length - 1];
      el.style.transition = instant ? 'none' : 'transform 0.35s cubic-bezier(.2,.8,.2,1), opacity 0.35s';
      el.style.transform = 'translate(' + f.x + 'px,' + f.y + 'px) rotate(' + f.rot + 'deg) scale(' + f.scale + ')';
      el.style.zIndex = String(100 - stackPos);
      el.style.opacity = stackPos > 3 ? '0' : String(f.opacity);
    });
  }

  onCardDown(dataIdx, e) {
    if (this.testimonialOrder[0] !== dataIdx) return;
    const point = e.touches ? e.touches[0] : e;
    this.drag = { dataIdx, startX: point.clientX, startY: point.clientY, dx: 0, dy: 0 };
    const el = this.testimonialRefs[dataIdx].current;
    if (el) el.style.transition = 'none';
    const move = (ev) => this.onCardMove(ev);
    const up = (ev) => this.onCardUp(ev, move, up);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);
  }

  onCardMove(e) {
    if (!this.drag) return;
    if (e.cancelable) e.preventDefault();
    const point = e.touches ? e.touches[0] : e;
    this.drag.dx = point.clientX - this.drag.startX;
    this.drag.dy = point.clientY - this.drag.startY;
    const el = this.testimonialRefs[this.drag.dataIdx].current;
    if (el) {
      const rot = this.drag.dx * 0.05;
      el.style.transform = 'translate(' + this.drag.dx + 'px,' + (this.drag.dy + 0) + 'px) rotate(' + rot + 'deg) scale(1)';
    }
  }

  onCardUp(e, move, up) {
    window.removeEventListener('mousemove', move);
    window.removeEventListener('mouseup', up);
    window.removeEventListener('touchmove', move);
    window.removeEventListener('touchend', up);
    if (!this.drag) return;
    const { dataIdx, dx } = this.drag;
    const el = this.testimonialRefs[dataIdx].current;
    const threshold = 110;
    if (Math.abs(dx) > threshold && el) {
      const dir = dx > 0 ? 1 : -1;
      el.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
      el.style.transform = 'translate(' + (dir * 900) + 'px,' + (this.drag.dy) + 'px) rotate(' + (dir * 30) + 'deg) scale(1)';
      el.style.opacity = '0';
      this.testimonialOrder.push(this.testimonialOrder.shift());
      setTimeout(() => this.layoutTestimonials(false), 20);
    } else if (el) {
      el.style.transition = 'transform 0.3s cubic-bezier(.2,.8,.2,1)';
      el.style.transform = 'translate(0px,0px) rotate(0deg) scale(1)';
    }
    this.drag = null;
  }

  initPile() {
    if (this._pileInit || !this.pileEl) return;
    this._pileInit = true;
    const labels = PILE_LABELS;
    const emojis = PILE_EMOJIS;
    this.pileBodies = [];
    const w = this.pileEl.clientWidth || 900;
    labels.forEach((label, i) => { this.pileBodies.push({ label, isPill: true, isEmoji: false, x: Math.random() * (w - 140), y: -80 - i * 45, vx: (Math.random() - 0.5) * 1.5, vy: 0, rot: (Math.random() - 0.5) * 16, vrot: (Math.random() - 0.5) * 2, w: 0, h: 0 }); });
    emojis.forEach((label, i) => { this.pileBodies.push({ label, isPill: false, isEmoji: true, x: Math.random() * (w - 40), y: -80 - (labels.length + i) * 45, vx: (Math.random() - 0.5) * 1.5, vy: 0, rot: (Math.random() - 0.5) * 20, vrot: (Math.random() - 0.5) * 2, w: 0, h: 0 }); });
    this.pileMouse = { x: -9999, y: -9999, active: false };
    this._alive = true;
    this.forceUpdate();
    if (this._pileRaf) cancelAnimationFrame(this._pileRaf);
    this._pileRaf = requestAnimationFrame(() => this.stepPile());
  }

  stepPile() {
    if (!this._alive || !this.pileEl) return;
    const cw = this.pileEl.clientWidth, ch = this.pileEl.clientHeight;
    const bodies = this.pileBodies;
    for (let i = 0; i < bodies.length; i++) {
      const b = bodies[i];
      const el = this.pileRefs[i].current;
      if (el && !b.w) { b.w = el.offsetWidth; b.h = el.offsetHeight; }
      b.vy += Number(this.props.pileGravity ?? 0.55);
      b.x += b.vx; b.y += b.vy; b.rot += b.vrot;
      b.vx *= 0.985; b.vy *= 0.985; b.vrot *= 0.94;
      if (b.y + b.h > ch) { b.y = ch - b.h; b.vy *= -(Number(this.props.pileBounce ?? 0.32)); b.vx *= 0.85; if (Math.abs(b.vy) < 0.6) b.vy = 0; }
      if (b.y < -200) { b.y = -200; b.vy = Math.max(b.vy, 0); }
      if (b.x < 0) { b.x = 0; b.vx *= -0.4; }
      if (b.x + b.w > cw) { b.x = cw - b.w; b.vx *= -0.4; }
      if (this.pileMouse.active) {
        const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
        const dx = cx - this.pileMouse.x, dy = cy - this.pileMouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const radius = Number(this.props.pileScatterRadius ?? 150);
        if (dist < radius) {
          const force = (radius - dist) / radius * Number(this.props.pileScatter ?? 3.2);
          b.vx += (dx / dist) * force; b.vy += (dy / dist) * force - 1.2;
          b.vrot += (Math.random() - 0.5) * 6;
        }
      }
    }
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i], b = bodies[j];
        const ar = Math.max(a.w, a.h) / 2, br = Math.max(b.w, b.h) / 2;
        const acx = a.x + a.w / 2, acy = a.y + a.h / 2, bcx = b.x + b.w / 2, bcy = b.y + b.h / 2;
        const dx = bcx - acx, dy = bcy - acy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
        const minDist = (ar + br) * 0.82;
        if (dist < minDist) {
          const push = (minDist - dist) / dist * 0.5;
          const px = dx * push, py = dy * push;
          a.vx -= px * 0.5; a.vy -= py * 0.5;
          b.vx += px * 0.5; b.vy += py * 0.5;
        }
      }
      const el = this.pileRefs[i].current;
      if (el) el.style.transform = 'translate(' + bodies[i].x + 'px,' + bodies[i].y + 'px) rotate(' + bodies[i].rot + 'deg)';
    }
    this._pileRaf = requestAnimationFrame(() => this.stepPile());
  }

  unmount() {
    this._alive = false;
    if (this._pileRaf) cancelAnimationFrame(this._pileRaf);
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this._birdTimer) clearTimeout(this._birdTimer);
    if (this._onResize) window.removeEventListener('resize', this._onResize);
    if (this._onMouse) window.removeEventListener('mousemove', this._onMouse);
    if (this.renderer) { this.renderer.dispose(); if (this.renderer.domElement.parentNode) this.renderer.domElement.parentNode.removeChild(this.renderer.domElement); }
    if (this.contactRenderer) { this.contactRenderer.dispose(); if (this.contactRenderer.domElement.parentNode) this.contactRenderer.domElement.parentNode.removeChild(this.contactRenderer.domElement); }
    if (this.actx) { try { this.actx.close(); } catch (e) {} }
  }

  renderContactScene() {
    const T = THREE;
    if (!T || !this.contactSceneEl) return;
    
    const w = this.contactSceneEl.clientWidth, h = this.contactSceneEl.clientHeight;
    const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.outputEncoding = T.sRGBEncoding;
    this.contactSceneEl.appendChild(renderer.domElement);
    this.contactRenderer = renderer;

    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(58, w / h, 0.1, 500);
    camera.position.set(0, 30, 80);
    camera.lookAt(0, 0, -100);

    // sky gradient
    const sky = new T.Mesh(new T.SphereGeometry(400, 24, 16), new T.MeshBasicMaterial({ 
      map: this.makeSkyTexture(), 
      side: T.BackSide, 
      fog: false 
    }));
    scene.add(sky);

    // ground
    const ground = new T.Mesh(new T.PlaneGeometry(1600, 1600), new T.MeshLambertMaterial({ map: this.makeGroundTexture() }));
    ground.receiveShadow = true;
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 0, -400);
    scene.add(ground);

    // lights
    const hemi = new T.HemisphereLight(0xf5ecc8, 0xa86e49, 0.75);
    scene.add(hemi);
    const sun = new T.DirectionalLight(0xffe9b8, 0.9);
    sun.position.set(-60, 90, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -140; sun.shadow.camera.right = 140;
    sun.shadow.camera.top = 160; sun.shadow.camera.bottom = -160;
    sun.shadow.camera.near = 1; sun.shadow.camera.far = 420;
    sun.shadow.bias = -0.0006;
    scene.add(sun);

    // hills
    const blobGeo = new T.SphereGeometry(1, 24, 18);
    const hillMat = new T.MeshLambertMaterial({ color: 0xc4dda4 });
    const hillMat2 = new T.MeshLambertMaterial({ color: 0xafd18d });
    const mkHill = (x, z, r, mat) => {
      const h = new T.Mesh(blobGeo, mat);
      h.position.set(x, -r * 0.28, z);
      h.scale.set(r, r * 0.62, r);
      h.castShadow = true;
      h.receiveShadow = true;
      scene.add(h);
    };
    mkHill(-60, -270, 75, hillMat);
    mkHill(-130, -290, 100, hillMat2);
    mkHill(65, -275, 80, hillMat);
    mkHill(140, -295, 110, hillMat2);
    mkHill(-25, -305, 65, hillMat2);
    mkHill(35, -310, 72, hillMat2);

    // clouds
    const cloudMat = new T.MeshLambertMaterial({ color: 0xfdf3dc, emissive: 0xa89372, fog: false });
    const vr = this.rng(97);
    const mkCloud = (x, y, z, sc) => {
      const grp = new T.Group();
      [[0, 0, 0, 1], [-1.1, -0.12, 0.2, 0.72], [1.05, -0.1, -0.15, 0.66], [0.35, 0.42, 0.1, 0.6], [-0.5, 0.35, -0.2, 0.5]].forEach((b) => {
        const m = new T.Mesh(blobGeo, cloudMat);
        m.position.set(b[0] * 8 * sc, b[1] * 8 * sc, b[2] * 8 * sc);
        m.scale.set(8 * sc * b[3], 5.6 * sc * b[3], 6.5 * sc * b[3]);
        m.castShadow = true;
        grp.add(m);
      });
      grp.position.set(x, y, z);
      scene.add(grp);
    };
    mkCloud(-72, 44, -290, 1.2);
    mkCloud(52, 52, -300, 0.95);
    mkCloud(115, 36, -280, 0.7);
    mkCloud(-18, 60, -310, 0.6);
    mkCloud(90, 68, -305, 0.5);

    // forest trees
    const trunkMat = new T.MeshLambertMaterial({ color: 0xcfc3ab });
    const leafMat = new T.MeshLambertMaterial({ color: 0xa9c56f });
    const leafMat2 = new T.MeshLambertMaterial({ color: 0x93b85e });
    const trunkGeo = new T.CylinderGeometry(0.62, 1.05, 1, 20, 1);
    
    const mkTree = (x, z) => {
      const trunk = new T.Mesh(trunkGeo, trunkMat);
      const th = 12 + Math.random() * 4;
      trunk.position.set(x, th / 2, z);
      trunk.scale.y = th;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      scene.add(trunk);

      const canM = new T.Mesh(blobGeo, leafMat);
      canM.position.set(x, th + 3, z);
      canM.scale.set(3.2, 3, 3.2);
      canM.castShadow = true;
      canM.receiveShadow = true;
      scene.add(canM);
    };
    // scattered forest at edges
    for (let i = 0; i < 12; i++) {
      const ang = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 60;
      mkTree(Math.cos(ang) * dist, -200 + Math.sin(ang) * dist);
    }

    const loop = () => {
      requestAnimationFrame(loop);
      renderer.render(scene, camera);
    };
    loop();
  }

  // ---------- procedural textures ----------
  makeGroundTexture() {
    const T = THREE, c = document.createElement('canvas'); c.width = c.height = 512;
    const g = c.getContext('2d'), rnd = this.rng(11);
    // smooth clay sand — nearly flat, just the faintest speckle
    g.fillStyle = '#ddb27f'; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 2200; i++) {
      const v = rnd();
      g.fillStyle = v < 0.5 ? 'rgba(196,148,98,' + (0.05 + rnd() * 0.07) + ')' : 'rgba(240,206,158,' + (0.04 + rnd() * 0.07) + ')';
      g.beginPath(); g.arc(rnd() * 512, rnd() * 512, 1 + rnd() * 3, 0, Math.PI * 2); g.fill();
    }
    const tex = new T.CanvasTexture(c);
    tex.wrapS = tex.wrapT = T.RepeatWrapping; tex.repeat.set(14, 24);
    return tex;
  }

  makeSkyTexture() {
    const T = THREE, c = document.createElement('canvas'); c.width = 4; c.height = 256;
    const g = c.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 256);
    gr.addColorStop(0, '#3f9ada'); gr.addColorStop(0.45, '#7ec6ef'); gr.addColorStop(0.78, '#c7e6f5'); gr.addColorStop(1, '#f7ecd2');
    g.fillStyle = gr; g.fillRect(0, 0, 4, 256);
    return new T.CanvasTexture(c);
  }

  makeSoftDisc(inner, outer) {
    const T = THREE, c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, inner); gr.addColorStop(1, outer);
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return new T.CanvasTexture(c);
  }

  makeShaftTexture() {
    const T = THREE, c = document.createElement('canvas'); c.width = 128; c.height = 256;
    const g = c.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 256);
    gr.addColorStop(0, 'rgba(255,214,140,0.6)'); gr.addColorStop(1, 'rgba(255,214,140,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 256);
    const side = g.createLinearGradient(0, 0, 128, 0);
    side.addColorStop(0, 'rgba(0,0,0,1)'); side.addColorStop(0.5, 'rgba(0,0,0,0)'); side.addColorStop(1, 'rgba(0,0,0,1)');
    g.globalCompositeOperation = 'destination-out';
    g.fillStyle = side; g.fillRect(0, 0, 128, 256);
    return new T.CanvasTexture(c);
  }

  makeFlower3D(petalColor, centerColor, petals = 6) {
    const T = THREE;
    const group = new T.Group();
    
    // stem: thin cylinder rooted at origin
    const stemMat = new T.MeshLambertMaterial({ color: 0x7a9d6f });
    const stemGeo = new T.CylinderGeometry(0.08, 0.1, 1.8, 8, 1);
    const stem = new T.Mesh(stemGeo, stemMat);
    stem.position.y = 0.9;
    stem.castShadow = true;
    group.add(stem);
    
    // flower head at top of stem, facing forward (camera direction)
    const flowerHead = new T.Group();
    flowerHead.position.y = 1.8;
    
    // petals arranged in a circle, facing outward from center
    const petalMat = new T.MeshLambertMaterial({ color: petalColor });
    const petalGeo = new T.SphereGeometry(0.35, 12, 12);
    for (let i = 0; i < petals; i++) {
      const a = (i / petals) * Math.PI * 2;
      const p = new T.Mesh(petalGeo, petalMat);
      p.scale.set(0.8, 1.4, 0.8);
      p.position.set(Math.cos(a) * 0.7, 0, Math.sin(a) * 0.7);
      p.rotation.z = a + Math.PI / 2;
      p.castShadow = true;
      flowerHead.add(p);
    }
    
    // center sphere
    const centerMat = new T.MeshLambertMaterial({ color: centerColor });
    const centerGeo = new T.SphereGeometry(0.5, 16, 16);
    const center = new T.Mesh(centerGeo, centerMat);
    center.position.y = 0.1;
    center.castShadow = true;
    flowerHead.add(center);
    
    group.add(flowerHead);
    return group;
  }

  makeBirdSprite() {
    const T = THREE, c = document.createElement('canvas'); c.width = 64; c.height = 32;
    const g = c.getContext('2d');
    g.strokeStyle = 'rgba(40,48,38,0.9)'; g.lineWidth = 4; g.lineCap = 'round';
    g.beginPath(); g.moveTo(6, 24); g.quadraticCurveTo(20, 6, 32, 20); g.quadraticCurveTo(44, 6, 58, 24); g.stroke();
    return new T.CanvasTexture(c);
  }

  rng(seed) {
    let s = seed >>> 0;
    return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }

  // ---------- scene ----------
  init() {
    const T = THREE;
    const renderer = new T.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.16;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    this.mountEl.appendChild(renderer.domElement);
    this.renderer = renderer;

    const scene = new T.Scene();
    this.scene = scene;
    scene.fog = new T.FogExp2(0xf3e7cb, 0.03);

    const camera = new T.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 2200);
    this.camera = camera;

    // lights
    this.hemi = new T.HemisphereLight(0xf5ecc8, 0xa86e49, 0.75);
    scene.add(this.hemi);
    this.sun = new T.DirectionalLight(0xffe9b8, 0.9);
    this.sun.position.set(-60, 90, 10);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.camera.left = -140; this.sun.shadow.camera.right = 140;
    this.sun.shadow.camera.top = 160; this.sun.shadow.camera.bottom = -160;
    this.sun.shadow.camera.near = 1; this.sun.shadow.camera.far = 420;
    this.sun.shadow.bias = -0.0006;
    this.sun.target.position.set(0, 0, -100);
    scene.add(this.sun); scene.add(this.sun.target);

    // sky
    const sky = new T.Mesh(new T.SphereGeometry(1900, 24, 16), new T.MeshBasicMaterial({ map: this.makeSkyTexture(), side: T.BackSide, fog: false }));
    scene.add(sky);

    // ground
    const ground = new T.Mesh(new T.PlaneGeometry(1600, 1600), new T.MeshLambertMaterial({ map: this.makeGroundTexture() }));
    ground.material.map.repeat.set(90, 90);
    ground.receiveShadow = true;
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 0, -400);
    scene.add(ground);

    // camera path
    const wp = [[0, 14], [0, -12], [-9, -22], [-9, -34], [8, -44], [8, -56], [-8, -66], [-8, -78], [9, -88], [9, -100], [-6, -110], [-6, -122], [7, -132], [7, -144], [0, -154], [0, -164]];
    const pts = [];
    for (let i = 0; i < wp.length; i++) {
      pts.push(new T.Vector3(wp[i][0], 3.0, wp[i][1]));
      if (i < wp.length - 1) pts.push(new T.Vector3((wp[i][0] + wp[i + 1][0]) / 2, 3.0, (wp[i][1] + wp[i + 1][1]) / 2));
    }
    this.curve = new T.CatmullRomCurve3(pts, false, 'catmullrom', 0.25);

    // shared clay geometry (reused by the rebuildable forest + the ending vista)
    const trunkGeo = new T.CylinderGeometry(0.62, 1.05, 1, 20, 1);
    const blobGeo = new T.SphereGeometry(1, 24, 18);
    this.trunkGeo = trunkGeo; this.blobGeo = blobGeo; this.wp = wp;
    // hand-drawn carve lines (world XZ points sampled from a user sketch over the aerial view)
    this.drawnLinePts = [[-133.4,-54.5],[-131.4,-56.4],[-132,-53.8],[-130.1,-55.7],[-132.6,-51.2],[-129.4,-54.4],[-133.8,-48],[-131.9,-49.9],[-126.8,-55],[-132.5,-47.3],[-125.5,-54.3],[-133,-44.8],[-124.2,-53.6],[-133.6,-42.2],[-131.7,-44.1],[-121.7,-54.1],[-132.3,-41.6],[-120.4,-53.4],[-132.8,-39.1],[-118.5,-53.4],[-132.8,-37.2],[-117.3,-52.7],[-133.3,-34.8],[-131.5,-36.6],[-133.3,-32.9],[-131.4,-34.8],[-132.6,-31.7],[-112.4,-51.9],[-132.5,-29.9],[-130.7,-31.7],[-131.8,-28.7],[-108.7,-51.8],[-131.2,-27.5],[-107.5,-51.1],[-131.1,-25.7],[-105.8,-51.1],[-130.5,-24.6],[-104,-51],[-130.4,-22.8],[-102.8,-50.4],[-129.8,-21.6],[-101.1,-50.3],[-129.7,-19.9],[-99.9,-49.7],[-129.1,-18.8],[-97.6,-50.2],[-128.4,-17.6],[-96.5,-49.6],[-128.4,-15.9],[-94.8,-49.5],[-128.3,-14.2],[-93.7,-48.9],[-128.9,-12],[-127.1,-13.7],[33.4,-174.2],[-128.8,-10.3],[-127.1,-12.1],[-91.5,-47.7],[35.2,-174.3],[-128.8,-8.6],[-127,-10.4],[-91.5,-45.9],[-89.8,-47.6],[37.6,-175],[-127.6,-8.2],[-92.2,-43.5],[37.7,-173.4],[39.4,-175.2],[-127.5,-6.5],[-91.7,-42.3],[40.1,-174.1],[-127.5,-4.9],[-92.4,-40],[-90.6,-41.7],[42.4,-174.8],[-126.9,-3.8],[-91.9,-38.9],[42.5,-173.2],[-128,-1.1],[-126.3,-2.8],[-90.8,-38.3],[44.8,-173.9],[-127.9,0.5],[-126.2,-1.2],[-90.9,-36.6],[46,-173.5],[-127.9,2.1],[-126.2,0.4],[-90.4,-35.4],[48.4,-174.1],[-127.3,3.1],[-91.6,-32.6],[-89.9,-34.3],[49.5,-173.7],[-125.5,3],[-123.9,1.3],[-90.5,-32],[50.7,-173.3],[-122.7,1.7],[-90.6,-30.4],[51.8,-172.8],[-121,1.6],[-90.7,-28.7],[52.4,-171.8],[-119.8,2.1],[-91.3,-26.5],[-89.6,-28.2],[55.3,-173.1],[-90.8,-25.4],[55.3,-171.5],[-116.5,1.8],[-90.4,-24.3],[56.4,-171.1],[-115.4,2.2],[-90.4,-22.7],[58.1,-171.2],[-113.2,1.6],[-90,-21.6],[59.2,-170.8],[-112.1,2],[-89.5,-20.6],[60.8,-170.9],[-109.9,1.3],[-89,-19.5],[61.9,-170.5],[-108.2,1.2],[-88.5,-18.5],[63.6,-170.6],[-106.6,1.1],[-88.6,-16.9],[64.6,-170.2],[-105.6,1.5],[-88.2,-15.9],[66.3,-170.3],[-89.3,-13.2],[-87.7,-14.8],[67.3,-169.9],[-102.4,1.3],[-87.8,-13.3],[68.4,-169.5],[-100.8,1.2],[-87.9,-11.7],[69.4,-169.1],[-99.2,1.1],[-87.4,-10.7],[71,-169.2],[-97.7,1],[-87.5,-9.2],[71.5,-168.2],[-96.7,1.4],[-87.6,-7.7],[72.6,-167.8],[-95.1,1.3],[-87.1,-6.7],[74.1,-168],[-87.8,-4.7],[74.6,-167],[-92.6,1.6],[-87.3,-3.7],[76.1,-167.2],[-90.6,0.9],[-86.9,-2.8],[77.2,-166.8],[-89,0.8],[-86.9,-1.3],[78.7,-166.9],[-87.6,0.7],[79.1,-166],[-86.6,1.1],[80.7,-166.1],[-85.1,1],[82.2,-166.3],[-83.1,0.4],[83.7,-166.4],[-81.7,0.3],[85.1,-166.5],[85.1,-165.1],[-79.8,1.1],[87,-165.8],[-78.4,1],[88,-165.4],[-76.9,0.9],[89.4,-165.5],[-75.5,0.8],[90.9,-165.6],[91.3,-164.7],[92.8,-166.3],[92.7,-164.9],[94.3,-166.4],[94.2,-165],[95.7,-166.5],[-69.9,0.3],[96.6,-166.2],[98.1,-167.7],[-68.5,0.2],[98.5,-166.8],[100,-168.3],[-67.2,0.1],[100.4,-167.4],[101.9,-168.9],[103.4,-170.4],[104.9,-171.9],[-65.8,0],[102.8,-168.5],[104.3,-170],[-64.9,0.4],[104.7,-169.2],[-63.6,0.3],[-65.2,3.2],[-63.7,1.7],[-62.2,0.2],[104.4,-166.4],[-64.4,3.6],[-61.4,0.6],[104.3,-165.1],[-64,4.4],[-60.1,0.5],[104.1,-163.7],[-64.2,5.8],[-58.3,-0.1],[-65.3,8.1],[-63.8,6.7],[-56.9,-0.2],[104.4,-161.5],[-64,8],[-55.6,-0.3],[-65.1,10.3],[-63.6,8.9],[-54.3,-0.4],[-64.2,10.7],[-53.5,0],[-64.4,12],[-52.7,0.4],[-63.5,12.4],[-51,-0.2],[-50.7,0.7],[104.6,-154.6],[-48.4,-0.4],[-48.1,0.5],[105.3,-153],[104.7,-151.3],[-45.6,0.3],[105.6,-150.9],[-43.9,-0.3],[-43.6,0.5],[105.8,-148.9],[105.7,-147.6],[-40.7,-0.1],[-40.5,0.7],[106.4,-146.1],[105.8,-144.4],[-38,0.5],[106.6,-144.1],[106.5,-142.9],[106.3,-141.7],[-34.5,0.2],[-34.2,1.1],[85.7,-118.9],[87.1,-120.3],[88.5,-121.7],[-33.1,1],[87,-119.1],[88.4,-120.5],[89.8,-121.9],[-31.9,0.9],[90.2,-121.2],[107.2,-138.3],[-30.3,0.3],[91.9,-121.9],[108,-138],[92.3,-121.2],[93.7,-122.6],[-28.9,1],[93.6,-121.5],[107.8,-135.6],[-27.3,0.5],[94.9,-121.7],[108.1,-134.9],[-26.1,0.4],[96.2,-121.9],[108.9,-134.6],[97,-121.7],[108.8,-133.5],[97.8,-121.5],[108.6,-132.3],[-22.8,0.1],[99.9,-122.6],[-22.1,0.5],[100.3,-121.9],[109.7,-131.4],[-20.6,-0.1],[102,-122.6],[-20.3,0.7],[101.9,-121.5],[109.9,-129.6],[-18.8,0.2],[104,-122.6],[-18.2,0.5],[104.3,-121.9],[110.6,-128.2],[-16.6,0],[106,-122.6],[105.9,-121.5],[107.2,-122.8],[107.1,-121.7],[108.4,-123.1],[108.3,-122],[112.3,-125.9],[110.4,-123.1],[111.1,-122.8],[112.3,-123.1],[113,-122.8],[113.8,-122.6],[114.5,-122.4],[115.2,-122.2],[116.4,-122.4],[117.1,-122.2],[118.3,-122.4],[119,-122.2],[120.3,-123.5],[121,-123.3],[121.7,-123.1],[122.4,-122.9],[123.5,-123.1],[124.2,-122.9],[125.3,-123.1],[126,-122.9],[126.7,-122.7],[128,-123.9],[128.6,-123.7],[129.3,-123.5],[129.6,-122.9],[130.8,-124.1],[131.5,-123.9],[132.5,-124.1],[-6.6,15.8],[133.2,-123.9],[-6.8,17],[-5.6,15.7],[135.1,-124.9],[-5.8,16.8],[135.7,-124.7],[-6.1,18],[-6.3,19.1],[-6.2,19.7],[-6,20.4],[-5.9,21.1],[-5.7,21.8],[-5.6,22.5],[-5.8,23.6],[-5.7,24.2],[-5.5,24.9],[-5.4,25.6],[-5.2,26.2],[-5.1,26.9],[-5.2,28.6],[-4.6,28.8],[-4.7,30.5],[-4.2,30.8],[-4.3,32.4],[-3.8,32.7],[-4.2,34.7],[-4.1,35.3],[-4,35.9],[-3.8,36.6],[-4.1,37.6],[-4.3,38.6],[-3.2,37.4],[-3.8,38.8],[-4.4,40.2],[-5.4,41.9],[-4.3,40.8],[-5.3,42.5],[-4.1,41.4],[-5.1,43.1],[-5.4,44.1],[5.7,-158.9],[7.7,-159.1],[9.1,-158.7],[10.4,-158.3],[12.4,-158.5],[13.7,-158],[15.1,-157.6],[16.4,-157.2],[18.1,-159],[18.3,-157.4],[20,-159.2],[20.2,-157.6],[21.9,-159.3],[22,-157.8],[38.3,-174],[38.9,-173],[39.1,-169.8],[40.8,-171.5],[42,-171],[43.2,-170.6],[44.9,-170.7],[46.1,-170.3],[-126.1,3.6],[47.9,-170.4],[-124.4,3.4],[49.6,-170.6],[49.6,-169],[-122.6,4.9],[51.9,-169.7],[52.5,-168.7],[54.2,-170.4],[53.6,-168.3],[55.3,-170],[-117.6,4.5],[57,-170.1],[57,-168.6],[58.6,-170.2],[-114.8,4.8],[59.7,-169.8],[-113.7,5.2],[60.8,-169.4],[62.5,-171],[-111.5,4.5],[63.6,-170.6],[-110.4,4.9],[65.2,-170.7],[65.7,-169.8],[-108.3,5.8],[66.8,-169.3],[-106.7,5.6],[67.8,-168.9],[69.5,-170.6],[69.4,-169.1],[71.1,-170.7],[71,-169.2],[-102.5,5.8],[72.1,-168.8],[-100.9,5.6],[73.1,-168.4],[-98.3,4.5],[-96.8,4.3],[-94.7,3.7],[18,-109],[-92.7,3],[18.6,-108.2],[-92.2,4],[19.8,-108],[21.4,-109.6],[-89.6,2.8],[22.5,-109.4],[22.6,-108.1],[-87.7,3.6],[24.8,-108.9],[-86.2,3.5],[26,-108.7],[-84.8,3.4],[-83.8,3.8],[28.2,-108.3],[-82.9,4.2],[29.4,-108.1],[-81.4,4.1],[31,-108.4],[-79.5,3.4],[33.1,-109.2],[-78.1,3.3],[34.2,-109],[-76.6,3.2],[35.3,-108.8],[35.9,-108],[-74.8,4],[37.5,-108.3],[-73.4,3.9],[38.6,-108.1],[-72,3.8],[39.6,-107.9],[-70.7,3.6],[40.7,-107.7],[-69.3,3.5],[41.8,-107.5],[-67.9,3.4],[43.3,-107.8],[-66.1,2.8],[44.8,-108.1],[-64.7,2.7],[45.9,-107.9],[-63.9,3.1],[46.9,-107.7],[-62.5,3],[48.4,-108],[48.5,-106.8],[-60.4,3.2],[50.4,-107.6],[-58.6,2.6],[51.9,-107.9],[-57.3,2.5],[52.9,-107.7],[-56,2.4],[-55.2,2.8],[-53.6,3.6],[-52.3,3.4],[-51,3.3],[-49.8,3.2],[-48.5,3.1],[101.2,-145.4],[-46,2.9],[-45.3,3.3],[-45,4.1],[101.8,-142.6],[-43.3,3.5],[-43,4.4],[102,-140.6],[-41.3,3.8],[-40.6,4.2],[103.2,-139.6],[-38.9,3.6],[103.5,-138.9],[87.2,-121.4],[103,-137.2],[-37,3.8],[88.5,-121.7],[89.9,-123],[-36.7,4.7],[89.8,-121.9],[91.2,-123.3],[103.7,-135.8],[-35.1,4.1],[92,-123.1],[103.5,-134.6],[-33.9,4],[92.9,-122.8],[94.2,-124.2],[-33.2,4.3],[93.7,-122.6],[95.1,-124],[-31.6,3.8],[95.4,-123.3],[96.8,-124.7],[91.7,-118.5],[96.2,-123.1],[97.6,-124.4],[-29.3,3.6],[93.4,-119.2],[97.5,-123.3],[98.9,-124.6],[-21.4,-3.3],[94.7,-119.4],[98.8,-123.5],[100.1,-124.9],[-27.1,3.4],[-20.3,-3.4],[96,-119.7],[97.3,-121],[100.9,-124.6],[-26.4,3.7],[-20.5,-2.2],[96.3,-119],[97.7,-120.4],[101.7,-124.4],[-25.7,4.1],[-20.8,-0.9],[96.7,-118.3],[98,-119.7],[99.4,-121],[103.4,-125.1],[-24.1,3.5],[-20.1,-0.5],[98.8,-119.5],[100.2,-120.8],[104.2,-124.9],[105.6,-126.2],[-22.6,3],[-19.4,-0.2],[99.6,-119.3],[101.4,-121],[105.4,-125.1],[106.8,-126.4],[-21.5,2.9],[-19.2,0.6],[100.4,-119],[102.7,-121.3],[106.7,-125.3],[108,-126.6],[-19.9,2.3],[100.8,-118.4],[103,-120.6],[104.3,-121.9],[108.3,-126],[-20.2,3.5],[-18.8,2.2],[102.4,-119.1],[104.2,-120.8],[108.7,-125.3],[-19.5,3.9],[-18.2,2.6],[103.7,-119.3],[105.4,-121.1],[109.4,-125.1],[-18.9,4.2],[103.5,-118.2],[104.9,-119.5],[106.2,-120.9],[110.2,-124.8],[-17.8,4.1],[106.5,-120.2],[107.8,-121.5],[109.2,-122.8],[110.5,-124.2],[111.8,-125.5],[108.2,-120.9],[109.5,-122.2],[110.8,-123.5],[112.1,-124.8],[110.2,-122],[110.5,-121.3],[111.3,-121.1],[112.5,-121.3],[113.2,-121.1],[114.4,-121.3],[115.1,-121.1],[116.4,-122.4],[117.1,-122.2],[117.8,-122],[118.6,-121.8],[119.3,-121.6],[120.4,-121.8],[121.1,-121.6],[121.8,-121.4],[123.1,-122.7],[123.8,-122.4],[124.3,-121.2],[125.4,-121.4],[126,-120.1],[126.6,-119.9],[127.3,-119.7],[128,-119.5],[129.1,-119.8],[129.7,-119.6],[131,-120.8],[131.2,-120.2],[132.4,-121.4],[139.5,-128.5],[133.1,-121.2],[138.9,-127],[133.7,-121],[135,-122.3],[139.1,-126.4],[135.2,-121.7],[138.9,-125.3],[-8.9,23.3],[-7.7,22.1],[136.3,-121.9],[138.7,-124.3],[-9.1,24.4],[-7.9,23.2],[-6.7,21.9],[137.7,-122.5],[-9.4,25.5],[-7.8,23.8],[-6.5,22.6],[137.9,-121.9],[139.2,-123.1],[-8.4,25.3],[-7.2,24.1],[-6,22.9],[-8.7,26.4],[-7.4,25.2],[-6.9,25.4],[-140.8,-55.4],[-140,-54.1],[-141.9,-50.2],[-139.9,-52.1],[-138,-54],[-140.5,-49.5],[-141.7,-46.2],[-139.8,-48.1],[-140.9,-44.9],[-142.7,-41.1],[-140.8,-43],[-142.6,-39.1],[-140.8,-41],[-141.9,-37.9],[-142.4,-35.4],[-140.6,-37.2],[-141.1,-34.7],[-141.6,-32.2],[-140.3,-31.6],[35.9,-173.3],[37.7,-173.4],[38.9,-173],[40.7,-174.7],[41.9,-174.2],[43.1,-173.8],[44.9,-172.3],[46.1,-171.9],[47.8,-172],[49,-171.6],[50.7,-171.7],[51.9,-171.2],[53.6,-172.9],[54.7,-172.5],[55.8,-172.1],[57,-171.6],[59.7,-174.4],[61.4,-176.1],[59.2,-172.3],[61.4,-174.5],[59.7,-171.3],[63.1,-174.6],[60.8,-170.9],[64.1,-174.2],[61.9,-170.5],[65.8,-174.3],[63.6,-170.6],[66.9,-173.9],[64.6,-170.2],[66.3,-171.8],[69.6,-175.1],[67.4,-171.4],[69,-173],[70.6,-174.7],[69,-171.5],[70.6,-173.1],[71.6,-172.7],[73.2,-172.8],[-8.3,26],[-7.3,25.8],[0.8,17.8],[-5.9,25.3],[1.3,18],[-5,25.2],[1.5,18.7],[-4.4,25.4],[0.8,20.2],[2,19],[0.5,21.3],[1.7,20.1],[-2.5,25.1],[1.5,21.1],[-1.6,25],[1.6,21.8],[-0.6,24.9],[1.3,22.9],[-0.1,25.1],[1.1,23.9],[0,25.8],[1.2,24.6],[0.2,26.4],[1.3,25.2],[-0.1,27.5],[1.5,25.9],[-0.4,28.5],[1.6,26.5],[-0.2,29.1],[2.1,26.8],[0.3,29.4],[2.7,27],[2,28.5],[-0.6,31.8],[1.7,29.5],[-0.5,32.4],[1.9,30.1],[-0.7,33.5],[0.4,32.3],[2.8,30],[-0.2,33.7],[2.5,31],[-0.8,35.1],[1.9,32.4],[-1.1,36.1],[2,33],[-1,36.7],[2.1,33.6],[-0.8,37.3],[1.9,34.6],[-1.1,38.3],[1.2,36],[2.4,34.8],[-0.2,38.1],[1.7,36.2],[0.3,38.3],[1.5,37.2],[0.9,38.6]];
    // build the maze network + hedge forest (rebuilt live when density / wall height change)
    this.buildForest();

// (decoy blooms disabled)

    // ---- ending vista: rolling clay hills, puffy clouds and a low sun beyond the clearing ----
    this.vista = new T.Group();
    const hillMat = new T.MeshLambertMaterial({ color: 0xc4dda4, transparent: true, opacity: 0 });
    const hillMat2 = new T.MeshLambertMaterial({ color: 0xafd18d, transparent: true, opacity: 0 });
    const mkHill = (x, z, r, mat) => {
      const h = new T.Mesh(blobGeo, mat);
      h.position.set(x, -r * 0.28, z);
      h.scale.set(r, r * 0.62, r);
      this.vista.add(h);
    };
    // rolling overlapping mounds left and right, leaving the middle open to the horizon sun
    mkHill(-60, -270, 75, hillMat);
    mkHill(-130, -290, 100, hillMat2);
    mkHill(65, -275, 80, hillMat);
    mkHill(140, -295, 110, hillMat2);
    mkHill(-25, -305, 65, hillMat2);
    mkHill(35, -310, 72, hillMat2);
    // puffy clay clouds — clusters of soft white spheres
    const cloudMat = new T.MeshLambertMaterial({ color: 0xfdf3dc, emissive: 0xa89372, transparent: true, opacity: 0, fog: false });
    this.clouds = [];
    const vr = this.rng(97);
    const mkCloud = (x, y, z, sc) => {
      const grp = new T.Group();
      [[0, 0, 0, 1], [-1.1, -0.12, 0.2, 0.72], [1.05, -0.1, -0.15, 0.66], [0.35, 0.42, 0.1, 0.6], [-0.5, 0.35, -0.2, 0.5]].forEach((b) => {
        const m = new T.Mesh(blobGeo, cloudMat);
        m.position.set(b[0] * 8 * sc, b[1] * 8 * sc, b[2] * 8 * sc);
        m.scale.set(8 * sc * b[3], 5.6 * sc * b[3], 6.5 * sc * b[3]);
        grp.add(m);
      });
      grp.position.set(x, y, z);
      grp.userData = { ph: vr() * Math.PI * 2, x: x };
      this.vista.add(grp); this.clouds.push(grp);
    };
    mkCloud(-72, 44, -290, 1.2);
    mkCloud(52, 52, -300, 0.95);
    mkCloud(115, 36, -280, 0.7);
    mkCloud(-18, 60, -310, 0.6);
    mkCloud(90, 68, -305, 0.5);
    // low sun sitting right on the horizon, between the hills at the end of the path
    this.vistaSun = new T.Sprite(new T.SpriteMaterial({ map: this.makeSoftDisc('rgba(255,244,214,1)', 'rgba(255,206,130,0)'), transparent: true, depthWrite: false, opacity: 0, fog: false }));
    this.vistaSun.scale.set(85, 85, 1);
    this.vistaSun.position.set(4, 16, -330);
    this.vista.add(this.vistaSun);
    this.vistaMats = [hillMat, hillMat2, cloudMat];
    scene.add(this.vista);

    // warm glow at the heart of the garden — kept modest so it reads as light, not a whiteout
    const gardenGlow = new T.Sprite(new T.SpriteMaterial({ map: this.makeSoftDisc('rgba(255,238,190,0.55)', 'rgba(255,232,170,0)'), transparent: true, depthWrite: false, opacity: 0 }));
    gardenGlow.scale.set(48, 48, 1);
    gardenGlow.position.set(0, 9, -205);
    scene.add(gardenGlow);
    this.gardenGlow = gardenGlow;

    // golden dust motes
    const mr = this.rng(41), mp = [];
    for (let i = 0; i < 500; i++) mp.push((mr() * 2 - 1) * 55, 0.5 + mr() * 7, 14 - mr() * 190);
    const moteGeo = new T.BufferGeometry();
    moteGeo.setAttribute('position', new T.Float32BufferAttribute(mp, 3));
    this.motes = new T.Points(moteGeo, new T.PointsMaterial({ map: this.makeSoftDisc('rgba(255,232,170,0.9)', 'rgba(255,232,170,0)'), size: 0.28, transparent: true, opacity: 0.7, depthWrite: false }));
    scene.add(this.motes);

    // drifting ground fog planes
    this.fogPlanes = [];
    const fogTex = this.makeSoftDisc('rgba(246,234,206,0.4)', 'rgba(246,234,206,0)');
    for (let i = 0; i < 12; i++) {
      const fp = new T.Mesh(new T.PlaneGeometry(26, 26), new T.MeshBasicMaterial({ map: fogTex, transparent: true, opacity: 0.55, depthWrite: false }));
      fp.rotation.x = -Math.PI / 2;
      const pt = this.curve.getPointAt(i / 12);
      fp.position.set(pt.x + (mr() * 2 - 1) * 4, 0.7 + mr() * 0.8, pt.z + (mr() * 2 - 1) * 4);
      fp.userData = { ph: mr() * Math.PI * 2 };
      scene.add(fp); this.fogPlanes.push(fp);
    }

    // light shafts along the way
    this.shafts = [];
    const shaftTex = this.makeShaftTexture();
    for (let i = 0; i < 10; i++) {
      const sm = new T.Mesh(new T.PlaneGeometry(4.5, 22), new T.MeshBasicMaterial({ map: shaftTex, transparent: true, opacity: 0.5, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide }));
      const pt = this.curve.getPointAt((i + 0.5) / 10.5);
      sm.position.set(pt.x + (mr() * 2 - 1) * 2.5, 9, pt.z - 3);
      sm.rotation.z = 0.42; sm.rotation.y = mr() * 0.8 - 0.4;
      sm.userData = { ph: mr() * Math.PI * 2 };
      scene.add(sm); this.shafts.push(sm);
    }

    // bird
    this.bird = new T.Sprite(new T.SpriteMaterial({ map: this.makeBirdSprite(), transparent: true, depthWrite: false }));
    this.bird.scale.set(1.6, 0.8, 1);
    this.bird.visible = false;
    scene.add(this.bird);
    this.birdT = null; this.birdDone = false;

    // interaction
    this.t = 0; this.mx = 0; this.my = 0;
    this._onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', this._onResize);
    this._onMouse = (ev) => {
      this.mx = (ev.clientX / window.innerWidth - 0.5);
      this.my = (ev.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', this._onMouse);

    this.c1 = { fog: new T.Color(0xf3e7cb), sun: new T.Color(0xfff0d2), hemi: new T.Color(0xf6ead0) };
    this.c2 = { fog: new T.Color(0xffe4ab), sun: new T.Color(0xffcf78), hemi: new T.Color(0xffe9b4) };
    this._tmp = new T.Color();
    this.clock = new T.Clock();
    this.loop();
  }

  buildForest() {
    const T = THREE;
    if (!this.forestGroup) { this.forestGroup = new T.Group(); this.scene.add(this.forestGroup); }
    const grp = this.forestGroup;
    while (grp.children.length) { const c = grp.children[grp.children.length - 1]; if (c.dispose) c.dispose(); grp.remove(c); }

    const wallH = Math.max(6, Math.min(18, Number(this.props.wallHeight ?? 10)));
    const density = Math.max(0.15, Math.min(1, Number(this.props.mazeDensity ?? 0.6)));
    const trunkMat = new T.MeshLambertMaterial({ color: 0xcfc3ab });
    const leafMat = new T.MeshLambertMaterial({ color: 0xa9c56f });
    const leafMat2 = new T.MeshLambertMaterial({ color: 0x93b85e });
    const bushMat = new T.MeshLambertMaterial({ color: 0x8fbc5c });
    const stoneMat = new T.MeshLambertMaterial({ color: 0xbcb4a4 });
    const cell = 6;
    const wp = this.wp;
    const rnd = this.rng(23);
    const poly = wp.map((p) => new T.Vector2(p[0], p[1]));
    const distToPath = (x, z) => {
      let d = 1e9;
      for (let i = 0; i < poly.length - 1; i++) {
        const a = poly[i], b = poly[i + 1];
        const abx = b.x - a.x, abz = b.y - a.y;
        const t = Math.max(0, Math.min(1, ((x - a.x) * abx + (z - a.y) * abz) / (abx * abx + abz * abz)));
        const dx = x - (a.x + abx * t), dz = z - (a.y + abz * t);
        d = Math.min(d, Math.sqrt(dx * dx + dz * dz));
      }
      return d;
    };

    // ---- decoy maze: recursive-backtracker labyrinth carved into the hedges ----
    // corridors live on a 16-unit lattice so a solid hedge wall (~6u) always survives between lanes
    const S = 16;
    const LX0 = -9, LX1 = 9, LZ0 = -21, LZ1 = 2;
    const cols = LX1 - LX0 + 1, rows = LZ1 - LZ0 + 1;
    const kkey = (cx, cz) => (cx - LX0) + '_' + (cz - LZ0);
    const mrnd = this.rng(1000 + Math.round(density * 997));
    const visited = {};
    const mazeSegs = [];
    const nodeCount = cols * rows;
    const targetVisit = Math.max(6, Math.round(nodeCount * density));
    let visitedCount = 0;
    const neighbors = (cx, cz) => {
      const out = [];
      if (cx > LX0) out.push([cx - 1, cz]);
      if (cx < LX1) out.push([cx + 1, cz]);
      if (cz > LZ0) out.push([cx, cz - 1]);
      if (cz < LZ1) out.push([cx, cz + 1]);
      return out;
    };
    const seedAt = () => {
      for (let tries = 0; tries < 300; tries++) {
        const cx = LX0 + Math.floor(mrnd() * cols);
        const cz = LZ0 + Math.floor(mrnd() * rows);
        if (!visited[kkey(cx, cz)]) return [cx, cz];
      }
      return null;
    };
    const stack = [];
    const first = seedAt();
    if (first) { visited[kkey(first[0], first[1])] = true; visitedCount++; stack.push(first); }
    while (visitedCount < targetVisit) {
      if (stack.length === 0) {
        const sd = seedAt();
        if (!sd) break;
        visited[kkey(sd[0], sd[1])] = true; visitedCount++; stack.push(sd);
      }
      const cur = stack[stack.length - 1];
      const unv = neighbors(cur[0], cur[1]).filter((n) => !visited[kkey(n[0], n[1])]);
      if (unv.length === 0) { stack.pop(); continue; }
      const nx = unv[Math.floor(mrnd() * unv.length)];
      mazeSegs.push([cur[0] * S, cur[1] * S, nx[0] * S, nx[1] * S]);
      visited[kkey(nx[0], nx[1])] = true; visitedCount++; stack.push(nx);
    }
    const distToMaze = (x, z) => {
      let d = 1e9;
      for (let i = 0; i < mazeSegs.length; i++) {
        const sg = mazeSegs[i];
        const ax = sg[0], az = sg[1], abx = sg[2] - sg[0], abz = sg[3] - sg[1];
        const t = Math.max(0, Math.min(1, ((x - ax) * abx + (z - az) * abz) / (abx * abx + abz * abz || 1)));
        const dx = x - (ax + abx * t), dz = z - (az + abz * t);
        d = Math.min(d, Math.sqrt(dx * dx + dz * dz));
      }
      return d;
    };

    // the last stretch widens into an open garden clearing rather than a walled dead end
    const openStart = -164, openEnd = -210;
    const openAmt = (z) => Math.max(0, Math.min(1, (openStart - z) / (openStart - openEnd)));
    // clear open lane straight out to the exit/garden clearing (no hedges blocking the way out)
    const exitLane = (x, z) => (z < openStart + 34 && Math.abs(x) < 7.5) ? 0 : 1e9;

    // user-drawn carve lines: extra corridors carved into the hedges from hand-drawn strokes
    const drawnPts = this.drawnLinePts || [];
    const drawnGrid = {};
    const dradius = 4.5, dcellR = Math.ceil(dradius / cell);
    for (let i = 0; i < drawnPts.length; i++) {
      const [dx, dz] = drawnPts[i];
      const cxi = Math.round(dx / cell), czi = Math.round(dz / cell);
      for (let ox2 = -dcellR; ox2 <= dcellR; ox2++) {
        for (let oz2 = -dcellR; oz2 <= dcellR; oz2++) {
          const gx = (cxi + ox2) * cell, gz = (czi + oz2) * cell;
          if (Math.hypot(gx - dx, gz - dz) <= dradius) drawnGrid[(cxi + ox2) + '_' + (czi + oz2)] = true;
        }
      }
    }

    const placements = [];
    for (let xi = -26; xi <= 26; xi++) {
      for (let zi = -58; zi <= 6; zi++) {
        const x = xi * cell, z = zi * cell;
        const d = distToPath(x, z);
        const opening = openAmt(z);
        const threshold = 6.4 + 50 * opening;
        if (d < threshold) continue; // main walked corridor / clearing
        if (distToMaze(x, z) < 5) continue; // decoy maze corridors (wide, clear lanes)
        if (exitLane(x, z) < 1) continue; // open exit lane to the garden
        if (drawnGrid[xi + '_' + zi]) continue; // hand-drawn carve lines
        placements.push([x, z, 0.88 + rnd() * 0.3, rnd() * 0.14 - 0.07]);
      }
    }

    const trunks = new T.InstancedMesh(this.trunkGeo, trunkMat, placements.length);
    const canA = new T.InstancedMesh(this.blobGeo, leafMat, placements.length);
    const canB = new T.InstancedMesh(this.blobGeo, leafMat2, placements.length * 2);
    const bushes = new T.InstancedMesh(this.blobGeo, bushMat, placements.length * 2);
    // variant mix: classic baseline + tall & thin / asymmetric lean / layered canopy for diversity
    const vrnd = this.rng(777);
    const variants = placements.map(() => {
      const r = vrnd();
      if (r < 0.45) return 'classic';
      if (r < 0.65) return 'tall';
      if (r < 0.85) return 'asym';
      return 'layered';
    });
    const layeredCount = variants.filter((v2) => v2 === 'layered').length;
    const canC = new T.InstancedMesh(this.blobGeo, leafMat, Math.max(1, layeredCount));
    const m4 = new T.Matrix4(), q = new T.Quaternion(), e = new T.Euler(), sv = new T.Vector3(), v = new T.Vector3();
    const put = (mesh, i, x, y, z, sx, sy, sz, ry, rx, rz) => {
      e.set(rx || 0, ry || 0, rz || 0); q.setFromEuler(e);
      sv.set(sx, sy, sz); v.set(x, y, z);
      m4.compose(v, q, sv); mesh.setMatrixAt(i, m4);
    };
    const r3 = this.rng(57);
    let cbi = 0, bi = 0, cli = 0;
    placements.forEach((p, i) => {
      const x = p[0], z = p[1], sc = p[2], ry = p[3];
      const variant = variants[i];
      let th = wallH * sc * 0.62;
      const ox = (r3() * 2 - 1) * 0.45, oz = (r3() * 2 - 1) * 0.45;
      let leanX = 0, leanZ = 0, leanOx = 0, leanOz = 0;
      if (variant === 'tall') th *= 1.24;
      if (variant === 'asym') {
        leanX = (r3() * 2 - 1) * 0.12; leanZ = (r3() * 2 - 1) * 0.12;
        leanOx = leanZ * th * 0.5; leanOz = -leanX * th * 0.5;
      }
      put(trunks, i, x + ox, th / 2, z + oz, 1, th, 1, ry, leanX, leanZ);
      let cr = 2.8 + r3() * 1.1;
      if (variant === 'tall') cr *= 0.72; // narrower compact canopy
      if (variant === 'layered') cr *= 1.1; // broader base tier
      const canX = x + ox + leanOx, canZ = z + oz + leanOz;
      put(canA, i, canX, th + cr * 0.55, canZ, cr, cr * 0.82, cr, ry);
      put(canB, cbi++, canX + (r3() * 2 - 1) * 1.1, th + cr * 0.35 + r3() * 1.6, canZ + (r3() * 2 - 1) * 1.1, cr * 0.62, cr * 0.5, cr * 0.62, 0);
      put(canB, cbi++, canX + (r3() * 2 - 1) * 1.1, th + cr * 0.3 + r3() * 1.4, canZ + (r3() * 2 - 1) * 1.1, cr * 0.55, cr * 0.45, cr * 0.55, 0);
      if (variant === 'layered') {
        const cr2 = cr * 0.6;
        put(canC, cli++, canX + (r3() * 2 - 1) * 0.6, th + cr * 1.05 + cr2 * 0.5, canZ + (r3() * 2 - 1) * 0.6, cr2, cr2 * 0.8, cr2, ry * 0.5);
      }
      put(bushes, bi++, x + (r3() * 2 - 1) * 1.0, 0.35, z + (r3() * 2 - 1) * 1.0, 1.8 + r3() * 0.9, 1.3 + r3() * 0.6, 1.8 + r3() * 0.9, 0);
      put(bushes, bi++, x + (r3() * 2 - 1) * 1.1, 0.25, z + (r3() * 2 - 1) * 1.1, 1.4 + r3() * 0.8, 0.95 + r3() * 0.45, 1.4 + r3() * 0.8, 0);
    });
    // hide unused canC instances (non-layered trees don't get a second tier)
    for (let u = cli; u < canC.count; u++) put(canC, u, 0, -50, 0, 0.001, 0.001, 0.001, 0);
    [trunks, canA, canB, canC, bushes].forEach((msh) => { msh.castShadow = true; msh.receiveShadow = true; grp.add(msh); });

    // smooth grey pebbles scattered along the sandy corridors
    const pr = this.rng(83);
    const pebbleSpots = [];
    let ptries = 0;
    while (pebbleSpots.length < 220 && ptries++ < 9000) {
      const px = (pr() * 2 - 1) * 150, pz = 24 - pr() * 360;
      const pxi2 = Math.round(px / cell), pzi2 = Math.round(pz / cell);
      if (distToPath(px, pz) < 5.2 || distToMaze(px, pz) < 5 || drawnGrid[pxi2 + '_' + pzi2] || (pz < -164 && Math.abs(px) < 36 && pr() < 0.5)) pebbleSpots.push([px, pz, 0.22 + pr() * 0.4]);
    }
    const pebbles = new T.InstancedMesh(this.blobGeo, stoneMat, pebbleSpots.length);
    pebbleSpots.forEach((pp, i) => put(pebbles, i, pp[0], pp[2] * 0.35, pp[1], pp[2], pp[2] * 0.55, pp[2] * 0.8, pr() * Math.PI));
    pebbles.castShadow = true; pebbles.receiveShadow = true; grp.add(pebbles);
    this._builtD = density; this._builtH = wallH;
  }

  componentDidUpdate(prevProps) {
    if (!this.scene) return;
    const pp = prevProps || {};
    if (pp.mazeDensity !== this.props.mazeDensity || pp.wallHeight !== this.props.wallHeight) this.buildForest();
  }

  loop() {
    if (!this._alive) return;
    this._raf = requestAnimationFrame(() => this.loop());
    const T = THREE;
    const time = this.clock.getElapsedTime();
    // rebuild the maze/forest if density or wall height changed (safety net for prop updates)
    const dNow = Number(this.props.mazeDensity ?? 0.6), hNow = Number(this.props.wallHeight ?? 10);
    if (this._builtD !== dNow || this._builtH !== hNow) { this._builtD = dNow; this._builtH = hNow; this.buildForest(); }
    let target = 0;
    if (this.mazeEl) {
      const start = this.mazeEl.offsetTop;
      const range = Math.max(1, this.mazeEl.offsetHeight - window.innerHeight * 1.7);
      target = Math.min(1, Math.max(0, (window.scrollY - start) / range));
      const showNav = window.scrollY > this.mazeEl.offsetHeight - window.innerHeight * 1.25;
      if (showNav !== this.state.navVisible) this.setState({ navVisible: showNav });
    }
    if (this.hintEl) {
      const hop = window.scrollY < window.innerHeight * 0.4 ? '1' : '0';
      if (this.hintEl.style.opacity !== hop) this.hintEl.style.opacity = hop;
    }
    this.t += (target - this.t) * 0.055;
    const p = this.t;

    // intro: bird's-eye establishing shot of the whole labyrinth that descends into the walk
    const introEnd = 0.18;
    const intro = Math.min(1, Math.max(0, p / introEnd));
    const k = intro * intro * (3 - 2 * intro); // smoothstep descent
    const t = Math.min(1, Math.max(0, (p - introEnd) / (1 - introEnd)));
    this.depth = t;
    this.introK = k;

    // first-person walk target along the curve
    const tt = t * 0.975;
    const pos = this.curve.getPointAt(tt);
    const ahead = this.curve.getPointAt(Math.min(1, tt + 0.02));
    const clearingOpen = Math.max(0, Math.min(1, (t - 0.82) / 0.18));
    const wpx = pos.x + this.mx * 0.6, wpy = pos.y + Math.sin(time * 1.15) * 0.06, wpz = pos.z;
    const wlx = ahead.x + this.mx * 2.2, wly = ahead.y - this.my * 1.4 + Math.sin(time * 0.9) * 0.05, wlz = ahead.z;

    // bird's-eye aerial: high, tilted 3/4 view looking down over the maze plan
    // bird's-eye pivot point (maze center) + camera on an arm rotated 45deg clockwise around it
    const alx = 0, aly = 0, alz = -96;
    const armR = 148, armAng = Math.PI / 4; // counterclockwise (viewed from above)
    const apx = alx + Math.sin(armAng) * armR + this.mx * 6;
    const apy = 165;
    const apz = alz + Math.cos(armAng) * armR;

    // blend aerial -> first-person walk
    this.camera.position.set(apx + (wpx - apx) * k, apy + (wpy - apy) * k, apz + (wpz - apz) * k);
    this.camera.lookAt(alx + (wlx - alx) * k, aly + (wly - aly) * k, alz + (wlz - alz) * k);

    // environment: misty entrance -> golden core
    const warmth = Math.max(0, Math.min(1, Number(this.props.warmth ?? 0.7)));
    const fogAmt = Math.max(0.3, Math.min(2, Number(this.props.fogAmount ?? 0.55)));
    const w = t * warmth;
    // smoothstep so the mist burns off gradually, most of it through the middle of the walk
    const clear = t * t * (3 - 2 * t);
    // fog color: soft green haze during the aerial reveal (dissolves the far maze edge) -> warm walk fog
    this._tmp.copy(this.c1.fog).lerp(this.c2.fog, w);
    if (!this._aerialFog) this._aerialFog = new T.Color(0xbcd19a);
    this.scene.fog.color.copy(this._aerialFog).lerp(this._tmp, k);
    // gentle far haze keeps the aerial full-bleed (no sky / sand border); thickens into the walk
    const walkDensity = (0.038 - 0.03 * clear) * fogAmt * (1 - clearingOpen * 0.3);
    const aerialHaze = 0.0022;
    this.scene.fog.density = aerialHaze + (walkDensity - aerialHaze) * k;
    if (this.gardenGlow) this.gardenGlow.material.opacity = clearingOpen * 0.4;
    // garden message only appears once the walk reaches the end of the maze
    if (this.gardenEl) {
      const show = t > 0.9;
      const op = show ? '1' : '0';
      if (this.gardenEl.style.opacity !== op) {
        this.gardenEl.style.opacity = op;
        this.gardenEl.style.transform = show ? 'translateY(0)' : 'translateY(28px)';
        this.gardenEl.style.pointerEvents = show ? 'auto' : 'none';
      }
    }
    // vista fades in as the forest opens; clouds drift
    for (const vm of this.vistaMats) vm.opacity = clearingOpen;
    this.vistaSun.material.opacity = clearingOpen * 0.95;
    for (const cl of this.clouds) cl.position.x = cl.userData.x + Math.sin(time * 0.05 + cl.userData.ph) * 6;
    this.sun.color.copy(this._tmp.copy(this.c1.sun).lerp(this.c2.sun, w));
    this.sun.intensity = 0.55 + 1.2 * w;
    this.hemi.color.copy(this._tmp.copy(this.c1.hemi).lerp(this.c2.hemi, w));
    this.hemi.intensity = 0.55 + 0.55 * w;

    // living details
    this.motes.position.y = Math.sin(time * 0.25) * 0.35;
    this.motes.rotation.y = time * 0.01;
    for (const fp of this.fogPlanes) {
      fp.position.x += Math.sin(time * 0.12 + fp.userData.ph) * 0.004;
      fp.material.opacity = (0.5 + Math.sin(time * 0.3 + fp.userData.ph) * 0.16) * (1 - clear * 0.8);
    }
    for (const sm of this.shafts) {
      sm.material.opacity = (0.3 + Math.sin(time * 0.5 + sm.userData.ph) * 0.18) * (0.5 + w * 0.8) * this.introK;
      sm.rotation.y += Math.sin(time * 0.1 + sm.userData.ph) * 0.0004;
    }



    // live color grade applied to the whole 3D canvas
    const bri = Math.max(0.5, Math.min(1.6, Number(this.props.brightness ?? 1)));
    const sat = Math.max(0, Math.min(2, Number(this.props.saturation ?? 1)));
    const hue = Math.max(-60, Math.min(60, Number(this.props.hueShift ?? 0)));
    const con = Math.max(0.7, Math.min(1.4, Number(this.props.contrast ?? 1)));
    const op = Math.max(0.3, Math.min(1, Number(this.props.sceneOpacity ?? 1)));
    const grade = `brightness(${bri}) saturate(${sat}) hue-rotate(${hue}deg) contrast(${con})`;
    const el = this.renderer.domElement;
    if (el.style.filter !== grade) el.style.filter = grade;
    if (el.style.opacity !== String(op)) el.style.opacity = String(op);

    // audio deepens with progress
    if (this.windFilter) {
      this.windFilter.frequency.value = 320 + t * 900;
      if (this.shimmerGain) this.shimmerGain.gain.value = t * 0.05;
    }

    this.renderer.render(this.scene, this.camera);
  }

  // ---------- ambient audio ----------
  initAudio() {
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    this.actx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(ctx.destination);

    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const wnoise = Math.random() * 2 - 1;
      last = (last + 0.02 * wnoise) / 1.02;
      data[i] = last * 3.2;
    }
    // wind
    const wind = ctx.createBufferSource(); wind.buffer = noiseBuf; wind.loop = true;
    this.windFilter = ctx.createBiquadFilter(); this.windFilter.type = 'lowpass'; this.windFilter.frequency.value = 380; this.windFilter.Q.value = 0.6;
    const windGain = ctx.createGain(); windGain.gain.value = 0.5;
    wind.connect(this.windFilter); this.windFilter.connect(windGain); windGain.connect(this.master);
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.22;
    lfo.connect(lfoGain); lfoGain.connect(windGain.gain);
    lfo.start(); wind.start();
    // leaf shimmer (grows with depth)
    const shim = ctx.createBufferSource(); shim.buffer = noiseBuf; shim.loop = true; shim.playbackRate.value = 1.7;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2600;
    this.shimmerGain = ctx.createGain(); this.shimmerGain.gain.value = 0;
    shim.connect(hp); hp.connect(this.shimmerGain); this.shimmerGain.connect(this.master);
    shim.start();

    const scheduleBird = () => {
      if (!this._alive || !this.actx) return;
      const depth = this.depth || 0;
      const delay = 2600 + Math.random() * (8000 - depth * 4500);
      this._birdTimer = setTimeout(() => { if (this.state.audioOn) this.chirp(false); scheduleBird(); }, delay);
    };
    scheduleBird();
  }

  chirp(loud) {
    const ctx = this.actx;
    if (!ctx || ctx.state !== 'running') return;
    const n = 2 + Math.floor(Math.random() * 3);
    let t0 = ctx.currentTime + 0.05;
    for (let i = 0; i < n; i++) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      const f = 2300 + Math.random() * 1500;
      o.frequency.setValueAtTime(f, t0);
      o.frequency.exponentialRampToValueAtTime(f * (1.15 + Math.random() * 0.25), t0 + 0.06);
      o.frequency.exponentialRampToValueAtTime(f * 0.9, t0 + 0.13);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(loud ? 0.09 : 0.04 + (this.depth || 0) * 0.03, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
      o.connect(g); g.connect(this.master);
      o.start(t0); o.stop(t0 + 0.2);
      t0 += 0.16 + Math.random() * 0.1;
    }
  }

  scrollToCases() {
    if (this.caseEl) window.scrollTo({ top: this.caseEl.offsetTop, behavior: 'smooth' });
  }

  onPileMouseMove(e) {
    if (!this.pileMouse) return;
    const r = this.pileEl.getBoundingClientRect();
    this.pileMouse.x = e.clientX - r.left;
    this.pileMouse.y = e.clientY - r.top;
    this.pileMouse.active = true;
  }

  onPileMouseLeave() {
    if (this.pileMouse) this.pileMouse.active = false;
  }

  toggleTheme() {
    const next = !this.state.darkMode;
    this.setState({ darkMode: next });
    document.body.style.background = next ? '#1c2818' : '#f6ecd6';
  }

  toggleAudio() {
    if (!this.actx) {
      this.initAudio();
      this.actx.resume();
      this.master.gain.linearRampToValueAtTime(0.7, this.actx.currentTime + 2.5);
      this.setState({ audioOn: true });
    } else if (this.state.audioOn) {
      this.actx.suspend();
      this.setState({ audioOn: false });
    } else {
      this.actx.resume();
      this.setState({ audioOn: true });
    }
  }
}


export default MazeController;
