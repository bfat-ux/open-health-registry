// ── Nav toggle ───────────────────────────────────────────────
const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.querySelector(".site-nav");

const closeNav = () => {
  if (!primaryNav || !navToggle) return;
  primaryNav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
};

const toggleNav = () => {
  if (!primaryNav || !navToggle) return;
  const isOpen = primaryNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
};

if (navToggle && primaryNav) {
  navToggle.addEventListener("click", toggleNav);
  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });
}

document.addEventListener("click", (event) => {
  if (!primaryNav || !navToggle) return;
  const target = event.target;
  if (
    primaryNav.classList.contains("is-open") &&
    target instanceof Node &&
    !primaryNav.contains(target) &&
    !navToggle.contains(target)
  ) {
    closeNav();
  }
});

// ── Scroll reveal ────────────────────────────────────────────
const revealTargets = document.querySelectorAll(".reveal");
const prefersReducedMotion =
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && revealTargets.length > 0 && !prefersReducedMotion) {
  document.documentElement.classList.add("reveal-ready");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  revealTargets.forEach((target) => {
    if (target.getBoundingClientRect().top < window.innerHeight * 0.95) {
      target.classList.add("visible");
    }
    revealObserver.observe(target);
  });
} else if (revealTargets.length > 0) {
  revealTargets.forEach((t) => t.classList.add("visible"));
}

// ── Contact form ─────────────────────────────────────────────
const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const statusEl = document.querySelector(".form-status");
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  const setStatus = (message, state) => {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = "form-status";
    if (state === "error") statusEl.classList.add("is-error");
  };

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const endpoint = contactForm.getAttribute("action") || "/api/contact";
    const formData = new FormData(contactForm);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      org: formData.get("org") || "",
      subject: formData.get("subject") || "",
      message: formData.get("message"),
    };

    const originalText = submitBtn ? submitBtn.textContent : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }
    setStatus("", undefined);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const { error } = await response.json().catch(() => ({}));
        throw new Error(error || "Something went wrong. Please email us directly.");
      }

      setStatus("Message sent — we'll be in touch.", "success");
      contactForm.reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please email us directly.";
      setStatus(message, "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
}
