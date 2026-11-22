// Highlight the nav link for the section currently on screen.
const links = new Map([...document.querySelectorAll(".nav ul a")].map((a) => [a.hash.slice(1), a]));
const spy = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.remove("active"));
      links.get(e.target.id)?.classList.add("active");
    }),
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));

document.getElementById("year").textContent = new Date().getFullYear();
