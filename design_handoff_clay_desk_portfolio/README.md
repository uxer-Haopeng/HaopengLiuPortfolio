# Handoff: Clay Workdesk → UX Portfolio

## Overview
An interactive 3D landing experience for a UX/Product designer's portfolio. The visitor lands on a clay-styled 3D work desk set in a garden (orbit-able with the mouse). Scrolling down **dollies the camera into the monitor screen**, which crossfades into a full-screen, scrollable UX portfolio (hero, selected work, about, contact). Scrolling back to the top — or a "Back to desk" button — zooms back out to the 3D scene. A customer-facing Tweaks panel lets the viewer change garden style, time of day, desk color, depth blur, and auto-rotate.

## About the Design Files
The files in this bundle are **design references created in HTML/JS** — a working prototype showing the intended look, motion, and behavior. They are **not** meant to be shipped verbatim. The task is to **recreate this experience in a real codebase** using its established framework and patterns. If no codebase exists yet, the recommended stack is below. The 3D scene is genuinely functional (Three.js) and can be largely carried over; the portfolio DOM/CSS should be re-implemented as components.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, motion, and interactions are all specified here and present in the prototype. Recreate pixel-faithfully, then wire to real content/CMS.

## Recommended Stack (if starting fresh)
- **Framework:** Next.js (App Router) or Vite + React.
- **3D:** `three` + `@react-three/fiber` + `@react-three/drei` (OrbitControls, useTexture). The prototype uses raw Three.js r160; R3F is the idiomatic React port.
- **Styling:** CSS Modules or Tailwind — tokens listed below.
- **Content:** case studies + about/contact as MDX or a headless CMS (Sanity/Contentful). Each case `View case study →` should route to a detail page (not built yet — see Backlog).
- **Images:** the prototype uses drag-drop placeholders (`<image-slot>`). In production these become real `<Image>` components fed by content.

---

## Experience Flow / "Screens"

### 1. Desk scene (establishing shot)
- **Purpose:** Brand moment + entry point. Viewer can orbit the desk; a pulsing "scroll to enter" cue invites them in.
- **Layout:** Full-viewport `<canvas>`. Fixed-position overlay chrome: orbit hint (bottom center), scroll-to-enter cue (bottom center, above hint), Tweaks panel (host-provided toggle).
- **Camera:** PerspectiveCamera, fov **33**, start position `(-4.3, 3.05, 5.7)`, target `(0.05, 0.95, 0.1)` — a 3/4 view from front-left, slightly above.
- **Controls:** OrbitControls, damping 0.07, distance 3.2–14, polar clamp `0.25 … π/2 − 0.04` (never under the floor). **Zoom (wheel) is disabled** — the wheel is repurposed for the dive.

### 2. The dive (scroll-driven transition)
- **Trigger:** `wheel` / `touchmove`. A normalized `zoom` value 0→1 is eased (`easeInOutCubic`) and lerps the camera from its current orbit position to a point **1.32 units in front of the monitor's screen plane**, looking at the screen center.
- **Crossfade:** the portfolio DOM fades/scales in over `zoom` 0.5→0.92 (`opacity = clamp((zoom-0.5)/0.42)`, `scale 1.05→1.0`). Pointer events enable at `zoom > 0.985`.
- **Reverse:** when portfolio is scrolled to top (`scrollTop <= 0`) and the user scrolls up, `zoom` decreases and the camera returns to the saved orbit pose. "Back to desk" button sets `scrollTop=0` and `zoom→0`.
- **Perf:** the 3D loop stops rendering once `zoom > 0.992` (portfolio fully covers the canvas).

### 3. Portfolio (full-screen takeover)
Sections, in order: **Nav → Hero → Selected Work → About → Contact**. Details below.

---

## Portfolio Components (exact specs)

### Nav (`.pf-nav`)
- Sticky top, `backdrop-filter: blur(14px)`, bg `rgba(239,231,223,0.78)`, bottom border `1px var(--line)`.
- Left: **Back to desk** pill button (`.pf-back`) — Space Mono 12px uppercase, bg `#fbf7f0`, border `var(--line)`, radius 999px, padding 9×16, inset highlight + soft drop shadow; hover slides left 2px and brightens.
- Right: links Work / About / Contact — 15px/500, animated underline (`var(--accent)`) growing on hover.

### Hero (`.pf-hero`)
- Eyebrow: Space Mono uppercase, `var(--accent)`, `UX / PRODUCT DESIGNER · PORTFOLIO`.
- Title `.pf-title`: Instrument Serif, `clamp(42px,7.2vw,92px)`, max-width 16ch, balanced wrap. Copy: "Designing calm, usable software for people who are busy."
- Lede: `clamp(18px,2.1vw,22px)`, `var(--ink-soft)`, max 56ch, name bolded.
- Meta row: availability pill (sage dot `#869068` with halo) + location in Space Mono.

