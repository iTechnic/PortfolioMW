document.documentElement.classList.add("js");

const body = document.body;
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(pointer: fine)");

/* Year */
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

/* Mobile nav */
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuToggle?.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!open));
  body.classList.toggle("nav-open", !open);
});
navLinks?.addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    menuToggle?.setAttribute("aria-expanded", "false");
    body.classList.remove("nav-open");
  }
});

/* Scroll reveals with sibling stagger + failsafe */
(() => {
  const items = [...document.querySelectorAll(".reveal, .reveal--line")];
  // stagger among reveal siblings
  const groups = new Map();
  items.forEach((el) => {
    const p = el.parentElement;
    if (!groups.has(p)) groups.set(p, 0);
    const idx = groups.get(p);
    el.style.setProperty("--reveal-delay", `${Math.min(idx, 6) * 70}ms`);
    groups.set(p, idx + 1);
  });

  const showAll = () => items.forEach((el) => el.classList.add("is-visible"));
  if (reduce.matches || !("IntersectionObserver" in window)) return showAll();

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  items.forEach((el) => io.observe(el));
  // failsafe: never leave content hidden (covers occluded tabs / stalled load)
  setTimeout(showAll, 3000);
  window.addEventListener("load", () => setTimeout(showAll, 1500));
})();

/* Signature: interactive project index */
(() => {
  const list = document.querySelector("[data-index]");
  const stage = document.querySelector("[data-stage]");
  if (!list || !stage) return;
  const items = [...list.querySelectorAll(".index__item")];
  const shots = [...stage.querySelectorAll(".index__shot")];
  const urlEl = stage.querySelector("[data-stage-url]");
  let active = 0;

  const setActive = (i) => {
    if (i === active) return;
    active = i;
    shots.forEach((s) => s.classList.toggle("is-active", Number(s.dataset.shot) === i));
    const item = items[i];
    if (urlEl && item) urlEl.textContent = item.dataset.url || "";
  };

  items.forEach((item) => {
    const i = Number(item.dataset.i);
    item.addEventListener("pointerenter", () => setActive(i));
    item.addEventListener("focusin", () => setActive(i));
  });
})();

/* Magnetic buttons (desktop, fine pointer, motion on) */
(() => {
  if (reduce.matches || !finePointer.matches) return;
  const targets = document.querySelectorAll("[data-magnetic]");
  targets.forEach((el) => {
    const strength = 0.28;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  });
})();

/* Contact form submit state (sub-page) */
const contactForm = document.querySelector("#contact-form");
contactForm?.addEventListener("submit", () => {
  const button = contactForm.querySelector(".form-submit");
  if (button) { button.disabled = true; button.textContent = "Sending..."; }
});
