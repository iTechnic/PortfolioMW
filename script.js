document.documentElement.classList.add("js");

const body = document.body;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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
navLinks?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle?.setAttribute("aria-expanded", "false");
    body.classList.remove("nav-open");
  }
});

/* Scroll reveals (with per-group stagger + failsafe) */
(() => {
  document.querySelectorAll("[data-stagger]").forEach((group) => {
    [...group.children]
      .filter((c) => c.classList.contains("reveal"))
      .forEach((c, i) => c.style.setProperty("--reveal-delay", `${i * 80}ms`));
  });

  const items = document.querySelectorAll(".reveal");
  const showAll = () => items.forEach((el) => el.classList.add("is-visible"));

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    showAll();
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );
  items.forEach((el) => io.observe(el));

  // Failsafe: never leave content hidden if the observer never fires.
  window.addEventListener("load", () => setTimeout(showAll, 2500));
})();

/* Portfolio showcase slider */
(() => {
  const root = document.querySelector("[data-showcase]");
  if (!root) return;

  const track = root.querySelector("[data-showcase-track]");
  const slides = [...root.querySelectorAll(".showcase__slide")];
  const urlEl = root.querySelector("[data-showcase-url]");
  const captionEl = root.querySelector("[data-showcase-caption]");
  const dotsWrap = root.querySelector("[data-showcase-dots]");
  const prevBtn = root.querySelector("[data-showcase-prev]");
  const nextBtn = root.querySelector("[data-showcase-next]");
  if (!track || slides.length === 0) return;

  let index = 0;
  let timer = null;
  const INTERVAL = 4800;

  const dots = slides.map((slide, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "showcase__dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Show ${slide.dataset.name || "project " + (i + 1)}`);
    dot.addEventListener("click", () => {
      goTo(i);
      restart();
    });
    dotsWrap?.appendChild(dot);
    return dot;
  });

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    const s = slides[index];
    if (urlEl) urlEl.textContent = s.dataset.url || "";
    if (captionEl) captionEl.innerHTML = `${s.dataset.name || ""} <span>&middot; ${s.dataset.type || ""}</span>`;
    dots.forEach((d, di) => d.setAttribute("aria-selected", String(di === index)));
    slides.forEach((sl, si) => sl.setAttribute("aria-hidden", String(si !== index)));
  }

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  function play() {
    if (reduceMotion.matches || timer) return;
    timer = setInterval(next, INTERVAL);
  }
  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
  function restart() {
    stop();
    play();
  }

  nextBtn?.addEventListener("click", () => {
    next();
    restart();
  });
  prevBtn?.addEventListener("click", () => {
    prev();
    restart();
  });

  root.addEventListener("pointerenter", stop);
  root.addEventListener("pointerleave", play);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", play);
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      next();
      restart();
    } else if (e.key === "ArrowLeft") {
      prev();
      restart();
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else play();
  });

  goTo(0);
  play();
})();

/* Contact form submit state */
const contactForm = document.querySelector("#contact-form");
contactForm?.addEventListener("submit", () => {
  const button = contactForm.querySelector(".form-submit");
  if (button) {
    button.disabled = true;
    button.textContent = "Sending...";
  }
});
