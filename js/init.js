// ============================================================
// init.js — AI Workshop | 42 Creative
// Reveal.js initialization + navigation + media logic
// ============================================================

Reveal.initialize({
  // Layout
  width:        1920,
  height:       1080,
  margin:       0,
  minScale:     0.1,
  maxScale:     2.5,

  // Navigation — rtl:true so LEFT arrow = next (Hebrew reading direction)
  hash:         true,
  history:      true,
  keyboard:     true,
  touch:        true,
  loop:         false,
  rtl:          true,

  // Controls & display
  controls:         true,
  controlsLayout:   'bottom-right',
  progress:         true,
  slideNumber:      'c/t',
  showSlideNumber:  'all',

  // Transitions
  transition:           'slide',
  transitionSpeed:      'default',
  backgroundTransition: 'fade',

  // Auto-animate between slides with matching data-auto-animate
  autoAnimate:         true,
  autoAnimateDuration: 0.5,
  autoAnimateEasing:   'ease',

  // Markdown config (kept for compatibility)
  markdown: {
    smartypants: true,
  },

  // Plugins
  plugins: [RevealMarkdown, RevealHighlight, RevealNotes],
});

// ============================================================
// Click to advance — left-click on slide body advances forward
// Excludes interactive elements: links, buttons, video, audio,
// agenda items, inputs, and any element with data-no-advance
// ============================================================

Reveal.on('ready', () => {
  const revealEl = document.querySelector('.reveal');

  revealEl.addEventListener('click', (e) => {
    // Walk up the DOM to see if any ancestor is interactive
    let target = e.target;
    while (target && target !== revealEl) {
      const tag = target.tagName.toLowerCase();
      if (
        tag === 'a'        ||
        tag === 'button'   ||
        tag === 'video'    ||
        tag === 'audio'    ||
        tag === 'input'    ||
        tag === 'select'   ||
        tag === 'textarea' ||
        target.classList.contains('agenda-item') ||
        target.getAttribute('data-no-advance') === 'true'
      ) {
        return; // Let the element handle its own click
      }
      target = target.parentElement;
    }

    Reveal.next();
  });

  // Process demo placeholders (try to load real media)
  processDemoPlaceholders();

  // Set up agenda item navigation
  setupAgendaNav();

  // Fix code block direction
  fixCodeBlocks();

  // A. Background preload all videos after first slide renders
  setTimeout(prefetchAllVideos, 600);

  // B. Hover-only controls + click-to-play for all videos
  setupVideoInteractions();

  // C. Left-arrow triggers play on unstarted demo videos
  setupDemoVideoArrowPlay();
});

Reveal.on('slidechanged', (event) => {
  handleSlideMedia(event.currentSlide, event.previousSlide);
});

// Play fragment videos — checks both the fragment element itself and children
Reveal.on('fragmentshown', (event) => {
  const vid = event.fragment.classList.contains('s32-vid-frag')
    ? event.fragment
    : event.fragment.querySelector('.s32-vid-frag');
  if (vid) { vid.currentTime = 0; vid.play().catch(() => {}); }

  // Generic play-trigger: <div class="fragment vid-play-frag" data-vid-id="some-id">
  if (event.fragment.classList.contains('vid-play-frag')) {
    const target = document.getElementById(event.fragment.getAttribute('data-vid-id'));
    if (target) { target.currentTime = 0; target.play().catch(() => {}); }
  }
});

Reveal.on('fragmenthidden', (event) => {
  const vid = event.fragment.classList.contains('s32-vid-frag')
    ? event.fragment
    : event.fragment.querySelector('.s32-vid-frag');
  if (vid) { vid.pause(); vid.currentTime = 0; }

  // Generic play-trigger: pause when stepping back
  if (event.fragment.classList.contains('vid-play-frag')) {
    const target = document.getElementById(event.fragment.getAttribute('data-vid-id'));
    if (target) { target.pause(); target.currentTime = 0; }
  }
});

// ============================================================
// A. prefetchAllVideos()
// After first slide loads, set preload=auto on all videos and
// inject <link rel="prefetch"> for each unique src so the
// browser downloads them in the background while the presenter
// is still on the early slides.
// ============================================================

function prefetchAllVideos() {
  const seen = new Set();
  document.querySelectorAll('.reveal video[src]').forEach(video => {
    const src = video.getAttribute('src');
    if (!src) return;

    // Ensure each video element itself tries to buffer
    if (video.preload !== 'auto') video.preload = 'auto';

    // One prefetch link per unique URL
    if (seen.has(src)) return;
    seen.add(src);

    const link = document.createElement('link');
    link.rel  = 'prefetch';
    link.as   = 'video';
    link.href = src;
    document.head.appendChild(link);
  });
}

// ============================================================
// B. setupVideoInteractions()
// - All videos: show native controls only on mouse-hover
// - Non-loop demo videos: click the video body plays/pauses
// ============================================================

function setupVideoInteractions() {
  document.querySelectorAll('.reveal .slides video').forEach(video => {
    // Videos with data-no-advance keep controls always visible (full-bleed demo)
    if (video.closest('[data-no-advance]') || video.getAttribute('data-no-advance') !== null) return;

    // Remove controls — hidden by default
    video.removeAttribute('controls');
    video.setAttribute('tabindex', '-1');

    // Reveal controls on hover
    video.addEventListener('mouseenter', () => video.setAttribute('controls', ''));
    video.addEventListener('mouseleave', () => video.removeAttribute('controls'));

    // Click plays/pauses — only for non-autoplay (demo) videos
    const isLoop = video.hasAttribute('autoplay') || video.hasAttribute('data-autoplay');
    if (!isLoop) {
      video.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.paused) video.play().catch(() => {});
        else video.pause();
      });
    }
  });
}

