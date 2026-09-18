/** Load nearby previews once, and play only visible videos the visitor has not paused. */
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

  function synchronize(video: HTMLVideoElement) {
    const state = states.get(video)!;
    const revision = ++state.revision;
    if (!state.visible || document.hidden || state.userPaused) {
      pause(video);
      return;
    }
    load(video);
    if (!video.paused || state.playPending) return;
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

  for (const video of videos) {
    const state = states.get(video)!;
    video.addEventListener('pause', () => {
      if (state.automaticPauseEvents) {
        state.automaticPauseEvents--;
      } else if (!video.ended && state.visible && !document.hidden) {
        state.userPaused = true;
      }
    });
    video.addEventListener('play', () => {
      state.userPaused = false;
      if (!state.visible || document.hidden) pause(video);
    });
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
          synchronize(video);
        }
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
      synchronize(video);
    }
  }
  document.addEventListener('visibilitychange', () =>
    videos.forEach(synchronize),
  );
}
