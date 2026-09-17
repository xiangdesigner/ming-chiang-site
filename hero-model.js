/* The massing model. One canvas, one responsibility: show the firm's territory as a
   studio-lit architectural maquette, then orbit to plan view as the visitor scrolls.
   Synthetic illustration, generated in code; not a real project.

   Build: every building is composed from bevelled box parts (podium, setback tower, crown,
   roof units) drawn as one instanced mesh; the highlighted property is a stepped tower with
   floor plates and fins on its own instanced mesh; blocks sit on sidewalk slabs above the
   roads; the base is a two-tier bevelled card. Lighting is one warm key with soft shadows,
   a low hemisphere, a cool fill, a faint rim and a very restrained room environment for
   the acrylic reflections. Contact occlusion is baked into an overlay that fades in with
   the buildings. Rendering is on demand except for a gentle idle drift while in view. */
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const stage = document.querySelector("[data-hero-stage]");
const canvas = document.querySelector("[data-hero-canvas]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const small = window.matchMedia("(max-width: 900px)").matches;

if (stage && canvas && window.MCCity) init();

function init() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (err) {
    stage.classList.add("no-3d");
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1 : 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf3f4f1, 50, 80);
  const camera = new THREE.PerspectiveCamera(22, 1, 0.1, 200);
  const model = new THREE.Group();
  scene.add(model);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  /* ---------- layout ---------- */
  const layout = window.MCCity.generate();
  const W = layout.width + 2.6, D = layout.depth + 2.6;
  const step = layout.cell + layout.gap;
  const isStreet = (c, r) => (c % 4 === 3) || (r % 4 === 3);
  const cx = c => c * step - layout.width / 2 + 0.5, cz = r => r * step - layout.depth / 2 + 0.5;
  const covered = new Set();
  layout.blocks.forEach(b => { for (let i = 0; i < b.w; i++) for (let j = 0; j < b.d; j++) covered.add((b.c + i) + ":" + (b.r + j)); });
  const rnd = seeded(20140917);
  const SLAB = 0.06;

  /* ---------- base: bevelled card on a smaller darker card ---------- */
  const baseMat = new THREE.MeshStandardMaterial({ color: 0xd9d6cc, roughness: 0.95, metalness: 0, envMapIntensity: 0.02 });
  const base = new THREE.Mesh(new RoundedBoxGeometry(W, 0.5, D, 2, 0.06), baseMat);
  base.position.y = -0.25;
  base.receiveShadow = true;
  model.add(base);
  const underMat = new THREE.MeshStandardMaterial({ color: 0xa9a59a, roughness: 0.95, metalness: 0, envMapIntensity: 0.02 });
  const under = new THREE.Mesh(new RoundedBoxGeometry(W - 1.1, 0.34, D - 1.1, 2, 0.05), underMat);
  under.position.y = -0.67;
  under.receiveShadow = true;
  model.add(under);
  const topTex = makeRoadTexture();
  const topMat = new THREE.MeshStandardMaterial({ map: topTex, roughness: 0.96, metalness: 0, envMapIntensity: 0.02 });
  const top = new THREE.Mesh(new THREE.PlaneGeometry(layout.width + 1.4, layout.depth + 1.4), topMat);
  top.rotation.x = -Math.PI / 2;
  top.position.y = 0.002;
  top.receiveShadow = true;
  model.add(top);
  const groundShadow = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.4, D * 1.4), new THREE.MeshBasicMaterial({ map: makeRadial(0.5), transparent: true, opacity: 0, depthWrite: false }));
  groundShadow.rotation.x = -Math.PI / 2;
  groundShadow.position.y = -0.86;
  model.add(groundShadow);
  const aoMat = new THREE.MeshBasicMaterial({ map: makeOcclusionTexture(), transparent: true, opacity: 0, depthWrite: false });
  const ao = new THREE.Mesh(new THREE.PlaneGeometry(layout.width + 1.4, layout.depth + 1.4), aoMat);
  ao.rotation.x = -Math.PI / 2;
  ao.position.y = SLAB + 0.003;
  model.add(ao);

  /* ---------- sidewalk slabs: one per city block ---------- */
  const slabParts = [];
  for (let r0 = 0; r0 < layout.rows; r0 += 4) for (let c0 = 0; c0 < layout.cols; c0 += 4) {
    const c1 = Math.min(c0 + 2, layout.cols - 1), r1 = Math.min(r0 + 2, layout.rows - 1);
    const x0 = cx(c0) - 0.5 - 0.05, x1 = cx(c1) + 0.5 + 0.05, z0 = cz(r0) - 0.5 - 0.05, z1 = cz(r1) + 0.5 + 0.05;
    slabParts.push({ x: (x0 + x1) / 2, z: (z0 + z1) / 2, sx: x1 - x0, sz: z1 - z0, sy: SLAB, y: 0, tint: 0.905, group: 0, delay: 0.25 + rnd() * 0.25 });
  }

  /* ---------- building massing: podium, setback tower, crown, roof units ---------- */
  const site = layout.blocks.find(b => b.accent);
  const others = layout.blocks.filter(b => !b.accent);
  const parts = [];
  const maxDist = Math.hypot(layout.width / 2, layout.depth / 2);
  others.forEach(b => {
    const ring = Math.hypot(b.x, b.z) / maxDist;
    const delay = 0.55 + ring * 1.1 + rnd() * 0.15;
    const tintMain = 0.94 + (rnd() - 0.5) * 0.03;
    const push = (x, z, y, sx, sy, sz, tint, group) => parts.push({ x, z, y, sx, sy, sz, tint, group, delay });
    const ox = (rnd() - 0.5), oz = (rnd() - 0.5);
    if (b.h < 1.05) {
      push(b.x, b.z, SLAB, b.sx, b.h, b.sz, tintMain, 1);
      if (rnd() < 0.7) push(b.x + ox * b.sx * 0.35, b.z + oz * b.sz * 0.35, SLAB + b.h, b.sx * 0.28, 0.09, b.sz * 0.24, 0.86, 2);
    } else if (b.h < 2.1) {
      const pod = 0.42;
      push(b.x, b.z, SLAB, b.sx, pod, b.sz, tintMain - 0.01, 1);
      const tx = b.sx * 0.76, tz = b.sz * 0.76;
      const dx = ox * (b.sx - tx) * 0.9, dz = oz * (b.sz - tz) * 0.9;
      push(b.x + dx, b.z + dz, SLAB + pod, tx, b.h - pod, tz, tintMain, 1);
      push(b.x + dx + ox * 0.2, b.z + dz + oz * 0.2, SLAB + b.h, tx * 0.3, 0.1, tz * 0.26, 0.86, 2);
      if (rnd() < 0.5) push(b.x + dx - ox * 0.25, b.z + dz - oz * 0.25, SLAB + b.h, tx * 0.14, 0.16, tz * 0.14, 0.9, 2);
    } else {
      const pod = 0.38;
      push(b.x, b.z, SLAB, b.sx, pod, b.sz, tintMain - 0.01, 1);
      const tx = b.sx * 0.68, tz = b.sz * 0.68;
      const dx = ox * (b.sx - tx) * 0.8, dz = oz * (b.sz - tz) * 0.8;
      const th = (b.h - pod) * 0.78;
      push(b.x + dx, b.z + dz, SLAB + pod, tx, th, tz, tintMain, 1);
      const crownH = (b.h - pod) - th;
      push(b.x + dx + ox * 0.1, b.z + dz + oz * 0.1, SLAB + pod + th, tx * 0.62, crownH, tz * 0.62, tintMain + 0.01, 1);
      push(b.x + dx + ox * 0.1, b.z + dz + oz * 0.1, SLAB + b.h, tx * 0.2, 0.12, tz * 0.2, 0.86, 2);
    }
  });

  /* ---------- the highlighted property: stepped tower with floor plates and fins ---------- */
  const S = site.sx;
  const sitePod = 0.32;
  const siteParts = [];
  const spush = (x, z, y, sx, sy, sz, stage) => siteParts.push({ x: site.x + x, z: site.z + z, y, sx, sy, sz, stage });
  spush(0, 0, SLAB, S * 0.92, sitePod, S * 0.92, 0);
  const t1 = S * 0.66, t1h = 1.15, t1x = -S * 0.09, t1z = S * 0.07;
  spush(t1x, t1z, SLAB + sitePod, t1, t1h, t1, 1);
  const t2 = S * 0.5, t2h = 0.8, t2x = t1x + S * 0.06, t2z = t1z + S * 0.05;
  spush(t2x, t2z, SLAB + sitePod + t1h, t2, t2h, t2, 2);
  const t3 = S * 0.34, t3h = 0.42, t3x = t2x - S * 0.04, t3z = t2z + S * 0.04;
  spush(t3x, t3z, SLAB + sitePod + t1h + t2h, t3, t3h, t3, 3);
  spush(t3x, t3z, SLAB + sitePod + t1h + t2h + t3h, t3 * 0.4, 0.09, t3 * 0.4, 3);
  // floor plates on tiers one and two
  for (let k = 1; k <= 3; k++) spush(t1x, t1z, SLAB + sitePod + (t1h / 4) * k - 0.015, t1 + 0.12, 0.03, t1 + 0.12, 4);
  for (let k = 1; k <= 2; k++) spush(t2x, t2z, SLAB + sitePod + t1h + (t2h / 3) * k - 0.015, t2 + 0.1, 0.03, t2 + 0.1, 4);
  // vertical fins on the two faces the camera sees
  const finN = 7;
  for (let k = 0; k < finN; k++) {
    const f = (k + 0.5) / finN - 0.5;
    spush(t1x + t1 / 2 + 0.035, t1z + f * t1 * 0.9, SLAB + sitePod + 0.06, 0.03, t1h - 0.12, 0.07, 5);
    spush(t1x + f * t1 * 0.9, t1z - t1 / 2 - 0.035, SLAB + sitePod + 0.06, 0.07, t1h - 0.12, 0.03, 5);
  }

  /* ---------- model trees: lots left empty, park pockets and the property's terrace ---------- */
  const trees = [];
  for (let r = 0; r < layout.rows; r++) for (let c = 0; c < layout.cols; c++) {
    if (isStreet(c, r) || covered.has(c + ":" + r)) continue;
    const n = 2 + Math.floor(rnd() * 3);
    for (let k = 0; k < n; k++) trees.push({ x: cx(c) + (rnd() - 0.5) * 0.7, z: cz(r) + (rnd() - 0.5) * 0.7, s: 0.12 + rnd() * 0.06, y: SLAB, delay: 1.9 + rnd() * 0.5 });
  }
  for (let k = 0; k < 3; k++) trees.push({ x: site.x + t2x + (k - 1) * 0.16, z: site.z + t2z + t2 / 2 - 0.1 - (k % 2) * 0.1, s: 0.07, y: SLAB + sitePod + t1h + t2h, delay: 3.0 + k * 0.08 });
  const treeCount = small ? Math.ceil(trees.length * 0.6) : trees.length;

  /* ---------- instanced meshes ---------- */
  const partGeo = new RoundedBoxGeometry(1, 1, 1, 2, 0.05);
  partGeo.translate(0, 0.5, 0);
  const whiteMat = new THREE.MeshPhysicalMaterial({ color: 0xf6f6f2, roughness: 0.72, metalness: 0, envMapIntensity: 0.03 });
  const allWhite = slabParts.concat(parts);
  const white = new THREE.InstancedMesh(partGeo, whiteMat, allWhite.length);
  white.castShadow = true;
  white.receiveShadow = true;
  const col = new THREE.Color();
  allWhite.forEach((p, i) => { col.setHSL(0.11, 0.05, p.tint); white.setColorAt(i, col); });
  white.instanceColor.needsUpdate = true;
  model.add(white);

  const redMat = new THREE.MeshPhysicalMaterial({ color: 0xc63d2a, roughness: 0.3, metalness: 0, clearcoat: 0.7, clearcoatRoughness: 0.15, envMapIntensity: 0.55, emissive: 0xc63d2a, emissiveIntensity: 0 });
  const red = new THREE.InstancedMesh(new RoundedBoxGeometry(1, 1, 1, 3, 0.03).translate(0, 0.5, 0), redMat, siteParts.length);
  red.castShadow = true;
  red.receiveShadow = true;
  model.add(red);

  const treeMat = new THREE.MeshStandardMaterial({ color: 0xcdd2c8, roughness: 0.9, metalness: 0, envMapIntensity: 0.03 });
  const treeMesh = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), treeMat, treeCount);
  treeMesh.castShadow = true;
  model.add(treeMesh);

  /* ---------- light ---------- */
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd6d2c8, 0.34));
  const key = new THREE.DirectionalLight(0xfff1e0, 2.6);
  key.position.set(10, 17, 8);
  key.castShadow = true;
  key.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  const sb = Math.max(W, D) * 0.66;
  key.shadow.camera.left = -sb; key.shadow.camera.right = sb;
  key.shadow.camera.top = sb; key.shadow.camera.bottom = -sb;
  key.shadow.camera.near = 2; key.shadow.camera.far = 60;
  key.shadow.camera.updateProjectionMatrix();
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xdde7f3, 0.2);
  fill.position.set(-9, 6, -6);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.25);
  rim.position.set(-4, 8, 11);
  scene.add(rim);

  /* ---------- camera ---------- */
  const az = -0.72;
  const origin = new THREE.Vector3(0.6, 0.3, 0.4);
  const focus = new THREE.Vector3(site.x * 0.45 + 0.3, 0.9, site.z * 0.45 + 0.2);
  const target = new THREE.Vector3();
  let dolly = reduceMotion ? 1 : 0;      // 0 = pulled back, 1 = settled
  let push = reduceMotion ? 1 : 0;       // 0 = looking at the city, 1 = leaning toward the property
  let driftA = 0, driftP = 0;
  function placeCamera(p) {
    const polar = THREE.MathUtils.lerp(0.98, 0.05, ease(p)) + tiltX + driftP;
    const radius = THREE.MathUtils.lerp(46, 54, p) + (1 - dolly) * 9 - push * 2;
    const fov = THREE.MathUtils.lerp(22, 18, p);
    const a = az + tiltY + driftA + p * 0.35;
    target.lerpVectors(origin, focus, push * (1 - p));
    camera.position.set(
      target.x + radius * Math.sin(polar) * Math.cos(a),
      target.y + radius * Math.cos(polar),
      target.z + radius * Math.sin(polar) * Math.sin(a)
    );
    camera.fov = fov;
    camera.updateProjectionMatrix();
    camera.lookAt(target);
  }

  /* ---------- entrance: base, slabs, buildings, details, property, camera push, light settle ---------- */
  const dummy = new THREE.Object3D();
  const rise = (t, d, len) => { const u = Math.max(0, Math.min(1, (t - d) / len)); return 1 - Math.pow(1 - u, 3); };
  const siteStage = [2.15, 2.35, 2.55, 2.75, 2.95, 3.05];
  function apply(t) {
    const baseUp = rise(t, 0, 0.7);
    base.scale.y = Math.max(0.02, baseUp); base.position.y = -0.25 * baseUp;
    under.scale.y = Math.max(0.02, baseUp); under.position.y = -0.67 * baseUp;
    top.visible = baseUp > 0.6; topMat.opacity = 1;
    groundShadow.material.opacity = 0.45 * rise(t, 0.2, 0.8);
    allWhite.forEach((p, i) => {
      const len = p.group === 0 ? 0.5 : p.group === 2 ? 0.45 : 0.75;
      const d = p.group === 2 ? p.delay + 1.0 : p.delay;
      const u = rise(t, d, len);
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.set(p.sx, Math.max(0.0001, p.sy * u), p.sz);
      dummy.updateMatrix();
      white.setMatrixAt(i, dummy.matrix);
    });
    white.instanceMatrix.needsUpdate = true;
    siteParts.forEach((p, i) => {
      const u = rise(t, siteStage[p.stage], p.stage >= 4 ? 0.5 : 0.6);
      const grow = p.stage >= 4 ? 1 : u;
      const fade = p.stage >= 4 ? u : 1;
      const on = u > 0 ? 1 : 0.0001;
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.set(on * p.sx * (p.stage >= 4 ? Math.max(0.0001, fade) : 1), Math.max(0.0001, on * p.sy * grow), on * p.sz * (p.stage >= 4 ? Math.max(0.0001, fade) : 1));
      dummy.updateMatrix();
      red.setMatrixAt(i, dummy.matrix);
    });
    red.instanceMatrix.needsUpdate = true;
    for (let i = 0; i < treeCount; i++) {
      const tr = trees[i];
      const u = rise(t, tr.delay, 0.5);
      const r = Math.max(0.0001, tr.s * u);
      dummy.position.set(tr.x, tr.y + r * 0.95, tr.z);
      dummy.scale.set(r, r, r);
      dummy.updateMatrix();
      treeMesh.setMatrixAt(i, dummy.matrix);
    }
    treeMesh.instanceMatrix.needsUpdate = true;
    aoMat.opacity = rise(t, 1.9, 1.3);
    redMat.emissiveIntensity = 0.09 * rise(t, 3.05, 0.7);
    dolly = rise(t, 0, 3.2);
    push = rise(t, 2.2, 1.3);
  }

  /* ---------- state and loop ---------- */
  const INTRO = 3.9;
  let intro = reduceMotion ? INTRO : 0;
  let scrollP = 0;
  let tiltX = 0, tiltY = 0, tiltTX = 0, tiltTY = 0;
  let active = true;
  let visible = !document.hidden;
  let dirty = true;
  let rafId = 0;
  let introStart = 0;
  let lastShape = -1;
  let last = 0;
  let idleClock = 0;
  let holdGrowth = !reduceMotion && !!document.querySelector("[data-preloader]") && getComputedStyle(document.querySelector("[data-preloader]")).display !== "none";
  if (holdGrowth) {
    const release = () => { holdGrowth = false; schedule(); };
    window.addEventListener("mc:intro-done", release, { once: true });
    window.setTimeout(release, 6000);
  }

  function resize() {
    const rect = stage.getBoundingClientRect();
    renderer.setSize(Math.max(1, Math.round(rect.width)), Math.max(1, Math.round(rect.height)), false);
    camera.aspect = rect.width / Math.max(1, rect.height);
    camera.updateProjectionMatrix();
    dirty = true;
    schedule();
  }
  new ResizeObserver(resize).observe(stage);

  let frameCount = 0;
  function frame(now) {
    rafId = 0;
    let animating = false;
    const dt = last ? Math.min(64, now - last) : 16.7;
    last = now;
    const k = 1 - Math.pow(0.92, dt / 16.7);

    if (intro < INTRO && !holdGrowth) {
      if (!introStart) introStart = now;
      intro = Math.min(INTRO, (now - introStart) / 1000);
      animating = true;
    }
    if (finePointer && !reduceMotion) {
      const nx = tiltX + (tiltTX - tiltX) * k;
      const ny = tiltY + (tiltTY - tiltY) * k;
      if (Math.abs(nx - tiltX) > 0.00005 || Math.abs(ny - tiltY) > 0.00005) { tiltX = nx; tiltY = ny; animating = true; }
    }
    // idle drift after the entrance: a slow breath of the camera, at half frame rate, only in view
    const drifting = !reduceMotion && intro >= INTRO && active && visible && scrollP < 0.02;
    if (drifting) {
      idleClock += dt / 1000;
      frameCount++;
      if (frameCount % 2 === 0) {
        driftA = Math.sin(idleClock / 9) * 0.012;
        driftP = Math.cos(idleClock / 13) * 0.006;
        animating = true;
      } else { schedule(); return; }
    }
    if (dirty || animating) {
      if (intro !== lastShape) { apply(intro); renderer.shadowMap.needsUpdate = true; lastShape = intro; }
      placeCamera(scrollP);
      renderer.render(scene, camera);
      dirty = false;
    }
    if ((animating || drifting) && active && visible) schedule();
  }
  function schedule() { if (!rafId && visible) rafId = requestAnimationFrame(frame); }

  if (finePointer && !reduceMotion) {
    const hero = stage.closest(".hero");
    hero.addEventListener("pointermove", e => {
      const rect = stage.getBoundingClientRect();
      tiltTY = ((e.clientX - rect.left) / rect.width - 0.5) * 0.09;
      tiltTX = -((e.clientY - rect.top) / rect.height - 0.5) * 0.045;
      schedule();
    });
    hero.addEventListener("pointerleave", () => { tiltTX = 0; tiltTY = 0; schedule(); });
  }
  document.addEventListener("visibilitychange", () => { visible = !document.hidden; if (visible) { dirty = true; schedule(); } });
  canvas.addEventListener("webglcontextlost", e => { e.preventDefault(); stage.classList.remove("is-3d"); stage.classList.add("no-3d"); });
  window.addEventListener("pagehide", () => { renderer.dispose(); partGeo.dispose(); whiteMat.dispose(); redMat.dispose(); treeMat.dispose(); baseMat.dispose(); underMat.dispose(); topMat.dispose(); topTex.dispose(); aoMat.map.dispose(); aoMat.dispose(); });

  window.MCHero = {
    setProgress(p) { scrollP = p; dirty = true; schedule(); },
    setActive(on) { active = on; if (on) { dirty = true; schedule(); } }
  };
  if (location.search.includes("debug3d")) window.MCHeroDebug = { renderer, scene, camera, key, fill, rim, white, red, treeMesh, render: () => renderer.render(scene, camera) };

  apply(intro);
  placeCamera(0);
  resize();
  stage.classList.add("is-3d");
  window.dispatchEvent(new Event("mc:hero-ready"));
  schedule();

  /* ---------- helpers ---------- */
  function ease(u) { return 1 - Math.pow(1 - u, 2); }
  function seeded(seed) { return function () { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  /* roads between the blocks: a slightly darker card with faint lane marks and crossings */
  function makeRoadTexture() {
    const size = small ? 1024 : 2048;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    const PW = layout.width + 1.4, PD = layout.depth + 1.4;
    const sx = size / PW, sz = size / PD;
    const X = x => (x + PW / 2) * sx, Z = z => (z + PD / 2) * sz;
    const img = ctx.createImageData(size, size), g = img.data;
    let s = 11;
    for (let i = 0; i < g.length; i += 4) { s = (s * 1664525 + 1013904223) >>> 0; const n = ((s >>> 8) & 255) / 255; const v = 200 + (n - 0.5) * 12; g[i] = v + 3; g[i + 1] = v + 1; g[i + 2] = v - 7; g[i + 3] = 255; }
    ctx.putImageData(img, 0, 0);
    // lane marks along each street axis
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = Math.max(1, size / 1600);
    ctx.setLineDash([size / 90, size / 110]);
    for (let cc = 3; cc < layout.cols; cc += 4) { const x = X(cx(cc)); ctx.beginPath(); ctx.moveTo(x, Z(-layout.depth / 2 - 0.7)); ctx.lineTo(x, Z(layout.depth / 2 + 0.7)); ctx.stroke(); }
    for (let rr = 3; rr < layout.rows; rr += 4) { const z = Z(cz(rr)); ctx.beginPath(); ctx.moveTo(X(-layout.width / 2 - 0.7), z); ctx.lineTo(X(layout.width / 2 + 0.7), z); ctx.stroke(); }
    ctx.setLineDash([]);
    // crossings at intersections
    ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
    for (let cc = 3; cc < layout.cols; cc += 4) for (let rr = 3; rr < layout.rows; rr += 4) {
      const x = X(cx(cc)), z = Z(cz(rr));
      for (let k = -2; k <= 2; k++) { ctx.fillRect(x - 0.62 * sx, z + k * 0.16 * sz - 0.04 * sz, 0.14 * sx, 0.08 * sz); ctx.fillRect(x + 0.48 * sx, z + k * 0.16 * sz - 0.04 * sz, 0.14 * sx, 0.08 * sz); }
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    return tex;
  }

  function makeOcclusionTexture() {
    const size = small ? 512 : 1024;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    const PW = layout.width + 1.4, PD = layout.depth + 1.4;
    const sx = size / PW, sz = size / PD;
    const X = x => (x + PW / 2) * sx, Z = z => (z + PD / 2) * sz;
    layout.blocks.forEach(b => {
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      grad.addColorStop(0, "rgba(23, 25, 28, 0.38)");
      grad.addColorStop(0.5, "rgba(23, 25, 28, 0.18)");
      grad.addColorStop(1, "rgba(23, 25, 28, 0)");
      ctx.save(); ctx.translate(X(b.x), Z(b.z)); ctx.scale((b.sx / 2 + 0.36) * sx, (b.sz / 2 + 0.36) * sz);
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(0, 0, 1, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    });
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function makeRadial(a) {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d");
    const grad = ctx.createRadialGradient(128, 128, 30, 128, 128, 128);
    grad.addColorStop(0, `rgba(23, 25, 28, ${a})`);
    grad.addColorStop(0.55, `rgba(23, 25, 28, ${a * 0.35})`);
    grad.addColorStop(1, "rgba(23, 25, 28, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }
}
