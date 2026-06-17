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
Playwright MCP is available — navigate to `http://localhost:<port>`, resize to 1440×900, inject `.in-view` on `.step-row` and `.reveal` / `.letter-reveal` elements before screenshotting (IntersectionObserver won't fire in headless), then call `updateNavTheme()` to set the correct navbar state.

## Architecture

Everything is in `index.html`, organized top-to-bottom:

1. **CSS custom properties** (`:root`) — all color tokens, do not use raw hex outside this block
2. **Bottom blur overlay CSS** — `.bottom-blur` fixed element
3. **Navbar CSS + JS** — glassmorphism rectangle (no border), section-aware theme switching
4. **Section CSS** — each section has its own block; light sections share `.light-zone` background
5. **HTML sections** — Hero → `<div class="light-zone">` wrapping (How it works → Testimonials → Ambassador → Download) → Footer
6. **JS** — IntersectionObserver for scroll animations + navbar theme detection + road animation, at bottom of `<body>`
7. **`<div class="bottom-blur">`** — last element before `</body>`

## Color Tokens

| Token | Hex | Used for |
|---|---|---|
| `--dark-green` | `#2E6B4A` | Ambassador button, dark accents, icon strokes |
| `--bright-green` | `#28C45A` | CTAs, highlights, step badges |
| `--near-black` | `#0D1117` | Body text, hero bg, footer bg |
| `--light-bg` | `#F4F9F6` | Fallback only — active background is `.light-zone` gradient |

## Typography

| Font | Usage |
|---|---|
| **Plus Jakarta Sans** | Headings (`h1`–`h4`), nav buttons, UI labels, CTAs |
| **Manrope** | Body text (`body` default) — paragraphs, descriptions |

Loaded via Google Fonts CDN. No local font files in use (a "Free For Personal Use" PP Agrandir package is present in the repo folder but is **not wired up** — it requires a commercial license for a public website).

## Key Patterns

**Navbar** — `position: fixed`, glassmorphism (`backdrop-filter: blur(24px)`), no border, `border-radius: 16px` (rectangular pill). `.over-light` class adapts text/logo color for light sections. `.nav-btn.primary` has `border-radius: 10px`.

**Navbar theme detection** — JS probes `navbar.getBoundingClientRect().bottom + 10` against each `section[id]` rect to determine which section the navbar overlaps, then toggles `.over-light` class. Add new dark-background sections to the `darkSectionIds` Set.

**Logo filter on dark backgrounds** — `filter: invert(1) hue-rotate(180deg)` keeps "KOVA" text white while mathematically restoring the green steering wheel. `.nav.over-light .nav-logo { filter: none }` restores the original logo on light sections.

**Green buttons** — All use `border-radius: 10px` for a rectangular look: `.btn-primary` (hero), `.btn-amb` (ambassador), `.nav-btn.primary` (nav).

**iPhone frames** — CSS-only, no images. Structure: `.step-phone-wrap > .iphone > (.iphone-screen > .iphone-island + content)`. Side buttons via `::before`/`::after`. Add `.large` modifier for the Download section phone.

**Scroll animations** — `.step-row` starts `opacity:0` with `translateX(±80px)`. `IntersectionObserver` adds `.in-view` to trigger the CSS transition. Left-entry rows use `.from-left`, right-entry use `.from-right`.

**Reveal animations** — `.reveal` elements start `opacity:0` + `translateX(±60px)`. `IntersectionObserver` (`revealObs`, threshold 0.12) adds `.in-view`. `--reveal-delay` custom property staggers related elements.

**Letter-by-letter headings** — `.letter-reveal` elements have text nodes split into `<span class="char" style="--i:N">`. Each char transitions `opacity` + `translateY(18px)` with delay `calc(var(--i) * 0.028s)`.

**Smooth scroll helper** — `scrollToSection(id)` scrolls a section to the top of the viewport. Named `scrollToSection` (not `scrollTo`) to avoid shadowing `window.scrollTo`.

**App Store CTA** — The "Get KOVA" nav pill, the hero "Download the app" button, and the `.appstore-btn` in the download section all link to `https://apps.apple.com/us/app/ridekova/id6757269118`.

**Hero background** — local file `hero_image.png` + dot grid in `.hero-bg::after`. The dark overlay (`.hero-bg::before`) is set to `display: none` — the raw image shows through. To restore the tint, remove `display: none` from `.hero-bg::before`.

**Light zone** — `#how-it-works`, `#testimonials`, `#ambassador`, and `#download` are wrapped in `<div class="light-zone">`. Shared layered radial gradient applied once to `.light-zone`. Do not add a `background` property to any of these four sections individually.

**Testimonials carousel** — infinite marquee via `@keyframes testimonialScroll` translating `.testimonials-track` by `-50%`. 12 cards (6 originals + 6 duplicates). Edge fade via `mask-image` on `.testimonials-track-wrap`.

**Bottom blur overlay** — `<div class="bottom-blur">` is `position: fixed; bottom: 0; height: 140px; backdrop-filter: blur(14px)` with a `mask-image` gradient (transparent → black top to bottom). Creates a progressive frosted glass effect at the bottom of every viewport. The footer has `position: relative; z-index: 10000` to render above it.

**darkSectionIds** — only `'hero'` is in the set. All other sections use the light background.

## Assets

- `KOVA logo.png` — black "KOVA" text + bright green steering wheel replacing the O
- `hero_image.png` — hero section background photo (people in a car, travel/social vibe)
- `download_appstore_svg.png` — official App Store badge image used in the download section
- `color palette.png` — reference swatches (white / `#2E6B4A` / `#28C45A`)
- `Agrandir - Free For Personal Use/` — PP Agrandir font files, **personal use only**, not wired up
- Screenshot PNGs/JPGs in root — development previews only, not served to users

## Pages

- `index.html` — main landing page
- `terms.html` — Terms of Service placeholder (links back to index)
- `privacy.html` — Privacy Policy placeholder (links back to index)

## Footer

Footer (`<footer>`) is dark (`--near-black`) with `position: relative; z-index: 10000` (sits above the bottom blur overlay). Three columns via `flex` + `space-between`:
1. **Left** — KOVA logo (inverted to white via `filter: brightness(0) invert(1)`)
2. **Center** — `.footer-links`: Terms of Service → `terms.html`, Privacy Policy → `privacy.html`
3. **Right** — `.footer-right`: Instagram icon → `https://www.instagram.com/ridekova/`, copyright line, location line

Copyright: `© 2026 KOVA Group, Inc. All rights reserved.` / `West Lafayette, IN · Purdue University`

---

## Road Animation

A scroll-driven SVG road lives inside `.light-zone` as the first child: `<div class="road-wrap">` containing `.road-svg` with three `<path>` elements (`.road-border`, `.road-surface`, `.road-center`).

**How it works:**
- Path `d` is built via Catmull-Rom spline through waypoints measured with `getLayoutRect()` (offsetTop/offsetLeft chain — transform-immune)
- `strokeDasharray = totalLength`, initial `strokeDashoffset = totalLength` (fully hidden)
- CSS transition `stroke-dashoffset 0.2s ease-out` is set on the next rAF after `buildRoad()` so the initial reset has no animation
- On scroll (rAF-throttled): binary search via `getPointAtLength()` finds the arc length whose Y coordinate equals `scrollY + vh * scrollK - lzTop` (desired viewport position). This keeps the road tip at a consistent screen position regardless of path curvature
- **`scrollK`** is computed dynamically in `buildRoad()` so the tip lands inside the bottom mask zone at max scroll — road always fully completes before running out of scrollable distance
- **High-water mark** (`maxProg`): road never retreats when scrolling back up
- On resize: `buildRoad()` resets and rebuilds

**Path geometry (desktop ≥ 768px):**
- Starts at `[cx, 0]` (top-center of light-zone, hidden by top mask fade)
- S-snake through each `.step-phone-wrap`: peaks in the gap between phone and text column
- Gentle S through testimonials and ambassador sections
- Ends at `[cx, footerY]` (footer top edge, hidden by bottom mask fade — appears to slide under footer)
- Mobile (< 768px): simple 6-segment S-wave fallback

**Visual** (thin, premium):
- `.road-border`: 28px, `rgba(46,107,74,0.32)`
- `.road-surface`: 16px, `rgba(255,255,255,0.15)`
- `.road-center`: 1.5px, `rgba(255,255,255,0.28)`

**`.road-wrap` mask** — 100px top fade (hides origin stub) + 120px bottom fade (road dissolves into footer). `maskBottom = 120` constant in JS must match the CSS value.
