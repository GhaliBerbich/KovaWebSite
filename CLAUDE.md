# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Planning

**Every plan must include a plain-English explanation** of what will change — a short, jargon-free summary (in addition to any technical detail) describing what the user will see/experience. The user always wants this, for every plan.

## Project Overview

Single-file static landing page for the **KOVA** social/travel app. All HTML, CSS, and JS live in `index.html`. No build tools, no framework. External deps (both via CDN): Google Fonts and **Lenis** (smooth-scroll, `unpkg.com/lenis`).

The site is **full dark mode** (Gen Z / cinematic direction). The page body is a **stack of full-viewport sticky cards** ("dealing cards onto a deck"); the hero and stat bar sit above the stack, the footer below. `REDESIGN_SPEC.md` (untracked, in the project root) is the design source of truth for this look.

## Development

**Preview locally:**
```
python -m http.server 8080
# then open http://localhost:8080
```
Use a server (not `file://`) because some browsers block local-file CDN requests on file:// origins.

**Taking screenshots for review:**
Playwright MCP is available — navigate to `http://localhost:<port>`, resize to 1440×900. Two gotchas:
- IntersectionObserver won't fire under programmatic scroll jumps, so inject `.in-view` on `.reveal` / `.letter-reveal` / `.word-reveal` before screenshotting.
- `window.scrollTo` fights Lenis (Lenis reverts to its own target each frame). Use `window.lenis.scrollTo(y, {immediate:true})` to position reliably — `lenis` is exposed on `window` for exactly this.
- **Never** save a screenshot to a filename that collides with a tracked asset (e.g. `step1.png`) — it overwrites the real image. Save dev screenshots to `.playwright-mcp/` or a throwaway name.

To view a given card fully (before the next card slides over it), scroll to roughly `cardAbsTop + 150`. To see a card's road near-complete, scroll to `cardAbsTop + 0.8*innerHeight` (but by then the next card is already covering ~80% — that's the intended stacking effect).

## Architecture

Everything is in `index.html`, organized top-to-bottom:

1. **CSS custom properties** (`:root`) — all color tokens, do not use raw hex outside this block (iPhone shell `#1C1C1E` / screen `#1a1a1a` are the only intentional hardcodes)
2. **Reset + bottom-blur + navbar + shared type + buttons** CSS
3. **Hero + stat-bar** CSS
4. **Card-stack mechanics + per-card background variation** CSS
5. **Per-section card CSS** (road, hiw-intro, steps, testimonials, ambassador, faq, download, route chips)
6. **Footer + animations + reduced-motion + responsive** CSS
7. **HTML** — Navbar → `#hero` (with route chips) → `#stat-bar` → `<div class="card-stack">` (8 `.page-card`s) → `<footer>`
8. **JS** — Lenis, nav active + bottom blur, letter/word splitters, reveal observer, FAQ accordion, per-card road animation
9. **`<div class="bottom-blur">`** — last element before `</body>`

## Color Tokens

| Token | Value | Used for |
|---|---|---|
| `--bg` | `#0D1117` | Page background, stat bar, footer |
| `--bright-green` | `#28C45A` | Primary CTA, road center line, badge/eyebrow border, phone halo, open FAQ question, car accents |
| `--dark-green` | `#2E6B4A` | Reserved accent |
| `--text-primary` / `--text-body` / `--text-muted` | `rgba(255,255,255, .92/.60/.52)` | Body text tiers |
| `--glass-bg` / `--glass-border` | `rgba(255,255,255, .07/.12)` | Glass surfaces (testimonial cards, route chips, nav) |
| `--glass-green-bg` / `--glass-green-border` | `rgba(40,196,90, .08/.22)` | Download card glass |
| `--road-base` / `--road-sheen` / `--road-center` | white .10 / white .04 / green .55 | Road strokes |

**Green is reserved.** It appears only on: the primary CTA fill, the road center dashes, the eyebrow badge border, the phone halo glow, the car sprite accents, and the open FAQ question. Do **not** put green on body text, headings, or icons elsewhere.

## Typography

| Font | Usage |
|---|---|
| **Syne** (600/700/800) | All headings, section titles, nav links, step/FAQ headings, stat numbers, button labels, testimonial names |
| **Figtree** (400/500/600) | Body text, descriptions, testimonial quotes, FAQ answers, stat labels, footer, route-chip meta |

