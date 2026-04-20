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

  // Prevent demo videos with controls from stealing keyboard focus (arrows seek video instead of advancing slide)
  revealEl.querySelectorAll('video[controls]').forEach(v => v.setAttribute('tabindex', '-1'));
});

Reveal.on('slidechanged', (event) => {
  handleSlideMedia(event.currentSlide, event.previousSlide);
});

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
      video.controls = true;
      video.preload = 'metadata';
      video.style.maxHeight = '52vh';
      video.setAttribute('aria-label', label);
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
