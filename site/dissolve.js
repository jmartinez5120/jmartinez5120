// Section dissolve: every section of the page is built out of nanoparticles. Within a
// section you scroll normally; scroll past its end and what's on screen breaks into
// particles that stream into the next section and assemble it, while the page glides
// there on its own (scrolling up past a section's top rebuilds the previous one). Nav
// links build their target section directly. Scrolling the other way mid-trip doesn't
// cancel: the particles reshuffle from wherever they are and head back. Every trip gets
// a freshly randomized choreography. Only the section you're in is shown.
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const root = document.documentElement;
  const secs = [...document.querySelectorAll(".hero, main section[id]")];
  if (secs.length < 2 || !window.CellMap) return;
  const LASTSEC = secs.length - 1;

  const DURATION = 1500; // one trip, ms
  // Timing is random per particle, so pixels dock one by one all over the section instead
  // of whole characters at once: each leaves at a random point in the first DELAY of the
  // trip and flies for a random SPAN, all docked by LAST (fractions of the trip). The
  // section being left fades out over DELAY; the one being built fades in after LAST.
  const DELAY = 0.3, SPAN = [0.25, 0.65], LAST = 0.92;
  const NEVER = 2; // a delay past the end of the trip: the particle stays where it is
  // Sample at 1 CSS px with no edge padding, keeping each pixel's ink coverage, so the
  // particle-built text has the same weight and anti-aliasing as the real text it becomes.
  const SAMPLE = { cell: 1, pad: false, minAlpha: 20 };
  const rnd = Math.random;

  const canvas = document.createElement("canvas");
  canvas.className = "dissolve";
  canvas.setAttribute("aria-hidden", "true");
  document.body.append(canvas);
  const ctx = canvas.getContext("2d");

  let W = 0, H = 0, dpr = 1, n = 0;
  let stops = [], ends = []; // per section: free-scroll range [stops[i], ends[i]] (scroll positions)
  let at = 0;                // the section in view, or being built
  let trip = null;           // { from, to, dir, t0, y0, o0, midway }; from/to = { sec, y, cells }
  let k = 0;                 // progress of the running trip, 0..1
  const opac = secs.map(() => 1);
  // Per particle. p*: where it was when the current trip started; s/c/t: the trip's start,
  // Bezier control and target; hidden: still part of the real (DOM) content it rests in,
  // so not drawn until it departs.
  let px, py, pcol, sx, sy, cx, cy, tx, ty, delay, span, q, scol, tcol, hidden, bySrc, byDst;

  // Shared color strings (ink coverage quantized to quarters), so a style change is a cheap
  // reference comparison and there are only a handful of distinct styles to switch between.
  const colors = new Map();
  const color = (rgb, a = 1) => {
    const key = `${rgb},${Math.max(1, Math.round(a * 4)) / 4}`;
    return colors.get(key) ?? (colors.set(key, `rgba(${key})`), colors.get(key));
  };

  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const smooth = (v) => v * v * (3 - 2 * v);
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
  const easeOut = (t) => 1 - (1 - t) ** 3;

  const setO = (i, v) => { opac[i] = v; secs[i].style.opacity = v >= 1 ? "" : v; };
  const show = (sec) => secs.forEach((_, i) => setO(i, i === sec ? 1 : 0));

  // ---- Layout: where each section starts and how far you can scroll inside it.
  const measure = () => {
    W = innerWidth; H = innerHeight;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const maxY = root.scrollHeight - H;
    stops = secs.map((el) => Math.round(el.getBoundingClientRect().top + scrollY));
    ends = secs.map((el, i) => clamp(i === LASTSEC ? maxY : stops[i] + el.offsetHeight - H, stops[i], Math.max(stops[i], maxY)));
    stops = stops.map((s) => Math.min(s, Math.max(0, maxY)));
    views.clear();
  };
  const sectionAt = (y) => { let s = 0; stops.forEach((top, i) => { if (y >= top - 1) s = i; }); return s; };

  // ---- Sampling: what a section looks like with the page scrolled to y (cached for the
  // landing spots, which repeat).
  const views = new Map();
  const sampleView = (sec, y) => {
    const el = secs[sec], sel = el.id ? `#${el.id}` : ".hero";
    const shapes = sec === 0 ? [CellMap.shapes.hero] : [CellMap.shapes.borders(sel)];
    let cells = CellMap.sample({ top: y, height: H, scopes: [sel], shapes, ...SAMPLE });
    const cap = Math.min(40000, Math.round((W * H) / 25)); // bounds the per-frame cost
    if (cells.length > cap) cells = cells.filter(() => rnd() < cap / cells.length);
    return { sec, y, cells };
  };
  const view = (sec, y) => {
    const landing = y === stops[sec] || y === ends[sec];
    if (!landing) return sampleView(sec, y);
    const key = `${sec}@${y}`;
    if (!views.has(key)) views.set(key, sampleView(sec, y));
    return views.get(key);
  };
  // Warm the cache in idle time, so the first trip to a section doesn't stall on sampling.
  const warm = () => {
    const todo = [];
    secs.forEach((_, i) => { todo.push([i, stops[i]]); if (ends[i] !== stops[i]) todo.push([i, ends[i]]); });
    const idle = window.requestIdleCallback || ((f) => setTimeout(f, 50));
    const next = () => { const t = todo.shift(); if (!t) return; view(...t); idle(next); };
    idle(next);
  };

  // Off-screen point around the viewport (document coordinates), for sections with nothing
  // to give or take.
  const edgePoint = () => {
    const e = (rnd() * 4) | 0, m = 20 + rnd() * 80, t = rnd();
    return e === 0 ? [t * W, scrollY - m] : e === 1 ? [W + m, scrollY + t * H] : e === 2 ? [t * W, scrollY + H + m] : [-m, scrollY + t * H];
  };

  // ---- Choreography, randomized per trip. Positions are normalized to each set's own
  // bounding box: nx, ny in 0..1.
  const norm = (pts) => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    pts.forEach((c) => { x0 = Math.min(x0, c.x); y0 = Math.min(y0, c.y); x1 = Math.max(x1, c.x); y1 = Math.max(y1, c.y); });
    const w = Math.max(1, x1 - x0), h = Math.max(1, y1 - y0);
    return (c) => ({ nx: (c.x - x0) / w, ny: (c.y - y0) / h });
  };
  // How particles are matched to targets (both sorted by the same key, then zipped).
  const PAIRINGS = {
    pour: (c) => c.nx + c.ny * 0.001,                  // columns fall into columns
    cascade: (c) => c.ny + c.nx * 0.001,               // rows into rows
    spiral: (c) => Math.atan2(c.ny - 0.5, c.nx - 0.5), // around the center, like a turning wheel
    scatter: () => rnd(),                              // everything anywhere: a sandstorm
  };
  const bendAt = (s, t, bend) => {
    const dx = t.x - s.x, dy = t.y - s.y;
    return [s.x + dx / 2 - dy * bend, s.y + dy / 2 + dx * bend];
  };
  // Bezier control point for the flight path.
  const PATHS = {
    arc: (s, t, swirl) => bendAt(s, t, swirl * (0.08 + rnd() * 0.3)),
    sweep: (s, t, swirl) => bendAt(s, t, swirl * (0.35 + rnd() * 0.5)),
    burst: (s) => { const a = rnd() * Math.PI * 2, r = 120 + rnd() * 320; return [s.x + Math.cos(a) * r, s.y + Math.sin(a) * r]; },
    drift: (s, t) => bendAt(s, t, (rnd() - 0.5) * 0.25),
  };
  const pickKey = (obj) => { const keys = Object.keys(obj); return keys[(rnd() * keys.length) | 0]; };
  let lastCombo = "";

  // Plan a trip into `cells` from wherever each particle is now. On a mid-trip reversal,
  // particles that hadn't left yet stay put (they're part of the real content, which fades
  // back), and particles already in the air turn around right away.
  const choreograph = (cells, midway, moving) => {
    let pairing, path, combo;
    do { pairing = pickKey(PAIRINGS); path = pickKey(PATHS); combo = `${pairing}/${path}`; } while (combo === lastCombo);
    lastCombo = combo;
    const swirl = rnd() < 0.5 ? -1 : 1, key = PAIRINGS[pairing], fly = PATHS[path];

    const movers = [];
    for (let i = 0; i < n; i++) {
      sx[i] = tx[i] = cx[i] = px[i]; sy[i] = ty[i] = cy[i] = py[i]; scol[i] = tcol[i] = pcol[i];
      if (midway && hidden[i]) { delay[i] = NEVER; span[i] = 1; continue; }
      movers.push({ i, x: px[i], y: py[i] });
    }
    // Nothing to build (an empty view): the particles scatter off-screen instead.
    const targets = cells.length
      ? cells.map((c) => ({ c }))
      : movers.map(() => { const [x, y] = edgePoint(); return { c: { x, y, rgb: null } }; });
    const mn = norm(movers), cn = norm(targets.map((t) => t.c));
    movers.forEach((m) => (m.k = key(mn(m))));
    targets.forEach((t) => (t.k = key(cn(t.c))));
    movers.sort((a, b) => a.k - b.k); targets.sort((a, b) => a.k - b.k);

    for (let j = 0; j < movers.length; j++) {
      const { i } = movers[j], t = targets[Math.floor((j * targets.length) / movers.length)].c;
      tx[i] = t.x; ty[i] = t.y; tcol[i] = t.rgb ? color(t.rgb, t.a) : scol[i];
      [cx[i], cy[i]] = fly({ x: sx[i], y: sy[i] }, t, swirl);
      delay[i] = midway && moving[i] ? 0 : DELAY * rnd();
      span[i] = Math.min(SPAN[0] + rnd() * (SPAN[1] - SPAN[0]), LAST - delay[i]);
      if (midway) hidden[i] = 0; // already visible as a particle
    }
    // Draw order grouped by color, so fillStyle only changes at group boundaries.
    const idx = () => Array.from({ length: n }, (_, i) => i);
    bySrc = idx().sort((a, b) => (scol[a] < scol[b] ? -1 : scol[a] > scol[b]));
    byDst = idx().sort((a, b) => (tcol[a] < tcol[b] ? -1 : tcol[a] > tcol[b]));
  };

  // A fresh swarm parked on the cells of `from` (hidden behind its real content), sized to
  // cover whichever of the two views needs more particles. Empty views spawn off-screen.
  const spawn = (from, to) => {
    n = Math.max(from.cells.length, to.cells.length);
    [px, py, sx, sy, cx, cy, tx, ty, delay, span, q] = Array.from({ length: 11 }, () => new Float32Array(n));
    hidden = new Uint8Array(n);
    pcol = new Array(n); scol = new Array(n); tcol = new Array(n);
    const src = from.cells;
    for (let i = 0; i < n; i++) {
      if (src.length) { const c = src[i % src.length]; px[i] = c.x; py[i] = c.y; pcol[i] = color(c.rgb, c.a); hidden[i] = 1; }
      else { [px[i], py[i]] = edgePoint(); pcol[i] = color("207,232,239", 0.5); hidden[i] = 0; }
    }
  };

  // Record where every particle is at this instant of the running trip (for a reversal).
  const freeze = () => {
    const moving = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      const u = q[i], r = 1 - u;
      px[i] = r * r * sx[i] + 2 * r * u * cx[i] + u * u * tx[i];
      py[i] = r * r * sy[i] + 2 * r * u * cy[i] + u * u * ty[i];
      pcol[i] = u < 0.5 ? scol[i] : tcol[i];
      moving[i] = u > 0 && u < 1;
      hidden[i] = hidden[i] && u <= 0 ? 1 : 0;
    }
    return moving;
  };

  // ---- Drawing. A particle shows its start color for the first half of its flight and
  // its target color after. Docked particles snap to whole device pixels, so the text they
  // form is crisp rather than smeared across two pixel rows.
  const drawPass = (order, col, late, scroll) => {
    let fill = null;
    for (let j = 0; j < n; j++) {
      const i = order[j], u = q[i];
      if ((hidden[i] && u <= 0) || u >= 0.5 !== late) continue;
      const r = 1 - u;
      let x = r * r * sx[i] + 2 * r * u * cx[i] + u * u * tx[i];
      let y = r * r * sy[i] + 2 * r * u * cy[i] + u * u * ty[i] - scroll;
      if (y < -4 || y > H + 4) continue;
      if (u >= 1 || u <= 0) { x = Math.round(x * dpr) / dpr; y = Math.round(y * dpr) / dpr; }
      if (col[i] !== fill) ctx.fillStyle = fill = col[i];
      ctx.fillRect(x, y, 1, 1);
    }
  };

  let anim = 0, lastY = 0, lastDir = 0;
  const step = (now) => {
    k = Math.min(1, (now - trip.t0) / DURATION);
    const { from, to, y0, o0, midway } = trip;
    scrollTo({ top: Math.round(y0 + (to.y - y0) * (midway ? easeOut : easeInOut)(k)), behavior: "instant" });

    // The section being built fades in at the end; everything else fades out early.
    const fadeOut = smooth(clamp01(k / DELAY)), fadeIn = clamp01((k - LAST) / (1 - LAST));
    secs.forEach((_, i) => setO(i, i === to.sec ? o0[i] + (1 - o0[i]) * fadeIn : o0[i] * (1 - fadeOut)));

    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < n; i++) q[i] = smooth(clamp01((k - delay[i]) / span[i]));
    if (k >= 1) { // arrived
      anim = 0; trip = null; at = to.sec; show(at);
      lastY = scrollY; return;
    }
    ctx.globalAlpha = 1 - fadeIn;
    drawPass(bySrc, scol, false, scrollY);
    drawPass(byDst, tcol, true, scrollY);
    anim = requestAnimationFrame(step);
  };

  // Build section `sec`, landing the page at scroll position `land`. `fromY` is where the
  // current view was (it can differ from scrollY when a native scroll already moved on).
  // Mid-trip, the swarm turns from wherever it is toward the new target.
  const go = (sec, land, fromY = scrollY) => {
    if (!ready) return;
    land = clamp(land, stops[sec], ends[sec]);
    const now = performance.now();
    if (trip) {
      if (trip.to.sec === sec) return;
      const moving = freeze();
      const to = trip.from.sec === sec ? trip.from : view(sec, land);
      trip = { from: trip.to, to, dir: Math.sign(to.y - scrollY) || -trip.dir, t0: now, y0: scrollY, o0: opac.slice(), midway: true };
      choreograph(to.cells, true, moving);
    } else {
      if (sec === at) { scrollTo({ top: land, behavior: "instant" }); return; }
      const from = view(at, clamp(fromY, stops[at], ends[at])), to = view(sec, land);
      spawn(from, to);
      trip = { from, to, dir: Math.sign(land - fromY) || 1, t0: now, y0: scrollY, o0: opac.slice(), midway: false };
      choreograph(to.cells, false);
    }
    at = sec; lastDir = trip.dir; k = 0; q.fill(0);
    if (!anim) anim = requestAnimationFrame(step);
  };
  const reverse = () => go(trip.from.sec, trip.from.y);
  const next = (y) => at < LASTSEC && go(at + 1, stops[at + 1], y);
  const prev = (y) => at > 0 && go(at - 1, ends[at - 1], y);

  // ---- Input. During a trip, scrolling the same way is absorbed (that's what trackpad
  // momentum looks like) and scrolling the other way reverses the trip. Right after a
  // trip, momentum in the same direction keeps being absorbed until the wheel goes quiet.
  let lastWheel = 0, ready = false; // ready: measured, intro finished
  addEventListener("wheel", (e) => {
    if (!ready || Math.abs(e.deltaY) < 1) return;
    const now = performance.now(), dir = e.deltaY > 0 ? 1 : -1, y = scrollY;
    if (trip) {
      e.preventDefault(); lastWheel = now;
      if (dir !== trip.dir && Math.abs(e.deltaY) > 4 && now - trip.t0 > 120) reverse();
      return;
    }
    if (now - lastWheel < 350 && dir === lastDir) { e.preventDefault(); lastWheel = now; return; }
    // At a section's edge, scrolling on builds the neighbor (instead of revealing it).
    if (dir > 0 && y >= ends[at] - 1 && at < LASTSEC) { e.preventDefault(); lastWheel = now; next(y); }
    else if (dir < 0 && y <= stops[at] + 1 && at > 0) { e.preventDefault(); lastWheel = now; prev(y); }
  }, { passive: false });

  const UP = new Set(["ArrowUp", "PageUp", "Home"]), DOWN = new Set(["ArrowDown", "PageDown", "End", " "]);
  addEventListener("keydown", (e) => {
    if (!trip || !(UP.has(e.key) || DOWN.has(e.key))) return;
    e.preventDefault();
    if ((UP.has(e.key) ? -1 : 1) !== trip.dir) reverse();
  });

  let touchY = 0;
  addEventListener("touchstart", (e) => { touchY = e.touches[0].clientY; }, { passive: true });
  addEventListener("touchmove", (e) => {
    if (!trip) return;
    e.preventDefault();
    const dy = e.touches[0].clientY - touchY;
    if (Math.abs(dy) > 24 && (dy < 0 ? 1 : -1) !== trip.dir) { reverse(); touchY = e.touches[0].clientY; } // finger up = scroll down
  }, { passive: false });

  // Nav links (and the logo) build their section directly.
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const target = document.querySelector(a.getAttribute("href"));
    const sec = secs.indexOf(target);
    if (sec < 0) return;
    a.addEventListener("click", (e) => {
      if (!ready) return;
      e.preventDefault();
      go(sec, stops[sec]);
    });
  });

  // Anything else that moves the page out of the current section (keys, scrollbar, touch,
  // momentum) builds the section it moved into, starting from what was on screen before.
  const onScroll = () => {
    if (trip || !ready) return;
    const y = scrollY;
    if (y > ends[at] + 1) {
      const t = Math.max(at + 1, sectionAt(y));
      if (t <= LASTSEC) go(t, t === at + 1 && y < stops[t] ? stops[t] : y, lastY);
    } else if (y < stops[at] - 1) {
      const t = Math.min(at - 1, sectionAt(y));
      if (t >= 0) go(t, t === at - 1 && y > ends[t] ? ends[t] : y, lastY);
    }
    if (!trip) lastY = y;
  };

  let resizeTimer = 0;
  const start = () => {
    measure(); at = sectionAt(scrollY); show(at); lastY = scrollY; ready = true;
    warm();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cancelAnimationFrame(anim); anim = 0; trip = null; ctx.clearRect(0, 0, W, H);
        measure(); at = sectionAt(scrollY); show(at); lastY = scrollY; warm();
      }, 200);
    });
  };
  const begin = () => (document.fonts ? document.fonts.ready.then(start) : start());
  root.classList.contains("intro") ? addEventListener("intro:done", begin, { once: true }) : begin();
})();