Loaded via Google Fonts CDN. The `Agrandir - Free For Personal Use/` package in the repo is **not wired up** (commercial license required for a public site).

## Card Stack (core layout)

`.card-stack` wraps all 8 sections and **must** have `height: calc(8 * 100vh)` — without it, every sticky card collapses to the same position and the stacking breaks entirely.

Each `.page-card` is `position: sticky; top: 0; height: 100vh; overflow: hidden; border-radius: 20px 20px 0 0` with a persistent `box-shadow: 0 -8px 40px rgba(0,0,0,0.60)` (casts a shadow down onto the card below). Cards are flex-centered.

**Card order + z-index** (ID selectors): `#hiw-intro` 10 → `#step-1` 20 → `#step-2` 30 → `#step-3` 40 → `#testimonials` 50 → `#ambassador` 60 → `#faq` 70 → `#download` 80. Footer is z-index 10000.

**Layer order inside every card (do not deviate):** `.card-bg` (z 0) → `.page-card::before` overlay (z 1) → `.road-svg` (z 2) → `.route-chip` (z 3) → all other content (z 4, via `.page-card > *:not(.card-bg):not(.road-svg):not(.route-chip)`).

**Per-card background variation** — every card has its own blurred `hero_image.png` (placeholder for now). Crop / rotation / blur live on `#<id> .card-bg`; overlay tint on `#<id>::before`. These are set per-ID (see the variation block in CSS), **not** on the shared `.page-card` rule. `.card-bg` uses `inset: -10%` so blur never fringes the card edges.

**Card-absolute top** for scroll math is computed by `absTop(el)` (sums `offsetTop` up the `offsetParent` chain — scroll-independent and sticky-safe).

## Key Patterns

**Navbar** — `position: fixed`, glass (`backdrop-filter: blur(24px)`, faint border), `border-radius: 16px`, 3-column grid (logo / centered `.nav-links` / Get KOVA). Syne 600 links; hover and `.active` (current section) go to `#fff`, `.active` also bold. The whole page is dark, so the logo keeps `filter: invert(1) hue-rotate(180deg)` permanently (white text, green wheel). There is **no** `.over-light` class and **no** `darkSectionIds` — both were removed. Nav targets: How it works → `hiw-intro`, Testimonials → `testimonials`, Ambassador Program → `ambassador`, Get KOVA → `download`. Active state is set by `updateNavActive()` using `data-target` + `absTop`.

**Hero** — `#hero` (z-index 1, outside the stack). `hero_image.png` background + dot grid (`.hero-bg::after`) + dark overlay (`.hero-bg::before`, `rgba(0,0,0,0.35)` — restored, not disabled). Title `.hero-title` is solid white Syne 800 `clamp(3rem,7vw,5.5rem)` (no green gradient). `.btn-purdue` eyebrow is a glass pill (Figtree 500, border `var(--bright-green)` low opacity, white "New" badge, links to the Purdue article). Two floating `.route-chip`s sit at the edges (z-index 1, below content).

**Stat bar** — `#stat-bar` is a static (non-sticky) block between hero and `.card-stack`, `background: var(--bg)`, top/bottom hairline borders. Three `.stat-item` columns with `.stat-item + .stat-item { border-left }` dividers. Numbers `.stat-number` (Syne 800, 2rem). Stats: **0% commission** · **500+ Purdue students riding** · **Top 5 Purdue New Venture Challenge 2026**. Stacks vertically `@media (max-width:600px)`.

**Step cards** (`#step-1/2/3`) — `.step-inner` two-column flex; `#step-2 .step-inner { flex-direction: row-reverse }` (phone left). `.step-heading` Syne 800 2.6rem, `.step-desc` Figtree. `.step-phone-wrap` has a soft green halo `::before` at `0.08` opacity. **No** decorative green frames and **no** `.step-number` badges (both removed). Each step card has one `.route-chip` (placeholder, positioned per-ID). Step headings: "Find your ride", "Join your communities", "Unlock perks along the way".

**iPhone frame** — CSS shell, `width: 260px` (`.large` 300px for download). Shell `#1C1C1E`, screen `#1a1a1a` (hardcoded). Structure `.iphone > (.iphone-screen > .iphone-island + .iphone-screen-img)`; `.iphone-screen-img` is `position:absolute; inset:0; object-fit:fill`. Side buttons via `::before`/`::after`.

