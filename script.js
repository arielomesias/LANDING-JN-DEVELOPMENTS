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
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const requiredFields = [
      ["name", "Please enter your name."],
      ["phone", "Please enter your phone number."],
      ["email", "Please enter your email."],
      ["projectType", "Please choose a project type."],
      ["cityArea", "Please enter your city or project area."],
      ["projectDescription", "Please add a short project description."]
    ];

    for (const [field, message] of requiredFields) {
      const value = (formData.get(field) || "").toString().trim();
      if (!value) {
        status.textContent = message;
        status.style.color = "#9f2c2c";
        const control = form.elements.namedItem(field);
        if (control && typeof control.focus === "function") {
          control.focus();
        }
        return;
      }
    }

    if (!formData.get("consent")) {
      status.textContent = "Please confirm the consent checkbox before submitting.";
      status.style.color = "#9f2c2c";
      const consent = form.elements.namedItem("consent");
      if (consent && typeof consent.focus === "function") {
        consent.focus();
      }
      return;
    }

    status.textContent = "Thanks. We received your project details and will follow up about your consultation.";
    status.style.color = "#1d6a4e";
    form.reset();
  });
}
