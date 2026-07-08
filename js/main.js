// main.js — scene assembly, lighting, palettes, controls, tweaks bridge.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import * as M from './models.js';
import { buildGarden } from './garden.js';

const canvas = document.getElementById('scene');
function viewportSize() {
  return {
    w: Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1),
    h: Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1),
  };
}
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
{ const s0 = viewportSize(); renderer.setSize(s0.w, s0.h); }
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();

// soft indoor-ish environment for the clay shading
const pmrem = new THREE.PMREMGenerator(renderer);
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

scene.fog = new THREE.Fog(0xefe7df, 18, 55);

// ---------- camera + controls ----------
const camera = new THREE.PerspectiveCamera(33, viewportSize().w / viewportSize().h, 0.1, 200);
camera.position.set(-4.3, 3.05, 5.7);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.target.set(0.05, 0.95, 0.1);
controls.minDistance = 3.2;
controls.maxDistance = 14;
controls.maxPolarAngle = Math.PI / 2 - 0.04;  // don't dip under the floor
controls.minPolarAngle = 0.25;
controls.autoRotateSpeed = 0.7;
controls.enableZoom = false;   // wheel is repurposed for the dive-into-screen

// ---------- lights ----------
const hemi = new THREE.HemisphereLight(0xffffff, 0xcdbfae, 0.55);
scene.add(hemi);

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

const fill = new THREE.DirectionalLight(0xe8eeff, 0.35);
fill.position.set(-6, 4, 2);
scene.add(fill);

// ---------- clay material for the desk + props ----------
const clay = new THREE.MeshStandardMaterial({ color: 0xece4d9, roughness: 0.92, metalness: 0.0 });
clay.envMapIntensity = 0.55;

// ---------- monitor screen texture (portfolio preview) ----------
function rr(ctx, X, Y, W, H, R) {
  ctx.beginPath();
  ctx.moveTo(X + R, Y);
  ctx.arcTo(X + W, Y, X + W, Y + H, R);
  ctx.arcTo(X + W, Y + H, X, Y + H, R);
  ctx.arcTo(X, Y + H, X, Y, R);
  ctx.arcTo(X, Y, X + W, Y, R);
  ctx.closePath();
}
function makeScreenTexture() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 536;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
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
    console.log('[screen-preview] image loaded', shot.naturalWidth, shot.naturalHeight);
    const x = c.getContext('2d');
    x.fillStyle = '#f3f3f3'; x.fillRect(0, 0, 1024, 536);
    // image aspect now matches the screen plane 1:1 — draw edge-to-edge, no crop
    x.drawImage(shot, 0, 0, 1024, 536);
    tex.needsUpdate = true;
    imageReady = true;
    window.__screenTexDebug = { tex, canvas: c, imageReady };
    console.log('[screen-preview] canvas redrawn, tex.needsUpdate set');
  };
  shot.onerror = (e) => { console.error('[screen-preview] FAILED to load image', e, shot.src); };
  shot.src = new URL('./assets/screen-preview.png', import.meta.url).href;
  console.log('[screen-preview] requesting', shot.src);

  return tex;
}

// ---------- assemble the workstation ----------
const studio = new THREE.Group();
scene.add(studio);

const desk = M.buildDesk(clay);
studio.add(desk);
const topY = desk.userData.topY;

function place(obj, x, z, yaw = 0) {
  obj.position.set(x, topY, z);
  obj.rotation.y = yaw;
  studio.add(obj);
  return obj;
}

const screenMat = new THREE.MeshBasicMaterial({ map: makeScreenTexture() });
const monitor = M.buildMonitor(clay, screenMat);
place(monitor, 0.05, -0.24, 0.04);
const monitorDisplay = monitor.userData.display;
window.__monitorDebug = { screenMat, monitorDisplay };

// the monitor glows and lights the desk after dark
const screenGlow = new THREE.PointLight(0xffe7c4, 0, 4, 2);
screenGlow.position.set(0.1, topY + 0.62, 0.6);
scene.add(screenGlow);
place(M.buildKeyboard(clay), -0.06, 0.30, 0.02);
place(M.buildTray(clay), 0.84, 0.34, -0.05);
place(M.buildAloe(clay), -0.95, 0.10, 0);
place(M.buildSpeaker(clay), -0.5, 0.14, 0.22);
place(M.buildPenHolder(clay), 0.96, -0.06, 0);
place(M.buildCoffee(clay), 1.2, 0.24, 0);

// pegboard floats on the "wall" behind-left
const peg = M.buildPegboard(clay);
peg.position.set(-0.95, 1.62, -0.74);
peg.rotation.y = 0.06;
studio.add(peg);
// small plant sits on the pegboard shelf
const shelfPlant = M.buildGrassPot(clay);
shelfPlant.position.set(-0.53, 1.62 + 0.52 + 0.025, -0.74 + 0.13);
studio.add(shelfPlant);

