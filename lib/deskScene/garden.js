// garden.js — three switchable garden styles built from clay/low-poly primitives.
// Ported from the Claude Design "Desk Scene" prototype, near-verbatim.
import * as THREE from 'three';

// deterministic RNG so the garden layout is stable across reloads
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STD = (color, rough = 0.96, flat = false) =>
  new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, flatShading: flat });

// material sets per style
function makeMaterials(style) {
  if (style === 'color') {
    return {
      foliage: [STD(0x9ec46e, 0.95, true), STD(0x82ad55, 0.95, true), STD(0xb6d684, 0.95, true)],
      trunk: STD(0xbd9d74, 0.95),
      grass: STD(0x8cba59, 0.95, true),
      flowers: [STD(0xeca3b4), STD(0xf2cd7c), STD(0xc99ce0), STD(0xf1957f)],
      rock: STD(0xcfc6ba, 0.98, true),
      ground: STD(0xbcd486, 1.0),
      water: new THREE.MeshStandardMaterial({ color: 0x5cc0e0, roughness: 0.15, metalness: 0.08, flatShading: true }),
      lily: STD(0x6fae52, 0.85, true),
    };
  }
  if (style === 'painterly') {
    return {
      foliage: [STD(0xb3c39a, 0.98), STD(0x9eb083, 0.98), STD(0xc3cfae, 0.98)],
      trunk: STD(0xc8b8a0, 0.98),
      grass: STD(0xa9bb92, 0.98),
      flowers: [STD(0xdcc0c8), STD(0xe8d6ad), STD(0xd2c4d8)],
      rock: STD(0xd2ccc2, 0.98),
      ground: STD(0xc8d0b6, 1.0),
      water: new THREE.MeshStandardMaterial({ color: 0xa9d0cd, roughness: 0.3, metalness: 0.04, flatShading: true }),
      lily: STD(0xb7c79a, 0.9, true),
    };
  }
  // clay — cohesive monochrome with the desk
  const clay = STD(0xe4dbcf, 0.97);
  const clay2 = STD(0xddd3c5, 0.97);
  return {
    foliage: [clay, clay2, clay],
    trunk: clay2,
    grass: clay,
    flowers: [clay, clay2],
    rock: clay2,
    ground: STD(0xeae1d6, 1.0),
    water: new THREE.MeshStandardMaterial({ color: 0xf2ebde, roughness: 0.16, metalness: 0.06, flatShading: true }),
    lily: clay2,
  };
}

function mk(geo, m) {
  const o = new THREE.Mesh(geo, m);
  o.castShadow = true; o.receiveShadow = true;
  return o;
}

function makeTree(M, rng, scale) {
  const g = new THREE.Group();
  const h = (2.4 + rng() * 1.6) * scale;
  const trunk = mk(new THREE.CylinderGeometry(0.12 * scale, 0.18 * scale, h, 12), M.trunk);
  trunk.position.y = h / 2;
  g.add(trunk);
  const fol = M.foliage[Math.floor(rng() * M.foliage.length)];
  const blobs = 3 + Math.floor(rng() * 2);
  for (let i = 0; i < blobs; i++) {
    const r = (0.7 + rng() * 0.5) * scale;
    const b = mk(new THREE.IcosahedronGeometry(r, 1), fol);
    b.position.set((rng() - 0.5) * 0.9 * scale, h + (rng() - 0.3) * 0.7 * scale, (rng() - 0.5) * 0.9 * scale);
    g.add(b);
  }
  return g;
}

function makeBush(M, rng, scale) {
  const g = new THREE.Group();
  const fol = M.foliage[Math.floor(rng() * M.foliage.length)];
  const blobs = 3 + Math.floor(rng() * 3);
  for (let i = 0; i < blobs; i++) {
    const r = (0.4 + rng() * 0.45) * scale;
    const b = mk(new THREE.IcosahedronGeometry(r, 1), fol);
    b.position.set((rng() - 0.5) * 0.8 * scale, r * 0.8 + (rng()) * 0.2, (rng() - 0.5) * 0.8 * scale);
    g.add(b);
  }
  return g;
}

function makeGrassTuft(M, rng) {
  const g = new THREE.Group();
  const n = 4 + Math.floor(rng() * 4);
  for (let i = 0; i < n; i++) {
    const hh = 0.18 + rng() * 0.22;
    const blade = mk(new THREE.ConeGeometry(0.03, hh, 6), M.grass);
    blade.position.set((rng() - 0.5) * 0.18, hh / 2, (rng() - 0.5) * 0.18);
    blade.rotation.z = (rng() - 0.5) * 0.5;
    g.add(blade);
  }
  return g;
}

function makeFlower(M, rng) {
  const g = new THREE.Group();
  const hh = 0.3 + rng() * 0.25;
  const stem = mk(new THREE.CylinderGeometry(0.012, 0.016, hh, 6), M.grass);
  stem.position.y = hh / 2;
  g.add(stem);
  const head = mk(new THREE.IcosahedronGeometry(0.07, 0), M.flowers[Math.floor(rng() * M.flowers.length)]);
  head.position.y = hh;
  g.add(head);
  return g;
}

