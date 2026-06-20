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
2. **Reset + grain overlay + navbar + shared type + buttons** CSS (the old fixed `.bottom-blur` overlay was **removed** — it re-blurred the page every scroll frame for little benefit)
3. **Hero + floating hero-stats** CSS
4. **Site-section mechanics** (`.site-section` base + top drop-shadow, overlap z-index ladder, wave clip-path map, `.card-bg`/`.card-bg-edge` layers, per-section background variation) CSS
5. **Per-section CSS** (how-it-works steps, road, more-than-a-ride bento, safety pillars, testimonials, ambassador, faq, download, `.app-shot` rotated image shots) + hero chip image
6. **Footer + animations + reduced-motion + responsive** CSS
7. **Hidden wave-clip SVG** — first element in `<body>`; `<defs>` of **7** wave `clipPath`s (`objectBoundingBox`) + the `#grain` film-grain `<filter>` + the `#container-glass` liquid-glass distortion `<filter>` (used by the Get KOVA / Apply Now buttons)
8. **HTML** — Navbar → `#hero` (with floating stats + a `road_chip1.png` chip image) → `#how-it-works` → `#testimonials` → `#more-than-a-ride` → `#safety` → `#ambassador` → `#faq` → `#download` → `<footer>`
9. **JS** — Lenis, **one merged rAF scroll loop** (nav active + nav glass; it also drives the roads via `window._roadScroll`), letter/word splitters, reveal observer, off-screen marquee-pause observer, FAQ accordion, road animation (**how-it-works, testimonials, more-than-a-ride, ambassador**)
10. **`<div class="grain-overlay">`** — last element before `</body>` (the `.bottom-blur` div was removed)

## Color Tokens

| Token | Value | Used for |
|---|---|---|
| `--bg` | `#0D1117` | Page background, footer |
| `--bright-green` | `#28C45A` | Primary CTA, badge/eyebrow border, open FAQ question, single car-window accent |
| `--dark-green` | `#2E6B4A` | Reserved accent |
| `--text-primary` / `--text-body` / `--text-muted` | `rgba(255,255,255, .92/.60/.52)` | Body text tiers |
| `--glass-bg` / `--glass-border` | `rgba(255,255,255, .07/.12)` | Glass surfaces (testimonial cards, nav, **download card**) |
| `--glass-green-bg` / `--glass-green-border` | `rgba(40,196,90, .08/.22)` | Reserved (green-tint glass; no longer used — the download card switched to neutral `--glass-bg`) |
| `--road-base` / `--road-center` | white .10 / **white .70** | Road strokes (center dashes are white). `--road-sheen` (white .04) still exists as a token but is **unused** — the sheen stroke was dropped for perf |

**Green is reserved.** It appears only on: the primary CTA fill, the eyebrow badge border, the open FAQ question, and a **single small car-window accent** (`rgba(44,178,82,0.4)`). The road center dashes are now white and the car body/outline/headlights are grey/white (Round 6 toned the road down). Do **not** put green on body text, headings, or icons elsewhere.

## Typography

| Font | Usage |
|---|---|
| **Fraunces** (serif; 400/600/700, optical + italic axes) | All headings, section titles, hero-stat numbers, testimonial names, `.hiw-step-heading`/`.hiw-step-num` |
| **Lora** (serif; 400/500/600 + italic 400) | Body text, descriptions, testimonial quotes, FAQ answers, hero-stat labels, footer |
| **Inter** (sans; 400/500/600) | All buttons + nav links (`button, .btn-primary, .btn-glass, .btn-purdue, .nav-btn`), `.mtr-label`, and footer text (`.footer-copy`, `.footer-link`) |

Loaded via Google Fonts CDN. **Fraunces**, **Lora**, and **Inter** are loaded. Headings use `'Fraunces', serif`; body uses `'Lora', serif`; buttons + nav links use `'Inter', sans-serif` (Round 6). (Round 3 switched the display face from Space Grotesk to Fraunces; Round 4 switched the body face from Figtree to Lora — there is no Figtree or Syne in the codebase anymore. Plus Jakarta Sans / DM Sans were briefly loaded for an HTML route-card experiment and have been removed.) The `Agrandir - Free For Personal Use/` package in the repo is **not wired up** (commercial license required for a public site).

## Layout: site-sections, overlap & waves (core)

