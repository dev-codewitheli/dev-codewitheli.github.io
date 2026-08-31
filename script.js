/* =============================================================
   Portfolio — script.js  (vanilla JS, no dependencies)

   Features:
     1. Typing effect for the hero tagline
     2. Lightweight canvas particle-grid background
     3. Mobile hamburger menu
     4. Sticky-nav border + active-section highlighting
     5. Scroll-reveal animations (IntersectionObserver)
     6. Theme toggle (dark <-> light terminal), persisted
============================================================= */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* -----------------------------------------------------------
     1. HERO TYPING EFFECT
  ----------------------------------------------------------- */
  // TODO: edit these phrases to match your specialties
  const PHRASES = [
    "Java & Spring Boot",
    "Hexagonal Architecture",
    "Distributed Systems",
    "Event-Driven Design",
  ];

  function initTyping() {
    const el = document.getElementById("typed");
    if (!el) return;

    // Reduced motion: just show the first phrase statically.
    if (prefersReducedMotion) {
      el.textContent = PHRASES[0];
      return;
    }

    const TYPE_MS = 70;    // per-char typing speed
    const ERASE_MS = 40;   // per-char erase speed
    const HOLD_MS = 1600;  // pause on a full phrase
    const GAP_MS = 400;    // pause on empty before next phrase

    let phraseIndex = 0;
    let charIndex = 0;
    let erasing = false;

    function tick() {
      const phrase = PHRASES[phraseIndex];

      if (!erasing) {
        charIndex++;
        el.textContent = phrase.slice(0, charIndex);
        if (charIndex === phrase.length) {
          erasing = true;
          return setTimeout(tick, HOLD_MS);
        }
        return setTimeout(tick, TYPE_MS);
      } else {
        charIndex--;
        el.textContent = phrase.slice(0, charIndex);
        if (charIndex === 0) {
          erasing = false;
          phraseIndex = (phraseIndex + 1) % PHRASES.length;
          return setTimeout(tick, GAP_MS);
        }
        return setTimeout(tick, ERASE_MS);
      }
    }
    tick();
  }

  /* -----------------------------------------------------------
     2. CANVAS PARTICLE GRID (hero background)
     Lightweight: nodes drift and connect with faint lines.
  ----------------------------------------------------------- */
  function initCanvas() {
    const canvas = document.getElementById("heroCanvas");
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    let width, height, particles, rafId;

    // Read accent color from CSS so the canvas follows the theme.
    function accentRGB() {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim();
      // Convert hex (#22d3ee) to "r, g, b"
      const hex = raw.replace("#", "");
      if (hex.length === 6) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `${r}, ${g}, ${b}`;
      }
      return "34, 211, 238"; // fallback cyan
    }

    let rgb = accentRGB();

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;

      // Particle count scales with area, capped for performance.
      const count = Math.min(90, Math.floor((width * height) / 16000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      }));
    }

    const LINK_DIST = 130; // px distance to draw a connecting line

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Node dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, 0.7)`;
        ctx.fill();

        // Connecting lines to nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${rgb}, ${0.18 * (1 - dist / LINK_DIST)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      rafId = requestAnimationFrame(draw);
    }

    // Pause the animation when the hero is off-screen (saves CPU/battery).
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!rafId) draw();
          } else {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        });
      },
      { threshold: 0 }
    );

    resize();
    io.observe(canvas);
    draw();

    window.addEventListener("resize", debounce(resize, 200));
    // Recompute accent color if the theme changes.
    window.addEventListener("themechange", () => { rgb = accentRGB(); });
  }

  /* -----------------------------------------------------------
     3. MOBILE HAMBURGER MENU
  ----------------------------------------------------------- */
  function initHamburger() {
    const btn = document.getElementById("hamburger");
    const links = document.getElementById("navLinks");
    if (!btn || !links) return;

    function close() {
      links.classList.remove("is-open");
      btn.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }

    btn.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      btn.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    });

    // Close the menu after tapping a link.
    links.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));

    // Close on resize back to desktop.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) close();
    });
  }

  /* -----------------------------------------------------------
     4. STICKY NAV: border-on-scroll + active-link highlight
  ----------------------------------------------------------- */
  function initNavState() {
    const nav = document.getElementById("nav");
    const sections = Array.from(document.querySelectorAll("main section[id]"));
    const linkFor = (id) =>
      document.querySelector(`.nav__link[href="#${id}"]`);

    // Border appears once scrolled past the top.
    function onScroll() {
      nav.classList.toggle("nav--scrolled", window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Active-section highlight via IntersectionObserver.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = linkFor(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            document
              .querySelectorAll(".nav__link.is-active")
              .forEach((l) => l.classList.remove("is-active"));
            link.classList.add("is-active");
          }
        });
      },
      // Trigger when a section crosses the middle-ish of the viewport.
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
  }

  /* -----------------------------------------------------------
     5. SCROLL-REVEAL ANIMATIONS
  ----------------------------------------------------------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (prefersReducedMotion) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target); // reveal once
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach((el) => observer.observe(el));
  }

  /* -----------------------------------------------------------
     6. THEME TOGGLE (persisted in localStorage)
  ----------------------------------------------------------- */
  function initTheme() {
    const toggle = document.getElementById("themeToggle");
    const root = document.documentElement;

    // Restore saved preference (default: dark).
    let saved = null;
    try { saved = localStorage.getItem("theme"); } catch (e) { /* ignore */ }
    if (saved === "light") root.setAttribute("data-theme", "light");

    if (!toggle) return;

    toggle.addEventListener("click", () => {
      const isLight = root.getAttribute("data-theme") === "light";
      if (isLight) {
        root.removeAttribute("data-theme");
        persist("dark");
      } else {
        root.setAttribute("data-theme", "light");
        persist("light");
      }
      // Notify the canvas so it re-reads the accent color.
      window.dispatchEvent(new Event("themechange"));
    });

    function persist(value) {
      try { localStorage.setItem("theme", value); } catch (e) { /* ignore */ }
    }
  }

  /* -----------------------------------------------------------
     Small utility: debounce
  ----------------------------------------------------------- */
  function debounce(fn, wait) {
    let t;
    return function () {
      clearTimeout(t);
      const args = arguments;
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  /* -----------------------------------------------------------
     BOOTSTRAP
  ----------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();      // set theme before paint-sensitive work
    initTyping();
    initCanvas();
    initHamburger();
    initNavState();
    initReveal();
  });
})();
