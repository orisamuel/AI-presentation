# AI PRESENTATION — Claude Guidelines

> **כשעובדים על הפרויקט הזה — אל תשתמש בסקיל הגנרי של slides.** הפרויקט עובד עם Reveal.js, מערכת CSS ייעודית, ועקרונות עיצוב שונים לחלוטין מהתבנית הגנרית.

## Project overview
Full-screen web presentation for **42 Creative's AI Workshop**. Single `index.html` with Reveal.js, Hebrew RTL, ~1920×1080.  
Covers 7 AI tools: Gemini, Kling, Hedra, ElevenLabs, Suno, CapCut, ChatGPT + Bonus (Claude Code).  
**Visual bar is high** — live in front of a creative agency audience.

## Architecture
```
index.html       — entire presentation (~4000+ lines), all CSS inline
js/init.js       — Reveal.js init + click-to-advance + media handling
assets/demos/    — demo media (video/image/audio + ambient bg images)
```
`template.html` exists as an archived reference only — not used in workflow.  
`generate-images.js` + `package.json` — ambient images already generated, not an active workflow.

## Working method
1. **Read** the relevant section of `index.html` to understand context and existing patterns
2. **Edit** inline — insert/replace the specific slide HTML
3. `git add index.html && git commit -m "..." && git push`

Never use `template.html` as the source of truth — read the actual `index.html` for current patterns.

## CSS architecture
All CSS is inline in `index.html`. Slides are **transparent** — never add opaque `background` to `<section>`.  
The global canvas (`#bg-canvas`) + tint overlay (`#bg-tint`) provide atmosphere per chapter.

### Active slide type classes
| Class | Purpose |
|---|---|
| `.s-base` | **Most common** — bespoke layouts, free-form absolute/grid positioning |
| `.s-section` | Chapter title (cinematic, bottom-anchored) |
| `.s-video` | Text + video pane — adjust ratio with `--v-cols` |
| `.s-gold` | Gold tip / highlight moment |
| `.s-statement` | Big bold statement / riddle |
| `.s-text` | Text or feat-card grid |
| `.s-split` | Text + image (`.s-split-tl` / `.s-split-tr` variants) |
| `.s-caps` | Capabilities grid |
| `.s-cover` / `.s-outro` | Opening / closing |

Other classes exist in CSS (s-fullbleed, s-stats, s-gallery, etc.) — effectively unused, avoid.

## Design tokens
```css
--violet:#7c3aed  --v-hi:#a855f7   --cyan:#06b6d4   --c-hi:#22d3ee
--amber:#f59e0b   --a-hi:#fcd34d   --rose:#f43f5e   --emerald:#10b981
--grad: linear-gradient(90deg,#7c3aed,#06b6d4)
--grad-gold: linear-gradient(90deg,#f59e0b,#fcd34d)
--font:'Heebo'  --mono:'JetBrains Mono'
```

## Media — aspect ratio system
**NEVER `object-fit:contain`** — causes black bars. **NEVER `background:#000` on `.s-video-pane`.**
```html
<video class="v-169" autoplay muted loop playsinline src="...">  <!-- 16:9 landscape -->
<video class="v-916" autoplay muted loop playsinline src="...">  <!-- 9:16 portrait -->
<video class="v-11"  autoplay muted loop playsinline src="...">  <!-- square -->
```

### Column ratios — CSS vars only, not inline grid
```html
<section class="s-video" style="--v-cols:32% 68%">          <!-- wide video (most common) -->
<section class="s-video video-portrait">                     <!-- auto: 62% 38% -->
<section class="s-split" style="--s-cols:35% 65%">
```

## feat-card — prefer over .tblock for feature grids
```html
<div class="feat-card c fragment" style="animation-delay:.05s">
  <span class="fc-icon">🎙️</span>
  <div class="fc-title">כותרת</div>
  <div class="fc-desc">תיאור עם <strong>הדגשה</strong>.</div>
</div>
<!-- Colors: default=violet, .c=cyan, .a=amber, .r=rose, .e=emerald -->
```

## Bespoke layouts (s-base / s-gold)
Always keep a base section class. Use `position:absolute;inset:0` for custom layout:
```html
<section class="s-base" data-transition="convex">
  <div style="position:absolute;inset:0;display:grid;...">...</div>
</section>
```
Never `<section>` with no class — loses canvas/orb animations.

## data-transition conventions
- `zoom` + `fast` — chapter entries (s-section)
- `slide` + `fast` — standard tool demo slides
- `convex` — bespoke "wow" moments

## Key behaviors
- **RTL Hebrew** — LEFT arrow = next
- **Click to advance** — excludes buttons, links, `[data-no-advance]`
- **Gender toggle** — `data-ai-g` on body; `.g-m`/`.g-f` show/hide gendered text
- **Chapter canvas** — `window.setBgPalette(key)` / `applyChapterBg(key)`
- **Demo placeholders** — `<div class="demo-placeholder" data-file="..." data-type="video|image|audio">`

## Git workflow
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