The content sections (`#how-it-works`, `#testimonials`, `#more-than-a-ride`, `#safety`, `#ambassador`, `#faq`, `#download`) all carry the class **`.site-section`**:
```css
.site-section { position: relative; min-height: 100vh; display:flex; align-items:center;
                justify-content:center; overflow:hidden; margin-top:-44px;
                box-shadow: 0 -14px 48px rgba(0,0,0,0.55); }
```
- **Overlap:** `margin-top:-44px` pulls each section up over the one above. A z-index ladder keeps later sections on top: how-it-works 10 → testimonials 20 → more-than-a-ride 30 → safety 40 → ambassador 50 → faq 60 → download 70 → footer 80 (footer's *effective* z-index is actually `10000` from its own base rule; the ladder value is documentation only).
- **Top drop-shadow:** `box-shadow: 0 -14px 48px rgba(0,0,0,0.55)` casts upward so each section reads as sliding over the one above. NOTE: every section also has a wave `clip-path`, which clips the box-shadow to the section box — so this shadow is largely cropped away and barely visible. If a visible seam-shadow is ever wanted, it needs a separate **unclipped** layer.
- **Waves:** a hidden `<svg>` (first child of `<body>`) defines 7 `clipPath`s with `clipPathUnits="objectBoundingBox"` — `#wave-how-it-works`, `#wave-testimonials`, `#wave-more`, `#wave-safety`, `#wave-ambassador`, `#wave-faq`, `#wave-download`. Each is an irregular hand-drawn curve along the top edge (y ≈ 0.01–0.04, no repeating pattern). Applied via `#<id> { clip-path: url(#wave-<id>); }`. Content wrappers carry `padding-top: 80px+` so content clears the wave.

**Background layers per section** (`.card-bg` z 0 → `.site-section::before` overlay z 1 → `.road-svg` z 2 → content z 4 via `.site-section > *:not(.card-bg):not(.card-bg-edge):not(.road-svg)`):
- `.card-bg` (`inset:-10%`, `background-size:cover`) and `.card-bg-edge` (same image, radial mask — a soft halo around the sharper center) get their **image + position + scale/rotate** set **per-ID** (the variation block). The backgrounds are now rendered **sharp** — the earlier per-section `blur()` on `.card-bg` and the `blur(22px)` on `.card-bg-edge` were removed. `.site-section::before` is the dark overlay tint, also per-ID.
- **Compositor isolation (perf):** `.road-svg` carries `transform:translateZ(0); backface-visibility:hidden`, and in the **road-bearing sections** (how-it-works, testimonials, more-than-a-ride, ambassador) `.card-bg` (via a `translateZ(0)` appended to its transform) and `.card-bg-edge` (grouped rule) are promoted to their own layers. This is what stops the road's per-frame repaint from re-rasterizing the heavy photo backgrounds + wave clip on every scroll frame (was the main in-section scroll stutter). Non-road sections (safety/faq/download) are left unpromoted (no per-frame child invalidation, so no need to spend the VRAM).

**Per-section backgrounds** (real photos; some filenames contain spaces, so quote them in CSS):

| Section | image | position | overlay |
|---|---|---|---|
| `#hero` (`.hero-bg`) | `drive pic.jpg` | `center 40%` | `rgba(0,0,0,0.35)` |
| `#how-it-works` | `hiw-bg.jpg` | `center 70%` | `rgba(0,0,0,0.75)` |
| `#testimonials` | `concert pic.jpg` | `center 30%` | `rgba(0,0,0,0.72)` |
| `#more-than-a-ride` | `social-bg.jpg` (sharp; `scale(1.05) rotate(-0.8deg)`) | `center center` | `rgba(0,0,0,0.72)` |
| `#safety` | `safety-bg.jpg` (sharp; `scale(1.05) rotate(0.6deg)`) | `center 60%` | `rgba(0,0,0,0.75)` |
| `#ambassador` | `nightclub pic.jpg` | `60% center` | `rgba(0,0,0,0.75)` |
| `#faq` | `faq-bg.jpg` | `center 65%` | `rgba(0,0,0,0.85)` |
| `#download` | `download-bg.jpg` | `40% center` | `rgba(0,0,0,0.80)` |

## Key Patterns

**Navbar** — `position: fixed`, **full-width and flush to the top** (`top:0; left:0; right:0; border-radius:0`), 3-column grid (logo / centered `.nav-links` / Get KOVA), `isolation:isolate`. The bar itself is `background:transparent; border:none`; the glass lives on a **`.nav::before`** layer (`inset:0; z-index:-1; background:rgba(255,255,255,0.06); backdrop-filter:blur(12px); opacity:var(--nav-glass,0)`) — so at the very top the nav is see-through and **fades into frosted glass over the first 100px of scroll** (`updateNavGlass()` sets `--nav-glass = min(scrollY/100, 1)`, folded into the `_uiRaf` scroll loop). Middle links (`.nav-btn`) are **Inter 400**, resting `rgba(255,255,255,0.55)`, easing to `#fff` on hover/`.active` over `0.4s` (no bold/weight jump anymore — removed so section-to-section active changes are smooth). The logo keeps `filter: invert(1) hue-rotate(180deg)` permanently (white text, green wheel). Nav targets: How it works → `how-it-works`, Testimonials → `testimonials`, Ambassador Program → `ambassador`. **Get KOVA** (`.nav-btn.primary`) is now an **`<a>`** that links **directly to the App Store** (`https://apps.apple.com/us/app/ridekova/id6757269118`, new tab) — it no longer scrolls to `#download`. It's styled as a **liquid-glass pill with a green-tinted rim + text** (see Buttons) — but because it's a **fixed** element, its backdrop uses a cheap `blur(3px)` (the `url(#container-glass)` SVG filter was **dropped here for perf**: on a fixed pill it re-runs the turbulence filter over the scrolling page every frame). Active state is set by `updateNavActive()` which compares scroll against each target's document-top, **cached** by `refreshNavOffsets()` (called on init, `load`, `resize`, and after each road rebuild — previously it was defined but never called, so the active highlight was stuck on the last link; that's fixed). The Get KOVA link has no `data-target`, so it never gets `.active`. `updateNavActive` + `updateNavGlass` run from the single merged `_uiRaf` scroll loop (which also calls `window._roadScroll`).

