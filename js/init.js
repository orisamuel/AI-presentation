// ============================================================
// init.js — AI Workshop | 42 Creative
// Reveal.js initialization + demo placeholder logic
// ============================================================

Reveal.initialize({
  // Layout
  width:        1920,
  height:       1080,
  margin:       0.06,
  minScale:     0.15,
  maxScale:     2.5,

  // Navigation
  hash:         true,
  history:      true,
  keyboard:     true,
  touch:        true,
  loop:         false,
  rtl:          true,   // Right-to-left slide order for Hebrew

  // Controls & display
  controls:         true,
  controlsLayout:   'bottom-right',
  progress:         true,
  slideNumber:      'c/t',
  showSlideNumber:  'all',

  // Transitions
  transition:           'fade',
  transitionSpeed:      'default',
  backgroundTransition: 'fade',

  // Auto-animate
  autoAnimate:      true,
  autoAnimateDuration: 0.6,
  autoAnimateEasing: 'ease',

  // Markdown config
  markdown: {
    smartypants: true,
  },

  // Plugins
  plugins: [RevealMarkdown, RevealHighlight, RevealNotes],
});

// ============================================================
// Post-init: Process demo placeholders
// ============================================================

Reveal.on('ready', () => {
  processDemoPlaceholders();
  addSlideClasses();
});

Reveal.on('slidechanged', (event) => {
  handleSlideMedia(event.currentSlide, event.previousSlide);
});

// ============================================================
// processDemoPlaceholders()
// Scans all .demo-placeholder elements and tries to load
// the actual media file. If it fails, keeps the placeholder UI.
// ============================================================

function processDemoPlaceholders() {
  const placeholders = document.querySelectorAll('.demo-placeholder');

  placeholders.forEach(placeholder => {
    const file    = placeholder.getAttribute('data-file');
    const type    = placeholder.getAttribute('data-type');
    const label   = placeholder.getAttribute('data-label') || file;

    if (!file || !type) return;

    if (type === 'image') {
      tryLoadImage(placeholder, file, label);
    } else if (type === 'video') {
      tryLoadVideo(placeholder, file, label);
    } else if (type === 'audio') {
      tryLoadAudio(placeholder, file, label);
    }
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
  // On error: keep the placeholder UI as-is
}

function tryLoadVideo(container, src, label) {
  const video = document.createElement('video');
  video.src = src;
  video.controls = true;
  video.preload = 'metadata';
  video.setAttribute('aria-label', label);

  video.addEventListener('canloadmetadata', () => {
    container.classList.add('has-media');
    container.innerHTML = '';
    container.appendChild(video);
  });

  // Use fetch to check if file exists without preloading the whole video
  fetch(src, { method: 'HEAD' })
    .then(res => {
      if (res.ok) {
        container.classList.add('has-media');
        container.innerHTML = '';
        video.controls = true;
        video.style.maxHeight = '55vh';
        container.appendChild(video);
      }
    })
    .catch(() => {
      // File not found — keep placeholder
    });
}

function tryLoadAudio(container, src, label) {
  fetch(src, { method: 'HEAD' })
    .then(res => {
      if (res.ok) {
        container.classList.add('has-media');
        container.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:16px;width:100%;';

        const labelEl = document.createElement('p');
        labelEl.textContent = label;
        labelEl.style.cssText = 'font-size:0.6em;color:#9898b8;margin:0;';

        const audio = document.createElement('audio');
        audio.src = src;
        audio.controls = true;
        audio.style.width = '100%';
        audio.style.maxWidth = '500px';

        wrapper.appendChild(labelEl);
        wrapper.appendChild(audio);
        container.appendChild(wrapper);
      }
    })
    .catch(() => {
      // Keep placeholder
    });
}

// ============================================================
// addSlideClasses()
// Applies CSS classes from <!-- .slide: class="..." --> comments
// Reveal.js Markdown plugin handles this natively via the
// {.class} syntax — this is a fallback for comment-style directives
// ============================================================

function addSlideClasses() {
  // Reveal.js already processes <!-- .slide: --> directives natively
  // This function is kept for any manual overrides needed
  const slides = document.querySelectorAll('.reveal section');
  slides.forEach(slide => {
    // Ensure code blocks inside slides get LTR direction
    slide.querySelectorAll('pre, code').forEach(el => {
      el.style.direction = 'ltr';
      el.style.textAlign = 'left';
    });
  });
}

// ============================================================
// handleSlideMedia()
// Pauses media on slide exit, plays on slide enter
// ============================================================

function handleSlideMedia(currentSlide, previousSlide) {
  // Pause all media in the previous slide
  if (previousSlide) {
    previousSlide.querySelectorAll('video, audio').forEach(media => {
      media.pause();
    });
  }

  // Auto-play video in current slide if it has autoplay attribute
  if (currentSlide) {
    currentSlide.querySelectorAll('video[data-autoplay]').forEach(video => {
      video.play().catch(() => {});
    });
  }
}
