// main.js — scene assembly, lighting, palettes, controls, tweaks bridge.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import * as M from './models.js';
import { buildGarden } from './garden.js';

const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
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
const camera = new THREE.PerspectiveCamera(33, window.innerWidth / window.innerHeight, 0.1, 200);
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
  c.width = 1024; c.height = 684;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  function draw() {
    const x = c.getContext('2d');
    x.fillStyle = '#efe7df'; x.fillRect(0, 0, 1024, 684);
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
    x.fillStyle = '#3a332b'; x.font = '400 76px "Instrument Serif", Georgia, serif';
    x.fillText('Designing calm,', 60, 252);
    x.fillText('usable software.', 60, 330);
    x.fillStyle = '#8b8072'; x.font = '400 23px "Hanken Grotesk", system-ui, sans-serif';
    x.fillText('Selected work, case studies & process.', 64, 402);
    const cy = 462, cw = 288, ch = 150, gap = 24, x0 = 64;
    const accents = ['#e3a886', '#cdbf98', '#9fb287'];
    for (let i = 0; i < 3; i++) {
      const cx = x0 + i * (cw + gap);
      x.fillStyle = '#f5efe6'; rr(x, cx, cy, cw, ch, 20); x.fill();
      x.strokeStyle = 'rgba(58,51,43,.10)'; x.lineWidth = 1; rr(x, cx, cy, cw, ch, 20); x.stroke();
      x.fillStyle = accents[i]; rr(x, cx + 20, cy + 20, cw - 40, 72, 12); x.fill();
      x.fillStyle = '#6f6657'; x.font = '600 17px "Hanken Grotesk", sans-serif';
      x.fillText('Case study 0' + (i + 1), cx + 20, cy + 112);
      x.fillStyle = '#a99f8d'; x.font = '400 13px "Space Mono", monospace';
      x.fillText('UX · 202' + (5 - i), cx + 20, cy + 134);
    }
    x.fillStyle = '#b3a896'; x.font = '700 15px "Space Mono", monospace';
    x.textAlign = 'center'; x.fillText('—  scroll to enter  —', 512, 650); x.textAlign = 'left';
    tex.needsUpdate = true;
  }
  draw();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
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
  fill.intensity = t.fill;
  hemi.intensity = t.hemi;
  renderer.toneMappingExposure = t.exposure;
  screenGlow.intensity = t.glow || 0;
}

// ---------- tweaks bridge ----------
let cur = { garden: 'clay', timeOfDay: 'day', deskColor: '#ece4d9', autoRotate: false, depthBlur: true };
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

let zoom = 0, zoomTarget = 0, prevZoom = 0, ready = false;
const startPos = new THREE.Vector3();
const startTarget = new THREE.Vector3();
const _tmpT = new THREE.Vector3();
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (v) => Math.max(0, Math.min(1, v));

const portfolioEl = document.getElementById('portfolio');
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
    const e = easeInOut(zoom);
    camera.position.lerpVectors(startPos, endPos, e);
    _tmpT.lerpVectors(startTarget, endTarget, e);
    camera.lookAt(_tmpT);
  } else {
    if (!controls.enabled) { controls.enabled = true; controls.target.copy(startTarget); }
    controls.update();
  }
  prevZoom = zoom;

  const p = clamp01((zoom - 0.5) / 0.42);
  portfolioEl.style.opacity = p.toFixed(3);
  portfolioEl.style.transform = `scale(${(1.05 - 0.05 * p).toFixed(3)})`;
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
addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function tick() {
  updateDive();
  if (zoom < 0.992) renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();
