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

**iPhone frames** — CSS-only shell; screens now show real app screenshots. Structure: `.step-phone-wrap > .iphone > (.iphone-screen > .iphone-island + .iphone-screen-img)`. `.iphone-screen-img` uses `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: fill` to fill edge-to-edge; `.iphone-island` has `position: relative; z-index: 1` to overlay the image. Side buttons via `::before`/`::after`. Add `.large` modifier for the Download section phone.

**Scroll animations** — `.step-row` starts `opacity:0` with `translateX(±80px)`. `IntersectionObserver` adds `.in-view` to trigger the CSS transition. Left-entry rows use `.from-left`, right-entry use `.from-right`.

**Reveal animations** — `.reveal` elements start `opacity:0` + `translateX(±60px)`. `IntersectionObserver` (`revealObs`, threshold 0.12) adds `.in-view`. `--reveal-delay` custom property staggers related elements.

**Letter-by-letter headings** — `.letter-reveal` elements have text nodes split into `<span class="char" style="--i:N">`. Each char transitions `opacity` + `translateY(18px)` with delay `calc(var(--i) * 0.028s)`.

**Smooth scroll helper** — `scrollToSection(id)` scrolls a section to the top of the viewport. Named `scrollToSection` (not `scrollTo`) to avoid shadowing `window.scrollTo`.

**Hero eyebrow button** — `.btn-purdue` replaces the old `Discover · Connect · Explore` eyebrow text. It is a pill-shaped outline button (`border: 1.5px solid rgba(255,255,255,0.35)`, `border-radius: 100px`, Manrope font) with a white "New" badge (`.btn-purdue-new`, black text on white background, stays white on hover) on the left and a right-arrow SVG on the right. On hover: solid `var(--bright-green)` fill, dark text. Links to the live Purdue article URL.

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
- `step1.png`, `step2.png`, `step3.png` — app screenshots displayed inside the "How it works" iPhone frames
- `final_ss.png` — app screenshot displayed inside the Download section's large iPhone frame
- `Agrandir - Free For Personal Use/` — PP Agrandir font files, **personal use only**, not wired up
- Other PNGs/JPGs in root — development preview screenshots only, not served to users

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

A scroll-driven SVG road lives inside `.light-zone` as the first child: `<div class="road-wrap">` containing `.road-svg`. The road is rendered as **static visual layers revealed by an animated SVG `<mask>`** (mask-wipe), not by per-path dashoffset.

**SVG structure** (`.road-svg`):
- `<defs>`: `<mask id="road-mask">` containing one `.road-reveal` path (white, thick stroke), plus `<filter id="brush-tex">` (`feTurbulence`+`feDisplacementMap`) for the brush's bristly edge
- `<g mask="url(#road-mask)">`: the static visual layers — `.road-sheen`, `.road-base`, `.road-center` (all share the same `d`)
- `.road-brush`: a `<g>` holding a paint-daub sprite, repositioned at the tip every frame

**Reveal model (mask-wipe + rAF lerp):**
- Path `d` built via Catmull-Rom spline through waypoints from `getLayoutRect()` (offsetTop/offsetLeft chain — transform-immune). The same `d` is set on every visual layer **and** `.road-reveal`.
- `.road-reveal` has `strokeDasharray = totalLength`; animating its `strokeDashoffset` from `totalLength`→`0` wipes the mask open, progressively revealing the static layers beneath. This is why the center line can be a static green dash pattern *and* still draw on.
- **Smoothness**: a continuous `requestAnimationFrame` loop eases the rendered length toward a scroll-driven target each frame — `drawnLen += (targetLen − drawnLen) * SMOOTH` (`SMOOTH ≈ 0.14`). Decoupled from scroll-event timing, so the draw is fluid at any scroll speed (no CSS transition on dashoffset). The loop stops when settled and restarts on scroll.
- **Target**: on scroll (rAF-throttled), binary search via `getPointAtLength()` finds the arc length whose Y equals `scrollY + vh * scrollK − lzTop` (consistent tip screen position). `targetLen` is a high-water mark — the road never retreats when scrolling up. Within ~8px of page bottom, the target snaps to `totalLength` so the road always completes.
- **`scrollK`** is computed dynamically in `buildRoad()` so the tip reaches `footerY + OVERLAP` (under the footer) exactly at max scroll.
- On resize: `buildRoad()` resets and rebuilds.

**Brush tip** — each frame, the brush `<g>` is `translate`d to `reveal.getPointAtLength(drawnLen)` and `rotate`d to the path tangent (point 6px behind). It fades out (`opacity 0`) at the very start and once the road is essentially complete, so no brush floats under the footer.

**Path geometry (desktop ≥ 768px):**
- Starts at `[cx, -OVERLAP]` (40px above the light-zone top — inside the hero's covered area)
- **Steps 1 & 3** (phone LEFT): peak at `W * 0.83` — the wide empty right portion of the layout past the text content
- **Step 2** (phone RIGHT): peak at `pr.left - 90` — 90px clearance from the phone frame, well into the center gap
- **No bracket waypoints** — peak-only (one waypoint per step). Bracket approach/exit waypoints cause Bezier control-point squiggles when an incoming tangent from a distant neighbour overshoots a short segment. With peak-only, step 2's Catmull-Rom tangent x-component is exactly 0 (steps 1 and 3 are at the same x), so the road descends vertically through the gap with no lateral drift.
- **Testimonials**: two waypoints — `[W * 0.14, testInnerR.cy]` (left of heading text) then `[cx + W * 0.05, carouselR.cy]` (through middle of carousel). Queries `#testimonials .testimonials-inner` and `#testimonials .testimonials-track-wrap`.
- **Ambassador**: `W * 0.93` (far right page margin)
- **Download**: `dlPhoneR.right + 44` (gap right of download phone)
- Ends at `[cx, footerY + OVERLAP]` — under the opaque footer (`z-index: 10000`)
- Mobile (< 768px): simple S-wave fallback ending at `[cx, H + OVERLAP]`

**Hero emergence (mirrors footer):**
- `.road-wrap` has `inset: -40px 0 -40px 0` — extends `OVERLAP=40px` above AND below the light-zone
- `#hero` has `z-index: 1` — hero renders on top of the road-wrap extension, hiding the road stub just as the footer (`z-index: 10000`) hides the tail
- ViewBox: `0 -OVERLAP W H+2*OVERLAP` — SVG coordinates remain light-zone-relative; `getLayoutRect` measurements are unchanged
- Mask: `transparent 0px, black 50px` — hero covers the first 40px, leaving only a ~10px fade visible just below the hero edge

**Visual** (thicker, premium):
- `.road-base`: 34px, `var(--near-black)` @ 0.92 opacity (solid road body)
- `.road-sheen`: 40px, `rgba(255,255,255,0.06)` (faint lift under the base)
- `.road-center`: 3px, `var(--bright-green)`, `stroke-dasharray: 26 22` (green dashed marking)
- `.road-reveal`: 46px white (mask only — never visible)
