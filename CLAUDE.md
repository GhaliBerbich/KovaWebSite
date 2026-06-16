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
Use a server (not `file://`) because some browsers block Unsplash CDN images on file:// origins.

**Taking screenshots for review:**
Playwright MCP is available — navigate to `http://localhost:<port>`, resize to 1440×900, inject `.in-view` on `.step-row` elements before screenshotting (IntersectionObserver won't fire in headless), then call `updateNavTheme()` to set the correct navbar state.

## Architecture

Everything is in `index.html`, organized top-to-bottom:

1. **CSS custom properties** (`:root`) — all color tokens, do not use raw hex outside this block
2. **Navbar CSS + JS** — glassmorphism pill, always transparent, section-aware theme switching
3. **Section CSS** — each section (`#hero`, `#how-it-works`, `#ambassador`, `#download`) has its own block
4. **HTML sections** — same order as nav: Hero → How it works → Ambassador → Download → Footer
5. **JS** — IntersectionObserver for scroll animations + navbar theme detection, at bottom of `<body>`

## Color Tokens

| Token | Hex | Used for |
|---|---|---|
| `--dark-green` | `#2E6B4A` | Ambassador section bg, dark accents |
| `--bright-green` | `#28C45A` | CTAs, highlights, step badges |
| `--near-black` | `#0D1117` | Body text, hero bg |
| `--light-bg` | `#F4F9F6` | Download section bg |

## Key Patterns

**Navbar theme detection** — JS probes `navbar.getBoundingClientRect().bottom + 10` against each `section[id]` rect to determine which section the navbar overlaps, then toggles `.over-light` class. Add new dark-background sections to the `darkSectionIds` Set.

**Logo filter on dark backgrounds** — `filter: invert(1) hue-rotate(180deg)` keeps "KOVA" text white while mathematically restoring the green steering wheel (invert shifts green H≈139° to H≈319°; hue-rotate(180°) brings it back). `.nav.over-light .nav-logo { filter: none }` restores the original logo on light sections.

**iPhone frames** — CSS-only, no images. Structure: `.step-phone-wrap > .iphone > (.iphone-screen > .iphone-island + content)`. Side buttons via `::before`/`::after`. Add `.large` modifier for the Download section phone.

**Scroll animations** — `.step-row` starts `opacity:0` with `translateX(±80px)`. `IntersectionObserver` adds `.in-view` to trigger the CSS transition. Left-entry rows use `.from-left`, right-entry use `.from-right`.

**Hero background** — Unsplash CDN image (`photo-1511632765486-a01980e01a18`) + layered dark overlay gradients in `.hero-bg::before` + dot grid in `.hero-bg::after`.

## Assets

- `KOVA logo.png` — black "KOVA" text + bright green steering wheel replacing the O
- `color palette.png` — reference swatches (white / `#2E6B4A` / `#28C45A`)
- Screenshot PNGs/JPGs in root — development previews only, not served to users
