// Highlight the nav link for the section currently on screen.
const links = new Map([...document.querySelectorAll(".rail a")].map((a) => [a.hash.slice(1), a]));
const spy = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.remove("active"));
      links.get(e.target.id)?.classList.add("active");
    }),
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll(".hero[id], main section[id]").forEach((s) => spy.observe(s));

// Rail dot: slides along the track with the scroll. Each section's top lines up with its
// label, so the dot sits beside a label when that section reaches the top of the screen and
// travels between labels as you scroll between sections. The top of the page is Home,
// the very bottom maps to the last label.
const rail = document.querySelector(".rail");
const track = rail?.querySelector(".rail-track");
const dot = rail?.querySelector(".rail-dot");
if (rail && track && dot) {
  let stops = [];
  const measure = () => {
    const t = track.getBoundingClientRect().top;
    const maxY = document.documentElement.scrollHeight - innerHeight;
    stops = [];
    links.forEach((a, id) => {
      const sec = document.getElementById(id);
      if (!sec) return;
      const r = a.getBoundingClientRect();
      stops.push([Math.min(sec.offsetTop, maxY), r.top + r.height / 2 - t]);
    });
    if (!stops.length) return;
    const last = stops[stops.length - 1];
    if (last[0] < maxY) stops.push([maxY, last[1]]);
    place();
  };
  const place = () => {
    if (stops.length < 2) return;
    const y = scrollY;
    let i = 1;
    while (i < stops.length - 1 && y > stops[i][0]) i++;
    const [y0, p0] = stops[i - 1], [y1, p1] = stops[i];
    const u = y1 > y0 ? Math.min(1, Math.max(0, (y - y0) / (y1 - y0))) : 1;
    dot.style.transform = `translateY(${(p0 + (p1 - p0) * u).toFixed(1)}px)`;
  };
  let ticking = false;
  addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; place(); });
  }, { passive: true });
  addEventListener("resize", measure);
  addEventListener("load", measure);
  document.fonts?.ready.then(measure);
  measure();
}

// Pattern diagrams: freeze their animation for reduced-motion users, and only run them
// while they're on screen.
const diagrams = document.querySelectorAll(".diagram svg");
if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
  diagrams.forEach((s) => { s.pauseAnimations(); s.setCurrentTime(1.2); });
} else {
  const io = new IntersectionObserver((entries) =>
    entries.forEach((e) => (e.isIntersecting ? e.target.unpauseAnimations() : e.target.pauseAnimations())));
  diagrams.forEach((s) => io.observe(s));
}

document.getElementById("year").textContent = new Date().getFullYear();
