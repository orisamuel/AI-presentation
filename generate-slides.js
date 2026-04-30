// One-off image generator for specific slides
// Usage: node --env-file=.env generate-slides.js
import { fal } from '@fal-ai/client';

fal.config({ credentials: process.env.FAL_KEY });

const IMAGES = {
  // S77: What Kling AI produced from the Shot 01 prompt (hotel infinity pool → ocean)
  'assets/demos/s-77-output.png': {
    prompt: 'Cinematic ultra-wide establishing shot, luxury Mediterranean seaside resort, infinity pool visually merging with turquoise ocean on the horizon, golden hour warm sunlight, soft water reflections, elegant lounge chairs on polished stone deck, no people, premium travel commercial aesthetic, photorealistic, sharp, 8k',
    model: 'fal-ai/flux/dev',
    size: 'landscape_16_9',
  },
  // S83: Code / AI → product idea visual (phone showing a fun microsite)
  'assets/demos/s-83-idea.png': {
    prompt: 'Person holding a modern smartphone with both hands, phone screen shows a bright colorful fun web app with playful UI elements, dark studio background, soft purple and cyan bokeh background lights, product photography style, cinematic depth of field, warm hands, professional quality',
    model: 'fal-ai/flux/dev',
    size: 'landscape_16_9',
  },
};

async function generate(path, config) {
  console.log(`\nGenerating: ${path}`);
  const result = await fal.subscribe(config.model, {
    input: {
      prompt: config.prompt,
      image_size: config.size,
      num_inference_steps: 28,
      guidance_scale: 3.5,
      num_images: 1,
      enable_safety_checker: false,
    },
    logs: false,
  });
  const url = result.data.images[0].url;
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  const fs = await import('fs');
  fs.writeFileSync(path, buf);
  console.log(`  ✓ saved (${Math.round(buf.length/1024)}KB)`);
}

for (const [path, cfg] of Object.entries(IMAGES)) {
  await generate(path, cfg);
}
console.log('\nDone.');
