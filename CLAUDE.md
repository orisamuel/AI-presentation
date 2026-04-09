# AI PRESENTATION — Claude Guidelines

## Project overview
A full-screen web presentation for **42 Creative's AI Workshop** — a live session showing employees how to use AI tools. Built as a single `index.html` with Reveal.js, Hebrew RTL, 59 slides, ~1920×1080.

The presentation covers 7 AI tools: Gemini, Kling, Hedra, ElevenLabs, Suno, CapCut, ChatGPT — plus an interactive Bonus section showing how the presentation itself was built with Claude Code.

**Visual bar is high.** This is used live in front of a creative agency audience. Every slide must look premium, polished, and cinematic. "Good enough" is not good enough.

---

## Architecture

```
index.html          — entire presentation (single file, ~1700 lines)
js/init.js          — Reveal.js init + click-to-advance + media handling
css/theme-42.css    — legacy theme file (NOT loaded in HTML — kept for reference)
assets/logo-42.png  — 42 Creative logo
assets/demos/       — placeholder folders for demo media (video/image/audio)
SLIDES.md           — content document: edit here, then sync to HTML
מידע.md             — detailed AI tools reference (Hebrew, April 2026)
template.html       — slide type templates for quick copy-paste
```

---

## CSS architecture

All CSS is **inline in `index.html`** inside a single `<style>` block. No external CSS files are loaded. Key rules:

- `#bg-canvas` (fixed, z-index:-1) — global animated canvas: particles, rotating geometry, drifting nebulae
- `#bg-tint` (fixed, z-index:0) — full-viewport dark overlay, chapter-color transitions, opacity ~0.62
- `.reveal .slides > section { background:transparent !important }` — all slides are transparent so the canvas shows through
- Individual slide classes (`.s-cover`, `.s-section`, `.s-statement`, etc.) add atmospheric children (orbs, conic gradients, rings) but **not** opaque backgrounds
- `enhanceSlideBackgrounds()` JS function auto-injects `.bg-dots` + animated orbs into slides lacking visual elements

### Slide type classes
| Class | Purpose |
|---|---|
| `.s-cover` | Opening cover |
| `.s-section` | Chapter title (cinematic, bottom-anchored) |
| `.s-statement` | Big bold statement / riddle |
| `.s-text` | Two-column text blocks |
| `.s-split` | Text + image side by side |
| `.s-video` | Text + video pane |
| `.s-compare` | Two-column comparison |
| `.s-steps` | Step-by-step process |
| `.s-gallery` | Horizontal scrolling cards |
| `.s-gold` | Gold tip / highlight |
| `.s-caps` | Capabilities grid |
| `.s-transition` | Between-chapter transition |
| `.s-outro` | Closing slide |

---

## Design tokens (CSS vars)
```css
--bg: #05050e          /* global dark */
--violet: #7c3aed      --v-hi: #a855f7
--cyan: #06b6d4        --c-hi: #22d3ee
--amber: #f59e0b       --a-hi: #fcd34d
--rose: #f43f5e        --emerald: #10b981
--grad: linear-gradient(90deg,#7c3aed,#06b6d4)
--font: 'Heebo' (Hebrew-first)
--mono: 'JetBrains Mono'
```

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

**Always commit and merge to `main` directly after every change**, unless explicitly told otherwise.

Standard flow:
```bash
git add index.html          # (or whichever files changed)
git commit -m "..."
# if working in a worktree:
cd "C:\Users\ori\OneDrive - 42 - ארבעים ושתיים\שולחן העבודה\AI PRESENTATION"
git merge <branch>
```

---

## Design principles

1. **Premium always** — dark cinematic aesthetic, violet/cyan/amber palette, no flat/boring layouts
2. **No static slides** — every slide must have at least one animated element (orb, canvas, conic gradient, rings, scanline, float animation)
3. **Transparent slide backgrounds** — slides are transparent; the global canvas provides the atmosphere. Don't add opaque `background` to slide sections — it creates a "box" effect against the letterbox areas
4. **Hebrew-first copy** — all user-facing text is Hebrew. Keep RTL direction. Technical labels (tool names, code) stay in English
5. **Funny and warm tone** — 42 Creative is a creative Israeli agency. The tone is smart, a bit irreverent, and human — not corporate
6. **No generic AI aesthetics** — avoid the "purple gradient on white" look. This presentation lives in a rich dark universe

---

## Content reference

`SLIDES.md` — authoritative content document with all slide titles, body copy, and demo markers  
`מידע.md` — deep-dive reference on all 7 AI tools (capabilities, settings, gold tips, April 2026)

When updating content, prefer editing `SLIDES.md` first, then syncing to HTML.
