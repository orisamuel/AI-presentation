# AI PRESENTATION — Claude Guidelines

## Project overview
A full-screen web presentation for **42 Creative's AI Workshop** — a live session showing employees how to use AI tools. Built as a single `index.html` with Reveal.js, Hebrew RTL, **73 slides**, ~1920×1080.

The presentation covers 7 AI tools: Gemini, Kling, Hedra, ElevenLabs, Suno, CapCut, ChatGPT — plus an interactive Bonus section showing how the presentation itself was built with Claude Code.

**Visual bar is high.** This is used live in front of a creative agency audience. Every slide must look premium, polished, and cinematic. "Good enough" is not good enough.

---

## Architecture

```
index.html          — entire presentation (~2200+ lines), all CSS inline
js/init.js          — Reveal.js init + click-to-advance + media handling
css/theme-42.css    — legacy theme file (NOT loaded in HTML — kept for reference only)
assets/logo-42.png  — 42 Creative logo
assets/demos/       — demo media (video/image/audio), generated images
generate-images.js  — fal.ai ambient image generator (ES module)
package.json        — { "@fal-ai/client": "^1.0.0" } — run: npm run gen
SLIDES.md           — content document: edit here, then sync to HTML
מידע.md             — detailed AI tools reference (Hebrew, April 2026)
template.html       — comprehensive slide-type templates (19 layout types, copy-paste ready)
```

---

## CSS architecture

All CSS is **inline in `index.html`** inside a single `<style>` block. No external CSS files are loaded. Key rules:

- `#bg-canvas` (fixed, z-index:-1) — global animated canvas: particles, rotating geometry, drifting nebulae
- `#bg-tint` (fixed, z-index:0) — full-viewport dark overlay, chapter-color transitions, opacity ~0.62
- `.reveal .slides > section { background:transparent !important }` — all slides are transparent so the canvas shows through
- Individual slide classes add atmospheric children (orbs, conic gradients, rings) but **never opaque backgrounds**
- `enhanceSlideBackgrounds()` JS function auto-injects `.bg-dots` + animated orbs into slides lacking visual elements

### Slide type classes
| Class | Purpose |
|---|---|
| `.s-cover` | Opening cover |
| `.s-section` | Chapter title (cinematic, bottom-anchored) |
| `.s-statement` | Big bold statement / riddle |
| `.s-text` | Two-column text blocks (or feat-card grid) |
| `.s-split` | Text + image side by side |
| `.s-video` | Text + video pane |
| `.s-video-2` | Text + 2 video panes |
| `.s-split-2img` | Text + 2 images stacked |
| `.s-fullbleed` | Full-screen media + overlay + bottom-right content |
| `.s-stats` | Big number stat grid |
| `.s-compare` | Two-column comparison |
| `.s-steps` | Step-by-step process |
| `.s-gallery` | Horizontal scrolling cards |
| `.s-gold` | Gold tip / highlight |
| `.s-caps` | Capabilities grid |
| `.s-3col` | Three equal columns |
| `.s-base` | Bare base class for fully bespoke layouts (keeps canvas/orb animations) |
| `.s-transition` | Between-chapter transition |
| `.s-outro` | Closing slide |

---

## Design tokens (CSS vars)
```css
--bg: #05050e          /* global dark */
--violet: #7c3aed      --v-hi: #a855f7     --v-dim: rgba(124,58,237,.08)
--cyan: #06b6d4        --c-hi: #22d3ee     --c-dim: rgba(6,182,212,.08)
--amber: #f59e0b       --a-hi: #fcd34d
--rose: #f43f5e        --emerald: #10b981
--grad: linear-gradient(90deg,#7c3aed,#06b6d4)
--grad-gold: linear-gradient(90deg,#f59e0b,#fcd34d)
--grad-fire: linear-gradient(90deg,#f43f5e,#f59e0b)
--font: 'Heebo' (Hebrew-first)
--mono: 'JetBrains Mono'
```

---

## Media (video/image) — aspect ratio system

**NEVER use `object-fit:contain`** on video/image — it causes black bars. Use the aspect-ratio class system:

```html
<!-- 16:9 landscape video (Kling, Veo, screen recordings) -->
<video class="v-169" src="..." autoplay muted loop playsinline></video>

<!-- 9:16 portrait video (TikTok, Stories, Reels) -->
<video class="v-916" src="..." autoplay muted loop playsinline></video>

<!-- Square video -->
<video class="v-11" src="..." autoplay muted loop playsinline></video>

<!-- 4:3 video -->
<video class="v-43" src="..." autoplay muted loop playsinline></video>
```

**NEVER add `background:#000` inline to `.s-video-pane`** — the CSS already makes it transparent + flex-centered.

### Adjusting column ratios
Use CSS custom properties inline, not `style="grid-template-columns:..."`:
```html
<!-- More space for 16:9 video -->
<section class="s-video" style="--v-cols:30% 70%">

<!-- Portrait video needs less space -->
<section class="s-video video-portrait">  <!-- uses --v-cols:62% 38% automatically -->

<!-- Custom split ratio on s-split -->
<section class="s-split" style="--s-cols:35% 65%">
```

---

## Visual components

### feat-card (glassmorphism card)
```html
<!-- Colors: default=violet, .c=cyan, .a=amber, .r=rose, .e=emerald -->
<!-- Custom gradient top: style="--feat-top:linear-gradient(90deg,#10b981,#06b6d4)" -->
<div class="feat-card c fragment" style="animation-delay:.05s">
  <span class="fc-icon">🎙️</span>
  <div class="fc-title">כותרת</div>
  <div class="fc-desc">תיאור קצר עם <strong>הדגשה</strong> אפשרית.</div>
</div>
```
Use feat-cards instead of plain `.tblock` for 4-item grids in `.s-text` slides.

