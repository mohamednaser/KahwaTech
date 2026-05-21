# KahwaTech ☕

> A self-contained, browser-only demo of a café operating system — point-of-sale, customer menu board, and owner dashboard. Built in Arabic (RTL), runs entirely in the browser with **no backend, no build step, and no real data**.

**🔗 Live demo:** https://mohamednaser.github.io/KahwaTech/

---

## What's inside

`index.html` is the launcher. From there you can open five screens (or press `1`–`5`):

| # | Screen | File | For | Notes |
|---|--------|------|-----|-------|
| 1 | **البوفية** — Boufiya / POS | `boufiya.html` | Staff | Fast tap-to-order counter screen (932×430 tablet, landscape) |
| 2 | **المنيو** — Menu board | `menu.html` | Customer | Wall-mounted menu display with live tweaks |
| 3 | **الإدارة** — Admin | `owner.html` | Owner | Sales analytics + menu editing (laptop & phone) |
| 4 | **الموبايل** — Mobile | `mobile.html` | Staff | Portrait waiter & boufiya screens in an iPhone frame |
| 5 | **المنيو الكامل** — Full menu | `menu-standalone.html` | Anyone | Single-file, fully offline build of the menu |

## How it works

Each screen is a static HTML page that loads **React 18** and **Babel Standalone** from a CDN, then transpiles the shared `.jsx` components in the browser. Shared modules:

- `menu-data.js` / `owner-data.js` — fake menu items and analytics data
- `*.jsx` — UI components (variations, mobile screens, owner dashboard, device frames, tweaks panel, etc.)

Because everything is static, the whole repository **is** the website — no bundler or `npm install` required.

## Run locally

The pages fetch the `.jsx` files over HTTP, so opening them via `file://` won't work. Serve the folder instead:

```bash
# any static server works; for example:
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Deploying to GitHub Pages

This repo deploys automatically via GitHub Actions (`.github/workflows/deploy.yml`) on every push to `main`.

**One-time setup:** in the repository, go to **Settings → Pages → Build and deployment** and set the **Source** to **GitHub Actions**. The next push to `main` publishes the site to the live URL above.

A `.nojekyll` file is included so GitHub serves all files as-is (no Jekyll processing).

---

*Demo only — all menu items, prices, and sales figures are fictional and Egyptian baladi-café themed.*