### Selected Work (`#work`)
- Section head: number `01` (`var(--accent)`) + "Selected work" (Instrument Serif `clamp(34px,5vw,56px)`).
- Grid `.pf-grid`: 2 columns, gap `clamp(22px,3vw,38px)`; 1 column ≤860px.
- Card `.pf-case`: bg `var(--card)` `#f3ece1`, border `var(--line)`, radius **26px**, padding 18px, inset highlight + shadow `0 26px 50px -34px rgba(74,58,42,.5)`; hover lifts 6px with deeper shadow (`cubic-bezier(.22,1,.36,1)`).
  - Thumb `.pf-thumb`: full width, height `clamp(220px,26vw,320px)`, bg `#e7dccd` (real image in prod).
  - Body: top row = case number + year (Space Mono, muted); `h3` Instrument Serif `clamp(26px,3vw,34px)`; role line (muted 14.5px); description (`var(--ink-soft)` 15.5px); tag chips (Space Mono 11px, bg `#ece2d4`); result line (Instrument Serif 22px, `var(--accent)`, top border); `View case study →` (Space Mono 12px, gap grows + turns accent on card hover).
- **Four cards** in the prototype (copy is placeholder — replace with real case studies):
  1. "Onboarding that gets users to value" — Fintech · Lead PD · 2025 · +34% activation.
  2. "A scheduling tool that feels calm" — SaaS · PD · 2024 · 4.7★.
  3. "Rethinking checkout for mobile" — E-commerce · Senior · 2024 · −22% drop-off.
  4. "Building a design system from zero" — Internal · DS Lead · 2023 · 120+ components.

### About (`#about`, `.pf-about`)
- Banded bg: vertical gradient into `#ece3d6`.
- Grid `0.85fr 1.15fr`, gap `clamp(30px,5vw,70px)`; stacks ≤860px.
- Left: sticky portrait `.pf-portrait` (radius 28px, bg `#e2d6c4`, height `clamp(380px,50vw,560px)`, `top:90px`).
- Right: section head `02 About`; lede (Instrument Serif `clamp(24px,3vw,34px)`); two body paragraphs (`var(--ink-soft)` 16.5px, max 56ch); two-column lists "What I do" / "Tools" with accent bullet dots.

### Contact (`#contact`, `.pf-contact`)
- Centered. Section head `03 Contact`; CTA `.pf-cta` Instrument Serif `clamp(36px,6vw,72px)` "Let's build something people love to use."; email link Instrument Serif `clamp(24px,3.4vw,40px)` accent, underline-on-hover; socials row (Space Mono uppercase); Space Mono copyright.

---

## Interactions & Behavior
- **Orbit:** drag to rotate; wheel zoom disabled in the desk view.
- **Dive:** wheel/touch drives `zoom`; eased camera lerp; portfolio crossfade; bidirectional; "Back to desk" button.
- **Hover:** nav underline grow; case-card lift + shadow + arrow-gap grow; email/social color shift.
- **Tweaks (customer-facing panel, title "Customize this scene"):**
  - **Garden** — `clay` (monochrome, cohesive with desk) / `color` (low-poly green + blue sky) / `painterly` (soft, fogged depth).
  - **Time of day** — `day` / `dusk` / `night`. Night = indigo sky, cool moonlight, monitor emits a point light that lifts the desk.
  - **Desk color** — swatches recolor the shared clay material live.
  - **Depth blur** — pulls fog near/far in for a tilt-shift feel.
  - **Auto-rotate** — slow turntable on OrbitControls.
- **Reduced motion / no-JS:** production should render the portfolio as a normal scrollable page if WebGL/JS is unavailable (the 3D scene is progressive enhancement). Provide a skip/"Enter portfolio" link for accessibility — the scroll-dive must not trap keyboard users.

## State Management
- `zoom` (0–1, animated) and `zoomTarget`; saved orbit pose (`startPos`, `startTarget`) captured at dive start.
- `ready` flag (gates input until the scene has loaded).
- Tweak state: `{ garden, timeOfDay, deskColor, depthBlur, autoRotate }` — persisted; in production use URL params or localStorage.
- Portfolio routing state (per-case detail pages — backlog).

