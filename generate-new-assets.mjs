// One-off asset generation for new slides
import { fal } from '@fal-ai/client';
import fs from 'fs';
import path from 'path';

const FAL_KEY = process.env.FAL_KEY;
fal.config({ credentials: FAL_KEY });

const DEMOS_DIR = path.join(import.meta.dirname ?? '.', 'assets', 'demos');

async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(buffer));
}

const ASSETS = {
  // New slide 41 — transitions demo with Suzuki cars
  's-41-start.png': {
    prompt: 'photorealistic white Suzuki Swift compact car parked on clean urban street, side profile view, soft daylight, modern city background, professional automotive photography, sharp detail, no people',
    model: 'fal-ai/flux/dev',
    size: 'landscape_16_9',
  },
  's-41-end.png': {
    prompt: 'photorealistic red Suzuki Swift compact car parked on open road in natural landscape, side profile view, golden hour lighting, professional automotive photography, sharp detail, no people',
    model: 'fal-ai/flux/dev',
    size: 'landscape_16_9',
  },
  // Herb quiz images for demo-chaslet.html
  'herb-1.png': {
    prompt: 'extreme close-up macro photograph of fresh green herb leaves, cilantro or parsley ambiguous, isolated on clean white background, professional food photography, sharp detail, top view',
    model: 'fal-ai/flux/dev',
    size: 'square_hd',
  },
  'herb-2.png': {
    prompt: 'close-up macro photograph of flat leaf fresh green herb, parsley or cilantro hard to tell, clean white background, professional food studio photography, top view, sharp detail',
    model: 'fal-ai/flux/dev',
    size: 'square_hd',
  },
  'herb-3.png': {
    prompt: 'macro close-up of fresh cilantro herb leaves on white background, round delicate leaves, professional food photography, isolated, top-down view, ultra sharp',
    model: 'fal-ai/flux/dev',
    size: 'square_hd',
  },
};

console.log('🚀 Generating new assets...\n');
for (const [filename, cfg] of Object.entries(ASSETS)) {
  const dest = path.join(DEMOS_DIR, filename);
  if (fs.existsSync(dest)) { console.log(`  ⏭  skip: ${filename}`); continue; }
  try {
    console.log(`  ⟳  ${filename}...`);
    const result = await fal.subscribe(cfg.model, {
      input: {
        prompt: cfg.prompt,
        image_size: cfg.size,
        num_images: 1,
        num_inference_steps: 28,
        enable_safety_checker: false,
      },
    });
    await downloadFile(result.data.images[0].url, dest);
    console.log(`  ✓  saved: ${filename}`);
  } catch (err) {
    console.error(`  ✗  ${filename}: ${err.message}`);
  }
}
console.log('\n✅ Done!');
