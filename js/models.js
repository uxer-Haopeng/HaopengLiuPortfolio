// models.js — clay furniture & desk props built from rounded primitives.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// ---------- geometry helpers ----------
export function rbox(w, h, d, r = 0.06, seg = 5) {
  return new RoundedBoxGeometry(w, h, d, seg, r);
}
function cyl(rt, rb, h, seg = 32, open = false) {
  return new THREE.CylinderGeometry(rt, rb, h, seg, 1, open);
}
function sph(r, w = 28, h = 20) { return new THREE.SphereGeometry(r, w, h); }
function cap(r, len, seg = 14) { return new THREE.CapsuleGeometry(r, len, seg, 24); }

function mesh(geo, m) {
  const o = new THREE.Mesh(geo, m);
  o.castShadow = true; o.receiveShadow = true;
  return o;
}

// =====================================================================
// DESK
// =====================================================================
export function buildDesk(m) {
  const g = new THREE.Group();
  const legH = 0.92, topT = 0.16;
  const topW = 2.6, topD = 1.18;

  const top = mesh(rbox(topW, topT, topD, 0.08), m);
  top.position.y = legH + topT / 2;
  g.add(top);

  // chunky rounded legs, very slightly tapered look via rounded boxes
  const legGeo = rbox(0.22, legH, 0.22, 0.09);
  const lx = topW / 2 - 0.26, lz = topD / 2 - 0.24;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const leg = mesh(legGeo, m);
    leg.position.set(sx * lx, legH / 2, sz * lz);
    g.add(leg);
  }
  g.userData.topY = legH + topT;       // surface height
  return g;
}

// =====================================================================
// MONITOR
// =====================================================================
export function buildMonitor(m, screenMat) {
  const g = new THREE.Group();
  const screen = mesh(rbox(1.448, 0.82, 0.09, 0.06), m);
  screen.position.y = 0.62;
  screen.rotation.x = -0.06;
  g.add(screen);

  // glowing display panel inset on the front face (the "portal" we dive into)
  const display = new THREE.Mesh(
    new THREE.PlaneGeometry(1.308, 0.685),
    screenMat || new THREE.MeshBasicMaterial({ color: 0x2a2622 })
  );
  display.position.z = 0.047;
  display.castShadow = false; display.receiveShadow = false;
  screen.add(display);
  g.userData.display = display;

  const neck = mesh(rbox(0.1, 0.18, 0.08, 0.03), m);
  neck.position.y = 0.21;
  g.add(neck);

  const foot = mesh(cyl(0.2, 0.24, 0.06, 32), m);
  foot.position.y = 0.04;
  foot.scale.z = 0.7;
  g.add(foot);
  return g;
}

// =====================================================================
// KEYBOARD
// =====================================================================
export function buildKeyboard(m) {
  const g = new THREE.Group();
  const base = mesh(rbox(1.0, 0.07, 0.36, 0.035), m);
  base.position.y = 0.035;
  g.add(base);

  const cols = 13, rows = 4;
  const kw = 0.058, kd = 0.058, gap = 0.012;
  const keyGeo = rbox(kw, 0.05, kd, 0.018);
  const startX = -((cols - 1) * (kw + gap)) / 2;
  const startZ = -((rows - 1) * (kd + gap)) / 2;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // skip a couple to suggest a spacebar gap on bottom row
      const k = mesh(keyGeo, m);
      k.position.set(startX + c * (kw + gap), 0.085, startZ + r * (kd + gap));
      k.castShadow = true; k.receiveShadow = true;
      g.add(k);
    }
  }
  return g;
}

// =====================================================================
// MOUSEPAD / soft tray
// =====================================================================
export function buildTray(m) {
  const g = new THREE.Group();
  const pad = mesh(rbox(0.52, 0.07, 0.44, 0.06), m);
  pad.position.y = 0.035;
  g.add(pad);
  return g;
}

// =====================================================================
// DRAWERS (freestanding 3-drawer cabinet) + books on top
// =====================================================================
export function buildDrawers(m) {
  const g = new THREE.Group();
  const W = 0.78, H = 0.96, D = 0.66;
  const body = mesh(rbox(W, H, D, 0.06), m);
  body.position.y = H / 2;
  g.add(body);

  const dh = 0.27;
  for (let i = 0; i < 3; i++) {
    const front = mesh(rbox(W - 0.12, dh - 0.04, 0.05, 0.04), m);
    front.position.set(0, 0.16 + i * dh, D / 2 + 0.005);
    g.add(front);
    const knob = mesh(sph(0.035), m);
    knob.position.set(0, 0.16 + i * dh, D / 2 + 0.06);
    g.add(knob);
  }

  // stacked books + little organizer on top
  const books = new THREE.Group();
  const b1 = mesh(rbox(0.5, 0.07, 0.34, 0.02), m); b1.position.set(-0.04, H + 0.035, 0.02); b1.rotation.y = 0.12; books.add(b1);
  const b2 = mesh(rbox(0.46, 0.06, 0.32, 0.02), m); b2.position.set(0.02, H + 0.095, -0.01); b2.rotation.y = -0.05; books.add(b2);
  const tray = mesh(rbox(0.3, 0.08, 0.22, 0.03), m); tray.position.set(0.16, H + 0.04, 0.18); books.add(tray);
  g.add(books);
  return g;
}

