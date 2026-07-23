const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll(".reveal");
const form = document.querySelector("#lead-form");
const status = document.querySelector("#form-status");
const heroParallaxImage = document.querySelector(".hero-copy-media img");

if (header) {
  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (heroParallaxImage && !prefersReducedMotion) {
  let ticking = false;

  const updateHeroParallax = () => {
    const rect = heroParallaxImage.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.bottom <= 0 || rect.top >= viewportHeight) {
      ticking = false;
      return;
    }

    const progress = (rect.top + rect.height * 0.5 - viewportHeight * 0.5) / viewportHeight;
    const offset = Math.max(-18, Math.min(18, progress * -18));
    heroParallaxImage.style.setProperty("--parallax-offset", `${offset}px`);
    ticking = false;
  };

  const requestParallaxUpdate = () => {
    if (window.innerWidth < 980) {
      heroParallaxImage.style.setProperty("--parallax-offset", "0px");
      return;
    }

    if (!ticking) {
      window.requestAnimationFrame(updateHeroParallax);
      ticking = true;
    }
  };

  requestParallaxUpdate();
  window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
  window.addEventListener("resize", requestParallaxUpdate, { passive: true });
}

if (revealItems.length) {
  if (prefersReducedMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, observerRef) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observerRef.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -32px 0px"
      }
    );

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 35, 210)}ms`;
      observer.observe(item);
    });
  }
}

if (form && status) {
  form.addEventListener("submit", () => {
    const submitButton = form.querySelector('button[type="submit"]');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    status.textContent = "Sending your project details...";
    status.style.color = "#263d50";
  });
}