// cat tree (floor-standing, back-right) with a sleeping clay cat on top
const catMat = new THREE.MeshStandardMaterial({ color: 0xe7dac6, roughness: 0.95, metalness: 0 });
catMat.envMapIntensity = 0.5;
const catTree = M.buildCatTree(clay);
catTree.position.set(3.1, 0, 0.35);
catTree.rotation.y = -1.0;
studio.add(catTree);
const cat = M.buildCat(catMat);
cat.position.set(3.1, catTree.userData.perchY, 0.35);
cat.rotation.y = -1.15;
studio.add(cat);

// floor lamp (its own base on the ground)
const lamp = M.buildLamp(clay);
lamp.position.set(2.55, 0, -0.15);
studio.add(lamp);

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
let gardenGroup = null;
function setGarden(style) {
  if (gardenGroup) { scene.remove(gardenGroup); gardenGroup.traverse(d => { if (d.geometry) d.geometry.dispose(); }); }
  gardenGroup = buildGarden(style);
  gardenGroup.traverse((o) => { if (o.material && o.material.envMapIntensity !== undefined) o.material.envMapIntensity = 0.4; });
  scene.add(gardenGroup);
}

// ---------- celestial bodies (stars + moon at night, sun at dusk) ----------
function discTexture(inner, outer, coreStop) {
  const cv = document.createElement('canvas'); cv.width = cv.height = 128;
  const g = cv.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, inner);
  grd.addColorStop(coreStop, inner);
  grd.addColorStop(1, outer);
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

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
  size: 0.6, map: discTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)', 0.28),
  transparent: true, depthWrite: false, fog: false, sizeAttenuation: true,
  opacity: 0.95, blending: THREE.AdditiveBlending,
});
const stars = new THREE.Points(starGeo, starMat);
skyBodies.add(stars);

// moon: soft halo + crisp disc, low on the horizon so it sits in frame
const moonPos = new THREE.Vector3(18, 8, -50);
const moonHalo = new THREE.Sprite(new THREE.SpriteMaterial({
  map: discTexture('rgba(226,234,255,0.9)', 'rgba(180,198,255,0)', 0.4),
  transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending,
}));
moonHalo.position.copy(moonPos); moonHalo.scale.set(13, 13, 1);
const moonDisc = new THREE.Sprite(new THREE.SpriteMaterial({
  map: discTexture('rgba(240,243,255,1)', 'rgba(240,243,255,0)', 0.78),
  transparent: true, depthWrite: false, fog: false,
}));
moonDisc.position.copy(moonPos); moonDisc.scale.set(4.6, 4.6, 1);
skyBodies.add(moonHalo, moonDisc);

// sun: low warm sunset glow + core
const sunPos2 = new THREE.Vector3(22, 6, -48);
const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({
  map: discTexture('rgba(255,204,150,0.95)', 'rgba(255,120,70,0)', 0.16),
  transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending,
}));
sunGlow.position.copy(sunPos2); sunGlow.scale.set(30, 30, 1);
const sunCore = new THREE.Sprite(new THREE.SpriteMaterial({
  map: discTexture('rgba(255,245,226,1)', 'rgba(255,200,140,0)', 0.5),
  transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending,
}));
sunCore.position.copy(sunPos2); sunCore.scale.set(9, 9, 1);
skyBodies.add(sunGlow, sunCore);

function setSkyBodies(time) {
  const night = time === 'night', dusk = time === 'dusk';
  stars.visible = night;
  moonHalo.visible = moonDisc.visible = night;
  sunGlow.visible = sunCore.visible = dusk;
}

// ---------- palettes (style x time) ----------
const SKY = {
  clay:      { top: 0xece2d6, bottom: 0xf4ede4, fog: 0xeee5da, ground: null },
  color:     { top: 0xbfe1f4, bottom: 0xedf6ec, fog: 0xd8ebe0 },
  painterly: { top: 0xd6e1cd, bottom: 0xeff0e2, fog: 0xdde5d2 },
};
const TIME = {
  day:   { sunPos: [5, 8.5, 3.5],  sunCol: 0xfff3e3, sunInt: 2.2, fill: 0.35, exposure: 1.0,  hemi: 0.55, warm: 0.0,  glow: 0.0 },
  dusk:  { sunPos: [7, 3, -2.5],   sunCol: 0xffc79a, sunInt: 1.7, fill: 0.3,  exposure: 0.96, hemi: 0.45, warm: 0.22, glow: 2.2 },
  night: { sunPos: [-5, 7, -3],    sunCol: 0x9fb6e0, sunInt: 0.5, fill: 0.14, exposure: 0.8,  hemi: 0.26, warm: 0.0,  glow: 6.5, night: true },
};

