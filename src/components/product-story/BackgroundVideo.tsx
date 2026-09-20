import { motion, type MotionValue } from 'motion/react';
import type { RefObject } from 'react';
import { BACKGROUND_FRAME } from './productStory.config';
import { ProductVideo } from './ProductVideo';

interface BackgroundVideoProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  src: string;
  poster?: string;
  load: boolean;
  scale: MotionValue<number>;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
  /** 0–1 black overlay that deepens as the video shrinks away. */
  dim: MotionValue<number>;
}

/**
 * Centered portrait video frame (sized by BACKGROUND_FRAME) that scales down,
 * dims and fades into the phone.
 */
export function BackgroundVideo({
  videoRef,
  src,
  poster,
  load,
  scale,
  y,
  opacity,
  dim,
}: BackgroundVideoProps) {
  return (
    <div
      className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
      aria-hidden="true"
    >
      <motion.div
        style={{
          scale,
          y,
          opacity,
          height: `min(${BACKGROUND_FRAME.heightSvh}svh, ${BACKGROUND_FRAME.maxHeightPx}px)`,
          aspectRatio: BACKGROUND_FRAME.aspectRatio,
          maxWidth: `${BACKGROUND_FRAME.maxWidthVw}vw`,
          borderRadius: BACKGROUND_FRAME.borderRadiusPx,
        }}
        className="relative overflow-hidden bg-black shadow-[0_30px_80px_rgba(0,0,0,0.7)] will-change-[transform,opacity]"
      >
        <ProductVideo videoRef={videoRef} src={src} poster={poster} load={load} />
        <motion.div style={{ opacity: dim }} className="absolute inset-0 bg-black" />
      </motion.div>
    </div>
  );
}
