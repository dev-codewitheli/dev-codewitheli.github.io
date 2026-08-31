# dev-codewitheli.github.io

Personal portfolio site for **Elijah Gabriel Centeno** — Senior Backend Developer.

A single-page, dark, terminal / cyberpunk-lite portfolio built with **plain HTML,
CSS, and JavaScript** — no frameworks and no build step. It runs by simply opening
`index.html` or via GitHub Pages.

🔗 **Live:** https://dev-codewitheli.github.io/

---

## Features

- **Hero** with an animated typing tagline and a lightweight `<canvas>` particle-grid background
- **About**, **Skills** (grouped interactive tags), **Experience** (vertical timeline), **Projects** (card grid), and **Contact** sections
- Sticky navigation with **active-section highlighting** and a **mobile hamburger** menu
- **Scroll-triggered** fade/slide-in animations via `IntersectionObserver`
- **Dark / light-terminal theme toggle**, persisted in `localStorage`
- Fully **responsive** and mobile-first, with fluid typography (`clamp()`)
- Respects `prefers-reduced-motion`

---

## Project structure

```
.
├── index.html      # Markup for all sections (semantic, commented)
├── styles.css      # Theme tokens (:root variables) + all styling
├── script.js       # Typing effect, canvas, nav, scroll reveal, theme toggle
├── .claude/
│   └── launch.json # Local dev-server config (optional, for preview tooling)
└── README.md
```

---

## Running locally

No build step is required.

- **Simplest:** double-click `index.html` to open it in your browser.
- **With a local server** (recommended, so relative paths and `fetch` behave exactly
  like production). With Node.js installed:

  ```bash
  npx --yes http-server -p 8199 -c-1 .
  ```

  then open <http://localhost:8199>.

---

## Editing your content

All editable content is marked with `<!-- TODO: ... -->` comments in `index.html`.
Key spots:

| What | Where |
|------|-------|
| Name & page title | `<title>` and `.hero__name` in `index.html` |
| Typing taglines | `PHRASES` array at the top of `script.js` |
| Bio & quick facts | `#about` section |
| Skills | `#skills` groups |
| Work history | `#experience` timeline items |
| Projects | `#projects` cards (title, role, description, tech, live link) |
| Contact links | `#contact` (email, GitHub, LinkedIn) |

### Retheming

Colors, spacing, fonts, and layout widths are defined as CSS variables under
`:root` (and `[data-theme="light"]`) at the top of `styles.css`. Change the single
`--accent` variable to reskin the whole site.

### Optional bits left commented out

- **GitHub repo icon** on project cards — uncomment the block in each `.project-card__links`
  and set the `href` when a public repo is available.
- **Résumé download button** — in `.hero__cta`, drop a `resume.pdf` in the project
  root and uncomment the `Download Résumé` link.

---

## Deployment

This repository is a GitHub Pages **user site** (`<username>.github.io`), so every
push to `main` is published automatically:

```bash
git add -A
git commit -m "Update content"
git push origin main
```

The site rebuilds within a minute or two. If it isn't live, confirm
**Settings → Pages** is set to *Deploy from a branch* → `main` / `/ (root)`.

---

## Tech

Vanilla HTML5, CSS3, and JavaScript (ES6+). Fonts — **JetBrains Mono** and
**Inter** — are loaded from the Google Fonts CDN. No other external dependencies.
