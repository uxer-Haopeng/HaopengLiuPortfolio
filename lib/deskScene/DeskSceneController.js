// DeskSceneController.js — scene assembly, lighting, palettes, controls, dive-into-monitor.
// Ported from the Claude Design "Desk Scene" prototype (js/main.js). Original
// animation/physics logic is preserved near-verbatim; the component lifecycle
// (mount/unmount) was adapted from top-level script scope to a class, and the
// tweaks bridge (window.__tweaks / postMessage) was replaced with a plain
// applyTweaks() method the React layer calls directly.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import * as M from './models';
import { buildGarden } from './garden';

const SCREEN_PREVIEW_URL = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/desk-scene/screen-preview.png`;

const SKY = {
  clay:      { top: 0xece2d6, bottom: 0xf4ede4, fog: 0xeee5da, ground: null },
  color:     { top: 0xbfe1f4, bottom: 0xedf6ec, fog: 0xd8ebe0 },
  painterly: { top: 0xd6e1cd, bottom: 0xeff0e2, fog: 0xdde5d2 },
};
const TIME = {
  day:   { sunPos: [5, 8.5, 3.5],  sunCol: 0xfff3e3, sunInt: 2.2, fill: 0.35, exposure: 1.0,  hemi: 0.55, warm: 0.0,  glow: 0.0, lampInt: 0.0 },
  dusk:  { sunPos: [7, 3, -2.5],   sunCol: 0xff9a5e, sunInt: 1.9, fill: 0.28, exposure: 0.97, hemi: 0.4,  warm: 0.42, glow: 2.4, lampInt: 1.8 },
  night: { sunPos: [-5, 7, -3],    sunCol: 0x9fb6e0, sunInt: 0.45, fill: 0.12, exposure: 0.72, hemi: 0.2,  warm: 0.0,  glow: 6.5, night: true, lampInt: 3.4 },
};

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (v) => Math.max(0, Math.min(1, v));

function rr(ctx, X, Y, W, H, R) {
  ctx.beginPath();
  ctx.moveTo(X + R, Y);
  ctx.arcTo(X + W, Y, X + W, Y + H, R);
  ctx.arcTo(X + W, Y + H, X, Y + H, R);
  ctx.arcTo(X, Y + H, X, Y, R);
  ctx.arcTo(X, Y, X + W, Y, R);
  ctx.closePath();
}

export default class DeskSceneController {
  constructor() {
    this._alive = false;
    this.cur = { garden: 'color', timeOfDay: 'day', deskColor: '#ece4d9', autoRotate: true, depthBlur: true };
  }

  mount(refs) {
    this._alive = true;
    this.canvasEl = refs.canvasEl;
    this.portfolioEl = refs.portfolioEl;
    this.enterCueEl = refs.enterCueEl;
    this.hintEl = refs.hintEl;
    this.loadingEl = refs.loadingEl;

    this._initRenderer();
    this._initLights();
    this._assembleStudio();
    this._initSkyBodies();
    this._initTweaksBridge();
    this._initDive();
    this._initInteraction();
    this._initReveal();
    this._initResizeLoop();
  }

  _viewportSize() {
    return {
      w: Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1),
      h: Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1),
    };
  }

  _initRenderer() {
    const renderer = new THREE.WebGLRenderer({ canvas: this.canvasEl, antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    { const s0 = this._viewportSize(); renderer.setSize(s0.w, s0.h); }
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer = renderer;

    const scene = new THREE.Scene();
    this.scene = scene;

    // soft indoor-ish environment for the clay shading
    const pmrem = new THREE.PMREMGenerator(renderer);
    this.pmrem = pmrem;
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    // sky dome (gradient backdrop)
    const skyGeo = new THREE.SphereGeometry(70, 32, 16);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        top: { value: new THREE.Color(0xefe7dd) },
        bottom: { value: new THREE.Color(0xf4ece3) },
        offset: { value: 8 }, exponent: { value: 0.9 },
      },
      vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `uniform vec3 top; uniform vec3 bottom; uniform float offset; uniform float exponent; varying vec3 vP;
        void main(){ float h = normalize(vP + vec3(0.0, offset, 0.0)).y; float f = pow(max(h,0.0), exponent); gl_FragColor = vec4(mix(bottom, top, f), 1.0); }`,
    });
    scene.add(new THREE.Mesh(skyGeo, skyMat));
    this.skyMat = skyMat;

    scene.fog = new THREE.Fog(0xefe7df, 18, 55);

    // ---------- camera + controls ----------
    const camera = new THREE.PerspectiveCamera(33, this._viewportSize().w / this._viewportSize().h, 0.1, 200);
    camera.position.set(-4.3, 3.05, 5.7);
    this.camera = camera;

    const controls = new OrbitControls(camera, this.canvasEl);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.target.set(0.05, 0.95, 0.1);
    controls.minDistance = 3.2;
    controls.maxDistance = 14;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;  // don't dip under the floor
    controls.minPolarAngle = 0.25;
    controls.autoRotateSpeed = 0.45;
    controls.enableZoom = false;   // wheel is repurposed for the dive-into-screen
    this.controls = controls;
  }

  _initLights() {
    const scene = this.scene;
    const hemi = new THREE.HemisphereLight(0xffffff, 0xcdbfae, 0.55);
    scene.add(hemi);
    this.hemi = hemi;

    const sun = new THREE.DirectionalLight(0xfff3e3, 2.2);
    sun.position.set(5, 8.5, 3.5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 40;
    const sc = 9;
    sun.shadow.camera.left = -sc; sun.shadow.camera.right = sc;
    sun.shadow.camera.top = sc; sun.shadow.camera.bottom = -sc;
    sun.shadow.bias = -0.0004;
    sun.shadow.radius = 5;
    scene.add(sun);
    scene.add(sun.target);
    this.sun = sun;

    const fill = new THREE.DirectionalLight(0xe8eeff, 0.35);
    fill.position.set(-6, 4, 2);
    scene.add(fill);
    this.fill = fill;
  }

  _makeScreenTexture() {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 536;
    const tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 8;
    function draw() {
      const x = c.getContext('2d');
      x.fillStyle = '#efe7df'; x.fillRect(0, 0, 1024, 536);
      x.fillStyle = '#e7ddd0'; x.fillRect(0, 0, 1024, 64);
      x.fillStyle = '#d8ccba'; x.fillRect(0, 63, 1024, 1);
      ['#cf8e6f', '#dcb86c', '#a9b886'].forEach((col, i) => {
        x.fillStyle = col; x.beginPath(); x.arc(38 + i * 30, 32, 9, 0, Math.PI * 2); x.fill();
      });
      x.textBaseline = 'middle';
      x.fillStyle = '#5c5446'; x.font = '600 24px "Hanken Grotesk", system-ui, sans-serif';
      x.fillText('Your Name', 150, 33);
      x.fillStyle = '#a0937f'; x.font = '500 19px "Hanken Grotesk", system-ui, sans-serif';
      x.textAlign = 'right'; x.fillText('Work      About      Contact', 992, 33); x.textAlign = 'left';
      x.fillStyle = '#b07a55'; x.font = '700 18px "Space Mono", monospace';
      x.fillText('UX / PRODUCT DESIGNER', 64, 152);
      x.fillStyle = '#151310'; x.font = '400 74px "Holtwood One SC", Georgia, serif';
      x.fillText('I design for a', 60, 244);
      x.fillStyle = '#aaf150'; x.fillRect(56, 306, 300, 34);
      x.fillStyle = '#151310'; x.fillText('better world', 60, 322);
      x.fillStyle = '#8b8072'; x.font = '400 23px "Hanken Grotesk", system-ui, sans-serif';
      x.fillText('Selected work, case studies & process.', 64, 402);
      const cy = 400, cw = 288, ch = 100, gap = 24, x0 = 64;
      const accents = ['#e3a886', '#cdbf98', '#9fb287'];
      for (let i = 0; i < 3; i++) {
        const cx = x0 + i * (cw + gap);
        x.fillStyle = '#f5efe6'; rr(x, cx, cy, cw, ch, 20); x.fill();
        x.strokeStyle = 'rgba(58,51,43,.10)'; x.lineWidth = 1; rr(x, cx, cy, cw, ch, 20); x.stroke();
        x.fillStyle = accents[i]; rr(x, cx + 16, cy + 16, cw - 32, 44, 10); x.fill();
        x.fillStyle = '#6f6657'; x.font = '600 15px "Hanken Grotesk", sans-serif';
        x.fillText('Case study 0' + (i + 1), cx + 16, cy + 78);
      }
      x.fillStyle = '#b3a896'; x.font = '700 15px "Space Mono", monospace';
      x.textAlign = 'center'; x.fillText('—  scroll to enter  —', 512, 512); x.textAlign = 'left';
      tex.needsUpdate = true;
    }
    let imageReady = false;
    draw();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (!imageReady) draw(); });

    // replace the drawn mock with the real portfolio hero screenshot once it loads
    const shot = new Image();
    shot.crossOrigin = 'anonymous';
    shot.onload = () => {
      const x = c.getContext('2d');
      x.fillStyle = '#f3f3f3'; x.fillRect(0, 0, 1024, 536);
      // image aspect now matches the screen plane 1:1 — draw edge-to-edge, no crop
      x.drawImage(shot, 0, 0, 1024, 536);
      tex.needsUpdate = true;
      imageReady = true;
    };
    shot.onerror = (e) => { console.error('[screen-preview] FAILED to load image', e, shot.src); };
    shot.src = SCREEN_PREVIEW_URL;

    return tex;
  }

  _assembleStudio() {
    const scene = this.scene;

    // ---------- clay material for the desk + props ----------
    const clay = new THREE.MeshStandardMaterial({ color: 0xece4d9, roughness: 0.92, metalness: 0.0 });
    clay.envMapIntensity = 0.55;
    this.clay = clay;

    const studio = new THREE.Group();
    scene.add(studio);
    this.studio = studio;

    const desk = M.buildDesk(clay);
    studio.add(desk);
    const topY = desk.userData.topY;

    const place = (obj, x, z, yaw = 0) => {
      obj.position.set(x, topY, z);
      obj.rotation.y = yaw;
      studio.add(obj);
      return obj;
    };

    const screenMat = new THREE.MeshBasicMaterial({ map: this._makeScreenTexture() });
    const monitor = M.buildMonitor(clay, screenMat);
    place(monitor, 0.05, -0.24, 0.04);
    this.monitorDisplay = monitor.userData.display;

    // the monitor glows and lights the desk after dark
    const screenGlow = new THREE.PointLight(0xffe7c4, 0, 4, 2);
    screenGlow.position.set(0.1, topY + 0.62, 0.6);
    scene.add(screenGlow);
    this.screenGlow = screenGlow;

    place(M.buildKeyboard(clay), -0.06, 0.30, 0.02);
    place(M.buildTray(clay), 0.84, 0.34, -0.05);
    place(M.buildGrassPot(clay), -0.95, 0.10, 0).scale.multiplyScalar(1.3);
    place(M.buildPenHolder(clay), 0.96, -0.06, 0);
    place(M.buildCoffee(clay), 1.2, 0.24, 0);

    // pegboard floats on the "wall" behind-left
    const peg = M.buildPegboard(clay);
    peg.position.set(-0.95, 1.62, -0.824);
    peg.rotation.y = 0.06;
    studio.add(peg);

    // cat tree (floor-standing, back-right) with a sleeping clay cat on top
    const catMat = new THREE.MeshStandardMaterial({ color: 0xe7dac6, roughness: 0.95, metalness: 0 });
    catMat.envMapIntensity = 0.5;
    const catTree = M.buildCatTree(clay);
    catTree.position.set(1.95, 0, 0.35);
    catTree.rotation.y = -1.0;
    studio.add(catTree);
    const cat = M.buildCat(catMat);
    cat.position.set(1.95, catTree.userData.perchY, 0.35);
    cat.rotation.y = -1.15;
    studio.add(cat);

    // floor lamp (its own base on the ground)
    const lamp = M.buildLamp(clay);
    lamp.position.set(1.75, 0, -0.15);
    studio.add(lamp);
    this.lamp = lamp;
    // warm light the lamp casts on the desk once it's switched on (dusk/night)
    const lampLight = new THREE.PointLight(0xffcf8a, 0, 5, 2);
    lampLight.position.set(lamp.position.x, lamp.userData.bulbY, lamp.position.z);
    scene.add(lampLight);
    this.lampLight = lampLight;

    // drawers cabinet (freestanding, front-left)
    const drawers = M.buildDrawers(clay);
    drawers.position.set(-2.05, 0, 0.5);
    drawers.rotation.y = 0.12;
    studio.add(drawers);

    // chair (front-right, facing the desk)
    const chair = M.buildChair(clay);
    chair.position.set(0.95, 0, 1.55);
    chair.rotation.y = Math.PI * 0.94;
    studio.add(chair);

    // tame the environment reflection on everything clay
    studio.traverse((o) => { if (o.material && o.material.envMapIntensity !== undefined) o.material.envMapIntensity = 0.55; });

    // ---------- garden ----------
    this.gardenGroup = null;
  }

  _setGarden(style) {
    const scene = this.scene;
    if (this.gardenGroup) {
      scene.remove(this.gardenGroup);
      this.gardenGroup.traverse((d) => { if (d.geometry) d.geometry.dispose(); });
    }
    const gardenGroup = buildGarden(style);
    gardenGroup.traverse((o) => { if (o.material && o.material.envMapIntensity !== undefined) o.material.envMapIntensity = 0.4; });
    scene.add(gardenGroup);
    this.gardenGroup = gardenGroup;
  }

  _discTexture(inner, outer, coreStop) {
    const cv = document.createElement('canvas'); cv.width = cv.height = 128;
    const g = cv.getContext('2d');
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, inner);
    grd.addColorStop(coreStop, inner);
    grd.addColorStop(1, outer);
    g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(cv); t.encoding = THREE.sRGBEncoding;
    return t;
  }

  _initSkyBodies() {
    const scene = this.scene;
    const skyBodies = new THREE.Group();
    scene.add(skyBodies);

    // starfield concentrated near the horizon band the camera actually frames
    const STAR_N = 900;
    const starPos = new Float32Array(STAR_N * 3);
    for (let i = 0; i < STAR_N; i++) {
      const theta = 2 * Math.PI * Math.random();
      const el = Math.pow(Math.random(), 2.4) * (48 * Math.PI / 180); // bias toward horizon
      const rad = 56 + Math.random() * 8;
      const h = rad * Math.cos(el);
      starPos[i * 3]     = h * Math.cos(theta);
      starPos[i * 3 + 1] = rad * Math.sin(el) + 1.5;
      starPos[i * 3 + 2] = h * Math.sin(theta);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.6, map: this._discTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)', 0.28),
      transparent: true, depthWrite: false, fog: false, sizeAttenuation: true,
      opacity: 0.95, blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeo, starMat);
    skyBodies.add(stars);
    this.stars = stars;
    this.starMat = starMat;

    // moon: soft halo + crisp disc, low on the horizon so it sits in frame
    const moonPos = new THREE.Vector3(18, 8, -50);
    const moonHalo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this._discTexture('rgba(226,234,255,0.9)', 'rgba(180,198,255,0)', 0.4),
      transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending,
    }));
    moonHalo.position.copy(moonPos); moonHalo.scale.set(13, 13, 1);
    const moonDisc = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this._discTexture('rgba(240,243,255,1)', 'rgba(240,243,255,0)', 0.78),
      transparent: true, depthWrite: false, fog: false,
    }));
    moonDisc.position.copy(moonPos); moonDisc.scale.set(4.6, 4.6, 1);
    skyBodies.add(moonHalo, moonDisc);
    this.moonHalo = moonHalo;
    this.moonDisc = moonDisc;

    // sun: low warm sunset glow + core
    const sunPos2 = new THREE.Vector3(22, 6, -48);
    const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this._discTexture('rgba(255,204,150,0.95)', 'rgba(255,120,70,0)', 0.16),
      transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending,
    }));
    sunGlow.position.copy(sunPos2); sunGlow.scale.set(30, 30, 1);
    const sunCore = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this._discTexture('rgba(255,245,226,1)', 'rgba(255,200,140,0)', 0.5),
      transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending,
    }));
    sunCore.position.copy(sunPos2); sunCore.scale.set(9, 9, 1);
    skyBodies.add(sunGlow, sunCore);
    this.sunGlow = sunGlow;
    this.sunCore = sunCore;
  }

  _setSkyBodies(time) {
    const night = time === 'night', dusk = time === 'dusk';
    this.stars.visible = night;
    this.moonHalo.visible = this.moonDisc.visible = night;
    this.sunGlow.visible = this.sunCore.visible = dusk;
  }

  _tint(hex, warm) {
    const c = new THREE.Color(hex);
    c.lerp(new THREE.Color(0xffd9a8), warm);
    return c;
  }

  _applyPalette(style, time, depthBlur) {
    const scene = this.scene;
    const s = SKY[style] || SKY.clay;
    const t = TIME[time] || TIME.day;
    document.body.dataset.time = time in TIME ? time : 'day';
    if (t.night) {
      this.skyMat.uniforms.top.value = new THREE.Color(0x1c2436);
      this.skyMat.uniforms.bottom.value = new THREE.Color(0x2c3648);
      scene.fog.color = new THREE.Color(0x1a212f);
      this.hemi.color.set(0x46577c); this.hemi.groundColor.set(0x161a24);
    } else {
      this.skyMat.uniforms.top.value = this._tint(s.top, t.warm * 0.5);
      this.skyMat.uniforms.bottom.value = this._tint(s.bottom, t.warm * 0.5);
      scene.fog.color = this._tint(s.fog, t.warm * 0.5);
      this.hemi.color.set(0xffffff); this.hemi.groundColor.set(0xcdbfae);
    }
    const strong = style === 'painterly';
    if (depthBlur || strong) { scene.fog.near = strong ? 7 : 10; scene.fog.far = strong ? 24 : 30; }
    else { scene.fog.near = 22; scene.fog.far = 70; }
    if (t.night) { scene.fog.near = 6; scene.fog.far = 24; }

    this.sun.position.set(...t.sunPos);
    this.sun.color.set(t.sunCol);
    this.sun.intensity = t.sunInt;
    this._setSkyBodies(time);
    this.fill.intensity = t.fill;
    this.hemi.intensity = t.hemi;
    this.renderer.toneMappingExposure = t.exposure;
    this.screenGlow.intensity = t.glow || 0;
    const lampOn = t.lampInt || 0;
    this.lampLight.intensity = lampOn;
    this.lamp.userData.bulb.material.emissiveIntensity = lampOn > 0 ? 0.7 + lampOn * 0.35 : 0;
  }

  _initTweaksBridge() {
    this.applyTweaks(this.cur);
  }

  // Called by the React scene-settings dock. Accepts a partial patch, merges
  // it into the current tweak state, and re-applies whatever changed.
  applyTweaks(tw) {
    const next = { ...this.cur, ...tw };
    if (!this._alive) { this.cur = next; return; }
    if (next.garden !== this.cur.garden || !this.gardenGroup) this._setGarden(next.garden);
    this._applyPalette(next.garden, next.timeOfDay, next.depthBlur);
    if (next.deskColor && next.deskColor !== this.cur.deskColor) this.clay.color.set(next.deskColor);
    this.controls.autoRotate = !!next.autoRotate;
    this.cur = next;
  }

  backToDesk() {
    if (this.portfolioEl) this.portfolioEl.scrollTop = 0;
    this._setZoomTarget(0);
  }

  _initDive() {
    const scene = this.scene;
    const camera = this.camera;
    const monitorDisplay = this.monitorDisplay;

    scene.updateMatrixWorld(true);
    const _q = new THREE.Quaternion();
    const dispPos = new THREE.Vector3();
    monitorDisplay.getWorldPosition(dispPos);
    const dispNormal = new THREE.Vector3(0, 0, 1)
      .applyQuaternion(monitorDisplay.getWorldQuaternion(_q)).normalize();
    const endTarget = dispPos.clone();
    const endPos = dispPos.clone().addScaledVector(dispNormal, 1.32);
    // head-on framing the camera settles into (phase 1) before diving (phase 2)
    const frontPos = dispPos.clone().addScaledVector(dispNormal, 4.2);
    this._p1 = new THREE.Vector3();
    this._t1 = new THREE.Vector3();
    this.ALIGN = 0.34;  // fraction of the scroll spent squaring up to the screen
    this.endTarget = endTarget;
    this.endPos = endPos;
    this.frontPos = frontPos;

    // world-space corners of the display plane (PlaneGeometry 1.04 x 0.685),
    // used to project the screen's on-screen rectangle so the HTML portfolio
    // can grow directly out of it as we fly in.
    const _hx = 0.654, _hy = 0.3425;
    this.worldCorners = [
      new THREE.Vector3(-_hx,  _hy, 0),
      new THREE.Vector3( _hx,  _hy, 0),
      new THREE.Vector3( _hx, -_hy, 0),
      new THREE.Vector3(-_hx, -_hy, 0),
    ].map((v) => v.applyMatrix4(monitorDisplay.matrixWorld));
    this._proj = new THREE.Vector3();

    this.zoom = 0; this.zoomTarget = 0; this.prevZoom = 0; this.ready = false;
    this.startPos = new THREE.Vector3();
    this.startTarget = new THREE.Vector3();
    this._tmpT = new THREE.Vector3();

    this.atTopCount = 0;
    const portfolioEl = this.portfolioEl;
    this._onPortfolioScroll = () => {
      const scrollTop = portfolioEl.scrollTop;
      if (scrollTop === 0) {
        this.atTopCount++;
        if (this.atTopCount >= 2) this._setZoomTarget(0);
      } else {
        this.atTopCount = 0;
      }
    };
    portfolioEl.addEventListener('scroll', this._onPortfolioScroll);
    portfolioEl.style.transformOrigin = '0 0';
    portfolioEl.style.willChange = 'transform, opacity';
  }

  _projectScreenRect() {
    const camera = this.camera;
    camera.updateMatrixWorld();
    let minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
    const W = window.innerWidth, H = window.innerHeight;
    for (const c of this.worldCorners) {
      this._proj.copy(c).project(camera);
      const sx = (this._proj.x * 0.5 + 0.5) * W;
      const sy = (-this._proj.y * 0.5 + 0.5) * H;
      minx = Math.min(minx, sx); maxx = Math.max(maxx, sx);
      miny = Math.min(miny, sy); maxy = Math.max(maxy, sy);
    }
    return { x: minx, y: miny, w: maxx - minx, h: maxy - miny };
  }

  _setZoomTarget(v) { this.zoomTarget = clamp01(v); }

  _initInteraction() {
    const SENS = 0.0016;
    this._onWheel = (e) => {
      if (!this.ready) return;
      if (this.zoomTarget < 0.999) {
        e.preventDefault();
        this._setZoomTarget(this.zoomTarget + e.deltaY * SENS);
      } else if (e.deltaY < 0 && this.portfolioEl.scrollTop <= 0) {
        e.preventDefault();
        this._setZoomTarget(this.zoomTarget + e.deltaY * SENS);
      }
    };
    addEventListener('wheel', this._onWheel, { passive: false });

    this._touchY = null;
    this._onTouchStart = (e) => { this._touchY = e.touches[0].clientY; };
    addEventListener('touchstart', this._onTouchStart, { passive: true });
    this._onTouchMove = (e) => {
      if (!this.ready || this._touchY == null) return;
      const y = e.touches[0].clientY;
      const dy = this._touchY - y; this._touchY = y;
      if (this.zoomTarget < 0.999) { e.preventDefault(); this._setZoomTarget(this.zoomTarget + dy * 0.0019); }
      else if (dy < 0 && this.portfolioEl.scrollTop <= 0) { e.preventDefault(); this._setZoomTarget(this.zoomTarget + dy * 0.0019); }
    };
    addEventListener('touchmove', this._onTouchMove, { passive: false });
  }

  _updateDive() {
    const { camera, controls } = this;
    this.zoom += (this.zoomTarget - this.zoom) * 0.12;
    if (Math.abs(this.zoomTarget - this.zoom) < 0.0004) this.zoom = this.zoomTarget;

    if (this.prevZoom <= 0.0006 && this.zoom > 0.0006) {
      this.startPos.copy(camera.position);
      this.startTarget.copy(controls.target);
    }

    if (this.zoom > 0.0006) {
      controls.enabled = false;
      const align = clamp01(this.zoom / this.ALIGN);
      const dive = clamp01((this.zoom - this.ALIGN) / (1 - this.ALIGN));
      const ae = easeInOut(align);
      this._p1.lerpVectors(this.startPos, this.frontPos, ae);
      this._t1.lerpVectors(this.startTarget, this.endTarget, ae);
      const de = easeInOut(dive);
      camera.position.lerpVectors(this._p1, this.endPos, de);
      this._tmpT.lerpVectors(this._t1, this.endTarget, de);
      camera.lookAt(this._tmpT);
    } else {
      if (!controls.enabled) { controls.enabled = true; controls.target.copy(this.startTarget); }
      controls.update();
    }
    this.prevZoom = this.zoom;

    // Two chained phases from one scroll value:
    //   align (0 → ALIGN): glide from the orbiting pose to a head-on framing
    //   dive  (ALIGN → 1):  fly through the screen, bezel and all
    const dive = clamp01((this.zoom - this.ALIGN) / (1 - this.ALIGN));

    // The framed monitor stays glued to its real on-screen rectangle for most of
    // the dive — so the camera's forward push zooms the WHOLE scene toward you as
    // one — and only fills the viewport in the final stretch, when the bezel
    // whooshes past the edges and the page takes over full-bleed.
    const fill = easeInOut(clamp01((dive - 0.72) / 0.28));
    const W = window.innerWidth, H = window.innerHeight;
    const r = this._projectScreenRect();
    const rx = r.x * (1 - fill);
    const ry = r.y * (1 - fill);
    const rw = r.w + (W - r.w) * fill;
    const rh = r.h + (H - r.h) * fill;
    const portfolioEl = this.portfolioEl;
    portfolioEl.style.transform =
      `translate(${rx.toFixed(2)}px, ${ry.toFixed(2)}px) scale(${(rw / W).toFixed(4)}, ${(rh / H).toFixed(4)})`;
    portfolioEl.style.opacity = clamp01((dive - 0.02) / 0.3).toFixed(3);
    portfolioEl.classList.toggle('active', this.zoom > 0.985);

    if (this.enterCueEl) this.enterCueEl.classList.toggle('hidden', this.zoom > 0.04);
    if (this.hintEl && this.zoom > 0.04) this.hintEl.classList.add('hidden');
  }

  _initReveal() {
    this._hintTimeout = setTimeout(() => this.hintEl && this.hintEl.classList.add('hidden'), 7000);

    const loading = this.loadingEl;
    this._loadingRaf = requestAnimationFrame(() => {
      this._loadingRaf = requestAnimationFrame(() => loading && loading.classList.add('hidden'));
    });
    this._loadingTimeout = setTimeout(() => { if (loading) loading.style.display = 'none'; this.ready = true; }, 900);
  }

  _syncSize() {
    const s = this._viewportSize();
    this.camera.aspect = s.w / s.h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(s.w, s.h);
  }

  _initResizeLoop() {
    this._onResize = () => this._syncSize();
    addEventListener('resize', this._onResize);
    if (document.readyState === 'complete') this._syncSize(); else addEventListener('load', this._onResize);
    this._resizeTimeouts = [
      requestAnimationFrame(() => this._syncSize()),
      setTimeout(() => this._syncSize(), 0),
      setTimeout(() => this._syncSize(), 150),
      setTimeout(() => this._syncSize(), 600),
    ];

    const tick = () => {
      if (!this._alive) return;
      this._updateDive();
      if (this.stars.visible) this.starMat.opacity = 0.72 + 0.24 * Math.sin(performance.now() * 0.0012);
      if (this.zoom < 0.992) this.renderer.render(this.scene, this.camera);
      this._tickRaf = requestAnimationFrame(tick);
    };
    this._tickRaf = requestAnimationFrame(tick);
  }

  unmount() {
    this._alive = false;
    if (this._tickRaf) cancelAnimationFrame(this._tickRaf);
    if (this._loadingRaf) cancelAnimationFrame(this._loadingRaf);
    if (this._hintTimeout) clearTimeout(this._hintTimeout);
    if (this._loadingTimeout) clearTimeout(this._loadingTimeout);
    if (this._resizeTimeouts) {
      this._resizeTimeouts.forEach((id) => { cancelAnimationFrame(id); clearTimeout(id); });
    }
    if (this._onResize) { window.removeEventListener('resize', this._onResize); window.removeEventListener('load', this._onResize); }
    if (this._onWheel) window.removeEventListener('wheel', this._onWheel);
    if (this._onTouchStart) window.removeEventListener('touchstart', this._onTouchStart);
    if (this._onTouchMove) window.removeEventListener('touchmove', this._onTouchMove);
    if (this._onPortfolioScroll && this.portfolioEl) this.portfolioEl.removeEventListener('scroll', this._onPortfolioScroll);
    if (this.pmrem) this.pmrem.dispose();
    if (this.renderer) this.renderer.dispose();
  }
}
