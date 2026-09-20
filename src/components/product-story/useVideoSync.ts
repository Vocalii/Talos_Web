import { useEffect, type RefObject } from 'react';
import { SYNC_TOLERANCE_S } from './productStory.config';

type FrameCallbackVideo = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: () => void) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

interface VideoSyncOptions {
  primaryRef: RefObject<HTMLVideoElement | null>;
  secondaryRef: RefObject<HTMLVideoElement | null>;
  /** Only run while both videos are actually visible (the intro zone). */
  enabled: boolean;
}

/**
 * Keeps the secondary video's currentTime within SYNC_TOLERANCE_S of the
 * primary's. Runs per video frame (requestVideoFrameCallback) when supported,
 * otherwise per animation frame. Loop wrap-arounds are ignored so a video
 * that just looped isn't "corrected" backwards.
 */
export function useVideoSync({ primaryRef, secondaryRef, enabled }: VideoSyncOptions) {
  useEffect(() => {
    const primary = primaryRef.current as FrameCallbackVideo | null;
    const secondary = secondaryRef.current;
    if (!enabled || !primary || !secondary) return;

    const useFrameCallback = typeof primary.requestVideoFrameCallback === 'function';
    let handle = 0;

    const correct = () => {
      if (!primary.paused && !secondary.paused) {
        const drift = secondary.currentTime - primary.currentTime;
        const duration = primary.duration;
        const wrapped = Number.isFinite(duration) && Math.abs(drift) > duration / 2;
        if (!wrapped && Math.abs(drift) > SYNC_TOLERANCE_S) {
          secondary.currentTime = primary.currentTime;
        }
      }
      schedule();
    };

    const schedule = () => {
      handle = useFrameCallback
        ? primary.requestVideoFrameCallback!(correct)
        : requestAnimationFrame(correct);
    };

    schedule();
    return () => {
      if (useFrameCallback) primary.cancelVideoFrameCallback?.(handle);
      else cancelAnimationFrame(handle);
    };
  }, [primaryRef, secondaryRef, enabled]);
}
