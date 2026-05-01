# AI PRESENTATION — Claude Guidelines

## Project overview
Full-screen web presentation for **42 Creative's AI Workshop**. Single `index.html` with Reveal.js, Hebrew RTL. Covers 7 AI tools: Gemini, Kling, Hedra, ElevenLabs, Suno, CapCut, ChatGPT + Bonus (Claude Code). **Visual bar is high** — live in front of a creative agency audience.

## Architecture
```
index.html       — entire presentation, all CSS inline
js/init.js       — Reveal.js init + click-to-advance + media handling
assets/demos/    — demo media (video/image/audio)
template.html    — slide-type templates (copy-paste ready)
generate-images.js — fal.ai ambient image generator (npm run gen)
```

## CSS architecture
All CSS is inline in `index.html`. Slides are **transparent** — never add opaque `background` to `<section>`. The global canvas (`#bg-canvas`) + tint overlay (`#bg-tint`) provide atmosphere.

### Active slide type classes
| Class | Purpose |
|---|---|
| `.s-base` | Bespoke layouts — most-used, free-form absolute positioning |
| `.s-section` | Chapter title (cinematic, bottom-anchored) |
| `.s-video` | Text + video pane — use `--v-cols` to adjust ratio |
| `.s-gold` | Gold tip / highlight |
| `.s-statement` | Big bold statement / riddle |
| `.s-text` | Two-column text or feat-card grid |
| `.s-split` | Text + image (`.s-split-tl` / `.s-split-tr` variants) |
| `.s-caps` | Capabilities grid |
| `.s-cover` / `.s-outro` | Opening / closing |

Other classes exist in CSS (s-fullbleed, s-stats, s-compare, s-gallery, etc.) — rarely used, see template.html.

## Design tokens
```css
--violet:#7c3aed  --v-hi:#a855f7   --cyan:#06b6d4   --c-hi:#22d3ee
--amber:#f59e0b   --a-hi:#fcd34d   --rose:#f43f5e   --emerald:#10b981
--grad: linear-gradient(90deg,#7c3aed,#06b6d4)
--grad-gold: linear-gradient(90deg,#f59e0b,#fcd34d)
--font:'Heebo'  --mono:'JetBrains Mono'
```

## Media — aspect ratio system
**NEVER `object-fit:contain`** — causes black bars.
```html
<video class="v-169" ...>  <!-- 16:9 landscape -->
<video class="v-916" ...>  <!-- 9:16 portrait -->
<video class="v-11"  ...>  <!-- square -->
```
**NEVER `background:#000` on `.s-video-pane`.**

### Column ratios — use CSS vars, not inline grid
```html
<section class="s-video" style="--v-cols:32% 68%">          <!-- wide video -->
<section class="s-video video-portrait">                     <!-- auto: 62% 38% -->
<section class="s-split" style="--s-cols:35% 65%">
```

## Layout levels
- **Level 1** — use template class as-is (most slides)
- **Level 2** — modifier + CSS var: `.video-portrait` `.video-wide` `.split-overlap` `.content-center` `.no-gap`
- **Level 3 (bespoke)** — always keep a base class; use `s-base` or `s-gold` with `position:absolute;inset:0` children. Never `<section>` with no class.

### data-transition conventions
- `slide` + `fast` — standard tool demo slides
- `zoom` + `fast` — chapter entries (s-section)
- `convex` — bespoke "wow" moments (s-gold, s-base hero slides)

## Visual components

### feat-card — use instead of .tblock for 4-item grids
```html
<div class="feat-card c fragment" style="animation-delay:.05s">
  <span class="fc-icon">🎙️</span>
  <div class="fc-title">כותרת</div>
  <div class="fc-desc">תיאור עם <strong>הדגשה</strong>.</div>
</div>
<!-- Colors: default=violet, .c=cyan, .a=amber, .r=rose, .e=emerald -->
```

### Other components (rare — look up in template.html)
- `.waveform-wrap` — SVG animated waveform (ElevenLabs/Suno)
- `.stat-block` → `.stat-num` + `.stat-label`
- `.timeline` → `.tl-item` → `.tl-dot` + `.tl-content`
- SVG icons: `ic-camera ic-mic ic-music ic-scissors ic-brain ic-sparkle ic-wand ic-gem ic-person ic-play ic-star` — `<svg class="vi w c" viewBox="0 0 24 24"><use href="#ic-mic"/></svg>`

## Key behaviors
- **RTL Hebrew** — LEFT arrow = next
- **Click to advance** — click anywhere; excludes buttons, links, `[data-no-advance]`
- **Gender toggle** — `data-ai-g` on body; `.g-m`/`.g-f` show/hide gendered text
- **Chapter canvas** — `window.setBgPalette(key)` / `applyChapterBg(key)`
- **Demo placeholders** — `<div class="demo-placeholder" data-file="..." data-type="video|image|audio">`

## fal.ai image generation
`npm run gen` — ambient/atmospheric images only. Edit `AMBIENT` in `generate-images.js`.

## Git workflow
**Always commit → merge to `main` → push.**
```bash
git add index.html && git commit -m "..." && git push
```

## Design principles
1. **Premium always** — dark cinematic, violet/cyan/amber, no flat layouts
2. **No static slides** — every slide needs animation (orb, canvas, conic, rings, float)
3. **Transparent backgrounds** — never opaque `background` on `<section>`
4. **Hebrew-first** — all copy Hebrew; tool names / code stay English
5. **Funny & warm** — smart, irreverent, human tone (Israeli creative agency)
6. **No generic AI aesthetics** — no "purple gradient on white"
7. **Exact user text** — never rewrite copy unless explicitly asked
