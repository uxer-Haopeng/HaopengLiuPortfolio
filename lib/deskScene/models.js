// models.js — clay furniture & desk props built from rounded primitives.
// Ported from the Claude Design "Desk Scene" prototype, near-verbatim.
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

  const neck = mesh(rbox(0.1, 0.16, 0.08, 0.03), m);
  neck.position.y = 0.15;
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
  // bulb (glows warm at night, dim/off in daylight)
  const bulbMat = new THREE.MeshStandardMaterial({
    color: 0xfff2d8, emissive: 0xffcf8a, emissiveIntensity: 0, roughness: 0.5,
  });
  const bulb = mesh(new THREE.SphereGeometry(0.09, 16, 12), bulbMat);
  bulb.position.y = 2.02;
  bulb.castShadow = false;
  g.add(bulb);
  g.userData.bulb = bulb;
  g.userData.bulbY = 2.02;
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
// BOOKSHELF with books and plants — books spine-out and stacked
// =====================================================================
export function buildPegboard(m) {
  const g = new THREE.Group();
  const W = 1.9, H = 1.5, D = 0.42, shelves = 3;

  // back panel
  const back = mesh(rbox(W, H, 0.04, 0.04), m);
  back.position.z = D * 0.25 - D / 2; // 25% of depth
  g.add(back);

  // left and right side panels
  for (const sx of [-1, 1]) {
    const side = mesh(rbox(0.04, H, D, 0.02), m);
    side.position.x = sx * (W / 2 - 0.02);
    g.add(side);
  }

  // horizontal shelves
  const shelfY = [-0.5, 0, 0.5];
  for (const y of shelfY) {
    const shelf = mesh(rbox(W - 0.08, 0.04, D, 0.02), m);
    shelf.position.y = y;
    g.add(shelf);
  }

  // SHELF 1 (bottom): flat stacked books left, spine-out books right
  // Flat book stack (left)
  let flatX = -0.7;
  const flatBooks = [
    { h: 0.26, d: 0.40, c: 0xc0b5a8 }, // light tan
    { h: 0.28, d: 0.40, c: 0xf0a8a8 }, // rose
    { h: 0.25, d: 0.40, c: 0xb5c5d8 }, // slate blue
  ];
  let flatY = -0.5 + 0.02;
  for (const spec of flatBooks) {
    const book = mesh(rbox(0.18, 0.06, spec.d, 0.015), m);
    book.position.set(flatX, flatY, 0.14);
    book.userData.color = spec.c;
    g.add(book);
    flatY += 0.065;
  }

  // Spine-out books (right of flat stack)
  const spineBooks1 = [
    { h: 0.32, c: 0xf4d4a8 }, // yellow
    { h: 0.29, c: 0xb8a8d8 }, // purple
    { h: 0.31, c: 0xa8c4d8 }, // blue
    { h: 0.28, c: 0xd8a8c8 }, // magenta
  ];
  let spineX = -0.3;
  for (const spec of spineBooks1) {
    const book = mesh(rbox(0.07, spec.h, 0.40, 0.015), m);
    book.position.set(spineX, -0.5 + spec.h / 2 + 0.02, 0.14);
    book.userData.color = spec.c;
    g.add(book);
    spineX += 0.09;
  }

  // SHELF 2 (middle): books standing upright, mixed arrangement
  const shelfBooks2 = [
    { x: -0.65, h: 0.35, w: 0.08, c: 0xd8a8a8 }, // rose
    { x: -0.52, h: 0.33, w: 0.075, c: 0xb8d8c8 }, // mint
    { x: -0.4, h: 0.37, w: 0.08, c: 0xa8b8d8 }, // periwinkle
    { x: -0.27, h: 0.32, w: 0.07, c: 0xd8c8a8 }, // tan
    { x: -0.12, h: 0.36, w: 0.08, c: 0xc8a8d8 }, // lavender
    { x: 0.08, h: 0.34, w: 0.075, c: 0xa8d8a8 }, // sage
    { x: 0.24, h: 0.35, w: 0.08, c: 0xd8a8a8 }, // mauve
    { x: 0.4, h: 0.33, w: 0.07, c: 0xa8d8d8 }, // cyan
    { x: 0.54, h: 0.36, w: 0.075, c: 0xd8d8a8 }, // pale yellow
  ];
  for (const spec of shelfBooks2) {
    const book = mesh(rbox(spec.w, spec.h, 0.40, 0.015), m);
    book.position.set(spec.x, 0 + spec.h / 2 + 0.02, 0.14);
    book.userData.color = spec.c;
    g.add(book);
  }

  // SHELF 3 (top): frame, books
  // A standing frame/photo on right
  const frame = mesh(rbox(0.28, 0.32, 0.02, 0.02), m);
  frame.position.set(0.65, 0.5 + 0.16, 0.14);
  frame.userData.color = 0xd4a478; // warm wood tone
  g.add(frame);

  // Frame back (white interior)
  const frameBack = mesh(rbox(0.24, 0.28, 0.008, 0.015), m);
  frameBack.position.set(0.65, 0.5 + 0.16, 0.152);
  frameBack.userData.color = 0xf5f5f0;
  g.add(frameBack);

  // Books standing on top shelf (left side)
  const shelfBooks3 = [
    { x: -0.55, h: 0.3, w: 0.075, c: 0xd8a8a8 },
    { x: -0.45, h: 0.28, w: 0.07, c: 0xb8d8a8 },
    { x: -0.36, h: 0.32, w: 0.08, c: 0xa8c8d8 },
  ];
  for (const spec of shelfBooks3) {
    const book = mesh(rbox(spec.w, spec.h, 0.40, 0.015), m);
    book.position.set(spec.x, 0.5 + spec.h / 2 + 0.02, 0.14);
    book.userData.color = spec.c;
    g.add(book);
  }



  return g;
}

