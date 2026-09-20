import { motion, useReducedMotion, useTransform, type MotionValue } from 'motion/react';
import { ChevronDown } from 'lucide-react';

/** How long before the handoff the indicator finishes fading out. */
const FADE_OUT_SPAN = 0.05;

interface StoryScrollIndicatorProps {
  /** Local story progress (0–1). */
  progress: MotionValue<number>;
  /** Local progress at which the slide-up into Insights begins. */
  handoffAt: number;
}

/**
 * Slim vertical progress cue on the left edge: the fill grows as you scroll
 * and is full exactly when Insights starts sliding in, so users can see how
 * much scrolling is left. Fades in with the story, and out just before the
 * handoff.
 */
export function StoryScrollIndicator({ progress, handoffAt }: StoryScrollIndicatorProps) {
  const reducedMotion = useReducedMotion();
  const fill = useTransform(progress, [0, handoffAt], [0, 1], { clamp: true });
  const opacity = useTransform(
    progress,
    [0, 0.03, handoffAt - FADE_OUT_SPAN, handoffAt],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      style={{ opacity }}
      className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3 pointer-events-none select-none"
      aria-hidden="true"
    >
      <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40 [writing-mode:vertical-rl] rotate-180">
        Scroll
      </span>
      <div className="relative h-28 w-px bg-white/15 overflow-hidden">
        <motion.div
          style={{ scaleY: fill }}
          className="absolute inset-0 origin-top bg-white/70"
        />
      </div>
      <motion.div
        animate={reducedMotion ? undefined : { y: [0, 4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="w-3.5 h-3.5 text-white/40" />
      </motion.div>
    </motion.div>
  );
}
