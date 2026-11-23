// Loading intro: the real (sharp) page sits underneath an opaque cover. A swarm of
// nanoparticles streams in and each one, as it docks, uncovers one cell wherever
// there's content, so the page is literally assembled in front of you. Then the
// logo dot powers on and the cover fades out.
// Skippable with any key / click / scroll / tap.
(() => {
  const root = document.documentElement;
  const overlay = document.getElementById("intro");
  if (!root.classList.contains("intro") || !overlay) return;

  const BG = "#0b0d10";
  const DOT = 1; // particle size in flight (CSS px)
  const SPAWN = 1900, FLIGHT = [400, 750], HOLD = 300, FADE = 600, POWER = 950;

  // The intro always lands on the top of the page: drop any #section from the URL
  // so the browser doesn't jump to it behind the cover.
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  scrollTo(0, 0);

  // Swallow scrolling while the intro runs. Trackpads keep emitting momentum
  // wheel events for a second or more after the fingers lift, so the wheel guard
  // stays on until the wheel has been quiet for a moment, even after the intro ends;
  // otherwise that leftover momentum scrolls the freshly built page away from the top.
  let lastWheel = 0;
  const onWheel = (e) => { e.preventDefault(); lastWheel = performance.now(); };
  const onTouchMove = (e) => e.preventDefault();
  addEventListener("wheel", onWheel, { passive: false });
  addEventListener("touchmove", onTouchMove, { passive: false });
  const releaseScroll = () => {
    removeEventListener("touchmove", onTouchMove);
    const wait = () =>
      performance.now() - lastWheel > 350 ? removeEventListener("wheel", onWheel) : setTimeout(wait, 100);
    wait();
  };

  let raf = 0, ended = false;
  const SKIP = ["keydown", "pointerdown", "touchstart"];
  const end = () => {
    if (ended) return;
    ended = true;
    cancelAnimationFrame(raf);
    SKIP.forEach((e) => removeEventListener(e, end));
    overlay.classList.add("done");
    setTimeout(() => {
      scrollTo(0, 0);
      root.classList.remove("intro");
      overlay.remove();
      releaseScroll();
      dispatchEvent(new Event("intro:done"));
    }, FADE);
  };
  SKIP.forEach((e) => addEventListener(e, end, { passive: true }));

  const W = innerWidth, H = innerHeight;
  const dpr = Math.min(devicePixelRatio || 1, 2);

  // ---- 1. Map where the page has content, in its real colors (see cells.js).
  const { CELL } = CellMap;
  const mark = document.querySelector(".orbit-mark");
  const cells = CellMap.sample({ top: 0, scopes: [".nav", ".hero"], shapes: [CellMap.shapes.hero, CellMap.shapes.navOrbit] });
  if (!cells.length) return end();

  // ---- 2. Nanoparticles: one per cell. Each streams in along a curved path and,
  // when it docks, uncovers its cell. Spawn order and entry pattern vary per load.
  const rnd = Math.random;
  const ORDERS = {
    sweep: () => { // assembles across the page from a random direction
      const a = rnd() * Math.PI * 2, ux = Math.cos(a), uy = Math.sin(a);
      return (c) => c.x * ux + c.y * uy;
    },
    bloom: () => { // grows outward from a random point
      const p = cells[(rnd() * cells.length) | 0];
      return (c) => Math.hypot(c.x - p.x, c.y - p.y);
    },
    converge: () => { // edges first, closing in on the center
      const [mx, my] = [W / 2, H / 2];
      return (c) => -Math.hypot(c.x - mx, c.y - my);
    },
    settle: () => () => rnd(), // dust settling everywhere at once
  };
  // Off-screen point on an edge (0 top, 1 right, 2 bottom, 3 left), t ∈ [0,1] along it.
  const edgePoint = (edge, t) => {
    const m = 20 + rnd() * 80;
    return edge === 0 ? [t * W, -m] : edge === 1 ? [W + m, t * H] : edge === 2 ? [t * W, H + m] : [-m, t * H];
  };
  // Where each particle comes from. Every load picks a pattern (never the same twice in a row).
  const PATTERNS = {
    scatter: () => () => edgePoint((rnd() * 4) | 0, rnd()),              // from every edge
    flank: () => { const e = (rnd() * 4) | 0; return () => edgePoint(e, rnd()); }, // a tide from one side
    pincer: () => { const e = (rnd() * 2) | 0; return () => edgePoint(rnd() < 0.5 ? e : e + 2, rnd()); },
    corner: () => {                                                       // pouring out of one corner
      const c = (rnd() * 4) | 0, [cx, cy] = [c & 1 ? W : 0, c & 2 ? H : 0];
      return () => [cx + (c & 1 ? 1 : -1) * (20 + rnd() * 160), cy + (c & 2 ? 1 : -1) * (20 + rnd() * 160)];
    },
    haze: () => (c) => {                                                  // condensing out of thin air nearby
      const a = rnd() * Math.PI * 2, d = 40 + rnd() * 220;
      return [c.x + Math.cos(a) * d, c.y + Math.sin(a) * d];
    },
  };
  const pick = (obj, key) => {
    const names = Object.keys(obj);
    let last = null;
    try { last = sessionStorage.getItem(key); } catch {}
    const choices = names.filter((n) => n !== last);
    const name = choices[(rnd() * choices.length) | 0];
    try { sessionStorage.setItem(key, name); } catch {}
    return obj[name]();
  };
  const order = pick(ORDERS, "intro-order"), origin = pick(PATTERNS, "intro-pattern");
  const swirl = rnd() < 0.5 ? -1 : 1; // the whole swarm curls the same way, like a current

  cells.forEach((c) => { c.key = order(c); });
  cells.sort((a, b) => a.key - b.key);
  const total = cells.length;
  const lift = (v) => Math.round(v + (255 - v) * 0.35); // particles glow a little hotter than they land
  cells.forEach((c, i) => {
    c.born = Math.max(0, (i / total) * SPAWN + (rnd() - 0.5) * 300);
    c.dur = FLIGHT[0] + rnd() * (FLIGHT[1] - FLIGHT[0]);
    [c.sx, c.sy] = origin(c);
    // Bezier control point: off to one side of the straight path, so particles arc in.
    const dx = c.x - c.sx, dy = c.y - c.sy, bend = swirl * (0.1 + rnd() * 0.4);
    c.cx = c.sx + dx / 2 - dy * bend; c.cy = c.sy + dy / 2 + dx * bend;
    c.hot = `rgb(${c.rgb.split(",").map((v) => lift(+v)).join(",")})`;
  });
  cells.sort((a, b) => a.born - b.born);

  // ---- 3. Layers: `cover` hides the page (particles erase it), `fx` draws them on top
  const mk = () => {
    const c = document.createElement("canvas");
    c.width = W * dpr; c.height = H * dpr;
    overlay.prepend(c);
    const ctx = c.getContext("2d"); ctx.scale(dpr, dpr); return ctx;
  };
  const fx = mk(), cover = mk(); // cover prepended last → sits underneath fx
  cover.fillStyle = BG; cover.fillRect(0, 0, W, H);
  overlay.style.background = "transparent"; // the canvas is the cover now

  const status = document.getElementById("intro-status");
  const fmt = new Intl.NumberFormat();

  // Assembly complete → power on the logo's amber dot. Open a hole in the cover around
  // it so its flare isn't clipped, then let the CSS keyframes do the flicker/overshoot.
  let powered = false;
  const powerOn = () => {
    if (powered || !mark) return;
    powered = true;
    const m = mark.getBoundingClientRect();
    cover.save();
    cover.globalCompositeOperation = "destination-out";
    const g = cover.createRadialGradient(m.left + 61, m.top + 1, 0, m.left + 61, m.top + 1, 48);
    g.addColorStop(0, "rgba(0,0,0,1)"); g.addColorStop(0.6, "rgba(0,0,0,1)"); g.addColorStop(1, "rgba(0,0,0,0)");
    cover.fillStyle = g;
    cover.fillRect(m.left + 61 - 48, m.top + 1 - 48, 96, 96);
    cover.restore();
    mark.classList.add("power-on");
    status.textContent = "power on";
  };

  const active = [];
  let next = 0, landed = 0, doneAt = 0;
  const t0 = performance.now();

  const tick = (now) => {
    const t = now - t0;

    // Fade the previous frame instead of clearing it: that leaves each particle a short trail.
    fx.globalCompositeOperation = "destination-out";
    fx.fillStyle = "rgba(0,0,0,.35)"; fx.fillRect(0, 0, W, H);
    fx.globalCompositeOperation = "source-over";

    while (next < total && cells[next].born <= t) active.push(cells[next++]);

    let keep = 0, fill = "";
    for (let k = 0; k < active.length; k++) {
      const p = active[k];
      if (p.hot !== fill) fx.fillStyle = fill = p.hot;
      const u = (t - p.born) / p.dur;
      if (u >= 1) { // docked: uncover the cell, with a brief flash
        cover.clearRect(p.x, p.y, CELL, CELL);
        fx.fillRect(p.x, p.y, CELL, CELL);
        landed++;
        continue;
      }
      const e = 1 - (1 - u) ** 3, r = 1 - e; // ease out: fast in flight, gentle docking
      fx.fillRect(r * r * p.sx + 2 * r * e * p.cx + e * e * p.x,
                  r * r * p.sy + 2 * r * e * p.cy + e * e * p.y, DOT, DOT);
      active[keep++] = p;
    }
    active.length = keep;

    if (landed < total) {
      status.textContent = landed
        ? `nanoassembly  ${fmt.format(landed)} / ${fmt.format(total)} px`
        : `releasing ${fmt.format(total)} nanoparticles`;
    } else {
      doneAt ||= t;
      status.textContent = `lattice stable · ${fmt.format(total)} px`;
      // Let the last trails fade, then power on the logo dot and lift the cover once
      // its flicker/flare (CSS `dot-power-on`) has played out.
      if (t - doneAt >= HOLD) { fx.clearRect(0, 0, W, H); powerOn(); setTimeout(end, POWER); return; }
    }

    raf = requestAnimationFrame(tick);
  };

  const start = () => { if (!ended) raf = requestAnimationFrame(tick); };
  document.fonts ? document.fonts.ready.then(start) : start();
})();
