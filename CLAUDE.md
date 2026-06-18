# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Planning

**Every plan must include a plain-English explanation** of what will change — a short, jargon-free summary (in addition to any technical detail) describing what the user will see/experience. The user always wants this, for every plan.

## Project Overview

Single-file static landing page for the **KOVA** social/travel app. All HTML, CSS, and JS live in `index.html`. No build tools, no framework. External deps (both via CDN): Google Fonts and **Lenis** (smooth-scroll, `unpkg.com/lenis`).

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
| `--light-bg` | `#F4F9F6` | Active background for `.light-zone` (flat solid color) |

## Typography

| Font | Usage |
|---|---|
| **Plus Jakarta Sans** | Headings (`h1`–`h4`), nav buttons, UI labels, CTAs |
| **Manrope** | Body text (`body` default, `font-weight: 500`) — paragraphs, descriptions |

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

**Smooth scrolling (Lenis)** — Lenis (CDN, `lenis@1.1.18`) gives the page a weighted-but-smooth glide. Initialized at the top of the inline `<script>` with `lerp: 0.06` (lower = heavier), `wheelMultiplier: 0.9`, driven by a `requestAnimationFrame` loop. Lenis updates the *native* scroll position (not a transform), so `window.scrollY` and `window` `scroll` events stay accurate — the road animation and `updateNavTheme` listeners need no changes. Skipped entirely when `prefers-reduced-motion: reduce` (falls back to native scroll). Tune free-scroll feel via `lerp` (~0.08 lighter / ~0.05 heavier). The CSS `html { scroll-behavior: smooth }` was removed because it double-eases against Lenis; minimal Lenis reset CSS lives in the Reset block.

**Smooth scroll helpers** — `scrollToSection(id)` and `scrollToTop()` both route nav-triggered scrolls through `lenis.scrollTo(..., NAV_SCROLL)`, where `NAV_SCROLL = { duration: 1.6, easing: easeInOutCubic }` gives a deliberate, slow glide (distinct from — and slower than — the free-scroll `lerp`). Both fall back to `window.scrollTo({ behavior: 'smooth' })` when Lenis is inactive. `scrollToSection` is named so (not `scrollTo`) to avoid shadowing `window.scrollTo`. Used by: nav links (How it works, Ambassador), "Get KOVA" + hero "Download the app" (→ `download`), and the nav logo (→ `scrollToTop`). Tune auto-scroll pace via `NAV_SCROLL.duration`.

**Hero eyebrow button** — `.btn-purdue` replaces the old `Discover · Connect · Explore` eyebrow text. It is a pill-shaped outline button (`border: 1.5px solid rgba(255,255,255,0.35)`, `border-radius: 100px`, Manrope font) with a white "New" badge (`.btn-purdue-new`, black text on white background, stays white on hover) on the left and a right-arrow SVG on the right. On hover: solid `var(--bright-green)` fill, dark text. Links to the live Purdue article URL.

**App Store CTA** — Only the `.appstore-btn` inside `.dl-qr-card` and the QR code in the download section link to `https://apps.apple.com/us/app/ridekova/id6757269118`. The "Get KOVA" nav pill and the hero "Download the app" button are now `<button>`s that `scrollToSection('download')` (smooth-scroll to the download section) instead of opening the App Store.

**Download section card** — `#download` contains a `.dl-card` (dark green, `border-radius: 28px`, `height: 380px`, `overflow: hidden`) with three flex columns:
1. `.dl-phone-col` — the `.iphone.large` frame with `final_ss.png`; `padding-top: 40px` so the phone top has breathing room, and the card's fixed height clips the bottom ~51% of the frame.
2. `.dl-text-col` — "Take KOVA everywhere." heading and paragraph (no section label). Text colors are overridden white inside the card (`.dl-card .section-title`, `.dl-card .section-sub`, etc.).
3. `.dl-qr-card` — white rounded sub-frame (`border-radius: 14px`, `padding: 12px 14px`) containing a QR code image (`200×200px`, fetched from `api.qrserver.com`) and the App Store badge (`width: 200px`, `height: auto`). Both are the same width.