// =====================================================================
// CHAIR (cute, splayed legs)
// =====================================================================
export function buildChair(m) {
  const g = new THREE.Group();
  const seatH = 0.62;
  const seat = mesh(rbox(0.66, 0.14, 0.6, 0.07), m);
  seat.position.y = seatH;
  g.add(seat);

  // backrest: rounded panel tilted back, on two posts
  const back = mesh(rbox(0.6, 0.62, 0.12, 0.09), m);
  back.position.set(0, seatH + 0.5, -0.26);
  back.rotation.x = 0.14;
  g.add(back);
  for (const sx of [-1, 1]) {
    const post = mesh(cyl(0.04, 0.045, 0.42, 18), m);
    post.position.set(sx * 0.22, seatH + 0.2, -0.24);
    post.rotation.x = 0.1;
    g.add(post);
  }

  // four splayed tapered legs
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const leg = mesh(cyl(0.035, 0.06, seatH + 0.04, 18), m);
    const tilt = 0.17;
    leg.position.set(sx * 0.24, (seatH) / 2 - 0.02, sz * 0.22);
    leg.rotation.z = -sx * tilt;
    leg.rotation.x = sz * tilt;
    g.add(leg);
  }
  return g;
}

// =====================================================================
// FLOOR LAMP
// =====================================================================
export function buildLamp(m) {
  const g = new THREE.Group();
  const base = mesh(cyl(0.26, 0.3, 0.06, 40), m);
  base.position.y = 0.03;
  g.add(base);
  const pole = mesh(cyl(0.035, 0.04, 2.0, 20), m);
  pole.position.y = 1.0;
  g.add(pole);
  // truncated-cone shade (open)
  const shade = mesh(cyl(0.24, 0.36, 0.46, 40, true), m);
  shade.position.y = 2.05;
  g.add(shade);
  const cap = mesh(cyl(0.24, 0.24, 0.02, 40), m);
  cap.position.y = 2.28;
  g.add(cap);
  return g;
}

// =====================================================================
// WALL CLOCK (floating)
// =====================================================================
export function buildClock(m) {
  const g = new THREE.Group();
  const body = mesh(cyl(0.42, 0.42, 0.1, 48), m);
  body.rotation.x = Math.PI / 2;
  g.add(body);
  const rim = mesh(new THREE.TorusGeometry(0.42, 0.05, 20, 48), m);
  rim.position.z = 0.02;
  g.add(rim);
  const center = mesh(sph(0.04), m);
  center.position.z = 0.07;
  g.add(center);
  const h1 = mesh(rbox(0.05, 0.26, 0.04, 0.02), m);
  h1.position.set(0, 0.1, 0.07);
  g.add(h1);
  const h2 = mesh(rbox(0.05, 0.2, 0.04, 0.02), m);
  h2.position.set(0.09, -0.02, 0.07);
  h2.rotation.z = -1.1;
  g.add(h2);
  return g;
}

// =====================================================================
// PEGBOARD with shelf, notes, push pins + small plant
// =====================================================================
export function buildPegboard(m) {
  const g = new THREE.Group();
  const W = 1.9, H = 1.5, t = 0.05;
  // outer frame
  const frame = mesh(rbox(W, H, t, 0.04), m);
  frame.scale.set(1, 1, 1);
  // hollow look: make it a thin border by adding bars instead of solid panel.
  // We'll skip a solid back and build a grid of bars.
  const bar = 0.035;
  const cols = 6, rows = 5;
  // vertical bars
  for (let i = 0; i <= cols; i++) {
    const x = -W / 2 + (i * W) / cols;
    const v = mesh(rbox(bar, H, bar, 0.012), m);
    v.position.set(x, 0, 0);
    g.add(v);
  }
  for (let j = 0; j <= rows; j++) {
    const y = -H / 2 + (j * H) / rows;
    const hbar = mesh(rbox(W, bar, bar, 0.012), m);
    hbar.position.set(0, y, 0);
    g.add(hbar);
  }

  // little shelf near top-right of board
  const shelf = mesh(rbox(0.62, 0.05, 0.22, 0.025), m);
  shelf.position.set(0.42, 0.52, 0.13);
  g.add(shelf);

  // two paper notes pinned
  const note1 = mesh(rbox(0.34, 0.4, 0.02, 0.015), m);
  note1.position.set(-0.55, 0.06, 0.06);
  note1.rotation.z = 0.12;
  g.add(note1);
  const pin1 = mesh(sph(0.04), m); pin1.position.set(-0.55, 0.22, 0.1); g.add(pin1);

  const note2 = mesh(rbox(0.3, 0.36, 0.02, 0.015), m);
  note2.position.set(0.0, 0.0, 0.06);
  note2.rotation.z = -0.05;
  g.add(note2);
  const pin2 = mesh(sph(0.04), m); pin2.position.set(0.0, 0.14, 0.1); g.add(pin2);

  return g;
}