**Testimonials** (`#testimonials`) — `.testimonials-inner` centered column (heading + marquee). `.marquee-outer` clips the track and has left/right edge-fade gradients via `::before`/`::after` (replaced the old `mask-image`). `.testimonials-track` is the infinite `@keyframes testimonialScroll` marquee (12 cards = 6 + 6 duplicates). `.testimonial-card` is glass (`--glass-bg` + blur, min 280 / max 320). Stars stay gold (`#FFB800`); avatar colors unchanged.

**Ambassador** (`#ambassador`) — `.ambassador-inner` centered. `.amb-feats` is a 3-up flex row of `.amb-feat` glass icon tiles (white SVG strokes). The "Apply Now" button is `.btn-glass` (the old `.btn-amb` was removed).

**FAQ** (`#faq`) — now an **accordion**. Each `.faq-item` has a clickable `.faq-question` (Syne 700, with `.faq-chevron` SVG) and a `.faq-answer` that is `display:none` until the item gets `.open` (toggled by JS click handler). The chevron rotates 180° and the question turns `var(--bright-green)` when open (the only non-white heading on the page). All items start closed.

**Download** (`#download`) — a centered glass-green `.dl-card` (`--glass-green-bg` + blur, radius 28). **Two-column** layout: `.dl-phone-col` (the `.iphone.large` with `final_ss.png`) on the left, `.dl-info` (title, sub, white `.dl-qr-card` with QR + App Store badge) on the right. The card is deliberately sized (phone 190×412, QR/badge 140px) so the whole card stays **≤ ~530px tall** — at max page scroll the footer pushes the last sticky card up ~one footer-height, and a taller card would clip the heading. If you grow this card, re-check it at the very bottom. Stacks to one column `@media (max-width:768px)`.

**Route chips** — `.route-chip` glass pills (`.route-chip-route` Syne 700 + `.route-chip-meta` Figtree). Decorative placeholders ("[Origin] → [Destination]", etc.) — Mehdi will swap in real app elements later. Hero has 2, each step card 1. Hidden `@media (max-width:768px)`.

**Buttons** — `.btn-primary` (green CTA, Syne 700, radius 10) and `.btn-glass` (glass secondary). Hero "Download the app" + nav "Get KOVA" are `<button>`s that `scrollToSection('download')`. Only the `.appstore-btn` and the QR image link to `https://apps.apple.com/us/app/ridekova/id6757269118`.

**Smooth scrolling (Lenis)** — `lenis@1.1.18`, `lerp: 0.06`, `wheelMultiplier: 0.9`, rAF loop. Skipped entirely under `prefers-reduced-motion`. The instance is exposed as `window.lenis` (testing hook). `scrollToSection(id)` / `scrollToTop()` route nav scrolls through `lenis.scrollTo(..., NAV_SCROLL)` (`NAV_SCROLL = { duration: 1.6, easeInOutCubic }`), falling back to native `window.scrollTo` when Lenis is inactive.

**Reveal animations** — `.reveal` starts `opacity:0; translateY(24px)`, `.reveal.in-view` fades/slides in (0.6s, `--reveal-delay` stagger). `revealObs` (threshold 0.12) observes `.reveal, .letter-reveal, .word-reveal` together and unobserves after firing.

**Letter-by-letter headings** — `.letter-reveal` text is split per character into `<span class="char" style="--i:N">`, **wrapped per word** in `<span class="lr-word">` (inline-block, `white-space:nowrap`). The word wrapper is essential: without it, inline-block chars break mid-word on wrap. Chars ripple `opacity`+`translateY(5px)`, `calc(var(--i)*0.016s)`.

**Word-by-word body text** — `.word-reveal` splits text into `<span class="word" style="--wi:N">`, fading `opacity` in reading order (`calc(var(--wi)*0.06s)`).