function makeRock(M, rng) {
  const r = 0.2 + rng() * 0.4;
  const rock = mk(new THREE.IcosahedronGeometry(r, 0), M.rock);
  rock.scale.y = 0.6;
  rock.rotation.set(rng(), rng() * 6, rng());
  return rock;
}

// Is this ground position clear of the desk footprint?
function clearOfDesk(x, z) {
  // keep a generous clearing around the desk + chair + lamp footprint
  return !(x > -3.6 && x < 3.6 && z > -1.8 && z < 3.2);
}

// low-poly pond: jittered polygon water surface, rocky bank, reeds, lily pads
const LAKE_POS = { x: 6.0, z: 20.0, r: 12.0 };
function clearOfLake(x, z) {
  const dx = x - LAKE_POS.x, dz = z - LAKE_POS.z;
  const margin = LAKE_POS.r + 1.6;
  return dx * dx + dz * dz > margin * margin;
}
function buildLake(M, rng) {
  const g = new THREE.Group();
  const R = LAKE_POS.r;

  // jittered low-poly polygon for the water's edge
  const sides = 14;
  const shape = new THREE.Shape();
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2;
    const r = R * (0.8 + rng() * 0.24);
    const x = Math.cos(a) * r, y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
  }
  shape.closePath();
  const waterGeo = new THREE.ShapeGeometry(shape);
  waterGeo.rotateX(-Math.PI / 2);
  const water = new THREE.Mesh(waterGeo, M.water);
  water.position.y = 0.014;
  water.receiveShadow = true;
  g.add(water);

  // rocky bank ringing the edge
  const rockN = 11;
  for (let i = 0; i < rockN; i++) {
    const a = (i / rockN) * Math.PI * 2 + rng() * 0.2;
    const rr = R * (0.94 + rng() * 0.22);
    const rock = makeRock(M, rng);
    rock.scale.multiplyScalar(1.6 + rng() * 1.5);
    rock.position.set(Math.cos(a) * rr, 0, Math.sin(a) * rr);
    g.add(rock);
  }

  // reeds/grass tufts along the bank
  for (let i = 0; i < 16; i++) {
    const a = rng() * Math.PI * 2;
    const rr = R * (1.02 + rng() * 0.3);
    const tuft = makeGrassTuft(M, rng);
    tuft.position.set(Math.cos(a) * rr, 0, Math.sin(a) * rr);
    g.add(tuft);
  }

  // a few lily pads floating on the surface
  for (let i = 0; i < 12; i++) {
    const a = rng() * Math.PI * 2;
    const rr = R * rng() * 0.6;
    const pad = mk(new THREE.CircleGeometry(0.22 + rng() * 0.14, 7), M.lily);
    pad.rotation.x = -Math.PI / 2;
    pad.rotation.z = rng() * 6;
    pad.position.set(Math.cos(a) * rr, 0.022, Math.sin(a) * rr);
    pad.castShadow = false; pad.receiveShadow = false;
    g.add(pad);
  }

  return g;
}

export function buildGarden(style) {
  const M = makeMaterials(style);
  const g = new THREE.Group();
  const rng = mulberry32(20260611);

  // ground
  const ground = mk(new THREE.CircleGeometry(46, 64), M.ground);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.001;
  ground.castShadow = false;
  g.add(ground);

  // trees ring (back + sides)
  const treeSpots = [
    [-6.5, -5.5, 1.15], [-9, -1, 1.0], [6.8, -5, 1.2], [9.2, -2, 1.05],
    [-3.5, -8, 0.95], [3.5, -8.5, 1.1], [0, -10, 1.25], [-8, -7, 0.9], [8, -8, 0.95],
  ];
  for (const [x, z, s] of treeSpots) {
    const t = makeTree(M, rng, s);
    t.position.set(x, 0, z);
    t.rotation.y = rng() * 6;
    g.add(t);
  }

  // scatter bushes, grass, flowers, rocks
  const count = { bush: 16, grass: style === 'clay' ? 26 : 40, flower: style === 'clay' ? 0 : 22, rock: 7 };
  function scatter(maker, n, rMin, rMax) {
    let placed = 0, guard = 0;
    while (placed < n && guard < n * 12) {
      guard++;
      const ang = rng() * Math.PI * 2;
      const rad = rMin + rng() * (rMax - rMin);
      const x = Math.cos(ang) * rad;
      const z = Math.sin(ang) * rad - 1.5; // bias behind the desk
      if (!clearOfDesk(x, z) || !clearOfLake(x, z)) continue;
      const o = maker();
      o.position.set(x, 0, z);
      o.rotation.y = rng() * 6;
      g.add(o);
      placed++;
    }
  }
  scatter(() => makeBush(M, rng, 0.7 + rng() * 0.55), count.bush, 4.4, 12);
  scatter(() => makeGrassTuft(M, rng), count.grass, 4.0, 14);
  if (count.flower) scatter(() => makeFlower(M, rng), count.flower, 4.2, 10);
  scatter(() => makeRock(M, rng), count.rock, 4.4, 12);

  // low-poly pond, behind the chair, far from the desk
  const lake = buildLake(M, rng);
  lake.position.set(LAKE_POS.x, 0, LAKE_POS.z);
  g.add(lake);

  return g;
}
