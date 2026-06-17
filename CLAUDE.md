# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Single-file static landing page for the **KOVA** social/travel app. All HTML, CSS, and JS live in `index.html`. No build tools, no framework, no dependencies beyond Google Fonts (loaded via CDN).

## Development

**Preview locally:**
```
python -m http.server 8080
# then open http://localhost:8080
```
Use a server (not `file://`) because some browsers block local-file CDN requests on file:// origins.

**Taking screenshots for review:**
Playwright MCP is available — navigate to `http://localhost:<port>`, resize to 1440×900, inject `.in-view` on `.step-row` elements before screenshotting (IntersectionObserver won't fire in headless), then call `updateNavTheme()` to set the correct navbar state.

## Architecture

Everything is in `index.html`, organized top-to-bottom:

1. **CSS custom properties** (`:root`) — all color tokens, do not use raw hex outside this block
2. **Navbar CSS + JS** — glassmorphism pill, always transparent, section-aware theme switching
3. **Section CSS** — each section has its own block; light sections share `.light-zone` background
4. **HTML sections** — Hero → `<div class="light-zone">` wrapping (How it works → Testimonials → Ambassador → Download) → Footer
5. **JS** — IntersectionObserver for scroll animations + navbar theme detection, at bottom of `<body>`

## Color Tokens

| Token | Hex | Used for |
|---|---|---|
| `--dark-green` | `#2E6B4A` | Ambassador button, dark accents, icon strokes |
| `--bright-green` | `#28C45A` | CTAs, highlights, step badges |
| `--near-black` | `#0D1117` | Body text, hero bg, footer bg |
| `--light-bg` | `#F4F9F6` | Fallback only — active background is `.light-zone` gradient |

## Key Patterns

**Navbar theme detection** — JS probes `navbar.getBoundingClientRect().bottom + 10` against each `section[id]` rect to determine which section the navbar overlaps, then toggles `.over-light` class. Add new dark-background sections to the `darkSectionIds` Set.

**Logo filter on dark backgrounds** — `filter: invert(1) hue-rotate(180deg)` keeps "KOVA" text white while mathematically restoring the green steering wheel (invert shifts green H≈139° to H≈319°; hue-rotate(180°) brings it back). `.nav.over-light .nav-logo { filter: none }` restores the original logo on light sections.

**iPhone frames** — CSS-only, no images. Structure: `.step-phone-wrap > .iphone > (.iphone-screen > .iphone-island + content)`. Side buttons via `::before`/`::after`. Add `.large` modifier for the Download section phone.

**Scroll animations** — `.step-row` starts `opacity:0` with `translateX(±80px)`. `IntersectionObserver` adds `.in-view` to trigger the CSS transition. Left-entry rows use `.from-left`, right-entry use `.from-right`.

**Smooth scroll helper** — `scrollToSection(id)` in the inline `<script>` scrolls a section to the top of the viewport. Named `scrollToSection` (not `scrollTo`) to avoid shadowing `window.scrollTo`, which would cause infinite recursion.

**App Store CTA** — The "Get KOVA" nav pill, the hero "Download the app" button, and the `.appstore-btn` image in the download section all link to `https://apps.apple.com/us/app/ridekova/id6757269118`. The download section badge uses `download_appstore_svg.png` as an `<img>` with CSS hover lift (`translateY(-4px) scale(1.02)` + shadow).

**Hero background** — local file `hero_image.png` + layered dark overlay gradients in `.hero-bg::before` + dot grid in `.hero-bg::after`.

**Light zone** — `#how-it-works`, `#testimonials`, `#ambassador`, and `#download` are wrapped in `<div class="light-zone">`. The shared layered radial gradient (`rgba(40,196,90,…)` spots over `linear-gradient(155deg, #f6fdf9 … #f9fefb)`) is applied once to `.light-zone` so the background is continuous with no visible seam between sections. Do not add a `background` property to any of these four sections individually.

**Testimonials carousel** — infinite marquee via `@keyframes testimonialScroll` translating `.testimonials-track` by `-50%`. The track contains 12 cards (6 originals + 6 duplicates). Arch layout uses `nth-child(6n+N)` with `translateY` + `rotate` so the pattern repeats seamlessly across duplicated cards. No hover-pause. Edge fade via `mask-image` linear-gradient on `.testimonials-track-wrap`.

**darkSectionIds** — only `'hero'` is in the set. All other sections use the light background and do not need navbar inversion.

## Assets

- `KOVA logo.png` — black "KOVA" text + bright green steering wheel replacing the O
- `hero_image.png` — hero section background photo (people in a car, travel/social vibe)
- `download_appstore_svg.png` — official App Store badge image used in the download section
- `color palette.png` — reference swatches (white / `#2E6B4A` / `#28C45A`)
- Screenshot PNGs/JPGs in root — development previews only, not served to users

## Pages

- `index.html` — main landing page
- `terms.html` — Terms of Service placeholder (links back to index)
- `privacy.html` — Privacy Policy placeholder (links back to index)

## Footer

Footer (`<footer>`) is dark (`--near-black`) with three columns via `flex` + `space-between`:
1. **Left** — KOVA logo (inverted to white via `filter: brightness(0) invert(1)`)
2. **Center** — `.footer-links`: Terms of Service → `terms.html`, Privacy Policy → `privacy.html`
3. **Right** — `.footer-right`: Instagram icon → `https://www.instagram.com/ridekova/`, copyright line, location line

Copyright reads: `© 2026 KOVA Group, Inc. All rights reserved.` with a secondary `West Lafayette, IN · Purdue University` in `.footer-location`.
