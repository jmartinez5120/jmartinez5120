// Loading intro: the real (sharp) page sits underneath an opaque cover. A swarm of
// pixel agents cuts the cover away cell by cell wherever there's content, so the
// page is literally assembled in front of you. Then the cover fades out.
// Skippable with any key / click / scroll / tap.
(() => {
  const root = document.documentElement;
  const overlay = document.getElementById("intro");
  if (!root.classList.contains("intro") || !overlay) return;

  const CYAN = "#1fd1e0", AMBER = "#f5a524", BG = "#0b0d10", BODY = "#11151a";
  const CELL = 2;
  const FLY = 380, BUILD = 2200, HOLD = 520, EXIT = 360, FADE = 600;

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
    }, FADE);
  };
  SKIP.forEach((e) => addEventListener(e, end, { passive: true }));

  const W = innerWidth, H = innerHeight;
  const dpr = Math.min(devicePixelRatio || 1, 2);

  // ---- 1. Map where the page has content (text glyphs + logo shapes) ----------
  const sample = document.createElement("canvas");
  sample.width = W; sample.height = H;
  const sc = sample.getContext("2d", { willReadFrequently: true });
  sc.fillStyle = sc.strokeStyle = "#fff";
  sc.textBaseline = "middle";

  const range = document.createRange();
  const drawText = (scope) => {
    const walk = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    for (let node; (node = walk.nextNode()); ) {
      const cs = getComputedStyle(node.parentElement);
      if (cs.visibility === "hidden" || cs.display === "none") continue;
      sc.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const upper = cs.textTransform === "uppercase";
      const t = node.textContent;
      for (let i = 0; i < t.length; i++) {
        if (/\s/.test(t[i])) continue;
        range.setStart(node, i); range.setEnd(node, i + 1);
        const r = range.getBoundingClientRect();
        if (!r.width || r.bottom < 0 || r.top > H) continue;
        sc.fillText(upper ? t[i].toUpperCase() : t[i], r.left, r.top + r.height / 2);
      }
    }
  };
  document.querySelectorAll(".nav, .hero").forEach(drawText);

  const mark = document.querySelector(".orbit-mark");
  if (mark) {
    const m = mark.getBoundingClientRect();
    sc.lineWidth = 3;
    sc.beginPath(); sc.arc(m.left + m.width / 2, m.top + m.height / 2, m.width / 2 - 0.5, 0, Math.PI * 2); sc.stroke();
    sc.beginPath(); sc.arc(m.left + 61, m.top + 1, 7, 0, Math.PI * 2); sc.fill();
  }
  document.querySelectorAll(".nav .orbit, .scroll-cue").forEach((el) => {
    const r = el.getBoundingClientRect();
    sc.fillRect(r.left - 1, r.top - 1, r.width + 2, r.height + 2);
  });

  // Grid of cells that contain ink, dilated by one cell so anti-aliased edges are uncovered too.
  const gw = Math.ceil(W / CELL), gh = Math.ceil(H / CELL);
  const px = sc.getImageData(0, 0, W, H).data;
  const ink = new Uint8Array(gw * gh);
  for (let gy = 0; gy < gh; gy++)
    for (let gx = 0; gx < gw; gx++) {
      search: for (let dy = 0; dy < CELL; dy++)
        for (let dx = 0; dx < CELL; dx++) {
          const x = gx * CELL + dx, y = gy * CELL + dy;
          if (x < W && y < H && px[(y * W + x) * 4 + 3] > 20) { ink[gy * gw + gx] = 1; break search; }
        }
    }
  const cells = [];
  for (let gy = 0; gy < gh; gy++)
    for (let gx = 0; gx < gw; gx++) {
      let hit = 0;
      for (let dy = -1; dy <= 1 && !hit; dy++)
        for (let dx = -1; dx <= 1 && !hit; dx++) {
          const nx = gx + dx, ny = gy + dy;
          hit = nx >= 0 && ny >= 0 && nx < gw && ny < gh && ink[ny * gw + nx];
        }
      if (hit) cells.push({ x: gx * CELL, y: gy * CELL });
    }
  if (!cells.length) return end();

  // ---- 2. Split work: each agent owns a vertical band, scans it like a print head
  const N = Math.max(6, Math.min(16, Math.round(W / 80)));
  const rnd = Math.random;
  // Bands are cut at a random angle each load (vertical, horizontal, diagonal…).
  const cut = rnd() * Math.PI;
  const [cx0, cy0] = [Math.cos(cut), Math.sin(cut)];
  cells.sort((a, b) => a.x * cx0 + a.y * cy0 - (b.x * cx0 + b.y * cy0));
  const per = Math.ceil(cells.length / N);

  // Each agent builds its band in its own random order, so the page fills in from all directions.
  const ORDERS = [
    (job) => { // sweep in from a random direction
      const t = rnd() * Math.PI * 2, ux = Math.cos(t), uy = Math.sin(t);
      return job.sort((a, b) => a.x * ux + a.y * uy - (b.x * ux + b.y * uy));
    },
    (job) => { // burst outward from a random point in the band
      const p = job[(rnd() * job.length) | 0];
      return job.sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y));
    },
    (job) => { // close in on a random point from the band's edges
      const p = job[(rnd() * job.length) | 0];
      return job.sort((a, b) => Math.hypot(b.x - p.x, b.y - p.y) - Math.hypot(a.x - p.x, a.y - p.y));
    },
  ];
  // Off-screen point on an edge (0 top, 1 right, 2 bottom, 3 left), t ∈ [0,1] along it.
  const edgePoint = (edge, t) => {
    const m = 30 + rnd() * 60;
    return edge === 0 ? [t * W, -m] : edge === 1 ? [W + m, t * H] : edge === 2 ? [t * W, H + m] : [-m, t * H];
  };
  // Every load picks an arrival pattern (never the same one twice in a row), and
  // every agent gets its own random entry point inside it.
  const PATTERNS = {
    scatter: () => edgePoint((rnd() * 4) | 0, rnd()),                    // from everywhere at once
    flank: ((e) => () => edgePoint(e, rnd()))((rnd() * 4) | 0),           // a wave from one side
    pincer: ((e) => (i) => edgePoint(i % 2 ? e : e + 2, rnd()))((rnd() * 2) | 0), // two opposite sides
    corner: ((c) => () => {                                               // pour out of one corner
      const [cx, cy] = [c & 1 ? W : 0, c & 2 ? H : 0];
      return [cx + (c & 1 ? 1 : -1) * (30 + rnd() * 140), cy + (c & 2 ? 1 : -1) * (30 + rnd() * 140)];
    })((rnd() * 4) | 0),
  };
  const names = Object.keys(PATTERNS);
  let last = null;
  try { last = sessionStorage.getItem("intro-pattern"); } catch {}
  const choices = names.filter((n) => n !== last);
  const pattern = choices[(rnd() * choices.length) | 0];
  try { sessionStorage.setItem("intro-pattern", pattern); } catch {}

  const agents = [];
  for (let i = 0; i < N; i++) {
    const job = ORDERS[(rnd() * ORDERS.length) | 0](cells.slice(i * per, (i + 1) * per));
    if (!job.length) continue;
    const [sx, sy] = PATTERNS[pattern](i);
    const [ex, ey] = edgePoint((rnd() * 4) | 0, rnd()); // each leaves through a random edge
    agents.push({ job, done: 0, x: sx, y: sy, sx, sy, ex, ey });
  }

  // ---- 3. Layers: `cover` hides the page (agents erase it), `fx` draws agents on top
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
  const total = cells.length, fmt = new Intl.NumberFormat();

  // 7×5 agent sprite: c=hull, b=body, a=amber visor
  const SPRITE = ["..ccc..", ".cbbbc.", "cbababc", ".cbbbc.", "..c.c.."];
  const S = 2;
  const drawAgent = (x, y, frame, i) => {
    const ox = Math.round(x - 7), oy = Math.round(y - 22 + Math.sin(frame / 5 + i));
    SPRITE.forEach((row, ry) => {
      for (let rx = 0; rx < row.length; rx++) {
        const ch = row[rx];
        if (ch === ".") continue;
        fx.fillStyle = ch === "c" ? CYAN : ch === "a" ? AMBER : BODY;
        fx.fillRect(ox + rx * S, oy + ry * S, S, S);
      }
    });
    if ((frame + i) % 4 < 2) { fx.fillStyle = AMBER; fx.fillRect(ox + 6, oy + 11, S, S); } // thruster flicker
    return [ox + 7, oy + 10];
  };

  // Build complete → power on the logo's amber dot. Open a hole in the cover around
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

  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
  const recent = [];
  const place = (c, t) => { cover.clearRect(c.x, c.y, CELL, CELL); recent.push({ c, at: t }); };
  const t0 = performance.now();
  let frame = 0;

  const tick = (now) => {
    const t = now - t0;
    frame++;
    fx.clearRect(0, 0, W, H);

    if (t < FLY) {
      const p = ease(t / FLY);
      agents.forEach((a) => { a.x = a.sx + (a.job[0].x - a.sx) * p; a.y = a.sy + (a.job[0].y - a.sy) * p; });
      status.textContent = `spawning ${agents.length} agents`;
    } else if (t < FLY + BUILD) {
      const p = ease((t - FLY) / BUILD);
      let placed = 0;
      agents.forEach((a) => {
        const target = Math.floor(a.job.length * p);
        while (a.done < target) place(a.job[a.done++], t);
        const cur = a.job[Math.max(0, a.done - 1)];
        a.x += (cur.x - a.x) * 0.55; a.y += (cur.y - a.y) * 0.55;
        a.cell = cur;
        placed += a.done;
      });
      status.textContent = `agents assembling page  ${fmt.format(placed)} / ${fmt.format(total)} px`;
    } else {
      agents.forEach((a) => { // flush any remainder, then leave
        while (a.done < a.job.length) place(a.job[a.done++], t);
        a.cell = null;
      });
      powerOn();
      const te = t - FLY - BUILD - HOLD;
      if (te > 0) {
        const p = ease(Math.min(1, te / EXIT));
        agents.forEach((a) => {
          a.lx ??= a.x; a.ly ??= a.y;
          a.x = a.lx + (a.ex - a.lx) * p; a.y = a.ly + (a.ey - a.ly) * p;
        });
      }
      if (t - FLY - BUILD > 450) status.textContent = `construct stable · ${fmt.format(total)} px`;
      if (te >= EXIT) { fx.clearRect(0, 0, W, H); return end(); }
    }

    // freshly uncovered cells glow cyan for a moment, like a write head passing over
    while (recent.length && t - recent[0].at > 80) recent.shift();
    recent.forEach(({ c, at }) => {
      fx.fillStyle = `rgba(31,209,224,${0.7 * Math.max(0, 1 - (t - at) / 80)})`;
      fx.fillRect(c.x, c.y, CELL, CELL);
    });

    agents.forEach((a, i) => {
      const [lx, ly] = drawAgent(a.x, a.y, frame, i);
      if (a.cell) { // work beam
        fx.strokeStyle = "rgba(31,209,224,.45)"; fx.lineWidth = 1;
        fx.beginPath(); fx.moveTo(lx, ly); fx.lineTo(a.cell.x + CELL / 2, a.cell.y + CELL / 2); fx.stroke();
      }
    });

    raf = requestAnimationFrame(tick);
  };

  const start = () => { if (!ended) raf = requestAnimationFrame(tick); };
  document.fonts ? document.fonts.ready.then(start) : start();
})();