// ============================================================
// C. setupDemoVideoArrowPlay()
// In RTL mode, ArrowLeft = Reveal.next(). Intercept in capture
// phase: if the current slide has a visible, unstarted demo
// video, play it instead of advancing — same UX as slide 39.
// Slides using the vid-play-frag fragment system are excluded
// so their own fragment logic runs uninterrupted.
// ============================================================

function setupDemoVideoArrowPlay() {
  document.addEventListener('keydown', (e) => {
    // ArrowLeft = next in RTL
    if (e.key !== 'ArrowLeft') return;

    const currentSlide = Reveal.getCurrentSlide();
    if (!currentSlide) return;

    // Slides that use vid-play-frag handle their own playback via fragments
    if (currentSlide.querySelector('.vid-play-frag')) return;

    // Find the first visible, unstarted, non-loop demo video
    const videos = currentSlide.querySelectorAll(
      'video:not([autoplay]):not([data-autoplay])'
    );

    for (const v of videos) {
      // Skip videos without metadata (broken src, not yet loaded)
      if (v.readyState < 1) continue;
      // Skip already-started videos
      if (!v.paused || v.currentTime > 0) continue;
      // Skip if hidden inside an unrevealed fragment
      const frag = v.closest('.fragment');
      if (frag && !frag.classList.contains('visible') && !frag.classList.contains('current-fragment')) continue;

      // Play the video and consume the arrow keypress
      e.stopPropagation();
      e.preventDefault();
      v.play().catch(() => {});
      return;
    }

    // No unstarted video found — Reveal handles navigation as normal
  }, true /* capture phase */);
}

// ============================================================
// setupAgendaNav()
// Agenda items with data-goto="section-id" jump to that slide
// ============================================================

function setupAgendaNav() {
  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation(); // don't trigger slide advance
      const targetId = el.getAttribute('data-goto');
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      // Find the index of this section in the flat slide list
      const allSections = [...document.querySelectorAll('.reveal .slides > section')];
      const idx = allSections.indexOf(targetEl);
      if (idx !== -1) {
        Reveal.slide(idx);
      }
    });
  });
}

// ============================================================
// processDemoPlaceholders()
// ============================================================

function processDemoPlaceholders() {
  const placeholders = document.querySelectorAll('.demo-placeholder');

  placeholders.forEach(placeholder => {
    const file  = placeholder.getAttribute('data-file');
    const type  = placeholder.getAttribute('data-type');
    const label = placeholder.getAttribute('data-label') || file;

    if (!file || !type) return;

    if (type === 'image')      tryLoadImage(placeholder, file, label);
    else if (type === 'video') tryLoadVideo(placeholder, file, label);
    else if (type === 'audio') tryLoadAudio(placeholder, file, label);
  });
}

function tryLoadImage(container, src, label) {
  const img = new Image();
  img.src = src;
  img.alt = label;
  img.onload = () => {
    container.classList.add('has-media');
    container.innerHTML = '';
    container.appendChild(img);
  };
}

function tryLoadVideo(container, src, label) {
  fetch(src, { method: 'HEAD' })
    .then(res => {
      if (!res.ok) return;
      const video = document.createElement('video');
      video.src = src;
      video.preload = 'auto';
      video.style.maxHeight = '52vh';
      video.setAttribute('aria-label', label);
      video.setAttribute('tabindex', '-1');
      // Hover controls for placeholder-loaded videos
      video.addEventListener('mouseenter', () => video.setAttribute('controls', ''));
      video.addEventListener('mouseleave', () => video.removeAttribute('controls'));
      video.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.paused) video.play().catch(() => {});
        else video.pause();
      });
      container.classList.add('has-media');
      container.innerHTML = '';
      container.appendChild(video);
    })
    .catch(() => {});
}

function tryLoadAudio(container, src, label) {
  fetch(src, { method: 'HEAD' })
    .then(res => {
      if (!res.ok) return;

      container.classList.add('has-media');
      container.innerHTML = '';

      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:14px;width:100%;';

      const labelEl = document.createElement('p');
      labelEl.textContent = label;
      labelEl.style.cssText = 'font-size:0.58em;color:#9898b8;margin:0;';

      const audio = document.createElement('audio');
      audio.src = src;
      audio.controls = true;
      audio.style.cssText = 'width:100%;max-width:500px;';

      wrapper.appendChild(labelEl);
      wrapper.appendChild(audio);
      container.appendChild(wrapper);
    })
    .catch(() => {});
}

// ============================================================
// handleSlideMedia()
// Pause media on exit, autoplay on enter if flagged
// ============================================================

function handleSlideMedia(currentSlide, previousSlide) {
  if (previousSlide) {
    previousSlide.querySelectorAll('video, audio').forEach(m => m.pause());
  }
  if (currentSlide) {
    currentSlide.querySelectorAll('video[data-autoplay], audio[data-autoplay]').forEach(m => {
      m.play().catch(() => {});
    });
  }
}

// ============================================================
// fixCodeBlocks()
// Ensure all pre/code are LTR
// ============================================================

function fixCodeBlocks() {
  document.querySelectorAll('.reveal pre, .reveal pre code').forEach(el => {
    el.style.direction  = 'ltr';
    el.style.textAlign  = 'left';
    el.style.unicodeBidi = 'isolate';
  });
}