// =====================================================================
// PLANTS
// =====================================================================
// Bulbous pot with aloe-style leaves
export function buildAloe(m) {
  const g = new THREE.Group();
  const pot = mesh(sph(0.2), m);
  pot.scale.set(1, 0.95, 1);
  pot.position.y = 0.17;
  g.add(pot);
  const rim = mesh(cyl(0.16, 0.18, 0.06, 28), m);
  rim.position.y = 0.32;
  g.add(rim);
  // upright tapered leaves fanning gently outward from the pot
  const n = 8;
  for (let i = 0; i < n; i++) {
    const len = 0.46 + (i % 3) * 0.07;
    const leaf = mesh(new THREE.ConeGeometry(0.045, len, 12), m);
    const a = (i / n) * Math.PI * 2 + 0.3;
    const lean = 0.26;
    // pivot the leaf around the pot base so it grows up-and-out, not drooping
    leaf.geometry.translate(0, len / 2, 0);
    leaf.position.set(Math.cos(a) * 0.05, 0.36, Math.sin(a) * 0.05);
    leaf.rotation.z = Math.cos(a) * lean;
    leaf.rotation.x = -Math.sin(a) * lean;
    leaf.scale.set(0.85, 1, 0.42);
    g.add(leaf);
  }
  // a couple of straight central blades
  for (const off of [-0.03, 0.03]) {
    const c = mesh(new THREE.ConeGeometry(0.04, 0.6, 12), m);
    c.geometry.translate(0, 0.3, 0);
    c.position.set(off, 0.36, off);
    c.scale.set(0.8, 1, 0.42);
    g.add(c);
  }
  return g;
}

// Small pot with spiky grass (for pegboard shelf)
export function buildGrassPot(m) {
  const g = new THREE.Group();
  const pot = mesh(cyl(0.1, 0.08, 0.14, 24), m);
  pot.position.y = 0.07;
  g.add(pot);
  const n = 11;
  for (let i = 0; i < n; i++) {
    const blade = mesh(new THREE.ConeGeometry(0.018, 0.34, 8), m);
    const a = (i / n) * Math.PI * 2;
    blade.position.set(Math.cos(a) * 0.03, 0.27, Math.sin(a) * 0.03);
    blade.rotation.z = Math.cos(a) * 0.34;
    blade.rotation.x = -Math.sin(a) * 0.34;
    g.add(blade);
  }
  return g;
}

// =====================================================================
// DESK ACCESSORIES
// =====================================================================
export function buildSpeaker(m) {
  const g = new THREE.Group();
  const box = mesh(rbox(0.24, 0.36, 0.22, 0.04), m);
  box.position.y = 0.18;
  box.rotation.x = -0.08;
  g.add(box);
  const driver = mesh(cyl(0.07, 0.07, 0.03, 28), m);
  driver.rotation.x = Math.PI / 2 - 0.08;
  driver.position.set(0, 0.21, 0.115);
  g.add(driver);
  const tweeter = mesh(sph(0.03), m);
  tweeter.position.set(0, 0.31, 0.1);
  g.add(tweeter);
  return g;
}

export function buildPenHolder(m) {
  const g = new THREE.Group();
  const cup = mesh(cyl(0.085, 0.075, 0.2, 28, true), m);
  cup.position.y = 0.1;
  g.add(cup);
  const bottom = mesh(cyl(0.075, 0.075, 0.02, 28), m);
  bottom.position.y = 0.01;
  g.add(bottom);
  const angles = [[0.04, 0.02], [-0.03, 0.04], [0.02, -0.03], [-0.02, -0.02]];
  angles.forEach((a, i) => {
    const pen = mesh(cyl(0.012, 0.014, 0.34, 12), m);
    pen.position.set(a[0], 0.26, a[1]);
    pen.rotation.z = a[0] * 2.2;
    pen.rotation.x = -a[1] * 2.2;
    g.add(pen);
  });
  return g;
}