function tint(hex, warm) {
  const c = new THREE.Color(hex);
  c.lerp(new THREE.Color(0xffd9a8), warm);
  return c;
}

function applyPalette(style, time, depthBlur) {
  const s = SKY[style] || SKY.clay;
  const t = TIME[time] || TIME.day;
  if (t.night) {
    skyMat.uniforms.top.value = new THREE.Color(0x1f2636);
    skyMat.uniforms.bottom.value = new THREE.Color(0x37425a);
    scene.fog.color = new THREE.Color(0x28303f);
    hemi.color.set(0x54688f); hemi.groundColor.set(0x20242e);
  } else {
    skyMat.uniforms.top.value = tint(s.top, t.warm * 0.5);
    skyMat.uniforms.bottom.value = tint(s.bottom, t.warm * 0.5);
    scene.fog.color = tint(s.fog, t.warm * 0.5);
    hemi.color.set(0xffffff); hemi.groundColor.set(0xcdbfae);
  }
  const strong = style === 'painterly';
  if (depthBlur || strong) { scene.fog.near = strong ? 7 : 10; scene.fog.far = strong ? 24 : 30; }
  else { scene.fog.near = 22; scene.fog.far = 70; }

  sun.position.set(...t.sunPos);
  sun.color.set(t.sunCol);
  sun.intensity = t.sunInt;
  setSkyBodies(time);
  fill.intensity = t.fill;
  hemi.intensity = t.hemi;
  renderer.toneMappingExposure = t.exposure;
  screenGlow.intensity = t.glow || 0;
}

// ---------- tweaks bridge ----------
let cur = { garden: 'clay', timeOfDay: 'day', deskColor: '#ece4d9', autoRotate: true, depthBlur: true };
function apply(tw) {
  const next = { ...cur, ...tw };
  if (next.garden !== cur.garden || !gardenGroup) setGarden(next.garden);
  applyPalette(next.garden, next.timeOfDay, next.depthBlur);
  if (next.deskColor && next.deskColor !== cur.deskColor) clay.color.set(next.deskColor);
  controls.autoRotate = !!next.autoRotate;
  cur = next;
}
window.addEventListener('tweakschange', (e) => apply(e.detail || {}));
// Order-independent bridge: whichever of {this module, the React panel} loads
// second drives the first. React calls __applyTweaks when it exists; otherwise
// it leaves values on window.__tweaks for us to read here on init.
window.__applyTweaks = apply;
apply(window.__tweaks || cur);

// ---------- dive into the screen ----------
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
const _p1 = new THREE.Vector3();
const _t1 = new THREE.Vector3();
const ALIGN = 0.34;  // fraction of the scroll spent squaring up to the screen

// world-space corners of the display plane (PlaneGeometry 1.04 x 0.685),
// used to project the screen's on-screen rectangle so the HTML portfolio
// can grow directly out of it as we fly in.
const _hx = 0.654, _hy = 0.3425;
const worldCorners = [
  new THREE.Vector3(-_hx,  _hy, 0),
  new THREE.Vector3( _hx,  _hy, 0),
  new THREE.Vector3( _hx, -_hy, 0),
  new THREE.Vector3(-_hx, -_hy, 0),
].map((v) => v.applyMatrix4(monitorDisplay.matrixWorld));
const _proj = new THREE.Vector3();
function projectScreenRect() {
  camera.updateMatrixWorld();
  let minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
  const W = window.innerWidth, H = window.innerHeight;
  for (const c of worldCorners) {
    _proj.copy(c).project(camera);
    const sx = (_proj.x * 0.5 + 0.5) * W;
    const sy = (-_proj.y * 0.5 + 0.5) * H;
    minx = Math.min(minx, sx); maxx = Math.max(maxx, sx);
    miny = Math.min(miny, sy); maxy = Math.max(maxy, sy);
  }
  return { x: minx, y: miny, w: maxx - minx, h: maxy - miny };
}

let zoom = 0, zoomTarget = 0, prevZoom = 0, ready = false;
const startPos = new THREE.Vector3();
const startTarget = new THREE.Vector3();
const _tmpT = new THREE.Vector3();
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (v) => Math.max(0, Math.min(1, v));

const portfolioEl = document.getElementById('portfolio');
portfolioEl.style.transformOrigin = '0 0';
portfolioEl.style.willChange = 'transform, opacity';
const enterCue = document.getElementById('enterCue');
const hint = document.getElementById('hint');

function setZoomTarget(v) { zoomTarget = clamp01(v); }