// =====================================================================
// PHOTO FRAMES (two frames with cardboard kickstands, standing on desk)
// =====================================================================
export function buildPhotoFrames(m) {
  const g = new THREE.Group();

  // Larger frame (back-left)
  const frame1 = mesh(rbox(0.32, 0.42, 0.02, 0.02), m);
  frame1.position.set(-0.2, 0.25, 0);
  frame1.rotation.x = -0.12; // tilted back
  g.add(frame1);

  const frameBack1 = mesh(rbox(0.28, 0.38, 0.008, 0.015), m);
  frameBack1.position.set(-0.2, 0.25, 0.02);
  frameBack1.rotation.x = -0.12;
  g.add(frameBack1);

  // Kickstand for frame 1 (angled cardboard support)
  const stand1 = mesh(rbox(0.26, 0.32, 0.01, 0.008), m);
  stand1.position.set(-0.2, 0.08, -0.08);
  stand1.rotation.x = 0.45; // angled back
  g.add(stand1);

  // Smaller frame (front-right, separated)
  const frame2 = mesh(rbox(0.22, 0.28, 0.02, 0.015), m);
  frame2.position.set(0.28, 0.16, 0.04);
  frame2.rotation.x = -0.14; // tilted back more
  frame2.rotation.z = 0.03;
  g.add(frame2);

  const frameBack2 = mesh(rbox(0.18, 0.24, 0.008, 0.012), m);
  frameBack2.position.set(0.28, 0.16, 0.032);
  frameBack2.rotation.x = -0.14;
  g.add(frameBack2);

  // Kickstand for frame 2 (smaller angled support)
  const stand2 = mesh(rbox(0.16, 0.22, 0.01, 0.007), m);
  stand2.position.set(0.28, 0.05, -0.06);
  stand2.rotation.x = 0.48; // angled back slightly more
  g.add(stand2);

  return g;
}

// =====================================================================
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

// Fiddle-leaf-fig-style potted plant (for pegboard shelf) — wide pot,
// thin rising stem, big paddle-shaped leaves fanning out and up.
export function buildGrassPot(m) {
  const g = new THREE.Group();

  // wider terracotta-profile pot with a lipped rim
  const pot = mesh(cyl(0.115, 0.085, 0.15, 28), m);
  pot.position.y = 0.075;
  g.add(pot);
  const rim = mesh(new THREE.TorusGeometry(0.113, 0.014, 10, 28), m);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.145;
  g.add(rim);
  const soil = mesh(cyl(0.096, 0.096, 0.02, 28), m);
  soil.position.y = 0.148;
  g.add(soil);

  // stem rising from the soil, very slightly bent for an organic look
  const stemBaseY = 0.15, stemH = 0.42;
  const stemLower = mesh(cyl(0.016, 0.02, stemH * 0.55, 10), m);
  stemLower.position.set(0, stemBaseY + (stemH * 0.55) / 2, 0);
  g.add(stemLower);
  const stemUpper = mesh(cyl(0.011, 0.016, stemH * 0.48, 10), m);
  stemUpper.position.set(0.012, stemBaseY + stemH * 0.55 + (stemH * 0.48) / 2, 0.006);
  stemUpper.rotation.z = -0.08;
  g.add(stemUpper);

  // a broad ovate "paddle" leaf, base pinned at the local origin extending outward along +x
  function leaf(len, widthRatio, thickRatio) {
    const geo = new THREE.SphereGeometry(len / 2, 16, 12);
    geo.translate(len / 2 - len * 0.06, 0, 0);
    const l = mesh(geo, m);
    l.scale.set(1, thickRatio, widthRatio);
    return l;
  }

  // leaves cascade up the stem, biggest near the bottom, smallest near the crown
  const specs = [
    { h: 0.24, len: 0.30, ang: 25,  tilt: 52 },
    { h: 0.28, len: 0.32, ang: 165, tilt: 48 },
    { h: 0.33, len: 0.28, ang: 265, tilt: 46 },
    { h: 0.37, len: 0.30, ang: 60,  tilt: 44 },
    { h: 0.42, len: 0.25, ang: 195, tilt: 40 },
    { h: 0.46, len: 0.23, ang: 320, tilt: 36 },
    { h: 0.50, len: 0.19, ang: 100, tilt: 26 },
    { h: 0.55, len: 0.16, ang: 15,  tilt: 14 },
  ];
  for (const s of specs) {
    const yaw = new THREE.Group();
    yaw.position.set(0, s.h, 0);
    yaw.rotation.y = (s.ang * Math.PI) / 180;
    const tilt = new THREE.Group();
    tilt.rotation.z = (s.tilt * Math.PI) / 180;
    tilt.add(leaf(s.len, 0.62, 0.1));
    yaw.add(tilt);
    g.add(yaw);
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