export function buildCoffee(m) {
  const g = new THREE.Group();
  const cup = mesh(cyl(0.13, 0.1, 0.28, 32), m);
  cup.position.y = 0.14;
  g.add(cup);
  const lid = mesh(cyl(0.145, 0.145, 0.04, 32), m);
  lid.position.y = 0.29;
  g.add(lid);
  const dome = mesh(sph(0.13, 24, 14), m);
  dome.scale.y = 0.45;
  dome.position.y = 0.31;
  g.add(dome);
  return g;
}

// =====================================================================
// CAT TREE  (returns { group, perchY } so the cat can sit on top)
// =====================================================================
export function buildCatTree(m) {
  const g = new THREE.Group();

  // base
  const base = mesh(rbox(0.64, 0.09, 0.64, 0.06), m);
  base.position.y = 0.045;
  g.add(base);

  // main post
  const postH = 1.12;
  const post = mesh(cyl(0.09, 0.1, postH, 24), m);
  post.position.y = 0.09 + postH / 2;
  g.add(post);

  // lower perch + its little support post
  const supH = 0.5;
  const sup = mesh(cyl(0.055, 0.06, supH, 18), m);
  sup.position.set(0.27, 0.09 + supH / 2, -0.06);
  g.add(sup);
  const perch = mesh(cyl(0.18, 0.18, 0.06, 28), m);
  perch.position.set(0.27, 0.09 + supH, -0.06);
  g.add(perch);
  const perchRim = mesh(new THREE.TorusGeometry(0.17, 0.028, 14, 30), m);
  perchRim.rotation.x = Math.PI / 2;
  perchRim.position.set(0.27, 0.09 + supH + 0.03, -0.06);
  g.add(perchRim);

  // top bed (round platform with a soft raised rim)
  const topY = 0.09 + postH;
  const bed = mesh(cyl(0.3, 0.3, 0.08, 32), m);
  bed.position.y = topY + 0.04;
  g.add(bed);
  const rim = mesh(new THREE.TorusGeometry(0.29, 0.045, 16, 36), m);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = topY + 0.08;
  g.add(rim);

  // dangling toy on a string under the top bed
  const string = mesh(cyl(0.008, 0.008, 0.26, 8), m);
  string.position.set(-0.34, topY - 0.05, 0.0);
  g.add(string);
  const ball = mesh(sph(0.05), m);
  ball.position.set(-0.34, topY - 0.2, 0.0);
  g.add(ball);

  g.userData.perchY = topY + 0.1;   // where the cat rests
  return g;
}

// =====================================================================
// CAT  (a sleeping clay loaf — head up, tail curled around)
// =====================================================================
export function buildCat(m) {
  const g = new THREE.Group();

  // body — a rounded loaf
  const body = mesh(sph(0.2, 30, 22), m);
  body.scale.set(1.55, 0.92, 1.12);
  body.position.set(-0.04, 0.15, 0);
  g.add(body);

  // haunch (back hip rounding)
  const hip = mesh(sph(0.16, 24, 18), m);
  hip.scale.set(1.0, 0.95, 1.05);
  hip.position.set(-0.26, 0.15, 0);
  g.add(hip);

  // head
  const head = mesh(sph(0.145, 28, 22), m);
  head.position.set(0.27, 0.22, 0);
  g.add(head);

  // ears
  for (const sz of [-1, 1]) {
    const ear = mesh(new THREE.ConeGeometry(0.06, 0.13, 16), m);
    ear.position.set(0.28, 0.345, sz * 0.075);
    ear.rotation.z = -0.15;
    ear.rotation.x = -sz * 0.2;
    g.add(ear);
  }

  // muzzle + nose
  const muzzle = mesh(sph(0.07, 20, 16), m);
  muzzle.scale.set(0.9, 0.7, 1.1);
  muzzle.position.set(0.37, 0.18, 0);
  g.add(muzzle);

  // tucked front paws
  for (const sz of [-1, 1]) {
    const paw = mesh(sph(0.06, 16, 12), m);
    paw.scale.set(1.4, 0.7, 0.8);
    paw.position.set(0.3, 0.075, sz * 0.085);
    g.add(paw);
  }

  // curled tail wrapping around the front
  const tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.4, 0.13, 0.02),
    new THREE.Vector3(-0.42, 0.1, 0.22),
    new THREE.Vector3(-0.24, 0.09, 0.32),
    new THREE.Vector3(0.04, 0.1, 0.3),
    new THREE.Vector3(0.26, 0.11, 0.2),
  ]);
  const tail = mesh(new THREE.TubeGeometry(tailCurve, 30, 0.05, 12, false), m);
  g.add(tail);

  return g;
}