The road JS queries the download phone via `#download .dl-phone-col` — update this selector if the class name changes.

**Hero background** — local file `hero_image.png` + dot grid in `.hero-bg::after`. The dark overlay (`.hero-bg::before`) is set to `display: none` — the raw image shows through. To restore the tint, remove `display: none` from `.hero-bg::before`.

**Light zone** — `#how-it-works`, `#testimonials`, `#ambassador`, and `#download` are wrapped in `<div class="light-zone">`. Background is a flat `var(--light-bg)` (`#F4F9F6`) — no gradient blobs or decorative radial layers. Do not add a `background` property to any of these four sections individually. The decorative rings and dot grids on `#how-it-works` and `#download` are present in CSS but set to `display: none`.

**Testimonials carousel** — infinite marquee via `@keyframes testimonialScroll` translating `.testimonials-track` by `-50%`. 12 cards (6 originals + 6 duplicates). Edge fade via `mask-image` on `.testimonials-track-wrap`. Card background: `rgba(255,255,255,0.95)` (95% opaque).

**Section labels** — `.section-label` CSS class exists but the label `<div>` elements have been removed from all section HTML (How it works, Testimonials, Ambassador, Download). Do not re-add them.

**Hero scroll indicator** — `.hero-scroll` / `.scroll-dot` / `.scroll-line` elements have been removed from the hero HTML. The CSS classes remain but are unused.

**How it works step layout** — `.step-row` has `max-width: 1120px; margin: 0 auto` to keep phone/text pairs centered rather than edge-to-edge. `.step-heading` is `2.5rem`, `.step-desc` is `1.2rem`.

**Bottom blur overlay** — `<div class="bottom-blur">` is `position: fixed; bottom: 0; height: 90px; backdrop-filter: blur(14px)` with a `mask-image` gradient (transparent → black top to bottom). Creates a progressive frosted glass effect at the bottom of every viewport. The footer has `position: relative; z-index: 10000` to render above it.

**darkSectionIds** — only `'hero'` is in the set. All other sections use the light background.

## Assets

- `KOVA logo.png` — black "KOVA" text + bright green steering wheel replacing the O
- `hero_image.png` — hero section background photo (people in a car, travel/social vibe)
- `download_appstore_svg.png` — official App Store badge image used in the download section
- `color palette.png` — reference swatches (white / `#2E6B4A` / `#28C45A`)
- `step1.png`, `step2.png`, `step3.png` — app screenshots displayed inside the "How it works" iPhone frames
- `final_ss.png` — app screenshot displayed inside the Download section's large iPhone frame
- `Agrandir - Free For Personal Use/` — PP Agrandir font files, **personal use only**, not wired up

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
- `<defs>`: `<mask id="road-mask">` containing one `.road-reveal` path (white, thick stroke)
- `<g mask="url(#road-mask)">`: the static visual layers — `.road-sheen`, `.road-base`, `.road-center` (all share the same `d`)
- `.road-brush`: a `<g>` holding a **top-down car sprite** (built once in JS via `brushG.innerHTML`), repositioned at the tip every frame. Despite the `brush` name, the sprite is a car, not a paintbrush

