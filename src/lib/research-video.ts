/** Load nearby previews once, and play only visible videos the visitor has
 *  not paused. One not-yet-buffered video holds the connection at a time so a
 *  slow link never splits bandwidth across clips; fully buffered loops and
 *  visitor-started plays are exempt and always allowed. */
export function initializeResearchVideos() {
  const videos = [
    ...document.querySelectorAll<HTMLVideoElement>('video[data-preview-video]'),
  ];
  const states = new Map(
    videos.map((video) => [
      video,
      {
        visible: false,
        userPaused: false,
        manualPlay: false,
        automaticPauseEvents: 0,
        playPending: false,
        revision: 0,
      },
    ]),
  );

  function load(video: HTMLVideoElement) {
    if (video.hasAttribute('src')) return;
    video.preload = 'metadata';
    video.src = video.dataset.src!;
    video.load();
  }

  function pause(video: HTMLVideoElement) {
    if (video.paused) return;
    states.get(video)!.automaticPauseEvents++;
    video.pause();
  }

  function wants(video: HTMLVideoElement) {
    const state = states.get(video)!;
    return state.visible && !document.hidden && !state.userPaused;
  }

  /** Once the loop plays entirely from buffer it needs no more bandwidth. */
  function fullyBuffered(video: HTMLVideoElement) {
    const { duration } = video;
    if (!isFinite(duration) || duration <= 0) return false;
    const { buffered } = video;
    return (
      buffered.length > 0 && buffered.end(buffered.length - 1) >= duration - 0.25
    );
  }

  function exempt(video: HTMLVideoElement) {
    const state = states.get(video)!;
    return state.manualPlay || fullyBuffered(video);
  }

  function visibleFraction(video: HTMLVideoElement) {
    const rect = video.getBoundingClientRect();
    if (rect.height <= 0) return 0;
    const overlap =
      Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0);
    return Math.max(0, Math.min(1, overlap / rect.height));
  }

  /** The video the visitor is currently looking at most. Ties in visibility
   *  (side-by-side clips share a row) resolve to the earlier card, never to
   *  sub-pixel layout noise. */
  function slotHolder(): HTMLVideoElement | null {
    let holder: HTMLVideoElement | null = null;
    let best = -1;
    for (const video of videos) {
      if (!wants(video) || exempt(video)) continue;
      const bucket = Math.round(visibleFraction(video) * 20);
      const key = bucket * 1000 - videos.indexOf(video);
      if (key > best) {
        best = key;
        holder = video;
      }
    }
    return holder;
  }

  function synchronize(video: HTMLVideoElement) {
    const state = states.get(video)!;
    const revision = ++state.revision;
    if (!wants(video)) {
      pause(video);
      return;
    }
    load(video);
    if (!video.paused || state.playPending) return;
    if (!exempt(video) && video !== holder) {
      // Another clip owns the connection; keep this one at its poster frame.
      pause(video);
      return;
    }
    state.playPending = true;
    // Browser policy may block autoplay. Keep native controls usable and avoid
    // retry loops; the next visibility change or user action may allow playback.
    video
      .play()
      .catch(() => {})
      .finally(() => {
        state.playPending = false;
        // Scrolling back while an earlier play() is being aborted must not
        // leave a visible video stuck until the next observer notification.
        if (state.revision !== revision) synchronize(video);
      });
  }

  let holder: HTMLVideoElement | null = null;
  function updateAll() {
    holder = slotHolder();
    for (const video of videos) synchronize(video);
  }

  for (const video of videos) {
    const state = states.get(video)!;
    video.addEventListener('pause', () => {
      if (state.automaticPauseEvents) {
        state.automaticPauseEvents--;
      } else if (!video.ended && state.visible && !document.hidden) {
        state.userPaused = true;
        state.manualPlay = false;
      }
      updateAll();
    });
    video.addEventListener('play', () => {
      // A play we did not request means the visitor used the controls.
      if (!state.playPending) {
        state.manualPlay = true;
        // Only the visitor's own play lifts their pause; a stale queued
        // play() resolving late must not resurrect a paused clip.
        state.userPaused = false;
      }
      if (!wants(video)) {
        pause(video);
        return;
      }
      updateAll();
    });
    // Buffer growth can free the connection for the next clip.
    video.addEventListener('progress', updateAll);
    video.addEventListener('loadedmetadata', updateAll);
    video.addEventListener('durationchange', updateAll);
  }

  if ('IntersectionObserver' in window) {
    const nearby = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          load(entry.target as HTMLVideoElement);
          nearby.unobserve(entry.target);
        }
      },
      { rootMargin: '200px 0px' },
    );
    const visible = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          states.get(video)!.visible =
            entry.isIntersecting && entry.intersectionRatio > 0;
        }
        updateAll();
      },
      { threshold: [0, 0.01] },
    );
    for (const video of videos) {
      nearby.observe(video);
      visible.observe(video);
    }
  } else {
    // Older browsers retain the original automatic playback behavior.
    for (const video of videos) {
      states.get(video)!.visible = true;
    }
    updateAll();
  }
  document.addEventListener('visibilitychange', updateAll);

  // Priority follows what the visitor actually sees, so recompute on scroll.
  let scheduled = false;
  function onScroll() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      updateAll();
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
}
