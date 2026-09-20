import { useEffect, useRef, type RefObject } from 'react';
import { motion, type MotionValue } from 'motion/react';
import type { FeatureStage } from './productStory.config';
import { ProductVideo } from './ProductVideo';

interface PhoneVideoProps {
  /** Ref for stage 0's <video> (used by the intro's external playback/sync). */
  videoRef: RefObject<HTMLVideoElement | null>;
  stages: readonly FeatureStage[];
  activeStageIndex: number;
  load: boolean;
  /** Fades the whole screen video in during the intro handoff. */
  opacity: MotionValue<number>;
  /**
   * Self-managed playback: each stage's clip plays only while it is the
   * active stage and pauses otherwise (used by the features overlay). When
   * false, playback is driven externally via `videoRef` (the story intro).
   */
  playWhenActive?: boolean;
}

/** One stage's clip; plays/pauses itself when `playWhenActive` is set. */
function StageClip({
  stage,
  videoRef,
  load,
  active,
  playWhenActive,
}: {
  stage: FeatureStage;
  videoRef: RefObject<HTMLVideoElement | null>;
  load: boolean;
  active: boolean;
  playWhenActive: boolean;
}) {
  useEffect(() => {
    const video = videoRef.current;
    if (!playWhenActive || !video) return;
    if (!(active && load)) {
      video.pause();
      return;
    }
    let cancelled = false;
    const play = () => {
      if (!cancelled) video.play().catch(() => {});
    };
    if (video.readyState >= 3) play();
    else video.addEventListener('canplay', play, { once: true });
    return () => {
      cancelled = true;
      video.removeEventListener('canplay', play);
    };
  }, [videoRef, playWhenActive, active, load]);

  return (
    <ProductVideo videoRef={videoRef} src={stage.src} poster={stage.poster} load={load} />
  );
}

/**
 * The phone-screen video. Stages are stacked and crossfaded by
 * `activeStageIndex`, so adding feature clips is a config change
 * (FEATURE_STAGES / FEATURES_STAGES), not new animation code.
 */
export function PhoneVideo({
  videoRef,
  stages,
  activeStageIndex,
  load,
  opacity,
  playWhenActive = false,
}: PhoneVideoProps) {
  // One ref per stage (stage 0 uses the caller's ref for external playback).
  const extraRefs = useRef<RefObject<HTMLVideoElement | null>[]>([]);
  const refFor = (index: number) => {
    if (index === 0) return videoRef;
    if (!extraRefs.current[index]) extraRefs.current[index] = { current: null };
    return extraRefs.current[index];
  };

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 will-change-[opacity]">
      {stages.map((stage, index) => {
        const isActive = index === activeStageIndex;
        // Intro path: stage 0 always loads. Self-managed path: load the active
        // stage and its neighbours so the next clip is ready before its crossfade.
        const shouldLoad =
          load &&
          (playWhenActive ? Math.abs(index - activeStageIndex) <= 1 : isActive || index === 0);
        return (
          <motion.div
            key={stage.id}
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <StageClip
              stage={stage}
              videoRef={refFor(index)}
              load={shouldLoad}
              active={isActive}
              playWhenActive={playWhenActive}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