## Design Tokens
Colors:
- `--bg #efe7df`, `--surface #f7f1e9`, `--card #f3ece1`
- `--ink #3a332b`, `--ink-soft #5d5446`, `--muted #8b8072`
- `--line rgba(58,51,43,.12)`, `--line-soft rgba(58,51,43,.07)`
- `--accent #c0764f`, `--accent-soft #e3a886`, `--sage #869068`
- Desk swatches: `#ece4d9` (default), `#e7d6bf`, `#dcddd4`, `#ecd9d2`, `#d7ddcb`
- Thumb/portrait placeholders: `#e7dccd`, `#e2d6c4`; about band `#ece3d6`

Typography (Google Fonts):
- **Instrument Serif** (400, +italic) — display/headings
- **Hanken Grotesk** (400/500/600/700/800) — body/UI
- **Space Mono** (400/700) — labels, eyebrows, meta (uppercase, letter-spacing ~0.06–0.22em)

Radius: cards 26px, pills 999px, thumbs 20px, portrait 28px.
Shadows: card `0 26px 50px -34px rgba(74,58,42,.5)`; hover `0 40px 60px -34px rgba(74,58,42,.6)`; button `0 8px 18px -14px rgba(74,58,42,.6)`.
Spacing: section padding `clamp(64px,11vh,130px)`; content max-width 1180px; gutters `clamp(20px,5vw,56px)`.

## 3D Scene Reference (Three.js)
- All furniture/props are built from rounded primitives (`RoundedBoxGeometry`, cylinders, spheres, cones, tubes) in `js/models.js`. Items: desk, monitor (with glowing display plane = the dive portal), keyboard, mousepad tray, 3-drawer cabinet w/ books, splayed-leg chair, floor lamp, pegboard w/ notes + shelf plant, aloe plant, speaker, pen cup, coffee, **cat tree + sleeping cat**.
- Garden (`js/garden.js`): deterministic-seeded scatter of trees/bushes/grass/flowers/rocks; three material sets (clay/color/painterly); desk footprint kept clear.
- Lighting/palette/dive/tweak-bridge: `js/main.js`. Shared `clay` MeshStandardMaterial (roughness .92), HemisphereLight + key DirectionalLight (shadows, 2048 map) + fill, PMREM RoomEnvironment, gradient sky dome shader, fog. Monitor screen is a `CanvasTexture` drawn to look like the portfolio preview.
- Renderer: `ACESFilmicToneMapping`, `preserveDrawingBuffer:true` (so visitors can screenshot), PCFSoft shadows.

## Assets
- **Fonts:** Google Fonts (Instrument Serif, Hanken Grotesk, Space Mono).
- **Images:** none baked in — every project thumbnail + the portrait is a drag-drop `<image-slot>` placeholder (`image-slot.js`). Replace with real images/CMS.
- **3D models:** none external — everything is generated procedurally in code (no GLTF assets to ship).
- **Reference:** original look reference in `uploads/` (clay desk screenshot).

## Files (in this bundle)
- `index.html` — page shell: fonts, portfolio markup, overlay chrome, script wiring.
- `portfolio.css` — all portfolio styling + tokens.
- `app.jsx` — customer-facing Tweaks panel (React) + scene bridge.
- `tweaks-panel.jsx` — Tweaks panel shell/host protocol + form controls.
- `image-slot.js` — drag-drop image placeholder web component.
- `js/main.js` — scene assembly, lighting, palettes, camera dive, tweak bridge.
- `js/models.js` — all desk/prop/cat geometry builders.
- `js/garden.js` — three garden styles.
- `screenshots/` — visual reference renders (see below).

## Screenshots (visual reference)
- `01-desk-day.png` — default establishing shot (clay garden, day).
- `02-desk-night.png` — night: indigo sky, moonlight, monitor glows.
- `03-desk-garden-color.png` — low-poly "color" garden style, day.
- `04-desk-painterly-dusk.png` — painterly garden, dusk, warmed desk color.
- `05-portfolio-hero.png` — portfolio hero (post-dive).
- `06-portfolio-work.png` — Selected Work grid (image-slot placeholders visible).
- `07-portfolio-about.png` — About section with sticky portrait slot.
- `08-portfolio-contact.png` — Contact section.

## Backlog / Next steps for the developer
1. **Case-study detail pages** — `View case study →` currently does nothing; route each card to a detail page or expand-in-place.
2. Replace all placeholder copy, name, email, socials with real content; wire image slots to real assets/CMS.
3. Port the Tweaks panel to a small in-app settings control (or drop it for a fixed look) — it's a prototype affordance.
4. Accessibility: keyboard-accessible "Enter portfolio" path, focus management on the dive, reduced-motion fallback, alt text on all images.
5. SEO/meta, OG image, performance budget for the 3D bundle (lazy-load Three.js, show a static poster first).