**Bottom blur overlay** — `<div class="bottom-blur">` (fixed, bottom, `blur(14px)`, mask gradient). Hidden when `scrollY < 50` via `updateBottomBlur()` (lazy `querySelector('.bottom-blur')` inside the function — the element lives after the `<script>`, so don't hoist the query). Coalesced with `updateNavActive()` into one rAF-throttled scroll listener (`_uiRaf`).

**Image loading** — below-fold images use `loading="lazy"`; all use `decoding="async"`. The hero/card backgrounds are CSS, so neither applies.

## Road Animation (per card)

The road was refactored from one continuous light-zone thread into **independent per-card segments**. The 5 cards `#hiw-intro`, `#step-1`, `#step-2`, `#step-3`, `#testimonials` each contain an empty `<svg class="road-svg">`; the IIFE at the bottom of the script populates and animates each one. `#ambassador`, `#faq`, `#download` have no road.

**Per-card SVG** (built in JS, unique mask id per card `road-mask-<id>`):
- `<defs><mask id="road-mask-<id>"><path class="road-reveal"/></mask></defs>`
- `<g mask="...">` with `.road-sheen` / `.road-base` / `.road-center` (all share the same `d`)
- `.road-brush` `<g>` holding the top-down **car sprite** (white-ish body `rgba(255,255,255,0.12)`, green outline/glass/headlights, red taillights, dark wheels; authored nose-toward +x)

**Model** — same mask-wipe + rAF-lerp as before, but driven by **scroll progress within the card** instead of a Y binary search:
- `build(inst)`: waypoints are `[x%, y%]` fractions of the card's `offsetWidth`/`offsetHeight` (`ROADS` table in JS), turned into a Catmull-Rom path; `viewBox = "0 0 W H"` (1:1 with card px); `d` set on all paths; `totalLen` + dasharray/offset; `pathCache` of `CACHE_N+1` (601) sampled points for cheap `pointAt()` lookups; `inst.top = absTop(card)`.
- `updateTargets()` (rAF-throttled on scroll): `progress = clamp((scrollY - card.offsetTop) / (innerHeight * 0.8), 0, 1)`, `targetLen = progress * totalLen`. Reverses when scrolling up.
- `tick()`: one shared loop eases each `drawnLen → targetLen` (`SMOOTH ≈ 0.14`), sets `strokeDashoffset`, and positions/rotates the car at the tip (`pointAt(drawnLen)` + tangent 6px behind). Car fades out at the very start and once the road is essentially complete.
- `resize` → `buildAll()` rebuilds every instance.

**Waypoints** (`ROADS` in JS, fractions of each card W×H): hiw-intro gentle S `[0,.85]→…→[1,.50]`; step-1 shallow arc `[0,.70]→…→[1,.80]`; step-2 swoop `[1,.15]→…→[0,.50]`; step-3 wide left-down `[1,.30]→…→[0,.90]`; testimonials weave `[.5,1]→…→[.5,0]`.

**Visual** — `.road-base` 40px white .10, `.road-sheen` 48px white .04, `.road-center` 5px green .55 (`dasharray 20 18`), `.road-reveal` 56px white (mask only). `.road-svg` is `opacity: 0.7`.

Roads (and the Lenis smooth scroll) are skipped entirely under `prefers-reduced-motion` (the IIFE early-returns and CSS hides `.road-svg`).

## Assets

- `KOVA logo.png` — black "KOVA" text + bright green steering wheel (inverted to white in nav/footer)
- `hero_image.png` — hero + all card backgrounds (placeholder; cards blur it differently per-ID)
- `download_appstore_svg.png` — App Store badge
- `color palette.png` — reference swatches
- `step1.png`, `step2.png`, `step3.png` — app screenshots inside the step iPhone frames
- `final_ss.png` — app screenshot inside the download iPhone frame
- `purdue.png` — Purdue logo in the footer (original colors)
- `Agrandir - Free For Personal Use/` — fonts, **personal use only**, not wired up

## Pages

- `index.html` — main landing page
- `terms.html` — Terms of Service placeholder (links back to index)
- `privacy.html` — Privacy Policy placeholder (links back to index)

## Footer

`<footer>` is dark (`var(--bg)`), `position: relative; z-index: 10000` (above the bottom blur). Three flex columns: KOVA logo (inverted white) / `.footer-links` (Terms → `terms.html`, Privacy → `privacy.html`, `help@ridekova.com`) / `.footer-right` (Instagram → `instagram.com/ridekova/`, copyright `© 2026 KOVA Group, Inc. All rights reserved.`, "Built with love, at [purdue.png]"). Footer links Figtree, `rgba(255,255,255,0.60)` → `#fff` on hover. `.footer-purdue` is `display:inline` to override the global `img{display:block}` reset.
