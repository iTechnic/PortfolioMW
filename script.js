const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

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

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealItems.length) {
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
  revealItems.forEach((el) => io.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add("is-visible"));
}

const contactForm = document.querySelector("#contact-form");
contactForm?.addEventListener("submit", () => {
  const button = contactForm.querySelector(".form-submit");
  if (button) {
    button.disabled = true;
    button.textContent = "Sending...";
  }
});
