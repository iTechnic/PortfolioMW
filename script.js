document.documentElement.classList.add("js");

const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const spotlight = document.querySelector(".spotlight");
const revealItems = document.querySelectorAll(".reveal");
const tiltCards = document.querySelectorAll(".tilt-card");
const floatingItems = document.querySelectorAll("[data-float]");
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let ticking = false;

document.querySelector("#year").textContent = new Date().getFullYear();

menuToggle?.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  body.classList.toggle("nav-open", !expanded);
});

navLinks?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    menuToggle?.setAttribute("aria-expanded", "false");
    body.classList.remove("nav-open");
  }
});

window.addEventListener("pointermove", (event) => {
  if (!spotlight || motionQuery.matches) return;
  spotlight.style.setProperty("--x", `${event.clientX}px`);
  spotlight.style.setProperty("--y", `${event.clientY}px`);
});

const updateFloatingItems = () => {
  if (motionQuery.matches) return;

  const scrollY = window.scrollY;
  floatingItems.forEach((item, index) => {
    const speed = Number(item.dataset.speed || 0.035);
    const rotate = Number(item.dataset.rotate || 0.004);
    const idle = Math.sin(scrollY / 420 + index) * 3.5;
    const y = scrollY * speed + idle;
    const r = scrollY * rotate;

    item.style.setProperty("--float-y", `${y.toFixed(2)}px`);
    item.style.setProperty("--float-r", `${r.toFixed(2)}deg`);
  });
};

const requestFloatUpdate = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateFloatingItems();
    ticking = false;
  });
};

window.addEventListener("scroll", requestFloatUpdate, { passive: true });
window.addEventListener("resize", requestFloatUpdate);
updateFloatingItems();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

tiltCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (motionQuery.matches) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -2.6;
    const rotateY = ((x / rect.width) - 0.5) * 2.6;

    card.style.setProperty("--card-x", `${x}px`);
    card.style.setProperty("--card-y", `${y}px`);
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});
