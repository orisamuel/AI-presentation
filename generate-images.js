// generate-images.js — fal.ai asset generation for AI Presentation
// Usage: node --env-file=../.env generate-images.js
// Or from project root: node --env-file=.env generate-images.js

import * as fal from '@fal-ai/client';
import fs from 'fs';
import path from 'path';

const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) {
  console.error('❌  FAL_KEY not found — run: node --env-file=.env generate-images.js');
  process.exit(1);
}

fal.config({ credentials: FAL_KEY });

const DEMOS_DIR = path.join(import.meta.dirname ?? '.', 'assets', 'demos');
if (!fs.existsSync(DEMOS_DIR)) fs.mkdirSync(DEMOS_DIR, { recursive: true });

// ─────────────────────────────────────────────────────────────────────────────
// AMBIENT / ATMOSPHERIC backgrounds — NOT specific demo output images
// Add new entries here. Key = filename, value = config object.
// ─────────────────────────────────────────────────────────────────────────────
const AMBIENT = {

  // Chapter backgrounds — cinematic dark, matching palette
  'ch-gemini-bg.png': {
    prompt: 'cinematic dark AI visualization, glowing violet cyan neural network pathways, abstract, ultra HD, 16:9, no text, no logo',
    model: 'fal-ai/flux/schnell',
    size:  'landscape_16_9',
  },
  'ch-kling-bg.png': {
    prompt: 'cinematic camera lens with glowing AI neural network inside, dark dramatic lighting, violet bokeh, film grain aesthetic, 16:9, no text',
    model: 'fal-ai/flux/schnell',
    size:  'landscape_16_9',
  },
  'ch-hedra-bg.png': {
    prompt: 'photorealistic human face dissolving into glowing pixels and particles, dark dramatic lighting, violet blue, 16:9, no text',
    model: 'fal-ai/flux/dev',
    size:  'landscape_16_9',
  },
  'ch-eleven-bg.png': {
    prompt: 'glowing audio waveform in dark space, violet cyan gradient waves, studio microphone silhouette, 16:9, ultra HD, no text',
    model: 'fal-ai/flux/schnell',
    size:  'landscape_16_9',
  },
  'ch-suno-bg.png': {
    prompt: 'musical notes as glowing neurons and neural connections, dark cinematic background, violet amber gradient, 16:9, no text',
    model: 'fal-ai/flux/schnell',
    size:  'landscape_16_9',
  },
  'ch-capcut-bg.png': {
    prompt: 'video editing timeline floating in dark space, glowing film frames, cyan light trails, 16:9, cinematic, no text',
    model: 'fal-ai/flux/schnell',
    size:  'landscape_16_9',
  },
  'ch-chatgpt-bg.png': {
    prompt: 'abstract AI reasoning visualization, dark background, glowing thought bubbles and connections, violet white, 16:9, no text',
    model: 'fal-ai/flux/schnell',
    size:  'landscape_16_9',
  },

  // Decorative / ambient for specific slides
  'ambient-ai-brain.png': {
    prompt: 'human brain made of glowing neural circuits, dark space background, violet cyan gradient, ultra HD, 16:9, no text',
    model: 'fal-ai/flux/schnell',
    size:  'landscape_16_9',
  },
  'ambient-sound-wave.png': {
    prompt: 'sound wave visualization, glowing audio spectrum, dark background, cyan violet gradient bars, abstract, 16:9',
    model: 'fal-ai/flux/schnell',
    size:  'landscape_16_9',
  },
  'ambient-music-notes.png': {
    prompt: 'floating musical notes made of light, dark cinematic background, amber gold gradient glow, abstract, 16:9, no text',
    model: 'fal-ai/flux/schnell',
    size:  'landscape_16_9',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// IMAGES WITH BACKGROUND REMOVAL
// Useful for logos, icons, or elements to composite over slides
// ─────────────────────────────────────────────────────────────────────────────
const WITH_RMBG = {
  // Add entries here when you need a clean PNG without background:
  // 'filename.png': { prompt: '...', size: 'square_hd' }
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(buffer));
}

function shouldSkip(filename) {
  const dest = path.join(DEMOS_DIR, filename);
  if (fs.existsSync(dest)) {
    console.log(`  ⏭  skip (exists): ${filename}`);
    return true;
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERATION FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────
async function generateAmbient() {
  console.log('\n🎨  Generating ambient backgrounds...\n');
  for (const [filename, cfg] of Object.entries(AMBIENT)) {
    if (shouldSkip(filename)) continue;
    try {
      console.log(`  ⟳  ${filename}`);
      const result = await fal.subscribe(cfg.model, {
        input: {
          prompt:               cfg.prompt,
          image_size:           cfg.size,
          num_images:           1,
          num_inference_steps:  cfg.model.includes('schnell') ? 4 : 28,
          enable_safety_checker: false,
        },
      });
      const url = result.data.images[0].url;
      await downloadFile(url, path.join(DEMOS_DIR, filename));
      console.log(`  ✓  saved: ${filename}`);
    } catch (err) {
      console.error(`  ✗  ${filename}: ${err.message}`);
    }
  }
}

async function generateWithBgRemoval() {
  if (Object.keys(WITH_RMBG).length === 0) return;
  console.log('\n🪄  Generating images with background removal...\n');
  for (const [filename, cfg] of Object.entries(WITH_RMBG)) {
    if (shouldSkip(filename)) continue;
    try {
      console.log(`  ⟳  ${filename} (generate + rmbg)`);

      // Step 1: Generate image
      const genResult = await fal.subscribe('fal-ai/flux/schnell', {
        input: {
          prompt: cfg.prompt,
          image_size: cfg.size ?? 'square_hd',
          num_images: 1,
          num_inference_steps: 4,
          enable_safety_checker: false,
        },
      });
      const genUrl = genResult.data.images[0].url;

      // Step 2: Remove background
      const rmbgResult = await fal.subscribe('fal-ai/bria/rmbg', {
        input: { image_url: genUrl },
      });
      const finalUrl = rmbgResult.data.image.url;

      await downloadFile(finalUrl, path.join(DEMOS_DIR, filename));
      console.log(`  ✓  saved (bg removed): ${filename}`);
    } catch (err) {
      console.error(`  ✗  ${filename}: ${err.message}`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
console.log('🚀  fal.ai Asset Generator — AI Presentation');
console.log(`📁  Output: ${DEMOS_DIR}\n`);

await generateAmbient();
await generateWithBgRemoval();

console.log('\n✅  Done!\n');
