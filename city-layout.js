/* Shared, seeded layout of the massing model.
   Used by hero-model.js (3D) and main.js (plan view) so both draw the same site.
   Synthetic illustration: this is not a plan of any real project. */
(function () {
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function generate(seed) {
    const rnd = mulberry32(seed || 20140301);
    const cols = 14, rows = 10;       // cells
    const cell = 1, gap = 0.14;       // world units
    const streetEvery = 4;            // every 4th column and row is a street
    const blocks = [];
    const taken = new Set();
    const key = (c, r) => c + ":" + r;
    const isStreet = (c, r) => (c % streetEvery === 3) || (r % streetEvery === 3);

    // Subject site: a 2x2 parcel just right of centre, marked in the accent colour.
    const sc = 8, sr = 4;
    for (let c = sc; c < sc + 2; c++) for (let r = sr; r < sr + 2; r++) taken.add(key(c, r));
    blocks.push({ c: sc, r: sr, w: 2, d: 2, h: 2.3, accent: true });

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (taken.has(key(c, r)) || isStreet(c, r)) continue;
        // occasionally merge two cells into a slab along x
        let w = 1, d = 1;
        if (rnd() < 0.22 && c + 1 < cols && !isStreet(c + 1, r) && !taken.has(key(c + 1, r))) w = 2;
        else if (rnd() < 0.16 && r + 1 < rows && !isStreet(c, r + 1) && !taken.has(key(c, r + 1))) d = 2;
        for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) taken.add(key(c + i, r + j));
        if (rnd() < 0.08) continue; // an empty lot now and then
        const dist = Math.hypot(c - 7, r - 4.5);
        let h = 0.35 + rnd() * 0.9;
        if (rnd() < 0.18 && dist < 5) h = 1.6 + rnd() * 1.6;
        if (rnd() < 0.05) h = 3.2 + rnd() * 1.2;
        blocks.push({ c, r, w, d, h, accent: false });
      }
    }

    const width = cols * (cell + gap) - gap;
    const depth = rows * (cell + gap) - gap;
    // world coordinates centred on the origin
    blocks.forEach(b => {
      b.x = b.c * (cell + gap) - width / 2 + (b.w * cell + (b.w - 1) * gap) / 2;
      b.z = b.r * (cell + gap) - depth / 2 + (b.d * cell + (b.d - 1) * gap) / 2;
      b.sx = b.w * cell + (b.w - 1) * gap;
      b.sz = b.d * cell + (b.d - 1) * gap;
    });
    return { blocks, width, depth, cell, gap, cols, rows };
  }

  window.MCCity = { generate };
})();