**Reveal model (mask-wipe + rAF lerp):**
- Path `d` built via Catmull-Rom spline through waypoints from `getLayoutRect()` (offsetTop/offsetLeft chain — transform-immune). The same `d` is set on every visual layer **and** `.road-reveal`.
- `.road-reveal` has `strokeDasharray = totalLength`; animating its `strokeDashoffset` from `totalLength`→`0` wipes the mask open, progressively revealing the static layers beneath. This is why the center line can be a static green dash pattern *and* still draw on.
- **Smoothness**: a continuous `requestAnimationFrame` loop eases the rendered length toward a scroll-driven target each frame — `drawnLen += (targetLen − drawnLen) * SMOOTH` (`SMOOTH ≈ 0.14`). Decoupled from scroll-event timing, so the draw is fluid at any scroll speed (no CSS transition on dashoffset). The loop stops when settled and restarts on scroll.
- **Target**: on scroll (rAF-throttled), binary search via `getPointAtLength()` finds the arc length whose Y equals `scrollY + vh * scrollK − lzTop` (consistent tip screen position). `targetLen` is a high-water mark — the road never retreats when scrolling up. Within ~8px of page bottom, the target snaps to `totalLength` so the road always completes.
- **`scrollK`** is computed dynamically in `buildRoad()` so the tip reaches `footerY + OVERLAP` (under the footer) exactly at max scroll.
- On resize: `buildRoad()` resets and rebuilds.

**Car tip** — each frame, the `.road-brush` `<g>` is `translate`d to `reveal.getPointAtLength(drawnLen)` and `rotate`d to the path tangent (point 6px behind), so the car drives along the leading edge and the road appears to roll out behind it. It fades out (`opacity 0`) at the very start and once the road is essentially complete, so no car floats under the footer. The sprite is authored **nose-toward +x** (so `rotate(ang)` points it in the direction of travel): a dark `#20262e` body (`64×36`, `rx 11`) with a `var(--bright-green)` outline, green-tinted glass greenhouse, green headlights at the +x nose, red taillights at the rear, and dark wheels poking out the sides. Sized to roughly span the 46px road.

**Path geometry (desktop ≥ 768px):**
- Starts at `[cx, -OVERLAP]` (40px above the light-zone top — inside the hero's covered area)
- **Steps 1 & 3** (phone LEFT): peak at `W * 0.83` — the wide empty right portion of the layout past the text content
- **Step 2** (phone RIGHT): peak at `pr.left - 90` — 90px clearance from the phone frame, well into the center gap
- **No bracket waypoints** — peak-only (one waypoint per step). Bracket approach/exit waypoints cause Bezier control-point squiggles when an incoming tangent from a distant neighbour overshoots a short segment. With peak-only, step 2's Catmull-Rom tangent x-component is exactly 0 (steps 1 and 3 are at the same x), so the road descends vertically through the gap with no lateral drift.
- **Testimonials**: two waypoints — `[W * 0.14, testInnerR.cy]` (left of heading text) then `[cx + W * 0.05, carouselR.cy]` (through middle of carousel). Queries `#testimonials .testimonials-inner` and `#testimonials .testimonials-track-wrap`.
- **Ambassador**: `W * 0.93` (far right page margin)
- **Download**: `dlPhoneR.right + 44` (gap right of download phone — queried via `#download .dl-phone-col`)
- Ends at `[cx, footerY + OVERLAP]` — under the opaque footer (`z-index: 10000`)
- Mobile (< 768px): simple S-wave fallback ending at `[cx, H + OVERLAP]`

**Hero emergence (mirrors footer):**
- `.road-wrap` has `inset: -40px 0 -40px 0` — extends `OVERLAP=40px` above AND below the light-zone
- `#hero` has `z-index: 1` — hero renders on top of the road-wrap extension, hiding the road stub just as the footer (`z-index: 10000`) hides the tail
- ViewBox: `0 -OVERLAP W H+2*OVERLAP` — SVG coordinates remain light-zone-relative; `getLayoutRect` measurements are unchanged
- Mask: `transparent 0px, black 50px` — hero covers the first 40px, leaving only a ~10px fade visible just below the hero edge

**Visual** (thicker, premium):
- `.road-base`: 46px, `var(--near-black)` @ 0.92 opacity (solid road body)
- `.road-sheen`: 54px, `rgba(255,255,255,0.06)` (faint lift under the base)
- `.road-center`: 6px, `var(--bright-green)`, `stroke-dasharray: 24 20`, `stroke-linecap: butt` (thick rectangular green dashes — flat ends, not rounded)
- `.road-reveal`: 62px white (mask only — never visible)