const SENS = 0.0016;
addEventListener('wheel', (e) => {
  if (!ready) return;
  if (zoomTarget < 0.999) {
    e.preventDefault();
    setZoomTarget(zoomTarget + e.deltaY * SENS);
  } else if (e.deltaY < 0 && portfolioEl.scrollTop <= 0) {
    e.preventDefault();
    setZoomTarget(zoomTarget + e.deltaY * SENS);
  }
}, { passive: false });

let touchY = null;
addEventListener('touchstart', (e) => { touchY = e.touches[0].clientY; }, { passive: true });
addEventListener('touchmove', (e) => {
  if (!ready || touchY == null) return;
  const y = e.touches[0].clientY;
  const dy = touchY - y; touchY = y;
  if (zoomTarget < 0.999) { e.preventDefault(); setZoomTarget(zoomTarget + dy * 0.0019); }
  else if (dy < 0 && portfolioEl.scrollTop <= 0) { e.preventDefault(); setZoomTarget(zoomTarget + dy * 0.0019); }
}, { passive: false });

const backBtn = document.getElementById('backToDesk');
if (backBtn) backBtn.addEventListener('click', () => { portfolioEl.scrollTop = 0; setZoomTarget(0); });

function updateDive() {
  zoom += (zoomTarget - zoom) * 0.12;
  if (Math.abs(zoomTarget - zoom) < 0.0004) zoom = zoomTarget;

  if (prevZoom <= 0.0006 && zoom > 0.0006) {
    startPos.copy(camera.position);
    startTarget.copy(controls.target);
  }

  if (zoom > 0.0006) {
    controls.enabled = false;
    const align = clamp01(zoom / ALIGN);
    const dive = clamp01((zoom - ALIGN) / (1 - ALIGN));
    const ae = easeInOut(align);
    _p1.lerpVectors(startPos, frontPos, ae);
    _t1.lerpVectors(startTarget, endTarget, ae);
    const de = easeInOut(dive);
    camera.position.lerpVectors(_p1, endPos, de);
    _tmpT.lerpVectors(_t1, endTarget, de);
    camera.lookAt(_tmpT);
  } else {
    if (!controls.enabled) { controls.enabled = true; controls.target.copy(startTarget); }
    controls.update();
  }
  prevZoom = zoom;

  // Two chained phases from one scroll value:
  //   align (0 → ALIGN): glide from the orbiting pose to a head-on framing
  //   dive  (ALIGN → 1):  fly through the screen, bezel and all
  const dive = clamp01((zoom - ALIGN) / (1 - ALIGN));

  // The framed monitor stays glued to its real on-screen rectangle for most of
  // the dive — so the camera's forward push zooms the WHOLE scene toward you as
  // one — and only fills the viewport in the final stretch, when the bezel
  // whooshes past the edges and the page takes over full-bleed.
  const fill = easeInOut(clamp01((dive - 0.72) / 0.28));
  const W = window.innerWidth, H = window.innerHeight;
  const r = projectScreenRect();
  const rx = r.x * (1 - fill);
  const ry = r.y * (1 - fill);
  const rw = r.w + (W - r.w) * fill;
  const rh = r.h + (H - r.h) * fill;
  portfolioEl.style.transform =
    `translate(${rx.toFixed(2)}px, ${ry.toFixed(2)}px) scale(${(rw / W).toFixed(4)}, ${(rh / H).toFixed(4)})`;
  portfolioEl.style.opacity = clamp01((dive - 0.02) / 0.3).toFixed(3);
  portfolioEl.classList.toggle('active', zoom > 0.985);

  if (enterCue) enterCue.classList.toggle('hidden', zoom > 0.04);
  if (hint && zoom > 0.04) hint.classList.add('hidden');
}

setTimeout(() => hint && hint.classList.add('hidden'), 7000);

// reveal
const loading = document.getElementById('loading');
requestAnimationFrame(() => requestAnimationFrame(() => loading && loading.classList.add('hidden')));
setTimeout(() => { if (loading) loading.style.display = 'none'; ready = true; }, 900);

// ---------- resize + loop ----------
function syncSize() {
  const s = viewportSize();
  camera.aspect = s.w / s.h;
  camera.updateProjectionMatrix();
  renderer.setSize(s.w, s.h);
}
addEventListener('resize', syncSize);
if (document.readyState === 'complete') syncSize(); else addEventListener('load', syncSize);
requestAnimationFrame(syncSize);
setTimeout(syncSize, 0);
setTimeout(syncSize, 150);
setTimeout(syncSize, 600);

function tick() {
  updateDive();
  if (stars.visible) starMat.opacity = 0.72 + 0.24 * Math.sin(performance.now() * 0.0012);
  if (zoom < 0.992) renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();
