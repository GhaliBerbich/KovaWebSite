# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Planning

**Every plan must include a plain-English explanation** of what will change — a short, jargon-free summary (in addition to any technical detail) describing what the user will see/experience. The user always wants this, for every plan.

## Project Overview

Single-file static landing page for the **KOVA** social/travel app. All HTML, CSS, and JS live in `index.html`. No build tools, no framework. External deps (both via CDN): Google Fonts and **Lenis** (smooth-scroll, `unpkg.com/lenis`).

The site is **full dark mode** (Gen Z / cinematic direction). The page is a **normal vertical flow of full-height sections** over photographic backgrounds. Each content section slightly overlaps the one above it (negative margin) and has an irregular **hand-drawn wave** along its top edge (SVG `clip-path`). `REDESIGN_SPEC.md` (untracked, in the project root) is the design source of truth for the look.

> The earlier sticky "card-stack" mechanic (8 stacked `.page-card`s dealt onto a deck) and the per-step iPhone mockups were **removed** in the Round 3 redesign. There is no `.card-stack`, no `.page-card`, no `.iphone*`, and no `updateCardStack` anymore.

## Development

**Preview locally:**
```
python -m http.server 8080
# then open http://localhost:8080
```
Use a server (not `file://`) because some browsers block local-file CDN requests on file:// origins.