### waveform-wrap (SVG animated waveform)
```html
<!-- Default color = cyan gradient. Add .amber for amber. -->
<div class="waveform-wrap">
  <svg viewBox="0 0 400 48" preserveAspectRatio="none">
    <polyline points="0,24 20,10 35,36 50,14 65,30 80,8 95,38 ..."/>
  </svg>
</div>
```
Use as decorative element above feat-cards on ElevenLabs/Suno slides.

### stat-block
```html
<div class="stat-block">
  <div class="stat-num">94%</div>        <!-- .v=violet, .c=cyan -->
  <div class="stat-label">שביעות רצון</div>
</div>
```

### timeline
```html
<div class="timeline">
  <div class="tl-item">
    <div class="tl-dot">01</div>           <!-- .c=cyan, .a=amber -->
    <div class="tl-content">
      <div class="tl-title">שלב</div>
      <div class="tl-desc">תיאור</div>
    </div>
  </div>
</div>
```

### SVG icons
Icons available: `ic-camera` `ic-mic` `ic-music` `ic-scissors` `ic-brain` `ic-sparkle` `ic-wand` `ic-gem` `ic-person` `ic-play` `ic-star`
```html
<!-- .w = stroke (wireframe). Color: default=violet, .c=cyan, .a=amber -->
<svg class="vi w c" viewBox="0 0 24 24"><use href="#ic-mic"/></svg>
```

---

## 3-level layout flexibility

### Level 1 — Template class (80% of slides)
Use as-is from `template.html`. No inline CSS needed.

### Level 2 — Modifier / CSS var override (15% of slides)
```html
<section class="s-video video-portrait" style="--v-cols:65% 35%">
```
Available modifiers: `.video-portrait` `.video-wide` `.split-overlap` `.content-center` `.no-gap`

### Level 3 — Bespoke (5% of slides — "wow" moments)
**Always** keep a base section class for canvas/orb animations:
```html
<section class="s-gold" data-transition="convex">
  <div class="s-gold-glow-bg"></div>
  <!-- custom absolute-position layout inside -->
  <div style="position:absolute;inset:0;display:grid;grid-template-columns:auto 1fr auto;...">
    ...
  </div>
</section>
```
Never start with a `<section>` that has no class — you'll lose all background animations.

---

## fal.ai image generation

```bash
npm install          # installs @fal-ai/client
npm run gen          # generates ambient backgrounds, skips existing files
# or: node --env-file=.env generate-images.js
```

**ONLY generate ambient/atmospheric images** — never generate demo-specific slides or output examples from the tools themselves.

Edit `AMBIENT` object in `generate-images.js` to add new entries:
```js
'filename.png': {
  prompt: '...',
  model: 'fal-ai/flux/schnell',   // or fal-ai/flux/dev for higher quality
  size: 'landscape_16_9',
}
```
Background removal via `fal-ai/bria/rmbg` is available in `WITH_RMBG` object.

---

## Key behaviors

- **RTL Hebrew** — `<html dir="rtl">`, Reveal.js `rtl:true` (LEFT arrow = next)
- **Click to advance** — click anywhere on slide advances; excludes buttons, links, `[data-no-advance]`
- **Gender toggle** — interactive "AI זכר/נקבה?" slide; sets `data-ai-g` on body, `.g-m`/`.g-f` classes show/hide gendered text
- **Chapter-aware canvas** — `window.setBgPalette(key)` shifts canvas colors per chapter; `applyChapterBg(key)` transitions the tint overlay
- **Demo placeholders** — `<div class="demo-placeholder" data-file="..." data-type="video|image|audio">` auto-load when files exist in `assets/demos/`
- **Capabilities grid** — each cap-item has `data-goto="section-id"` for direct chapter navigation

---

## Git workflow

**Always commit, merge to `main`, AND push to GitHub** after every change.

```bash
git add index.html          # (or whichever files changed)
git commit -m "..."
# if working in a worktree:
cd "C:\Users\ori\OneDrive - 42 - ארבעים ושתיים\שולחן העבודה\AI PRESENTATION"
git merge <branch>
git push
```

---

## Design principles

1. **Premium always** — dark cinematic aesthetic, violet/cyan/amber palette, no flat/boring layouts
2. **No static slides** — every slide must have at least one animated element (orb, canvas, conic gradient, rings, scanline, float animation)
3. **Transparent slide backgrounds** — slides are transparent; the global canvas provides atmosphere. Never add opaque `background` to `<section>` — creates a "box" effect against letterbox areas
4. **Hebrew-first copy** — all user-facing text is Hebrew. Keep RTL direction. Technical labels (tool names, code) stay in English
5. **Funny and warm tone** — 42 Creative is a creative Israeli agency. The tone is smart, a bit irreverent, and human — not corporate
6. **No generic AI aesthetics** — avoid the "purple gradient on white" look. This presentation lives in a rich dark universe
7. **feat-cards over tblocks** — when a slide has 4 feature/benefit items, always use `.feat-card` grid instead of `.tblock` — glassmorphism looks far better
8. **Exact user text** — never generate or rewrite slide copy unless explicitly asked. Use the user's exact words.

---

## Content reference

`SLIDES.md` — authoritative content document with all slide titles, body copy, and demo markers
`מידע.md` — deep-dive reference on all 7 AI tools (capabilities, settings, gold tips, April 2026)
`template.html` — 19 layout type examples with Hebrew comments, copy-paste ready

When updating content, prefer editing `SLIDES.md` first, then syncing to HTML.