**Hero** — `#hero` (z-index 1; not a `.site-section`, no wave clip). `drive pic.jpg` background + dot grid (`.hero-bg::after`) + dark overlay (`.hero-bg::before`, `rgba(0,0,0,0.35)`). Title `.hero-title` is white Fraunces `clamp(3rem,7vw,5.5rem)`, reading "Your world just / got <span class="hl">bigger.</span>" — the word **"bigger." is wrapped in `.hl`**, a green-marker highlight: `background-image: linear-gradient(to bottom, transparent 20px, var(--bright-green) 20px)` (square corners; the 20px transparent strip drops the band's top edge below the cap while the bottom stays on the baseline) with `color:#0D1117` black text and `box-decoration-break:clone`. `.btn-purdue` eyebrow is a glass pill (Lora 500, green-tinted border, white "New" badge, links to the Purdue article). One decorative **chip image** sits at the lower-right (see below).

**Hero chip image** — a single `<img class="hero-chip" src="road_chip1.png">` (a screenshot of an in-app ride chip) is absolutely positioned at the lower-right of the hero (`right:4%; bottom:14%; width:325px`, z-index 5) via an inline `style`. Hidden `@media (max-width:768px)` (`.hero-chip { display:none }`). This replaced an earlier pair of HTML/CSS glassmorphism route cards (`.route-card`/`.rc-*`) and, before that, the original glass-pill `.route-chip` placeholders — all of that HTML **and** its CSS have now been deleted.

**Hero floating stats** — three `.hero-stat`s are absolutely positioned (z-index 5) over the hero photo, scattered into open corners and each given a random-looking tilt: **0% commission taken** (top-left, `-12deg`) · **500+ Purdue students** (top-right, `13deg`) · **4.9★ average rating** (bottom-left, `-7deg`). Positions clear the chip image and the centered CTA. Each has a big Fraunces `.hero-stat-number` over a small uppercase Lora `.hero-stat-label`; `.hero-stat` is `align-items:center` so the number is centered above the label. Hidden `@media (max-width:768px)`. (These replaced the old standalone `#stat-bar` block, which is gone.)

**Hero stat/chip entrance** — the stats **and** the chip fade up on first load (after the title/sub/CTA sequence) via a tilt-preserving `@keyframes fadeUpTilt` (`translateY(24px)→0` while holding `rotate(var(--tilt))`). Each element's rotation lives in a `--tilt` CSS var and its stagger in a `--delay` var (set inline): chip `0.95s`, stats `1.0s / 1.15s / 1.3s`. (A plain `fadeUp` would have wiped their tilt, since it animates `transform`.) `prefers-reduced-motion` shows them instantly at full opacity with tilt intact.

**How it works** (`#how-it-works`) — a vertical, **alternating** 3-step walkthrough (no grid). `.hiw-inner` is a centered column (`max-width:980px`); `.hiw-steps` stacks three `.hiw-step` blocks offset left/right via `.hiw-step--left` (`align-self:flex-start; row`) / `.hiw-step--right` (`align-self:flex-end; row-reverse`). For an **irregular hand-placed look**, the steps get **different widths/margins via a `@media (min-width:769px)` `:nth-of-type()` block** (step 1 `78%`, step 2 `92%` nudged right, step 3 `74%` pushed `13%` from the left) — kept in a min-width query so mobile (`width:100%`) isn't overridden by specificity. Each step = a big ghost `.hiw-step-num` (`01/02/03`, absolutely positioned, `rgba(255,255,255,0.16)`) + a `.hiw-step-screen` holding an `.app-shot` image + a `.hiw-step-text` (`.hiw-step-heading` Fraunces / `.hiw-step-desc` Lora). The 3 steps: **Find a ride** (`find_a_ride.png`), **Settle the price** (`chat_price.png`), **Ride live and stay safe** (`ride_live.png`). This section also has a **road animation** (re-added — see Road Animation). Collapses to a single centered column under 768px. (The four old `find_a_ride/make_bucks/community/perks` 2×2 items moved — Earn/Community/Perks copy now lives in More than a ride; the old `.hiw-grid/.hiw-item/.hiw-img` CSS is gone.)

**App-element shots** (`.app-shot`) — UI-snippet screenshots used in How it works, More than a ride, and Safety. Base look: `border-radius:12px` + layered drop-shadow (`0 8px 20px` + `0 24px 52px` black) for depth; each is **randomly tilted** via an inline `transform:rotate(...)`. Sizing per section: `.hiw-shot` **360px** in-flow beside the step text; `.mtr-shot` **340px** (**400px** on the Earn card), **in-flow above its text** (the base `.app-shot` `border-radius`/`box-shadow` are **overridden to none** for `.mtr-shot` — see More than a ride); `.safety-shot` a **uniform `height:150px`** (`width:auto; object-fit:contain`) so all three pillars line up, centered. The 9 images: `find_a_ride` / `chat_price` / `ride_live` (HIW), `make_bucks` / `community` / `perks` (MTR), `student_seal` / `stars` / `profile` (Safety). **All HIW + MTR shots carry explicit `width`/`height` attributes that match the file's true aspect ratio** so the section reserves correct height before the lazy image loads — critical because the road geometry/timing is measured off section heights (see Road Animation), and a wrong ratio causes a reflow when the image loads (this had been the case for `community.png`/`perks.png` and was fixed). **Perf — all these PNGs were downscaled** to ~3× their on-screen size (HIW/MTR shots `1080px` wide; safety shots `450px` tall, matching their `height:150px` display) so the big screenshots don't cause a decode/GPU-upload hitch as each section first scrolls in. Originals are kept (git-ignored) in `.img-backup/`.

**More than a ride** (`#more-than-a-ride`) — over a **sharp** `social-bg.jpg`. Also has a **road animation** (see Road Animation). `.mtr-inner` centered column (`max-width:1080px`) → `.mtr-bento` is now a **flex row** (`align-items:center`), **not a grid or glass cards**: `.mtr-card--earn` on the left (`flex:1`, vertically centered, larger 2rem heading) + a `.mtr-right` column (`flex:1`) stacking `.mtr-card--community` over `.mtr-card--perks`. There are **no boxes** — `.mtr-card` is just a transparent flex column (image then text), and the old **one-word `.mtr-label` eyebrows were removed**. Each card = a big in-flow `.mtr-shot` image (unframed: `border-radius:0; box-shadow:none`) above `.mtr-heading` (Fraunces) + `.mtr-desc` (Lora). Generous gaps (`88px` between columns, `80px` between the two right cards). Stacks to one column under 768px.

**Safety** (`#safety`) — over a **sharp** `safety-bg.jpg`. `.safety-inner` centered → `.safety-pillars` 3-col grid (1-col under 768px) of `.safety-pillar` columns (`align-items:center; text-align:center`), each = a `.safety-shot` image + `.safety-pillar-heading` (Fraunces) + `.safety-pillar-desc` (Lora). The shots use a **uniform `height:150px`** so the headings/descriptions across the three pillars **line up**. The 3 pillars: **Verified students**, **Ratings and reviews**, **Check the profile**.

**Testimonials** (`#testimonials`) — `.testimonials-inner` centered column (heading + marquee). Has a **road animation** (`<svg class="road-svg">`) that now runs **right → left** (waypoints reversed). `.marquee-outer` clips the track and has left/right edge-fade gradients. `.testimonials-track` is the infinite `@keyframes testimonialScroll` marquee (12 cards = 6 + 6 duplicates) with `align-items:stretch` so every card matches the tallest. **Perf:** an IntersectionObserver toggles `.testimonials-track.paused` (`animation-play-state:paused`) when the track leaves/enters view, so the marquee doesn't keep the compositor busy while you're elsewhere on the page. `.testimonial-card` is a translucent panel (`background:rgba(255,255,255,0.09)` + `--glass-border`) — **no `backdrop-filter`**: a live blur was dropped because these cards ride the infinite marquee, so it would recompute the backdrop every frame (the section's dark overlay keeps the white quote text legible without it). Each card is a **flex column** (`justify-content:space-between; min-height:200px`) laid out as three fixed zones: `.testimonial-stars` pinned top-left, `.testimonial-quote` flexing to fill the middle (centered), `.testimonial-author-row` pinned bottom-left. Stars stay gold (`#FFB800`).

**Ambassador** (`#ambassador`) — `.ambassador-inner` centered. Has a **road animation** (`<svg class="road-svg">`) shaped as a vertical **S**: it enters above the top edge (`y=-0.10`) and exits below the bottom edge (`y=1.10`), so its ends are cropped by the section's `overflow:hidden` and it appears to slide out from under the top and disappear beneath the bottom. `.amb-feats` is a 3-up flex row of `.amb-feat` glass icon tiles (white SVG strokes). The "Apply Now" button (`.btn-glass.btn-apply`) is a **liquid-glass pill** ported from 21st.dev's `liquid-glass-button`: a `999px` transparent pill whose backdrop is warped by **`backdrop-filter:url(#container-glass)`** (the SVG turbulence/displacement filter in the hidden `<defs>`; a `blur(3px)` fallback declaration precedes it for browsers — e.g. Safari — that don't support `url()` backdrop filters), wrapped in the component's signature **inset white "rim" `box-shadow`**. Hover = `transform:scale(1.02)` with a smooth `transform 0.3s ease` + slight bg lift — **matched to the Get KOVA hover** (was a springy `scale(1.05)` overshoot). Both the hover transition (`.btn-glass.btn-apply`) **and the `:hover` rule itself (`.btn-glass.btn-apply:hover`)** carry the extra `.btn-glass` specificity so `.reveal.in-view { transform: translateY(0) }` — which comes later in the sheet — can't override the `transition` *or* clobber the hover `scale()`. The reveal `opacity` easing is kept so the entrance still works. (The earlier masked-`::after` **silver ring** was replaced by this.)

**FAQ** (`#faq`) — an **accordion** (its heading reads **"Q&A"** as of Round 8). Each `.faq-item` has a clickable `.faq-question` (Fraunces 700 + `.faq-chevron` SVG) and a `.faq-answer`. Open/close is **animated** (the item gets `.open` on JS click): the answer transitions `max-height` (0 → 260px), `opacity`, and `margin-top` over `0.5s cubic-bezier(0.4,0,0.2,1)`, and the chevron rotates 180° over `0.5s`; the question turns `var(--bright-green)` when open (the only non-white heading on the page). `#faq` overrides `.site-section`'s centering with `align-items:flex-start` so the column is **top-anchored** — opening an item pushes the items below it down instead of shoving the title up (`.faq-inner` carries `padding:110px 48px 90px` for navbar clearance). All items start closed. **If a future answer is longer than ~260px it will clip** — bump the `max-height`.

**Download** (`#download`) — a centered **neutral-glass** `.dl-card` (radius 28, `--glass-bg`/`--glass-border` — the green tint was removed), **two-column**: `.dl-info` (title + sub) on the left (`flex:1`), and the white `.dl-qr-card` (QR + App Store badge, `flex:0 0 auto`) on the right. The app screenshot (`final_ss.png` / `.dl-phone-col` / `.dl-screenshot`) was **removed**. Stacks to one centered column `@media (max-width:768px)`. Section is flex-centered in 100vh, so the wave clip never touches the card.

**Film grain** — `<div class="grain-overlay">` (last child of `<body>`, `position:fixed; inset:0; z-index:999; pointer-events:none; opacity:0.045`) applies `filter:url(#grain)` — an SVG `feTurbulence` fractal-noise filter (defined in the hidden `<defs>` block, `numOctaves="2"` — dropped from 4 for cheaper noise generation; imperceptible at 0.045 opacity) desaturated and `feBlend mode="overlay"`. Gives a subtle analog grain over the whole page. Lower the opacity (≈0.03) if it ever reads too heavy.

**Buttons** — `.btn-primary` (green CTA, radius 10) and `.btn-glass` (glass secondary); all buttons use **Inter** (one rule: `button, .btn-primary, .btn-glass, .btn-purdue, .nav-btn { font-family:'Inter', sans-serif }`). Two CTAs are **liquid-glass** (inset rim `box-shadow` + `scale(1.02)` on a smooth `transform 0.3s ease` hover): the ambassador **Apply Now** (`.btn-apply`, white rim, backdrop warped by `url(#container-glass)` — it's **not fixed**, so the SVG filter only costs while on screen — see Ambassador) and the nav **Get KOVA** (`.nav-btn.primary`, **green-tinted** rim/border + green text `#9af0b8`; its backdrop uses a cheap `blur(3px)` because the `url(#container-glass)` filter was **dropped for perf on this fixed pill**). Both hovers now use the **same** smooth `scale(1.02)` (the Apply Now springy `1.05` overshoot was unified to match Get KOVA). The hero **"Pull up"** `<button>` calls `scrollToSection('how-it-works')`. **Get KOVA** is an `<a>` linking straight to the App Store. So the App Store URL (`https://apps.apple.com/us/app/ridekova/id6757269118`) is now used by **Get KOVA**, `.appstore-btn`, and the QR image.

**Smooth scrolling (Lenis)** — `lenis@1.1.18`, `lerp: 0.06`, `wheelMultiplier: 0.9`, rAF loop. Skipped under `prefers-reduced-motion`. Exposed as `window.lenis`. `scrollToSection(id)` / `scrollToTop()` route nav scrolls through `lenis.scrollTo(..., NAV_SCROLL)` (`duration:1.6`, easeInOutCubic), falling back to native `window.scrollTo` when Lenis is inactive.

**Reveal animations** — `.reveal` starts `opacity:0; translateY(24px)`, `.reveal.in-view` fades/slides in (0.6s, `--reveal-delay` stagger). `revealObs` (threshold 0.12) observes `.reveal, .letter-reveal, .word-reveal`, adds `.in-view`, and unobserves after firing. **Perf:** `will-change` is applied **lazily** — the observer sets `willChange='transform, opacity'` on a `.reveal` element **just before** adding `.in-view`, then clears it (`'auto'`) ~1.3s later. (It's no longer in the base `.reveal` CSS, so dozens of off-screen reveal blocks aren't pre-promoted to compositor layers from page load.) The per-char/per-word reveals deliberately carry **no** `will-change` — see below.

**Letter-by-letter headings** — `.letter-reveal` text is split per character into `<span class="char" style="--i:N">`, **wrapped per word** in `<span class="lr-word">` (inline-block, `white-space:nowrap`) so inline-block chars never break mid-word. Chars ripple `opacity`+`translateY(5px)`, `calc(var(--i)*0.016s)`. **Applied to:** the ambassador title, the FAQ "Q&A" title, **and (as of the "typed-out" pass) every section title, step/card/pillar heading, and description in `#how-it-works`, `#more-than-a-ride`, and `#safety`** — so that text types out letter-by-letter as each screenshot fades up. The `.char` spans carry **no `will-change`**: there are now hundreds of them, and permanently promoting each tiny glyph to its own GPU layer costs more than a one-time opacity/translate fade saves.

**Word-by-word body text** — `.word-reveal` splits text into `<span class="word" style="--wi:N">`, fading in reading order (`calc(var(--wi)*0.06s)`).

**Image loading** — below-fold images use `loading="lazy"`; all use `decoding="async"`. The hero/section backgrounds are CSS, so neither applies. All screenshot PNGs and the testimonials background were downscaled to remove first-scroll decode/upload hitches (see App-element shots; `concert pic.jpg` went 5184px → 2560px).

> The old fixed **`.bottom-blur`** overlay (a `blur(14px)` strip at the bottom) was **removed** — it re-sampled and blurred the page on every scroll frame for little visual gain. Its CSS, `<div>`, and `updateBottomBlur()` JS are all gone.

## Road Animation (how-it-works, testimonials, more-than-a-ride, ambassador)

**Four** sections have a road: `#how-it-works`, `#testimonials`, `#more-than-a-ride`, `#ambassador`. Each contains an empty `<svg class="road-svg">`; one IIFE at the bottom of the script builds and animates all of them, keyed off the `ROADS` map. To add/remove a road, add a `.road-svg` to the section and an entry to `ROADS` — nothing else.

- **`ROADS`** — `{ id: waypoints }`, waypoints `[x,y]` as fractions of section W×H. Current:
  - `how-it-works`: `[[.46,-.10],[.72,.24],[.28,.50],[.70,.76],[.48,1.10]]` — a vertical **S**, ends off the top/bottom edges (cropped).
  - `testimonials`: `[[.95,.5],[.7,.68],[.3,.32],[.05,.5]]` — **right → left** (reversed from the original L→R).
  - `more-than-a-ride`: `[[.40,-.08],[.70,.26],[.30,.54],[.68,.80],[.42,1.08]]` — a vertical **S**, ends off the edges.
  - `ambassador`: `[[.92,-.10],[.45,.20],[.72,.50],[.30,.78],[.10,1.10]]` — a vertical **S** whose ends sit off the top/bottom edges so they're cropped by `overflow:hidden`.
- **SVG** (built in JS) — **no `<mask>` anymore**: just `<path class="road-base"/><path class="road-center"/>` (shared `d`) + a `.road-brush` `<g>` holding the top-down **car sprite** (white-ish body, **grey `#a0a0a0` outline**, **grey `rgba(255,255,255,0.15)` headlights**, **one green-tint window `rgba(44,178,82,0.4)`** as the sole green accent, red taillights, dark wheels; authored nose-toward +x). The `SPRITE` const is **shared by all roads**. The old `.road-sheen` (white .04) and `.road-reveal` mask path are **gone** (perf — see below). `.road-base` carries `shape-rendering:optimizeSpeed` (AA off — invisible at ~7% effective white, but much cheaper to raster); the brush + centre dashes keep AA. (The `bg` const that read `--bright-green` is still unused dead code.)
- **Maskless reveal (perf rewrite)** — the road used to draw via an SVG `<mask>` whose reveal path's `strokeDashoffset` changed every scroll frame, which forced a **full-section-sized offscreen mask buffer to re-rasterize every frame** (the big in-section scroll stutter, worst in the tall sections). Now each stroke reveals **itself**: `.road-base` via its own `strokeDashoffset` (one big dash = `totalLen`); `.road-center` via a per-frame computed `stroke-dasharray` from `centerDash(len)` that draws the `20 on / 18 off` dashes up to the drawn length then hides the rest. Same look, no offscreen buffer.
- **Model** — rAF-lerp driven by scroll progress within the section. `build(inst)` turns the waypoints into a Catmull-Rom path, sets `viewBox = "0 0 W H"`, computes `totalLen`, sets the base dasharray/offset hidden, stores `inst.top = absTop(card)` + `inst.h = H`, fills a 601-point `cache` for cheap `pointAt()`, and computes **`inst.maxLen`** — the path length at which the road first crosses the section bottom (`y ≥ H`), or `totalLen` if it never does (e.g. testimonials).
- **Scroll driver** — `updateTargets()` (driven from the merged scroll rAF) paces the draw to the **section's own height**: `progress = clamp((scrollY - (top - vh/2)) / h, 0, 1)`, `targetLen = p * totalLen`. `p=0` when the top edge reaches the viewport middle, `p=1` when the bottom edge does. **For a viewport-height section this matches the old center-crossing formula**, so short sections (testimonials, ambassador) are unchanged; the **tall** sections (how-it-works, more-than-a-ride) reveal top→bottom in step with scroll instead of bursting mid-section. *Earlier dead-ends: a fixed one-viewport window drew the tall roads mid-section, and a "static fully-drawn" variant looked abrupt — the height-paced formula is the keeper.*
- **`tick()`** eases `drawnLen → targetLen` (`SMOOTH ≈ 0.14`); skips all DOM writes for roads whose `drawnLen` is unchanged (`_lastDrawn` guard). The path reveal is **capped at `maxLen`** (`revealLen = min(drawnLen, maxLen)`, guarded by `_lastReveal`) so once the **visible** road is fully drawn it stops re-rasterizing — the off-screen tail (cropped by `overflow:hidden` / covered by the next section's overlap) never draws, which kills the "topping-off" stutter at the bottom of tall roads. The **car** still travels the full path (it moves by `transform` — cheap, not rasterized per frame) and fades out at the very start and once it nears the end.
- **Rebuilds** — `scheduleBuild()` coalesces rebuilds into a single rAF (each rebuild is ~2,400 `getPointAtLength` reads). It runs on initial load, `resize`, `window` `load`, and **`document.fonts.ready`** (font swap changes text height → section height). It deliberately does **not** rebuild per `.app-shot` `load` anymore — the shots carry correct `width`/`height` (height reserved before load), so a lazy image arriving as you scroll a section in no longer changes geometry; the old per-image rebuild was a heavy long-task landing right at the scroll-in moment (a first-load stutter). After a rebuild it also calls `refreshNavOffsets()` + `updateNavActive()`.

Roads (and Lenis) are skipped entirely under `prefers-reduced-motion` (IIFE early-returns and CSS hides `.road-svg`).

## Assets

- `KOVA logo.png` — black "KOVA" text + bright green steering wheel (inverted to white in nav/footer)
- `favicon.png` — browser-tab icon: just the **green steering wheel** (cropped from `KOVA logo.png`, centered on a transparent 256×256 square). Linked in `<head>` via `<link rel="icon">` + `apple-touch-icon`. The tab **title is `Ride KOVA`**.
- `drive pic.jpg` — hero background (was also how-it-works; now hero only)
- `hiw-bg.jpg` — how-it-works background
- `concert pic.jpg` — testimonials background (was also faq; now testimonials only). **Downscaled** 5184×2540 (3.3 MB) → 2560×1254 (~480 KB) — it was a 13-megapixel outlier causing a first-scroll hitch into testimonials
- `nightclub pic.jpg` — ambassador background (was also download; now ambassador only)
- `faq-bg.jpg` — faq background
- `download-bg.jpg` — download background
- **App-element shots** (`.app-shot`, Round 8) — small rotated UI snippets:
  - How it works: `find_a_ride.png`, `chat_price.png`, `ride_live.png`
  - More than a ride: `make_bucks.png`, `community.png`, `perks.png`
  - Safety: `student_seal.png`, `stars.png`, `profile.png`
  - (`make_bucks` / `community` / `perks` / `find_a_ride` were the old how-it-works grid images, now reused)
  - **All downscaled for perf** (HIW/MTR → 1080px wide; safety → 450px tall). Pre-downscale originals are kept in **`.img-backup/`** (git-ignored). When re-exporting any shot, keep the HTML `width`/`height` attributes matching the file's true ratio (a mismatch reflows the section on load).
- `social-bg.jpg` — background for `#more-than-a-ride` (now rendered sharp)
- `safety-bg.jpg` — background for `#safety` (now rendered sharp)
- `road_chip1.png` — in-app ride-chip screenshot used as the hero's decorative chip image (lower-right)
- `road_chip2.png` — second ride-chip screenshot, **not referenced** (was a second chip, since removed; kept locally, not tracked)
- `download_appstore_svg.png` — App Store badge
- `purdue.png` — Purdue logo in the footer (original colors)
- `color palette.png` — reference swatches
- `final_ss.png` — old download-section app screenshot, **no longer referenced** (the screenshot was removed; file kept in repo)
- `Agrandir - Free For Personal Use/` — fonts, **personal use only**, not wired up

> **`.gitignore` gotcha:** the repo ignores all `*.png`/`*.jpg` (a dev-screenshot rule) and re-allows the real assets with explicit `!filename` exceptions. When you add a **new** background/image used by the site, add a matching `!<filename>` line or it will silently never get committed/pushed.

## Pages

- `index.html` — main landing page
- `terms.html` — Terms of Service placeholder (links back to index)
- `privacy.html` — Privacy Policy placeholder (links back to index)

## Footer

`<footer>` is dark (`var(--bg)`), `position: relative; z-index: 10000` (its own base rule). Three flex columns: KOVA logo (inverted white) / `.footer-links` (Terms → `terms.html`, Privacy → `privacy.html`, `help@ridekova.com`) / `.footer-right` (Instagram → `instagram.com/ridekova/`, copyright `© 2026 KOVA Group, Inc. All rights reserved.`, "Built with love, at [purdue.png]"). Footer text (`.footer-copy`, `.footer-link`) is **Inter** (Round 8 switched it from Lora), links `rgba(255,255,255,0.60)` → `#fff` on hover. `.footer-purdue` is `display:inline` to override the global `img{display:block}` reset.
