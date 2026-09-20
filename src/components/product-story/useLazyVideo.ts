import { useEffect, useState, type RefObject } from 'react';
import { LAZY_ROOT_MARGIN } from './productStory.config';

/** True while the element is within LAZY_ROOT_MARGIN of the viewport. */
export function useNearViewport(ref: RefObject<HTMLElement | null>): boolean {
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setIsNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsNear(entry.isIntersecting),
      { rootMargin: LAZY_ROOT_MARGIN }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return isNear;
}

const HAVE_FUTURE_DATA = 3;

function whenReady(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= HAVE_FUTURE_DATA) return Promise.resolve();
  return new Promise((resolve) => {
    video.addEventListener('canplay', () => resolve(), { once: true });
  });
}

const safePlay = (video: HTMLVideoElement) => {
  const result = video.play();
  if (result) result.catch(() => {});
};

interface CoordinatedPlaybackOptions {
  backgroundRef: RefObject<HTMLVideoElement | null>;
  phoneRef: RefObject<HTMLVideoElement | null>;
  /** Section is near the viewport (both videos allowed to load/play). */
  isNear: boolean;
  /** Intro finished — the background video is no longer visible. */
  introDone: boolean;
  /** Reduced motion: never autoplay, posters only. */
  reducedMotion: boolean;
}

/**
 * Starts both videos together once both can play, pauses everything when the
 * section is far from the viewport, and pauses the background video once the
 * intro is complete. When the background resumes (scrolling back up) it is
 * re-aligned to the phone's time before playing.
 */
export function useCoordinatedPlayback({
  backgroundRef,
  phoneRef,
  isNear,
  introDone,
  reducedMotion,
}: CoordinatedPlaybackOptions) {
  useEffect(() => {
    // The background video is absent on compact screens (phone only).
    const bg = backgroundRef.current;
    const phone = phoneRef.current;
    if (!phone) return;

    if (reducedMotion || !isNear) {
      bg?.pause();
      phone.pause();
      return;
    }

    let cancelled = false;

    const start = async () => {
      // Phone keeps playing for the rest of the section; bg only during intro.
      if (introDone || !bg) {
        bg?.pause();
        await whenReady(phone);
        if (!cancelled) safePlay(phone);
        return;
      }
      await Promise.all([whenReady(bg), whenReady(phone)]);
      if (cancelled) return;
      // Align, then start both in the same tick.
      if (Math.abs(bg.currentTime - phone.currentTime) > 0.05) {
        bg.currentTime = phone.currentTime;
      }
      safePlay(bg);
      safePlay(phone);
    };

    void start();
    return () => {
      cancelled = true;
    };
  }, [backgroundRef, phoneRef, isNear, introDone, reducedMotion]);
}