**Taking screenshots for review:**
Playwright MCP is available — navigate to `http://localhost:<port>`, resize to 1440×900. Gotchas:
- IntersectionObserver won't fire under programmatic scroll jumps, so inject `.in-view` on `.reveal` / `.letter-reveal` / `.word-reveal` before screenshotting.
- `window.scrollTo` fights Lenis (Lenis reverts to its own target each frame). Use `window.lenis.scrollTo(y, {immediate:true})` to position reliably — `lenis` is exposed on `window` for exactly this.
- **Never** save a screenshot to a filename that collides with a tracked asset. Save dev screenshots to `.playwright-mcp/` or a throwaway name.
- **Note:** when working under the Opus model, do **not** use Playwright to verify outputs (per the user's global instruction). Verify by reading the file / manual browser check instead.

## Architecture

Everything is in `index.html`, organized top-to-bottom:

1. **CSS custom properties** (`:root`) — all color tokens; do not use raw hex outside this block
2. **Reset + bottom-blur + navbar + shared type + buttons** CSS
3. **Hero + stat-bar** CSS
4. **Site-section mechanics** (`.site-section` base, overlap z-index ladder, wave clip-path map, `.card-bg`/`.card-bg-edge` layers, per-section background variation) CSS
5. **Per-section CSS** (how-it-works grid, road, testimonials, ambassador, faq, download, route chips)
6. **Footer + animations + reduced-motion + responsive** CSS
7. **Hidden wave-clip SVG** — first element in `<body>`; `<defs>` of 5 `clipPath`s (`objectBoundingBox`)
8. **HTML** — Navbar → `#hero` (with route chips) → `#stat-bar` → `#how-it-works` → `#testimonials` → `#ambassador` → `#faq` → `#download` → `<footer>`
9. **JS** — Lenis, nav active + bottom blur, letter/word splitters, reveal observer, FAQ accordion, testimonials road animation
10. **`<div class="bottom-blur">`** — last element before `</body>`

## Color Tokens

| Token | Value | Used for |
|---|---|---|
| `--bg` | `#0D1117` | Page background, stat bar, footer |
| `--bright-green` | `#28C45A` | Primary CTA, road center line, badge/eyebrow border, open FAQ question, car accents |
| `--dark-green` | `#2E6B4A` | Reserved accent |
| `--text-primary` / `--text-body` / `--text-muted` | `rgba(255,255,255, .92/.60/.52)` | Body text tiers |
| `--glass-bg` / `--glass-border` | `rgba(255,255,255, .07/.12)` | Glass surfaces (testimonial cards, route chips, nav) |
| `--glass-green-bg` / `--glass-green-border` | `rgba(40,196,90, .08/.22)` | Download card glass |
| `--road-base` / `--road-sheen` / `--road-center` | white .10 / white .04 / green .55 | Road strokes |

**Green is reserved.** It appears only on: the primary CTA fill, the road center dashes, the eyebrow badge border, the car sprite accents, and the open FAQ question. Do **not** put green on body text, headings, or icons elsewhere.

## Typography

| Font | Usage |
|---|---|
| **Fraunces** (serif; 400/600/700, optical + italic axes) | All headings, section titles, nav links, stat numbers, button labels, testimonial names, `.hiw-item-label` |
| **Figtree** (400/500/600) | Body text, descriptions, testimonial quotes, FAQ answers, stat labels, footer, route-chip meta |

Loaded via Google Fonts CDN. Headings use `'Fraunces', serif`; body uses `'Figtree', sans-serif`. (Round 3 switched the display face from Space Grotesk to Fraunces; there is no Syne in the codebase.) The `Agrandir - Free For Personal Use/` package in the repo is **not wired up** (commercial license required for a public site).

## Layout: site-sections, overlap & waves (core)

The content sections (`#how-it-works`, `#testimonials`, `#ambassador`, `#faq`, `#download`) all carry the class **`.site-section`**:
```css
.site-section { position: relative; min-height: 100vh; display:flex; align-items:center;
                justify-content:center; overflow:hidden; margin-top:-44px; }
```
- **Overlap:** `margin-top:-44px` pulls each section up over the one above. A z-index ladder keeps later sections on top: how-it-works 10 → testimonials 20 → ambassador 30 → faq 40 → download 50 → footer 60.
- **Waves:** a hidden `<svg>` (first child of `<body>`) defines 5 `clipPath`s with `clipPathUnits="objectBoundingBox"` — `#wave-how-it-works`, `#wave-testimonials`, `#wave-ambassador`, `#wave-faq`, `#wave-download`. Each is an irregular hand-drawn curve along the top edge (y ≈ 0.01–0.04, no repeating pattern). Applied via `#<id> { clip-path: url(#wave-<id>); }`. Content wrappers carry `padding-top: 80px+` so content clears the wave.

**Background layers per section** (`.card-bg` z 0 → `.site-section::before` overlay z 1 → `.road-svg` z 2 → `.route-chip` z 3 → content z 4 via `.site-section > *:not(...)`):
- `.card-bg` (`inset:-10%`, `background-size:cover`) and `.card-bg-edge` (same image, `blur(22px)`, radial mask — a soft halo around the sharper center) get their **image + position + scale/rotate + blur** set **per-ID** (the variation block). `.site-section::before` is the dark overlay tint, also per-ID.

**Per-section backgrounds** (real photos; filenames contain spaces, so quote them in CSS):

| Section | image | position | overlay | blur |
|---|---|---|---|---|
| `#hero` (`.hero-bg`) | `drive pic.jpg` | `center 40%` | `rgba(0,0,0,0.35)` | — |
| `#how-it-works` | `drive pic.jpg` | `center 70%` | `rgba(0,0,0,0.75)` | `9px` |
| `#testimonials` | `concert pic.jpg` | `center 30%` | `rgba(0,0,0,0.72)` | `10px` |
| `#ambassador` | `nightclub pic.jpg` | `60% center` | `rgba(0,0,0,0.75)` | `4px` |
| `#faq` | `concert pic.jpg` | `center 65%` | `rgba(0,0,0,0.85)` | `12px` |
| `#download` | `nightclub pic.jpg` | `40% center` | `rgba(0,0,0,0.80)` | `8px` |

## Key Patterns

**Navbar** — `position: fixed`, glass (`backdrop-filter: blur(24px)`, faint border), `border-radius: 16px`, 3-column grid (logo / centered `.nav-links` / Get KOVA). Fraunces 600 links; hover and `.active` (current section) go to `#fff`, `.active` also bold. The logo keeps `filter: invert(1) hue-rotate(180deg)` permanently (white text, green wheel). Nav targets: How it works → `how-it-works`, Testimonials → `testimonials`, Ambassador Program → `ambassador`, Get KOVA → `download`. Active state is set by `updateNavActive()` using `data-target` + `absTop`.

**Hero** — `#hero` (z-index 1; not a `.site-section`, no wave clip). `drive pic.jpg` background + dot grid (`.hero-bg::after`) + dark overlay (`.hero-bg::before`, `rgba(0,0,0,0.35)`). Title `.hero-title` is solid white Fraunces `clamp(3rem,7vw,5.5rem)`. `.btn-purdue` eyebrow is a glass pill (Figtree 500, green-tinted border, white "New" badge, links to the Purdue article). Two floating `.route-chip`s sit at the edges (z-index 1, below content).

**Stat bar** — `#stat-bar` is a static block between hero and `#how-it-works`, `background: var(--bg)`, top/bottom hairline borders. Three `.stat-item` columns with `.stat-item + .stat-item { border-left }` dividers. Stats: **0% commission** · **500+ Purdue students riding** · **Top 5 Purdue New Venture Challenge 2026**. Stacks vertically `@media (max-width:600px)`.

**How it works** (`#how-it-works`) — one section (was 4 cards). `.hiw-inner` is a centered column (`padding:100px 48px 80px`) holding the `.section-title` and a `.hiw-grid` (2×2; 1-col under 768px). Each `.hiw-item` = `.hiw-item-label` (Fraunces 700) + `.hiw-placeholder` (4:3 glass box, decorative app-element placeholder) + `.hiw-item-desc` (Figtree). The 4 items: **Find a ride**, **Join communities**, **Unlock perks**, **Make a few bucks**. No road, no route chips here.

**Testimonials** (`#testimonials`) — `.testimonials-inner` centered column (heading + marquee). Holds the **only road animation** (`<svg class="road-svg">`). `.marquee-outer` clips the track and has left/right edge-fade gradients. `.testimonials-track` is the infinite `@keyframes testimonialScroll` marquee (12 cards = 6 + 6 duplicates). `.testimonial-card` is glass. Stars stay gold (`#FFB800`).

**Ambassador** (`#ambassador`) — `.ambassador-inner` centered. `.amb-feats` is a 3-up flex row of `.amb-feat` glass icon tiles (white SVG strokes). The "Apply Now" button is `.btn-glass`.

**FAQ** (`#faq`) — an **accordion**. Each `.faq-item` has a clickable `.faq-question` (Fraunces 700 + `.faq-chevron` SVG) and a `.faq-answer` that is `display:none` until the item gets `.open` (toggled by JS click). The chevron rotates 180° and the question turns `var(--bright-green)` when open (the only non-white heading on the page). All items start closed.

**Download** (`#download`) — a centered glass-green `.dl-card` (radius 28), **two-column**: `.dl-phone-col` (a rounded `.dl-screenshot` `<img>` of `final_ss.png` — **no iPhone frame**) on the left, `.dl-info` (title, sub, white `.dl-qr-card` with QR + App Store badge) on the right. Stacks to one column `@media (max-width:768px)` (`.dl-screenshot` shrinks to 170px). Section is flex-centered in 100vh, so the wave clip never touches the card.

**Route chips** — `.route-chip` glass pills (`.route-chip-route` Fraunces 700 + `.route-chip-meta` Figtree). Decorative placeholders. **Hero has 2** (the only ones left after the step cards were removed). Hidden `@media (max-width:768px)`.

**Buttons** — `.btn-primary` (green CTA, Fraunces 700, radius 10) and `.btn-glass` (glass secondary). Hero "Download the app" + nav "Get KOVA" are `<button>`s that `scrollToSection('download')`. Only `.appstore-btn` and the QR image link to `https://apps.apple.com/us/app/ridekova/id6757269118`.

**Smooth scrolling (Lenis)** — `lenis@1.1.18`, `lerp: 0.06`, `wheelMultiplier: 0.9`, rAF loop. Skipped under `prefers-reduced-motion`. Exposed as `window.lenis`. `scrollToSection(id)` / `scrollToTop()` route nav scrolls through `lenis.scrollTo(..., NAV_SCROLL)` (`duration:1.6`, easeInOutCubic), falling back to native `window.scrollTo` when Lenis is inactive.

**Reveal animations** — `.reveal` starts `opacity:0; translateY(24px)`, `.reveal.in-view` fades/slides in (0.6s, `--reveal-delay` stagger). `revealObs` (threshold 0.12) observes `.reveal, .letter-reveal, .word-reveal` and unobserves after firing.

**Letter-by-letter headings** — `.letter-reveal` text is split per character into `<span class="char" style="--i:N">`, **wrapped per word** in `<span class="lr-word">` (inline-block, `white-space:nowrap`) so inline-block chars never break mid-word. Chars ripple `opacity`+`translateY(5px)`, `calc(var(--i)*0.016s)`.

**Word-by-word body text** — `.word-reveal` splits text into `<span class="word" style="--wi:N">`, fading in reading order (`calc(var(--wi)*0.06s)`).

**Bottom blur overlay** — `<div class="bottom-blur">` (fixed, bottom, `blur(14px)`, mask gradient). Hidden when `scrollY < 50` via `updateBottomBlur()`. Coalesced with `updateNavActive()` into one rAF-throttled scroll listener (`_uiRaf`).

**Image loading** — below-fold images use `loading="lazy"`; all use `decoding="async"`. The hero/section backgrounds are CSS, so neither applies.

## Road Animation (testimonials only)

After Round 3 only `#testimonials` has a road. It contains an empty `<svg class="road-svg">`; the IIFE at the bottom of the script populates and animates it.

- **SVG** (built in JS, mask id `road-mask-testimonials`): `<defs><mask><path class="road-reveal"/></mask></defs>`, a masked `<g>` with `.road-sheen`/`.road-base`/`.road-center` (shared `d`), and a `.road-brush` `<g>` holding the top-down **car sprite** (white-ish body, green outline/glass/headlights, red taillights, dark wheels; authored nose-toward +x).
- **Model** — mask-wipe + rAF-lerp driven by scroll progress within the section. `build()` turns the `ROADS['testimonials']` waypoints (`[x%,y%]` fractions of section W×H) into a Catmull-Rom path, sets `viewBox = "0 0 W H"`, computes `totalLen` + dasharray/offset, and a `pathCache` of 601 sampled points for cheap `pointAt()`. `inst.top = absTop(card)` (true document offset in the flat layout). `updateTargets()` (rAF-throttled on scroll): `progress = clamp((scrollY - top) / (innerHeight*0.8), 0, 1)`. `tick()` eases `drawnLen → targetLen` (`SMOOTH ≈ 0.14`), sets `strokeDashoffset`, positions/rotates the car at the tip; the car fades out at the very start and once the road is essentially complete. `resize` → rebuild.

Roads (and Lenis) are skipped entirely under `prefers-reduced-motion` (IIFE early-returns and CSS hides `.road-svg`).

## Assets

- `KOVA logo.png` — black "KOVA" text + bright green steering wheel (inverted to white in nav/footer)
- `drive pic.jpg` — hero + how-it-works background
- `concert pic.jpg` — testimonials + faq background
- `nightclub pic.jpg` — ambassador + download background
- `final_ss.png` — app screenshot in the download section (rounded `<img>`)
- `download_appstore_svg.png` — App Store badge
- `purdue.png` — Purdue logo in the footer (original colors)
- `color palette.png` — reference swatches
- `Agrandir - Free For Personal Use/` — fonts, **personal use only**, not wired up

## Pages

- `index.html` — main landing page
- `terms.html` — Terms of Service placeholder (links back to index)
- `privacy.html` — Privacy Policy placeholder (links back to index)

## Footer

`<footer>` is dark (`var(--bg)`), `position: relative; z-index: 60` (above the bottom blur). Three flex columns: KOVA logo (inverted white) / `.footer-links` (Terms → `terms.html`, Privacy → `privacy.html`, `help@ridekova.com`) / `.footer-right` (Instagram → `instagram.com/ridekova/`, copyright `© 2026 KOVA Group, Inc. All rights reserved.`, "Built with love, at [purdue.png]"). Footer links Figtree, `rgba(255,255,255,0.60)` → `#fff` on hover. `.footer-purdue` is `display:inline` to override the global `img{display:block}` reset.
</content>
</invoke>
