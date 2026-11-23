// Pixel map used by the loading intro: renders a region of the
// page (text glyphs plus a few hand-drawn shapes) in its real colors onto an offscreen
// canvas, and returns the CELL×CELL cells that contain ink, in document coordinates,
// each with the "r,g,b" color of its ink.
window.CellMap = (() => {
  const CELL = 2;
  const CYAN = "#1fd1e0", AMBER = "#f5a524", LINE = "#1c252c";
  const range = document.createRange();

  // Nearest ancestor (up to `scope`) that clips horizontal overflow, e.g. the scrollable
  // terminal, so glyphs scrolled out of view aren't drawn.
  const clipRect = (el, scope) => {
    for (; el && el !== scope.parentElement; el = el.parentElement)
      if (getComputedStyle(el).overflowX !== "visible") return el.getBoundingClientRect();
    return null;
  };

  // Draws every glyph inside `scope` at its on-screen position (viewport coordinates).
  const drawText = (sc, scope, vTop, vBottom) => {
    const walk = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    for (let node; (node = walk.nextNode()); ) {
      const el = node.parentElement, cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity === 0) continue;
      sc.fillStyle = cs.color;
      sc.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const upper = cs.textTransform === "uppercase";
      const clip = clipRect(el, scope);
      const t = node.textContent;
      for (let i = 0; i < t.length; i++) {
        if (/\s/.test(t[i])) continue;
        range.setStart(node, i); range.setEnd(node, i + 1);
        const r = range.getBoundingClientRect();
        if (!r.width || r.bottom < vTop || r.top > vBottom) continue;
        if (clip && (r.right <= clip.left || r.left >= clip.right)) continue;
        sc.fillText(upper ? t[i].toUpperCase() : t[i], r.left, r.top + r.height / 2);
      }
    }
  };

  // Hand-drawn shapes for things that aren't text. Each draws in viewport coordinates.
  const shapes = {
    hero: (sc) => { // the big orbit mark (ring + amber dot) and the scroll cue
      const mark = document.querySelector(".hero .orbit-mark");
      if (mark) {
        const m = mark.getBoundingClientRect();
        sc.lineWidth = 3; sc.strokeStyle = CYAN; sc.fillStyle = AMBER;
        sc.beginPath(); sc.arc(m.left + m.width / 2, m.top + m.height / 2, m.width / 2 - 0.5, 0, Math.PI * 2); sc.stroke();
        sc.beginPath(); sc.arc(m.left + 61, m.top + 1, 7, 0, Math.PI * 2); sc.fill();
      }
      const cue = document.querySelector(".hero .scroll-cue");
      if (cue) { const r = cue.getBoundingClientRect(); sc.fillStyle = CYAN; sc.fillRect(r.left - 1, r.top - 1, r.width + 2, r.height + 2); }
    },
    navOrbit: (sc) => { // the small nav logo: cyan box with its amber dot (cx 60, cy 10, r 11 of 120)
      const el = document.querySelector(".nav .orbit");
      if (!el) return;
      const r = el.getBoundingClientRect(), k = r.width / 120;
      sc.fillStyle = CYAN; sc.fillRect(r.left - 1, r.top - 1, r.width + 2, r.height + 2);
      sc.fillStyle = AMBER;
      sc.beginPath(); sc.arc(r.left + 60 * k, r.top + 10 * k, 12 * k, 0, Math.PI * 2); sc.fill();
    },
    borders: (scope) => (sc) => { // every visible border inside `scope` (cards, tables, panels, rules)
      document.querySelectorAll(`${scope}, ${scope} *`).forEach((el) => {
        const cs = getComputedStyle(el), r = el.getBoundingClientRect();
        if (!r.width || !r.height || cs.visibility === "hidden") return;
        const side = (s) => (cs[`border${s}Style`] !== "none" ? parseFloat(cs[`border${s}Width`]) || 0 : 0);
        const [t, rt, b, l] = ["Top", "Right", "Bottom", "Left"].map(side);
        if (!(t || rt || b || l)) return;
        const rad = parseFloat(cs.borderTopLeftRadius) || 0;
        if (t && t === rt && t === b && t === l && rad) { // uniform rounded box: stroke its outline
          sc.strokeStyle = cs.borderTopColor; sc.lineWidth = t;
          sc.beginPath(); sc.roundRect(r.left + t / 2, r.top + t / 2, r.width - t, r.height - t, rad); sc.stroke();
          return;
        }
        if (t) { sc.fillStyle = cs.borderTopColor; sc.fillRect(r.left, r.top, r.width, t); }
        if (b) { sc.fillStyle = cs.borderBottomColor; sc.fillRect(r.left, r.bottom - b, r.width, b); }
        if (l) { sc.fillStyle = cs.borderLeftColor; sc.fillRect(r.left, r.top, l, r.height); }
        if (rt) { sc.fillStyle = cs.borderRightColor; sc.fillRect(r.right - rt, r.top, rt, r.height); }
      });
    },
    box: (selector, color = LINE) => (sc) => { // a bordered panel's outline
      document.querySelectorAll(selector).forEach((el) => {
        const r = el.getBoundingClientRect(), rad = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
        sc.strokeStyle = color; sc.lineWidth = 2;
        sc.beginPath(); sc.roundRect(r.left + 0.5, r.top + 0.5, r.width - 1, r.height - 1, rad); sc.stroke();
      });
    },
  };

  // Region = document rows [top, top + height). Returns [{ x, y, rgb, a }] in document coords.
  // cell: grid size in CSS px. pad: also include the cells bordering ink (the intro uses this to
  // uncover anti-aliased edges; for drawing glyphs out of particles it would fatten them).
  // minAlpha: ink coverage (0..255) a pixel needs to count. a: the cell's coverage, 0..1.
  const sample = ({ top, height = innerHeight, scopes = [], shapes: draw = [], cell = CELL, pad = true, minAlpha = 20 }) => {
    const CELL = cell;
    const W = innerWidth, H = Math.ceil(height);
    const vTop = top - scrollY; // where the region currently sits in the viewport
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const sc = canvas.getContext("2d", { willReadFrequently: true });
    sc.textBaseline = "middle";
    sc.translate(0, -vTop); // so everything can be drawn in viewport coordinates
    scopes.forEach((sel) => document.querySelectorAll(sel).forEach((s) => drawText(sc, s, vTop, vTop + H)));
    draw.forEach((fn) => fn(sc));

    // Cells with ink, dilated by one cell so anti-aliased edges are covered too.
    const gw = Math.ceil(W / CELL), gh = Math.ceil(H / CELL);
    const px = sc.getImageData(0, 0, W, H).data;
    const ink = new Uint8Array(gw * gh);
    const rgbAt = new Array(gw * gh);
    for (let gy = 0; gy < gh; gy++)
      for (let gx = 0; gx < gw; gx++) {
        for (let dy = 0; dy < CELL; dy++)
          for (let dx = 0; dx < CELL; dx++) {
            const x = gx * CELL + dx, y = gy * CELL + dy;
            const o = (y * W + x) * 4;
            if (x < W && y < H && px[o + 3] > minAlpha) {
              const g = gy * gw + gx;
              if (!ink[g]) rgbAt[g] = `${px[o]},${px[o + 1]},${px[o + 2]}`;
              ink[g] = Math.max(ink[g], px[o + 3]);
            }
          }
      }
    const cells = [];
    for (let gy = 0; gy < gh; gy++)
      for (let gx = 0; gx < gw; gx++) {
        // own ink color, or (edge padding) the color of the neighbor that made it a cell
        let rgb = rgbAt[gy * gw + gx];
        const a = ink[gy * gw + gx] / 255;
        for (let dy = -1; dy <= 1 && !rgb && pad; dy++)
          for (let dx = -1; dx <= 1 && !rgb; dx++) {
            const nx = gx + dx, ny = gy + dy;
            if (nx >= 0 && ny >= 0 && nx < gw && ny < gh && ink[ny * gw + nx]) rgb = rgbAt[ny * gw + nx];
          }
        if (rgb) cells.push({ x: gx * CELL, y: top + gy * CELL, rgb, a: a || 1 });
      }
    return cells;
  };

  return { CELL, sample, shapes };
})();
